import { _decorator, Component, Node, UITransform, Widget } from "cc";
import { EDITOR } from "cc/env";

const { ccclass, property } = _decorator;

export enum WidgetPolicy {
    Bottom = 0,
    Top = 1,
}

/**
 * Manages widget positioning based on screen size and policy
 */
@ccclass("GameAdjustWidget")
export class GameAdjustWidget extends Component {
    @property({ type: Node })
    private mainAreaNode: Node = null;

    @property
    value: number = 0.1;

    private gameWidget: Widget = null;

    public onLoad(): void {
        this.gameWidget = this.mainAreaNode.getComponent(Widget);
        this.updateDisplay();
    }

    public onEnable(): void {
        this.node.on(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
        this.updateDisplay();
    }

    public onDisable(): void {
        this.node.off(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
    }

    public update(delta: number): void {
        if (EDITOR) {
            this.updateDisplay();
        }
    }

    protected updateDisplay(): void {
        if (!this.gameWidget) return;
        this.gameWidget.verticalCenter = this.calculateVerticalCenter();
        this.gameWidget.updateAlignment();
    }

    private calculateVerticalCenter(): number {
        const nodeHeight = this.node.getComponent(UITransform).height;
        const scaleY = this.mainAreaNode.scale.y;
        const gameHeight = this.mainAreaNode.getComponent(UITransform).height * scaleY;
        const deltaHeight = nodeHeight - gameHeight;
        const maxOffset = deltaHeight / 2;

        if (nodeHeight <= gameHeight) {
            return 0;
        }

        if (this.value * nodeHeight >= maxOffset) {
            return -(this.value - maxOffset / nodeHeight);
        }

        return -this.value;
    }
}
