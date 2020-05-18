import request from './request';

export const POST = (url, data, callback, header) => {
  return request(url, data, 'POST',callback, header);
}

export const GET = (url, data, callback, header) => {
  return request(url, data, 'GET',callback, header);
}