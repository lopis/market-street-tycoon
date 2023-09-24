import { controls } from '@/core/controls';
import { A_WHITE, HEIGHT, WHITE1, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData, { ProductType, products } from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import MarketState from './market.state';
import BuyState from './buy.state';
import { icons } from '@/core/icons';
import { KEY_DEFAULT, KEY_HIGH, keySound } from '@/core/audio';

const STAR_FULL = '*';
const STAR_EMPTY = ')';

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
    drawEngine.drawHeader('Stock', this.gameData);

    if (this.isStockEmpty) {
      drawEngine.drawText(
        'Your stock is empty',
        WIDTH / 2,
        HEIGHT / 3,
        WHITE1,
        'center'
      );
    }

    let index = 0;
    const rowHeight = 12 * 5;
    const scrollPosition = -Math.max(0, Math.min(this.products.length - 2, this.selection)) * rowHeight;
    drawEngine.setScrollArea(scrollPosition);
    this.products
    .forEach((product) => {
      const row = index * rowHeight + 15;
      const stock = this.gameData.stock[product];
      const avgCost = this.gameData.avgCost[product] || 0;

      if (!stock) return;

      drawEngine.drawIcon(icons[product], 3, row + 1);
      drawEngine.drawText(product, 14, row + 1, WHITE1);
      drawEngine.drawText(`Stock: ${stock}`, 1, row + 12, WHITE1);
      drawEngine.drawText(`Avg cost: ${avgCost}$`, 1, row + 24, WHITE1);
      const reputation =  Math.min(5, 1 + Math.round(4 * (this.gameData.reputation[product] || 0) / 100));
      drawEngine.drawText(
        `Reputation: ${STAR_FULL.repeat(reputation)}${STAR_EMPTY.repeat(5 - reputation)}`,
        1, row + 36,
        WHITE1
      );

      ['-', '+'].map((s,i) => drawEngine.drawButton(
        WIDTH - 60 + i*53,
        row + 5,
        this.selection === index ? 'white' : A_WHITE,
        s,
        this.active[0] === index && this.active[1] === s,
      ));
      const price = this.gameData.price[product as ProductType];
      drawEngine.drawText(
        price ? `${price}$` : 'N/A',
        WIDTH - 33, row + 7,
        WHITE1,
        'center'
      );
      index++;
    });
    drawEngine.clearScrollArea();

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
        keySound(isLeft ? KEY_DEFAULT : KEY_HIGH);
        this.updatePrice(isLeft);
      } else {
        keySound();
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
      keySound(KEY_HIGH);
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
      this.gameData.price[product] = Math.max(0, this.gameData.price[product] + (isLeft ? -1 : 1));
    }
  }
}

export default StockState;
