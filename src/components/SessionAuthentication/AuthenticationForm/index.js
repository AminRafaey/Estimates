import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useLocation } from 'react-router-dom';

import {
  DialogTitle,
  Box,
  InputAdornment,
  IconButton,
  Typography,
  styled,
  TextField,
  withStyles,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  CircularProgress,
} from '@material-ui/core';
import {
  useSessionState,
  useSessionDispatch,
  updateSessionExpired,
} from '../../../Context/Session';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { refreshToken } from '../../../api/AxiosConfig';
import { sendMagicLink } from '../../../api/Auth';

import config from '../../../config.json';
const ErrorTyp = styled(Typography)({
  color: '#EB4137',
  padding: '16px 0px',
});

const ActionsWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 24,
});

const LoadingWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const StyledButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);

const StyledDialogContent = withStyles({
  root: {
    padding: '0px 24px 16px',
  },
})(DialogContent);

export default function AuthenticationForm(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitCicked, setIsSubmitClicked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkLoader, setMagicLinkLoader] = useState(false);
  const sessionState = useSessionState();
  const sessionDispatch = useSessionDispatch();
  const location = useLocation();

  useEffect(() => {
    let AUTH_TOKEN = window.localStorage.getItem('AUTH_TOKEN');
    if (!AUTH_TOKEN) {
      window.location.href = config.baseUrl + 'users/sign_in/';
      return;
    }
    const decoded = jwt_decode(AUTH_TOKEN);
    if (AUTH_TOKEN && decoded.user_email && decoded.user_id) {
      setEmail(decoded.user_email);
    } else {
      window.location.href = config.baseUrl + 'users/sign_in/';
    }
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = () => {
    !isSubmitCicked && setIsSubmitClicked(true);
    if (!password) return;
    setLoading(true);
    refreshToken(password)
      .then((res) => {
        updateSessionExpired(sessionDispatch, { expired: false });
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const handleMagicLinkBtn = () => {
    setMagicLinkLoader(true);
    sendMagicLink(location.pathname)
      .then((res) => {
        setMagicLinkLoader(false);
      })
      .catch((err) => {
        setError(err);
        setMagicLinkLoader(false);
      });
  };

  return (
    <Dialog
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      open={sessionState.expired ? true : false}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Session Expired</DialogTitle>
      <StyledDialogContent>
        <DialogContentText>
          Your session is expired. Please enter password to continue.
        </DialogContentText>
        {error && <ErrorTyp>{error}</ErrorTyp>}
        <Box mt={2}>
          <TextField
            style={{ width: '100%' }}
            label={'Email'}
            variant="outlined"
            size="medium"
            defaultValue={email}
            disabled={true}
          />
        </Box>
        <Box mt={2}>
          <TextField
            label={'Password'}
            variant="outlined"
            style={{ width: '100%' }}
            size="medium"
            autoFocus={true}
            type={showPassword ? 'text' : 'password'}
            error={isSubmitCicked ? (password ? false : true) : false}
            helperText={
              isSubmitCicked ? (password ? '' : 'This field is required') : ''
            }
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <ActionsWrapper>
          <Box {...(magicLinkLoader && { pr: 6 })} mr={2}>
            {magicLinkLoader ? (
              <LoadingWrapper>
                <CircularProgress color="primary" size={30} />
              </LoadingWrapper>
            ) : (
              <StyledButton
                size="large"
                onClick={handleMagicLinkBtn}
                color="primary"
              >
                Send Magic Link
              </StyledButton>
            )}
          </Box>

          <Box {...(loading && { pr: 2 })}>
            {loading ? (
              <LoadingWrapper>
                <CircularProgress color="primary" size={30} />
              </LoadingWrapper>
            ) : (
              <StyledButton
                size="large"
                onClick={handleSubmit}
                color="primary"
                variant="contained"
              >
                Continue
              </StyledButton>
            )}
          </Box>
        </ActionsWrapper>
      </StyledDialogContent>
    </Dialog>
  );
}
