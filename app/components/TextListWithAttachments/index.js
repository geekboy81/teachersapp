/**
 *
 * TextListWithAttachments
 *
 */

import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import * as PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import Comment from '../Comment';
import TextField from '@material-ui/core/TextField';

// import PropTypes from 'prop-types';
// import styled from 'styled-components';
const useStyles = makeStyles(theme => ({
  title: {
    padding: theme.spacing(1),
  },
  subTitle: {
    marginLeft: theme.spacing(1),
    color: 'gray',
    padding: theme.spacing(1),
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  inputFullWidth: {
    marginTop: 16,
    width: '100%',
    minWidth: '100%',
  },
  fw: {
    width: '100%',
    minWidth: '100%',
  },
}));
function TextListWithAttachments(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    title: '',
    grade: {
      name: '',
      grades: {
        mark: '',
        description: '',
      },
    },
  });
  const [skills, setSkills] = React.useState([]);
  React.useEffect(() => {
    if (props.category.skills) {
      const mappedSkills = props.category.skills.map(skill => Object.assign(skill, { ref: React.createRef(), edit: false }));
      setSkills(mappedSkills);
    }
  }, [props]);
  const { grade } = props.category;

  useEffect(() => {
    if (grade) {
      setState({ ...state, grade });
    }
  }, [grade]);
  const handleOnDelete = index => {
    const { category } = props;
    skills.splice(index, 1);
    category.skills = skills;
    setSkills([...skills]);
    props.onDeleteSkill(category);
  };
  const handleOnEdit = index => {
    skills[index].edit = true;
    setSkills([...skills]);
  };
  const handleOnSave = index => {
    const { category } = props;
    skills[index].edit = false;
    category.skills = skills;
    props.onEditSkill(category);
  };
  const onSkillEditChange = (index, event, ref) => {
    skills[index].name = event.target.value;
    ref.current.focus();
    setSkills([...skills]);
  };
  const onKeyPress = (index, event) => {
    if (event.key === 'Enter') {
      skills[index].edit = false;
      setSkills([...skills]);
    }
  };
  function onAddSkill(event) {
    if (event.key === 'Enter') {
      props.category.skills.push({ name: state.title, mark: state.grade.name });
      props.onAddSkill(props.category);
      setState({ ...state, title: '' });
    }
  }
  function onCategoryScaleChanged(scale) {
    const { category } = props;
    category.selectedId = scale.id;
    props.onCategoryScaleChanged(props.category);
    setState({ ...state, grade: scale });
  }
  function handleOnDeleteCategory() {
    props.onDeleteCategory(props.category);
  }
  return (
    <div className={classes.root}>
      <Grid container direction="row">
        <Grid item md={1}>
          <IconButton
            edge="end"
            aria-label="Delete"
            onClick={() => handleOnDeleteCategory()}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
        <Grid item md={6}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item className={classes.title}>
              <Typography variant="h6">{props.title}</Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.subTitle} variant="subtitle2">
                {props.subTitle}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={2} />
        <Grid item md={3}>
          <Grid container direction="row" justify="flex-end">
            <Grid item md={12}>
              <FormControl className={classes.formControl} component="a">
                <InputLabel htmlFor="age-simplex" style={{ width: '100%' }}>
                  Select Scale
                </InputLabel>
                <Select
                  value={state.grade}
                  onChange={ev => onCategoryScaleChanged(ev.target.value)}
                >
                  {props.grades.map(scale => (
                    <MenuItem
                      key={scale.name}
                      component="a"
                      button
                      value={scale}
                    >
                      <em>{scale.name}</em>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12}>
          <Paper
            style={{
              backgroundColor: '#CECECE',
              padding: '8px',
              paddingLeft: '15px',
            }}
            className={classes.inputFullWidth}
          >
            <InputBase
              label="Dense"
              className={classes.fw}
              placeholder="Skill Title"
              onChange={e => setState({ ...state, title: e.target.value })}
              value={state.title}
              onKeyPress={onAddSkill}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <div className={classes.demo}>
            <List dense={false}>
              {skills.map((skill, index) => (
                <ListItem key={skill.name}>
                  {skill.edit ?
                    (<ListItem>
                        <TextField style={{ width: '100%' }}
                                   inputRef={skill.ref}
                                   autoFocus
                                   onKeyPress={e => onKeyPress(index, e, skill.ref)}
                                   onChange={e => onSkillEditChange(index, e, skill.ref)}
                                   value={skill.name}/>
                    </ListItem>) : (<ListItemText primary={skill.name}/>)}
                  <ListItemSecondaryAction>
                    {skill.edit &&
                    (<IconButton
                      edge="end"
                      aria-label="Edit"
                      onClick={() => handleOnSave(index)}
                    >
                      <SaveIcon />
                    </IconButton>)}
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
                      onClick={() => handleOnDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

TextListWithAttachments.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  onAddSkill: PropTypes.any,
  category: PropTypes.any,
  onDeleteSkill: PropTypes.any,
  grades: PropTypes.any,
  onCategoryScaleChanged: PropTypes.any,
  onEditSkill: PropTypes.func,
  onDeleteCategory: PropTypes.func,
};
export default TextListWithAttachments;

// {/*<Grid item md={12}>*/}
// {/*  <Comment />*/}
// {/*</Grid>*/}
