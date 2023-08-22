class DrawEngine {
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
  
  clear() {
    this.fontContext.clearRect(0, 0, this.fontContext.canvas.width, this.fontContext.canvas.height);
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
  drawTextPixelated(text: string, fontSize: number) {
    const font = `${fontSize}px mono, monospaced`;
    const threshold = 128; //from 0 to 255
  
    /* Compute and draw */
    this.fontContext.font=font;
    this.fontContext.textBaseline="middle";
    this.fontContext.fillText(text,0,16);
    const I = this.fontContext.getImageData(0,0,250,32);
    for (let i=0;i<250;i++){
      for (let j=0;j<32;j++){
        if (
          I.data[(j*250+i)*4+1] > threshold
          || I.data[(j*250+i)*4+2] > threshold
          || I.data[(j*250+i)*4+3] > threshold
        ) {
          this.context.fillStyle = "white";
          this.fontContext.fillRect(i,j,1,1);
          this.context.fillRect(i,j,1,1);
        }
      }
    }
  }
}

export const drawEngine = new DrawEngine();
