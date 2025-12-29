import { BaseCountries, SimulationState } from "../GameLogic/Types";

export interface SimulationButtonProps {
  saveNumber: string;
  matchesLeftToSim: number;
  onSim: () => void;
  decrementMatchsLeftToSim: () => void;
  stopSim: () => void;
}

export interface NavBarProps {
  saveNumber: string;
  matchesLeftToSim: number;
  createOnSim: (simulationOption: number) => () => void;
  decrementMatchsLeftToSim: () => void;
  stopSim: () => void;
}

export interface ClubStatusProps {
  baseCountries: BaseCountries;
  simulationState: SimulationState;
  clubFinances: Array<number>;
}
