/**
 *
 * SkillMarks
 *
 */

import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { Grid, makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Table from '@material-ui/core/Table';
import * as PropTypes from 'prop-types';
import color from '@material-ui/core/colors/indigo';
import CategoryCommentAndPhotos from '../CategoryCommentAndPhotos';

import { SEMESTER_STATUS, getSemesterStatus } from 'shared/semester';

// import PropTypes from 'prop-types';
// import styled from 'styled-components';
const useStyles = makeStyles(theme => ({
  selectedMark: {
    backgroundColor: color[300],
  },
  unselectedMark: {},
}));

function SkillMarks({
  module,
  semesters,
  category,
  onHandleChangeMark,
  generateMarksGrid,
  handleOnStudentGradesChanged,
  handleCommentChange,
  handlePhotosChange,
  studentGrades,
  currentMarks,
  semesterDetails,
  role,
  groupDetails,
  childId,
}) {
  const classes = useStyles();

  const [markCoordinates, setMarkCoordinates] = React.useState([]);
  const [grades, setGrades] = React.useState([]);
  const [prGrid, setPrGrid] = React.useState([]);
  const [comment, setComment] = React.useState('');
  const [photos, setPhotos] = React.useState([]);

  const search = (key, value, inputArray) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < inputArray.length; i++) {
      if (inputArray[i][key] === value) {
        return inputArray[i];
      }
    }
  };

  const onCommentChange = cmmt => {
    setComment(cmmt);
    handleCommentChange(category, cmmt);
  };

  const onPhotosChange = photoList => {
    setPhotos([...photoList]);
    handlePhotosChange(category, photos);
  };

  const handleChangeMark = (
    e,
    year,
    semester,
    grade,
    ref,
    topYearIndex,
    gridIndex,
    skill,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const currentYear = year.index + 1;
    const currentSemester = semester.index + 1;

    const semesterStatus = getSemesterStatus(
      module,
      childId,
      currentYear,
      currentSemester,
    );
    console.log('semesterStatus', semesterStatus);


    if (
      semesterStatus == SEMESTER_STATUS.complete ||
      (
        !semester.semester.is_current &&
        role !== 'admin' &&
        !module.teacher_override
      )
    ) {
      return;
    }

    for (
      let i = 0;
      i < grades[gridIndex][year.index][semester.index].length;
      i++
    ) {
      if (i !== grade.index) {
        grades[gridIndex][year.index][semester.index][i].is_selected = false;
        grades[gridIndex][year.index][semester.index][i].className = classes.unselectedMark;
      }
    }

    const isSelected = grades[gridIndex][year.index][semester.index][grade.index].is_selected;

    grades[gridIndex][year.index][semester.index][grade.index].is_selected = isSelected ? false : true;
    grades[gridIndex][year.index][semester.index][grade.index].className = isSelected ? classes.unselectedMark : classes.selectedMark;
    grades[gridIndex][year.index][semester.index][grade.index].skill = skill;

    setGrades([...grades]);

    onHandleChangeMark(
      [...grades],
      gridIndex,
      grades[gridIndex][year.index][semester.index][grade.index],
      year.index + 1,
      semester.index + 1,
      !isSelected,
    );
  };

  React.useEffect(() => {
    // setGrades(studentGrades);
  }, [studentGrades]);

  React.useEffect(() => {
    const gradesToGenerate = [];

    console.log('generateMarksGrid', generateMarksGrid);

    for (let i = 0; i < generateMarksGrid.length; i++) {
      gradesToGenerate[i] = [];
      for (let j = 0; j < generateMarksGrid[i].years.length; j++) {
        gradesToGenerate[i][j] = [];
        for (
          let k = 0;
          k < generateMarksGrid[i].years[j].semesters.length;
          k++
        ) {
          gradesToGenerate[i][j][k] = Object.keys(category.scale.grades).map(
            gradeMark => {
              const marked = gradeMark === generateMarksGrid[i].years[j].semesters[k].mark;

              return {
                mark: gradeMark,
                className: marked
                  ? classes.selectedMark
                  : classes.unselectedMark,
                is_selected: marked,
                ref: React.createRef(),
              };
            },
          );
        }
      }
    }

    setGrades(gradesToGenerate);

    handleOnStudentGradesChanged(gradesToGenerate);
  }, [generateMarksGrid, currentMarks, semesterDetails, groupDetails]);

  const generateGrades = semesterIndex => {};

  return (
    <div>
      <Table>
        <colgroup span="2" />
        <colgroup span="2" />
        <TableHead>
          <TableRow>
            <TableCell rowSpan={2}>Skill</TableCell>
            {Array.from({
              length: module.years,
            }).map((yearIndex, index) => (
              <TableCell
                align="center"
                key={index + 1}
                scope="colgroup"
                colSpan={2}
              >
                Year {index + 1}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {semesters.map(semestersOfYears =>
              semestersOfYears.map((semester, index) => (
                <TableCell
                  scope="col"
                  align="center"
                  className={semester.className}
                  key={`xx${index}`}
                >
                  Trimester {index + 1}
                </TableCell>
              )),
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {generateMarksGrid.map((markGrid, gridIndex) => (
            <TableRow key={markGrid.skill}>

              <TableCell component="th" scope="row">
                {markGrid.skill}
              </TableCell>

              {markGrid.years.map((year, topYearIndex) =>
                year.semesters.map((yearSemesters, yearSemestersIndex) => (
                  <TableCell
                    align="center"
                    className={yearSemesters.marksClassName}
                  >
                    <Grid container alignItems="center" justify="center">
                      {grades[gridIndex] &&
                        grades[gridIndex][topYearIndex] &&
                        grades[gridIndex][topYearIndex][yearSemestersIndex] &&
                        grades[gridIndex][topYearIndex][yearSemestersIndex].map(
                          (g, gradeIndex) => (
                            <Grid
                              item
                              style={{
                                paddingLeft: '5px',
                                marginBottom: '5px',
                              }}
                            >
                              <Avatar
                                data-m="awesome-matar"
                                // ref={g.ref}
                                data-sindex={yearSemesters.index}
                                data-mark={g.mark}
                                data-semester={gradeIndex}
                                className={g.className}
                                onClick={e =>
                                  handleChangeMark(
                                    e,
                                    { grid: markGrid, index: topYearIndex },
                                    {
                                      semester: yearSemesters,
                                      index: yearSemestersIndex,
                                    },
                                    { grade: g, index: gradeIndex },
                                    g.ref,
                                    topYearIndex,
                                    gridIndex,
                                    markGrid.skill,
                                  )
                                }
                                style={{ width: '32px', height: '32px' }}
                              >
                                {g.mark}
                              </Avatar>
                            </Grid>
                          ),
                        )}
                    </Grid>
                  </TableCell>
                )),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Grid container>
        <Grid
          item
          md={12}
          style={{
            paddingLeft: '20px',
            paddingTop: '40px',
            paddingBottom: '40px',
          }}
        >
          <CategoryCommentAndPhotos
            category={category}
            module={module}
            key={category.name}
            comment={comment}
            onCommentChange={cmt => onCommentChange(cmt)}
            onPhotosListChange={onPhotosChange}
            photosList={photos}
            config={{ hideCategoryName: true }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

SkillMarks.propTypes = {
  module: PropTypes.any,
  semesters: PropTypes.any,
  category: PropTypes.any,
  categoryIndex: PropTypes.any,
  onHandleChangeMark: PropTypes.func,
  handleCommentChange: PropTypes.func,
  handlePhotosChange: PropTypes.func,
  generateMarksGrid: PropTypes.any,
  handleOnStudentGradesChanged: PropTypes.func,
  studentGrades: PropTypes.any,
  currentMarks: PropTypes.any,
  semesterDetails: PropTypes.any,
  role: PropTypes.any,
  groupDetails: PropTypes.any,
  childId: PropTypes.number,
};

export default SkillMarks;
