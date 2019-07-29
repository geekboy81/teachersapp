import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Switch, Route } from 'react-router-dom';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import * as Routes from '../../routes';

import saga from './saga';
import reducer from './reducer';
import makeSelectModules from './selectors';

import {
  fetchAuthUserSuccess,
  getUserInfoReq,
  logout,
} from '../../shared/actions/current-user';

import { makeSelectRole } from '../../shared/selectors/auth-selectors';
import currentUser from '../../shared/reducers/current-user';

import TopBar from '../../components/TopBar';
import SideBar from '../../components/SideBar';

import ParentChildren from '../ParentChildren';
import ModulesList from '../ModulesHighlights';
import GroupDetails from '../GroupDetails';
import GroupsList from '../GroupsList';
import GroupStudents from '../GroupStudents';
import AddModule from '../AddModule';


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Modules(props) {
  const classes = useStyles();
  const theme = useTheme();
  useInjectSaga({ key: 'login', saga });
  useInjectReducer({ key: 'currentUser', reducer: currentUser });
  useInjectReducer({ key: 'modules', reducer });
  useInjectSaga({ key: 'modules', saga });

  React.useEffect(() => {
    props.onGetUserInfo();
  }, []);

  const onLogout = () => {
    props.onLogout();
  };

  const [open, setOpen] = React.useState(false);

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Modules</title>
        <meta name="description" content="Description of Modules" />
      </Helmet>

      <CssBaseline />
      <TopBar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        onLogout={onLogout}
      />

      <SideBar
        open={open}
        handleDrawerClose={handleDrawerClose}
      />

      <main className={classes.content}>
        <div className={classes.toolbar} />
          <Switch>
            {props.role === 'parent' ? (
              <Route exact path={Routes.HOME_ROUTE} component={ParentChildren} />
            ) : (
              <Route
                exact
                path={Routes.HOME_ROUTE}
                render={prop => <ModulesList {...prop} role={props.role} />}
              />
            )}
            <Route
              exact
              path={Routes.GROUP_DETAILS}
              render={prop => <GroupDetails {...prop} role={props.role} />}
            />
            <Route
              exact
              path={Routes.GROUPS_LIST}
              render={prop => <GroupsList {...prop} role={props.role} />}
            />
            <Route
              exact
              path={Routes.GROUPS_STUDENTS}
              render={prop => <GroupStudents {...prop} role={props.role} />}
            />
            <Route exact path={Routes.ADD_MODULE_ROUTE} component={AddModule} />
            <Route exact path={Routes.EDIT_MODULE_ROUTE} component={AddModule} />
          </Switch>
      </main>
    </div>
  );
}

Modules.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.any,
  onUserAuthSuccess: PropTypes.func,
  onLogout: PropTypes.func,
  role: PropTypes.any,
  history: PropTypes.any,
  onGetUserInfo: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  modules: makeSelectModules(),
  role: makeSelectRole(),
});

function mapDispatchToProps(dispatch) {
  return {
    onUserAuthSuccess: data => dispatch(fetchAuthUserSuccess(data)),
    onLogout: () => dispatch(logout()),
    onGetUserInfo: () => dispatch(getUserInfoReq()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Modules);
