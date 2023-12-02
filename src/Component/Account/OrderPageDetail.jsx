import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const OrderPageDetail = () => {
   const [data, setData] = useState([
      {
         name: 'Product A',
         price: 100000,
         quantity: 100,
         totalPrice: 10000000,
         image: 'https://lh6.googleusercontent.com/xr1tWQ0zigU8mFvMGfMmW2oiX9yinGbn8LaRLMHnPXvsh7Bg1ABs2Tk8ZfAoQMv6mPw9Id-iaSB1zuU5UTJmCcnTybFvdiaC-EHxrdTbRmNJT22y1tmSb5rE1--xKXg3TrmwO2z3',
      },
      {
         name: 'Product A',
         price: 100000,
         quantity: 100,
         totalPrice: 10000000,
         image: 'https://lh6.googleusercontent.com/xr1tWQ0zigU8mFvMGfMmW2oiX9yinGbn8LaRLMHnPXvsh7Bg1ABs2Tk8ZfAoQMv6mPw9Id-iaSB1zuU5UTJmCcnTybFvdiaC-EHxrdTbRmNJT22y1tmSb5rE1--xKXg3TrmwO2z3',
      },
      {
         name: 'Product A',
         price: 100000,
         quantity: 100,
         totalPrice: 10000000,
         image: 'https://lh6.googleusercontent.com/xr1tWQ0zigU8mFvMGfMmW2oiX9yinGbn8LaRLMHnPXvsh7Bg1ABs2Tk8ZfAoQMv6mPw9Id-iaSB1zuU5UTJmCcnTybFvdiaC-EHxrdTbRmNJT22y1tmSb5rE1--xKXg3TrmwO2z3',
      },
      {
         name: 'Product A',
         price: 100000,
         quantity: 100,
         totalPrice: 10000000,
         image: 'https://lh6.googleusercontent.com/xr1tWQ0zigU8mFvMGfMmW2oiX9yinGbn8LaRLMHnPXvsh7Bg1ABs2Tk8ZfAoQMv6mPw9Id-iaSB1zuU5UTJmCcnTybFvdiaC-EHxrdTbRmNJT22y1tmSb5rE1--xKXg3TrmwO2z3',
      },
   ]);
   const orderInfo = {
      orderCode: 'ABC123',
      address: '123 Main Street',
      status: 'Đã giao hàng',
      paymentMethod: 'Thanh toán khi nhận hàng',
      total: 1000000,
      discount: 10000000,
      finalTotal: 90000,
   };
   const { id } = useParams();
   const navigate = useNavigate();
   return (
      <div>
         <Navbar>
            <span
               onClick={() => {
                  navigate('/account/order');
               }}
            >
               Order
            </span>
            <span className="active"> &gt; {id}</span>
         </Navbar>
         <Container>
            <div className="order-info">
               <h2>Thông tin đơn hàng</h2>
               <table>
                  <tbody>
                     <tr>
                        <td>Mã đơn hàng:</td>
                        <td>{orderInfo.orderCode}</td>
                     </tr>
                     <tr>
                        <td>Địa chỉ:</td>
                        <td>{orderInfo.address}</td>
                     </tr>
                     <tr>
                        <td>Trạng thái:</td>
                        <td>{orderInfo.status}</td>
                     </tr>
                     <tr>
                        <td>Phương thức:</td>
                        <td>{orderInfo.paymentMethod}</td>
                     </tr>
                     <tr>
                        <td>Tổng tiền:</td>
                        <td>{orderInfo.total.toLocaleString()} vnđ</td>
                     </tr>
                     <tr>
                        <td>Giảm giá:</td>
                        <td>{orderInfo.discount.toLocaleString()} vnđ</td>
                     </tr>
                     <tr>
                        <td>Thành tiền:</td>
                        <td>{orderInfo.finalTotal.toLocaleString()} vnđ</td>
                     </tr>
                  </tbody>
               </table>
            </div>
            <div className="product-list">
               <h2>Danh sách sản phẩm</h2>
               <div>
                  {data?.map((item, index) => {
                     return (
                        <div className="product" key={index}>
                           <div className="image">
                              <img src={item.image} alt="Ảnh lỗi" />
                           </div>
                           <div className="product-infor">
                              <div>Tên sản phẩm: {item.name} </div>
                              <div>
                                 Đơn giá: {item.price.toLocaleString()} vnđ
                              </div>
                              <div>Số lượng: {item.quantity}</div>
                              <div>
                                 Tổng tiền: {item.totalPrice.toLocaleString()}{' '}
                                 vnđ
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </Container>
      </div>
   );
};
const Navbar = styled.nav`
   .active {
      color: #6161d0;
   }
   span:first-child {
      font-weight: bold;
      cursor: pointer;
   }
   span:last-child {
      cursor: not-allowed;
   }
`;
const Container = styled.div`
   display: flex;
   justify-content: space-between;
   flex-wrap: wrap;
   @media screen and (max-width: 756px) {
      .order-info {
         min-width: 100%;
      }
   }
   .order-info {
      border: 1px solid #ddd;
      padding: 10px;
      flex: 1;
      margin-right: 10px;

      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
   }
   .order-info table {
      padding: 10px;
      margin-right: 10px;
      width: 100%;
   }
   .order-info table td {
      padding: 10px;
   }
   h2 {
      font-size: 1.5em;
      font-weight: bold;
      margin-bottom: 10px;
      background-color: #f5f5f5;
      padding: 10px;
   }

   .product-list {
      border: 1px solid #ddd;
      padding: 10px;
      flex: 1;

      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
   }
   .product-list > div {
      max-height: 350px;
      overflow-y: auto;
   }
   .product {
      margin-bottom: 10px;
      display: flex;
   }
   .product .image {
      flex: 0.75;
      align-items: center;
      justify-content: center;
      display: flex;
   }
   .product .image img {
      width: 95px;
      height: 95px;
      object-fit: contain;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   }
   .product > .product-infor {
      flex: 1;
   }
`;

export default OrderPageDetail;
