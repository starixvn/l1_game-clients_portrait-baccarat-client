import { _decorator, Component, Layout, Node, UITransform } from "cc";
import { GridLayout } from "db://shared-components/shared/common-components/grid-layout/scripts/components/grid-layout";

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

    private readonly WIDTH_EXPAND_BEADROAD = 561;
    private readonly WIDTH_COLLAPSE_BEADROAD = 100;
    private readonly WIDTH_SPACING = 22;
    private readonly WIDTH_GAME = 828;

    protected start(): void {
        this.zoom(undefined, this.zoomModes.normal);
    }

    onClickExpandMode() {
        this.isExpandBeadRoad = !this.isExpandBeadRoad;
        const layoutBeadRoad = this.nodeBeadRoad.getChildByName("baccarat-bead-road").getComponent(GridLayout);
        if (this.isExpandBeadRoad) {
            this.nodeBeadRoad.getComponent(UITransform).width = this.WIDTH_EXPAND_BEADROAD;
            this.nodeWrapperVertical.getComponent(UITransform).width = this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_EXPAND_BEADROAD;
            layoutBeadRoad.settings.scrollable = true;
            layoutBeadRoad.settings.scrollToEnd = true;
        } else {
            this.nodeBeadRoad.getComponent(UITransform).width = this.WIDTH_COLLAPSE_BEADROAD;
            this.nodeWrapperVertical.getComponent(UITransform).width = this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_COLLAPSE_BEADROAD;
            layoutBeadRoad.settings.scrollable = false;
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
