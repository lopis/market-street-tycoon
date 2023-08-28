import { drawEngine } from '@/core/draw-engine';
import GameData from '@/core/game-data';
import { APPLE } from '@/core/icons';
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
      for(let j = 0; j < stock; j++) {
        drawEngine.drawIcon(
          APPLE,
          36 + (j % 5) * 5 + i * 30 + j % 2,
          76 + Math.floor(j / 5) * 4,
        );
      }
    });
  };
}

export default MarketState;
