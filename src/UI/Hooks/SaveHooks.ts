import { IDBPDatabase } from "idb";
import { useState, useEffect } from "react";
import { ReadonlyNonEmptyArray } from "fp-ts/ReadonlyNonEmptyArray";
import { Option, none as optionNone, some as optionSome } from "fp-ts/Option";
import {
  SaveOptions,
  Player,
  LeagueTableRow,
  DomesticLeague,
  MatchLog,
  SimulationState,
} from "../../GameLogic/Types";
import {
  getSaveOptionsOfAllSaves,
  getUserClubNumberFromSaveOptions,
  getUserLeagueFromSaveOptions,
  defaultOpenDB,
} from "../../GameLogic/Save";
import {
  createArrayOfLeagueTableRows,
  createPlayersObject,
} from "../../GameLogic/Transformers";

export const getAllSaveOptionsHook = (): Option<
  Array<[string, SaveOptions]>
> => {
  const [saveOptions, setSaveOptions] =
    useState<Option<Array<[string, SaveOptions]>>>(optionNone);

  useEffect(() => {
    async function startFetching() {
      setSaveOptions(optionNone);
      const result = await getSaveOptionsOfAllSaves();
      if (!ignore) {
        setSaveOptions(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    };
  }, []);

  return saveOptions;
};

export const getSaveEntitiesForMainScreen = (
  saveNumber: string,
  matchesLeftToSim: number
): [
  IDBPDatabase,
  SaveOptions,
  SimulationState,
  Record<string, Player>,
  [Array<LeagueTableRow>, string],
] => {
  const [db, setDB] = useState<IDBPDatabase | null>(null);
  const [saveOptions, setSaveOptions] = useState<SaveOptions | null>(null);
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [simulationState, setSimulationState] = useState<SimulationState|null>(null);
  const [leagueTableRowsAndHeader, setLeagueTableRowsAndHeader] = useState<
    [Array<LeagueTableRow>, string]
  >([[], ""]);

  useEffect(() => {
    async function startFetching() {
      setDB(null);
      setSaveOptions(null);
      const db = await defaultOpenDB(saveNumber);
      if (!ignore) {
        const options = await db.get("SaveOptions", saveNumber);
        setSaveOptions(options);
        setDB(db);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    };
  }, [saveNumber]);

  useEffect(() => {
    async function startFetching() {
      setPlayers({});
      setLeagueTableRowsAndHeader([[], ""]);
      if (!ignore && db && saveOptions) {
        const clubNumber = getUserClubNumberFromSaveOptions(saveOptions);
        const clubPlayers: Array<Player> = await (
          db as IDBPDatabase
        ).getAllFromIndex("Players", "PlayerClubNumber", clubNumber);
        setPlayers(createPlayersObject(clubPlayers));

        const domesticLeagueNumber = getUserLeagueFromSaveOptions(saveOptions);
        const { Countries, CurrentSeason } = saveOptions;
        const domesticLeague: DomesticLeague = await await (
          db as IDBPDatabase
        ).get("DomesticLeagues", domesticLeagueNumber);

        const matchLogs: ReadonlyNonEmptyArray<MatchLog> = (await (
          db as IDBPDatabase
        ).getAllFromIndex("MatchLogs", "MatchLeagueNumber.MatchSeason", [
          domesticLeagueNumber,
          CurrentSeason,
        ])) as unknown as ReadonlyNonEmptyArray<MatchLog>;

        const rowsAndHeader: [Array<LeagueTableRow>, string] =
          createArrayOfLeagueTableRows(Countries, domesticLeague, matchLogs);
        setLeagueTableRowsAndHeader(rowsAndHeader);

	const newSimulationState: SimulationState = {
	  CurrentClubNumber: clubNumber,
	  CurrentClubRecord: "0-0-0",
	  CurrentDay: Math.random(),
	  CurrentWeek: 0,
	  CurrentSeason,
	}
	
	setSimulationState(newSimulationState)
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    };
  }, [db, saveOptions, matchesLeftToSim]);

  return [
    db as IDBPDatabase,
    saveOptions as SaveOptions,
    simulationState as SimulationState,
    players,
    leagueTableRowsAndHeader,
  ];
};

const runSimForwardWorker = (
  myWorker: Worker,
  decrementMatchsLeftToSim: () => void,
) => {
  myWorker.postMessage([1, 2]);
  console.log("Started simForwardWorker");
  myWorker.onmessage = (event) => {
    decrementMatchsLeftToSim()
  };
};


export const simForwardHook = (
  matchesLeftToSim: number,
  decrementMatchsLeftToSim: () => void,
) => {
  useEffect(() => {
    let ignore = false;
    let myWorker: Worker;
    if (!ignore && !!window.Worker && matchesLeftToSim > 0) {
      console.log(matchesLeftToSim)
      myWorker = new Worker(new URL("../Workers/simForwardWorker.js", import.meta.url))  
      runSimForwardWorker(myWorker, decrementMatchsLeftToSim);
    }
    return () => {
      ignore = true;
      myWorker && myWorker.terminate();
    };
  }, [matchesLeftToSim]);
};
