/**
 *
 * Comment
 *
 */

import React from 'react';
import CameraIcon from '@material-ui/icons/CameraAlt';
import AttachmentIcon from '@material-ui/icons/AttachFile';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
}));

function Comment() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Additional Attachments"
        inputProps={{ 'aria-label': 'Additional Attachments' }}
      />
      <IconButton className={classes.iconButton} aria-label="Search">
        <AttachmentIcon />
      </IconButton>
      <Divider className={classes.divider} />
      <IconButton
        className={classes.iconButton}
        aria-label="Directions"
      >
        <CameraIcon />
      </IconButton>
    </div>
  );
}

Comment.propTypes = {};

export default Comment;
