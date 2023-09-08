import { State } from '@/core/state';
import { A_WHITE, BROWN1, HEIGHT, RED1, WHITE1, WIDTH, drawEngine } from '@/core/draw-engine';
import { controls } from '@/core/controls';
import { gameStateMachine } from '@/game-state-machine';
import { GameState } from './game.state';

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

class MenuState implements State {
  private selection = 0;
  showAbout = true;

  renderMenu() {
    ['𝕄𝕒𝕣𝕜𝕖𝕥', '𝕊𝕥𝕣𝕖𝕖𝕥', '𝕋𝕪𝕔𝕠𝕠𝕟'].map((s, i) => {
      drawEngine.drawText(s, 20, WIDTH / 2, 8 + i * 16, RED1, 'center', 100);
    });
    drawEngine.drawText(
      this.selection == 0 ? '▸ Start' : '  Start',
      10, 10, 80,
      this.selection == 0 ? 'white' : A_WHITE
    );
    drawEngine.drawText(
      this.selection == 1 ? '▸ Fullscreen' : '  Fullscreen',
      10, 10, 95,
      this.selection == 1 ? 'white' : A_WHITE
    );
    drawEngine.drawText(
      this.selection == 2 ? '▸ About' : '  About',
      10, 10, 110,
      this.selection == 2 ? 'white' : A_WHITE
    );
  }

  renderAbout() {
    [
      'You\'re a merchant in the',
      ' village market, trying to',
      ' succed. Buy goods from the',
      ' region and resell them.',
      '',
      'Use the arrow keys and Enter',
      ' to control the game.',
      '',
      'Made by lopis github.com/lopis',
    ].map((line, i) => {
      drawEngine.drawText(
        line,
        9, 10, 12 + i * 12,
        i < 5 ? WHITE1 : BROWN1,
        'left',
        100
      );
    });
    drawEngine.drawButton(
      WIDTH / 2,
      HEIGHT - 15,
      WHITE1,
      'return',
    );
  }

  onUpdate() {
    drawEngine.drawOverlay(1);

    this.showAbout ? this.renderAbout() : this.renderMenu();

    this.updateControls();
  }

  updateControls() {
    if ((controls.isUp && !controls.previousState.isUp)
      || (controls.isDown && !controls.previousState.isDown)) {
      this.selection = (this.selection + 1) % 3;
    }

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      if (this.showAbout) {
        this.showAbout = false;
      } else if (this.selection == 0) {
        gameStateMachine.setState(new GameState());
      } else if (this.selection == 1) {
        toggleFullscreen();
      } else {
        this.showAbout = true;
      }
    }
  }
}

export const menuState = new MenuState();
