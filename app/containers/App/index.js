/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

// import HomePage from 'containers/HomePage/Loadable';
import Amplify from 'aws-amplify';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import awsConfig from '../../utils/aws-config';
import * as Routes from '../../routes';
import Modules from '../Modules';
import LoginPage from '../Login';
import { axiosConfiguration } from '../../utils/config';
import ProtectedRoute from '../../components/ProtectedRoute';

/* const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`; */

export default function App() {
  axiosConfiguration('123');
  Amplify.configure(awsConfig);
  return (
    <div>
      <Helmet
        titleTemplate="%s - 360 Progress Report"
        defaultTitle="360 Progress Report"
      >
        <meta name="description" content="some desc" />
      </Helmet>
      <Switch>
        <Route path={Routes.LOGIN} component={LoginPage} />
        <ProtectedRoute path={Routes.HOME_ROUTE} component={Modules} />
        <Route path="/features" component={FeaturePage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
    </div>
  );
}
