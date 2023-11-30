const checkAndRenewToken = async (response) => {
   try {
      if (response?.status) {
         if (response.result) {
            const dataLocal = JSON.parse(
               localStorage.getItem('webbanbalo_user')
            );

            localStorage.setItem(
               'webbanbalo_user',
               //response?.result?.resetToken
               JSON.stringify({
                  ...dataLocal,
                  token: response.result.resetToken,
               })
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
