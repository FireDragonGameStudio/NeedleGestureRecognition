# Gesture recognition for WebXR hand tracking built with Needle Engine and Unity

**Check out the sample video here - https://youtu.be/LDA3huxy6-k**

This is just a simple implementation for WebXR hand tracking built with Needle Engine (https://github.com/needle-tools/needle-engine-support). A working prototype can be found here - https://holistic-rust-rooster.glitch.me/ Before testing it on your VR device (only tested on Quest 1/2, not sure if this will work on Pico too) make sure to have hand tracking enabled (https://www.meta.com/en-gb/help/quest/articles/headsets-and-accessories/controllers-and-hand-tracking/hand-tracking-quest-2/).

The sample is based on my own previous hand tracking implementations (e.g. using Unity, Oculus Integration, VRTKv4, ...), ported to three.js and Needle Engine, with a few adjustments and optimizations. 

# How does it work in general

The distance of the finger tips to the wrist (of the respective hand) is used to check for pre-recorded gestures. These recorded gestures' finger tip data is stored in a simple json (https://github.com/FireDragonGameStudio/NeedleGestureRecognition/blob/main/Projects/HandTrackingGestures/HandGestureData_Clean.json) and compared with the actual positions of the finger tips each frame. I kept the raw recorded data in the project (https://github.com/FireDragonGameStudio/NeedleGestureRecognition/blob/main/Projects/HandTrackingGestures/HandGestureData_Raw.json) to show that all recorded hand joints in comparison to a much smaller data structure can result in a massive performance boost. If a gesture is successfully recognized, an event is fired, which you can register on (either via Javascript/Typescript on Unity-like via EventListeners in the Editor). The function parameter string is the name of the currently detected gesture, which can be queried and reacted to (like in the sample function setRotationAxis here: https://github.com/FireDragonGameStudio/NeedleGestureRecognition/blob/main/Projects/HandTrackingGestures/src/scripts/Rotate.ts).

## The prototype functionalities

When playing around in the provided prototype, the background text will change accordingly to the recognized gesture. In addition, the gestures **ONE**, **TWO**, **THREE** and **FOUR** will change the cubes behaviour. When **ONE** is detected, the cube will rotate around its X axis, on **TWO** its Y axis, on **THREE** the Z axis and with **FOUR** the cube will stop rotating.

## Gesture recorder

As mentioned before, there is a gesture recorder for recording custom gestures too. The script can be found here - https://github.com/FireDragonGameStudio/NeedleGestureRecognition/blob/main/Projects/HandTrackingGestures/src/scripts/HandGestureRecorder.ts. For using it, **DISABLE** the HandGestureRecognizer object in the hierarchy and **ENABLE** the HandGestureRecorder object.

![image](https://user-images.githubusercontent.com/23502690/205277128-506e00fe-8a17-4ee3-8e95-2a31e50e0496.png)

When running the example on your headset, make sure you're able to check the log messages within your browser (works with Chrome Developer Tools, explained further below). Let's assume you wanna record a gesture with your left hand (doesn't matter which hand you prefer), form that gesture and to confirm that, perform a pinch gesture with your, in this case, right hand.

The browser logs will now show a JSON structure, which contains the fully tracked hand data, to your specific recording frame. This data matches the following JSON structure:

```
{
    "HandGestures": [
        {
            "Name": "newGesture",
            "Joints":[
                {
                    "JointName": "wrist",
                    "DistanceToWrist": 0
                },{
                    ...
                },{
                    ...
                },{
                    ...
                }
            ]
        },
        {
            ...
        }
    ]
}
```

So it's basically an array of hand gestures, which is composed of a name and an array of hand joints and their distance to the wrist. After recording all your gestures and logging them to the console, copy and merge everything to fit this format. This is the RAW data. For this prototype you'll just need the finger tips, so make sure to copy that and delete all joints exept the finger tips. Your file may now look like the provided one - https://github.com/FireDragonGameStudio/NeedleGestureRecognition/blob/main/Projects/HandTrackingGestures/HandGestureData_Clean.json

To check for your recorded gestures, **DISABLE** the HandGestureRecorder object, **ENABLE** the HandGestureRecognizer and try it :)

# Gesture Detection? Tell me more

Currently there are 10 gestures detected, which can be used on each hand separately. I just came up with a few names myself, so the naming may vary on other implementations.

<p float="left">
<img title="ThumbsUp" alt="ThumbsUp" src="https://user-images.githubusercontent.com/23502690/205271494-824f1408-b1d7-4259-8d44-39cbcb0ce7fc.png" height="200">
<img title="Shaka" alt="Shaka" src="https://user-images.githubusercontent.com/23502690/205271573-c2e8f4f5-0acb-495d-ae65-37c76bd33988.png" height="200">
<img title="Fist" alt="Fist" src="https://user-images.githubusercontent.com/23502690/205272287-a17e7b37-0e04-4386-bd5c-dc2f3b6c440f.png" height="200">
<img title="Rock" alt="Rock" src="https://user-images.githubusercontent.com/23502690/205271635-81e5d7a9-d33b-4065-bf26-45a6a76095b8.png" height="200">
<img title="ILY - I love you in American Sign Language" alt="ILY - I love you in American Sign Language" src="https://user-images.githubusercontent.com/23502690/205271779-79694bc1-6b6a-4e6c-8b9f-32de30a8985b.png" height="200">
<img title="Fox" alt="Fox" src="https://user-images.githubusercontent.com/23502690/205272113-4a1f76c1-5ec3-4fb8-b12f-641b41498975.png" height="200">
<img title="One" alt="One" src="https://user-images.githubusercontent.com/23502690/205272431-d7859764-488c-4ef6-b917-fc38c29ff82e.png" height="200">
<img title="Two" alt="Two" src="https://user-images.githubusercontent.com/23502690/205272615-d0381e15-12ee-4a94-b766-cfde825546fa.png" height="200">
<img title="Three" alt="Three" src="https://user-images.githubusercontent.com/23502690/205272675-94d7aa3b-4ca4-4e88-95de-2bd2b7f608d4.png" height="200">
<img title="Four" alt="Four" src="https://user-images.githubusercontent.com/23502690/205272749-1e34e780-fa5e-4244-bc8a-3b4d7730ea0d.png" height="200">
</p>

Pls note that this is just a POC. I won't provide actual support for this, apart from my personal development interests. For any questions about Needle Engine reach out to https://needle.tools/ and join their Discord. The community is lively and really helpful! Great team there :)

## I wanna try it too, but on my local machine

At least with Meta Quest, this is easily possible. Don't know how it works for Pico. ¯\_(ツ)_/¯

- Check out this repo and (if necessary) update Needle-Engine (https://github.com/needle-tools/needle-engine-support/blob/main/documentation/getting-started.md).
- Open the project, open sample scene, HandTrackingGestures.unity, everything is already set up and running there.
- Make sure to connect you headset to your PC.
- **Check that your headset AND your PC are within the same network (e.g. your local wifi)**
- Start Meta Quest Developer hub aka MQDH (https://developer.oculus.com/documentation/unity/ts-odh/) and check if your device is registered by the application.
- If you now click on Play of the Needle Engine export component, a local Vite (https://vitejs.dev/) webserver is launched, which is accessable within your local network (e.g. 192.168.0.1:3000).
- Copy that link and switch to MQDH, select your device manager.
- Paste the link into the "Meta Quest Browser" text field and click Open.
![image](https://user-images.githubusercontent.com/23502690/205270605-7b0c440b-5968-4446-9aa2-5bc1d8f404f9.png)
- Your Meta browser should now open on your headset and you're ready to test.
- **You don't have to quit the running website, when doing changes. Needle Engine will hotswap and reload your session automatically, so it's very fast for developing and iterating in VR**
- Very useful when combined with using logs and Chrome Developer Tools -> https://developer.oculus.com/documentation/web/browser-remote-debugging/#start-a-remote-debugging-session-with-chrome-developer-tools

## Where is the code located?

When following the path https://github.com/FireDragonGameStudio/NeedleGestureRecognition/tree/main/Projects/HandTrackingGestures/src/scripts you'll find the Typescript components for handling all stuff. It's pretty straight forward, implementing a very basic sample and contains example code to add gestures yourself via HandGestureRecorder.ts. Feel free to add your own gestures, play around with it, ...


