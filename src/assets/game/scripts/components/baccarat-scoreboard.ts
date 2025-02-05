import { _decorator, Component, Layout, Node, Sprite, SpriteAtlas, Tween, UITransform } from "cc";

const { ccclass, property } = _decorator;

@ccclass()
export class BaccaratScoreBoard extends Component {
    @property(Node)
    nodeBeadRoad: Node = null;

    @property(Node)
    nodeWrapperVertical: Node = null;

    @property(Node)
    nodeContainer: Node = null;

    @property(SpriteAtlas)
    mainAtlas: SpriteAtlas = null;

    private tweenBeadRoad: Tween<UITransform> = null;

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
        const beadRoad = this.nodeBeadRoad.getChildByName("baccarat-bead-road");
        const changeModeSpr = beadRoad.getChildByName("btnChangeMode").getComponent(Sprite);
        if (this.isExpandBeadRoad) {
            this.nodeBeadRoad.getComponent(UITransform).width = this.WIDTH_EXPAND_BEADROAD;
            this.nodeWrapperVertical.getComponent(UITransform).width = this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_EXPAND_BEADROAD;
            changeModeSpr.spriteFrame = this.mainAtlas.getSpriteFrame("stats-icon-zoom-out");
        } else {
            this.nodeBeadRoad.getComponent(UITransform).width = this.WIDTH_COLLAPSE_BEADROAD;
            this.nodeWrapperVertical.getComponent(UITransform).width = this.WIDTH_GAME - this.WIDTH_SPACING - this.WIDTH_COLLAPSE_BEADROAD;
            changeModeSpr.spriteFrame = this.mainAtlas.getSpriteFrame("stats-icon-zoom");
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
