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
    @property
    value: number = 0.1;

    private gameWidget: Widget = null;

    public onLoad(): void {
        this.gameWidget = this.node.getComponent(Widget);
    }

    public onEnable(): void {
        this.node.parent.on(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
        this.updateDisplay();
    }

    public onDisable(): void {
        this.node.parent.off(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
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
        const nodeHeight = this.node.parent.getComponent(UITransform).height;
        const scaleY = this.node.scale.y;
        const gameHeight = this.node.getComponent(UITransform).height * scaleY;
        const deltaHeight = nodeHeight - gameHeight;
        const maxOffset = deltaHeight / 2;

        if (nodeHeight <= gameHeight) {
            return 0;
        }

        if (this.value * nodeHeight >= maxOffset) {
            return -maxOffset / nodeHeight;
        }

        return -this.value;
    }
}
