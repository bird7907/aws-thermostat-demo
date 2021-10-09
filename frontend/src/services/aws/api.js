// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import awsconfig from '../../awsConfig';
import axios from 'axios';


// export async function getAllThermostats(options) {
//   return request(`https://${awsconfig.cognito_hosted_domain}/thermostats`, {
//     // return request(`/thermostats`, {
//     method: 'GET',
//     ...(options || {}),
//   });
// }

export async function getAllThermostats(params, options) {
  let headers = {};
  if (localStorage.getItem('awsToken')) {
    headers = {
      'Authorization': `Bearer ${localStorage.getItem('awsToken')}`,
    };
  }

  options = { ...options, headers };

  return axios.get(`${awsconfig.api_base_url}/thermostats/`,
    {
      params: { ...params },
      ...(options || {}),
    }
  )
}

export async function addThermostat(data, params, options) {
  let headers = {};
  if (localStorage.getItem('awsToken')) {
    headers = {
      'Authorization': `Bearer ${localStorage.getItem('awsToken')}`,
    };
  }

  options = { ...options, headers };

  return axios.put(`${awsconfig.api_base_url}/thermostats/`, { ...data },
    {
      params: { ...params },
      ...(options || {}),
    }
  )
}

export async function updateThermostat(data, params, options) {
  let headers = {};
  if (localStorage.getItem('awsToken')) {
    headers = {
      'Authorization': `Bearer ${localStorage.getItem('awsToken')}`,
    };
  }

  options = { ...options, headers };

  return axios.put(`${awsconfig.api_base_url}/thermostats/${params.id}/`, { ...data },
    {
      ...(options || {}),
    }
  )
}

