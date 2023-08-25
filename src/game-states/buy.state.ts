import { controls } from '@/core/controls';
import { drawEngine } from '@/core/draw-engine';
import GameData from '@/core/game-data';
import { State } from '@/core/state';
// import { drawEngine } from '@/core/draw-engine';
// import { controls } from '@/core/controls';
// import { gameStateMachine } from '@/game-state-machine';
// import { menuState } from '@/game-states/menu.state';

class BuyState implements State {
  gameData: GameData;
  selectedSupplier: number = 0;

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter() {

  }

  onUpdate() {
    this.gameData.suppliers.forEach((supplier, index) => {
      const row = index * 24 + 24;

      drawEngine.drawText(supplier.name, 10, 1, 1 + row, 'gray');
      const productLine = `${supplier.product}  -  ${supplier.price}$`;
      drawEngine.drawText(productLine, 10, 1, row + 10, 'gray');

      drawEngine.drawButton(
        drawEngine.canvasWidth - 40,
        row + 5,
        this.selectedSupplier === index ? 'white' : 'gray',
        'BUY'
      );
    });
    
    this.updateControls();
  }

  updateControls() {
    if (controls.isUp && !controls.previousState.isUp && this.selectedSupplier > 0) {
      this.selectedSupplier--;
    }
    if (controls.isDown && !controls.previousState.isDown && this.selectedSupplier +1 < this.gameData.suppliers.length) {
      this.selectedSupplier++;
    }

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      // buy
    }
  }
}

export default BuyState;
