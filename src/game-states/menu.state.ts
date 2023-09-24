import { State } from '@/core/state';
import { A_WHITE, HEIGHT, WHITE1, WHITE1, WIDTH, YELLOW, drawEngine } from '@/core/draw-engine';
import { controls } from '@/core/controls';
import { gameStateMachine } from '@/game-state-machine';
import { GameState } from './game.state';
import { LOCALSTORAGE_KEY } from '@/core/game-data';
import { disableSound, keySound } from '@/core/audio';

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
  showSoundOption = true;

  renderSoundOption() {
    drawEngine.drawText(
      'Play with sound?',
      20,
      46,
      A_WHITE,
    );
    drawEngine.drawText(
      this.selection == 0 ? '& yes' : '  yes',
      20,
      58,
      this.selection == 0 ? WHITE1 : A_WHITE,
    );
    drawEngine.drawText(
      this.selection == 1 ? '& no' : '  no',
      20,
      68,
      this.selection == 1 ? WHITE1 : A_WHITE,
    );
  }

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
        this.selection == i ? WHITE1 : A_WHITE
      );
    });
  }

  renderHelp() {
    drawEngine.setScrollArea(-this.selection * 6);
    this.renderText([
    // ------------------------
      'You are a merchant in',
      'the village market,',
      'trying to succeed. Buy',
      'goods from the region',
      'and resell them for the',
      'best price, depending on',
      'customer demand. Your',
      'reputation increases',
      'the more you sell each',
      'item and unlocks new',
      'suppliers and products.',
      ' ',
      'Use the arrow keys and',
      'Enter to play.',
    ]);
    drawEngine.clearScrollArea();
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
        10, 8 + i * 8,
        WHITE1,
        'left'
      );
    });
  }

  onUpdate() {
    drawEngine.drawOverlay(1);

    this.showSoundOption ? this.renderSoundOption()
    : this.showAbout ? this.renderAbout()
    : this.showHelp ? this.renderHelp()
    : this.renderMenu();

    this.updateControls();
  }

  updateControls() {
    controls.updateSelection(
      this,
      this.showAbout || this.showHelp ? 100 : this.showSoundOption ? 1 : 4
    );

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      if (this.showSoundOption) {
        this.showSoundOption = false;
        if (this.selection === 1) {
          disableSound();
        }
        this.selection = 0;
      } else if (this.showAbout || this.showHelp) {
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
      keySound();
    }
  }
}

export const menuState = new MenuState();
