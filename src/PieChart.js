import React, { useState } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';
import { Hint, RadialChart } from 'react-vis';

PieChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  diameter: PropTypes.number.isRequired,
  valueType: PropTypes.string,
};

const useStyles = makeStyles(() => ({
  hint: {
    backgroundColor: grey[900],
    color: grey[100],
    minWidth: '100px',
    padding: '8px 16px',
  },
}));

export default function PieChart({
  className = '',
  data,
  diameter,
  valueType = '',
}) {
  const classes = useStyles();
  const [hintValue, setHintValue] = useState(false);

  return (
    <RadialChart
      className={className}
      colorType="literal"
      data={data}
      getAngle={d => d.value}
      height={diameter}
      innerRadius={diameter / 3}
      onSeriesMouseOut={_v => {
        setHintValue(false);
      }}
      onValueMouseOver={v => {
        setHintValue(v);
      }}
      padAngle={0.04}
      radius={diameter / 2}
      width={diameter}
    >
      {hintValue !== false && (
        <Hint value={hintValue}>
          <Paper className={classes.hint}>
            <Typography component="p" variant="body2">
              <strong>{hintValue.label}</strong>:{' '}
              {numeral(hintValue.value).format('0,0')} {valueType}
            </Typography>
          </Paper>
        </Hint>
      )}
    </RadialChart>
  );
}
