/**
 *
 * CategoryCommentAndPhotos
 *
 */

import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';
import useTheme from '@material-ui/core/styles/useTheme';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Storage } from 'aws-amplify';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';

// import styled from 'styled-components';

const styles = makeStyles(theme => ({
  input: {
    display: 'none',
  },
  root: {
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  input1: {
    height: 50,
    overflow: 'hidden',
  },
  card: {
    width: '80px',
  },
  iconButton: {
    padding: 10,
  },
  oldCommentsContainer: {
    marginBottom: '20px',
    backgroundColor: 'red',
  },
  oldComments: {
    marginBottom: '20px',
  },
}));
function CategoryCommentAndPhotos({
  category,
  module,
  config,
  onCommentChange,
  comment,
  photosList,
  onPhotosListChange,
  currentMarks,
}) {
  const classes = styles;
  const theme = useTheme();
  const [photos, setPhotos] = React.useState([]);
  const [commentOnlyValue, setCommentOnlyValue] = React.useState('');
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  const handleOnCommentChange = e => {
    onCommentChange(e.target.value);
    setCommentOnlyValue(e.target.value);
    console.log(currentMarks);
  };
  const handleCapture = ({ target }) => {
    // console.log(target);
    const file = target.files[0];
    const photo = `${category.name}-${moment().format('x')}`;
    Storage.put(photo, file, {
      contentType: 'image/png',
    }).then(
      resp => {
        console.log(resp);
      },
      err => {
        console.log(err);
      },
    );
    photosList.push(
      `https://hmsdev-userfiles-mobilehub-717810367.s3.amazonaws.com/public/${photo}`,
    );
    onPhotosListChange(photosList);
  };
  return (
    <Zoom
      in
      timeout={transitionDuration}
      // style={{
      //   transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
      // }}
      // unmountOnExit
    >
      <Grid container>
        {!config.hideCategoryName && (
          <Grid item md={12} style={{ marginBottom: '20px' }}>
            <Typography variant="h5" className={classes.subTitle}>
              {category.name}
              <Typography
                style={{ marginLeft: '10px' }}
                variant="caption"
                color="error"
                className={classes.subTitle}
              >
                {module.end_date}
              </Typography>
            </Typography>
          </Grid>
        )}
        <Grid item md={12} className={classes.oldCommentsContainer}>
          <Grid container>
            {currentMarks &&
            currentMarks.marks &&
            currentMarks.marks[category.name] &&
            currentMarks.marks[category.name].comments.map(comment => (
              <Grid item md={12} key={comment} className={classes.oldComments}>
                <Typography>
                  {comment}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item md={6}>
          <TextField
            variant="filled"
            multiline
            fullWidth
            placeholder="Comment"
            value={commentOnlyValue}
            onChange={handleOnCommentChange}
            InputProps={{ classes: { input: classes.input1 } }}
          />
        </Grid>
        <Grid item md={6} style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <input
            accept="image/*"
            className={classes.input}
            style={{ display: 'none' }}
            id={`icon-button-photo-${category.name}`}
            onChange={handleCapture}
            multiple
            type="file"
          />
          <label htmlFor={`icon-button-photo-${category.name}`}>
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          <Grid container>
            {photos.map(photo => (
              <Avatar alt="image" src={photo} />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Zoom>
  );
}

CategoryCommentAndPhotos.propTypes = {
  category: PropTypes.any,
  module: PropTypes.any,
  config: PropTypes.any,
  onCommentChange: PropTypes.func,
  comment: PropTypes.any,
  photosList: PropTypes.any,
  onPhotosListChange: PropTypes.func,
  currentMarks: PropTypes.any,
};

export default CategoryCommentAndPhotos;
