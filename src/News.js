import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Waypoint } from 'react-waypoint';

import NewsCard from './NewsCard';
import { getNews } from './services';

const useStyles = makeStyles(theme => ({
  newsAPICredit: {
    margin: '-8px 0',
    textAlign: 'right',
  },
}));

export default function News() {
  const classes = useStyles();

  const [currentPage, setCurrentPage] = useState(1);
  const [newsArticles, setNewsArticles] = useState([]);

  // Get news articles when component mounts
  useEffect(() => {
    const _newsData = async () => {
      const {
        data: { articles },
      } = await getNews({ page: currentPage });

      setNewsArticles(articles);
      setCurrentPage(currentPage + 1);
    };

    _newsData();
  }, []); // eslint-disable-line

  const _getNextPage = async () => {
    const {
      data: { articles },
    } = await getNews({ page: currentPage });

    setNewsArticles(
      _.uniqBy([...newsArticles, ...articles], ({ title }) => title),
    );
    setCurrentPage(currentPage + 1);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography className={classes.newsAPICredit} variant="body2">
          Powered by <Link href="https://newsapi.org/">newsapi.org</Link>
        </Typography>
      </Grid>
      {newsArticles.map((article, index) => (
        <Grid item key={`${index} - ${article.title}`} xs={12} sm={6} lg={4}>
          <NewsCard {...article} />
        </Grid>
      ))}

      <Waypoint onEnter={_getNextPage} />
    </Grid>
  );
}
