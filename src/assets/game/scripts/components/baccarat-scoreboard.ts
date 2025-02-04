import { _decorator, Component, Layout, Node, UITransform } from "cc";

const { ccclass, property } = _decorator;

@ccclass()
export class BaccaratScoreBoard extends Component {
    @property(Node)
    nodeBeadRoad: Node = null;

    @property(Node)
    nodeWrapperVertical: Node = null;

    @property(Node)
    nodeContainer: Node = null;

    private isExpandBeadRoad = false;
    private readonly zoomModes = {
        normal: "normal",
        zoomInBigRoad: "zoomInBigRoad",
        zoomInDerivedRoad: "zoomInDerivedRoad",
    };

    protected start(): void {
        this.zoom(undefined, this.zoomModes.normal);
    }

    onClickExpandMode() {
        this.isExpandBeadRoad = !this.isExpandBeadRoad;
        if (this.isExpandBeadRoad) {
            this.nodeBeadRoad.getComponent(UITransform).width = 528;
            this.nodeWrapperVertical.getComponent(UITransform).width = 278;
        } else {
            this.nodeBeadRoad.getComponent(UITransform).width = 102;
            this.nodeWrapperVertical.getComponent(UITransform).width = 704;
        }
        this.nodeContainer.getComponent(Layout).updateLayout();
    }

    zoom(event: any, mode: string) {
        switch (mode) {
            case this.zoomModes.normal:
                this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active = true;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = false;
                //this.runActionZoom(this.node.getChildByName(this.zoomModes.normal));
                break;

            case this.zoomModes.zoomInBigRoad:
                this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active = true;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = false;
                //this.runActionZoom(this.node.getChildByName(this.zoomModes.zoomInBigRoad));
                break;

            case this.zoomModes.zoomInDerivedRoad:
                this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = true;
                //this.runActionZoom(this.node.getChildByName(this.zoomModes.zoomInDerivedScoreboards));
                break;
        }
    }
}
