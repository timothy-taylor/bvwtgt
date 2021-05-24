---
title: second look rack extension realtime c++ 
tags: reason sound
layout: posts
---
Hi this is part of an ongoing process to document as I learn to create Rack Extensions for Reason. In this post I am going to continue look at the realtime c++, focusing more on the .cpp and .h files for the rack extension itself. I am going to work through the HelloWorld tutorial and the SimpleInstrument example.

#### header files
*from HelloWorld.h tutorial:*
```
#pragma once

#include "Jukebox.h"

class CHelloWorld{
    public: explicit CHelloWorld(TJBox_Float32 iSampleRate);
    public: void RenderBatch(            
        const TJBox_PropertyDiff iPropertyDiffs[],
        TJBox_UInt32 iDiffCount
    );

    private: void SetLampState(bool bLampState);
    private: void HandleNotePressed(
        const TJBox_PropertyDiff iPropertyDiffs[],
        TJBox_UInt32 iDiffCount
    );

    private: void HandleLampTurnOff();

    private: TJBox_ObjectRef fCustomProps;
    private: TJBox_ObjectRef fNoteStates;

    private: TJBox_Float32 fSampleRate;
    private: TJBox_Float64 fSecondsUntilLampTurnOff;
};
```

*from SimpleInstrument.h tutorial:*
```
#pragma once
#ifndef SIMPLEINSTRUMENTSTATE_H
#define SIMPLEINSTRUMENTSTATE_H

#include "Jukebox.h"
#include "VoicePool.h"

class CSimpleInstrument
{
    public: CSimpleInstrument();
    public: void HandleVolumeChangesAndSetVolume();
    public: void HandleCVInputChanges();
    public: void FlashNoteOnLamp();
    public: void HandleNoteOnLampTurnOff();
    public: void ResetIfRequested();
    public: void HandleNoteOnNoteOffDiffs(
        const TJBox_PropertyDiff iPropertyDiffs[], 
        TJBox_UInt32 iDiffCount
    );

    public: void RenderBatch(
        const TJBox_PropertyDiff iPropertyDiffs[], 
        TJBox_UInt32 iDiffCount
    );

    private: TJBox_ObjectRef fEnvironmentRef;
    private: TJBox_ObjectRef fTransportRef;
    private: TJBox_ObjectRef fNoteStates;

    private: TJBox_ObjectRef fAudioOutLeftObjectRef;
    private: TJBox_ObjectRef fAudioOutRightObjectRef;
    private: TJBox_PropertyRef fNoteCVInputRef;
    private: TJBox_PropertyRef fGateCVInputRef;
    private: TJBox_PropertyRef fGateConnectedCVInputRef;
    private: TJBox_PropertyRef fNoteOnPropertyRef;
    private: TJBox_PropertyRef fPitchBendPropertyRef;
    private: TJBox_PropertyRef fModWheelPropertyRef;
    private: TJBox_PropertyRef fSamplePlayRef;
    private: TJBox_PropertyRef fWaveformRef;
    private: TJBox_PropertyRef fVolumePropertyRef;
    private: TJBox_PropertyRef fFrequencyPropertyRef;
    private: TJBox_PropertyRef fSampleSoundNativeObjectRef;

    private: TJBox_Float32 fVolumeGain;
    private: TJBox_Float64 fFrequencyShift;
    private: EWaveFormType fWaveForm;
    private: TJBox_Float64 fSampleRate;

    private: TJBox_Float32 fLastVolumeGain;
    private: TJBox_Float64 fLastRequestResetCounter;
    private: TJBox_Tag fLastGateCV;
    private: TJBox_Tag fLastNoteCV;
    private: TJBox_Float64 fSecondsBeforeNoteOnTurnOff;

    private: CVoicePool fVoicePool;
};

#endif

```
notes:
* these classes don't require a ~destructor (it wouldn't be called if it was present) because they are allocated by `JBox_Export_CreateNativeObject` so memory is automatically deallocated
* the header file for the rack extension contains the class definition for that rack extension. It seems to minimally contain a class constructor and the render function:

```
Class CHelloWorld{
    public: explicit CHelloWorld(TJBox_Float32 iSampleRate);
    public: void RenderBatch(
        const TJBox_PropertyDiff iPropertyDiffs[],
        TJBox_UInt32 iDiffCount
    );

    ...
}
```

* the private accessors of the class appear to generally be made up of `TJBox_PropertyRef`s which reference property declared in the motherboard and `TJBox_ObjectRef`s which reference properties from the host

```
// from SimpleInstrument.h
private: TJBox_PropertyRef fNoteCVInputRef;
private: TJBox_PropertyRef fGateCVInputRef;
private: TJBox_PropertyRef fGateConnectedCVInputRef;
private: TJBox_PropertyRef fNoteOnPropertyRef;

// assumedly corresponds to it's motherboard_ref.lua:

rt_owner = {
    properties = {
        noteon = jbox.boolean{
            default = false,
            ui_name = jbox.ui_text("propertyname NoteOn"),
            ui_type = jbox.ui_linear({
                min=0, 
                max=1, 
                units={ {decimals=0} 
            }}),
        }
    }
}

cv_inputs = {
    note_cv = jbox.cv_input{
        ui_name = jbox.ui_text("cv input name Note")
    },
    gate_cv = jbox.cv_input{
        ui_name = jbox.ui_text("cv input name Gate")
    }
}

jbox.add_cv_routing_target{
    signal_type = "gate",
    path = "/cv_inputs/gate_cv",
    auto_route_enable = true
}
```
> *// this is made way more obvious in the .cpp haha*


* there are examples for HelloWorld tutorial and SimpleInstrument example which use either public or private accessing for conceptually similar events.

```
// example of contrast

// from SimpleInstrument
public: void FlashNoteOnLamp();
public: void HandleNoteOnLampTurnOff();
// from HelloWorld
private: void SetLampState(bool bLampState);
private: void HandleNotePressed(
    const TJBox_PropertyDiff iPropertyDiffs[],
    TJBox_UInt32 iDiffCount
);
```

> *// I see that the public definitions of are all type void.*

#### .cpp files
*the skeleton for the .cpp file:*

```
#include "HelloWorld.h"

CHelloWorld::CHelloWorld() 
{ }

void 
CHelloWorld::RenderBatch(
const TJBox_PropertyDiff iPropertyDiffs[], 
TJBox_UInt32 iDiffCount)
{ }
```

So obviously we are defining all the functions that were prototyped in the header file. I think I'm going to lightly dissect the skeleton functions of HelloWorld.cpp file here and then in the next post go further in depth with the individual functions of SimpleInstrument.cpp
```
#include HelloWorld.h

CHelloWorld::CHelloWorld(TJBox_Float32 iSampleRate)
    :
    fCustomProps(JBox_GetMotherboardObjectRef(
        "/custom_properties") 
    ),
    fNoteStates(JBox_GetMotherboardObjectRef(
        "/note_states") 
    ),
    fSampleRate(iSampleRate),
    fSecondsUntilLampTurnOff(-1.f)
{
}

...

void CHelloWorld::RenderBatch(
    const TJBox_PropertyDiff iPropertyDiffs[], 
    TJBox_UInt32 iDiffCount
)
{
    HandleNotePressed(iPropertyDiffs, iDiffCount);
    HandleLampTurnOff();
}

```
notes:
* the private variables for the HelloWorld class are all passed in the Class constructor, _not familiar with : symbol in this context, but I think I understand what it is doing through context clues._ 
* RenderBatch is iterating through the diffs (via `HandleNotePressed`) to see which one contain note on/off information and then turning on and off the lamp if appropriate.

final thoughts:
Having to brush up on c++ class syntax, but getting there. Still diving! 
