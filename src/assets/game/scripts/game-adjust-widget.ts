import { _decorator, Component, Enum, Node, UITransform, Widget } from "cc";
import { EDITOR } from "cc/env";

const { ccclass, property } = _decorator;

export enum WidgetPolicy {
    Bottom = 0,
    Top = 1,
}

@ccclass("GameAdjustWidget")
export class GameAdjustWidget extends Component {
    @property({ type: Widget })
    widget: Widget = null;

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

    public onEnable(): void {
        this.node.parent.on(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
        this.node.on(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
        this.updateDisplay();
    }

    public onDisable(): void {
        this.node.parent.off(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
        this.node.off(Node.EventType.SIZE_CHANGED, this.updateDisplay, this);
    }

    public update(delta: number): void {
        if (EDITOR) {
            this.updateDisplay();
        }
    }

    protected updateDisplay(): void {
        this.node.parent.getComponent(Widget).updateAlignment();
        const parentHeight = this.node.parent.getComponent(UITransform).height;
        const offset = 300;
        if (parentHeight > 1078 + offset) {
            if (this.policy === WidgetPolicy.Bottom) {
                this.widget.verticalCenter = -this.value;
            } else if (this.policy === WidgetPolicy.Top) {
                this.widget.verticalCenter = this.value;
            }
        }
    }
}
