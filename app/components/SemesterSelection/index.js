import React from 'react';
import * as PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';


const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  clearBtn: {
    color: '#fff',
    fontSize: '1rem',
    padding: '1px',
  },
  item: {
    display: 'flex',
    cursor: 'pointer',
    borderRadius: '5px',
    height: '20px',
    fontSize: '0.85rem',
    lineHeight: '20px',
    color: 'white',
    backgroundColor: '#3D8690',
    marginRight: '5px',
    paddingLeft: '5px',
  },
  label: {
    fontSize: '0.85rem',
  },
  semesters: {
    display: 'flex',
  }
}));

function SemesterSelection({
  handleClose,
  years,
  slices,
}) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
    year: '',
    slice: '',
  });

  const [semesters, setSemesters] = React.useState([]);

  const handleChange = name => event => {
    setState({ ...state, [name]: Number(event.target.value) });
  };

  const handleAdd = () => {
    if (
      state.year !== '' &&
      state.slice !== '' &&
      !semesters.some(semester => (
        semester.year == state.year &&
        semester.slice == state.slice
      ))
    ) {
      setSemesters([...semesters, { year: state.year, slice: state.slice }]);
    }
  }

  return (
    <div>
      <Dialog disableBackdropClick disableEscapeKeyDown open onClose={handleClose}>
        <DialogTitle>Select semesters</DialogTitle>
        <DialogContent>
          <div className={classes.semesters}>
            {
              semesters.map(semester => (
                <div className={classes.item}>
                  <div className={classes.label}>
                    <span>{semester.year}-{semester.slice}</span>
                  </div>
                  <IconButton className={classes.clearBtn}>
                    <ClearIcon fontSize="inherit" />
                  </IconButton>
                </div>
              ))
            }
          </div>
          <div className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Year</InputLabel>
              <Select
                value={state.year}
                onChange={handleChange('year')}
                input={<Input id="age-simple" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {
                  Array.from({ length: years }).map((year, index) => (
                    <MenuItem value={index+1}>
                      <em>{index+1}</em>
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Trimester</InputLabel>
              <Select
                value={state.slice}
                onChange={handleChange('slice')}
                input={<Input id="age-simple" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {
                  Array.from({ length: slices }).map((slice, index) => (
                    <MenuItem value={index + 1}>
                      <em>{index + 1}</em>
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            <Button onClick={handleAdd} color="primary">
              Add
            </Button>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleClose([])} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleClose(semesters)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

SemesterSelection.propTypes = {
  setSelectedSlices: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  years: PropTypes.number.isRequired,
  slices: PropTypes.number.isRequired,
}

export default SemesterSelection;