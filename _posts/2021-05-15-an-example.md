---
title: overview of the simple instrument example
tags: reason sound
layout: posts
---

Hi, this is part of ongoing process to document as I learn to create Reason Rack Extensions. In this post I am going to look at a slightly more "realworld" example by taking a look at the SimpleInstrument example included in the SDK. I am going to focus on the idea of the simple oscillator, despite the example including sample playing functionality.

I want to note how the provided [{ scripting specifications documentation }](https://developer.reasonstudios.com/documentation/rack-extension-sdk/4.2.0/jukebox-scripting-specification) will provide the skeleton and most of the basic information for info.lua, realtime_controller.lua, motherboard_ref.lua, hdgui_2D.lua, etc.

Also interesting to note that, when you load the SimpleInstrument example in using the including XCode project, there is some differences to the files and directories and they way they are structured. I am going to approach from both directions: using the Xcode IDE and using the terminal + vim to see where the discrepancies are.

### To start, let's take note of how the directories and files are structured.

#### in Xcode

*in /SimpleInstrument/*
```
README.txt
build45.py
/JukeboxSDK/
    /API/
        Jukebox.h
        JukeboxTypes.h
    /Tools/
        /Build/
            build.py
            buildconfig.py
        /Libs/
            /Jukebox/
                /ShimABI/
                    JukeboxABI.cpp
                    JukeboxABI.h
/Resources/
    /English/
        texts.lua
    /Private/
        [includes .wav samples]
    /Public/
        [includes .repatch patches]
/GUI/
    /Output/
    /resources/
    SimpleInstrument.device
/Scripts/
    info.lua
    motherboard_def.lua
    realtime_controller.lua
/Source/
    Constants.h
    JukeboxExports.cpp
    SampleSound.cpp
    SampleSound.h
    SimpleInstrument.cpp
    SimpleInstrument.h
    Utils.h
    Voice.cpp
    Voice.h
    VoicePool.cpp
    VoicePool.h
    WaveFormType.h
/Products/
    [empty]
```

#### in the shell
*in /SimpleInstrument/*
```
Constants.h
/GUI/
    /Output/
/GUI2D/
    device_2D.lua
    hdgui_2D.lua
    [a bunch of .png graphic elements]
/Intermediate-llvm/
JukeboxABI.plist
JukeboxExports.cpp
JukeBoxExports.plist
/Output/
    Universal45
README.txt
/Resources/
    /English/
        texts.lua
    /Private/
        [contains .wav samples]
    /Public/
        [contains .repatch patches and Sample_44100.wav]
SampleSound.cpp
SampleSound.h
SampleSound.plist
SimpleInstrument.cpp
SimpleInstrument.h
SimpleInstruent.plist
SimpleInstrument.sln
SimpleInstrument.vcxproj
SimpleInstrument.vcxproj.filters
SimpleInstrument.xcodeproj
Utils.h
Voice.cpp
Voice.h
Voice.plist
VoicePool.cpp
VoicePool.h
VoicePool.plist
WaveFormType.h
build45.py
info.lua
motherboard_def.lua
realtime_controller.lua
```

This might be overkill, but I don't want to make too many assumptions at this point. The .plist files are property files; I assume these work with both Xcode and VisualStudio. The .xcodeproj are for the XCode ecosystem. The .sln, .vcxproj files are for the VisualStudio ecosystem.

*Note: as I moved on to inspecting the GUI in the next part, I realized how the GUI2D graphical elements, device_2D.lua, and hdgui_2D.lua are all missing from the Xcode project. I am not sure why this is, but for the rest of this I am using terminal + vim (a workflow I am more comfortable with anyways.) I can see how the Xcode project file may be useful after the GUI is finalized and once work starts on the C++ Realtime code, so I may come back to the Xcode project files later when I am building my own Rack Extension, we shall see.*


