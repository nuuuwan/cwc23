import { Box } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from "@mui/material";
import Team from "../../nonview/core/Team.js";
import TeamView from "../atoms/TeamView.js";
import Format from "../../nonview/base/Format.js";

import React from "react";

export default function BigTableTableView({ bigTable, onClickTeam }) {
  const {
    n,
    teamIDToWinner,
    teamIDToFinalist,
    teamIDToSemiFinalist,
    orderedTeamIDs,
  } = bigTable.stats;

  return (
    <Box>
      <TableContainer component={Box}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell size="small" align="center"></TableCell>
              <TableCell size="small" align="center">
                Team
              </TableCell>
              <TableCell size="small" align="center">
                {"Winner"}
              </TableCell>
              <TableCell size="small" align="center">
                {"Final"}
              </TableCell>
              <TableCell size="small" align="center">
                {"Qualify"}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orderedTeamIDs.map(function (teamID, iTeam) {
              const team = new Team(teamID);
              const pWinner = teamIDToWinner[teamID] / n;
              const pFinalist = teamIDToFinalist[teamID] / n;
              const pSemiFinalist = teamIDToSemiFinalist[teamID] / n;

              const onClickInner = function () {
                onClickTeam(team);
              };

              return (
                <TableRow key={teamID}>
                  <TableCell
                    size="small"
                    align="center"
                    component="th"
                    scope="row"
                  >
                    {Format.rank(iTeam + 1)}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    component="th"
                    scope="row"
                    onClick={onClickInner}
                    sx={{ cursor: "pointer" }}
                  >
                    <TeamView team={team} />
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    sx={{ fontSize: "100%" }}
                  >
                    {Format.percentWithIcon(pWinner)}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    sx={{ fontSize: "100%" }}
                  >
                    {Format.percentWithIcon(pFinalist)}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    sx={{ fontSize: "100%" }}
                  >
                    {Format.percentWithIcon(pSemiFinalist)}
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
