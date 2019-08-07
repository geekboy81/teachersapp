/**
 *
 * PrintableDocument
 *
 */

import React from 'react';
import * as PropTypes from 'prop-types';

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// import PropTypes from 'prop-types';
// import styled from 'styled-components';
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  table: {
    width: '100%', fontSize: 10,
    paddingTop: 20, paddingLeft: 20, paddingRight: 20,
  },
  tableRow: {
    display: 'flex', flexDirection: 'row', borderTop: 1, borderLeft: 1,
  },
  tableCell: {
    padding: '3px', textAlign: 'center',  borderRight: 1,
  },
});

const SLICE_PERCENT = 8;

const suffix = {
  1: 'st',
  2: 'nd',
  3: 'rd',
}
function PrintableDocument({
  studentName,
  moduleName,
  categories,
  years,
  slices,
  studentMarks,
  studentScales,
}) {
  const getMark = (category, skill, year, slice) => {
    const currentSemesterMark = studentMarks.find(record => (
      record.year === year &&
      record.slice === slice
    ));

    if (
      currentSemesterMark &&
      currentSemesterMark.marks &&
      currentSemesterMark.marks[category] &&
      currentSemesterMark.marks[category]['breakdown'] &&
      currentSemesterMark.marks[category]['breakdown'][skill]
    ) {
      return currentSemesterMark.marks[category]['breakdown'][skill];
    }

    return '';
  }

  const renderTableHeader = () => {
    const categoryPercent = 100 - (years * slices) * 8;

    return (
      <React.Fragment>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: `${categoryPercent}%`, textAlign: 'justify' }]}>
            <Text>Student Name: {studentName}</Text>
          </View>
          <View style={[styles.tableCell, { width: `${100 - categoryPercent}%` }]}></View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: `${categoryPercent}%`, textAlign: 'justify'}]}>
            <Text>Birthdate</Text>
          </View>
          {Array.from({ length: years }).map((_, index) => (
            <View key={index} style={[styles.tableCell, { width: `${SLICE_PERCENT * 2}%` }]}>
              <Text>Year {index + 1}</Text>
            </View>
          ))}
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: `${categoryPercent}%` }]}>
            <Text>{moduleName}</Text>
          </View>
          {Array.from({ length: years * slices }).map((_, index) => (
            <View key={index} style={[styles.tableCell, { width: `${SLICE_PERCENT}%` }]}>
              <Text>{(index % slices) + 1}{(index % slices) + 1 > 3 ? 'th' : suffix[(index % slices) + 1]}</Text>
            </View>
          ))}
        </View>
      </React.Fragment>
    );
  }

  const renderTableContent = () => {
    const categoryPercent = 100 - (years * slices) * 8;

    return (
      <React.Fragment>
        {categories.map(category => (
          <React.Fragment>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { width: `${categoryPercent}%`, textAlign: 'justify', fontWeight: 'bold' }]}>
                <Text>{category.name}</Text>
              </View>
              <View style={[{ borderRight: 1, width: `${100 - categoryPercent}%` }]}></View>
            </View>
            {category.skills.map(skill => (
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, { width: `${categoryPercent}%`, textAlign: 'justify' }]}>
                  <Text>{skill}</Text>
                </View>
                {Array.from({ length: years * slices }).map((_, index) => (
                  <View key={index} style={[styles.tableCell, { width: `${SLICE_PERCENT}%` }]}>
                    <Text>
                      {getMark(category.name, skill, Math.floor(index / slices) + 1, (index % slices) + 1)}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </React.Fragment>
        ))}
        <View style={{ borderBottom: 1 }}></View>
      </React.Fragment>
    );
  }

  const renderScales = () => {
    return (
      <React.Fragment>
        {studentScales.map(scale => (
          <View style={{ paddingTop: 20, }}>
            <View>
              <Text>{scale.name}</Text>
            </View>
            <View />
            {Object.entries(scale.grades).map(([key, value]) => (
              <View style={{ paddingTop: 5 }}>
                <View key={key + value}>
                  <Text>{`${key}- ${value}`}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </React.Fragment>
    );
  }

  const renderDocumentHeader = () => {
    return (
      <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Text>Skills Assessment Checklist</Text>
      </View>
    );
  }

  const renderTable = () => {
    return (
      <View style={styles.table}>
        {renderDocumentHeader()}
        {renderTableHeader()}
        {renderTableContent()}
        {renderScales()}
      </View>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ height: '100%', width: '100%' }}>
          {renderTable()}
        </View>
      </Page>
    </Document>
  );
}

PrintableDocument.propTypes = {
  studentName: PropTypes.string.isRequired,
  moduleName: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  years: PropTypes.number.isRequired,
  slices: PropTypes.number.isRequired,
  studentMarks: PropTypes.array.isRequired,
  studentScales: PropTypes.array.isRequired,
};

export default PrintableDocument;
