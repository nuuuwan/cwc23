import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import React from "react";
import BigTable from "../../nonview/statistics/BigTable.js";
import { TEAM } from "../../nonview/core/Team.js";
import TeamView from "../atoms/TeamView.js";
import Team from "../../nonview/core/Team.js";
import Format from "../../nonview/base/Format.js";
import DirectionView from "../atoms/DirectionView.js";
import { P_IS_IN_PLAY } from "../../nonview/constants/STATISTICS.js";
import { EMOJI } from "../../nonview/constants/EMOJI.js";
export default function NextMatchesTableView({ bigTable, odiList }) {
  const resultToStats = BigTable.splitHistoryStats(
    bigTable.historyList,
    odiList
  );

  const {
    orderedTeamIDs: orderedTeamIDsBefore,
    teamIDToSemiFinalist: teamIDToSemiFinalistBefore,
    n: nBefore,
  } = bigTable.stats;
  const nResults = Object.keys(resultToStats).length;

  return (
    <Box>
      <Typography variant="h6">
        Odds qualifying passed the group stage
      </Typography>
      <TableContainer component={Box} sx={{ marginTop: 1, padding: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell size="small" align="center"></TableCell>
              <TableCell size="small" align="center" colSpan={nResults}>
                After Result
              </TableCell>
              <TableCell size="small" align="center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="small" align="center">
                Team
              </TableCell>
              {Object.keys(resultToStats).map(function (resultID) {
                const teamIDList = resultID.split(":");
                return (
                  <TableCell
                    size="small"
                    align="center"
                    key={"result-" + resultID}
                  >
                    {teamIDList.map(function (teamID) {
                      return (
                        <TeamView key={"team-" + teamID} team={TEAM[teamID]} />
                      );
                    })}
                  </TableCell>
                );
              })}
              <TableCell size="small" align="center">
                In Play
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orderedTeamIDsBefore.map(function (teamID, iTeam) {
              const team = new Team(teamID);
              const pSemiFinalistBefore =
                teamIDToSemiFinalistBefore[teamID] / nBefore;

              let isTeamInPlay = false;
              return (
                <TableRow key={teamID}>
                  <TableCell size="small" align="center">
                    <TeamView team={team} />
                  </TableCell>

                  {Object.entries(resultToStats).map(function ([
                    resultID,
                    resultStats,
                  ]) {
                    const {
                      n: nAfter,
                      teamIDToSemiFinalist: teamIDToSemiFinalistAfter,
                    } = resultStats;
                    const pSemiFinalistAfter =
                      teamIDToSemiFinalistAfter[teamID] / nAfter;
                    const dP = pSemiFinalistAfter - pSemiFinalistBefore;
                    const isResultInPlay = Math.abs(dP) > P_IS_IN_PLAY;
                    const opacity = isResultInPlay ? 1 : 0.25;
                    if (isResultInPlay) {
                      isTeamInPlay = true;
                    }

                    return (
                      <TableCell
                        size="small"
                        align="center"
                        key={"result-" + resultID}
                        sx={{ opacity }}
                      >
                        {Format.percent(pSemiFinalistAfter)}
                        <DirectionView dP={dP} />
                      </TableCell>
                    );
                  })}
                  <TableCell size="small" align="center">
                    <span style={{ fontSize: "150%" }}>
                      {isTeamInPlay ? EMOJI.IN_PLAY : ""}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
