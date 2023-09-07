import { State } from '@/core/state';
import { A_WHITE, RED1, WIDTH, drawEngine } from '@/core/draw-engine';
import { controls } from '@/core/controls';
import { gameStateMachine } from '@/game-state-machine';
import { gameState } from './game.state';

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

class MenuState implements State {
  private isStartSelected = true;

  onUpdate() {
    drawEngine.drawOverlay(1);

    ['Market', 'Street', 'Tycoon'].map((s, i) => {
      drawEngine.drawText(s, 18, WIDTH / 2, 8 + i * 16, RED1, 'center');
    });
    drawEngine.drawText(
      this.isStartSelected ? '▸ Start' : '  Start',
      10, 10, 80,
      this.isStartSelected ? 'white' : A_WHITE
    );
    drawEngine.drawText(
      !this.isStartSelected ? '▸ Fullscreen' : '  Fullscreen',
      10, 10, 95,
      !this.isStartSelected ? 'white' : A_WHITE
    );

    this.updateControls();
  }

  updateControls() {
    if ((controls.isUp && !controls.previousState.isUp)
      || (controls.isDown && !controls.previousState.isDown)) {
      this.isStartSelected = !this.isStartSelected;
    }

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      if (this.isStartSelected) {
        gameStateMachine.setState(gameState);
      } else {
        toggleFullscreen();
      }
    }
  }
}

export const menuState = new MenuState();
