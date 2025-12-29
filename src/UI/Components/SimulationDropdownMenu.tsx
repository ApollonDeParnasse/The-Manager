import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import { mapIndexed } from "futil-js";
import { SimulationButtonProps } from "../Types";
import { simForwardHook } from "../Hooks/SaveHooks";
import { addOne } from "../../GameLogic/Transformers"

interface SimulationDropdowMenuItem {
  optionText: string;
  onSim: () => void;
  key: number;
}

export const SimulationDropdowMenuItem = ({
  optionText,
  onSim,
}: SimulationDropdowMenuItem) => {
  return <NavDropdown.Item onClick={onSim}>{optionText}</NavDropdown.Item>;
};

export const SIMULATIONOPTIONS: Array<
  string
> = [
  "Sim Until Next Match", 
  "Sim One Week", 
  "Sim One Month",
  "Sim Until The End of The Season"
];

const ShowSimOptions = ({ simulationOptions, createOnSim }: {simulationOptions: Array<string>, createOnSim: Function}) => {
  return (
    <NavDropdown title="Sim">
      {mapIndexed((optionText: string, key: number) => (
        <SimulationDropdowMenuItem
          optionText={optionText}
          onSim={createOnSim(addOne(key))}
          key={key}
        />
      ))(simulationOptions)}
    </NavDropdown>
  );
};

const StopSim = ({ stopSim }: { stopSim: () => void }) => {
  return (
    <NavDropdown title="Stop">
      <NavDropdown.Item onClick={stopSim}>Stop Simulation</NavDropdown.Item>
    </NavDropdown>
  );
};

const BasicSimulationDropdownMenu =
  (
    simulationOptions: Array<string>
  ) =>
  ({
    saveNumber,
    matchesLeftToSim,
    createOnSim,
    decrementMatchsLeftToSim,
    stopSim,
  }: SimulationButtonProps) => {
    simForwardHook(matchesLeftToSim, decrementMatchsLeftToSim);

    return (
      <>
        {(matchesLeftToSim == 0 && (
          <ShowSimOptions simulationOptions={simulationOptions} createOnSim={createOnSim} />
        )) || <StopSim stopSim={stopSim} />}
      </>
    );
  };

const SimulationDropdownMenu = BasicSimulationDropdownMenu(SIMULATIONOPTIONS);

export default SimulationDropdownMenu;
