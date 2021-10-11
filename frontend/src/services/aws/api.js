// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import awsconfig from '../../awsConfig';
import axios from 'axios';
import { history } from 'umi';

const doRequest = async (url, method, data, options) => {
  let headers = {};
  if (localStorage.getItem('awsToken')) {
    headers = {
      'Authorization': `Bearer ${localStorage.getItem('awsToken')}`,
    };
  }

  options = { ...options, headers };

  return axios.request({
    url: url,
    method: method,
    data: { ...data },
    ...(options || {}),

  }).catch(function (error) {
    console.error("doRequest" + JSON.stringify(error));

    //Handle CORS error
    if ((error.message && error.message === 'Network Error') || (error.status >= 400 && error.status < 500)) {
      window.location = `https://${awsconfig.cognito_hosted_domain}/login?response_type=token&client_id=${awsconfig.aws_user_pools_web_client_id}&redirect_uri=${awsconfig.redirect_url}`;
    }

  });
}

//Thermostat
export async function getAllThermostats(params, options) {
  return doRequest(`${awsconfig.api_base_url}/thermostats/`, 'GET');
}

export async function addThermostat(data, params, options) {
  return doRequest(`${awsconfig.api_base_url}/thermostats/`, 'PUT', { ...data });
}

export async function updateThermostat(id, data, options) {

  return doRequest(`${awsconfig.api_base_url}/thermostats/${id}`, 'PUT', { ...data });
}

export async function deleteThermostat(id) {
  return doRequest(`${awsconfig.api_base_url}/thermostats/${id}`, 'DELETE');
}

//Log
export async function getAllLogs(params, options) {
  return doRequest(`${awsconfig.api_base_url}/logs/`, 'GET');
}

export async function addLog(data, params, options) {
  return doRequest(`${awsconfig.api_base_url}/logs/`, 'PUT', { ...data });
}
