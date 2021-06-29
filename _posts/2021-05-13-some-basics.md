---
title: some rack extension structural basics
tags: reason sound
layout: posts
---
Hi, this is part of ongoing process to document as I learn to create Reason Rack Extensions. In this post I am going to do high level overview of a Rack Extension starting from an empty directory /project-dir/ without diving into any code, but noting how different parts are connected.

#### The main parts of a Rack Extension are the GUI, the Data Model, and the Realtime Processing Code.

for specifics, check the [{ docs }]({{ site.data.links.readme }})

### The GUI is defined in the following files & structures:

in blank /project-dir/
```
$ mkdir GUI2D
$ mkdir GUI
$ mkdir Resources
$ touch info.lua
$ touch GUI2D/device_2D.lua 
$ touch GUI2D/hdgui_2D.lua
$ touch motherboard_ref.lua
$ mkdir Resources/English
$ touch English/texts.lua
```

*graphical elements are placed in /GUI2D/;*

*info.lua defines basic information about the RE;*

*device_2D.lua defines where/how the graphical elements are placed;*

*hdgui_2D.lua defines how the GUI widget works; todo: define widget in this context* 

*motherboard_ref.lua defines how the signals and the GUI widget are connected;*

### The Realtime Controller 

From tutorial: defines what parts of the external signalling we send to our realtime C++ code. 

Contains:
* a set of lua functions that configure the runtime and list of properties that trigger these functions
* a list of sample rates (sample_rate_setup)
* a list of properties for which the C++ code should receive signal for (rt_input_setup)

in /project-dir/
```
$ touch realtime_controller.lua
```

*realtime_controller.lua relates to the motherboard via custom_properties and its subsections "rtc_owner";* 

#### Once the Realtime Controller is set up
in /RE2DRender/
```
$ RE2DRender.app/Contents/MacOS/RE2DRender \
    "../SDK/Examples/project-dir/GUI2D" \
    "../SDK/Examples/project-dir/GUI"
```
*rendered graphics are placed in /GUI/;*

### Exports C++
in /project-dir/
```
$ touch JukeBoxExports.cpp
```
*JukeBoxExports.cpp includes functions CreateNativeObject & RenderRealtime;*

### Build with build45.py

copy build45.py from another example into /project-dir/
```
$ python build45.py local45 Testing
```
*At this point you can use Recon to test your module;*

### Realtime C++
The quick idea here is to create Project.h that includes Jukebox.h builtin library; In this Project.h file you will create a class CProject that will include a default constructor and a method RenderBatch in its class definition;

Part two of the quick idea is create Project.cpp that includes your Project.h header that will instantiate a CProject object and call CProject::RenderBatch;

This is barebones, doesn't-do-anything-real basic. I am going to go deeper into in the future, but the idea is to figure out what you want to do and dive through the API to find the correct calls. These calls will be included in your Project.h CProject class definition and then called in Project.cpp;

For example: you can, using property_tags in the motherboard_ref, access properties in realtime by setting a const variable in Project.cpp to the same value used in the motherboard_ref. You can then utilize API call JBox_StoreMOMPropertyByTag in combination with JBox_GetMotherboardObjectRef. This is one way of connecting the motherboard_ref to API calls in the Project.cpp or Project.h file. I'm sure there are more of these "pairs" to be found in the API documentation;

*To double back just a bit, we need to make sure that JukeBoxExports.cpp method CreateNativeObject instantiates the CProject class and the method RenderRealtime is calling the RenderBatch function;*

#### Some Thoughts

I think this wraps up what I am conceptually trying to do without totally redoing the entire tutorial; just show how to dots are connected in the bare bones structure without getting too distracted by the actual code. The C++ part of this definitely the most interesting going forward, diving into the API will clearly shed a lot of light over this whole thing.
