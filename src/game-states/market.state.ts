import { initAudio as initMarketMusic } from '@/core/audio';
import { WIDTH, drawEngine } from '@/core/draw-engine';
import GameData from '@/core/game-data';
import { Icon, icons } from '@/core/icons';
import { State } from '@/core/state';

export interface Person {
  height: number
  step: number
  speed: number
}

class MarketState implements State {
  gameData: GameData;
  people: Person[] = [];

  constructor(gameData: GameData) {
    this.gameData = gameData;
    let people = 20;
    while(people--) {
      const dir = Math.random() > 0.5 ? 1 : -1;
      const p : Person = {
        height: Math.round(Math.random() * 10 - 5),
        step: Math.round(WIDTH * Math.random() * dir),
        speed: (Math.random() * 0.5 + 0.5) * dir,
      };
      this.people.push(p);
    }
  }

  onEnter() {
    initMarketMusic();
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
        const rowOffset = icon.padding < 7 ? (Math.floor(j/perRow) % 2) * icon.padding/2 : 0;
        drawEngine.drawIcon(
          icon,
          37 + (j % perRow) * icon.padding + i * 30 + rowOffset,
          73 + Math.floor(j / perRow) * (icon.padding-1) - icon.y,
        );
      }
    });
    drawEngine.drawState(this.gameData);
    drawEngine.drawPeople(this.people);
    drawEngine.drawFPS();
  }
}

export default MarketState;
