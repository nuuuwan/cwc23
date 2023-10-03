import { Box, Typography } from "@mui/material";
import GroupStatePointsTable from "../../nonview/core/GroupStatePointsTable.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
} from "@mui/material";
import Team from "../../nonview/core/Team.js";
import { EMOJI } from "../../nonview/core/EMOJI.js";

const N_KNOCKOUT_TEAMS = 4;

export default function GroupStatePointsTableView({ resultIdx }) {
  const pointsTable = new GroupStatePointsTable(resultIdx);
  const teamToWins = pointsTable.getTeamToWins();
  return (
    <Box>
      <Typography variant="h5">Group Stage Points Table</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.entries(teamToWins).map(function ([teamID, nW], iRow) {
              const points = 2 * nW;
              const team = Team.loadFromID(teamID);
              const check = iRow < N_KNOCKOUT_TEAMS ? EMOJI.WINNER : "";
              return (
                <TableRow key={teamID}>
                  <TableCell component="th" scope="row">
                    {team.label}
                    {" " + check}
                  </TableCell>
                  <TableCell align="right">{points}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
