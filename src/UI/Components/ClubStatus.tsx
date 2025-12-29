import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { zipWith } from "lodash/fp";
import { mapIndexed } from "futil-js";
import { ClubStatusProps } from "../Types"
import { convertClubAbsoluteNumberIntoClubName } from "../../GameLogic/Transformers";


const BASICCLUBFINANCES: Array<[string, number]> = mapIndexed(
  (name: string, index: number): [string, number] => [name, index],
  ["Average Attendance", "Revenue", "Profit", "Cash"],
);

const ClubStatus =
  (clubFinancesCategories: Array<[string, number]>) =>
    ({ baseCountries, simulationState, clubFinances }: ClubStatusProps) => {
      const { CurrentClubNumber, CurrentClubRecord } = simulationState
    const valueCreator = (
      [valueName, key]: [string, number],
      value: number,
    ) => (
      <p key={key}>
        {valueName}: {value}
      </p>
    );
    const clubName: string = convertClubAbsoluteNumberIntoClubName(
      baseCountries,
      CurrentClubNumber,
    );
    return (
      <Col md={{ offset: 4 }}>
        <Row>
          <h2>{clubName}</h2>
          <h3>{CurrentClubRecord}</h3>
        </Row>
        <Row>{zipWith(valueCreator, clubFinancesCategories, clubFinances)}</Row>
      </Col>
    );
  };

export const BasicClubStatus = ClubStatus(BASICCLUBFINANCES);
