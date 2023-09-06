import { initAudio as initMarketMusic } from '@/core/audio';
import { WIDTH, drawEngine } from '@/core/draw-engine';
import GameData from '@/core/game-data';
import { State } from '@/core/state';
import { playStateMachine } from '@/game-state-machine';
import BuyState from './buy.state';

export const MARKET_TIME = 12000;

export interface Person {
  height: number
  step: number
  speed: number
}

class MarketState implements State {
  gameData: GameData;
  people: Person[] = [];
  curtainPos = 0;
  time = 0;

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

  onUpdate(timeElapsed = 0) {
    drawEngine.drawBrickWall();
    drawEngine.drawTent();
    drawEngine.drawBoxes();
    drawEngine.drawProducts(this.gameData.stock);
    drawEngine.drawState(this.gameData);
    drawEngine.drawPeople(this.people);
    drawEngine.drawFPS();
    drawEngine.drawClock(this.time);

    if (this.time < MARKET_TIME) {
      this.time += timeElapsed;
    }

    if (this.time > MARKET_TIME) {
      if (this.curtainPos > 0) {
        this.curtainPos = Math.max(0, this.curtainPos - timeElapsed / 1000);
        drawEngine.drawCurtains(this.curtainPos);
      } else {
        playStateMachine.setState(new BuyState(this.gameData));
      }
    } else if (this.curtainPos < 1) {
      this.curtainPos = Math.min(1, this.curtainPos + timeElapsed / 1000);
      drawEngine.drawCurtains(this.curtainPos);
    }
  }
}

export default MarketState;
