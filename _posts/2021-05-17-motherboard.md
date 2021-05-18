---
title: motherboard_ref.lua
tags: reason sound
layout: posts
---
Hi, this is part of ongoing process to document as I learn to create Reason Rack Extensions. In this post I am going to do an in depth look at the cogs of the motherboard_ref.lua script.

The Rack Extension SDK provides good documentation on the Motherboard (I particularly like [{ this part }]({{ site.data.links.concepts }}) of the docs), but a succint overview of the Motherboard is necessary considering it is probably the most conceptual aspect of the Rack Extension. It is the data model for the Rack Extension; it let's the system know how all the signals to and from the widgets are connected.

*abbreviated from the docs:* the Motherboard holds properties that are organized into property set objects. Some objects are built-in and defined the by the host; other are defined specifically for each Rack Extension and they are called "custom properties". The Motherboard also contains the information about input and output sockets, Midi, and automatic routing hints.

All properties in a property set object have an owner scope, which defines what is allowed to write to the property. The options are gui_owner (graphical), document_owner (patches or documents), rtc_owner (realtime_controller), rt_owner (realtime).

The property system is strictly typed: number, boolean, string, sample, BLOB, DSP Buffer, Native Object. 

*The skeleton for the motherboard_ref.lua:*
```
format_version = "3.0"

custom_properties = jbox.property_set{ ... }

midi_implementation_chart = { ... }

remote_implementation_chart = { ... }

ui_groups = { ... }

cv_inputs = { ... }

cv_outputs = { ... }

audio_inputs = { ... }

audio_outputs = { ... }

-- optional table of user samples
user_samples = { ... }

-- optional table of patterns
patterns = { ... }

-- calls to toolbox functions to configure automatic routing
```
*calls for automatic routing as noted above:*
```
jbox.add_cv_routing_target
jbox.add_mono_audio_routing_target
jbox.add_stereo_audio_routing_target
jbox.add_stereo_audio_routing_pair
jbox.add_stereo_effect_routing_hint
jbox.add_stereo_instrument_routing_hint
jbox.add_mono_instrument_routing_hint
```
*zooming into the custom_properties property set object:*
```
custom_properties = jbox.property_set{
  gui_owner = {
    properties = { ... }
  },

  document_owner = {
    properties = { ... }
  },

  rtc_owner = {
    properties = { ... }
  },

  rt_owner = {
    properties = { ... }
  }
}
```
*zooming into the properties block for each owner in custom_properties:*
```
properties = {
  my_number_property = jbox.number{ ... },
  my_boolean_property = jbox.boolean{ ... },
}
```
A property path is created by the name given to the property combined with the property set object, ie for the above example: /custom_properties/my_number_property

*zooming into the number property as an example:*
```
my_number_property = jbox.number{
  default = ... ,
  steps = ... ,
  ui_name = ... ,
  ui_type = ... ,
  persistence = ... ,
  property_tag = ... ,
}
```
Each type (number, boolean, string, sample, BLOB, DSP Buffer, Native Object) has it's own set of properties like the above example of jbox.number. I don't think its strictly necessary for me to list them all out, they can be found in the [{ scripting specifications }]({{ site.data.links.scriptingspecs }}) at length and specificity.

### Looking at the SimpleInstrument motherboard_def.lua: 

Interesting to note that there does not appear to be any gui_owner custom properties. The things that I might have expected to be under the gui_owner are under the document_owner (namely volume, frequency, sampleplay, waveform.) **Looking in the documentation this actually makes sense:** gui_owner properties are properties that are not saved in patches. And document_owner properties can be modified by GUI's widgets in addition to document/patches. Volume, freq, sampleplay, waveform are all properties that you would want to saved in patch/preset so they are document_owner scoped.

The rtc_owner contains jbox.native_object and jbox.sample calls. Making note of this for when we move onto realtime_controller.lua.

The rt_owner contains a "noteon" boolean property. Interesting that is the only property.

Moving past custom properties you see midi implementation, remote implementation, cv inputs, audio outputs, automatic routing, etc all of which are pretty logical given the instrument.

*Final thoughts: the GUI ties in quite cleanly from hdgui_2D.lua to motherboard_ref.lua through the "value" argument that specifies a "custom_property" which is then defined as a property using the strictly typed property system.*
