// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
import awsconfig from '../../awsConfig';

export async function getToken(params, options) {
  return request(`https://${awsconfig.cognito_hosted_domain}/login`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
