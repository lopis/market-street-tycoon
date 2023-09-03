import { State } from '@/core/state';
import BuyState from './buy.state';
import GameData from '@/core/game-data';
import { createPlayStateMachine, playStateMachine } from '@/game-state-machine';
// import { drawEngine } from '@/core/draw-engine';
// import { controls } from '@/core/controls';
// import { gameStateMachine } from '@/game-state-machine';
// import { menuState } from '@/game-states/menu.state';

class GameState implements State {

  gameData: GameData;

  constructor() {
    this.gameData = new GameData();
    createPlayStateMachine(new BuyState(this.gameData));
  }

  onUpdate(timeElapsed?: number) {
    playStateMachine.getState().onUpdate(timeElapsed);
  }
}

export const gameState = new GameState();
