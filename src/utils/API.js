import axios from 'axios';

export const ENDPOINT = 'http://3.18.52.196:5000';
export const SOCKET_ENDPOINT = 'http://3.18.52.196:5000';

// export const ENDPOINT = 'http://192.168.100.46:5000';
// export const SOCKET_ENDPOINT = 'http://192.168.100.46:5000';

export default axios.create({
  baseURL: ENDPOINT,
  timeout: 2000,
});
