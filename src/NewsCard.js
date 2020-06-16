import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import imgNotAvailable from './img-not-available.png';

NewsCard.propTypes = {
  description: PropTypes.string.isRequired,
  publishedAt: PropTypes.string.isRequired,
  source: PropTypes.shape({ name: PropTypes.string.isRequired }),
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  urlToImage: PropTypes.string,
};

const useStyles = makeStyles({
  action: {
    display: 'block',
    marginTop: '-16px',
    padding: '8px',
    textAlign: 'right',
  },

  media: {
    height: '225px',
  },

  publishedAt: {
    fontSize: '12px',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
});

export default function NewsCard({
  description,
  publishedAt,
  source: { name },
  title,
  url,
  urlToImage,
}) {
  const classes = useStyles();

  return (
    <Card component="article">
      <CardActionArea
        component="div"
        onClick={event => {
          event.currentTarget.querySelector(`.${classes.action}`).click();
        }}
      >
        <CardMedia
          className={classes.media}
          image={urlToImage || imgNotAvailable}
          title={title}
        />

        <CardContent>
          <Typography component="h2" gutterBottom variant="h5">
            {title}
          </Typography>
          <Typography
            className={classes.publishedAt}
            component="p"
            variant="body2"
          >
            {`${name} - ${moment(publishedAt).fromNow()}`}
          </Typography>
          <Typography color="textSecondary" component="p" variant="body2">
            {description}
          </Typography>
        </CardContent>

        <Link
          className={classes.action}
          color="primary"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button color="inherit" size="small">
            Read more
          </Button>
        </Link>
      </CardActionArea>
    </Card>
  );
}
