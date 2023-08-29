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
      const perRow = Math.floor(27 / icon.spacing);
      const max = perRow * Math.ceil(25 / icon.spacing);
      for(let j = 0; j < max; j++) {
        let rowOffset = icon.spacing < 7 ? (Math.floor(j/perRow) % 2) * icon.spacing/2 : 0;
        drawEngine.drawIcon(
          icon,
          36 + (j % perRow) * icon.spacing + i * 30 + rowOffset,
          73 + Math.floor(j / perRow) * (icon.spacing-1) - icon.offset,
        );
      }
    });
  };
}

export default MarketState;
