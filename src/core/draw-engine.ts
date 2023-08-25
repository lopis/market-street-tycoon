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
    this.context.canvas.height = 144;
    this.context.canvas.width = 160;
  }

  get canvasWidth() {
    return this.context.canvas.width;
  }

  get canvasHeight() {
    return this.context.canvas.height;
  }

  clearFontContext() {
    this.fontContext.clearRect(0, 0, this.fontContext.canvas.width, this.fontContext.canvas.height);
  }
  
  clear() {
    this.clearFontContext();
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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
    const offset = textAlign == 'center' ? 125 : 0;
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
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  drawBrick(x: number, y: number, width: number, height: number) {

    this.context.strokeStyle = "#40312a";
    this.context.fillStyle = "#807672";
    this.context.fillRect(x, y, width, height);
    this.context.strokeRect(x + 1, y + 1, width - 1, height - 1);
  }

  drawBrickWall() {
    const height = 16;
    const width = 26;
    for (let row = 0; row <= 10; row++) {
      for (let col = 0; col <= 6; col++) {
        const offset = row % 2 ? width - 8 : width * 0.5 - 8;
        this.drawBrick(col * width - offset, row * height - 8, width, height);
      }
    }
  }

  drawButton(x: number, y: number, color: string, text: string) {
    this.context.strokeStyle = color;
    this.context.fillStyle = color;
    const width = text.length * 10;
    this.context.strokeRect(x, y, width, 13);
    this.drawText(text, 10, x + width/2, y + 2, color, 'center');
  }
}

export const drawEngine = new DrawEngine();
