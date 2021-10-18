import config from '../../config.json';
import { default as axios } from '../AxiosConfig';
import Toast from '../../components/Toast';
const endPointApi = `${config.baseUrl}api/estimates/estimates/save`;

export async function saveEstimate(
  sessionDispatch,
  appState,
  setSavedChangesStatus
) {
  let ESTIMATE_ID = window.localStorage.getItem('ESTIMATE_ID');
  return axios(sessionDispatch, endPointApi, 'post', {
    ...(ESTIMATE_ID && { id: ESTIMATE_ID }),
    estimate: appState,
  }).then((res) => {
    res && setSavedChangesStatus('All changes saved');
  });
}

export async function getEstimate(sessionDispatch) {
  let ESTIMATE_ID = window.localStorage.getItem('ESTIMATE_ID');
  if (!ESTIMATE_ID) return undefined;
  return axios(
    sessionDispatch,
    `${config.baseUrl}api/estimates/estimates/index`,
    'get'
  ).then((res) => {
    res && Toast('Estimate', 'Estimate fetched successfully', 'success');
    return res;
  });
}

export async function createNewEstimate(sessionDispatch, job_id) {
  return axios(
    sessionDispatch,
    `${config.baseUrl}api/estimates/estimates/create`,
    'post',
    {
      job_id: job_id,
    }
  ).then((res) => {
    if (res) {
      window.localStorage.setItem('ESTIMATE_ID', res.estimate_id);
    }
    return res;
  });
}

export async function getAllEstimates(sessionDispatch) {
  return axios(
    sessionDispatch,
    `${config.baseUrl}api/estimates/estimates/all`,
    'get'
  ).then((res) => (res ? res : []));
}
