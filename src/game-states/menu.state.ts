import { State } from '@/core/state';
import { HEIGHT, WHITE1, WHITE2, WIDTH, YELLOW, drawEngine } from '@/core/draw-engine';
import { controls } from '@/core/controls';
import { gameStateMachine } from '@/game-state-machine';
import { GameState } from './game.state';
import { LOCALSTORAGE_KEY } from '@/core/game-data';

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

class MenuState implements State {
  selection = 0;
  showHelp = false;
  showAbout = false;

  renderMenu() {
    ['𝕄𝕒𝕣𝕜𝕖𝕥', '𝕊𝕥𝕣𝕖𝕖𝕥', '𝕋𝕪𝕔𝕠𝕠𝕟'].map((s, i) => {
      drawEngine.drawRealText(s, 20, WIDTH / 2, 8 + i * 16, YELLOW, 'center', 100);
    });
    const menu = ['New Game', 'Continue', 'FullScreen', 'Help', 'About'];
    if (!localStorage.getItem(LOCALSTORAGE_KEY)) {
      menu.splice(1, 1);
    }
    menu.map((s, i) => {
      drawEngine.drawText(
        `${this.selection == i ? '&': ' '} ${s}`,
        10, 70 + i * 13,
        this.selection == i ? WHITE1 : WHITE2
      );
    });
  }

  renderHelp() {
    drawEngine.context.save();
    drawEngine.context.rect(0, 12, WIDTH, HEIGHT - 30);
    drawEngine.context.clip();
    drawEngine.context.translate(0, -this.selection * 6);
    this.renderText([
      'You\'re a merchant in the',
      'village market, trying to',
      'succed. Buy goods from the',
      'region and resell them for',
      'the best price, depending',
      'on customer demand.',
      'Your reputation increases',
      'the more you sell each item',
      'and unlocks new suppliers.',
      '',
      'Use the arrow keys and Enter',
      ' to control the game.',
    ]);
    drawEngine.context.restore();
    drawEngine.drawButton(
      WIDTH / 2,
      HEIGHT - 15,
      WHITE1,
      'return',
    );
  }

  renderAbout() {
    this.renderText([
      'Game made by lopis',
      'for js13k 2023',
      '',
      'github.com/lopis',
      'js13kgames.com',
      '',
      '♥',
    ]);
    drawEngine.drawButton(
      WIDTH / 2,
      HEIGHT - 15,
      WHITE1,
      'return',
    );
  }

  renderText(lines: string[]){
    lines.map((line, i) => {
      drawEngine.drawText(
        line,
        10, 12 + i * 12,
        WHITE2,
        'left'
      );
    });
  }

  onUpdate() {
    drawEngine.drawOverlay(1);

    this.showAbout ? this.renderAbout()
    : this.showHelp ? this.renderHelp()
    : this.renderMenu();

    this.updateControls();
  }

  updateControls() {
    controls.updateSelection(this, this.showAbout || this.showHelp ? 100 : 4);

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      if (this.showAbout || this.showHelp) {
        this.selection = 0;
        this.showAbout = false;
        this.showHelp = false;
      } else if (this.selection <= 1) {
        gameStateMachine.setState(new GameState(this.selection === 0));
      } else if (this.selection == 2) {
        toggleFullscreen();
      } else if (this.selection == 3) {
        this.selection = 0;
        this.showHelp = true;
      } else {
        this.selection = 0;
        this.showAbout = true;
      }
    }
  }
}

export const menuState = new MenuState();
