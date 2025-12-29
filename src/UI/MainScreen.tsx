import React, { useState } from "react";
import { useParams } from "react-router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SimulationState } from "../GameLogic/Types"
import { getSaveEntitiesForMainScreen } from "./Hooks/SaveHooks";
import NavBar from "./Components/NavBar";
import { BasicClubStatus } from "./Components/ClubStatus";
import { SquadTable } from "./Components/SquadTable";
import { PartialLeagueTable } from "./Components/LeagueTable";

export const MainScreen = () => {
  const params = useParams();
  const [matchesLeftToSim, setMatchsLeftToSim] = useState<number>(0);
  
  const createOnSim = (simulationState: SimulationState) => (simulationOption: number) => (): void => {
    // simulationOption will be given to a function who will calculate the actual matches
    console.log(`Will sim ${simulationOption} weeks`)
    setMatchsLeftToSim(simulationOption);
  };
  
  const decrementMatchsLeftToSim = (): void => {
    setMatchsLeftToSim((x: number) => x - 1);
  }; 
  const stopSim = (): void => {
    setMatchsLeftToSim(0);
  };

  const { saveNumber } = params;
  const [db, saveOptions, simulationState, players, leagueTableRowsAndHeader] =
	getSaveEntitiesForMainScreen(saveNumber as string, matchesLeftToSim);
    
  const basicClubFinances = [0, 0, 0, 0];

  console.log(simulationState && simulationState.CurrentDay)
  

  return (
    <div>
      <NavBar
        saveNumber={saveNumber as string}
        matchesLeftToSim={matchesLeftToSim}
        createOnSim={createOnSim(simulationState)}
        stopSim={stopSim}
        decrementMatchsLeftToSim={decrementMatchsLeftToSim}
      />
      <Container>
        <Row>
          <Col md={{ span: 4 }}>
            {(leagueTableRowsAndHeader.length && (
              <PartialLeagueTable
                leagueTableRowsAndHeader={leagueTableRowsAndHeader}
              />
            )) || <div>Loading..</div>}
          </Col>
          {(saveOptions && simulationState && (
            <BasicClubStatus
              baseCountries={saveOptions.Countries}
              simulationState={simulationState}
	      clubFinances={basicClubFinances}
            />
          )) || <div>Loading..</div>}
          <Col>
            {(Object.keys(players).length && (
              <SquadTable players={players} />
            )) || <div>Loading..</div>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
