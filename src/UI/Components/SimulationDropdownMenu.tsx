import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import { mapIndexed } from "futil-js";
import { SimulationButtonProps } from "../Types";
import { simForwardHook } from "../Hooks/SaveHooks"
import {
  simUntilNextMatchHook,
  simOneWeekHook,
  simOneMonthHook,
  simUntilEndOfTheSeasonHook,
} from "../../GameLogic/Transformers";

interface SimulationDropdowMenuItem  {
  optionText: string;
  onSim: () => void;
  key: number;
}


export const SimulationDropdowMenuItem = ({optionText, onSim}: SimulationDropdowMenuItem) => {
  
  return <NavDropdown.Item onClick={onSim}>{optionText}</NavDropdown.Item>
}

export const SIMULATIONOPTIONS: Array<
  [
    string,
    (
      saveNumber: string,
      isSimming: boolean,
    ) => void
  ]
> = [
  ["Sim Until Next Match", simUntilNextMatchHook],
  ["Sim One Week", simOneWeekHook],
  ["Sim One Month", simOneMonthHook],
  ["Sim Until The End of The Season", simUntilEndOfTheSeasonHook],
];


const ShowSimOptions = ({simulationOptions, onSim}) => {
  return <NavDropdown title="Sim">
	   {mapIndexed(([optionText], key: number) => <SimulationDropdowMenuItem optionText={optionText} onSim={onSim} key={key}/>)(simulationOptions)}
	 </NavDropdown>
}

const StopSim = ({onSim}: {onSim: () => void;}) => {  
  return <NavDropdown title="Stop">
	   <NavDropdown.Item onClick={onSim}>Stop Simulation</NavDropdown.Item>
	 </NavDropdown>
}


const BasicSimulationDropdownMenu =
  (
    simulationOptions: Array<
      [
        string,
        (
          saveNumber: string,
          isSimming: boolean,
        ) => void,
      ]
    >,
  ) =>
    ({ saveNumber, isSimming, onSim }: SimulationButtonProps) => {
            
    return (
      <>
        {!isSimming && <ShowSimOptions simulationOptions={simulationOptions} onSim={onSim}/> || <StopSim onSim={onSim}/>}
      </>
    );
  };


const SimulationDropdownMenu = BasicSimulationDropdownMenu(SIMULATIONOPTIONS)

export default SimulationDropdownMenu;
