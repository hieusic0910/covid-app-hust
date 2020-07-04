import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import numeral from 'numeral';
import MapGL, { FlyToInterpolator, Layer, Popup, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import SortIcon from '@material-ui/icons/Sort';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import yellow from '@material-ui/core/colors/yellow';
import clsx from 'clsx';
import * as d3 from 'd3-ease';

import { getGEOData } from './services';
import { useMapStyles } from './Map.styles';

export default function Map({ totals }) {
  const classes = useMapStyles();
  const isMdBreakpoint = useMediaQuery('(min-width: 960px)');

  const [viewport, setViewport] = useState({
    latitude: 21,
    longitude: 105.8,
    zoom: 2.5,
    bearing: 0,
    pitch: 0,
  });
  const [clusterData, setClusterData] = useState(null);
  const [currentCluster, setCurrentCluster] = useState('active');
  const [currentClusterColor, setCurrentClusterColor] = useState(red[500]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({});

  const [clusterList, setClusterList] = useState([]);
  const [isClusterListOpen, setIsClusterListOpen] = useState(false);

  const sourceRef = useRef();

  // Get GEO data when component mounts
  useEffect(() => {
    const _geoData = async () => {
      const { data } = await getGEOData();

      // Remove garbage data
      const filteredData = data.filter(
        ({ province }) => province !== 'Recovered',
      );

      const features = filteredData.map(
        ({
          coordinates: { latitude, longitude },
          country,
          province: state,
          stats: { confirmed, deaths, recovered },
        }) => {
          const cases = parseInt(confirmed);
          const numDeaths = parseInt(deaths);
          const numRecovered = parseInt(recovered);

          const isStatePresent = state && state !== 'null';
          const isCountryPresent = country && country !== 'null';

          return {
            geometry: {
              coordinates: [longitude, latitude],
              type: 'Point',
            },
            properties: {
              active: cases - numDeaths - numRecovered,
              cases,
              deaths: numDeaths,
              latitude: parseFloat(latitude), // mapboxGL throws an error when this is a string
              longitude: parseFloat(longitude), // mapboxGL throws an error when this is a string
              name:
                isStatePresent && isCountryPresent
                  ? `${state}, ${country}`
                  : country,
              recovered: numRecovered,
            },
            type: 'Feature',
          };
        },
      );

      const list = _.orderBy(
        features.map(({ properties }) => properties),
        [currentCluster],
        ['desc'],
      );

      setClusterList(list);
      setClusterData({
        features,
        type: 'FeatureCollection',
      });
    };

    _geoData();
  }, []); // eslint-disable-line

  const _onViewportChange = (updatedViewport) => setViewport(updatedViewport);

  const _onClick = (event) => {
    if (!(event.hasOwnProperty('features') && event.features[0])) return;

    const clickedPoint = event.features[0];

    const {
      geometry: {
        coordinates: [longitude, latitude],
      },
      properties: { active, deaths, name, recovered },
    } = clickedPoint;

    _flyToClickedPoint({
      latitude,
      longitude,
    });

    setPopupData({
      latitude,
      longitude,
      name,
      stats: {
        active: numeral(active).format('0,0'),
        deaths: numeral(deaths).format('0,0'),
        recovered: numeral(recovered).format('0,0'),
      },
    });
    setIsPopupOpen(true);
  };

  const _flyToClickedPoint = ({
    latitude,
    longitude,
    transitionDuration = 1000,
  }) => {
    setViewport({
      ...viewport,
      latitude,
      longitude,
      transitionDuration,
      transitionEasing: d3.easeCubic,
      transitionInterpolator: new FlyToInterpolator(),
      zoom: 5,
    });
  };

  const _zoomOutMap = () => {
    setViewport({
      ...viewport,
      transitionDuration: 1000,
      transitionEasing: d3.easeCubic,
      transitionInterpolator: new FlyToInterpolator(),
      zoom: 0,
    });
  };

  const _onClusterTypeBtnClick = (type) => {
    let clusterColor;

    switch (type) {
      default:
      case 'active':
        clusterColor = red[500];
        break;

      case 'deaths':
        clusterColor = yellow[500];
        break;

      case 'recovered':
        clusterColor = green[400];
        break;
    }

    const updatedList = _.orderBy(clusterList, [type], ['desc']);

    setCurrentCluster(type);
    setCurrentClusterColor(clusterColor);
    setClusterList(updatedList);
  };

  let clusterOpacity = 0,
    clusterStrokeOpacity = 0;
  const { zoom } = viewport;
  if (zoom <= 1) clusterOpacity = 0.175;
  else if (zoom > 1 && zoom <= 2) {
    clusterOpacity = 0.3;
    clusterStrokeOpacity = 0.5;
  } else {
    clusterOpacity = 0.6;
    clusterStrokeOpacity = 1;
  }

  const clusterLayer = {
    filter: ['all', ['has', currentCluster], ['>', currentCluster, 0]],
    id: 'cluster-circle',
    paint: {
      'circle-color': currentClusterColor,
      'circle-opacity': clusterOpacity,
      'circle-radius': [
        'step',
        ['get', currentCluster],
        2.5, // Base radius
        10, // When active cases >= 50 && cases < 100, radius = 5
        5,
        50,
        7.5,
        100,
        8,
        500,
        10,
        1000,
        12.5,
        2500,
        15,
        5000, // When active cases >= 5000 && cases < 10000, radius = 17.5
        16,
        10000,
        18,
        25000,
        20,
        50000,
        22,
        75000,
        24,
        100000,
        26,
        150000,
        28,
        200000,
        30,
        250000,
        32,
        300000,
        34,
        350000,
        36,
      ],
      'circle-stroke-color': currentClusterColor,
      'circle-stroke-opacity': clusterStrokeOpacity,
      'circle-stroke-width': 1,
    },
    source: 'cluster-circle',
    type: 'circle',
  };

  const clusterTypeButtons = [
    {
      className: clsx(
        classes.clusterTypeButton,
        currentCluster === 'active' && classes.clusterTypeButtonEnabled,
        classes.clusterTypeButtonActive,
      ),
      isDisabled: currentCluster === 'active',
      text: 'Số ca hiện tại',
      type: 'active',
    },
    {
      className: clsx(
        classes.clusterTypeButton,
        currentCluster === 'deaths' && classes.clusterTypeButtonEnabled,
        classes.clusterTypeButtonDeaths,
      ),
      isDisabled: currentCluster === 'deaths',
      text: 'Tử vong',
      type: 'deaths',
    },
    {
      className: clsx(
        classes.clusterTypeButton,
        currentCluster === 'recovered' && classes.clusterTypeButtonEnabled,
        classes.clusterTypeButtonRecovered,
      ),
      isDisabled: currentCluster === 'recovered',
      text: 'Ca hồi phục',
      type: 'recovered',
    },
  ];

  return (
    <>
      <MapGL
        {...viewport}
        dragRotate={false}
        height="100%"
        interactiveLayerIds={[clusterLayer.id]}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_GL_API_TOKEN}
        maxZoom={5}
        onClick={_onClick}
        onViewportChange={_onViewportChange}
        width="100%"
      >
        <Source data={clusterData} ref={sourceRef} type="geojson">
          <Layer {...clusterLayer} />
        </Source>

        {viewport.zoom > 4.5 && isPopupOpen && (
          <Popup
            anchor="bottom"
            latitude={popupData.latitude}
            longitude={popupData.longitude}
            onClose={() => {
              setIsPopupOpen(false);
            }}
            tipSize={6}
          >
            <Typography className={classes.popupTitle} component="h6">
              {popupData.name}
            </Typography>

            <List className={classes.popupStats} dense>
              <ListItem dense>
                <strong>{`${popupData.stats.active} Số ca hiện tại`}</strong>
              </ListItem>
              <ListItem>
                <strong>{`${popupData.stats.deaths} Tử vong`}</strong>
              </ListItem>
              <ListItem>
                <strong>{`${popupData.stats.recovered} Hồi phục`}</strong>
              </ListItem>
            </List>
          </Popup>
        )}
      </MapGL>

      <ButtonGroup
        aria-label="button group to display active cases, deaths, or recovered on the map"
        className={classes.clusterTypeButtonGroup}
        size="small"
      >
        <Button
          aria-label="button to toggle a list of locations in descending order, by active cases, deaths, or recovered"
          className={clsx(
            classes.clusterTypeButton,
            isClusterListOpen && classes.clusterTypeButtonEnabled,
            classes.clusterTypeButtonShowList,
          )}
          onClick={() => {
            setIsClusterListOpen(!isClusterListOpen);
          }}
        >
          <SortIcon fontSize="small" />
        </Button>

        {clusterTypeButtons.map(({ className, isDisabled, text, type }) => (
          <Button
            className={className}
            disabled={isDisabled}
            key={type}
            onClick={() => {
              _onClusterTypeBtnClick(type);
            }}
          >
            {text}
          </Button>
        ))}
      </ButtonGroup>

      <Zoom in={viewport.zoom > 4.5}>
        <Fab
          aria-label="zoom out map"
          className={classes.fab}
          onClick={_zoomOutMap}
        >
          <ZoomOutMapIcon />
        </Fab>
      </Zoom>

      <SwipeableDrawer
        anchor={isMdBreakpoint ? 'right' : 'bottom'}
        classes={{
          paper: classes.clusterListSwipeableDrawer,
        }}
        className={classes.clusterListSwipeableDrawerContainer}
        onClose={() => {
          setIsClusterListOpen(false);
        }}
        onOpen={() => {
          setIsClusterListOpen(true);
        }}
        open={isClusterListOpen}
      >
        <Typography
          align="center"
          className={clsx(
            classes.clusterListHeader,
            currentCluster === 'active' && classes.clusterListHeaderActive,
            currentCluster === 'deaths' && classes.clusterListHeaderDeaths,
            currentCluster === 'recovered' &&
              classes.clusterListHeaderRecovered,
          )}
          component="h3"
          variant="h3"
        >
          {numeral(totals[currentCluster]).format('0,0')}
        </Typography>
        <Typography
          align="center"
          className={clsx(
            classes.clusterListSubHeader,
            currentCluster === 'active' && classes.clusterListHeaderActive,
            currentCluster === 'deaths' && classes.clusterListHeaderDeaths,
            currentCluster === 'recovered' &&
              classes.clusterListHeaderRecovered,
          )}
          component="h4"
          variant="h6"
        >
          {currentCluster === 'active' && 'SỐ CA HIỆN TẠI'}
          {currentCluster === 'deaths' && 'TỬ VONG'}
          {currentCluster === 'recovered' && 'HỒI PHỤC'}
        </Typography>

        <List className={classes.clusterList}>
          {clusterList.map(
            ({ active, deaths, latitude, longitude, name, recovered }) => {
              let dataToShow;
              switch (currentCluster) {
                default:
                case 'active':
                  dataToShow = active;
                  break;
                case 'deaths':
                  dataToShow = deaths;
                  break;
                case 'recovered':
                  dataToShow = recovered;
                  break;
              }

              return (
                <ListItem
                  button
                  className={classes.clusterListItem}
                  key={`${name}${active}${deaths}${recovered}`}
                  onClick={() => {
                    setIsClusterListOpen(false);

                    setPopupData({
                      latitude,
                      longitude,
                      name,
                      stats: {
                        active: numeral(active).format('0,0'),
                        deaths: numeral(deaths).format('0,0'),
                        recovered: numeral(recovered).format('0,0'),
                      },
                    });
                    setIsPopupOpen(true);

                    _flyToClickedPoint({
                      latitude,
                      longitude,
                      transitionDuration: 2500,
                    });
                  }}
                >
                  <span className={classes.clusterListItemName}>{name}</span>
                  <span>{numeral(dataToShow).format('0,0')}</span>
                </ListItem>
              );
            },
          )}
        </List>
      </SwipeableDrawer>
    </>
  );
}
