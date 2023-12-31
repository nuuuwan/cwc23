import { EPSILON } from "../constants/STATISTICS.js";
import { EMOJI } from "../constants/EMOJI.js";
import DateX from "./DateX";
export const DEFAULT_TIME_ZONE = "Asia/Colombo";

export default class Format {
  // Color
  static gray(p) {
    const s = parseInt(255 * (1 - p));
    return `rgb(${s},${s},${s})`;
  }

  static grayList(n) {
    const list = [];
    for (let i = 0; i < n; i++) {
      list.push(Format.gray(i / (n - 1)));
    }
    return list;
  }

  // Percent
  static getPercentColorFromBands(p, colorList) {
    const nColor = colorList.length;
    for (let i in colorList) {
      const limit = (1.0 * (parseInt(i) + 1)) / nColor;
      if (p <= limit) {
        return colorList[i];
      }
    }
    return colorList[nColor - 1];
  }

  static getPercentColor1(p) {
    return Format.getPercentColorFromBands(p, [
      "#f00",
      "#fa0",
      "#0a0",
      "#08f",
      "#80f",
    ]);
  }

  static getPercentColor2(p) {
    const h = parseInt(300 * p);
    const s = parseInt(100);
    const [MIN_L, MAX_L] = [20, 60];
    const l = parseInt((1 - p) * (MAX_L - MIN_L) + MIN_L);
    return `hsl(${h},${s}%,${l}%)`;
  }

  static getPercentColor3(p) {
    return Format.getPercentColorFromBands(p, [
      "#f00",
      "#f80",
      "#cc0",
      "#0a0",
      "#08f",
      "#80f",
      "#808",
    ]);
  }

  static getPercentColor(p) {
    return Format.getPercentColor1(p);
  }

  static getPercentChangeColor(dP) {
    const rgb = dP > 0 ? `#080` : `#f00`;
    return `${rgb}`;
  }

  static percentText(p) {
    if (p < EPSILON) {
      return "0%";
    }

    if (p > 1 - EPSILON) {
      return "100%";
    }

    if (p < 0.005) {
      return "<1%";
    }

    if (p > 0.995) {
      return ">99%";
    }

    return p.toLocaleString(undefined, {
      style: "percent",
      maximumFractionDigits: 0,
    });
  }

  static percentTextWithEmoji(p) {
    const text = Format.percentText(p);

    if (p < EPSILON) {
      return EMOJI.LOSER;
    }
    if (p > 1 - EPSILON) {
      return EMOJI.WINNER;
    }
    return text;
  }

  static percentTextWithEmojiAndColor(p) {
    return (
      <span style={{ color: Format.getPercentColor(p) }}>
        {Format.percentTextWithEmoji(p)}
      </span>
    );
  }

  static percentWithColor(p, pColor, opacity, prefix = "") {
    const color = Format.getPercentColor(pColor);
    const s = Format.percentText(p);
    return Format.textWithColor(prefix + s, color, opacity);
  }

  static textWithColor(text, color, opacity) {
    return (
      <span
        style={{
          color,
          opacity,
        }}
      >
        {text}
      </span>
    );
  }

  static percent(p) {
    return Format.percentWithColor(p, p, 1.0);
  }

  static percentWithColorOverride(p, dP, prefix = "") {
    const MAX_ABS_P = 0.2;
    const pColor = Math.max(
      0,
      Math.min(1, (dP + MAX_ABS_P) / (2.0 * MAX_ABS_P))
    );

    return Format.percentWithColor(p, pColor, 1.0, prefix);
  }

  static percentChangeText(p) {
    const prefix = p > 0 ? "+" : "-";
    if (Math.abs(p) < 0.005) {
      return "";
    }
    return prefix + Format.percentText(Math.abs(p));
  }
  // Rank

  static rank(rank) {
    const color = Format.getPercentColor((10 - rank) / 9);
    return (
      <span
        style={{
          color,
        }}
      >
        {Format.int(rank)}
      </span>
    );
  }

  // Date/Time

  static timeStamp(date) {
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      //
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      //
      timeZoneName: "short",
      timeZone: DEFAULT_TIME_ZONE,
    });
  }

  static matchDate(date) {
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      weekday: "short",
      //
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: DEFAULT_TIME_ZONE,
    });
  }

  static plural(v, label) {
    return `${v} ${label}${v > 1 ? "s" : ""}`;
  }

  static dutAbs(absDut) {
    let sList = [];

    if (absDut > 86400) {
      sList.push(Format.plural(Math.floor(absDut / 86400), "day"));
    }

    if (absDut > 3600) {
      sList.push(Format.plural(Math.floor((absDut % 86400) / 3600), "hr"));
    }
    if (absDut > 60) {
      sList.push(Format.plural(Math.floor((absDut % 3600) / 60), "min"));
    }
    sList.push(Format.plural(Math.floor(absDut % 60), "sec"));

    return sList.slice(0, 2).join(", ");
  }

  static dut(dut) {
    if (dut < 0) {
      return Format.dutAbs(-dut) + " ago";
    } else {
      return `in ${Format.dutAbs(dut)}`;
    }
  }

  static dateDelta(date) {
    const dut = new DateX(date).dut;
    return Format.dut(dut);
  }

  // Numbers

  static float(x) {
    return x.toLocaleString(undefined, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    });
  }

  static bigInt(x) {
    return x.toExponential(0);
  }

  static int(x) {
    if (x > 1_000_000_000_000) {
      return Format.bigInt(x);
    }

    for (let [v, suffix] of [
      [1_000_000_000, "B"],
      [1_000_000, "M"],
      [1_000, "K"],
    ]) {
      if (x >= v) {
        return (
          (x / v).toLocaleString(undefined, { maximumSignificantDigits: 2 }) +
          suffix
        );
      }
    }

    return x.toLocaleString(undefined, { maximumSignificantDigits: 2 });
  }

  // Combination
  static getText(label, p) {
    if (label.includes("Rank")) {
      return Format.rank(p);
    }

    switch (label) {
      case "Diff":
        return Format.percentChangeText(p);
      default:
        return Format.percentTextWithEmoji(p);
    }
  }

  static getColor(label, p) {
    switch (label) {
      case "Diff":
        return Format.getPercentChangeColor(p);
      default:
        return Format.getPercentColor(p);
    }
  }

  static getLabel(label) {
    switch (label) {
      case "Diff":
        return "";
      default:
        return label;
    }
  }

  static getFontSize(label) {
    switch (label) {
      default:
        return "100%";
    }
  }
}

export const COLOR_GRAY_LIST = Format.grayList(20);
