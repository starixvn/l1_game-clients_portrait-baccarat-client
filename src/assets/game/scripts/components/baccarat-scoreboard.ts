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
}
