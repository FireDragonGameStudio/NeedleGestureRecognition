import { Behaviour, serializable } from "@needle-tools/engine";
import HandGestureData from "../../HandGestureData_Clean.json";
import { HandGestures } from "./HandGestures";

export class HandGestureRecognizer extends Behaviour {
    @serializable(HandGestures)
    leftHand?: HandGestures;
    @serializable(HandGestures)
    rightHand?: HandGestures;

    start() {
        this.leftHand?.SetHandGestureSource(HandGestureData);
        this.rightHand?.SetHandGestureSource(HandGestureData);
    }
}
