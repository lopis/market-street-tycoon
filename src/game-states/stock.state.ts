import { controls } from '@/core/controls';
import { A_WHITE, HEIGHT, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData, { ProductType, products } from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import MarketState from './market.state';
import BuyState from './buy.state';
import { icons } from '@/core/icons';
import { keySound } from '@/core/audio';

class StockState implements State {
  gameData: GameData;
  selection = 0;
  active = [-1, ''];
  private products: ProductType[] = [];
  curtainPos = 2;
  backSelected = false;
  isStockEmpty = false;

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  back() {
    playStateMachine.setState(new BuyState(this.gameData, true));
  }

  next() {
    playStateMachine.setState(new MarketState(this.gameData));
  }

  onEnter() {
    this.products = products.filter(product => {
      const stock = this.gameData.stock[product];
      if (!this.gameData.price[product]){
        this.gameData.price[product] = 1;
      }
      return !!stock;
    });
    this.isStockEmpty = !this.products.length;
    this.backSelected = this.isStockEmpty;
  }

  onUpdate(timeElapsed = 0) {
    drawEngine.drawOverlay(this.gameData.week);
    drawEngine.drawHeader('Manage stock', this.gameData);

    if (this.isStockEmpty) {
      drawEngine.drawText(
        'Your stock is empty',
        12,
        WIDTH / 2,
        HEIGHT / 3,
        A_WHITE,
        'center'
      );
    }

    let index = 0;
    drawEngine.context.save();
    drawEngine.context.rect(0, 12, WIDTH, HEIGHT - 12 - 20);
    drawEngine.context.clip();
    const rowHeight = 12 * 5;
    drawEngine.context.translate(
      0,
      -Math.max(0, Math.min(this.products.length - 2, this.selection)) * rowHeight
    );
    this.products
    .forEach((product) => {
      const row = index * rowHeight + 15;
      const stock = this.gameData.stock[product];
      const avgCost = this.gameData.avgCost[product] || 0;

      if (!stock) return;

      drawEngine.drawIcon(icons[product], 3, row + 1);
      drawEngine.drawText(product, 10, 14, row + 1, A_WHITE);
      drawEngine.drawText(`Stock: ${stock}`, 10, 1, row + 12, A_WHITE);
      drawEngine.drawText(`Avg cost: ${avgCost}$`, 10, 1, row + 24, A_WHITE);
      const reputation =  1 + Math.round(4 * (this.gameData.reputation[product] || 0) / 100);
      drawEngine.drawText(
        `Reputation: ${'★'.repeat(reputation)}${'✩'.repeat(5 - reputation)}`,
        10, 1, row + 36,
        A_WHITE
      );

      ['–', '+'].map((s,i) => drawEngine.drawButton(
        WIDTH - 60 + i*53,
        row + 5,
        this.selection === index ? 'white' : A_WHITE,
        s,
        this.active[0] === index && this.active[1] === s,
      ));
      drawEngine.drawText(
        `${this.gameData.price[product as ProductType]}$`,
        10, WIDTH - 33, row + 7,
        A_WHITE,
        'center'
      );
      index++;
    });
    drawEngine.context.restore();

    !this.isStockEmpty && drawEngine.drawButton(
      WIDTH - 30,
      HEIGHT - 15,
      !this.backSelected && this.selection === this.products.length ? 'white' : A_WHITE,
      'next',
    );

    drawEngine.drawButton(
      30,
      HEIGHT - 15,
      this.backSelected && this.selection === this.products.length ? 'white' : A_WHITE,
      'back',
    );

    if (this.curtainPos != 2) {
      this.curtainPos = Math.min(1, this.curtainPos + timeElapsed / 1000);
      drawEngine.drawCurtains(1 - this.curtainPos);
    }

    this.updateControls();
  }

  updateControls() {
    controls.updateSelection(this, this.products.length);

    const isLeft = controls.isLeft && !controls.previousState.isLeft;
    const isRight = controls.isRight && !controls.previousState.isRight;
    if((isLeft || isRight)) {
      if (this.selection < this.products.length) {
        keySound(isLeft ? 2 : -2);
        this.updatePrice(isLeft);
      } else {
        keySound(2);
        this.backSelected = !this.backSelected;
      }
    }

    if (controls.isConfirm && !controls.previousState.isConfirm && this.curtainPos === 2) {
      if (this.selection == this.products.length) {
        if (this.backSelected) {
          this.back();
        } else {
          this.curtainPos = 0;
          setTimeout(() => {
            this.next();
          }, 1200);
        }
      }
      keySound(-2);
    }
  }

  updatePrice(isLeft: boolean) {
    this.active = [this.selection, isLeft ? '–' : '+'];
    setTimeout(() => {
      this.active = [-1, ''];
    }, 100);

    const product = this.products[this.selection];
    if (product && this.gameData.price[product as ProductType] != undefined) {
      // @ts-ignore
      this.gameData.price[product] = Math.max(1, this.gameData.price[product] + (isLeft ? -1 : 1));
    }
  }
}

export default StockState;
