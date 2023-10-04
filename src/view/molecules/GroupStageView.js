import { GROUP_STAGE_ODI_LIST } from "../../nonview/core/GROUP_STAGE_ODI_LIST.js";

import ODIView from "./ODIView.js";
import { Grid, Box, Typography, Paper } from "@mui/material";
const SX_PAPER = { padding: 0.5, margin: 0.5 };
const SX_GRID = { margin: 0.5, padding: 0.5 };

export default function GroupStageView({ resultIdx, onClickODI, odiStateIdx }) {
  let inner = [];
  let iItem = 0;
  let currentInner = [];
  let week = 6;
  for (let odi of GROUP_STAGE_ODI_LIST) {
    iItem++;

    currentInner.push(
      <Grid key={"odi-" + odi.id} item>
        <ODIView
          odi={odi}
          winner={resultIdx[odi.id]}
          onClickODI={onClickODI}
          odiState={odiStateIdx[odi.id]}
        />
      </Grid>
    );

    if (odi.date.getDay() === 1) {
      inner.push(
        <Paper key={"paper-" + iItem} sx={SX_PAPER} elevation={0}>
          <Typography variant="h6">Week {week}</Typography>
          <Grid container sx={SX_GRID}>
            {currentInner}
          </Grid>
        </Paper>
      );
      currentInner = [];
      week--;
    }
  }
  if (currentInner.length > 0) {
    inner.push(
      <Paper key={"grid-" + iItem} sx={SX_PAPER} elevation={0}>
        <Typography variant="h6">Week {week}</Typography>
        <Grid container sx={SX_GRID}>
          {currentInner}
        </Grid>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h5">Group Stage</Typography>
      {inner}
    </Box>
  );
}
