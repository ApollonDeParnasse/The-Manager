import React, { useState } from "react";
import { useParams } from "react-router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getSaveEntitiesForMainScreen } from "./Hooks/SaveHooks";
import NavBar from "./Components/NavBar";
import { BasicClubStatus } from "./Components/ClubStatus";
import { SquadTable } from "./Components/SquadTable";
import { PartialLeagueTable } from "./Components/LeagueTable";

export const MainScreen = () => {
  const params = useParams();
  const [isSimming, setIsSimming] = useState(false);
  const { saveNumber } = params;
  const [db, saveOptions, players, leagueTableRowsAndHeader] =
    getSaveEntitiesForMainScreen(saveNumber as string);
  const clubNumber = 0;
  const clubRecord = "0-0-0";
  const basicClubDetails: [number, string] = [clubNumber, clubRecord];
  const basicClubFinances = [0, 0, 0, 0];


  return (
    <div>
      <NavBar
        saveNumber={saveNumber as string}
	isSimming={isSimming}
        onSim={() => setIsSimming((value) => !value)}
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
          {(saveOptions && (
            <BasicClubStatus
              baseCountries={saveOptions.Countries}
              clubDetails={basicClubDetails}
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
