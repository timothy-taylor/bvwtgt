---
title: first look at C++ and realtime
tags: reason sound
layout: posts
---
Hi this is part of an ongoing process to document as I learn to create Rack Extensions for Reason. In this post I am taking a look at the realtime sound rendering and the C++ code that drives it. The two main functions for this are:
```
JBox_Export_RenderRealtime() 
    // callback for audio rendering

JBox_Export_CreateNativeObject() 
    // callback for heap memory allocation
```
JBox_Export_RenderRealtime() may call all C++ functions in the [{ Jukebox API }]({{ site.data.links.cpp }}) but may not allocate or delete memory on the heap. The total time available for audio processing for the entire rack is about 1.5 milliseconds per batch. It is called continuously by the host. *todo: gain a more specific understanding of the "host", is it Reason? The Rack Extension? The Realtime engine?*

JBox_Export_CreateNativeObject() can only access data provided as input arguments, cannot have any side-effects except allocating memory, and cannot access the motherboard. Thus you can call all C++ functions in the API except for motherboard access functions. A reminder that it is invoked by the realtime_controller.lua script.

#### file structure for realtime

a Rack Extension directory seems to minimally contain: 
```
JukeboxExports.cpp
ExampleExtension.h // ie: SimpleInstrument.h
ExampleExtension.cpp // ie: SimpleInstrument.cpp
```
Other functionality may be added in the standard form of Functionality.h & Functionality.cpp in the manner of any old  c/c++ workflow

### JukeBoxExports.cpp

*skeleton for JukeboxExports.cpp:*
```
#include "Jukebox.h" 

void*
JBox_Export_CreateNativeObject(
    const char iOperation[], 
    const TJBox_Value iParams[], 
    TJBox_UInt32 iCount) 
{
     return nullptr;
}

void
JBox_Export_RenderRealtime(
    void* privateState, 
    const TJBox_PropertyDiff iPropertyDiffs[], 
    TJBox_UInt32 iDiffCount)
{ 

}
```

#### CreateNativeObject:
* iOperation[] is a string key used by realtime_controller.lua to indentify which object to create. ~~*todo: what does it look like, where does it come from?*~~
> looked it up: iOperation is passed as string in the realtime_controller.lua, see example below
* iParams[] is an array of values provided by realtime_controller.lua
* iCount is the size of the of iParams array

*excerpt from SimpleInstruments realtime_controller.lua:*
```
jbox.make_native_object_rw("Instance", {instance_id})
```
* iOperation = "Instance"
* iParams[0] = {instance_id}
* iCount = 1

These arguments are used in the CreateNativeObject for logic and flow, for example:
```
if(std::strcmp(iOperation, "This") == 0) {
    // do this
    // for example:
    JBOX_ASSERT(iCount == 1);
    TJBox_Value instanceIDValue = 
        JBox_MakeNumber(JBox_GetNumber(iParams[0]));
}
else if(std:strcmp(iOperation, "That") == 0) {
    // do that
}
```

#### RenderRealtime
* PrivateState (or iInstanceData) is the current value of the property, value represents a native object that holds the C++ state. The native object is normally created with a call to make_native_object when the instance is created.
* iPropertyDiffs is a list of properties that have changed since the last call
* iDiffCount is the size of the iPropertyDiffs area

Other notes:
* notice the syntactical similarities between RenderRealTime and CreateNativeObject arguments, essentially the same format as (int argc char argv[][]) from C syntax.
* TJBox_PropertyDiff represents a property change
```
struct TJBox_PropertyDiff {
	TJBox_Value fPreviousValue;
	TJBox_Value fCurrentValue;
	TJBox_PropertyRef fPropertyRef;
	TJBox_Tag fPropertyTag;
	TJBox_UInt16 fAtFrameIndex;
};
```
* TJBox_PropertyRef
```
struct TJBox_PropertyRef {
	TJBox_ObjectRef fObject;
	TJBox_PropertyKey fKey;
};
```
* // beginner's C/C++ sidebar:
> What is the practical difference between created a struct with one single element and creating a typedef of that single element?
// for example:
```
struct TJBox_Value {
        TJBox_UInt8 fSecret;
};
```
vs
```
typedef TJBox_UInt32 TJBox_Tag;
```

Let's take a quick peak at the SimpleInstrument example's JukeboxExport.cpp:
```
#include "Jukebox.h"
#include <cstring>
#include "SimpleInstrument.h"
#include "SampleSound.h"

void* 
JBox_Export_CreateNativeObject(
    const char iOperation[], 
    const TJBox_Value iParams[], 
    TJBox_UInt32 iCount)
{

    if(std::strcmp(iOperation, "Instance") == 0) {
        JBOX_TRACE("CreateNativeObject");
        JBOX_TRACE(iOperation);

        JBOX_ASSERT(iCount == 1);
        TJBox_Value instanceIDValue = 
            JBox_MakeNumber(JBox_GetNumber(iParams[0]));
        TJBox_Value array[1];
        array[0] = instanceIDValue;
        JBOX_TRACEVALUES("instance ID = ^0", array, 1);

        return new CSimpleInstrument();
    }
    else if(std::strcmp(iOperation, "SampleSound") == 0) {
        JBOX_TRACE("Sample sound loaded");

        JBOX_ASSERT(iCount == 1);
        return new CSampleSound(iParams[0]);
    }

    JBOX_ASSERT_MESSAGE(false, 
        "Unknown operation passed to CreateNativeObject");
    return NULL;
}

void 
JBox_Export_RenderRealtime(
    void* privateState, 
    const TJBox_PropertyDiff iPropertyDiffs[], 
    TJBox_UInt32 iDiffCount) 
{

    if(privateState == NULL) {
        return;
    }
    //JBOX_ASSERT(privateState != NULL);

    CSimpleInstrument * pi = 
        reinterpret_cast<CSimpleInstrument*>(privateState);
    pi->RenderBatch(iPropertyDiffs, iDiffCount);
}
```
Cool, we are getting into some real stuff now. Thoughts:
* "Instance" and "SampleSound" iOperation keys came from realtime_controller.lua
* SimpleInstrument and SampleSound header files will contain the definitions for `CSimpleInstrument` and `CSampleSound`
* this code is nearly 50% debugging/defensive programming. I've read about defensive programming, but it's nice to see in the wild.
* *todo: the final couple of lines of RenderRealtime are a bit opaque to me, both syntax and some of the terms. As I move forward into SimpleInstrument.cpp I will have to keep these lines in mind and revisit them.*

Alright I am going to stop here to compartmentalize this a little bit. Will be moving onto SimpleInstrument.h + SimpleInstrument.cpp next.
