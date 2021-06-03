---
title: plug-ins with juce basics
tags: juce sound
layout: posts
---
#### debrief / to summarize
The Juce plugin realtime code relies on two functions: `prepareToPlay` and `processBlock`. 

In `prepareToPlay` you will `prepare()` your `processorChain` by passing it a instance of the `ProcessSpec` object. You will then update any parameters and coefficients. The basic format is:

```
void 
[Project]AudioProcessor::
prepareToPlay (
double sampleRate, 
int samplesPerBlock
)
{
    juce::dsp::ProcessSpec spec;
    spec.maximumBlockSize = samplesPerBlock;
    spec.numChannels = 1;
    spec.sampleRate = sampleRate;

    leftProcessorChain.prepare(spec);
    rightProcessorChain.prepare(spec);

    ...

    // update ProcessorChain parameters and coefficients

    ...
}
```

In `processBlock` you create an instance of ScopedNoDenormals to ensure you aren't using unnecessary CPU time and clear your buffer. You will then want to update any parameters or coefficients (like in prepareToPlay) before creating an `AudioBlock` that you pass your `buffer` to. You can then split that `block` into seperate channel blocks using `block.getSingleChannelBlock()` and then create your `ProcessContext` instance with that `block`. And then finally `process()` your `processorChain` by passing it that `ProcessContext` instance. The basic format is:
```
void 
[Project]AudioProcessor::
processBlock (
juce::AudioBuffer<float>& buffer, 
juce::MidiBuffer& midiMessages
)
{
    juce::ScopedNoDenormals noDenormals;
    auto InChannels  = getTotalNumInputChannels();
    auto OutChannels = getTotalNumOutputChannels();

    for (auto i = InChannels; i < OutChannels; ++i)
        buffer.clear (i, 0, buffer.getNumSamples());

    ...
    // update ProcessorChain parameters and coefficients
    ...

    juce::dsp::AudioBlock<float> block(buffer);

    auto leftBlock = block.getSingleChannelBlock(0);
    auto rightBlock = block.getSingleChannelBlock(1);

    juce::dsp::ProcessContextReplacing<float> 
        leftContext(leftBlock);
    juce::dsp::ProcessContextReplacing<float> 
        rightContext(rightBlock);

    leftProcessorChain.process(leftContext);
    rightProcessorChain.process(rightContext);
}
```

////

*I stumbled across a new yt video "learn modern c++ by building an audio plugin with juce framework", and, considering this basically exactly what I am attempting to do with Reason, I am going to dive into this real quick without thinking too much about it. I hadn't really thought about Juce as an option for this portfolio project (I had looked at it last year and gotten overwhelmed), but I've come a long when since then, learned alot, and believe I can tackle this. I like the option of creating a more "neutral" plugin, aka something that will run on any DAW. So we'll see. Once again, it is important for my own learning to kind of break things down, pull apart the threads to see exactly how things connect. It is particularly important with these kind of frameworks with tons of built in functionality.*

#### gui parameters

We are going to make child components to represent the knobs/parameters

*in PluginProcessor.h, add as public accessor:*

```
juce::AudioProcessorValueTreeState 
apvts{
AudioProcessor &processorToConnectTo,
UndoManager *undoManagerToUse,
const Indentifier &valueTreeType,
ParameterLayout parameterLayout};
```
AudioProccessorValueTreeState(APVTS) will sync parameters between GUI knobs and DSP variables. The ParameterLayout param requires a function that will pass all the parameters to as an argument. So we declare the prototype of this in this header file above the APVTS and pass it along with the other arguments). *c++ todo: learn why these arg/params are in brackets instead of parantheses*

```
static juce::AudioProcessorValueTreeState::ParameterLayout
    createParameterLayout();

juce::AudioProcessorValueTreeState 
apvts{
*this,
nullptr, // no undo mananger
"Parameters",
createParameterLayout()};
```
*in PluginProcessor.cpp, lets define the function at the bottom just above make new instance:*
```
juce::AudioProcessorValueTreeState::ParameterLayout
    SimpleEQAudioProcessor::createParameterLayout()
{
    juce::AudioProcessorValueTreeState::ParameterLayout layout;

    layout.add(std::make_unique<juce::AudioParameterFloat>(
        "LowFreq Cut", 
        "LowFreq Cut", 
        juce::NormalisableRange<float>(20.f, 20000.f, 1.f, 0.25f), 
        20.f
    ));

    return layout;
}
```
This is creating the lowcut parameter: giving it a name, a range, and a default value. You can duplicate layout.add and change the name ("HiFreq Cut") and default value (20000.f)

*Add a Peak Freq with gain and quality parameter to this function:*
```
layout.add(std::make_unique<juce::AudioParameterFloat>(
    "Peak Freq", 
    "Peak Freq", 
    juce::NormalisableRange<float>(20.f, 20000.f, 1.f, 0.25f), 
    750.f
));

layout.add(std::make_unique<juce::AudioParameterFloat>(
    "Peak Gain", 
    "Peak Gain", 
    juce::NormalisableRange<float>(-24.f, 24.f, 0.5f, 1.f), 
    0.0f
));

layout.add(std::make_unique<juce::AudioParameterFloat>(
    "Peak Quality", 
    "Peak Quality", 
    juce::NormalisableRange<float>(0.1f, 10.f, 0.05f, 1.f), 
    1.f
));

```
So at this point it's pretty obvious how this works, declare a layout. Add unique parameters to the layout: defining name, useable range (using the normalisablerange built in function), and default value. Return that layout. 

*Let's add cutoff slopes to low and high cuts:*
```
juce::StringArray slopeArray;
for(int i = 0; i < 4; i++){
    juce::String str;
    str << ((i*12)+12); 12,24,36,48
    str << "db/Oct";
    slopeArray.add(str);
}

layout.add(std::make_unique<juce::AudioParameterChoice>(
    "LowCut Slope", 
    "LowCut Slope", 
    slopeArray, 
    0
));
layout.add(std::make_unique<juce::AudioParameterChoice>(
    "HighCut Slope", 
    "HighCut Slope", 
    slopeArray, 
    0
));
```
This is using the AudioParameterChoice builtin which must be given an array of strings.

So at this point we have all our parameters. But there is no GUI defined. We can change the createEditor function to:
```
juce::AudioProcessorEditor* SimpleEQAudioProcessor::createEditor()
{
    // return new SimpleEQAudioProcessorEditor(*this);
    return new juce::GenericAudioProcessorEditor(*this);
}
```
This will give us a generic GUI layout of what our parameters. Build and run in xcode.

#### dsp

open your project in projucer; go to modules -> add a module -> global JUCE modules path -> juce_dsp; save and export xcode;

unless declared in the documentation, the functions in the juce::dsp:: namespace process mono audio paths. This namespace is full of meta-programming, so let's create aliases in preprocessor.h private accessors to make it more legible for ourselves.
```
private:
    using Filter = 
        juce::dsp::IIR::Filter<float>;

    using CutFilter = 
        juce::dsp::ProcessorChain<Filter, Filter, Filter, Filter>;

    using MonoChain = 
        juce::dsp::ProcessorChain<CutFilter, Filter, CutFilter>;
            // represents the para eq: low cut, peak, high cut

    MonoChain leftChain, rightChain;
            // create two instances;
```
The concept of ProcessorChain is what it sounds like, you can chain together processes. Pretty cool.

*in PluginProcessor.cpp:*
```
void SimpleEQAudioProcessor::
prepareToPlay (
double sampleRate, 
int samplesPerBlock
)
{
    juce::dsp::ProcessSpec spec;
    spec.maximumBlockSize = samplesPerBlock;
    spec.numChannels = 1;
    spec.sampleRate = sampleRate;

    leftChain.prepare(spec);
    rightChain.prepare(spec);
}
```
a ProcessChain requires a Context be passed to it to navigate through the chain.
```
void SimpleEQAudioProcessor::
processBlock (
juce::AudioBuffer<float>& buffer, 
juce::MidiBuffer& midiMessages
)
{
    juce::ScopedNoDenormals noDenormals;

    auto totalInputCh = 
        getTotalNumInputChannels();
    auto totalOutputCh = 
        getTotalNumOutputChannels();

    for (auto i = totalInputCh; i < totalOutputCh; ++i)
        buffer.clear (i, 0, buffer.getNumSamples());

    juce::dsp::AudioBlock<float> block(buffer);
    auto leftBlock = block.getSingleChannelBlock(0);
    auto rightBlock = block.getSingleChannelBlock(1);

    juce::dsp::ProcessingContextReplacing<float> 
        leftContext(leftBlock);
    juce::dsp::ProcessingContextReplacing<float> 
        rightContext(rightBlock);

    leftChain.process(leftContext);
    rightChain.process(rightContext);

}
```

So we created two instances of chain of filters and we prepared those chains according to spec. We made an audio block out of our buffer and seperated it into two mono audio blocks. Using those audio blocks we created "contexts" that will move through the ProcessorChain and processed our chains with it.

> *We need create an AudioHost; go to /JUCE/extras/AudioPluginHost/; open .jucer file, save to xcode: build. Go to Builds/OSX/debug/ and open audioplugin host app.*

Go back to the project and change the Scheme to "all" and build. Return to AudioPluginHost and go to Edit The List of Available Plugins under options. Click options on that window and click scan for new or updated vst3 plugins and audio units.  We can now right click and find our plug in. Connect inputs and outputs as needed. We can make it so the AudioPlugInHost automatically runs when the file us built and ran in xcode. Change scheme to VST3, edit Scheme change the executable to AudioPlugInHost.app.

Now we need to connect our parameters to the DSP, let's start by making a struct for our parameter settings:
*in PluginProcessor.h at the top:*
```
struct ChainSettings
{
    float peakFreq {0}, peakGainInDecibels{0}, peakQuality{1.f};
    float lowCutFreq{0}, highCutFreq{0};
    int lowCutSlope{0}, highCutSlope{0};
};

ChainSettings getChainSettings(
    juce::AudioProcessorValueTreeState& apvts
);
```
*now define the getChainSettings function that we prototyped in the header:*
```
ChainSettings 
getChainSettings(
juce::AudioProcessorValueTreeState& apvts
)
{
    ChainSettings settings;

    settings.lowCutFreq = 
        apvts.getRawParameterValue("LowFreq Cut")->load();
    settings.highCutFreq = 
        apvts.getRawParameterValue("HighFreq Cut")->load();
    settings.peakFreq = 
        apvts.getRawParameterValue("Peak Freq")->load();
    settings.peakGainInDecibels = 
        apvts.getRawParameterValue("Peak Gain")->load();
    settings.peakQuality = 
        apvts.getRawParameterValue("Peak Quality")->load();
    settings.lowCutSlope = 
        apvts.getRawParameterValue("LowCut Slope")->load();
    settings.highCutSlope = 
        apvts.getRawParameterValue("HighCut Slope")->load();

    return settings;
}
```
*we can now apply these settings in the bottom of preparetoPlay function:*
```
...
auto chainSettings = getChainSettings(apvts);
auto peakCoefficients = 
    juce::dsp::IIR::Coefficients<float>::makePeakFilter(
        sampleRate, 
        chainSettings.peakFreq, 
        chainSettings.peakQuality, 
        juce::Decibels::decibelsToGain(
            chainSettings.peakGainInDecibels)
    );

*leftChain.get<ChainPositions::Peak>().coefficients = 
    *peakCoefficients;
*rightChain.get<ChainPositions::Peak>().coefficients = 
    *peakCoefficients;
```
*lets create an enum at the bottom of our headerfile to store the position in the chain so we can use the above get ChainPositions code:*
```
enum ChainPositions
    {
        LowCut,
        Peak,
        Highcut
    };
```
You always want to update your parameters before you process audio so in the ProcessBlock code after the buffer is cleared and before new dsp stuff we can put basically the same functionality that is in prepare to play because we want to do the same thing just in realtime; only need to change sampleRate to getSampleRate():
```
auto chainSettings = getChainSettings(apvts);
auto peakCoefficients = 
    juce::dsp::IIR::Coefficients<float>::makePeakFilter(
        getSampleRate(), 
        chainSettings.peakFreq, 
        chainSettings.peakQuality, 
        juce::Decibels::decibelsToGain(
            chainSettings.peakGainInDecibels)
    );  

*leftChain.get<ChainPositions::Peak>().coefficients = 
    *peakCoefficients;
*rightChain.get<ChainPositions::Peak>().coefficients = 
    *peakCoefficients;
```

The Peak band is now officially working! So the prepareToPlay function is like a preparatory stage and the processBlock is the realtime processing.

*Let's define another enum with for our slope settings at the top of the headerfile and change the struct below it to reflect this:*
```
enum Slope
{
    Slope_12,
    Slope_24,
    Slope_36,
    Slope_48
};

struct ChainSettings
{
    float peakFreq { 0 };
    float peakGainInDecibels{ 0 };
    float peakQuality{1.f};
    float lowCutFreq{ 0 };
    float highCutFreq{ 0 };
    Slope lowCutSlope{ Slope::Slope_12 };
    Slope highCutSlope{ Slope::Slope_12 };
};
```
*and in getChainSettings() we cast our Slope parameter to this new enum type:*
```
...
settings.lowCutSlope = static_cast<Slope>(
    apvts.getRawParameterValue("LowCut Slope")->load()
);
settings.highCutSlope = static_cast<Slope>(
    apvts.getRawParameterValue("HighCut Slope")->load()
);
```
and then we apply our parameter settings and get our coefficients for the low cut; seems like this could probably be done with for loops to make it more DRY, but whatever.
```
...
auto cutCoefficients = juce::dsp::FilterDesign<float>::
    designIIRHighpassHighOrderButterworthMethod(
        chainSettings.lowCutFreq, 
        sampleRate, 
        (chainSettings.lowCutSlope + 1) * 2
);

auto& leftLowCut = leftChannel.get<ChainPositions::LowCut>();

leftLowCut.setBypassed<0>(true);
leftLowCut.setBypassed<1>(true);
leftLowCut.setBypassed<2>(true);
leftLowCut.setBypassed<3>(true);

switch( chainSettings.lowCutSlope )
{
    case Slope_12:
    {
        *leftLowCut.get<0>().coefficients = *cutCoefficients[0];
        leftLowCut.setBypassed<0>(false);
        break;
    }
    case Slope_24:
        *leftLowCut.get<0>().coefficients = *cutCoefficients[0];
        leftLowCut.setBypassed<0>(false);
        *leftLowCut.get<1>().coefficients = *cutCoefficients[1];
        leftLowCut.setBypassed<1>(false);
        break;
    case Slope_36:
        *leftLowCut.get<0>().coefficients = *cutCoefficients[0];
        leftLowCut.setBypassed<0>(false);
        *leftLowCut.get<1>().coefficients = *cutCoefficients[1];
        leftLowCut.setBypassed<1>(false);
        *leftLowCut.get<2>().coefficients = *cutCoefficients[2];
        leftLowCut.setBypassed<2>(false);
        break;
    case Slope_48:
        *leftLowCut.get<0>().coefficients = *cutCoefficients[0];
        leftLowCut.setBypassed<0>(false);
        *leftLowCut.get<1>().coefficients = *cutCoefficients[1];
        leftLowCut.setBypassed<1>(false);
        *leftLowCut.get<2>().coefficients = *cutCoefficients[2];
        leftLowCut.setBypassed<2>(false);
        *leftLowCut.get<3>().coefficients = *cutCoefficients[3];
        leftLowCut.setBypassed<3>(false);
        break;
}
```
duplicate this for the right chain. This is in both prepareToPlay and processBlock function just like Peak filter. Great the hipass is working!

Time to refactor

*let's add the prototype for the function and create some helpers to work with the coefficients in private accessor header file:*
```
void updatePeakFilter(const ChainSettings& chainSettings);
using Coefficients = Filter::CoefficientsPtr;
static void updateCoefficients(
    Coefficients& old, 
    const Coefficients& replacement
);
```
and then add the function below the updatePeakFilter function:
```
void 
SimpleEQAudioProcessor::
updateCoefficients(
Coefficients &old, 
const Coefficients &replacement
)
{
    *old = *replacement;
}
```

replace the peak filter functionality in prepareToPlay and processBlock with `updatePeakFilter(chainSettings);`
```
void 
SimpleEQAudioProcessor::
updatePeakFilter(
const ChainSettings& chainSettings
)
{
    auto peakCoefficients = juce::dsp::IIR::Coefficients<float>::
        makePeakFilter(
            getSampleRate(), 
            chainSettings.peakFreq, 
            chainSettings.peakQuality, 
            juce::Decibels::decibelsToGain(
                chainSettings.peakGainInDecibels
            )
    );
    
    updateCoefficients(
        leftChannel.get<ChainPositions::Peak>().coefficients, 
        peakCoefficients
    );
    updateCoefficients(
        rightChannel.get<ChainPositions::Peak>().coefficients, 
        peakCoefficients
    );
}
```
let's refactor the cut filter using this cool template feature of c++ in the private accessor part of the headerfile:
```
template<typename ChainType, typename CoefficientType>
void updateCutFilter(
                     ChainType& leftLowCut,
                     const CoefficientType& cutCoefficients,
                     const Slope& lowCutSlope)
{
    leftLowCut.template setBypassed<0>(true);
    leftLowCut.template setBypassed<1>(true);
    leftLowCut.template setBypassed<2>(true);
    leftLowCut.template setBypassed<3>(true);

    switch( lowCutSlope )
    {
        case Slope_12:
        {
            *leftLowCut.template get<0>().coefficients = 
                *cutCoefficients[0];
            leftLowCut.template setBypassed<0>(false);
            break;
        }
        case Slope_24:
            *leftLowCut.template get<0>().coefficients = 
                *cutCoefficients[0];
            leftLowCut.template setBypassed<0>(false);
            *leftLowCut.template get<1>().coefficients = 
                *cutCoefficients[1];
            leftLowCut.template setBypassed<1>(false);
            break;
        case Slope_36:
            *leftLowCut.template get<0>().coefficients = 
                *cutCoefficients[0];
            leftLowCut.template setBypassed<0>(false);
            *leftLowCut.template get<1>().coefficients = 
                *cutCoefficients[1];
            leftLowCut.template setBypassed<1>(false);
            *leftLowCut.template get<2>().coefficients = 
                *cutCoefficients[2];
            leftLowCut.template setBypassed<2>(false);
            break;
        case Slope_48:
            *leftLowCut.template get<0>().coefficients = 
                *cutCoefficients[0];
            leftLowCut.template setBypassed<0>(false);
            *leftLowCut.template get<1>().coefficients = 
                *cutCoefficients[1];
            leftLowCut.template setBypassed<1>(false);
            *leftLowCut.template get<2>().coefficients = 
                *cutCoefficients[2];
            leftLowCut.template setBypassed<2>(false);
            *leftLowCut.template get<3>().coefficients = 
                *cutCoefficients[3];
            leftLowCut.template setBypassed<3>(false);
            break;
    }
}
```
and then call it in process block and prepare to play:
```
updateCutFilter(
    leftLowCut, 
    cutCoefficients, 
    chainSettings.lowCutSlope
);
updateCutFilter(
    rightLowCut, 
    cutCoefficients, 
    chainSettings.lowCutSlope
);
```
refactor our switch statement to leverage case pass-through and add a helper function:
```
template<int Index, typename ChainType, typename CoefficientType>
void 
update(
ChainType& chain, 
const CoefficientType& coefficients)
{
    updateCoefficients(
        chain.template get<Index>().coefficients, 
        coefficients[Index]);
    chain.template setBypassed<Index>(false);
}
```
```
switch( lowCutSlope )
{
    case Slope_48:
    {
        update<3>(chain, cutCoefficients);
    }
    case Slope_36:
    {
        update<2>(chain, cutCoefficients);
    }
    case Slope_24:
    {
        update<1>(chain, cutCoefficients);
    }
    case Slope_12:
    {
        update<0>(chain, cutCoefficients); 
    }
}
```
now we can add the highCut filter by basically duplicating what we did for the lowCut, so it looks like this in processblock and preparetoplay:
```
auto lowCutCoefficients = 
    juce::dsp::FilterDesign<float>::
        designIIRHighpassHighOrderButterworthMethod(
            chainSettings.lowCutFreq, 
            sampleRate, 
            (chainSettings.lowCutSlope + 1) * 2
        );

auto& leftLowCut = leftChannel.get<ChainPositions::LowCut>();
auto& rightLowCut = rightChannel.get<ChainPositions::LowCut>();

updateCutFilter(
    leftLowCut, 
    lowCutCoefficients, 
    chainSettings.lowCutSlope
);
updateCutFilter(
    rightLowCut, 
    lowCutCoefficients, 
    chainSettings.lowCutSlope
);

auto highCutCoefficients = 
    juce::dsp::FilterDesign<float>::
    designIIRLowpassHighOrderButterworthMethod(
        chainSettings.highCutFreq, 
        sampleRate, 
        (chainSettings.highCutSlope + 1) * 2
    );

auto& leftHighCut = leftChannel.get<ChainPositions::LowCut>();
auto& rightHighCut = rightChannel.get<ChainPositions::LowCut>();

updateCutFilter(
    leftHighCut, 
    highCutCoefficients, 
    chainSettings.highCutSlope
);
updateCutFilter(
    rightHighCut, 
    highCutCoefficients, 
    chainSettings.highCutSlope
);
```

