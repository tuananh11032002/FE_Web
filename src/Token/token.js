const checkAndRenewToken = async (response) => {
   try {
      if (response?.status) {
         if (response?.result?.resetToken ? true : false) {
            console.log('API', response.URL);
            console.log('resetToken', response.result.resetToken);
            await localStorage.setItem(
               'webbanbalo_user',
               JSON.stringify(response.result.resetToken)
            );
         }
      } else {
         console.error('api error', response);
      }
   } catch (error) {
      console.error('Lỗi khi kiểm tra và cấp token mới:', error);
   }
};

export default checkAndRenewToken;
