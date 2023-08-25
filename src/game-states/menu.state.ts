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
    drawEngine.drawBrickWall();

    drawEngine.drawOverlay();
    
    drawEngine.drawText('Market Street Tycoon', 10, 10, 40);
    drawEngine.drawText('Start', 10, 10, 60, this.isStartSelected ? 'white' : 'gray');
    drawEngine.drawText('Toggle Fullscreen', 10, 10, 70, this.isStartSelected ? 'gray' : 'white');

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
