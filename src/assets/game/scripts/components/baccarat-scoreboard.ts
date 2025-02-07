import { _decorator, Component, Layout, Node, Sprite, SpriteAtlas, UITransform } from "cc";
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

    @property(Node)
    nodeBigRoad: Node = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    @property(Sprite)
    sprChangeModeBeadRoad: Sprite = null;

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
        const bigRoadLayout = this.nodeBigRoad.getComponent(GridLayout);
        const bigRoadZoomIn = this.nodeWrapperVertical.getChildByName("zoomInBigRoad");
        const containerBigRoad = this.nodeBigRoad.getChildByName("container");
        const containerZoomInBigRoad = bigRoadZoomIn.getChildByName("container");
        const nodes = [this.nodeWrapperVertical, this.nodeBigRoad, bigRoadZoomIn, containerBigRoad, containerZoomInBigRoad];
        if (this.isExpandBeadRoad) {
            this.nodeBeadRoad.getComponent(UITransform).width = this.WIDTH_EXPAND_BEADROAD;
            this.setWidthForNodes(nodes, this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_EXPAND_BEADROAD);
            this.sprChangeModeBeadRoad.spriteFrame = this.mainAtlas.getSpriteFrame("stats-icon-zoom-out");
        } else {
            this.nodeBeadRoad.getComponent(UITransform).width = this.WIDTH_COLLAPSE_BEADROAD;
            this.setWidthForNodes(nodes, this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_COLLAPSE_BEADROAD);
            this.sprChangeModeBeadRoad.spriteFrame = this.mainAtlas.getSpriteFrame("stats-icon-zoom");
        }
        this.nodeContainer.getComponent(Layout).updateLayout();
        bigRoadLayout.settings.scrollToEnd = true;
    }

    zoom(event: any, mode: string) {
        switch (mode) {
            case this.zoomModes.normal:
                this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active = true;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = false;
                break;

            case this.zoomModes.zoomInBigRoad:
                this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active = true;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = false;
                break;

            case this.zoomModes.zoomInDerivedRoad:
                this.nodeWrapperVertical.getChildByName(this.zoomModes.normal).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInBigRoad).active = false;
                this.nodeWrapperVertical.getChildByName(this.zoomModes.zoomInDerivedRoad).active = true;
                break;
        }
    }

    setWidthForNodes(nodes: Node[], width: number) {
        nodes.forEach((node) => {
            node && (node.getComponent(UITransform).width = width);
        });
    }
}
