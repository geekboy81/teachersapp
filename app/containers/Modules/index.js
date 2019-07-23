/**
 *
 * Modules
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import makeSelectModules from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as Routes from '../../routes';
import AddModule from '../AddModule';
import TopBar from '../../components/TopBar';
import SideBar from '../../components/SideBar';
import ModulesList from '../ModulesHighlights';
import GroupDetails from '../GroupDetails';
import GroupsList from '../GroupsList';
import GroupStudents from '../GroupStudents';
import currentUser from '../../shared/reducers/current-user';
import {
  fetchAuthUserSuccess,
  getUserInfoReq,
  logout,
} from '../../shared/actions/current-user';
import { makeSelectRole } from '../../shared/selectors/auth-selectors';
import ParentChildren from '../ParentChildren';
// import ModulesList from '../../components/ModulesList';
const drawerWidth = 68;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  }, // theme.mixins.toolbar.
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    paddingLeft: drawerWidth + 10,
    marginTop: theme.spacing(7),
  },
  logo: {
    color: '#',
    textAlign: 'center',
    margin: '2px',
    fontWeight: 'bolder',
  },
  bolderTitle: {
    fontWeight: 'bolder',
  },
}));

export function Modules(props) {
  const classes = useStyles();
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
  return (
    <div>
      <Helmet>
        <title>Modules</title>
        <meta name="description" content="Description of Modules" />
      </Helmet>
      <TopBar onLogout={() => onLogout()} />
      <SideBar />
      <main className={classes.content}>
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
          {/* <Route exact path={Routes.GROUP_DETAILS} render={prop => <GroupDetails {...prop} role="teacher" /> } /> */}
          <Route
            exact
            path={Routes.GROUPS_LIST}
            render={prop => <GroupsList {...prop} role={props.role} />}
          />
          {/* <Route exact path={Routes.GROUPS_LIST} render={prop => <GroupsList {...prop} role="teacher" /> } /> */}
          <Route
            exact
            path={Routes.GROUPS_STUDENTS}
            component={GroupStudents}
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
