import { Behaviour, serializable } from "@needle-tools/engine";

export class Rotate extends Behaviour {
    @serializable()
    speed: number = 1;

    private rotationAxis: string = "";

    update() {
        switch (this.rotationAxis) {
            case "X":
                this.gameObject.rotateX(this.context.time.deltaTime * this.speed);
                break;
            case "Y":
                this.gameObject.rotateY(this.context.time.deltaTime * this.speed);
                break;
            case "Z":
                this.gameObject.rotateZ(this.context.time.deltaTime * this.speed);
                break;

            default:
                break;
        }
    }

    public setRotationAxis(gestureName: string) {
        switch (gestureName) {
            case "One":
                this.rotationAxis = "X";
                break;
            case "Two":
                this.rotationAxis = "Y";
                break;
            case "Three":
                this.rotationAxis = "Z";
                break;
            case "Four":
                this.rotationAxis = "-";
                break;

            default:
                break;
        }
        this.gameObject.scale.set(0.3, 0.3, 0.3);
    }
}
