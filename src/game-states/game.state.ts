import { State } from '@/core/state';
// import { drawEngine } from '@/core/draw-engine';
// import { controls } from '@/core/controls';
// import { gameStateMachine } from '@/game-state-machine';
// import { menuState } from '@/game-states/menu.state';

class GameState implements State {

  constructor() {
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter() {

  }

  onUpdate() {
    
  }
}

export const gameState = new GameState();
