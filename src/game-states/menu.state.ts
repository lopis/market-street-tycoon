import { State } from '@/core/state';
import { drawEngine } from '@/core/draw-engine';
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
    const xCenter = drawEngine.context.canvas.width / 2;
    // drawEngine.drawText('🥨 Market Street Tycoon 🥨', 10, xCenter, 40);
    // drawEngine.drawText('Start', 10, xCenter, 60, this.isStartSelected ? 'white' : 'gray');
    // drawEngine.drawText('Toggle Fullscreen', 10, xCenter, 70, this.isStartSelected ? 'gray' : 'white');
    drawEngine.drawTextPixelated('Test test', 10);
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
