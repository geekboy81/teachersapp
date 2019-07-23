/**
 *
 * GradeInput
 *
 */

import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import { Paper, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Input from '@material-ui/core/Input';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';

// import PropTypes from 'prop-types';
// import styled from 'styled-components';
const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: '30px',
  },
  formControl: {
    // margin: theme.spacing(1),
    width: '100%',
  },
  mark: {
    width: '70px',
    height: '70px',
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
  },
}));
function GradeInput(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
    mark: '',
    description: '',
  });
  const [currentGradeToEditMark, setCurrentGradeToEditMark] = React.useState({
    grade: {},
    index: -1,
  });
  const [editMarkDialog, setEditMarkDialog] = React.useState(false);
  const [scales, setScales] = React.useState([]);
  React.useEffect(() => {
    setScales(props.grades);
  }, [props]);
  const onDelete = index => {
    // const { grades } = props;
    scales.splice(index, 1);
    props.onDelete(scales);
  };
  const handleAddNewGrade = () => {
    const { mark, description } = state;
    props.onGradeAdded({ mark, description });
    setState({ ...state, mark: '', description: '' });
  };
  function handleClickOpen() {
    setState({ ...state, open: true });
  }
  function handleClose() {
    setState({ ...state, open: false });
  }
  function handleSaveScale() {
    props.onSaveScale();
    setState({ ...state, mark: '', description: '' });
  }
  function handleOnDescription(e) {
    if (e.key === 'Enter') {
      handleAddNewGrade();
    }
  }
  function handleAddMark(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClose();
    }
  }
  function handleOnEdit(index) {
    scales[index].edit = true;
    setScales([...scales]);
  }
  function handleOnSaveEditedGrade(index) {
    // scales[index].descriptio = false;
    scales[index].edit = false;
    setScales([...scales]);
    props.onScaleEdit(scales);
  }
  function onKeyPress(event, index) {
    if (event.key === 'Enter') {
      event.preventDefault();
      scales[index].description = event.target.value;
      scales[index].edit = false;
      setScales([...scales]);
      props.onScaleEdit(scales);
    }
  }
  function onEditGradeChange(event, index) {
    scales[index].description = event.target.value;
    setScales([...scales]);
  }
  function editMark(grade, index) {
    setCurrentGradeToEditMark({ grade, index });
    setEditMarkDialog(true);
  }
  function onEditGradeMarkChange(e) {
    currentGradeToEditMark.grade.mark = e.target.value;
    setCurrentGradeToEditMark({ ...currentGradeToEditMark });
  }
  function handleCloseEditMarkDialog() {
    setEditMarkDialog(false);
  }
  function handleOnSaveEditedGradeMark() {
    scales[currentGradeToEditMark.index] = currentGradeToEditMark.grade;
    setScales([...scales]);
    setEditMarkDialog(false);
    props.onScaleEdit(scales);
  }
  function onEditMarkPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      scales[currentGradeToEditMark.index] = currentGradeToEditMark.grade;
      setScales([...scales]);
      setEditMarkDialog(false);
      props.onScaleEdit(scales);
    }
  }
  return (
    <div className={classes.root}>
      <Grid container direction="row">
        <Grid item md={2}>
          <Paper className={classes.mark} onClick={handleClickOpen}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              style={{ height: '100%' }}
            >
              <Grid item>
                <Typography variant="button">
                  {state.mark !== '' ? state.mark : 'Click Here'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item md={8}>
          <TextField
            id="standard-name"
            label="Grade Description"
            className={classes.textField}
            value={state.description}
            onChange={e => setState({ ...state, description: e.target.value })}
            onKeyPress={e => handleOnDescription(e)}
            margin="normal"
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item md={2}>
          <IconButton color="primary" onClick={handleAddNewGrade}>
            <AddIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} md={12}>
          <div className={classes.demo}>
            <List dense={false}>
              {scales.map((grade, index) => (
                <ListItem key={grade.description}>
                  <ListItemIcon>
                    <ListItemAvatar edge="start" aria-label="Delete">
                      <Avatar onClick={() => editMark(grade, index)}>
                        {grade.mark}
                      </Avatar>
                    </ListItemAvatar>
                  </ListItemIcon>
                  {grade.edit ? (
                    <TextField
                      fullWidth
                      autoFocus
                      onKeyPress={e => onKeyPress(e, index)}
                      onChange={e => onEditGradeChange(e, index)}
                      value={grade.description}
                    />
                  ) : (
                    <ListItemText primary={grade.description} />
                  )}
                  <ListItemSecondaryAction>
                    {grade.edit && (
                      <IconButton
                        edge="end"
                        aria-label="Edit"
                        onClick={() => handleOnSaveEditedGrade(index)}
                      >
                        <SaveIcon />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      aria-label="Edit"
                      onClick={() => handleOnEdit(index)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="Delete"
                      onClick={() => onDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
        <Grid item md={12}>
          <Button variant="contained" color="primary" onClick={handleSaveScale}>
            Save
          </Button>
        </Grid>
      </Grid>
      <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={state.open}
      onClose={handleClose}
    >
      <DialogTitle>Select Grade Mark</DialogTitle>
      <DialogContent>
        <form className={classes.container}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">Grade Mark</InputLabel>
            <Input
              autoFocus
              value={state.mark}
              onChange={e => setState({ ...state, mark: e.target.value })}
              onKeyPress={e => handleAddMark(e)}
              input={<Input id="grade-mark-simple" />}
            />
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={editMarkDialog}
        onClose={handleCloseEditMarkDialog}
      >
        <DialogTitle>Enter New Grade Mark</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Grade Mark</InputLabel>
              <Input
                autoFocus
                value={currentGradeToEditMark.grade.mark}
                onChange={e => onEditGradeMarkChange(e)}
                onKeyPress={e => onEditMarkPress(e)}
                input={<Input id="grade-mark-simplex" />}
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditMarkDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOnSaveEditedGradeMark} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

GradeInput.propTypes = {
  grades: PropTypes.any,
  onGradeAdded: PropTypes.any,
  onDelete: PropTypes.any,
  onSaveScale: PropTypes.any,
  onScaleEdit: PropTypes.func,
};

export default GradeInput;
