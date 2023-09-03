export interface State {
  onUpdate: (timeElapsed?: number) => void;
  onEnter?: (...enterArgs: any) => void;
  onLeave?: (...enterArgs: any) => void;
}