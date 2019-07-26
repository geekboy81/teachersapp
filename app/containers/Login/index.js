/**
 *
 * Login
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import {
  makeStyles,
  TextField,
  Button,
  Card,
  CardActions,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { reduxForm } from 'redux-form';

import LockIcon from '@material-ui/icons/LockOutlined';
import saga from './saga';
import { updateByPropertyName } from '../../utils/utils';
import awsConfig from '../../utils/aws-config';
import { authenticate } from '../../shared/actions/current-user';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from '../../shared/reducers/current-user';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'flex-start',
    background: 'url(https://source.unsplash.com/user/360memos/likes/1600x900)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  card: {
    minWidth: 300,
    marginTop: '6em',
    padding: '3em',
  },
  avatar: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'center',
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    padding: '0 1em 1em 1em',
  },
  input: {
    marginTop: '1em',
  },
  actions: {
    padding: '0 1em 1em 1em',
  },
  errorMessage: {
    marginTop: '1em',
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.grey[500],
  },
  header: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 20,
  },
}));
// const INITIAL_STATE = {
//   userName: '',
//   password: '',
//   errorMessage: '',
//   open: false,
//   email: '',
// };
export function Login(props) {
  useInjectSaga({ key: 'login', saga });
  useInjectReducer({ key: 'currentUser', reducer });
  const classes = useStyles();
  const [state, setState] = React.useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = React.useState('');
  const [credentials, setCredentials] = React.useState({
    username: '',
    password: '',
  });
  const onTextChange = event => {
    const { name, value } = event.target;
    setState(updateByPropertyName(name, value));
  };
  const onFormSubmit = async () => {
    props.doLogin(credentials);
    // const { dispatch, history } = props;
    // try {
    //   const { userName, password } = data;
    //   const authResponse = await authService.authenticateUserApi(userName, password);
    //   if (authResponse.signInUserSession) {
    //     const { signInUserSession } = authResponse;
    //     dispatch(fetchAuthUserSuccess(authResponse))
    //     localStorage.setItem('hmUser', JSON.stringify(signInUserSession))
    //     const userResponse = await authService.getUserDetail();
    //     if (userResponse.Username) {
    //       dispatch(userInfoSuccess(userResponse))
    //       history.push('/');
    //     }
    //   } else {
    //     this.setState(updateByPropertyName('errorMessage', authResponse.message));
    //     throw authResponse.message
    //   }
    // } catch (error) {
    //
    // }
  };
  const handleClickOpenModel = () => {
    setState({ open: true, email: '' });
  };
  const handleCloseModel = () => {
    setState({ open: false });
  };

  const resetPassword = event => {
    event.preventDefault();
    // const { email } = state;
    // authService.resetPassword(email);
    setState({ open: false });
  };
  return (
    <div className={classes.main}>
      <Card className={classes.card}>
        <div className={classes.header}>{awsConfig.app_header}</div>
        <div className={classes.avatar}>
          <Avatar className={classes.icon}>
            <LockIcon />
          </Avatar>
        </div>
        <form onSubmit={props.handleSubmit(onFormSubmit)}>
          <div className={classes.errorMessage}> {errorMessage}</div>
          <div className={classes.form}>
            <div className={classes.input}>
              <TextField
                name="username"
                onChange={event =>
                  setCredentials({
                    ...credentials,
                    username: event.target.value,
                  })
                }
                value={credentials.username}
                label="Username"
              />
            </div>
            <div className={classes.input}>
              <TextField
                name="password"
                label="Password"
                type="password"
                onChange={event =>
                  setCredentials({
                    ...credentials,
                    password: event.target.value,
                  })
                }
                value={credentials.password}
              />
            </div>
          </div>
          <CardActions className={classes.actions}>
            <Button
              variant="raised"
              type="submit"
              color="primary"
              className={classes.button}
              fullWidth
            >
              SIGN IN
            </Button>
          </CardActions>
        </form>
        <div className={classes.form}>
          <Button
            variant="raised"
            type="submit"
            color="primary"
            className={classes.button}
            fullWidth
            onClick={handleClickOpenModel}
          >
            Forget Password
          </Button>
        </div>
      </Card>

      <Dialog
        open={state.open}
        onClose={handleCloseModel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset password, please enter your email address here. please
            check your email.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            value={state.email}
            name="email"
            label="Email Address"
            type="email"
            onChange={onTextChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModel} color="primary">
            Cancel
          </Button>
          <Button onClick={resetPassword} color="primary">
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Login.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.any,
  doLogin: PropTypes.func,
};
function mapDispatchToProps(dispatch) {
  return {
    doLogin: credentils => dispatch(authenticate(credentils)),
    // dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);
const withForm = reduxForm({
  form: 'loginForm',
  enableReinitialize: true,
})(Login);
export default compose(withConnect)(withForm);
