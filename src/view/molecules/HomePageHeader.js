import { Badge, Box, AppBar, Toolbar, Typography } from "@mui/material";
import AliveView from "./AliveView";
import { TEAM } from "../../nonview/core/Team.js";
import LockIcon from "@mui/icons-material/Lock";
export default function HomePageHeader({ bigTable, odiStateIdx }) {
  let background = "#888";
  if (bigTable) {
    const { orderedTeamIDs } = bigTable.stats;
    const winner = TEAM[orderedTeamIDs[0]];
    background = winner.color;
  }

  let nLocks = 0;
  if (odiStateIdx) {
    nLocks = Object.keys(odiStateIdx).length;
  }

  const onClickRefresh = function () {
    window.location.reload();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background }}>
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={onClickRefresh}
          >
            #CWC23
            {nLocks > 0 ? (
              <Badge badgeContent={nLocks} color="primary">
                <LockIcon fontSize="small" color="#fff" />
              </Badge>
            ) : null}
          </Typography>

          <AliveView bigTable={bigTable} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
