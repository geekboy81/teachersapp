/**
 *
 * ModulesHighlights
 *
 */

import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import injectSaga, { useInjectSaga } from '../../utils/injectSaga';
import injectReducer, { useInjectReducer } from '../../utils/injectReducer';

import makeSelectModulesHighlights, { makeSelectLoading } from './selectors';
import * as Routes from '../../routes';
import ModuleCard from '../../components/ModuleCard';

import reducer from './reducer';
import saga from './saga';
import { loadModulesHighLights, deleteModule } from './actions';
import groupDetailsSaga from '../GroupDetails/saga';
import groupDetailsReducer from '../GroupDetails/reducer';
import makeSelectGroupDetails from '../GroupDetails/selectors';
import { cloneModule as cloneModuleAction } from '../GroupDetails/actions';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  title: {
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(3),
    fontSize: '28px',
  },
  item: {
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));
export function ModulesHighlights({
  history,
  modulesHighlights,
  loadHighlights,
  cloneModule,
  onDeleteModuleAction,
  role,
}) {
  useInjectReducer({ key: 'modulesHighlights', reducer });
  useInjectSaga({ key: 'modulesHighlights', saga });
  const [errorFeedback, setErrorFeedback] = React.useState({
    open: false,
    message: '',
  });
  useEffect(() => {
    loadHighlights();
  }, []);
  useEffect(() => {
    if (modulesHighlights.error) {
      setErrorFeedback({ open: true, message: modulesHighlights.error });
    }
  }, [modulesHighlights]);
  const classes = useStyles();
  const handleAddModule = () => {
    history.push(Routes.ADD_MODULE_ROUTE);
  };
  function onDeleteModule(m) {
    onDeleteModuleAction(m.id);
  }
  function onEditModule(m) {
    history.push(`/modules/edit-module/${m.id}`);
  }
  function onCloneModule(moduleToClone) {
    cloneModule(moduleToClone);
  }
  const { highlights, loading, deleting } = modulesHighlights;
  const modules = highlights.map(module => (
    <Grid item className={classes.item} key={module.modul}>
      <ModuleCard
        module={module}
        title={module.modul}
        isDeleting={deleting}
        onEditModule={onEditModule}
        onCloneModule={onCloneModule}
        onDeleteModule={m => onDeleteModule(m)}
        role={role}
      />
    </Grid>
  ));
  return (
    <div>
      <Typography variant="h5" className={classes.title}>
        Add Progress Report
      </Typography>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.root}
      >
        {role === 'admin' && (
          <Grid item className={classes.item} key="not-defend-g0">
            <ModuleCard
              cardType="addModule"
              handle={handleAddModule}
              key="not-defend-1"
            />
          </Grid>
        )}
        {modules}
        {loading && (
          <Grid
            item
            className={classes.item}
            style={{ width: '100%', marginTop: '-290px' }}
          >
            <Grid container justify="center" alignItems="flex-start">
              <CircularProgress size={48} className={classes.buttonProgress} />
            </Grid>
          </Grid>
        )}
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={errorFeedback.open}
        autoHideDuration={6000}
        onClose={() => setErrorFeedback({ ...errorFeedback, open: false })}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{errorFeedback.message}</span>}
        action={[
          <Button
            key="undo"
            color="secondary"
            size="small"
            onClick={() => setErrorFeedback({ ...errorFeedback, open: false })}
          >
            Hide
          </Button>,
        ]}
      />
    </div>
  );
}

ModulesHighlights.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  modulesHighlights: PropTypes.any,
  history: PropTypes.any,
  loadHighlights: PropTypes.func,
  onDeleteModuleAction: PropTypes.func,
  // groupDetails: PropTypes.any,
  cloneModule: PropTypes.func,
  role: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  modulesHighlights: makeSelectModulesHighlights(),
  loading: makeSelectLoading(),
  groupDetails: makeSelectGroupDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    cloneModule: module => {
      dispatch(cloneModuleAction(module));
    },
    loadHighlights: () => {
      dispatch(loadModulesHighLights());
    },
    onDeleteModuleAction: moduleId => {
      dispatch(deleteModule(moduleId));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withGroupDetailsSaga = injectSaga({
  key: 'groupDetails',
  saga: groupDetailsSaga,
});
const withGrouseInjectReducer = injectReducer({
  key: 'groupDetails',
  reducer: groupDetailsReducer,
});

export default compose(
  withGrouseInjectReducer,
  withGroupDetailsSaga,
  withConnect,
)(ModulesHighlights);
