import { controls } from '@/core/controls';
import { A_WHITE, HEIGHT, WIDTH, drawEngine } from '@/core/draw-engine';
import GameData, { ProductType } from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import BuyState from './buy.state';
import { icons } from '@/core/icons';
import { MARKET_TIME } from './market.state';

class RecapState implements State {
  gameData: GameData;
  selection = 0;
  curtainPos = 0;
  total = 0;

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
      const s = recap.sales[product as ProductType] = Math.round(recap.sales[product as ProductType] || 0);
      recap.demand[product as ProductType] = (recap.demand[product as ProductType] || 0) * MARKET_TIME / 50;
      this.total += s * (this.gameData.price[product as ProductType] || 0);
      this.gameData.stock[product as ProductType] = Math.max(
        0,
        (this.gameData.stock[product as ProductType] || 0) - s
      );
    });
  }

  onUpdate(timeElapsed = 0) {
    drawEngine.drawOverlay(this.gameData.week);
    drawEngine.drawHeader('Summary', this.gameData, this.total);

    drawEngine.drawButton(
      WIDTH / 2,
      HEIGHT - 15,
      'white',
      'next'
    );

    const recap = this.gameData.history[this.gameData.week];
    Object.entries(recap.sales).map((productSales, index) => {
      const product: ProductType = productSales[0] as ProductType;
      const sales: number = productSales[1];
      const row = index * 36 + 24;

      drawEngine.drawIcon(icons[product], 3, row);
      drawEngine.drawText(`${product}  ${this.gameData.price[product]}$`, 10, 12, row, A_WHITE);
      const d = Math.min(8, 8 * (recap.demand[product] || 0));
      drawEngine.drawText(`Demand:  ${'█'.repeat(d)}${'░'.repeat(8 - d)}`, 10, 12, row + 12, A_WHITE);
      const price = (this.gameData.price[product] || 0);
      const total = sales * price;
      drawEngine.drawText(`Sales:  ${sales} x ${price}$ = ${total}$`, 10, 12, row + 24, A_WHITE);
    });

    if (this.curtainPos < 1) {
      // Start, open curtains
      this.curtainPos = Math.min(1, this.curtainPos + timeElapsed / 1000);
      drawEngine.drawCurtains(this.curtainPos);
    }

    this.updateControls();
  }

  updateControls() {
    if (controls.isConfirm && !controls.previousState.isConfirm) {
      this.gameData.week++;
      this.next();
    }
  }
}

export default RecapState;
