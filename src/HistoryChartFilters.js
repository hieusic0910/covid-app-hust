import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import grey from '@material-ui/core/colors/grey';
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

HistoryChartFilters.propTypes = {
  endDateFilter: PropTypes.instanceOf(moment).isRequired,
  minDate: PropTypes.instanceOf(moment).isRequired,
  setEndDateFilter: PropTypes.func.isRequired,
  setStartDateFilter: PropTypes.func.isRequired,
  startDateFilter: PropTypes.instanceOf(moment).isRequired,
};

// Override selected-day styling inside the datepicker
// https://github.com/mui-org/material-ui-pickers/issues/393#issuecomment-591747961
const selectedDateColorOverride = createMuiTheme({
  overrides: {
    MuiPickersDay: {
      daySelected: {
        backgroundColor: grey[800],
        color: grey[100],
      },
    },
  },
});

const useStyles = makeStyles(theme => ({
  formControl: {
    width: '145px',

    [theme.breakpoints.up('sm')]: {
      width: '200px',
      '&:first-child': {
        marginRight: '32px',
      },
    },
  },

  root: {
    justifyContent: 'space-around',
    margin: '16px 0',
    padding: '8px',
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start',
      paddingLeft: '52px',
    },
  },
}));

export const useHistoryChartFilters = () => {
  const [country, setCountry] = useState([]);
  const [startDateFilter, setStartDateFilter] = useState(moment('02/01/2020'));
  const [endDateFilter, setEndDateFilter] = useState(
    moment().subtract(1, 'days'),
  );
  const [minDate, setMinDate] = useState(startDateFilter);

  return {
    country,
    endDateFilter,
    minDate,
    setCountry,
    setEndDateFilter,
    setMinDate,
    setStartDateFilter,
    startDateFilter,
  };
};

export default function HistoryChartFilters({
  endDateFilter,
  minDate,
  setEndDateFilter,
  setStartDateFilter,
  startDateFilter,
}) {
  const classes = useStyles();

  const pickerProps = {
    autoOk: true,
    disableToolbar: true,
    format: 'dd/MM/yyyy',
    margin: 'normal',
    maxDateMessage: 'Cannot filter chart by this date.',
    minDateMessage: 'Cannot filter chart by this date.',
    variant: 'inline',
  };

  return (
    <ThemeProvider theme={selectedDateColorOverride}>
      <Grid className={classes.root} component="section" container>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <FormControl className={classes.formControl}>
            <KeyboardDatePicker
              {...pickerProps}
              label="Ngày bắt đầu"
              maxDate={moment(endDateFilter).subtract(1, 'days')}
              minDate={minDate}
              onChange={setStartDateFilter}
              value={startDateFilter}
              KeyboardButtonProps={{
                'aria-label': 'change start date',
              }}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <KeyboardDatePicker
              {...pickerProps}
              label="Ngày kết thúc"
              maxDate={moment().subtract(1, 'days')}
              minDate={moment(startDateFilter).add(1, 'days')}
              onChange={setEndDateFilter}
              value={endDateFilter}
              KeyboardButtonProps={{
                'aria-label': 'change end date',
              }}
            />
          </FormControl>
        </MuiPickersUtilsProvider>
      </Grid>
    </ThemeProvider>
  );
}
