import config from '../../config.json';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Toast from '../../components/Toast';
const endPointApi = `${config.baseUrl}api/estimates/`;

export async function sendMagicLink(pathname) {
  try {
    let AUTH_TOKEN = window.localStorage.getItem('AUTH_TOKEN');
    if (!AUTH_TOKEN) {
      window.location.href = config.baseUrl + 'users/sign_in/';
      return;
    }
    const decoded = jwt_decode(AUTH_TOKEN);
    if (!decoded.user_email || !decoded.user_id) {
      window.location.href = config.baseUrl + 'users/sign_in/';
      return;
    }
    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    const res = await axios({
      method: 'post',
      url: `${endPointApi}token_magic_link`,
      params: {
        estimate_id: window.localStorage.getItem('ESTIMATE_ID'),
        url: pathname,
      },
    });
    res.data.status && Toast('Magic Link', res.data.message, 'success');
    return res.data;
  } catch (ex) {
    if (!ex.response) {
      Toast('', 'Please check your internet connection', 'error');
    } else if (ex.response.status === 403) {
      window.location.href = config.baseUrl + 'users/sign_in/';
    } else {
      throw ex.response.data.error;
    }
  }
}
