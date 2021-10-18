import config from '../../config.json';
import axios from 'axios';
import Toast from '../../components/Toast';
const endPointApi = `${config.baseUrl}api/estimates/surface_links/linking`;

export async function getLinkings() {
  try {
    const res = await axios.get(endPointApi);
    return res.data;
  } catch (ex) {
    if (!ex.response) {
      Toast(
        'Estimate Linking',
        'Please check your internet connection',
        'error'
      );
      return {};
    } else {
      Toast('Estimate Linking', 'Server Error!', 'error');
      return {};
    }
  }
}
