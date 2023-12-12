import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useStateProvider } from '../../StateProvider/StateProvider';
import { updateOrder } from '../../Axios/web';
import { reducerCases } from '../../StateProvider/reducer';
import { ToastContainer, toast } from 'react-toastify';
import { GiReturnArrow } from 'react-icons/gi';

const CartPhone = ({ onClose }) => {
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
            // toast.info('Xóa thành công', {
            //    position: toast.POSITION.TOP_CENTER,
            //    autoClose: 1000,
            // });
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
         <div
            className={`container-cart ${
               cart?.detail.length > 0 ? null : 'subtract'
            }`}
         >
            <div className="header">
               <h2>Giỏ hàng</h2>
               <GiReturnArrow onClick={() => onClose(false)} />
            </div>
            {cart?.detail?.length > 0 ? (
               <>
                  <ul>
                     {cart?.detail?.map((detail) => (
                        <li key={detail?.productId}>
                           <img
                              src={
                                 process.env.REACT_APP_URL_IMG +
                                 detail?.mainFile
                              }
                              alt=""
                           />
                           <div>
                              <div>{detail?.productName}</div>
                              <div>
                                 {detail?.unitPrice.toLocaleString()} vnđ
                              </div>
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
                  <h5
                     style={{
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: 'black',
                     }}
                  >
                     Tổng tiền: {`${cart?.totalPrice?.toLocaleString()} vnđ`}
                  </h5>
                  <div className="direction">
                     {cart?.detail?.length > 0 ? (
                        <>
                           <div
                              onClick={() => {
                                 onClose();
                                 navigate('/pay');
                              }}
                           >
                              Thanh toán
                           </div>
                           <div
                              onClick={() => {
                                 onClose(false);

                                 navigate('/cart');
                              }}
                           >
                              Tuỳ chỉnh
                           </div>
                        </>
                     ) : null}
                  </div>
               </>
            ) : (
               <div style={{ color: 'black' }}>
                  Đơn hàng rỗng.Tiếp tục mua hàng &nbsp;
                  <Link
                     to={'/'}
                     onClick={() => {
                        onClose(false);
                     }}
                  >
                     tại đây
                  </Link>
               </div>
            )}
         </div>
      </Container>
   );
};

export default CartPhone;
const Container = styled.div`
   z-index: 4;
   width: 100vw;
   height: 100vh;
   position: fixed;
   background-color: rgba(0, 0, 0, 0.6);
   top: 0px;
   left: 0px;
   .header {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
   }
   .container-cart {
      padding: 0 10px;

      background-color: white;
      max-height: 350px;
      max-width: 250px;
      position: absolute;
      top: 40%;
      right: 20px;
      transform: translate(0, -50%);
      border-radius: 5px;
      min-height: 350px;
      min-width: 250px;
   }
   ul {
      list-style: none;
      padding: 0;
      overflow-y: auto;
      width: 100%;
      height: 200px;
   }

   li {
      display: flex;
      margin: 10px 0;
      border: 1px solid #ddd;
   }
   li:first-child {
      margin-top: 0;
      object-fit: contain;
   }

   li img {
      max-width: 70px;
      max-height: 70px;
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

   div.direction > div:nth-child(2) {
      cursor: pointer;
      font-size: 16px;
      background-color: #943939;
      border-radius: 5px;
      color: #fff;
      padding: 10px 20px;
      border: none;
      transition: background-color 0.3s;
   }

   div.direction > div:nth-child(2):hover {
      background-color: #811f1f;
   }
   .subtract {
      min-height: 110px !important;
   }
`;
