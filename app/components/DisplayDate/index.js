/**
 *
 * DisplayDate
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import styled from 'styled-components';

function DisplayDate({ date }) {
  const formattedDate = moment(date).format('D MMM');
  return <Fragment>{formattedDate}</Fragment>;
}

DisplayDate.propTypes = {
  date: PropTypes.any,
};

export default DisplayDate;
