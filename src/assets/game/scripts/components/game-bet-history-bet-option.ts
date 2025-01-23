import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label } from "cc";

const { property, ccclass } = _decorator;

@ccclass
export default class GameBetHistoryBetOption extends Component {
    @property(Label)
    choice: Label = null;

    @property(Label)
    stake: Label = null;

    protected convertChoiceData(choice: string): string {
        let betChoice = "";
        const choiceData = ["big", "small", "banker", "bankerPair", "player", "playerPair", "tie"];
        const choiceStr = [
            "ui.choice_big",
            "ui.choice_small",
            "BaccaratX.glossary_banker",
            "BaccaratX.glossary_banker_pair",
            "BaccaratX.glossary_player",
            "BaccaratX.glossary_player_pair",
            "BaccaratX.glossary_tie",
        ];
        choiceData.forEach((item, index) => {
            if (choice === item) {
                betChoice = choiceStr[index];
            }
        });
        return betChoice;
    }

    handleBetOptionItem(choice: string, odd: string, stake: string) {
        const choiceStr = this.convertChoiceData(choice);
        this.choice.string = `${gc.Translator.translate(choiceStr)}`;
        this.stake.string = stake;
    }

    highlightForWinning(win: boolean) {
        const color = win ? Color.YELLOW : Color.WHITE;
        this.choice.color = color;
        this.stake.color = color;
    }
}
