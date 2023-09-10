import { StateMachine } from './core/state-machine';
import { State } from './core/state';

export let gameStateMachine: StateMachine;
export let playStateMachine: StateMachine;

export const createGameStateMachine = (initialState: State, ...initialArguments: any[]) => {
  gameStateMachine = new StateMachine(initialState, ...initialArguments);
};

export const createPlayStateMachine = (initialState: State, ...initialArguments: any[]) => {
  playStateMachine = new StateMachine(initialState, ...initialArguments);
};
