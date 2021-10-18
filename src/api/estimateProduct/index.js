import config from '../../config.json';
import { default as axios } from '../AxiosConfig';
const endPointApi = `${config.baseUrl}api/estimates/products?id=`;

export async function getProducts(sessionDispatch, actionIds = []) {
  return axios(
    sessionDispatch,
    `${endPointApi}${JSON.stringify(actionIds)}`,
    'get'
  ).then((res) => (res ? res : {}));
}

export async function getColors(sessionDispatch) {
  return axios(
    sessionDispatch,
    `${config.baseUrl}api/estimates/product_colours/index`,
    'get'
  ).then((res) => (res ? res : {}));
}

export async function getProductsAtTheGo(sessionDispatch) {
  return axios(
    sessionDispatch,
    `${config.baseUrl}api/estimates/products/fetch_all_products_at_the_go`,
    'get'
  ).then((res) => (res ? res : []));
}

export async function saveProductProductionRate(
  sessionDispatch,
  productionRates
) {
  return axios(
    sessionDispatch,
    `${config.baseUrl}api/estimates/actions/save_product_production_rate`,
    'post',
    { product_production_rates: productionRates }
  ).then((res) => res);
}
