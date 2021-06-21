---
title: refactoring to wavetable lookup oscillator
tags: juce sound
layout: posts
---
A wavetable lookup oscillator is a more efficient oscillator implementation than using the std::sin or other algorithms because it doesn't have to generate the values, it simply grabs them from a pre-filled data table. So let's try to refactor our sine generator from our application to be a wavetable oscillator.

Let's turn our sine generator code into its own class first:
```
class SineOscillator
{
public:
    SineOscillator() {}
    void setFrequency (float frequency, float sampleRate);
    
    forcedinline void updateAngle() noexcept
    {
        currentAngle += angleDelta;
        if (currentAngle >= juce::MathConstants<float>::twoPi)
            currentAngle -= juce::MathConstants<float>::twoPi;
    }

    forcedinline float getNextSample() noexcept
    {
        auto currentSample = std::sin (currentAngle);
        updateAngle();
        return currentSample;
    }
    
private:
    float currentAngle = 0.0f;
    float angleDelta = 0.0f;
}
```

and define setFreq function:
```
void SineOscillator::
setFrequency(float frequency, float sampleRate)
{
    auto cyclesPerSample = 
        frequency / sampleRate;
    angleDelta = 
        cyclesPerSample * juce::MathConstants<float>::twoPi;
}
```
We are wrapping the angle around 2pi this time which seems like a good idea. We are going to change our MainComponent to use this class instead of initializing its own private member variables. Let's add some cpu usage labels as well:
```
private:
...
    juce::Label cpuUsageLabel;
    juce::Label cpuUsageText;

    float sineLevel = 0.0f;
    juce::OwnedArray<SineOscillator> oscillators;
```

We are going to add another class inheritance for the MainComponent (timer class), so that we can use the timer in our CPU usage collection.
```
class MainComponent  : 
public juce::AudioAppComponent,
public juce::Timer
```
and add the CPU usage labels to our MainComponent:
```
cpuUsageLabel.setText ("CPU Usage", juce::dontSendNotification);
cpuUsageText.setJustificationType (juce::Justification::right);
addAndMakeVisible (cpuUsageLabel);
addAndMakeVisible (cpuUsageText);

// at the end

startTimer (50);

```

add CPU usage labels to `resized()`, and make sure to push all of our y values for everything else =+30 so these will be at the top:
```
cpuUsageLabel.setBounds (10, 10, getWidth() - 20, 20);
cpuUsageText .setBounds (10, 10, getWidth() - 20, 20);
```

and add a function for our Timer:
```
void timerCallback() override
{
    auto cpu = 
        deviceManager.getCpuUsage() * 100;
    cpuUsageText.setText (
        juce::String (cpu, 6) + " %", 
        juce::dontSendNotification
    );
}
```
now let's update `prepareToPlay`:
```
void MainComponent::
prepareToPlay (
int samplesPerBlockExpected, 
double sampleRate
)
{
    currentSampleRate = sampleRate;
    auto numberOfOscillators = 3;

    for (auto i = 0; i < numberOfOscillators; ++i)
    {
        auto* oscillator = new SineOscillator();

        auto midiNote = 
            juce::Random::getSystemRandom().nextDouble() 
                * 36.0 + currentFrequency;
        auto frequency = 
            440.0 * pow(2.0, (midiNote - 69.0) / 12.0);
        oscillator->setFrequency(
            (float) frequency, 
            (float) sampleRate
        );

        oscillators.add (oscillator);
    }

    sineLevel = sineLevel / (float) numberOfOscillators;
    noiseLevel = noiseLevel / (float) numberOfOscillators;
}
```
This will create 3 sine wave oscillators randomly centered around the base frequency of the sine freq slider.

*Updated getNextAudioBlock accordingly:*
![getNextAudioBlock Sine Class](/uploads/blog/sineclass.png)

We call oscillator->getNextSample() and we += the buffer since we are stacking 3 oscillators on top of eachother. (I adjusted the freq slider range to 55.0 - 200.0 to make the random values slightly more palatable. At this point where are basically back we started with a much more flexible class based approach, but still using the std::sin mathematical function on a per sample basis.

To create wavetable lookup functionality we first create an `AudioSampleBuffer` that will hold our waveform. *In MainComponent:*
```
private:
...
const unsigned int tableSize = 1 << 7;
juce::AudioSampleBuffer sineTable;
...
```
The tableSize is equal to 128 samples using bit shift operators. And then actual function:
```
void MainComponent::
createWavetable()
{
    sineTable.setSize (1, (int) tableSize);
    auto* samples = sineTable.getWritePointer (0);

    auto angleDelta = 
        juce::MathConstants<double>::twoPi 
            / (double) (tableSize - 1);
    auto currentAngle = 0.0;

    for (unsigned int i = 0; i < tableSize; ++i)
    {
        auto sample = std::sin (currentAngle);
        samples[i] = (float) sample;
        currentAngle += angleDelta;
    }
}
```
Straightforward enough, we are going sample by sample through the sineTable buffer and filling it with the appropriate values. This function is called in the constructor.

Let's change our SineOscillator object to WavetableOscillator in the class definition and prepareToPlay:
```
juce::OwnedArray<WavetableOscillator> oscillators;
```
and
```
auto* oscillator = new WavetableOscillator(SineTable);
```
And let's create a new Wavetable class to go along:
```
class WavetableOscillator
{
public:
    WavetableOscillator(
        const juce::AudioSampleBuffer& wavetableToUse
    )
    : wavetable (wavetableToUse)
    {
        jassert (wavetable.getNumChannels() == 1);
    }

    void setFrequency(float frequency, float sampleRate);

private:
    const juce::AudioSampleBuffer& wavetable;
    float currentIndex = 0.0f;
    float tableDelta = 0.0f;
};
```
and in our setFrequency we are using the size of the wavetable instead of 2pi.
```
void WavetableOscillator::
setFrequency(
float frequency, 
float sampleRate
)
{
    auto tableSizeOverSampleRate = 
        (float) wavetable.getNumSamples() / sampleRate;
    tableDelta = 
        frequency * tableSizeOverSampleRate;
}
```
create a getNextSample function for this new class
```
forcedinline float 
getNextSample() noexcept
    {
        auto tableSize = 
            (unsigned int) wavetable.getNumSamples();

        auto index0 = 
            (unsigned int) currentIndex;
        auto index1 = 
            index0 == (tableSize - 1) ? 
                (unsigned int) 0 : index0 + 1;

        auto frac = currentIndex - (float) index0;

        auto* table = wavetable.getReadPointer (0);
        auto value0 = table[index0];
        auto value1 = table[index1];

        auto currentSample = value0 + frac * (value1 - value0);

        if ((currentIndex += tableDelta) > (float) tableSize)
            currentIndex -= (float) tableSize;

        return currentSample;
    }
```
so we've basically rewritten the functions we had in the SineOscillator class. getNextSample in the WavetableOscillator class is using interpolation between values to make sure we get the right values. The interpolation value is a fraction between the two indices calculated by subtracting the actual current sample by the truncated lower sample. This should give us a value between 0 and 1. We read the wavetable buffer and get two values and then use the standard interpolation formula to get the currentSample. 

Now we should be able to delete the SineOscillator class, and be back to where we were, but with wavetable lookup!

We can optimize this a bit and improve the way the wavetable wraps on itself. We will shift the computational load from the processing call to the createWavetable function. First we create a `tableSize` variable to hold the resolution of the wavetable - 1.
```
class WavetableOscillator
{
public:
    WavetableOscillator (
        const juce::AudioSampleBuffer& wavetableToUse
    )
        : wavetable (wavetableToUse),
          tableSize (wavetable.getNumSamples() - 1)
    {
        jassert (wavetable.getNumChannels() == 1);
    }
...

private:
...
const int tableSize;
...
```
We can change the `setFrequency` function to use this variable instead of calling the helper function:
```
auto tableSizeOverSampleRate = 
    (float) tableSize / sampleRate;
tableDelta = 
    frequency * tableSizeOverSampleRate;
```
and then in the `createWavetable` function we change the `sineTable.setSize` to tableSize + 1; and set the last sample in the table to the first (since they are already the same thing):
```
void createWavetable()
{
    sineTable.setSize (1, (int) tableSize + 1);
    auto* samples = sineTable.getWritePointer (0);

    ...

    samples[tableSize] = samples[0];
}
```
*this is an interesting move that I understand conceptually, but not quite technically.*

In our `createWavetable` function we can explicitly set harmonics which is cool:
![Harmonic Wavetable](/uploads/blog/harmonicwave.png)

* 2 errors that I didn't catch until I tried to build, need to set samples[i] to be += instead of = since we are looping over it multiple times:
```
samples[i] += (float) sample * harmonicWeights[harmonic];
```

* and we need to multiple our angleDelta by our current harmonic
```
auto angleDelta =
    juce::MathConstants<double>::twoPi / (double) (tableSize - 1) 
        * harmonics[harmonic];
```

This obviously shows the flexibility of this approach, the ability to stack sines waves like this just through a for loop is very cool. We can create square waves, saw waves, triangle waves, etc as long as the first sample matches the last sample.

C++ things I would like to work on after this:
* the syntax for WavetableOscillator class construction with `: wavetable(), tableSize()`
* a better understanding of inline functions; forcedinline appears to be a juce thing

