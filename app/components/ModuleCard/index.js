/**
 *
 * ModuleCard
 *
 */

import React, { Fragment } from 'react';
import { Button, Card, makeStyles, withStyles } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import RemoveIcon from '@material-ui/icons/Delete';
import CopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withRouter } from 'react-router-dom';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';

import DisplayDate from '../DisplayDate';
import { SEMESTER_STATUS } from 'shared/semester';

const cardHeight = 403.74;
const cardWidth = 333;
const useStyles = makeStyles(theme => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  subTitle1: {
    fontSize: '1.4rem',
  },
  addIcon: {
    marginBottom: theme.spacing(1),
    color: '#CECECE',
    fontSize: '68px',
  },
  addTitle: {
    textAlign: 'center',
    fontSize: '24px',
  },
  addCard: {
    display: 'flex',
    color: 'gray',
    height: cardHeight,
    minHeight: cardHeight,
    width: cardWidth,
    cursor: 'pointer',
    borderRadius: '10px',
  },
  card: {
    display: 'flex',
    minHeight: cardHeight,
    width: cardWidth,
    borderRadius: '10px',
    paddingBottom: '12px',
    paddingTop: '12px',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  cardHeader: {
    width: '100%',
    padding: theme.spacing(1),
  },
  avatar: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '36.28px',
    height: '36.28px',
  },
  cardTitle: {
    marginBottom: theme.spacing(1),
  },
  statusContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: '#F8F8F8',
    fontSize: '14px',
  },
  tx: {
    textAlign: 'center',
  },
  txx: {
    paddingRight: theme.spacing(7),
    fontWeight: 'bolder',
  },
  bolderTitle: {
    fontWeight: 'bolder',
  },
  greenStatus: {
    color: '#3CC89C',
    fontSize: '14px',
  },
  subContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  markingStatus: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  subCotnainerTitle: {
    color: '#C4C4C4',
    fontSize: '14px',
  },
  subCotnainerContent: {
    fontSize: '0.95rem',
  },
  t2: {
    paddingTop: theme.spacing(0.5),
  },
  t1: {
    // marginTop: - theme.spacing(.5),
  },
  progressRoot: {
    flexGrow: 1,
    maxWidth: 130,
    paddingRight: theme.spacing(0.5),
    marginTop: -theme.spacing(0.5),
    // paddingTop: theme.spacing(0.5),
  },
  floatText: {
    paddingRight: theme.spacing(0.5),
  },
  progress: {
    colorPrimary: '#3CC89C',
  },
  actions: {
    marginTop: theme.spacing(1),
    fontWeight: 'bolder',
  },
  btn: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  icon: {
    // color: '#CECECE',
    color: 'silver',
  },
}));
const ColorLinearProgress = withStyles({
  barColorPrimary: {
    backgroundColor: '#3CC89C',
  },
})(LinearProgress);

function ModuleCard(props) {
  const { cardType } = props;
  const classes = useStyles();
  const [values, setValues] = React.useState({
    open: false,
    cloneDialogIsOpen: false,
    moduleToCloneName: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const timer = React.useRef();
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });
  React.useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    [],
  );
  const handleCloneCancel = () =>
    setValues({ ...values, cloneDialogIsOpen: false });
  function handleCloneButtonClick() {
    const { module } = props;
    module.name = values.moduleToCloneName;
    props.onCloneModule(module);
    setValues({ ...values, cloneDialogIsOpen: false });
  }
  function handleButtonClick() {
    if (!props.isDeleting) {
      props.onDeleteModule(props.module);
      timer.current = setTimeout(() => {
        setValues({ ...values, open: false });
      }, 2000);
    }
  }
  const handleCancel = () => {
    setValues({ ...values, open: false });
  };
  const handleOpenCloneModuleDialog = () =>
    setValues({ ...values, cloneDialogIsOpen: true });
  function handleDisplayGroupDetails() {
    props.history.push(`/groups/list/${props.module.id}`);
  }
  function percentage(x, y) {
    return y === 0 ? 0 : (x / y) * 100;
  }
  function onDeleteModule() {
    setValues({ ...values, open: true });
  }
  function onEditModule() {
    props.onEditModule(props.module);
  }
  const card =
    cardType === 'addModule' ? (
      <Card className={classes.addCard} onClick={props.handle}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <AddIcon className={classes.addIcon} />
          </Grid>
          <Grid item>
            <Typography className={classes.subTitle1}>
              Add Module
            </Typography>
          </Grid>
        </Grid>
      </Card>
    ) : (
      <Card className={classes.card}>
        <Grid container direction="column">
          {props.role === 'admin' &&
          <Grid
            className={classes.cardHeader}
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-start"
          >
            <Grid item>
              <IconButton color="inherit" size="small">
                <CopyIcon
                  className={classes.icon}
                  onClick={handleOpenCloneModuleDialog}
                />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton color="inherit" size="small">
                <EditIcon className={classes.icon} onClick={onEditModule} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton color="inherit" size="small">
                <RemoveIcon className={classes.icon} onClick={onDeleteModule} />
              </IconButton>
            </Grid>
          </Grid>
          }
          <Grid container justify="center" className={classes.cardTitle}>
            <Grid item>
              <Typography className={classes.subTitle1}>
                {props.title}
              </Typography>
            </Grid>
          </Grid>
          <Grid container justify="center">
            {props.module.groups && Object.values(props.module.groups).map((childObj, index) => {
              return childObj.name ? (
                <Grid item key={childObj.name}>
                  <Avatar className={classes.avatar}>
                    {childObj.name.charAt(0)}
                  </Avatar>
                </Grid>
              ) : (
                <div key={childObj.name} />
              );
            })}
          </Grid>

          <Grid container className={classes.markingStatus}>
            <Grid item className={classes.subCotnainerTitle}>
              <Typography className={classes.subCotnainerTitle}>
                Marking Status
              </Typography>
            </Grid>
          </Grid>
          {props.module.groups && Object.values(props.module.groups).map((childObj, index) => {
            return childObj.name ? (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={index}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="flex-start"
                  className={classes.subContainer}
                >
                  <Grid item className={classes.t2}>
                    <Typography
                      variant="h7"
                      className={classes.subCotnainerContent}
                    >
                      {childObj.name}
                    </Typography>
                  </Grid>
                  <Grid item className={classes.progressRoot}>
                    <Grid container direction="column">
                      <Grid item className={classes.t1}>
                        <Grid container justify="flex-end">
                          <Grid item>
                            <Typography
                              variant="overline"
                              className={classes.floatText}
                            >
                              {percentage(childObj.childids.reduce((a,b) => (
                                b.status === SEMESTER_STATUS.progress ||
                                b.status === SEMESTER_STATUS.complete ||
                                b.status === SEMESTER_STATUS.published
                               ) ? a + 1 : a, 0), childObj.total).toFixed(2)} %
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          direction="row"
                          justify="center"
                          alignItems="center"
                          className={classes.progressRoot}
                        >
                          <Grid item className={classes.progressRoot}>
                            <ColorLinearProgress
                              variant="determinate"
                              value={percentage(
                                childObj.childids.reduce((a,b) => (
                                  b.status === SEMESTER_STATUS.progress ||
                                  b.status === SEMESTER_STATUS.complete ||
                                  b.status === SEMESTER_STATUS.published
                                 ) ? a + 1 : a, 0),
                                childObj.total,
                              )}
                              className={classes.progress}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Fragment>
            ) : (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} />
            );
          })}

          <CardActions>
            <Grid container justify="flex-end" className={classes.actions}>
              <Grid item>
                <Button
                  onClick={handleDisplayGroupDetails}
                  color="primary"
                  className={classes.btn}
                >
                  View All
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Grid>
      </Card>
    );
  return (
    <Grid container direction="column" justify="center" alignItems="center">
      {card}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="md"
        aria-labelledby="confirmation-dialog-title"
        open={values.open}
      >
        <DialogTitle id="confirmation-dialog-title">
          Are you sure you want to delete this module ?
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="caption">{props.title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={props.isDeleting}
              onClick={handleButtonClick}
            >
              Delete
            </Button>
            {props.isDeleting && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="md"
        aria-labelledby="confirmation-dialog-title"
        open={values.cloneDialogIsOpen}
      >
        <DialogTitle id="confirmation-dialog-titlexrx">
          Enter your new module name, please ?
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            placeholder="enter module name"
            onChange={e =>
              setValues({ ...values, moduleToCloneName: e.target.value })
            }
            value={values.moduleToCloneName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloneCancel} color="primary">
            Cancel
          </Button>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              onClick={handleCloneButtonClick}
            >
              Clone
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

ModuleCard.propTypes = {
  cardType: PropTypes.string,
  handle: PropTypes.any,
  history: PropTypes.any,
  title: PropTypes.string,
  module: PropTypes.any,
  onDeleteModule: PropTypes.any,
  onEditModule: PropTypes.any,
  isDeleting: PropTypes.any,
  onCloneModule: PropTypes.any,
  role: PropTypes.any,
};

export default withRouter(ModuleCard);
