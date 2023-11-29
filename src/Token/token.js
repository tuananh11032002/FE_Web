const checkAndRenewToken = async (response) => {
   try {
      if (response?.status) {
         if (response.result.success) {
            const UserFromLogin = JSON.parse(
               localStorage.getItem('webbanbalo_user').user
            );
            // const UserWithResetToken = {
            //    token: response.result.resetToken,
            //    user: UserFromLogin,
            // };
            localStorage.setItem(
               'webbanbalo_user',
               JSON.stringify(response.result.resetToken)
            );
         }
      } else {
         console.log('error');
      }
   } catch (error) {
      console.error('Lỗi khi kiểm tra và cấp token mới:', error);
   }
};

export default checkAndRenewToken;
