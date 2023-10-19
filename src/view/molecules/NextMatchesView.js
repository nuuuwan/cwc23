import { Box, Typography } from "@mui/material";
import React from "react";
import ScreenShot from "./ScreenShot.js";
import ODIGroupView from "./ODIGroupView.js";
import NextMatchesTableView from "./NextMatchesTableView.js";

function getTweetBody(bigTable) {
  const { nextODIList } = bigTable;
  let lines = [];
  lines.push("What are the implications of ");
  lines.push(nextODIList.map((odi) => odi.twitterName).join(" & ") + "?");
  return lines.join("\n");
}

export default function NextMatchesView({
  bigTable,
  simulator,
  odiStateIdx,
  setSnackbarMessage,
}) {
  const title = bigTable.nextODIList[0].dateTitle;
  return (
    <ScreenShot
      label="next-matches"
      tweetBody={getTweetBody(bigTable)}
      setSnackbarMessage={setSnackbarMessage}
    >
      <Box>
        <Typography variant="h5">{title}</Typography>

        <ODIGroupView
          odiList={bigTable.nextODIList}
          simulator={simulator}
          odiStateIdx={odiStateIdx}
        />

        <NextMatchesTableView bigTable={bigTable} />
      </Box>
    </ScreenShot>
  );
}
