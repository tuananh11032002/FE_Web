import React, { useEffect } from 'react';
import Account from '../Component/Account';
import OrderPage from '../Component/Account/OrderPage';
import OrderPageDetail from '../Component/Account/OrderPageDetail';
export const OrderAccount = () => {
   useEffect(() => {
      window.scrollTo(0, 250);
   }, []);
   return (
      <>
         <Account indexActive={4} component={<OrderPage />} />
      </>
   );
};
export const OrderDetail = () => {
   useEffect(() => {
      window.scrollTo(0, 250);
   }, []);
   return (
      <>
         <Account indexActive={4} component={<OrderPageDetail />} />
      </>
   );
};
