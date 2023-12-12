import React from 'react';
import Admin from '../Admin';
import DiscountList from '../Component/DiscountList';

const DiscountPage = () => {
   return <Admin Child={DiscountList} indexActive={8} />;
};

export default DiscountPage;
