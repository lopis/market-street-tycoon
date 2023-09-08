import { MARKET_TIME, Person } from '@/game-states/market.state';
import GameData, { ProductValue } from './game-data';
import { Icon, PALETTE, icons } from './icons';
import { easeInOutSine } from './util';

export const HEIGHT = 144;
export const WIDTH = 160;

export const RED1 = '#c3472c',
RED2 = '#752a1a',
WHITE1 = '#ffeae0',
WHITE2 = '#f7cebd',
BROWN1 = '#b77e62',
BROWN2 = '#6d412e',
BLUE = '#1155bb',
PURPLE = '#4621ac',
GREEN = '#17812e',
GRAY = '#7d736e',
A_WHITE = '#FFFFFF88',
A_BLACK = '#00000088',
BLACK = '#322722';

class DrawEngine {
  //   context.strokeStyle = 'black';
  //   context.lineWidth = 4;
  //   context.strokeText(text, x, y);
  //   context.fillStyle = color;
  //   context.fillText(text, x, y);
  // }
  // Adapted from https://github.com/xem/miniPixelFont
  context: CanvasRenderingContext2D;
  fontContext: CanvasRenderingContext2D;

  fps = 60;
  time = 0;

  constructor() {
    /* global c2d -- the canvas element */
    this.context = c2d.getContext('2d');
    // c2d.addEventListener('click', () => {
    //   alert(`Use the ${screen.width > 900 ? 'arrow keys and Enter' : 'game pad below'} to control the game.`);
    // }, { once: true });
    this.fontContext = font.getContext('2d');
    this.context.canvas.height = HEIGHT;
    this.context.canvas.width = WIDTH;
  }

  clearFontContext() {
    this.fontContext.clearRect(0, 0, this.fontContext.canvas.width, this.fontContext.canvas.height);
  }

  clear() {
    this.clearFontContext();
    this.context.clearRect(0, 0, WIDTH, HEIGHT);
  }

  // drawText(text: string, fontSize: number, x: number, y: number, color = 'white', textAlign: 'center' | 'left' | 'right' = 'center') {
  //   const context = this.context;

  //   context.font = `${fontSize}px mono, monospaced`;
  //   context.textAlign = textAlign;
  //   context.strokeStyle = 'black';
  //   context.lineWidth = 4;
  //   context.strokeText(text, x, y);
  //   context.fillStyle = color;
  //   context.fillText(text, x, y);
  // }

  // Adapted from https://github.com/xem/miniPixelFont
  // threshold from 0 to 255
  drawText(text: string, fontSize: number, x: number, y: number, color = 'white', textAlign : CanvasTextAlign = 'left', threshold = 80) {
    const font = `${fontSize}px sans`;

    /* Compute and draw */
    this.clearFontContext();
    this.fontContext.font=font;
    this.fontContext.textBaseline='middle';
    this.fontContext.textAlign = textAlign;
    const offset = textAlign == 'center' ? 125 : textAlign == 'right' ? 250 : 0;
    this.fontContext.fillText(text, offset, fontSize/2);
    const I = this.fontContext.getImageData(0,0,250,32);
    for (let i=0;i<250;i++){
      for (let j=0;j<32;j++){
        if (
          I.data[(j*250+i)*4+1] > threshold
          || I.data[(j*250+i)*4+2] > threshold
          || I.data[(j*250+i)*4+3] > threshold
        ) {
          this.context.fillStyle = color;
          this.fontContext.fillRect(i,j,1,1);
          this.context.fillRect(i + x - offset, j + y, 1, 1);
        }
      }
    }
  }

  // https://rosettacode.org/wiki/Bitmap/Bresenham's_line_algorithm#JavaScript
  drawLine(x0: number, y0: number, x1: number, y1: number, color: string) {
    let x = Math.round(x0);
    let y = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    let dx = x1 - x0;
    let dy = y1 - y0;
    let dmax = Math.max(Math.abs(dx), Math.abs(dy));
    dx = dx / dmax;
    dy = dy / dmax;

    const points = [ ];
    this.context.fillStyle = color;
    while(dmax--) {
      points.push([x, y]);
      x += dx;
      y += dy;
    }

    this.context.beginPath();
    points.map(([px, py]) => {
      this.context.rect(Math.round(px), Math.round(py), 1, 1);
    });
    this.context.fill();
  }

  drawOverlay(week: number) {
    const colors = [PURPLE, BLACK, RED2, GREEN, BLUE];
    this.context.fillStyle = colors[week % colors.length];
    this.context.fillRect(0, 0, WIDTH, HEIGHT);
  }

  drawHeader(title: string, gameData: GameData, total = -1) {
    this.context.fillStyle = A_BLACK;
    this.context.fillRect(0, 0, WIDTH, 12);
    this.drawText(`Week ${gameData.week} - ${title}`, 10, 1, 1, RED1);
    this.drawText(`${gameData.money}$`, 10, WIDTH, 1, GREEN, 'right');
    if (total != -1) {
      this.drawText(`+ ${total}$`, 10, WIDTH, 13, GREEN, 'right');
    }
  }

  drawCircle(xc: number, yc: number, radius: number, skew = 0) {
    let x = radius, y = 0, cd = 0;

    // middle line
    this.context.rect(xc - x, yc, radius<<1, 1);

    while (x > y) {
      cd -= (--x) - (++y);
      if (cd < 0) cd += x++;
      let offset = Math.round(skew * x);
      this.context.rect(xc - y + offset, yc - x, y<<1, 1);    // upper 1/4
      this.context.rect(xc - y - offset, yc + x, y<<1, 1);    // lower 4/4
      offset = Math.round(skew * y);
      this.context.rect(xc - x + offset, yc - y, x<<1, 1);    // upper 2/4
      this.context.rect(xc - x - offset, yc + y, x<<1, 1);    // lower 3/4
    }
  }

  drawBrick(x: number, y: number, width: number, height: number) {

    this.context.fillStyle = BLACK;
    this.context.fillRect(x, y, width, height);
    this.context.fillStyle = GRAY;
    this.context.fillRect(x + 1, y + 1, width - 1, height - 1);
  }

  drawBrickWall() {
    const height = 16;
    const width = 26;
    for (let row = 0; row <= 10; row++) {
      for (let col = 0; col <= 6; col++) {
        const offset = row % 2 ? width - 8 : width * 0.5 - 8;
        this.drawBrick(col * width - offset, row * height - 5, width, height);
      }
    }
    this.context.fillStyle = '#40312a';
    this.context.fillRect(0, 90, WIDTH, 54);
  }

  drawCurtains(pos: number) {
    const width = WIDTH / 16;
    const height = HEIGHT / 4;
    let i = 4;
    while (i--) {
      let j = 4;
      while (j--) {
        const p = Math.round(easeInOutSine(pos) * (WIDTH + 32 * j));
        const y = j * height;
        this.context.fillStyle = RED1;
        const w1 = width * 1.7;
        this.context.fillRect(i * width * 2 - p, y, w1, height);
        this.context.fillRect(WIDTH - (i+1) * width * 2 + p, y, w1, height);
        this.context.fillStyle = RED2;
        const w2 = width * 0.3;
        this.context.fillRect(WIDTH - (i+1) * width * 2 + w1 + p, y, w2, height);
        this.context.fillRect(i * width * 2 - p + w1, y, w2, height);
      }
    }
  }

  gradient(x0: number, y0: number, x1: number, y1: number, stops: Array<Array<any>>) {
    const gradient = this.context.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(([offset, color], index) => {
      if (index != 0) {
        gradient.addColorStop(stops[index-1][0], color);
      }
      gradient.addColorStop(offset, color);
    });

    return gradient;
  }

  drawTent() {
    // sticks
    this.context.fillStyle = this.gradient(30, 0, 38, 0, [[2/8, BROWN2], [6/8, BROWN1], [1, BROWN2]]);
    this.context.fillRect(30, 23, 8, 85);
    this.context.fillStyle = this.gradient(WIDTH - 38, 0, WIDTH - 30, 0, [[2/8, BROWN2], [6/8, BROWN1], [1, BROWN2]]);
    this.context.fillRect(WIDTH - 38, 23, 8, 85);
    this.context.fillStyle = this.gradient(0, 23, 0, 27, [[1/4, BROWN2], [3/4, BROWN1], [1, BROWN2]]);
    this.context.fillRect(18, 23, WIDTH - 36, 4);

    // red and white cloth
    for (let i = 0; i < 7 ; i++) {
      this.context.beginPath();
      this.context.fillStyle = i % 2 ? BROWN1 : RED2;
      this.drawCircle(32 + i * 16, 32, 8);
      this.context.fill();
      this.context.beginPath();
      this.context.fillStyle = i % 2 ? WHITE2 : RED1;
      this.drawCircle(32 + i * 16, 30, 8);
      this.context.rect(24 + i * 16, 22, 16, 8);
      this.context.fill();
    }
  }

  drawBoxes() {
    for (let i = 0; i < 3 ; i++) {
      const width = 30;
      const offset = (WIDTH - 3 * width) / 2;

      // backdrop
      this.context.fillStyle = BROWN2;
      this.context.fillRect(offset + i * width, 76, width, 36);

      // front planks
      this.context.fillStyle = BROWN1;
      this.context.fillRect(offset + i * width + 1, 100, width - 2, 3);
      this.context.fillRect(offset + i * width + 1, 104, width - 2, 3);
      this.context.fillRect(offset + i * width + 1, 108, width - 2, 3);

      // inside
      this.context.fillStyle = BLACK;
      this.context.fillRect(offset + i * width + 1, 77, width - 2, 22);
    }
  }

  drawButton(x: number, y: number, color: string, text: string, active = false) {
    const activeOffset = active ? 1 : 0;
    this.context.strokeStyle = color;
    this.context.fillStyle = color;
    const width = text.length * 10;
    this.context.translate(activeOffset, activeOffset);
    this.context.fillRect(x - width/2, y, width, 13);
    this.drawText(text, 10, x, y + 2, BLACK, 'center');
    this.context.translate(-activeOffset, -activeOffset);
  }

  // Adapted from https://xem.github.io/miniPixelArt/
  drawIcon(icon: Icon, x: number, y: number) {
    const imageData: number[] = [];

    // pixel decoding
    icon.data.replace(
      /./g,
      // @ts-ignore - we don't care about returning a value from this.
      a => {
        // @ts-ignore
        const z = a.charCodeAt();
        imageData.push(z&7);
        imageData.push((z>>3)&7);
      }
    );

    // drawing
    for (let j = 0; j < icon.size; j++) {
      for (let i = 0; i < icon.size; i++) {
        if (imageData[j * icon.size + i]) {
          const index = 3 * (imageData[j * icon.size + i]-1);
          this.context.fillStyle = '#' + PALETTE.substring(index, index + 3);
          this.context.fillRect(x + i, y + j, 1, 1);
        }
      }
    }
  }

  drawProducts(stock: ProductValue, productSales: ProductValue) {
    Object.entries(stock).forEach(([type, amount], i) => {
      // @ts-ignore -- type is a valid key
      const finalStock = Math.floor(amount - productSales[type]);
      // @ts-ignore
      const icon : Icon = icons[type];
      const perRow = Math.floor(27 / icon.padding);
      // @ts-ignore
      const max = Math.min(finalStock, perRow * Math.ceil(25 / icon.padding));
      for(let j = 0; j < max; j++) {
        const rowOffset = icon.padding < 7 ? (Math.floor(j/perRow) % 2) * icon.padding/2 : 0;
        this.drawIcon(
          icon,
          37 + (j % perRow) * icon.padding + i * 30 + rowOffset,
          73 + Math.floor(j / perRow) * (icon.padding-1) - icon.y,
        );
      }
    });
  }

  drawState(data: GameData, productSales: ProductValue) {
    const width = 50;
    const margin = 3;
    const income = Object.entries(productSales).reduce((total, [product, sales]) => {
      //@ts-ignore - product is a valid key
      const price = data.price[product] || 0;
      return total + price * Math.floor(sales);
    }, 0);
    this.context.fillStyle = WHITE2;
    this.context.fillRect(margin, margin, width, 12);
    this.context.fillRect(WIDTH - margin - width, margin, width, 12);
    this.drawText(`Week ${data.week}`, 10, margin + 2, margin + 2, BLACK);
    this.drawText(`${data.money + income}$`, 10, WIDTH - margin - 2, margin + 2, BLACK, 'right');
  }

  drawPeople(people: Person[]) {
    this.context.beginPath();
    this.context.fillStyle = '#00000055';
    const xDiff = 17;
    const yDiff = 20;
    const yBase = 120;
    people.forEach(p => {
      const y = yBase + p.height + Math.round(Math.sin(p.step / 2));
      const x = Math.round(p.step);
      this.drawCircle(x + xDiff, y, 10, 0.7);
      this.drawCircle(x, y + yDiff, 15, 0.7);
      p.step += p.speed;
      if (p.step < -40) {
        p.step = WIDTH+40;
      } else if (p.step > WIDTH+40) {
        p.step = -40;
      }
    });
    this.context.fill();
  }

  drawClock(time: number) {
    this.context.beginPath();
    this.context.fillStyle = WHITE2;
    this.drawCircle(WIDTH / 2, 8, 7);
    this.context.fill();
    const angle = 2 * Math.PI * time / MARKET_TIME - Math.PI/2;
    const xc = WIDTH / 2;
    const yc = 8;
    const r = 6;
    this.drawLine(xc, yc, xc + r * Math.cos(angle), yc + r * Math.sin(angle), BLACK);
  }

  drawFPS() {
    const diff = performance.now() - this.time;
    this.time = performance.now();
    this.fps = 0.99 * this.fps + 0.01 * (1000 / diff);
    this.context.fillText(`${Math.round(this.fps)}FPS`, 10, HEIGHT - 10);
  }
}

export const drawEngine = new DrawEngine();
