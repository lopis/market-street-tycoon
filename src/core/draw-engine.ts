import { MARKET_TIME, Person } from '@/game-states/market.state';
import GameData, { ProductType, ProductValue } from './game-data';
import { Icon, icons } from './icons';
import { easeInOutSine } from './util';
import { tinyFont } from './font';

export const HEIGHT = 144;
export const WIDTH = 160;

export const RED1 = '#c3472c',
RED2 = '#631909',
WHITE1 = '#ffeae0',
WHITE2 = '#d5ad9b',
BROWN1 = '#de7c4b',
BROWN2 = '#8f3e15',
BLUE = '#004fc5',
PURPLE = '#2f00b1',
GREEN = '#00771a',
YELLOW = '#ea0',
GRAY = '#807b78',
A_WHITE = '#FFFFFF88',
A_BLACK = '#00000088',
BLACK = '#251108';

export const PALETTE = [
  '533', // black
  'c42', // red
  '2c4', // green
  '15b', // blue
  'ea0', // yellow
  'ddd', // white
  '642', // brown
].join('');

const shorterMoney = (money: number) => {
  return money < 1000 ? money
  : money < 1000000 ? `${Math.round(money / 100) / 10}k`
  : `${Math.round(money / 1000000) / 10}M`;
};

const hexToRgb = (hex: string) : number[] => {
  // @ts-ignore
  return hex.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i,
    (m, r, g, b, a) => '#' + r + r + g + g + b + b + a + a)
    .substring(1)
    .match(/.{2}/g)
    .map(x => parseInt(x, 16)
  );
};

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

  scrollPosition = 0;
  scrollLimit = HEIGHT;
  bitmaps: {[key: string]: ImageBitmap} = {};

  constructor() {
    /* global c2d -- the canvas element */
    this.context = c2d.getContext('2d');
    // c2d.addEventListener('click', () => {
    //   alert(`Use the ${screen.width > 900 ? 'arrow keys and Enter' : 'game pad below'} to control the game.`);
    // }, { once: true });
    this.fontContext = font.getContext('2d', { willReadFrequently: true });
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

  setScrollArea(scrollPosition: number) {
    this.context.save();
    this.context.rect(0, 12, WIDTH, HEIGHT - 30);
    this.context.clip();
    this.context.translate(0, scrollPosition);
    this.scrollPosition = scrollPosition;
    this.scrollLimit = HEIGHT - 30 - scrollPosition;
  }

  clearScrollArea() {
    this.context.restore();
    this.scrollPosition = 0;
    this.scrollLimit = HEIGHT;
  }

  drawText(text: string, x: number, y: number, color = WHITE1, textAlign : CanvasTextAlign = 'left') {
    if (!text) text = ' ';
    const width = 6 * text.length;
    const id = text+color;
    const offsetX = textAlign === 'left' ? 0 : textAlign === 'center' ? width / 2 : width;
    if (this.bitmaps[id]) {
      this.context.drawImage(this.bitmaps[id], x - offsetX, y);
    } else {
      const imageData = new ImageData(width, 5);
      // this.context.getImageData(x - offsetX, y + offsetY, width, 5);
      const [r, g, b, a] = hexToRgb(color);
      text.toUpperCase().split('').forEach((character: string, i) => {
        // @ts-ignore
        const letter = character === ' ' ? '0' : tinyFont[character.charCodeAt(0) - 35];
        const paddedBinary = String(parseInt(letter, 36).toString(2)).padStart(25, '0');
        paddedBinary.split('').forEach((bit, j) => {
          if (bit !== '0') {
            const index = (i * 6 + j % 5 + width * Math.floor(j / 5)) * 4;
            imageData.data[index] =     r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b;
            imageData.data[index + 3] = a || 255;
          }
        });
      });
      createImageBitmap(imageData)
      .then(bitmap => {
        this.bitmaps[id] = bitmap;
      });
    }
  }

  // Adapted from https://github.com/xem/miniPixelFont
  // threshold from 0 to 255
  drawRealText(text: string, fontSize: number, x: number, y: number, color = 'white', textAlign : CanvasTextAlign = 'left', threshold = 70) {
    const font = `${fontSize}px sans, Droid Sans, Arial, Helvetica`;

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

  /**
   * Draws a pixelated line from (x0,y0) to (x1,y1).
   * This is used because the canvas is only able to draw
   * anti-aliased lines which don't fit the pixel-art aesthetics.
   * It is terribly inneficient, as it performs a rect() for
   * each pixel of the line.
   */
  drawLine(x0: number, y0: number, x1: number, y1: number, color: string) {
    // It's necessary to start from rounded coordinates
    let x = Math.round(x0);
    let y = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    // Calculate the deltas
    let dx = x1 - x0;
    let dy = y1 - y0;
    let dmax = Math.max(Math.abs(dx), Math.abs(dy));

    // Either dx or dy will equal 1
    // and the other will be less than 1
    dx = dx / dmax;
    dy = dy / dmax;

    const points = [ ];
    this.context.fillStyle = color;
    while(dmax--) {
      // The points won't have integer coordinates;
      // We'll round them later.
      points.push([x, y]);
      x += dx;
      y += dy;
    }

    this.context.beginPath();
    points.map(([px, py]) => {
      // We round the coordinates when drawing the pixel.
      this.context.rect(Math.round(px), Math.round(py), 1, 1);
    });
    this.context.fill();
  }

  drawOverlay(week: number) {
    const colors = [PURPLE, RED2, GREEN, BLUE];
    this.context.fillStyle = colors[week % colors.length];
    this.context.fillRect(0, 0, WIDTH, HEIGHT);
  }

  drawHeader(title: string, gameData: GameData, total = -1) {
    this.context.fillStyle = A_BLACK;
    this.context.fillRect(0, 0, WIDTH, 12);
    this.drawText(`Week ${gameData.week} - ${title}`, 3, 3, RED1);
    const money = shorterMoney(gameData.money);
    this.drawText(`${money}$`, WIDTH, 3, GREEN, 'right');
    if (total != -1) {
      this.drawText(`+ ${total}$`, WIDTH, 13, A_BLACK, 'right');
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
    this.context.fillStyle = BLACK;
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
      this.context.fillStyle = i % 2 ? WHITE2 : RED2;
      this.drawCircle(32 + i * 16, 32, 8);
      this.context.fill();
      this.context.beginPath();
      this.context.fillStyle = i % 2 ? WHITE1 : RED1;
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
    const width = (text.length + 1) * 6;
    const height = 13;
    this.context.translate(activeOffset, activeOffset);
    this.context.fillRect(x - width/2, y, width, height);
    this.drawText(text, x, y + 4, BLACK, 'center');
    this.context.translate(-activeOffset, -activeOffset);

    return {width, height};
  }

  // Adapted from https://xem.github.io/miniPixelArt/
  drawIcon(icon: Icon, x: number, y: number) {
    const imageData: number[] = [];

    [...icon.data].map(c => {
      const z = c.charCodeAt(0);
      imageData.push(z&7);
      imageData.push((z>>3)&7);
    });

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

  drawProducts({ stock }: GameData, productSales: ProductValue, productsForSale: ProductType[]) {
    const s = Object.entries(stock).filter(([product, amount]) => {
      return amount && productsForSale.includes(product as ProductType);
    });
    s.forEach(([type, amount], i) => {
      // @ts-ignore -- type is a valid key
      const finalStock = Math.min(200, Math.ceil(amount - productSales[type]));
      // @ts-ignore
      const icon : Icon = icons[type];
      const perRow = Math.floor(27 / icon.padding);
      const boxNumber = s.length === 1 ? 1
      : s.length === 2 ? i * 2
      : i;
      // @ts-ignore
      const maxPerBox = Math.min(finalStock, perRow * Math.ceil(25 / icon.padding));
      for(let j = 0; j < finalStock; j++) {
        const productLevel = Math.floor(j / maxPerBox);
        this.drawIcon(
          icon,
          37 + (j % perRow) * icon.padding + boxNumber * 30 + icon.padding * 0.5 * (productLevel % 2),
          90 - (Math.floor((j % maxPerBox) / perRow)) * (icon.padding-1) - icon.y - productLevel * icon.padding,
        );
        // level separator
        // if (j && j % maxPerBox == 0) {
        //   this.context.fillStyle = BROWN1;
        //   this.context.fillRect(
        //     37 + boxNumber * 30 + (j % 2) * 2,
        //     74 - productLevel * icon.padding + icon.y,
        //     26 - 3,
        //     23
        //   );
        // }
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
    this.context.fillStyle = WHITE1;
    this.context.fillRect(margin, margin, width, 5 + margin * 2);
    this.context.fillRect(WIDTH - margin - width, margin, width, 5 + margin * 2);
    this.drawText(`Week ${data.week}`, margin + 2, margin + 3, BLACK);
    this.drawText(`${data.money + income}$`, WIDTH - margin - 2, margin + 3, BLACK, 'right');
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
    this.context.fillStyle = WHITE1;
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
