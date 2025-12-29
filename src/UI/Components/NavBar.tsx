import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavBarProps } from "../Types";
import SimulationDropdownMenu from "./SimulationDropdownMenu";

const NavBar = ({
  saveNumber,
  matchesLeftToSim,
  createOnSim,
  decrementMatchsLeftToSim,
  stopSim,
}: NavBarProps) => {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>The Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <SimulationDropdownMenu
              saveNumber={saveNumber}
              matchesLeftToSim={matchesLeftToSim}
              createOnSim={createOnSim}
              stopSim={stopSim}
              decrementMatchsLeftToSim={decrementMatchsLeftToSim}
            />
            <Nav.Link href={`${saveNumber}/LeagueTable`}>LeagueTable</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
