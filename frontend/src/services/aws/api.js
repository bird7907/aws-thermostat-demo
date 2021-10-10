// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import awsconfig from '../../awsConfig';
import axios from 'axios';
import { history } from 'umi';


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
  ).catch(function (error) {
    if (error.response) { 
      if(status >= 400 && status < 500){
        history.push(`https://${awsconfig.cognito_hosted_domain}/login?response_type=token&client_id=${awsconfig.aws_user_pools_web_client_id}&redirect_uri=${awsconfig.redirect_url}`);
      }
    }
  });
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
  ).catch(function (error) {
    if (error.response) { 
      if(status >= 400 && status < 500){
        history.push(`https://${awsconfig.cognito_hosted_domain}/login?response_type=token&client_id=${awsconfig.aws_user_pools_web_client_id}&redirect_uri=${awsconfig.redirect_url}`);
      }
    }
  });
}

export async function updateThermostat(id, data, options) {
  let headers = {};
  if (localStorage.getItem('awsToken')) {
    headers = {
      'Authorization': `Bearer ${localStorage.getItem('awsToken')}`,
    };
  }

  options = { ...options, headers };

  return axios.put(`${awsconfig.api_base_url}/thermostats/${id}/`, { ...data },
    {
      ...(options || {}),
    }
  ).catch(function (error) {
    if (error.response) { 
      if(status >= 400 && status < 500){
        history.push(`https://${awsconfig.cognito_hosted_domain}/login?response_type=token&client_id=${awsconfig.aws_user_pools_web_client_id}&redirect_uri=${awsconfig.redirect_url}`);
      }
    }
  });
}

