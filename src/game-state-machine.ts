import { StateMachine } from './core/state-machine';
import { State } from './core/state';

export let gameStateMachine: StateMachine;
export let playStateMachine: StateMachine;

export function createGameStateMachine(initialState: State, ...initialArguments: any[]) {
  gameStateMachine = new StateMachine(initialState, ...initialArguments);
}

export function createPlayStateMachine(initialState: State, ...initialArguments: any[]) {
  playStateMachine = new StateMachine(initialState, ...initialArguments);
}
