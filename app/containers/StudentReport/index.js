/**
 *
 * StudentReport
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectStudentReport from './selectors';
import reducer from './reducer';
import saga from './saga';

export function StudentReport() {
  useInjectReducer({ key: 'studentReport', reducer });
  useInjectSaga({ key: 'studentReport', saga });

  return (
    <div>
      <Helmet>
        <title>StudentReport</title>
        <meta name="description" content="Description of StudentReport" />
      </Helmet>
    </div>
  );
}

StudentReport.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  studentReport: makeSelectStudentReport(),
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

export default compose(withConnect)(StudentReport);
