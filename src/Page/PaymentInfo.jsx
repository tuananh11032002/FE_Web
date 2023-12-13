import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
//import processApiImagePath from '../Helper/EditLinkImage';
import { confirmOrder, getPaymentLink } from '../Axios/web';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useStateProvider } from '../StateProvider/StateProvider';
import { reducerCases } from '../StateProvider/reducer';

function PaymentInfo({ customerInfor, orderId }) {
   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(false);
   const [loading, setLoading] = useState(false);
   const [{ connection, user }, dispatch] = useStateProvider();

   const navigate = useNavigate();
   const handlePaymentMethodSelect = (method) => {
      setSelectedPaymentMethod(method);
   };

   useEffect(() => {
      if (connection) {
         connection.on('PaySuccess', async () => {
            const data = await confirmOrder(orderId, {
               address: customerInfor?.address,
               receiveName: customerInfor?.customerName,
               receiveContact: customerInfor?.customerPhone,
               email: customerInfor?.customerEmail,
               tinh: customerInfor?.customerProvince,
               phuong: customerInfor?.customerDistrict,
               xa: customerInfor?.customerWard,
               discountId: customerInfor?.coupon?.id,
            });

            if (data?.status) {
               dispatch({
                  type: reducerCases.SET_USER,
                  user: { ...user, newOrderId: null },
               });
               navigate('/account/order');
            } else {
               toast.error(`${data.result}`, {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 3000,
               });
            }
            setLoading(false);
         });
         connection.on('Fail', async () => {
            toast.error(
               `Thanh toán thất bại! Vui lòng thử lại hoặc chọn thanh toán tiền mặt`,
               {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 4000,
               }
            );
            setLoading(false);
         });
         connection.invoke('Join', orderId);
      }

      return () => {
         if (connection) {
            connection.off('PaySuccess');
            connection.off('Fail');
            connection.invoke('Leave', orderId);
         }
      };
   }, [connection]);

   const handleSubmit = async () => {
      setLoading(true);
      if (selectedPaymentMethod === false) {
         const data = await confirmOrder(orderId, {
            address: customerInfor?.address,
            receiveName: customerInfor?.customerName,
            receiveContact: customerInfor?.customerPhone,
            email: customerInfor?.customerEmail,
            tinh: customerInfor?.customerProvince,
            phuong: customerInfor?.customerDistrict,
            xa: customerInfor?.customerWard,
            discountId: customerInfor?.coupon?.id,
         });

         if (data?.status) {
            dispatch({
               type: reducerCases.SET_USER,
               user: { ...user, newOrderId: null },
            });
            navigate('/account/order');
         } else {
            toast.error(`${data.result}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 3000,
            });
         }

         setLoading(false);
      } else {
         const data = await getPaymentLink(orderId, customerInfor?.coupon?.id);
         if (data?.status) {
            window.open(data.result, '_blank');
         }
      }
   };
   // useEffect(() => {
   //    const fetchLink = async (dataTemp) => {
   //       if (selectedPaymentMethod === true) {
   //          const data = await getVNPayLink(dataTemp);
   //          if (data?.status) {
   //             window.open(data.result, '_blank');
   //          }
   //       }
   //    };

   //    fetchLink({
   //       id: orderId,
   //       coupon: customerInfor.coupon,
   //       shippingAddress: `${customerInfor.customerProvince}
   //      ${customerInfor.customerDistrict}
   //      ${customerInfor.customerWard}`,
   //       billingAddress: selectedPaymentMethod.toString(),
   //       orderNote: customerInfor.customerPhone,
   //       paymentMethod: selectedPaymentMethod.toString(),
   //       customerName: customerInfor.customerName,
   //       customerPhone: customerInfor.customerPhone,
   //    });
   // }, [selectedPaymentMethod]);
   return (
      <Container className="payment-info-container">
         <ToastContainer />
         <div className="payment-method">
            <p>Phương thức thanh toán:</p>
            <div className="payment-options">
               <label>
                  <input
                     type="radio"
                     value="COD"
                     checked={selectedPaymentMethod === false}
                     onClick={() => handlePaymentMethodSelect(false)}
                  />
                  Thanh toán tiền mặt khi nhận hàng (COD)
               </label>
               <label>
                  <input
                     type="radio"
                     value="Momo"
                     checked={selectedPaymentMethod === true}
                     onClick={() => handlePaymentMethodSelect(true)}
                  />
                  Chuyển khoản ngân hàng (Miễn phí thanh toán)
               </label>
            </div>
         </div>
         <div className="complete-button">
            <button
               onClick={() => {
                  handleSubmit();
               }}
            >
               <span>Hoàn tất</span>
               {loading ? (
                  <span className="loading-icons">
                     <VscLoading />
                  </span>
               ) : null}
            </button>
         </div>
      </Container>
   );
}

export default PaymentInfo;
const Container = styled.div`
   border: 1px solid #ccc;
   padding: 20px;
   margin: 20px;
   max-width: 400px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
   border-radius: 5px;

   .delivery-time {
      font-size: 18px;
      margin-bottom: 10px;
   }
   .delivery-time p {
      font-weight: bold;
   }
   .delivery-time .delivery-time-info {
      display: flex;
      justify-content: space-between;
   }
   .delivery-time .delivery-time-info > :nth-child(2) {
      text-align: right;
   }

   .payment-method p {
      font-weight: bold;
      margin-bottom: 10px;
   }

   .payment-options label {
      display: block;
      margin-bottom: 10px;
   }

   .payment-options input {
      margin-right: 5px;
   }

   .momo-image img {
      max-width: 100px;
      margin-top: 10px;
   }
   .complete-button {
      text-align: right;
   }
   .complete-button button {
      background-color: #0099ff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;

      cursor: pointer;
   }

   .complete-button button:hover {
      background-color: #0077cc;
   }
   .loading-icons {
      margin-left: 10px;
   }
   .loading-icons svg {
      animation: spin 2s linear infinite;
   }
`;
