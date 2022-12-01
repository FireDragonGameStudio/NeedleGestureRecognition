import { Behaviour, serializable, WebXR, WebXRController } from "@needle-tools/engine";
import { WebXREvent } from "@needle-tools/engine/engine-components/WebXR";
import { Group, WebXRManager } from "three";

export class HandGestureRecorder extends Behaviour {
    @serializable(WebXR)
    webXR?: WebXR;

    private refSpace: XRReferenceSpace | null = null;

    private recordLeftHandGesture: boolean = false;
    private recordRightHandGesture: boolean = false;

    private leftHand: WebXRController | null = null;
    private rightHand: WebXRController | null = null;

    private leftWrist: any | null = null;
    private rightWrist: any | null = null;

    private leftHandGestures: any[] = [];
    private rightHandGestures: any[] = [];

    start() {
        WebXR.addEventListener(WebXREvent.XRStarted, this.onXRSessionStart.bind(this));
        WebXR.addEventListener(WebXREvent.XRUpdate, this.onXRSessionUpdate.bind(this));
    }

    private onXRSessionStart(_evt: { session: XRSession }) {
        if (!this.webXR) return;

        // left controller
        this.leftHand = this.webXR?.Controllers[0];
        console.log("LEFT HAND", this.leftHand);
        if (!this.leftHand) return;

        // right controller
        this.rightHand = this.webXR?.Controllers[1];
        console.log("RIGHT CONTROLLER", this.rightHand);
        if (!this.rightHand) return;

        this.leftHand.showRaycastLine = false;
        this.rightHand.showRaycastLine = false;

        // save right hand data on left pinch
        this.leftHand.controller.addEventListener("selectend", () => {
            this.recordRightHandGesture = true;
        });
        // save left hand data on right pinch
        this.rightHand.controller.addEventListener("selectend", () => {
            this.recordLeftHandGesture = true;
        });

        this.refSpace = this.context.renderer.xr.getReferenceSpace();

        // Check left wrist
        if (this.leftHand?.input?.hand) {
            for (const [key, value] of this.leftHand?.input?.hand.entries()) {
                if (key.toString().includes("wrist")) {
                    this.leftWrist = value;
                    console.log("LEFT WRIST VALUE", this.leftWrist);
                    break;
                }
            }
        }

        // Check right wrist
        if (this.rightHand?.input?.hand) {
            for (const [key, value] of this.rightHand?.input?.hand.entries()) {
                if (key.toString().includes("wrist")) {
                    this.rightWrist = value;
                    console.log("RIGHT WRIST VALUE", this.rightWrist);
                    break;
                }
            }
        }
    }

    private onXRSessionUpdate(evt: { rig: Group; frame: XRFrame; xr: WebXRManager; input: XRInputSource[] }) {
        if (this.recordLeftHandGesture && this.leftHand?.input?.hand) {
            this.recordGesture(this.leftHand, this.leftWrist, evt.frame, this.leftHandGestures);
            this.recordLeftHandGesture = false;
        }
        if (this.recordRightHandGesture && this.rightHand?.input?.hand) {
            this.recordGesture(this.rightHand, this.rightWrist, evt.frame, this.rightHandGestures);
            this.recordRightHandGesture = false;
        }
    }

    private recordGesture(hand: WebXRController, wrist: any, frame: XRFrame, gesturesArray: any[]) {
        if (this.refSpace && hand?.input?.hand) {
            // RECORDER
            const wristJointPose = frame.getJointPose?.(wrist, this.refSpace);
            if (wristJointPose) {
                console.log("WRIST POS", wristJointPose.transform.position);
                gesturesArray.splice(0);
                // calculate distance
                for (const [key, value] of hand?.input?.hand.entries()) {
                    var tempPose = frame.getJointPose?.(value, this.refSpace);
                    if (tempPose) {
                        var distance = this.calculateDistance(wristJointPose, tempPose);
                        console.log(`DISTANCE WRIST - ${key}`, distance);
                        gesturesArray.push({ JointName: key.toString(), DistanceToWrist: distance });
                    }
                }
            }
            // show JSON
            const handGestures = {
                HandGestures: [
                    {
                        Name: "newGesture",
                        Joints: gesturesArray,
                    },
                ],
            };
            console.log(JSON.stringify(handGestures));
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
}
