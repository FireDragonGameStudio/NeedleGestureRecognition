import { Behaviour, EventList, serializable, WebXRController } from "@needle-tools/engine";
import { WebXR, WebXREvent } from "@needle-tools/engine/engine-components/WebXR";
import { WebXRManager, Group } from "three";

export class HandGestures extends Behaviour {
    @serializable(WebXR)
    webXR?: WebXR;
    @serializable()
    handedness: number = 0; // 0 = left hand, 1 = right hand
    // @type UnityEngine.Events.UnityEvent<string>
    @serializable(EventList)
    gestureFound?: EventList;

    private hand: WebXRController | null = null;
    private refSpace: XRReferenceSpace | null = null;
    private handGesturesSource: any | null = null;
    private foundGesture: boolean = false;

    // only use finger tips for better performance
    private wrist: any | null = null;
    private fingerTips: Map<string, XRJointSpace> = new Map<string, XRJointSpace>();

    private previousGestureName: string = "";

    start() {
        WebXR.addEventListener(WebXREvent.XRStarted, this.onXRSessionStart.bind(this));
        WebXR.addEventListener(WebXREvent.XRUpdate, this.onXRSessionUpdate.bind(this));
    }

    private onXRSessionStart(_evt: { session: XRSession }) {
        if (!this.webXR) return;

        // hand controller
        this.hand = this.webXR?.Controllers[this.handedness];
        console.log("FOUND HAND", this.hand);
        if (!this.hand || !this.hand.input || !this.hand.input.hand) return;

        this.hand.showRaycastLine = false;
        this.refSpace = this.context.renderer.xr.getReferenceSpace();

        // cache fingertip joints
        for (const [key, value] of this.hand?.input?.hand.entries()) {
            if (key.toString().includes("thumb-tip") || key.toString().includes("index-finger-tip") || key.toString().includes("middle-finger-tip") || key.toString().includes("ring-finger-tip") || key.toString().includes("pinky-finger-tip")) {
                this.fingerTips.set(key.toString(), value);
                continue;
            }
            if (key.toString().includes("wrist")) {
                this.wrist = value;
            }
        }
    }

    private onXRSessionUpdate(evt: { rig: Group; frame: XRFrame; xr: WebXRManager; input: XRInputSource[] }) {
        if (this.refSpace && this.hand?.input?.hand && this.handGesturesSource) {
            // check all saved gestures
            for (const gesture of this.handGesturesSource.HandGestures) {
                this.foundGesture = true;
                // compare fingertips
                for (const [key, value] of this.fingerTips.entries()) {
                    const fingerTipJoint = gesture.Joints.find((fingerTip) => fingerTip.JointName == key.toString());
                    if (fingerTipJoint) {
                        var fingerTipPose = evt.frame.getJointPose?.(value, this.refSpace);
                        const wristJointPose = evt.frame.getJointPose?.(this.wrist, this.refSpace);
                        if (fingerTipPose && wristJointPose) {
                            var distanceToWrist = this.calculateDistance(wristJointPose, fingerTipPose);

                            // compare distance with threshold
                            const difference = fingerTipJoint.DistanceToWrist - distanceToWrist;
                            if (difference > 0.005 || difference < -0.005) {
                                this.foundGesture = false;
                                break;
                            }
                        }
                    }
                }
                // check if a different or no gesture was found, compared to the check before
                if (this.foundGesture && this.previousGestureName !== gesture.Name) {
                    console.log("DETECTED GESTURE:", gesture.Name);
                    this.gestureFound?.invoke(gesture.Name);
                    this.previousGestureName = gesture.Name;
                    break;
                }
            }
        }
    }

    private calculateDistance(wristJointPose: XRJointPose, tipJointPose: XRJointPose): number {
        const deltaX = tipJointPose.transform.position.x - wristJointPose.transform.position.x;
        const deltaY = tipJointPose.transform.position.y - wristJointPose.transform.position.y;
        const deltaZ = tipJointPose.transform.position.z - wristJointPose.transform.position.z;

        // sqrt is expensive, don't do it
        // const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        const distance = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;

        return distance;
    }

    public SetHandGestureSource(gestureFile: any) {
        this.handGesturesSource = gestureFile;
    }
}
