import axios from 'axios';

const instance = axios.create({
   baseURL: process.env.REACT_APP_URL_API,
   headers: {
      Accept: 'application/json',
   },
   timeout: 3000000,
});

instance.interceptors.response.use(
   (response) => {
      return {
         status: true,
         result: response.data,
         URL: response.request?.responseURL,
      };
   },
   (error) => {
      if (error.response) {
         const status = error.response.status;
         const data = error.response.data;
         const headers = error.response.request?.responseURL;

         if (status === 400 && data) {
            return {
               status: false,
               result: data,
               URL: headers,
            };
         } else if (status === 404) {
            return {
               status: false,
               result: data || 'Không tìm thấy trang yêu cầu',
               URL: headers,
            };
         } else if (status === 403) {
            return {
               status: false,
               result: data || 'Từ chối truy cập',
               URL: headers,
            };
         } else if (status === 401) {
            return {
               status: false,
               result: data || 'Tài khoản chưa được xác thực',
               URL: headers,
            };
         }
      }
   }
);

export default instance;
