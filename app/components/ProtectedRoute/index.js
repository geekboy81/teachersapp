/**
 *
 * ProtectedRoute
 *
 */

import React from 'react';
import * as PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Route, Redirect } from 'react-router-dom';

// Check User Status
// Check Onboarding then role (expert or doctor)
// if there is no onboarding status then have to redirect to resprctive dashboard

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const userToken = localStorage.getItem('hmUser');

  return (
    <Route
      {...rest}
      render={props =>
        userToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/auth/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.any,
};

export default ProtectedRoute;
