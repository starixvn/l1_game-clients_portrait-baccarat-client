import "./../../../resources/i18n";

import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import { AudioContainer } from "db://shared-components/game/audios/scripts/component/audio-container";
import { ChipFlying } from "db://shared-components/game/chip-flying/scripts/components/chip-flying";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { WinningResult } from "db://shared-components/shared/common-components/winning-result/scripts/winning-result";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { FunctionUtils, isIOS } from "db://shared-components/shared/utils";
import Observer from "observer";

import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import { IResult, Plate } from "./plate";
import { BaccaratCardsUI } from "db://direct-shared-components/game-baccarat/cards/baccarat-cards";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);
const { Rounds, RoundHistories } = gc;

const { ccclass, property } = _decorator;
const { observer, render } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property(ChipFlying)
    chipFlying: ChipFlying = null;
    override namespace = settings.name;
    override containerOptions = containerOptions;

    @property(Node)
    nodeAudioContainer: Node = null;


    @property(Node)
    nodeWinning: Node = null;

    @property(Node)
    nodeBaccaratCardsUi: Node = null;
    baccaratCardsUi: BaccaratCardsUI = null;

    compPlate: Plate = null;
    protected enableFixHandleFinish = true;
    private audioContainer: AudioContainer = null;
    private winningResult: WinningResult = null;
    private soundWinChoice = ["odd", "even"];
    private currentFinish: gc.GameServiceMessage.Finish = null;
    private currentCardIndexInGame = -1;
    private isAnimatingResult = false;

    onLoad() {
        this.audioContainer = this.nodeAudioContainer.getComponent(AudioContainer);
        this.baccaratCardsUi = this.nodeBaccaratCardsUi.getComponent(BaccaratCardsUI);
        this.winningResult = this.nodeWinning.getComponent(WinningResult);
        super.onLoad();
    }

    async showResult(
        result: gc.GameServiceMessage.TResult,
        hasAnimation: boolean,
        settlementResult: gc.GameServiceMessage.TSettlementResult
    ) {
        if (result) {
            if (this.isAnimatingResult) {
                return;
            }
            this.isAnimatingResult = true;
            const winning = this.getWinningResult();
            winning.hideQuickly();
            if (hasAnimation) {
                await this.baccaratCardsUi.openCards(result as any, settlementResult, hasAnimation);
            } else {
                this.baccaratCardsUi.openCards(result as any, settlementResult, hasAnimation);
            }
            const winChoice = this.soundWinChoice.find((choice) => settlementResult[choice]);
            this.playSound(`${winChoice}-${gc.Translator.getLanguageId()}`);
            winning?.setSettlementResult(settlementResult);
            winning?.show();
            this.isAnimatingResult = false;
        }
    }


    getWinningResult() {
        return this.winningResult.getComponent(WinningResult);
    }

    async renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
        if (!currentFinish || !this.enableFixHandleFinish) {
            return;
        }
        const { result, settlementResult, usedCardIndexes } = currentFinish as any;

        if (!this.isValidResult(result, settlementResult)) {
            return;
        }

        this.showResult(result, true, settlementResult).then(() => {
            this.finishShowResult(result, settlementResult);
            this.chipFlying.callActionPayChips();
        });
        this.playSound(gc.Audios.AudioIds.RECEIVE_FINISH);
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    async renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }
        await FunctionUtils.waitUntil(
            () => {
                return this.currentCardIndexInGame !== -1;
            },
            50,
            1000
        );
        this.baccaratCardsUi.initCards();
        const lastRound = firstJoinGameHistory.roundHistory as any;
        if (lastRound) {
            const { result, settlementResult, usedCardIndexes } = lastRound;
            const animated = firstJoinGameHistory.animationHighlight;
            if (animated) {
                this.baccaratCardsUi.currentCardIndex = usedCardIndexes[0];
                this.showResult(result, false, settlementResult);
                return;
            }
            this.baccaratCardsUi.currentCardIndex = this.currentCardIndexInGame;
            await this.baccaratCardsUi.draw6Cards(false);
        } else {
            if (firstJoinGameHistory.roundTime <= settings.durations.placingBet + settings.durations.startRound) {
                this.baccaratCardsUi.currentCardIndex = this.currentCardIndexInGame;
                await this.baccaratCardsUi.draw6Cards(false);
            }
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundState)
    fadeVolumeBgMusic(roundState: string) {
        if (roundState === Rounds.ROUND_STATE.LOCKING_BET) {
            this.audioContainer.updateVolumeMusicSource(0.3, 3);
        } else if (roundState === Rounds.ROUND_STATE.SHOW_RESULT) {
            this.audioContainer.updateVolumeMusicSource(1, 3);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartingRound)
    disableWinNotice(isStartingRound: boolean) {
        isStartingRound && this.winningResult.hideQuickly();
    }
}
