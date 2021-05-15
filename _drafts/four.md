---
title: simple instrument gui exploration
tags: reason sound
layout: posts
---
Hi, this is part of ongoing process to document as I learn to create Reason Rack Extensions. In this post I am going to dive into the GUI for the SimpleInstrument example included in the SDK.

#### let's check in GUI2D/

*the example RE as built in Recon*
![SimpleInstrumentGUI](/uploads/blog/simpleinstrument.png)

I find this layout to be simple and effective, so I am going to document the hell out of how this works. We start by looking at device_2D.lua. This will contain the filepaths of the graphical elements that will be referenced in the hdgui_2D.lua. 

device_2D.lua appears to not have any documentation in the scripting specifications docs. This is unfortunate, but seems pretty straightforward. In the SDK HelloWorld tutorial the skeleton for the device_2D.lua is given to be:
```
format_version = "2.0"
front = { }
back = { }
folded_front = { }
folded_back = { }
```
Every one of these main elements will be assigned a graphical element:

*from tutorial:*
```
front = {
	Bg = {
        { path = "Panel_Front_1U" },
    },
}
```
*or, from SimpleInstrument:*
```
front = {
    S_backdrop = { { path="Reason_GUI_front_root_Panel" } },
}
```
*note that since I use jekyll/liquid to make this site I can't use double brackets next to eachother without liquid thinking its something it needs to process. So the above example (and probably many future examples) originally had double-brackets path=.... with no whitespace. I believe lua doesn't care too much about whitespace, so the above code should be fine, but if gui stuff ends up not working down the road this is a good place to look.*

So each of our main "views" front, back, folded_front, folded_back will have a graphical element assigned to them. But the panels, especially the front, are made up of many more graphical elements (knobs, mod_wheels, etc.) These are defined within a block. The convention appears to be to define the graphical object and have it assigned to a block which contains the x&y location offset of the object and the path to an element.

*from tutorial:*
```
front = {
	Bg = {
        { path = "Panel_Front_1U" },
    },
    lamp = {
    	offset = { 1000, 150 },
    	{path = "Lamp_02_2frames", frames = 2}
    },
}
```
*or, from SimpleInstrument:*
```
Q=5

front = {
    S_backdrop = { {path="Reason_GUI_front_root_Panel"} },
    {
        S_analog_knob_frequency = {
            offset = {322*Q,69*Q},
            {path="Reason_GUI_front_root_Knob_Frequency", 
                frames = 63},
        },
        S_value_display_frequency = {
            offset = {389*Q,87*Q},
            {path="70x26_5x5"},
        },
        S_analog_knob_volume = {
            offset = {616*Q,48*Q},
            {path="Reason_GUI_front_root_Knob_Volume", 
                frames = 63},
        },
        S_sequence_fader_volume = {
            offset = {697*Q,31*Q},
            {path="Reason_GUI_front_root_Fader_Volume", 
                frames = 32},
        },
        S_pitch_wheel_pitchBend = {
            offset = {102*Q,18*Q},
            {path="Reason_GUI_front_root_Wheel_Pitch", 
                frames = 64},
        },
        S_analog_knob_modWheel = {
            offset = {149*Q,18*Q},
            {path="Reason_GUI_front_root_Wheel_Mod", 
                frames = 64},
        },
        S_patch_browse_group = {
            offset = {446*Q,20*Q},
            {path="PatchBrowseGroup"},
        },
        S_patch_name = {
            offset = {228*Q,25*Q},
            {path="204x10_5x5"},
        },
        S_sequence_meter_noteon = {
            offset = {64*Q,34*Q},
            {path="Reason_GUI_front_root_Lamp_NoteOn", 
                frames = 2},
        },
        S_device_name = {
            offset = {26*Q,37*Q},
            {path="TapeVert"},
        },
        S_toggle_button_sampleplay = {
            offset = {525*Q,86*Q},
            {path="Reason_GUI_front_root_Button_SamplePlay", 
                frames = 2},
        },
        S_analog_knob_waveform = {
            offset = {214*Q,86*Q},
            {path="Reason_GUI_front_root_Display_Waveform", 
                frames = 2},
        },
        S_up_down_button_waveform = {
            offset = {260*Q,87*Q},
            {path="Reason_GUI_front_root_Display_Waveform_UpDown_Button", 
                frames = 3},
        },
    },
}
```
The offset paramater defines where the upper-left corner of the image should be placed with (0,0) being the upper-left corner of the entire Rack Extenstion. The path is the filename/filepath and frames, is how many frames is contained within the file.

*todo: how do you determine how many frames is in an image without just counting them? Is this information encoded in the file in someway?*
