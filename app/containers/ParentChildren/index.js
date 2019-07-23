/**
 *
 * ParentChildren
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
import { Card, Grid, makeStyles, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import makeSelectParentChildren from './selectors';
import reducer from './reducer';
import saga from './saga';
import { loadParentChildren } from './actions';

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
  cardContainer: {
    marginBottom: '20px',
  },
  childCard: {
    width: '250px',
    // height: '150px',
    padding: '15px',
    marginRight: '10px',
  },
}));
export function ParentChildren({ onLoadParentChildren, parentChildren }) {
  useInjectReducer({ key: 'parentChildren', reducer });
  useInjectSaga({ key: 'parentChildren', saga });
  const classes = useStyles();
  React.useEffect(() => {
    onLoadParentChildren();
  }, []);

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Progress Report</title>
        <meta name="description" content="Description of Progress Report" />
      </Helmet>
      <div>
        <Typography variant="h5" className={classes.title}>
          Progress Report
        </Typography>
        <Grid container>
          {parentChildren &&
            parentChildren.children.map(child => (
              <Card className={classes.childCard}>
                <Grid container>
                  <Grid item md={6}>
                    <Avatar>
                      {child.firstname.substring(0, 1) +
                        child.lastname.substring(0, 1)}
                    </Avatar>
                  </Grid>
                  <Grid item md={6}>
                    <Typography>{`${child.firstname}  ${
                      child.lastname
                    }`}</Typography>
                  </Grid>
                </Grid>
              </Card>
            ))}
        </Grid>
      </div>
    </div>
  );
}

ParentChildren.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  onLoadParentChildren: PropTypes.func,
  parentChildren: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  parentChildren: makeSelectParentChildren(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadParentChildren: () => dispatch(loadParentChildren()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ParentChildren);
