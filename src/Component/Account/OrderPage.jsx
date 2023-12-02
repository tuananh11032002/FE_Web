import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CancelOrder, getMyListOrder } from '../../Axios/web';
import processApiImagePath from '../../Helper/EditLinkImage';
import Pagination from '../../AdminPage/Component/Pagination';
import { useNavigate } from 'react-router-dom';
import Rating from '../Rating';
import ConfirmationDialog from '../../Sharing/MessageBox';

const OrderPage = () => {
   const navigate = useNavigate();
   const [data, setData] = useState();
   const [pageNow, setPageNow] = useState(1);
   const [status, setStatus] = useState(0);
   const [activeItem, setActiveItem] = useState(0);
   const [totalOrder, setTotalOrder] = useState(0);
   const [totalPage, setTotalPage] = useState(5);
   const [isOpenRating, setIsOpenRating] = useState(false);
   const [productEdit, setProductEdit] = useState({ orderId: null });
   const [orderIdEdit, setOrderIdEdit] = useState();
   const messageBoxRef = useRef();

   const handleYes = () => {
      handleCancelOrder();
   };

   const handleNo = () => {
      console.log('User clicked No');
   };

   const showConfirmationDialog = () => {
      messageBoxRef.current.show();
   };
   const handleItemClick = (index) => {
      setActiveItem(index);
   };
   const handleRating = async (item, orderId) => {
      setIsOpenRating(true);
      setProductEdit({ ...item, orderId: orderId });
   };
   const handleCancelOrder = async () => {
      const data = await CancelOrder(orderIdEdit);
      if (data?.status) {
         fetchData();
      }
   };
   const fetchData = async () => {
      const dataApi = await getMyListOrder(
         JSON.stringify({
            index: 5,
            page: pageNow,
            status: status == 0 ? null : status,
         })
      );
      if (dataApi?.status) {
         const Index = dataApi?.result?.data?.orderList?.filter(
            (i) => i.status === 0
         );
         setData(
            Index.map((i) => ({
               orderId: i.id,
               customerName: i.user.name,
               orderDate: i.createdDate,
               totalAmount: i.totalPrice,
               orderStatus:
                  i.status === 0
                     ? 'Khởi tạo'
                     : i.status === 1
                     ? 'Chờ thanh toán'
                     : i.status === 2
                     ? 'Đang giao'
                     : i.status === 3
                     ? 'Hoàn thành'
                     : i.status === 4
                     ? 'Đã hủy'
                     : 'Lỗi trạng thái',
               feeShip: 0,
               grandTotal: i.totalPrice - i.discount,
               discount: i.discount,
               shippingAddress: i.address,
            }))
         );
         setTotalOrder(dataApi?.result?.data?.totalItemCount);
         setTotalPage(dataApi?.result?.data?.totalItemPage);
      }
   };
   useEffect(() => {
      fetchData();
   }, [pageNow, status]);
   return (
      <Container>
         <ConfirmationDialog
            ref={messageBoxRef}
            onYesClick={handleYes}
            onNoClick={handleNo}
         />
         <div className="navbar">
            <div
               className={`nav-item ${activeItem === 0 ? 'active' : ''}`}
               onClick={() => {
                  handleItemClick(0);
                  setStatus('');
               }}
            >
               Tất cả
            </div>
            <div
               className={`nav-item ${activeItem === 1 ? 'active' : ''}`}
               onClick={() => {
                  handleItemClick(1);
                  setStatus('Paid');
               }}
            >
               Chờ thanh toán
            </div>
            <div
               className={`nav-item ${activeItem === 2 ? 'active' : ''}`}
               onClick={() => {
                  handleItemClick(2);
                  setStatus('Dispatched');
               }}
            >
               Đang giao
            </div>
            <div
               className={`nav-item ${activeItem === 3 ? 'active' : ''}`}
               onClick={() => {
                  handleItemClick(3);
                  setStatus('Delivered');
               }}
            >
               Hoàn thành
            </div>
            <div
               className={`nav-item ${activeItem === 4 ? 'active' : ''}`}
               onClick={() => {
                  handleItemClick(4);
                  setStatus('Cancelled');
               }}
            >
               Đã hủy
            </div>
         </div>
         {data?.map((da, index) => {
            return (
               <div
                  className="order-child"
                  key={index}
                  onClick={() => {
                     navigate(`/account/order/${da.orderId}`);
                  }}
               >
                  <div className="header">
                     <div>Mã số đơn hàng: {da.orderId}</div>
                     <div>Tình trạng đơn hàng: {da.orderStatus}</div>
                  </div>
                  <div className="footer">
                     <div>
                        <p>Địa chỉ giao hàng: {da?.shippingAddress}</p>
                        <p>
                           Phương thức thanh toán:
                           {da?.paymentMethod === 'Momo'
                              ? 'VNPAY'
                              : da?.paymentMethod}
                        </p>
                     </div>
                     <div>
                        <div className="price">
                           <div className="price-total">
                              <div>Tổng tiền: </div>
                              <div className="price-label">
                                 {da?.totalAmount.toLocaleString()} vnđ
                              </div>
                           </div>
                           {/* <div className="price-total">
                              <div>Phí vận chuyển:</div>
                              <div className="price-label">
                                 {da?.feeShip.toLocaleString()} vnđ
                              </div>
                           </div> */}
                           <div className="price-total">
                              <div>Giảm giá:</div>
                              <div className="price-label">
                                 {da?.discount?.toLocaleString()} vnđ
                              </div>
                           </div>
                           <div className="price-total">
                              <div>Thành tiền: </div>
                              <div className="price-label">
                                 {da?.grandTotal.toLocaleString()} vnđ
                              </div>
                           </div>
                        </div>
                        {da.orderStatus === 'ReadytoPickup' ? (
                           <button
                              className="cancel-button"
                              onClick={() => {
                                 setOrderIdEdit(da.orderId);
                                 showConfirmationDialog();
                              }}
                           >
                              Hủy đơn
                           </button>
                        ) : null}
                     </div>
                  </div>
               </div>
            );
         })}
         <Pagination
            obj={{ totalProduct: totalOrder, pageNow, size: 3 }}
            setPageNow={setPageNow}
         />
      </Container>
   );
};
const Container = styled.div`
   .navbar {
      display: flex;
      justify-content: space-around;
      padding: 10px;
      background-color: #f5f5f5;
      margin-bottom: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
   }

   .nav-item {
      cursor: pointer;
      padding: 5px 20px;
      color: black;
      text-align: center;
      font-weight: 500;
      font-size: 16px;
   }

   .nav-item.active {
      border-bottom: 1px solid black;
   }
   .order-child {
      border: 1px solid #ccc;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      user-select: none;
      .header {
         display: flex;
         justify-content: space-between;
         border-bottom: 1px solid #ccc;
         padding-bottom: 10px;
         font-weight: bold;
      }
      .header div:nth-child(2) {
         text-align: right;
      }

      .body {
         .review {
            display: flex;
            justify-content: space-between;
            flex-direction: row;
         }
         button.product-review {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: #fff;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            max-height: 50px;
         }

         button.product-review:hover {
            background-color: #2980b9;
         }

         .item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            & > div {
               display: grid;
            }
            img {
               border-radius: 5px;
               box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1),
                  0 8px 16px rgba(0, 0, 0, 0.1);
               max-width: 80px;
               max-height: 80px;
               margin: 10px;
            }
            .item-details {
               display: flex;
               flex-direction: column;
               span {
                  margin: 2px 0;
               }
            }
         }
      }
      .footer {
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         padding-top: 10px;
         align-items: flex-start;
         div:last-child {
            text-align: right;
         }
         button.cancel-button {
            padding: 10px 20px;
            background-color: #dc3545;
            color: #fff;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            max-height: 50px;
         }

         button.cancel-button:hover {
            background-color: #c82333;
         }
         button {
            padding: 5px 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            cursor: pointer;
            margin-left: 10px;
            &:first-child {
               background-color: #28a745;
            }
         }
         .price-total {
            display: flex;
            justify-content: flex-end;
            .price-label {
               min-width: 15rem;
               text-align: right;
               font-size: 14px;
            }
         }
      }
   }
`;

export default OrderPage;
