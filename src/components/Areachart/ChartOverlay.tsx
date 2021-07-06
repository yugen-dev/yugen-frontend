import React from "react";
import {
  Button,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { timeFormat } from "d3-time-format";


const formatDate = timeFormat("%b %d, '%y");
const useStyles = makeStyles((theme) => ({
  filter: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
  },
}));
export default function ChartOverlay({ overlay, onTimespanChange }) {
  const { title, value, date } = overlay;
  const classes = useStyles();
  return (
    <>
      <div style={{ position: "absolute", top: 24, left: 24 }}>
        <Typography variant="subtitle2" style={{ color: "white" }}>
          {title}
        </Typography>
        <Typography variant="h5" style={{ color: "white" }}>
          {value}
        </Typography>
        <Typography variant="subtitle1" style={{ color: "white" }}>
          {formatDate(date * 1e3)}
        </Typography>
      </div>
      <div style={{ position: "absolute", top: 20, right: 12 }}>
        <div className={classes.filter}>
          <Button
            type="button"
            value="1W"
            aria-label="1 week timespan"
            variant="text"
            size="small"
            color="primary"
            onClick={onTimespanChange}
          >
            1W
          </Button>
          <Button
            type="button"
            value="1M"
            aria-label="1 month timespan"
            variant="text"
            size="small"
            color="primary"
            onClick={onTimespanChange}
          >
            1M
          </Button>
          <Button
            type="button"
            value="ALL"
            aria-label="ALL timespan"
            variant="text"
            size="small"
            color="primary"
            onClick={onTimespanChange}
          >
            ALL
          </Button>
        </div>
      </div>
    </>
  );
}
