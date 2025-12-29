import React from "react";
import { cleanup, screen, fireEvent } from "@testing-library/react";
import { expect, describe, vi } from "vitest";
import { fc, test } from "@fast-check/vitest";
import { fastCheckRandomItemFromArray } from "../../../GameLogic/TestDataGenerators";
import { setup } from "../../UITestingUtilities";
import SimulationDropdownMenu, {
  SIMULATIONOPTIONS,
} from "../SimulationDropdownMenu";

describe("SimulationDropdownMenu tests", async () => {
  test("isSimming=false", async () => {
    await fc.assert(
      fc
        .asyncProperty(
          fc.gen(),
          fc.integer(),
          async (fcGen, testSaveNumber) => {
            const testSetIsSimming = vi.fn();

            const TestElement = () => {
              return (
                <div>
                  <SimulationDropdownMenu
                    saveNumber={testSaveNumber.toString()}
                    isSimming={false}
                    onSim={testSetIsSimming}
                  />
                </div>
              );
            };

            setup(<TestElement />);

            fireEvent.click(screen.getByText("Sim"));

            const [testSimulationButtonText] = fastCheckRandomItemFromArray(
              fcGen,
              SIMULATIONOPTIONS,
            );

            fireEvent.click(screen.getByText(testSimulationButtonText));

            expect(testSetIsSimming).toHaveBeenCalledTimes(1);
          },
        )

        .beforeEach(async () => {
          cleanup();
        }),
    );
  });
  test("isSimming=true", async () => {
    await fc.assert(
      fc
        .asyncProperty(
          fc.gen(),
          fc.integer(),
          async (fcGen, testSaveNumber) => {
            const testSetIsSimming = vi.fn();

            const TestElement = () => {
              return (
                <div>
                  <SimulationDropdownMenu
                    saveNumber={testSaveNumber.toString()}
                    isSimming={true}
                    onSim={testSetIsSimming}
                  />
                </div>
              );
            };

            setup(<TestElement />);

            fireEvent.click(screen.getByText("Stop"));
            fireEvent.click(screen.getByText("Stop Simulation"));

            expect(testSetIsSimming).toHaveBeenCalledTimes(1);
          },
        )

        .beforeEach(async () => {
          cleanup();
        }),
    );
  });
});
