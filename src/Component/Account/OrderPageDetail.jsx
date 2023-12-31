import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { cancelOrder, finishOrder, getOrder } from '../../Axios/web';
import Rating from '../Rating';

const OrderPageDetail = () => {
   const [location, setLocation] = useState(useLocation().state);
   const { id } = useParams();
   const navigate = useNavigate();
   const [data, setData] = useState([]);
   const [orderInfo, setOrderInfo] = useState(null);
   const [isOpenRating, setIsOpenRating] = useState(false);

   const fetchData = async () => {
      const res = await getOrder(id);
      if (res?.status) {
         const temp = res?.result?.data?.order;
         setData(
            temp?.detail?.map((item) => ({
               id: item.productId,
               name: item.productName,
               price: item.unitPrice,
               quantity: item.itemCount,
               totalPrice: item.totalPrice,
               image: process.env.REACT_APP_URL_IMG + item.mainFile,
            }))
         );
         setOrderInfo({
            orderCode: temp?.id,
            address: temp?.address,
            status:
               temp?.status === 0
                  ? 'Khởi tạo'
                  : temp?.status === 1
                  ? 'Chờ thanh toán'
                  : temp?.status === 2
                  ? 'Đã thanh toán'
                  : temp?.status === 3
                  ? 'Hoàn thành'
                  : temp?.status === 4
                  ? 'Đã hủy'
                  : 'Lỗi trạng thái',
            paymentMethod: temp?.methodPayment,
            total: temp?.totalPrice,
            discount: temp?.discount ?? 0,
            finalTotal: temp?.totalPrice - (temp?.discount ?? 0),
         });
      }
   };
   useEffect(() => {
      fetchData();
   }, [id]);

   const CancelOrder = async () => {
      const res = await cancelOrder(id);
      if (res?.status) {
         fetchData();
         setLocation(undefined);
      }
   };

   const FinishOrder = async () => {
      const res = await finishOrder(id);
      if (res?.status) {
         fetchData();
         setLocation(undefined);
      }
   };

   return (
      <div>
         <Navbar>
            <span
               onClick={() => {
                  navigate(`/account/order`, {
                     state: location,
                  });
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
                        <td>{orderInfo?.orderCode}</td>
                     </tr>
                     <tr>
                        <td>Địa chỉ:</td>
                        <td>{orderInfo?.address}</td>
                     </tr>
                     <tr>
                        <td>Trạng thái:</td>
                        <td>
                           {orderInfo?.status}{' '}
                           {orderInfo?.status === 'Chờ thanh toán' ? (
                              <button
                                 type="button"
                                 onClick={() => CancelOrder()}
                              >
                                 Hủy
                              </button>
                           ) : null}
                           {orderInfo?.status === 'Đã thanh toán' ? (
                              <button
                                 type="button"
                                 onClick={() => FinishOrder()}
                              >
                                 Nhận hàng
                              </button>
                           ) : null}
                        </td>
                     </tr>
                     <tr>
                        <td>Phương thức:</td>
                        <td>{orderInfo?.paymentMethod}</td>
                     </tr>
                     <tr>
                        <td>Tổng tiền:</td>
                        <td>{orderInfo?.total.toLocaleString()} vnđ</td>
                     </tr>
                     <tr>
                        <td>Giảm giá:</td>
                        <td>{orderInfo?.discount.toLocaleString()} vnđ</td>
                     </tr>
                     <tr>
                        <td>Thành tiền:</td>
                        <td>{orderInfo?.finalTotal.toLocaleString()} vnđ</td>
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
                           {orderInfo.status === 'Hoàn thành' ? (
                              <button
                                 className="product-review"
                                 onClick={() => setIsOpenRating(true)}
                              >
                                 Đánh giá
                              </button>
                           ) : null}
                           {isOpenRating ? (
                              <Rating
                                 product={{
                                    ...item,
                                 }}
                                 onClose={() => setIsOpenRating(false)}
                                 onLoad={() => fetchData()}
                              />
                           ) : null}
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
