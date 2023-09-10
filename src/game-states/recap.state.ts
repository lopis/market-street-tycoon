import { controls } from '@/core/controls';
import { A_WHITE, HEIGHT, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData, { ProductType, ProductValue } from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import BuyState from './buy.state';
import { icons } from '@/core/icons';
import { MARKET_TIME, MARKET_CUSTOMERS } from './market.state';

class RecapState implements State {
  gameData: GameData;
  selection = 0;
  curtainPos = 0;
  total = 0;
  spoiled: ProductValue = {};

  constructor(gameData: GameData) {
    this.gameData = gameData;
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
      const spoiled = Math.floor((this.gameData.spoilRate[product as ProductType] || 0) * stock);
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

    drawEngine.drawButton(
      WIDTH - 30,
      HEIGHT - 15,
      'white',
      'next'
    );

    const recap = this.gameData.history[this.gameData.week];
    drawEngine.context.save();
    drawEngine.context.rect(0, 12, WIDTH, HEIGHT - 12 - 20);
    drawEngine.context.clip();
    const recapSales = Object.entries(recap.sales);
    const rowHeight = 12 * 5;
    const scrollSpeed = 20;
    const totalHeight = Math.max(0, recapSales.length - 2) * rowHeight;
    if (this.selection > totalHeight / scrollSpeed) {
      this.selection = Math.round(totalHeight / scrollSpeed);
    }
    drawEngine.context.translate(0, -this.selection * scrollSpeed);
    recapSales.map((productSales, index) => {
      const row = index * rowHeight + 15;
      const product: ProductType = productSales[0] as ProductType;
      const sales: number = productSales[1];

      drawEngine.drawIcon(icons[product], 3, row);
      const demandIcons = 10;
      const d = Math.round(Math.min(demandIcons, demandIcons * (recap.demand[product] || 0)));
      drawEngine.drawText(`${product}`, 10, 12, row, A_WHITE);
      drawEngine.drawText(`Demand:  ${'▮'.repeat(d)}${'▯'.repeat(demandIcons - d)}`, 10, 2, row + 12, A_WHITE);
      const price = (this.gameData.price[product] || 0);
      const total = sales * price;
      drawEngine.drawText(`Sales:  ${sales} x ${price}$ = ${total}$`, 10, 2, row + 24, A_WHITE);
      drawEngine.drawText(
        `Spoiled:  ${this.gameData.spoilRate[product] ? this.spoiled[product] : 'does not spoil'}`,
        10, 2, row + 36,
        A_WHITE
      );
    });
    drawEngine.context.restore();

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
        '▲'
      );
      drawEngine.drawButton(
        WIDTH - 10,
        HEIGHT / 2 + 20,
        A_WHITE,
        '▼'
      );
      const scrollLength = 40 + 20 - height;
      const scrollbarHeight = Math.floor(scrollLength * 2 / recapSales.length);
      const scrollbarPosY = Math.round((scrollLength - scrollbarHeight) * this.selection / recapSales.length);
      drawEngine.context.fillStyle = 'white';
      drawEngine.context.fillRect(
        WIDTH - 10 - width / 2,
        HEIGHT / 2 - 40 + height + scrollbarPosY,
        width,
        scrollbarHeight
      );
    }

    this.updateControls();
  }

  updateControls() {
    controls.updateSelection(this, 99);
    if (controls.isConfirm && !controls.previousState.isConfirm) {
      this.gameData.week++;
      this.next();
    }
  }
}

export default RecapState;
