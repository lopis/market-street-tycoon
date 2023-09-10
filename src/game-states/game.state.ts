import { State } from '@/core/state';
import GameData from '@/core/game-data';
import { createPlayStateMachine, gameStateMachine, playStateMachine } from '@/game-state-machine';
import BuyState from './buy.state';
import { on } from '@/core/events';
import { menuState } from './menu.state';
// import { drawEngine } from '@/core/draw-engine';
// import { controls } from '@/core/controls';
// import { gameStateMachine } from '@/game-state-machine';
// import { menuState } from '@/game-states/menu.state';

export class GameState implements State {

  gameData: GameData;

  constructor(newGame: boolean) {
    this.gameData = new GameData();
    if (!newGame) {
      this.gameData.loadSave();
    }
    createPlayStateMachine(new BuyState(this.gameData));
  }

  onEnter() {
    on('restart', () => {
      gameStateMachine.setState(menuState);
    });
  }

  onUpdate(timeElapsed?: number) {
    playStateMachine.getState().onUpdate(timeElapsed);
  }
}
