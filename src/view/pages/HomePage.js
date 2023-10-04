import { Component } from "react";
import { STYLE } from "./HomePageStyle";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
  Grid,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import TableRowsIcon from "@mui/icons-material/TableRows";

import GroupStageView from "../molecules/GroupStageView";
import Simulator from "../../nonview/analytics/Simulator.js";

import KnockOutStageView from "../molecules/KnockOutStageView";
import BigTableView from "../molecules/BigTableView";
import { UPDATE_DATE } from "../../nonview/constants/VERSION.js";
import { SIMULATOR_MODE } from "../../nonview/analytics/SimulatorMode.js";
import React from "react";
import Format from "../../nonview/base/Format.js";
import { N_MONTE_CARLO_SIMULATIONS } from "../../nonview/constants/STATISTICS.js";

export default class HomePage extends Component {
  constructor() {
    super();
    const resultIdx = null;
    const cumInvPWinner = null;
    const odiIdx = null;
    const koResultIdx = null;
    const historyList = [];
    const odiStateIdx = {};
    this.state = {
      resultIdx,
      cumInvPWinner,
      odiIdx,
      koResultIdx,
      historyList,
      odiStateIdx,
    };

    this.myRefBigTable = React.createRef();
    this.myRefSimulation = React.createRef();
  }

  componentDidMount() {
    this.buildHistory();
    this.handleDoSimulate(SIMULATOR_MODE.MAXIMUM_LIKELIHOOD, 1);
  }

  buildHistory() {
    let historyList = [];
    const simulator = new Simulator(SIMULATOR_MODE.RANDOM, {});
    for (let i = 0; i < N_MONTE_CARLO_SIMULATIONS; i++) {
      const { resultIdx, cumInvPWinner } = simulator.simulateGroupStage();
      const { odiIdx, koResultIdx } =
        simulator.simulateKnockOutStage(resultIdx);
      historyList.push({ resultIdx, cumInvPWinner, odiIdx, koResultIdx });
    }
    this.setState({ historyList });
  }

  handleDoSimulate(simulatorMode) {
    const { odiStateIdx } = this.state;
    const simulator = new Simulator(simulatorMode, odiStateIdx);
    const { resultIdx, cumInvPWinner } = simulator.simulateGroupStage();
    const { odiIdx, koResultIdx } = simulator.simulateKnockOutStage(resultIdx);

    this.setState(
      {
        resultIdx,
        cumInvPWinner,
        odiIdx,
        koResultIdx,
        simulatorMode,
      },
      function () {
        this.myRefSimulation.scrollIntoView({ behavior: "smooth" });
      }.bind(this)
    );
  }

  handleOnClickODI(odi) {
    let { odiStateIdx } = this.state;
    if (!odiStateIdx[odi.id]) {
      odiStateIdx[odi.id] = 1;
    } else if (odiStateIdx[odi.id] === 1) {
      odiStateIdx[odi.id] = 2;
    }  else {
      odiStateIdx[odi.id] = 0;
    }
    this.setState({ odiStateIdx });
  }

  renderHeader() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              #CWC2023Simulator
              <span className="superscript">Updated {UPDATE_DATE}</span>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
  renderBody() {
    const {
      resultIdx,
      cumInvPWinner,
      odiIdx,
      koResultIdx,
      simulatorMode,
      historyList,
      odiStateIdx,
    } = this.state;
    if (!resultIdx) {
      return <CircularProgress />;
    }

    const nMatches = 45 + 3; // TODO: Find completed matches
    const perMatchProb = Math.exp(-(Math.log(cumInvPWinner) / nMatches));
    return (
      <Box color={simulatorMode.color}>
        <div ref={(ref) => (this.myRefSimulation = ref)}></div>

        <Grid container direction="row" alignItems="center">
          <Grid item>
            <simulatorMode.Icon />
          </Grid>
          <Grid item>
            <Typography variant="h5">
              <strong>{simulatorMode.message}</strong>
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="body1" color={simulatorMode.color}>
          {"That is " + simulatorMode.subMessage + " "}
          The likelihood of this exact sequence of results is about
          <strong> 1 in {" " + Format.int(cumInvPWinner)}</strong>, or on
          average <strong>{Format.percent(perMatchProb)}</strong> per match.
        </Typography>

        <KnockOutStageView
          odiIdx={odiIdx}
          koResultIdx={koResultIdx}
          odiStateIdx={odiStateIdx}
          onClickODI={this.handleOnClickODI.bind(this)}
        />
        <GroupStageView
          resultIdx={resultIdx}
          odiStateIdx={odiStateIdx}
          onClickODI={this.handleOnClickODI.bind(this)}
        />

        <div ref={(ref) => (this.myRefBigTable = ref)}></div>
        <BigTableView historyList={historyList} />
      </Box>
    );
  }
  renderFooter() {
    const onClickRandom = function () {
      this.myRefBigTable.scrollIntoView({ behavior: "smooth" });
    }.bind(this);

    const onClickRefresh = function () {
      window.location.reload();
    };

    const simulatorButtons = Object.values(SIMULATOR_MODE).map(
      function (simulatorMode) {
        const onClick = function () {
          this.handleDoSimulate(simulatorMode);
        }.bind(this);

        return (
          <BottomNavigationAction
            key={"simulateButton-" + simulatorMode.id}
            icon={<simulatorMode.Icon />}
            onClick={onClick}
          />
        );
      }.bind(this)
    );

    return (
      <BottomNavigation>
        <BottomNavigationAction
          icon={<RefreshIcon />}
          onClick={onClickRefresh}
        />
        <BottomNavigationAction
          icon={<TableRowsIcon />}
          onClick={onClickRandom}
        />
        {simulatorButtons}
      </BottomNavigation>
    );
  }
  render() {
    return (
      <Box sx={STYLE.ALL}>
        <Box sx={STYLE.HEADER}>{this.renderHeader()}</Box>
        <Box sx={STYLE.BODY}>{this.renderBody()}</Box>
        <Box sx={STYLE.FOOTER}>{this.renderFooter()}</Box>
      </Box>
    );
  }
}
