import { Icon, PALETTE } from "./icons";

export const HEIGHT = 144;
export const WIDTH = 160;

export const RED1 = '#c3472c',
RED2 = '#752a1a',
WHITE2 = '#f7cebd',
BROWN1 = '#b77e62',
BROWN2 = '#6d412e',
GRAY = '#7d736e',
BLACK = '#3f2e28';

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

  constructor() {
    this.context = c2d.getContext('2d');
    this.fontContext = f.getContext('2d');
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
  drawText(text: string, fontSize: number, x: number, y: number, color = 'white', textAlign : CanvasTextAlign = 'left') {
    const font = `${fontSize}px sans`;
    const threshold = 80; //from 0 to 255
  
    /* Compute and draw */
    this.clearFontContext();
    this.fontContext.font=font;
    this.fontContext.textBaseline="middle";
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

  drawOverlay() {
    this.context.fillStyle = "#00000099";
    this.context.fillRect(0, 0, WIDTH, HEIGHT);
  }

  drawCircle(xc: number, yc: number, radius: number) {
    let x = radius, y = 0, cd = 0;

    // middle line
    this.context.rect(xc - x, yc, radius<<1, 1);
  
    while (x > y) {
      cd -= (--x) - (++y);
      if (cd < 0) cd += x++;
      this.context.rect(xc - y, yc - x, y<<1, 1);    // upper 1/4
      this.context.rect(xc - x, yc - y, x<<1, 1);    // upper 2/4
      this.context.rect(xc - x, yc + y, x<<1, 1);    // lower 3/4
      this.context.rect(xc - y, yc + x, y<<1, 1);    // lower 4/4
    }
  }

  drawBrick(x: number, y: number, width: number, height: number) {

    this.context.strokeStyle = BLACK;
    this.context.fillStyle = GRAY;
    this.context.fillRect(x, y, width, height);
    this.context.strokeRect(x + 1, y + 1, width - 1, height - 1);
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
    this.context.fillStyle = "#40312a";
    this.context.fillRect(0, 90, WIDTH, 54);
  }

  gradient(x0: number, y0: number, x1: number, y1: number, stops: Array<Array<any>>) {
    let gradient = this.context.createLinearGradient(x0, y0, x1, y1);
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
    this.context.fillStyle = this.gradient(30, 0, 38, 0, [[2/8, BROWN2], [6/8, BROWN1], [1, BROWN2]]);;
    this.context.fillRect(30, 23, 8, 85);
    this.context.fillStyle = this.gradient(WIDTH - 38, 0, WIDTH - 30, 0, [[2/8, BROWN2], [6/8, BROWN1], [1, BROWN2]]);;
    this.context.fillRect(WIDTH - 38, 23, 8, 85);
    this.context.fillStyle = this.gradient(0, 23, 0, 27, [[1/4, BROWN2], [3/4, BROWN1], [1, BROWN2]]);;
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

  drawButton(x: number, y: number, color: string, text: string) {
    this.context.strokeStyle = color;
    this.context.fillStyle = color;
    const width = text.length * 10;
    this.context.strokeRect(x - width/2, y, width, 13);
    this.drawText(text, 10, x, y + 2, color, 'center');
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
          this.context.fillStyle = "#" + PALETTE.substring(index, index + 3);
          this.context.fillRect(x + i, y + j, 1, 1);
        }
      }
    }
  }
}

export const drawEngine = new DrawEngine();
