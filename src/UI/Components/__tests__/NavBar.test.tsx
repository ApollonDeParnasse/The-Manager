import React from "react";
import { cleanup, screen } from "@testing-library/react";
import { expect, describe, vi } from "vitest";
import { fc, test } from "@fast-check/vitest";
import { setup } from "../../UITestingUtilities";
import NavBar from "../NavBar";

describe("NavBar", async () => {
    test("Check buttons", async () => {
      await fc.assert(
        fc
          .asyncProperty(
            fc.integer(),
            async (testSaveNumber) => {
              const testOnSim = vi.fn();

              const TestElement = () => {
                return (
                  <div>
                    <NavBar
                      saveNumber={testSaveNumber.toString()}
                      isSimming={false}
		      onSim={testOnSim}
                    />
                  </div>
                );
              };

              setup(<TestElement />);

	      expect(screen.getByText("The Manager")).toBeTruthy();
              expect(screen.getByText("Sim")).toBeTruthy();	      
	      expect(screen.getByText("LeagueTable")).toBeTruthy();
	      

            },
          )

          .beforeEach(async () => {
            cleanup();
          }),
      );
    });
})

