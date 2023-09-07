import { drawEngine } from './core/draw-engine';
import { createGameStateMachine, gameStateMachine } from './game-state-machine';
import { controls } from '@/core/controls';
import { menuState } from './game-states/menu.state';

// @ts-ignore -- is not undefined for sure
document.querySelector('link[type="image/x-icon"]').href = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E🍎%3C/text%3E%3C/svg%3E';

createGameStateMachine(menuState);

let previousTime = 0;
// const interval = 1000 / 60;

(function draw(currentTime: number) {
  const delta = currentTime - previousTime;

  // if (delta >= interval) {
    previousTime = currentTime;

    controls.queryController();
    drawEngine.clear();
    // Although the game is currently set at 60fps, the state machine accepts a time passed to onUpdate
    // If you'd like to unlock the framerate, you can instead use an interval passed to onUpdate to
    // adjust your physics so they are consistent across all frame rates.
    // If you do not limit your fps or account for the interval your game will be far too fast or far too
    // slow for anyone with a different refresh rate than you.
    gameStateMachine.getState().onUpdate(delta);
  // }
  requestAnimationFrame(draw);
})(0);
