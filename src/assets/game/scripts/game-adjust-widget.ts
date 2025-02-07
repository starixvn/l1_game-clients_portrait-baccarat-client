import { _decorator, Component, Enum, Node, UITransform, Widget } from "cc";
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
    private gameNode: Node = null;

    @property
    value: number = 0;

    @property({ type: Enum(WidgetPolicy) })
    protected _policy = WidgetPolicy.Bottom;

    @property({ type: Enum(WidgetPolicy) })
    public get policy(): WidgetPolicy {
        return this._policy;
    }

    public set policy(value: WidgetPolicy) {
        this._policy = value;
        this.updateDisplay();
    }

    private gameWidget: Widget = null;

    public onLoad(): void {
        this.gameWidget = this.gameNode.getComponent(Widget);
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

        this.gameWidget.updateAlignment();

        this.gameWidget.verticalCenter = this.calculateVerticalCenter();
    }

    private calculateVerticalCenter(): number {
        const centerNodeHeight = this.node.getComponent(UITransform).height;
        const scaleY = this.gameNode.scale.y;
        const gameHeight = this.gameNode.getComponent(UITransform).height * scaleY;

        if (this.value * gameHeight >= (centerNodeHeight - gameHeight) / 2) {
            return 0;
        }

        return this.policy === WidgetPolicy.Bottom ? -this.value : this.value;
    }
}
