import { State } from '@/core/state';
import { StateMachine } from '@/core/state-machine';
import BuyState from './buy.state';
import GameData from '@/core/game-data';
import { off, on } from '@/core/events';
import MarketState from './market.state';
// import { drawEngine } from '@/core/draw-engine';
// import { controls } from '@/core/controls';
// import { gameStateMachine } from '@/game-state-machine';
// import { menuState } from '@/game-states/menu.state';

class GameState implements State {

  gameData: GameData;
  playStateMachine: StateMachine;

  constructor() {
    this.gameData = new GameData();
    this.playStateMachine = new StateMachine(new BuyState(this.gameData));
  }

  next() {
    this.playStateMachine.setState(new MarketState(this.gameData));
  }

  onLeave() {
    off('next', () => this.next());
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter() {
    this.next();
    on('next', () => this.next());
  }

  onUpdate(timeElapsed?: number) {
    this.playStateMachine.getState().onUpdate(timeElapsed);
  }
}

export const gameState = new GameState();
