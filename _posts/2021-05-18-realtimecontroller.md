---
title: spending some time with realtime_controller.lua
tags: reason sound
layout: posts
---
Hi this is part of an ongoing process to document as I learn to create Rack Extensions for Reason. In this post I am looking at the realtime_controller.lua file.

*from the [{ docs }]({{ site.data.links.scriptingspecs }}):*
>the realtime controller is responsible for serving the C++ realtime code with data.

The realtime_controller.lua file contains:
* a set of functions that configure the runtime and a list of properties that trigger these functions
* a list of sample rates that are native to the RE, and a list of sample rates for resampling
* a list of properties that should receive diffs in JBox_Export_RenderRealtime()

> *diffs represent a property change*

the skeleton for realtime_controller.lua:
```
format_version = "1.0"

rtc_bindings = { ... }

global_rtc = { ... }

sample_rate_setup = { ... }

rt_input_setup = { ... }
```

#### rtc bindings
*basic format:*
```
rtc_bindings = {
  { source = ... , dest = ... },
}
```
This table contains the list of properties (source) that the realtime controller should listen to and the function to call (dest) when these properties change. 
>**source** will contain the path to a property (either custom_properties property or environment property; ie: "/environment/system_sample_rate")

>the format for **dest** is "/global_rtc/[FUNCTION]" where [FUNCTION] is included in global_rtc.

*rtc_bindings from SimpleInstrument realtime_controller.lua:*
```
rtc_bindings = {
    { 
        source = "/environment/instance_id", 
        dest = "/global_rtc/init_instance" 
    },
    { 
        source = "/environment/system_sample_rate", 
        dest = "/global_rtc/on_samplerate_changed" 
    },
    { 
        source = "/custom_properties/sample_sound", 
        dest = "/global_rtc/on_sample_sound_progress" 
    },
}
```
*comments taken out from the above:*
>Here we set up changes to properties and the "event" callback function that will be called. Note that there WILL be an initial call for these properties when initializing a device. Note that all RTC scripts are completely run before the first call to RenderRealtime.

#### global_rtc
*basic format:*
```
global_rtc = {
  
  My_lua_function = function(source_property_path, 
        source_property_value)
    ...
  end,

  ...
}
```

rtc_bindings & global_rtc are a pair working together. Any "dest" in rtc_bindings should have its equalivent lua function in global_rtc

*global_rtc from SimpleInstrument:*
![SimpleInstrumentGlobalRTC](/uploads/blog/globalrtc.png)
*I'm not sure if this is a good idea (screenshots), but I think syntax highlighting makes a big difference for code like this, so probably not the last time I do this.*

Notes on global_rtc:
* init_instance; interesting that it says we can skip this altogether and use the default native object creation from motherboard_def. What are the advantages and disadvantages?

```
native_obj_ref jbox.make_native_object_rw(
  string operation,
  table arguments )
```
>**make_native_object_rw** creates a mutable (read/write) native object. Calling this function will generate a call to the corresponding JBox_Export_CreateNativeObject() C++ function. 

```
void jbox.store_property( string path, any_type value )
```
>**store_property** stores a value in a property on the motherboard, path format "/custom_properties/myProperty"; seems like most global_rtc functions finish with this which makes sense, you are storing away the value on the motherboard until something changes.

```
void jbox.trace( string string )
```
>**trace** is a debugging tool that writes a string to the debugging log.

```
sample_ref jbox.load_sample_async( string sample )
```
>**load_sample_async** loads a sample without blocking (may return before the sample is fully loaded.) The context in which it used in SimpleInstrument is interesting: it is being triggered by a sample rate change at which point it loads the correct version of the sample.

```
table jbox.get_sample_info( sample_ref sample )
```
>**get_sample_info** returns a lua table with frame_count, resident_count(?), channels, sample_rate, state. The context in which it used here is: using state as a return call to know whether the sample is loaded correctly or not. State returns 0 if there is an error or the reference is nil, 1 if the sample is partially loaded, and 2 if the sample is fully loaded.

```
native_obj_ref jbox.make_native_object_ro(
  string operation,
  table arguments )
```
>**make_native_object_ro** creates an immutable (read only) native object. Like the mutable version it calls its corresponding C++ function. Immutable objects cannot be written to in JBox_Export_RenderRealtime() while their mutable counterparts can. Here it used to simply load a sample, a read-only activity.

Once again, each of these lua functions finishes with a **store_property** call.

#### sample_rate_setup
*basic format:*
```
sample_rate_setup = {
  native = {
    ...
  },
  converted = {
    ...
  }
}
```
All sample rates must exist in either native or converted, but not both. *todo: understand the impact of native vs converted / when to use converted*

*from SimpleInstrument:*
```
sample_rate_setup = {
    native = {
        22050,
        44100,
        48000,
        88200,
        96000,
        192000
    },
}
```

#### rt_input_setup
We must declare which properties to receive notifications for (as property diffs) in the Realtime code. 

*in other words: __We define which external signals we send to the C++ realtime engine.__*

*basic format:*
```
rt_input_setup = {
  notify = {
    ...
  }
}
```
*common example and what is used SimpleInstrument:*
```
rt_input_setup = {
  notify = {
    "/note_states/*",
  }
}
```
The wilcard * specifies that an entire property set should receive notifications; an initial diff will be generated for all properties when an instance is created (those initial diffs will be the default values of the properties)

#### Final thoughts
We give the realtime_controller rtc_bindings in the form of properties from custom_properties (the motherboard_ref) or from the environment (*todo: more on these environment properties*) which are then bound to lua functions we write in the global_rtc. These functions are triggered anytime one of the bound properties changes. 

I'm interested in knowing the underlying conventions for the native objects. It seems that the lua Native Object property is the data returned from the JBox_Export_CreateNativeObject() in the C++.
> *__quick sidebar dive in the C++ API docs__* Native objects are ordinary C/C++ data structures. During the function call you can allocate memory with malloc, new, stl containers, etc. All these allocations are stored inside the native object and can refer to eachother. There must be not pointers pointing outside of the native object's allocation. Basically, it's just normal data with a nice tight scope.

Should be noted that the lua functions you write in global_rtc seem to generally be made up of functions in the [{ lua toolbox }]({{ site.data.links.toolbox }}) combined with local variables for syntactical convenience.

On one hand the rt_input_setup seems straight forward, but simple things like this often get overlooked. I'll be keeping my eye on this as I move from the SimpleInstrument style example to something more complex.
