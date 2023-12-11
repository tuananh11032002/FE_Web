import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useStateProvider } from '../../StateProvider/StateProvider';
import { updateOrder } from '../../Axios/web';
import { reducerCases } from '../../StateProvider/reducer';
import { ToastContainer, toast } from 'react-toastify';

const CartTablet = ({ onClose }) => {
   const navigate = useNavigate();
   const [{ user, cart }, dispatch] = useStateProvider();
   const handlerRemove = async (productid) => {
      if (user) {
         let cartdetail = cart?.detail
            ?.map((item) => ({
               productId: item.productId,
               itemCount: item.itemCount,
            }))
            .filter((item) => item.productId !== productid);

         console.log('aaaaaaaaaaaa', cartdetail, productid);
         const response = await updateOrder(cart?.id, {
            orderDetail: cartdetail,
         });
         if (response?.status) {
            dispatch({
               type: reducerCases.SET_CART,
               cart: 1,
            });
            toast.info('Xóa thành công', {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 1000,
            });
         } else {
            toast.error(`${response.result}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 3000,
            });
         }
      } else {
         navigate('/');
      }
   };
   return (
      <Container>
         <ToastContainer />
         <div>
            {cart?.detail?.length > 0 ? (
               <ul>
                  {cart?.detail?.map((detail) => (
                     <li key={detail?.productId}>
                        <img
                           src={
                              process.env.REACT_APP_URL_IMG + detail?.mainFile
                           }
                           alt=""
                        />
                        <div>
                           <div>{detail?.productName}</div>
                           <div>{detail?.unitPrice.toLocaleString()} vnđ</div>
                           <div>Số lượng: {detail?.itemCount}</div>
                        </div>
                        <button
                           onClick={() => {
                              handlerRemove(detail?.productId);
                           }}
                        >
                           Xóa
                        </button>
                     </li>
                  ))}
               </ul>
            ) : (
               <div>Đơn hàng rỗng</div>
            )}

            <div
               style={{
                  textAlign: 'right',
                  paddingRight: '10px',
               }}
            >
               Tổng tiền:
               {`${cart?.totalPrice?.toLocaleString()} vnđ`}
            </div>
            <div className="direction">
               {/* <div
                  onClick={() => {
                     onClose();

                     navigate('/cart');
                  }}
               >
                  Tuỳ chỉnh
               </div> */}
               {cart?.detail?.length > 0 ? (
                  <div
                     onClick={() => {
                        onClose();
                        navigate('/pay');
                     }}
                  >
                     Thanh toán
                  </div>
               ) : null}
            </div>
         </div>
         {/* {cart?.length === 0 ? (
            <div>
               Đơn hàng rỗng.Tiếp tục mua hàng{' '}
               <Link
                  to={'/'}
                  onClick={() => {
                     onClose();
                  }}
               >
                  tại đây
               </Link>
            </div>
         ) : null} */}
      </Container>
   );
};

export default CartTablet;
const Container = styled.div`
   z-index: 4;
   width: 300px;
   height: auto;

   background-color: white;
   position: absolute;
   top: 27px;
   right: 0px;
   overflow: auto;
   padding: 0px;

   ul {
      list-style: none;
      padding: 0;
      max-height: 300px;
      overflow-y: auto;
   }

   li {
      display: flex;
      margin: 10px 0;
      border: 1px solid #ddd;
   }
   li:first-child {
      margin-top: 0;
   }

   li img {
      max-width: 80px;
      max-height: 80px;
      margin-right: 10px;
   }

   li div {
      flex: 1;
      display: flex;
      flex-direction: column;
   }

   li div > div:first-child {
      font-weight: bold;
      font-size: 14px;
   }

   li div > div:nth-child(2) {
      font-size: 12px;
      color: #333;
   }

   /* Định dạng số lượng sản phẩm */
   li div > div:last-child {
      font-size: 12px;
      color: #777;
   }

   button {
      background-color: #835c59;
      color: #fff;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      transition: background-color 0.3s;
      font-size: 14px;
   }

   button:hover {
      background-color: #d32f2f;
   }

   text-align: center;

   ul {
      margin: 0;
   }

   & > div:last-child {
      font-size: 16px;
      margin-top: 10px;
      color: #007bff;
   }

   div.direction {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
   }

   div.direction > div {
      cursor: pointer;
      font-size: 16px;
      background-color: #007bff;
      border-radius: 5px;
      color: #fff;
      padding: 10px 20px;
      border: none;
      transition: background-color 0.3s;
   }

   div.direction > div:hover {
      background-color: #0056b3;
   }
`;
