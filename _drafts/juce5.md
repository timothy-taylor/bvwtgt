---
title: processing input audio with juce
tags: juce sound
layout: posts
---
once again, our skeleton for our `MainComponent` class definition, this time with a few basic gui components included:

```
#pragma once

#include <JuceHeader.h>

class MainComponent  : public juce::AudioAppComponent
{
public:
    MainComponent()
    {
        levelSlider.setRange (0.0, 0.25);
        levelSlider.setTextBoxStyle (juce::Slider::TextBoxRight, false, 100, 20);
        levelLabel.setText ("Noise Level", juce::dontSendNotification);

        addAndMakeVisible (levelSlider);
        addAndMakeVisible (levelLabel);

        setsize(600, 100);
        setAudioChannels(2, 2);
    };

    ~MainComponent() override
    {
        shutdownAudio();
    };

    void prepareToPlay (int samplesPerBlockExpected, double sampleRate) override;
    void getNextAudioBlock (const juce::AudioSourceChannelInfo& bufferToFill) override;
    void releaseResources() override;

    void paint (juce::Graphics& g) override;
    void resized() override
    {
        levelLabel.setBounds(10, 10, 90, 20);
        levelSlider.setBounds(100, 10, getWidth() - 110, 20);
    };

private:
    juce::Slider levelSlider;
    juce::Label levelLabel;
    juce::Random random;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (MainComponent)
};
```

* to process audio input, most of the magic happens in the `getNextAudioBlock` function. We start by getting the audio channels we need by  using the `deviceManager` helper methods and interpreting the data:

```
void MainComponent::getNextAudioBlock (const juce::AudioSourceChannelInfo& bufferToFill)
{
    auto* device = deviceManager.getCurrentAudioDevice();
    // returns an AudioIODevice
    auto activeInputChannels = device->getActiveInputChannels();
    auto activeOutputChannels = device->getActiveOutputChannels();
    // returns a virtual BigInteger

    auto maxInputChannels = activeInputChannels.getHighestBit() + 1;
    auto maxOutputChannels = activeOutputChannels.getHighestBit() + 1;

    auto level = (float) levelSlider.getValue();
    // get this value from a gui slider to use in the processing later
};
```

* first we setup some defensive programming tactics to deal with channels that are out of range; both for the output Channels and the input Channels
* if everything is in range than we use get our `readPointer` and `writePointer` from our `bufferToFill` and assign them to the corresponding buffers.
* then we do the actual processing by going sample by sample and processing the input sample by multiplying by a random number and our level slider.

```
void MainComponent::getNextAudioBlock (const juce::AudioSourceChannelInfo& bufferToFill)
{
    auto* device = deviceManager.getCurrentAudioDevice();
    auto activeInputChannels = device->getActiveInputChannels();
    auto activeOutputChannels = device->getActiveOutputChannels();

    auto maxInputChannels = activeInputChannels.getHighestBit() + 1;
    auto maxOutputChannels = activeOutputChannels.getHighestBit() + 1;

    auto level = (float) levelSlider.getValue();

    for (auto channel = 0; channel < maxOutputChannels; ++channel)
    {
        if ((!activeOutputChannels[channel]) || maxInputChannels == 0)
        // BigInteger[index] returns false if index is out of range
        {
            bufferToFill.buffer->clear(channel, bufferToFill.startSample, bufferToFill.numSamples);
        } 
        else
        {
            auto actualInputChannel = channel % maxInputChannels;
            // what to do if channel is greater than our maximum channels?
            // in this case we wrap it in range
            // can also set channel > max to silence
            
            if(!activeInputChannels[channel])
            {
                bufferToFill.buffer->clear(channel, bufferToFill.startSample, bufferToFill.numSamples);
            }
            else
            {
                auto* inBuffer = bufferToFill.buffer->getReadPointer(
                    actualInputChannel,bufferToFill.startSample);
                auto* outBuffer = bufferToFill.buffer->getWritePointer(
                    channel, bufferToFill.startSample);

                for (auto sample = 0; sample < bufferToFill.numSamples; ++sample)
                {
                    outBuffer[sample] = inBuffer[sample] * random.nextFloat() * level;
                    // this is our actual processing of the input
                }
            }
        }
    }           
}
```

* this is currently not working for me
