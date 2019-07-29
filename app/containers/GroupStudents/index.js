/**
 *
 * GroupStudents
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { API } from 'aws-amplify';

import {
  Card,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
  withStyles,
} from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FilledInput from '@material-ui/core/FilledInput';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import * as axios from 'axios';

import { SEMESTER_STATUS, SEMESTER_STATUS_COLORS, getSemesterStatus } from 'shared/semester';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import makeSelectGroupStudents from './selectors';
import reducer from './reducer';
import saga from './saga';
import { BACKEND_URL } from '../../config';
import moduleService from '../../shared/service/module';

import { publishSemesters } from 'shared/api/semester';


const GreenRadio = withStyles({
  root: {
    color: '#3CC89C',
    '&$checked': {
      color: '#3CC89C',
    },
  },
  checked: {},
})(props => <Radio color="default" {...props} />);
const useStyles = makeStyles(theme => ({
  selectGroup: {
    minWidth: '70%',
  },
  paper: {
    // padding: '2px 4px',
    backgroundColor: '#EFEFEF',
    display: 'flex',
    alignItems: 'center',
    // width: 350,
    marginBottom: theme.spacing(3),
  },
  searchRoot: {
    padding: '2px 4px',
  },
  rdborder: {
    borderLeft: '2px solid #EFEFEF',
    textAlign: 'center',
    paddingLeft: theme.spacing(3),
  },
  xxfilter: {
    paddingLeft: '20px',
  },
  input: {
    margin: 0,
    marginLeft: 8,
    flex: 1,
    color: 'black',
  },
  iconButton: {
    padding: 10,
    color: 'black',
  },
  root: {
    display: 'flex',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(2),
  },
  progressRoot: {
    flexGrow: 1,
    maxWidth: 180,
    paddingTop: theme.spacing(0.5),
  },
  item: {
    marginBottom: theme.spacing(3),
  },
  innerCard: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  progressText: {
    paddingLeft: theme.spacing(1),
  },
	customProgress: {},
	childAvatar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
    border: 'none',
    maxWidth: '200px',
	},
	tableCell: {
		border: 'none',
	},
	semesterStatus: {
		fontSize: '0.8rem',
	},
	tableCellHead: {
		border: 'none',
    fontWeight: 'bold',
    minWidth: '125px',
  },
  tableCellButton: {
    border: 'none',
    minWidth: '200px',
  }
}));

export function GroupStudents(props) {
  useInjectReducer({ key: 'groupStudents', reducer });
  useInjectSaga({ key: 'groupStudents', saga });
  const classes = useStyles();

  const [values, setValues] = React.useState({
    search: '',
    markFilter: '',
    selectedGroup: {
      name: '',
    },
    module: {
      module: '',
    },
    childIds: [],
    allSelected: false,
  });

  const { moduleId } = props.match.params;

  useEffect(() => {
    fetchAllData(moduleId);
  }, [moduleId]);


  const fetchAllData = (module_id) => {
    async function fetchModuleDetails() {
      const module = await moduleService.getModuleById(module_id);
      return module;
    }

    fetchModuleDetails().then(resp => {
      const m = resp.message;

      const sGroup = Object.values(m.groups).filter(
        group =>
          group.name.toLowerCase() ===
          props.match.params.groupName.toLowerCase(),
      )[0];

      setValues({ ...values, module: m, selectedGroup: sGroup });
    });
  }

  const handleGoToStudentDetails = (id, ss) => {
    const studentName = `${ss.firstname} ${ss.lastname}`;
    props.history.push(`/groups/details/${moduleId}/${id}/${studentName}`);
  };

  const handlePublish = async () => {
    const { childIds } = values;

    const promises = childIds.map(async (childId) => {
      try {
        const init = {
          body: {
            child_id: Number(childId),
            clazz_id: Number(moduleId),
          },
        };
        await API.post('update_semester', '', init)
      } catch (e) {
        console.log('error!!')
      }
    })

    const result = await Promise.all(promises);

    setValues({
      ...values,
      childIds: [],
    });

    fetchAllData(moduleId);
  }

  const handleChildSelection = (e) => {
    const childId = Number(e.target.value);
    const { childIds } = values;

    if (e.target.checked && !childIds.includes(childId)) {
      setValues({
        ...values,
        childIds: childIds.concat([childId])
      });
    } else if (!e.target.checked && childIds.includes(childId)) {
      setValues({
        ...values,
        childIds: childIds.reduce((result, id) => (
          id == childId ? result : result.concat([id])
        ), []),
      });
    }
  }

  const getStudents = () => {
    return Object.values(values.module.groups)
      .filter(g =>
        g.name
          .toLowerCase()
          .includes(values.selectedGroup.name.toLowerCase()),
      )
      .map(group =>
        Object.values(group.childids).filter(s =>
            (s.firstname
              .toLowerCase()
              .includes(values.search.toLowerCase()) ||
              s.lastname
                .toLowerCase()
                .includes(values.search.toLowerCase())) &&
            s.status
              .toLowerCase()
              .includes(values.markFilter.toLowerCase()),
        )
      )
      .reduce((result, item) => result.concat(item), []);
  }

  const getMarkedStatus = () => {
    if (values.module.groups) {
      const currentInfo = Object.values(values.module.groups)
      .filter(g =>
        g.name
          .toLowerCase()
          .includes(values.selectedGroup.name.toLowerCase()),
      );

      const childsInfo = currentInfo.reduce((acc, val) => acc.concat(val.childids), [])

      const markedStatus = childsInfo.reduce((acc, val) => (
        acc + val.summary.length
      ), 0);

      const ratio = childsInfo
        ? Number(markedStatus / (values.module.years * values.module.slices * childsInfo.length)).toFixed(2) * 100
        : 0;

      return Number(ratio).toFixed(2);
    }

    return '';
  }

  const handleAllSelection = (e) => {
    if (e.target.checked) {
      const students = getStudents();
      const childIds = students.map(student => student.childid);

      setValues({
        ...values,
        childIds,
        allSelected: true,
      });
    } else {
      setValues({
        ...values,
        allSelected: false,
        childIds: [],
      });
    }
  }

	const renderSemesters = () => (
		<TableHead>
			<TableRow>
        {props.role == 'admin' && (
          <TableCell rowSpan={2} className={classes.tableCell} padding="checkbox">
            <Checkbox
              checked={values.allSelected}
              onChange={handleAllSelection}
              color="primary"
              inputProps={{
                'aria-label': 'secondary checkbox',
              }}
            />
          </TableCell>
        )}

				<TableCell className={classes.tableCellButton} rowSpan={2} padding="none">
          {props.role == 'admin' &&
            <Button color="primary" variant="contained" onClick={handlePublish}>
              Publish to Parent(s)
            </Button>
          }
        </TableCell>

				{Array.from({
					length: values.module.years,
				}).map((yearIndex, index) => (
					<TableCell
						align="center"
						key={index + 1}
						scope="colgroup"
						colSpan={values.module.slices}
						className={classes.tableCellHead}
					>
						Year {index + 1}
					</TableCell>
				))}
			</TableRow>

			<TableRow>
				{
					Array.from({
						length: values.module.years * values.module.slices,
					}).map((_, index) => (
						<TableCell
							scope="col"
							align="center"
							key={`xx${index}`}
							className={classes.tableCellHead}
						>
							Trimester {index % values.module.slices + 1}
						</TableCell>
					))
				}
			</TableRow>
		</TableHead>
	)

	const renderSemesterStatus = (childId, student) => {
		const { module } = values;

		return (
			Array.from({
				length: values.module.years * values.module.slices,
			}).map((_, index) => {
				const status = getSemesterStatus(
					module,
					childId,
          (index + 1) % values.module.slices === 0
            ? (index + 1) / values.module.slices
            : Math.floor((index + 1) / values.module.slices) + 1,
					index % values.module.slices + 1,
				);

				return (
					<TableCell
						scope="col"
						align="center"
						key={`xx${index}`}
            className={classes.tableCell}
            onClick={() =>
              handleGoToStudentDetails(childId, student)
            }
					>
						<Typography	className={classes.semesterStatus} style={{ color: SEMESTER_STATUS_COLORS[status]}}>
							{
								status === SEMESTER_STATUS.ready
									? ''
									: status
							}
						</Typography>
					</TableCell>
				);
			})
		);
	}

	const renderChilds = () => {
		return (
			<TableBody>
				{
					values.module.groups &&
					Object.values(values.module.groups)
						.filter(g =>
							g.name
								.toLowerCase()
								.includes(values.selectedGroup.name.toLowerCase()),
						)
						.map(group =>
							Object.values(group.childids)
								.filter(
									s =>
										(s.firstname
											.toLowerCase()
											.includes(values.search.toLowerCase()) ||
											s.lastname
												.toLowerCase()
												.includes(values.search.toLowerCase())) &&
										s.status
											.toLowerCase()
											.includes(values.markFilter.toLowerCase()),
								)
								.map(student => (
									<TableRow>
                    {props.role == 'admin' && (
                      <TableCell className={classes.tableCell} padding="checkbox">
                        <Checkbox
                          checked={values.childIds.includes(student.childid)}
                          onChange={handleChildSelection}
                          value={student.childid}
                          color="primary"
                          inputProps={{
                            'aria-label': 'secondary checkbox',
                          }}
                        />
                      </TableCell>
                    )}

										<TableCell
                      scope="row" component="th" colSpan={2} className={classes.childAvatar}
                      onClick={() =>
                        handleGoToStudentDetails(student.childid, student)
                      }
                    >
											<Avatar>{student.firstname.substring(0, 1)}</Avatar>
											<Typography variant="subtitle1">
												{`${student.firstname} ${student.lastname}`}
											</Typography>
										</TableCell>

										{renderSemesterStatus(student.childid, student)}
									</TableRow>
								)))
				}
			</TableBody>
		);
	}

  return (
    <div>
      <Typography variant="h5" className={classes.title}>
        {values.module.modul}
      </Typography>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.root}
      >
        <Grid item md={2} className={classes.searchContainer}>
          <FormControl variant="filled" className={classes.selectGroup}>
            <InputLabel htmlFor="filled-age-simple">Select Group</InputLabel>
            <Select
              className={classes.select}
              value={values.selectedGroup}
              onChange={e =>
                setValues({ ...values, selectedGroup: e.target.value })
              }
              input={
                <FilledInput
                  name="age"
                  id="filled-age-simple"
                  value={values.search}
                  onChange={e =>
                    setValues({ ...values, search: e.target.value })
                  }
                />
              }
            >
              <MenuItem value={{ name: '' }}>
                <em>All</em>
              </MenuItem>
              {values.module.groups &&
                Object.values(values.module.groups)
                  // .filter(g =>
                  //   g.name.toLowerCase().includes(values.search.toLowerCase()),
                  // )
                  .map(group => (
                    <MenuItem key={group.name} value={group}>
                      {group.name}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={3} className={classes.searchContainer}>
          <Paper className={classes.paper}>
            <InputBase
              className={classes.input}
              value={values.search}
              onChange={e => setValues({ ...values, search: e.target.value })}
              placeholder="Search by student name"
              inputProps={{ 'aria-label': 'Search Google Maps' }}
            />
            <IconButton className={classes.iconButton} aria-label="Search">
              <SearchIcon style={{ fontSize: '18px' }} />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item md={5} className={classes.xxfilter}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item md={3}>
              <Typography>Filter By</Typography>
            </Grid>
            <Grid item md={3}>
              <GreenRadio
                checked={values.markFilter === ''}
                value=""
                name="radio-button-demo"
                onChange={e =>
                  setValues({ ...values, markFilter: e.target.value })
                }
                inputProps={{ 'aria-label': 'E' }}
              />
              All
            </Grid>
            <Grid item md={3}>
              <GreenRadio
                checked={values.markFilter === 'In Progress'}
                value="In Progress"
                name="radio-button-demo"
                onChange={e =>
                  setValues({ ...values, markFilter: e.target.value })
                }
                inputProps={{ 'aria-label': 'E' }}
              />
              In Progress
            </Grid>
            <Grid item md={3}>
              <GreenRadio
                checked={values.markFilter === 'Complete'}
                value="Complete"
                onChange={e =>
                  setValues({ ...values, markFilter: e.target.value })
                }
                name="radio-button-demo"
                inputProps={{ 'aria-label': 'E' }}
              />
              Complete
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.item} md={2}>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="baseline"
          >
            <Grid item style={{ paddingTop: '8px' }}>
              <Typography>
                Class status -{' '}
                {getMarkedStatus()}
                % Marked
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item className={classes.item} md={12}>
					<Card>
						<Table className={classes.innerCard}>
							{renderSemesters()}
							{renderChilds()}
						</Table>
					</Card>

        </Grid>
      </Grid>
    </div>
  );
}

GroupStudents.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  history: PropTypes.any,
  match: PropTypes.any,
  role: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  groupStudents: makeSelectGroupStudents(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(GroupStudents);
