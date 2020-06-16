import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import { makeStyles } from '@material-ui/core/styles';
import {
  Crosshair,
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  LineSeries,
  XAxis,
  YAxis,
} from 'react-vis';
import moment from 'moment';
import { extendMoment } from 'moment-range';
import numeral from 'numeral';

HistoryChart.propTypes = {
  endDate: PropTypes.instanceOf(moment).isRequired,
  height: PropTypes.number.isRequired,
  history: PropTypes.object, // key is date, value is cases per date
  startDate: PropTypes.instanceOf(moment).isRequired,
};

const Moment = extendMoment(moment);

const useStyles = makeStyles(() => ({
  crosshair: {
    backgroundColor: grey[900],
    color: grey[100],
    minWidth: '150px',
    padding: '8px 16px',
  },
}));

export default function HistoryChart({
  endDate,
  height,
  history = {},
  startDate,
}) {
  const classes = useStyles();

  const [crosshairValue, setCrosshairValue] = useState(null);
  const dateRange = Moment.range(startDate, endDate);
  const dates = Object.keys(history).filter(date =>
    dateRange.contains(moment(date)),
  );

  if (!dates.length) return null;

  return (
    <FlexibleWidthXYPlot
      height={height}
      onMouseLeave={() => {
        setCrosshairValue(null);
      }}
    >
      <HorizontalGridLines />
      <XAxis
        tickFormat={x => moment(x).format('MM/DD')}
        tickLabelAngle={-45}
        tickTotal={dates.length < 7 ? (dates.length >= 4 ? 2 : 0) : 5}
      />
      <YAxis
        hideLine
        tickFormat={y =>
          y > 1000000 ? numeral(y).format('0.0a') : numeral(y).format('0a')
        }
        tickTotal={5}
      />

      <LineSeries
        animation="stiff"
        curve="curveMonotoneX"
        data={dates.map(date => ({
          x: moment(date).valueOf(),
          y: history[date],
        }))}
        onNearestX={d => {
          setCrosshairValue(d);
        }}
        stroke={red[500]}
      />

      {crosshairValue && (
        <Crosshair
          style={{ line: { backgroundColor: grey[500] } }}
          values={[crosshairValue]}
        >
          <Paper className={classes.crosshair}>
            <Typography component="p" variant="body2">
              <strong>Số ca nhiễm</strong>:{' '}
              {numeral(crosshairValue.y).format('0,0')}
            </Typography>
            <Typography component="p" variant="body2">
              <strong>Ngày</strong>:{' '}
              {moment(crosshairValue.x).format('DD/MM/YYYY')}
            </Typography>
          </Paper>
        </Crosshair>
      )}
    </FlexibleWidthXYPlot>
  );
}
