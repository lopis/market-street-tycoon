import { drawEngine } from '@/core/draw-engine';
import GameData from '@/core/game-data';
import { Icon, icons } from '@/core/icons';
import { State } from '@/core/state';

class MarketState implements State {
  gameData: GameData;

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  onUpdate() {
    drawEngine.drawBrickWall();
    drawEngine.drawTent();
    drawEngine.drawBoxes();
    Object.entries(this.gameData.stock).forEach(([type, stock], i) => {
      // @ts-ignore
      const icon : Icon = icons[type];
      const perRow = Math.floor(27 / icon.padding);
      const max = Math.min(stock, perRow * Math.ceil(25 / icon.padding));
      for(let j = 0; j < max; j++) {
        let rowOffset = icon.padding < 7 ? (Math.floor(j/perRow) % 2) * icon.padding/2 : 0;
        drawEngine.drawIcon(
          icon,
          37 + (j % perRow) * icon.padding + i * 30 + rowOffset,
          73 + Math.floor(j / perRow) * (icon.padding-1) - icon.y,
        );
      }
    });
    drawEngine.drawState(this.gameData);
  };
}

export default MarketState;
