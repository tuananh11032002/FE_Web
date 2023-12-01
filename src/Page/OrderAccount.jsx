import React, { useEffect } from 'react';
import Account from '../Component/Account';
import OrderPage from '../Component/Account/OrderPage';
import OrderPageDetail from '../Component/Account/OrderPageDetail';
const OrderAccount = () => {
   useEffect(() => {
      window.scrollTo(0, 250);
   }, []);
   return (
      <>
         <Account indexActive={4} component={<OrderPageDetail />} />
      </>
   );
};

export default OrderAccount;
