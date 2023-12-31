import Format from "../base/Format";

import { TEAM1_ID_TO_TEAM2_ID_TO_ODDS_PAIR } from "../data/TEAM1_ID_TO_TEAM2_ID_TO_ODDS_PAIR";
import { ODI_ID_TO_WINNER } from "../data/ODI_ID_TO_WINNER";
import DateX from "../base/DateX";

function pWinnerToPMatch(p1Winner, p2Winner) {
  const f = (x) => x + 0.6;
  const q = f(p1Winner) / (f(p1Winner) + f(p2Winner));
  return q;
}

export default class ODI {
  constructor(id, date, team1, team2, venue) {
    this.id = id;
    this.date = date;
    this.team1 = team1;
    this.team2 = team2;
    this.venue = venue;
  }

  // Date
  get week() {
    return new DateX(this.date).week;
  }

  get isToday() {
    return new DateX(this.date).isToday;
  }

  get dateTitle() {
    const dut = new DateX(this.date).dut;
    const dutStr = Format.dut(dut);
    const prefix = dut < 0 ? "Started" : "Starts";
    return `${prefix} ${dutStr}`;
  }

  get isCurrentWeek() {
    return new DateX(this.date).isCurrentWeek;
  }

  // ID/Stage
  get isGroupStage() {
    return this.id.startsWith("ODI");
  }

  // Names & Flags
  get twitterName() {
    return `${this.favoriteTeam.emoji}${this.underdogTeam.emoji} #${this.favoriteTeam.twitterHandleText}vs${this.underdogTeam.twitterHandleText}`;
  }

  get title() {
    return `${this.team1.label} vs ${this.team2.label}`;
  }

  // Date/Time

  // Result

  get winner() {
    return ODI_ID_TO_WINNER[this.id];
  }

  get isConcluded() {
    return !!this.winner;
  }

  // Probabilities
  get p1Winner() {
    return this.team1.pWinner / (this.team1.pWinner + this.team2.pWinner);
  }

  get p2Winner() {
    return this.team2.pWinner / (this.team1.pWinner + this.team2.pWinner);
  }

  // Odds

  get oddsPair() {
    if (
      TEAM1_ID_TO_TEAM2_ID_TO_ODDS_PAIR[this.team1.id] &&
      TEAM1_ID_TO_TEAM2_ID_TO_ODDS_PAIR[this.team1.id][this.team2.id]
    ) {
      return TEAM1_ID_TO_TEAM2_ID_TO_ODDS_PAIR[this.team1.id][this.team2.id];
    }

    if (
      TEAM1_ID_TO_TEAM2_ID_TO_ODDS_PAIR[this.team2.id] &&
      TEAM1_ID_TO_TEAM2_ID_TO_ODDS_PAIR[this.team2.id][this.team1.id]
    ) {
      const pair =
        TEAM1_ID_TO_TEAM2_ID_TO_ODDS_PAIR[this.team2.id][this.team1.id];
      return [pair[1], pair[0]];
    }

    return null;
  }

  get hasOdds() {
    return !!this.oddsPair;
  }

  get odds1() {
    return this.oddsPair[0];
  }

  get odds2() {
    return this.oddsPair[1];
  }

  get p1Odds() {
    return 1 / this.odds1 / (1 / this.odds1 + 1 / this.odds2);
  }

  get p2Odds() {
    return 1 / this.odds2 / (1 / this.odds1 + 1 / this.odds2);
  }

  // Combined Probabilities
  get p1() {
    if (this.hasOdds) {
      return this.p1Odds;
    }
    return pWinnerToPMatch(this.p1Winner, this.p2Winner);
  }

  get p2() {
    if (this.hasOdds) {
      return this.p2Odds;
    }
    return pWinnerToPMatch(this.p2Winner, this.p1Winner);
  }

  // Predict Winner
  get randomWinner() {
    if (this.winner) {
      return this.winner;
    }
    return Math.random() < this.p1 ? this.team1 : this.team2;
  }

  get maximumLikelihoodWinner() {
    if (this.winner) {
      return this.winner;
    }
    return this.p1 > this.p2 ? this.team1 : this.team2;
  }

  get minimumLikelihoodWinner() {
    if (this.winner) {
      return this.winner;
    }
    return this.p1 > this.p2 ? this.team2 : this.team1;
  }

  // Favourites and Underdogs
  get favoriteTeam() {
    return this.p1 > this.p2 ? this.team1 : this.team2;
  }

  get underdogTeam() {
    return this.p1 > this.p2 ? this.team2 : this.team1;
  }

  // Other

  getColor(winner) {
    const pWinner = winner === this.team1 ? this.p1 : this.p2;
    return Format.getPercentColor(pWinner);
  }

  getP(team) {
    if (team === this.team1) {
      return this.p1;
    }
    if (team === this.team2) {
      return this.p2;
    }
    throw new Error("Invalid team");
  }

  // static odiList methods

  static groupByWeek(odiList, isConcluded) {
    return odiList.reduce(function (weekToODIList, odi) {
      if (isConcluded === odi.isConcluded) {
        const week = odi.week;
        if (!weekToODIList[week]) {
          weekToODIList[week] = [];
        }
        weekToODIList[week].push(odi);
      }
      return weekToODIList;
    }, {});
  }

  static getUnplayedMatches(odiList, odiStateIdx) {
    return odiList.filter((odi) => !odi.isConcluded && !odiStateIdx[odi.id]);
  }

  static getNextMatches(odiList, n, odiStateIdx) {
    return ODI.getUnplayedMatches(odiList, odiStateIdx).slice(0, n);
  }
}
