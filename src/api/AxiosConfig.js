import axios from 'axios';
import jwt_decode from 'jwt-decode';
import config from '../config.json';
import Toast from '../components/Toast';
import { updateSessionExpired } from '../Context/Session';

export default async function axiosConfig(
  sessionDispatch,
  url,
  method,
  data,
  headers
) {
  try {
    let AUTH_TOKEN = window.localStorage.getItem('AUTH_TOKEN');
    if (!AUTH_TOKEN) {
      window.location.href = config.baseUrl + 'users/sign_in/';
      return;
    }
    const decoded = jwt_decode(AUTH_TOKEN);
    if (!decoded.user_email || !decoded.user_id || !decoded.exp) {
      window.location.href = config.baseUrl + 'users/sign_in/';
      return;
    }
    if (decoded.exp - new Date().getTime() / 1000 < 0) {
      updateSessionExpired(sessionDispatch, { expired: true });
      return;
    }
    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    const res = await axios({
      method: method,
      url: url,
      params: {
        estimate_id: window.localStorage.getItem('ESTIMATE_ID'),
      },
      ...(data && {
        data: {
          ...data,
        },
      }),
      ...(headers && {
        headers: {
          ...headers,
        },
      }),
    });
    return res.data;
  } catch (ex) {
    if (!ex.response) {
      Toast('', 'Please check your internet connection', 'error');
    } else if (ex.response.status === 401) {
      updateSessionExpired(sessionDispatch, { expired: true });
    } else if (ex.response.status === 403) {
      window.location.href = config.baseUrl + 'users/sign_in/';
    } else {
      Toast('', 'Server Error!', 'error');
    }
  }
}

export async function refreshToken(password) {
  try {
    let AUTH_TOKEN = window.localStorage.getItem('AUTH_TOKEN');
    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    const decoded = jwt_decode(AUTH_TOKEN);
    const res = await axios.post(
      `${config.baseUrl}api/estimates/refresh_token`,
      {
        ...decoded,
        user_password: password,
      }
    );

    window.localStorage.setItem('AUTH_TOKEN', res.data.token);
    return res.data.token;
  } catch (ex) {
    if (!ex.response) {
      alert('Please check your internet connection');
      throw '';
    } else {
      throw ex.response.data.error;
    }
  }
}
