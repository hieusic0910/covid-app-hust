import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import numeral from 'numeral';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Paper from '@material-ui/core/Paper';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import yellow from '@material-ui/core/colors/yellow';
import { Waypoint } from 'react-waypoint';
import CountCard from './CountCard';
import DataTable from './DataTable';
import HistoryChart from './HistoryChart';
import HistoryChartFilters, {
  useHistoryChartFilters,
} from './HistoryChartFilters';

import {
  getCountries,
  getHistory,
  
  getYesterdayTotals,
} from './services';
import { useDashboardStyles, YesterdayDiffTooltip } from './Dashboard.styles';

Dashboard.propTypes = {
  totals: PropTypes.shape({
    active: PropTypes.number,
    affectedCountries: PropTypes.number,
    cases: PropTypes.number,
    deaths: PropTypes.number,
    prevActive: PropTypes.number,
    prevCases: PropTypes.number,
    prevDeaths: PropTypes.number,
    prevRecovered: PropTypes.number,
    recovered: PropTypes.number,
    tests: PropTypes.number,
  }).isRequired,
};

export default function Dashboard({ totals }) {
  const classes = useDashboardStyles();
  const dateFilters = useHistoryChartFilters();

  const isXSBreakpoint = useMediaQuery('(max-width: 600px)');

  const pageRef = useRef(null);
  const [isFabShown, setIsFabShown] = useState(false);

  const [countryTableBodyRows, setCountryTableBodyRows] = useState([]);

  const [history, setHistory] = useState({});

  

  const [yesterdayTotals, setYesterdayTotals] = useState({
    active: totals.active,
    cases: totals.cases,
    deaths: totals.deaths,
    recovered: totals.recovered,
  });

  // Get data for tables and charts when component mounts
  useEffect(() => {
    const _countryData = async () => {
      const { data } = await getCountries();
      let countryTableData = data;

      // API keeps changing. Filter out first if it is World.
      // eslint-disable-next-line
      const [worldData, ...countryData] = data;
      if (worldData.country === 'World') countryTableData = countryData;

      const countryBodyRows = countryTableData.map(
        ({ active, cases, country, deaths, recovered, todayCases }) => ({
          id: country,
          country,
          active,
          deaths,
          recovered,
          todayCases,
          cases,
        }),
      );
      setCountryTableBodyRows(countryBodyRows);
    };

    const _historyData = async () => {
      const {
        data: { cases },
      } = await getHistory();

      setHistory(cases);

      const firstDate = moment(Object.keys(cases)[0]);
      dateFilters.setMinDate(firstDate);
      dateFilters.setStartDateFilter(firstDate);
    };

    

    const _yesterdayData = async () => {
      const { data } = await getYesterdayTotals();

      setYesterdayTotals(data);
    };

    _countryData();
    _historyData();
    
    _yesterdayData();
  }, []); // eslint-disable-line

  const _scrollToTop = () => {
    pageRef.current.scrollTo(0, pageRef.current.offsetTop);
  };

  const countryTableHeadCells = [
    { id: 'country', label: 'Quốc gia' },
    {
      id: 'active',
      label: 'Số ca hiện tại',
    },
    { id: 'deaths', label: 'Tử vong' },
    { id: 'recovered', label: 'Ca  hồi phục' },
    { id: 'todayCases', label: 'Mới ghi nhận' },
    { id: 'cases', label: 'Tổng số ca ghi nhận' },
  ];
 

  const renderedTotals = [
    {
      count: totals.active,
      countColor: red[500],
      id: 'dashboard-total--active',
      prevCount: totals.prevActive,
      title: 'Số ca hiện tại',
      yesterdayDiff: totals.active - yesterdayTotals.active,
      yesterdayPercent:
        ((totals.active - yesterdayTotals.active) / totals.active) * 100,
    },
    {
      count: totals.deaths,
      countColor: yellow[500],
      id: 'dashboard-total--deaths',
      prevCount: totals.prevDeaths,
      title: 'Tử vong',
      yesterdayDiff: totals.deaths - yesterdayTotals.deaths,
      yesterdayPercent:
        ((totals.deaths - yesterdayTotals.deaths) / totals.deaths) * 100,
    },
    {
      count: totals.recovered,
      countColor: green[400],
      id: 'dashboard-total--recovered',
      prevCount: totals.prevRecovered,
      title: 'Ca hồi phục',
      yesterdayDiff: totals.recovered - yesterdayTotals.recovered,
      yesterdayPercent:
        ((totals.recovered - yesterdayTotals.recovered) / totals.recovered) *
        100,
    },
    {
      count: totals.cases,
      countColor: grey[100],
      id: 'dashboard-total--cases',
      prevCount: totals.prevCases,
      title: 'Tổng số ca ghi nhận',
      yesterdayDiff: totals.cases - yesterdayTotals.cases,
      yesterdayPercent:
        ((totals.cases - yesterdayTotals.cases) / totals.cases) * 100,
    },
  ];

  return (
    <article className={classes.root} ref={pageRef}>
      <Container>
        <Grid container spacing={3}>
          {/* Header */}
          <Waypoint
            fireOnRapidScroll
            onEnter={() => {
              setIsFabShown(false);
            }}
            onLeave={() => {
              setIsFabShown(true);
            }}
          >
            <Grid
              className={classes.header}
              component="header"
              container
              item
              spacing={2}
            >
              {renderedTotals.map(
                ({ id, title, yesterdayDiff, yesterdayPercent, ...data }) => (
                  <Grid item key={id} xs={12} sm={5} lg={3}>
                    <Paper className={classes.headerCard} elevation={2}>
                      <CountCard
                        title={
                          <Typography className={classes.headerCountTitle}>
                            {title}
                          </Typography>
                        }
                        {...data}
                      >
                        <Grid
                          alignItems="center"
                          className={classes.yesterdayContainer}
                          container
                        >
                          <YesterdayDiffTooltip
                            placement="right-start"
                            title={`${numeral(yesterdayDiff).format(
                              '0,0',
                            )} newly confirmed cases`}
                          >
                            <Typography
                              className={classes.yesterdayDiff}
                              component="p"
                              variant="body2"
                            >
                              {`${yesterdayPercent > 0 ? '+' : ' '}${numeral(
                                yesterdayDiff,
                              ).format('0,0')} (${numeral(
                                yesterdayPercent,
                              ).format('0.00')}%)`}
                            </Typography>
                          </YesterdayDiffTooltip>

                          {yesterdayPercent <= -0.5 && (
                            <TrendingDownIcon
                              className={classes.yesterdayIcon}
                              fontSize="small"
                            />
                          )}
                          {yesterdayPercent > -0.5 &&
                            yesterdayPercent < 0.5 && (
                              <TrendingFlatIcon
                                className={classes.yesterdayIcon}
                                fontSize="small"
                              />
                            )}
                          {yesterdayPercent >= 0.5 && (
                            <TrendingUpIcon
                              className={classes.yesterdayIcon}
                              fontSize="small"
                            />
                          )}
                        </Grid>
                      </CountCard>
                    </Paper>
                  </Grid>
                ),
              )}
            </Grid>
          </Waypoint>

          {/* Overview */}
          <Grid component="section" container item xs={12}>
            <Grid item xs={12}>
              <DashboardHeading>Tổng quan</DashboardHeading>
            </Grid>

            <Grid item xs={12}>
              <Paper>
                <div className={classes.historyChartContainer}>
                  <Typography className={classes.historyChartTitle}>
                    Tổng số ca theo thời gian
                  </Typography>
                  <HistoryChart
                    endDate={dateFilters.endDateFilter}
                    height={isXSBreakpoint ? 250 : 500}
                    history={history}
                    startDate={dateFilters.startDateFilter}
                  />
                </div>
                <HistoryChartFilters {...dateFilters} />
                {/* 
                TODO: Add back once I figure out a better information architecture
                <Grid className={classes.numbersGrid} container xs={12}>
                  <Grid className={classes.numberContainer} item xs={6} md={4}>
                    <DashboardNumber caption="Countries affected">
                      {totals.affectedCountries}
                    </DashboardNumber>
                  </Grid>

                  <Grid className={classes.numberContainer} item xs={6} md={4}>
                    <DashboardNumber
                      caption="Mortality rate"
                      decimals={2}
                      formattingFn={number => `${number}%`}
                    >
                      {(totals.deaths / totals.cases) * 100}
                    </DashboardNumber>
                  </Grid>

                  <Grid className={classes.numberContainer} item xs={12} md={4}>
                    <DashboardNumber
                      caption="Tests administered"
                      decimals={2}
                      formattingFn={number => numeral(number).format('0,0')}
                    >
                      {totals.tests}
                    </DashboardNumber>
                  </Grid>
                </Grid> */}

                {/* Country overview table */}
                <DataTable
                  bodyRows={countryTableBodyRows}
                  headCells={countryTableHeadCells}
                  elevation={0}
                  initialOrder="desc"
                  initialOrderBy="active"
                />
              </Paper>
            </Grid>
          </Grid>

          

          {/* News Feed */}
          {/* <Grid component="section" item xs={12}>
            <DashboardHeading>News Feed</DashboardHeading>
            <News />
          </Grid> */}
        </Grid>
      </Container>

      <Zoom in={isFabShown}>
        <Fab
          aria-label="scroll back to top"
          className={classes.fab}
          onClick={_scrollToTop}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </article>
  );
}

function DashboardHeading({ children }) {
  const classes = useDashboardStyles();

  return (
    <>
      <Typography className={classes.sectionHeader} component="h2" variant="h5">
        {children}
      </Typography>
      <Divider className={classes.divider} />
    </>
  );
}

// function DashboardNumber({
//   caption,
//   children: number,
//   decimals = 0,
//   formattingFn = undefined,
// }) {
//   const classes = useDashboardStyles();

//   const [counterEnd, setCounterEnd] = useState(0);
//   const [didCount, setDidCount] = useState(false);

//   // Update count if number changes and count animation was already seen
//   useEffect(() => {
//     if (didCount && counterEnd !== number) setCounterEnd(number);
//   }, [number]); // eslint-disable-line

//   const _startCounter = () => {
//     if (didCount) return;

//     setCounterEnd(number);
//     setDidCount(true);
//   };

//   return (
//     <>
//       <Waypoint onEnter={_startCounter} />
//       <Typography align="center" component="h3" variant="h4">
//         <CountUp
//           decimals={decimals}
//           end={counterEnd}
//           formattingFn={formattingFn}
//           start={0}
//         />
//       </Typography>
//       <Typography align="center" component="p" variant="body1">
//         {caption}
//       </Typography>
//     </>
//   );
// }
