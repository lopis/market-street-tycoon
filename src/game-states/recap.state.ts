import { controls } from '@/core/controls';
import { HEIGHT, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import BuyState from './buy.state';

class RecapState implements State {
  gameData: GameData;
  selection = 0;
  curtainPos = 2;

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  next() {
    playStateMachine.setState(new BuyState(this.gameData));
  }

  // onEnter() {

  // }

  onUpdate(timeElapsed = 0) {
    drawEngine.drawOverlay(this.gameData.week);
    drawEngine.drawHeader('Summary', this.gameData);

    drawEngine.drawButton(
      WIDTH / 2,
      HEIGHT - 15,
      'white',
      'next'
    );

    if (this.curtainPos != 2) {
      this.curtainPos = Math.min(1, this.curtainPos + timeElapsed / 1000);
      drawEngine.drawCurtains(1 - this.curtainPos);
    }

    this.updateControls();
  }

  updateControls() {
    if (controls.isConfirm && !controls.previousState.isConfirm) {
      this.gameData.week++;
      this.next();
    }
  }
}

export default RecapState;
