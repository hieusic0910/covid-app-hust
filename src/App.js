import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import Map from './Map';
import NotFound from './NotFound';
import PageTemplate from './PageTemplate';
import useInterval from 'useInterval';
import { getTotals } from './services';
import News from './News'

import './App.css';
import '../node_modules/react-vis/dist/style.css';


export const paths = {
  dashboard: {
    name: 'Bảng thống kê',
    path: '/dashboard',
  },
  map: {
    name: 'Thế giới',
    path: '/',
  },
  news: {
    name: "News",
    path:'/news'
  }
};

function App() {
  const [totals, setTotals] = useState({
    active: 0,
    affectedCountries: 0,
    cases: 0,
    deaths: 0,
    prevActive: 0,
    prevCases: 0,
    prevDeaths: 0,
    prevRecovered: 0,
    recovered: 0,
    tests: 0,
    updated: null,
  });

  const _getTotals = async () => {
    const { data } = await getTotals();

    setTotals({
      prevActive: totals.active,
      prevCases: totals.cases,
      prevDeaths: totals.deaths,
      prevRecovered: totals.recovered,
      ...data,
    });
  };

  // Get total data every 2 minutes
  useInterval(_getTotals, 1000 * 60 * 2);

  // On mount
  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID);
    ReactGA.pageview(window.location.pathname + window.location.search);

    _getTotals();
  }, []); // eslint-disable-line

  return (
    <Router>
      <PageTemplate totals={totals}>
        <Switch>
          <Route
            exact
            path={paths.dashboard.path}
            render={(_props) => <Dashboard totals={totals} />}
          />
          <Route
            exact
            path={paths.map.path}
            render={(_props) => <Map totals={totals} />}
          />
          <Route
            exact
            path={paths.news.path}
            render={(_props) => <News/>}
          />
          <Route component={NotFound} />
        </Switch>
      </PageTemplate>
    </Router>
  );
}

export default App;
