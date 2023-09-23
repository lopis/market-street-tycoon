import { controls } from '@/core/controls';
import { A_WHITE, HEIGHT, WHITE1, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData, { ProductType, ProductValue } from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import BuyState from './buy.state';
import { icons } from '@/core/icons';
import { MARKET_TIME, MARKET_CUSTOMERS } from './market.state';
import { trigger } from '@/core/events';
import { keySound } from '@/core/audio';

const SQUARE_FULL = '(';
const SQUARE_EMPTY = '\'';

class RecapState implements State {
  gameData: GameData;
  selection = 0;
  curtainPos = 0;
  total = 0;
  spoiled: ProductValue = {};
  productsForSale: ProductType[] = [];

  constructor(gameData: GameData, productsForSale: ProductType[]) {
    this.gameData = gameData;
    this.productsForSale = productsForSale;
  }

  next() {
    playStateMachine.setState(new BuyState(this.gameData));
  }

  onLeave() {
    this.gameData.money += this.total;
  }

  onEnter() {
    const recap = this.gameData.history[this.gameData.week];
    Object.keys(recap.sales).map((product) => {
      const sales = recap.sales[product as ProductType] = Math.round(recap.sales[product as ProductType] || 0);
      recap.demand[product as ProductType] = (recap.demand[product as ProductType] || 0) * MARKET_TIME / MARKET_CUSTOMERS;
      this.total += sales * (this.gameData.price[product as ProductType] || 0);
      const stock = Math.max(
        0,
        (this.gameData.stock[product as ProductType] || 0) - sales
      );
      const spoiled = Math.round((this.gameData.spoilProb[product as ProductType] || 0) * stock);
      this.gameData.stock[product as ProductType] = stock - spoiled;
      this.spoiled[product as ProductType] = spoiled;
      this.gameData.reputation[product as ProductType] = (
        (this.gameData.reputation[product as ProductType] || 0) + sales
      );
    });
  }

  onUpdate(timeElapsed = 0) {
    drawEngine.drawOverlay(this.gameData.week);
    drawEngine.drawHeader('Summary', this.gameData, this.total);

    if (this.gameData.money + this.total === 0) {
      [
        'You ran out of money.',
        'GAME OVER',
      ].map((line, i) => {
        drawEngine.drawText(
          line,
          WIDTH / 2,
          HEIGHT / 3 + 15 * i,
          WHITE1,
          'center'
        );
      });
      drawEngine.drawButton(
        WIDTH / 2,
        HEIGHT - 15,
        'white',
        'return'
      );
    } else {

      drawEngine.drawButton(
        WIDTH - 30,
        HEIGHT - 15,
        'white',
        'next'
      );

      const productsInStock = Object.values(this.gameData.stock).filter(s => !!s).length;
      const recap = this.gameData.history[this.gameData.week];
      const recapSales = Object.entries(recap.sales);
      const rowHeight = 12 * 5;
      const scrollSpeed = 20;
      const totalHeight = Math.max(0, productsInStock - 2) * rowHeight;
      const maxSelection = totalHeight / scrollSpeed;
      if (this.selection > maxSelection) {
        this.selection = Math.round(totalHeight / scrollSpeed);
      }
      drawEngine.setScrollArea(-this.selection * scrollSpeed);
      recapSales.map((productSales, index) => {
        const row = index * rowHeight + 15;
        const product: ProductType = productSales[0] as ProductType;
        const sales: number = productSales[1];

        drawEngine.drawIcon(icons[product], 3, row);
        const demandIcons = 10;
        const d = Math.round(Math.min(demandIcons, demandIcons * (recap.demand[product] || 0)));
        drawEngine.drawText(`${product}`, 12, row, WHITE1);
        drawEngine.drawText(`Demand:  ${SQUARE_FULL.repeat(d)}${SQUARE_EMPTY.repeat(demandIcons - d)}`, 2, row + 12, WHITE1);
        const price = (this.gameData.price[product] || 0);
        const total = sales * price;
        drawEngine.drawText(`Sales:  ${sales} x ${price}$ = ${total}$`, 2, row + 24, WHITE1);
        drawEngine.drawText(
          this.gameData.spoilProb[product] ? `Spoiled: ${this.spoiled[product]}` : 'Does not spoil',
          2, row + 36,
          WHITE1
        );
      });
      drawEngine.clearScrollArea();

      if (this.curtainPos < 1) {
        // Start, open curtains
        this.curtainPos = Math.min(1, this.curtainPos + timeElapsed / 1000);
        drawEngine.drawCurtains(this.curtainPos);
      }

      if (recapSales.length > 2) {
        // Scroll bar
        const {width, height} = drawEngine.drawButton(
          WIDTH - 10,
          HEIGHT / 2 - 40,
          A_WHITE,
          '<'
        );
        drawEngine.drawButton(
          WIDTH - 10,
          HEIGHT / 2 + 20,
          A_WHITE,
          '>'
        );
        const scrollLength = 40 + 20 - height;
        const scrollbarHeight = Math.floor(scrollLength * 2 / productsInStock);
        const scrollbarPosY = Math.round((scrollLength - scrollbarHeight) * this.selection / maxSelection);
        drawEngine.context.fillStyle = 'white';
        drawEngine.context.fillRect(
          WIDTH - 10 - width / 2,
          HEIGHT / 2 - 40 + height + scrollbarPosY,
          width,
          scrollbarHeight
        );
      }
    }

    this.updateControls();
  }

  updateControls() {
    controls.updateSelection(this, 99);
    if (controls.isConfirm && !controls.previousState.isConfirm) {
      if (this.gameData.money + this.total === 0) {
        this.gameData.delete();
        trigger('restart');
      }
      this.gameData.week++;
      keySound(-2);
      this.next();
    }
  }
}

export default RecapState;
