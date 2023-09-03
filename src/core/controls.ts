import BuyState from '@/game-states/stock.state';
import StockState from '@/game-states/stock.state';

const enum XboxControllerButton {
  A,
  B,
  X,
  Y,
  LeftBumper,
  RightBumper,
  LeftTrigger,
  RightTrigger,
  Select,
  Start,
  L3,
  R3,
  DpadUp,
  DpadDown,
  DpadLeft,
  DpadRight,
}

class Controls {
  isUp = false;
  isDown = false;
  isLeft = false;
  isRight = false;
  isConfirm = false;
  isEscape = false;
  inputDirection: DOMPoint;

  keyMap: Map<string, boolean> = new Map();
  touchKey = '';
  previousState = {
    isUp: this.isUp,
    isDown: this.isDown,
    isLeft: this.isLeft,
    isRight: this.isRight,
    isConfirm: this.isConfirm,
    isEscape: this.isEscape
  };

  constructor() {
    document.addEventListener('keydown',
    event => this.toggleKey(event, true));
    document.addEventListener('keyup', event => this.toggleKey(event, false));
    this.inputDirection = new DOMPoint();
    document.addEventListener('touchstart', event => this.toggleVirtualKey(event, true));
    document.addEventListener('touchend', event => this.toggleVirtualKey(event, false));
  }

  queryController() {
    this.previousState.isUp = this.isUp;
    this.previousState.isDown = this.isDown;
    this.previousState.isLeft = this.isLeft;
    this.previousState.isRight = this.isRight;
    this.previousState.isConfirm = this.isConfirm;
    this.previousState.isEscape = this.isEscape;
    const gamepad = navigator.getGamepads()[0];
    const isButtonPressed = (button: XboxControllerButton) => gamepad?.buttons[button].pressed;

    const leftVal = (
      this.keyMap.get('KeyA')
      || this.keyMap.get('ArrowLeft')
      || this.touchKey === 'left'
      || isButtonPressed(XboxControllerButton.DpadLeft)
    ) ? -1 : 0;
    const rightVal = (
      this.keyMap.get('KeyD')
      || this.keyMap.get('ArrowRight')
      || this.touchKey === 'right'
      || isButtonPressed(XboxControllerButton.DpadRight)
    ) ? 1 : 0;
    const upVal = (
      this.keyMap.get('KeyW')
      || this.keyMap.get('ArrowUp')
      || this.touchKey === 'up'
      || isButtonPressed(XboxControllerButton.DpadUp)
    ) ? -1 : 0;
    const downVal = (
      this.keyMap.get('KeyS')
      || this.keyMap.get('ArrowDown')
      || this.touchKey === 'down'
      || isButtonPressed(XboxControllerButton.DpadDown)
    ) ? 1 : 0;
    this.inputDirection.x = (leftVal + rightVal) || gamepad?.axes[0] || 0;
    this.inputDirection.y = (upVal + downVal) || gamepad?.axes[1] || 0;

    const deadzone = 0.1;
    if (Math.hypot(this.inputDirection.x, this.inputDirection.y) < deadzone) {
      this.inputDirection.x = 0;
      this.inputDirection.y = 0;
    }

    this.isUp = this.inputDirection.y < 0;
    this.isDown = this.inputDirection.y > 0;
    this.isLeft = this.inputDirection.x < 0;
    this.isRight = this.inputDirection.x > 0;
    this.isConfirm = Boolean(
      this.keyMap.get('Enter')
      || this.touchKey === 'ok'
      || isButtonPressed(XboxControllerButton.A)
      || isButtonPressed(XboxControllerButton.Start)
    );
    this.isEscape = Boolean(this.keyMap.get('Escape') || isButtonPressed(XboxControllerButton.Select));
  }

  private toggleKey(event: KeyboardEvent, isPressed: boolean) {
    this.keyMap.set(event.code, isPressed);
  }

  private toggleVirtualKey(event: TouchEvent, isTouched: boolean) {
    // @ts-ignore -- I know the ID is present
    const id = event.targetTouches[0]?.target?.id;
    if (!isTouched) {
      this.touchKey = '';
    } else if (id) {
      this.touchKey = id;
    }
  }

  updateSelection(state: BuyState | StockState) {
    if (this.isUp && !this.previousState.isUp && state.selection > 0) {
      state.selection--;
    }
    if (this.isDown && !this.previousState.isDown && state.selection < state.gameData.suppliers.length) {
      state.selection++;
    }
  }
}

export const controls = new Controls();
