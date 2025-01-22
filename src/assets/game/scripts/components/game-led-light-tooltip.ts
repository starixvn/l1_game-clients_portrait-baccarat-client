import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import { LedLightTooltip } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip";

const { ccclass, property } = _decorator;

interface CardInfo {
    card: number;
}

type PlayerCards = { [key: string]: CardInfo };

@ccclass()
export class GameLedLightToolTip extends LedLightTooltip {
    @property(Label)
    lblPlayerTotalPoint: Label = null;

    @property(Label)
    lblBankerTotalPoint: Label = null;

    @property({ type: Label, override: true, visible: false })
    result: Label = null;

    public setTooltipInfo(ledLightInfo: gc.RoundHistories.RoundHistory) {
        const { roundId, result } = ledLightInfo;
        this.roundId.string = `#${roundId}`;

        if (typeof result !== "object") {
            return;
        }

        const playerCards = this.extractCards(result.player);
        const bankerCards = this.extractCards(result.banker);

        this.updatePointLabels(playerCards, bankerCards);
    }

    private extractCards(cards: PlayerCards | undefined): number[] {
        if (!cards) {
            return [];
        }

        return Object.values(cards)
            .filter((cardInfo) => cardInfo?.card !== undefined)
            .map((cardInfo) => cardInfo.card + 1); // Add 1 since cards are 0-based
    }

    private updatePointLabels(playerCards: number[], bankerCards: number[]): void {
        const playerTotal = this.calculateTotal(playerCards);
        const bankerTotal = this.calculateTotal(bankerCards);

        this.lblPlayerTotalPoint.string = `${playerTotal}`;
        this.lblBankerTotalPoint.string = `${bankerTotal}`;
    }

    private calculateTotal(cards: number[]): number {
        const sum = cards.reduce((total, card) => {
            return card >= 10 ? total : total + card;
        }, 0);
        return sum % 10;
    }
}
