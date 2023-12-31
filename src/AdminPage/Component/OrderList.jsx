import React, { useEffect, useState } from 'react';
import { IoMdDoneAll } from 'react-icons/io';
import { MdOutlinePendingActions, MdOutlineSmsFailed } from 'react-icons/md';

import styled from 'styled-components';
import Pagination from './Pagination';
import { RiRefundFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { GetOrderAdminApi, getListOrder } from '../../Axios/web';
import ProcessDate from '../../Helper/ProcessDate';

const OrderList = () => {
   const navigate = useNavigate();
   const [data, setData] = useState([]);
   const [selectAll, setSelectAll] = useState(false);
   const [countCompeted, setCountCompleted] = useState(0);
   const [countCancel, setCountCancel] = useState(0);
   const [countRefunded, setCountRefunded] = useState(0);
   const [countPP, setCountPP] = useState(0);

   const [checkboxes, setCheckboxes] = useState(
      Array(data?.length).fill(false)
   );

   const toggleSelectAll = () => {
      setSelectAll(!selectAll);
      setCheckboxes(Array(data?.length).fill(!selectAll));
   };

   const handleCheckboxChange = (index) => {
      const newCheckboxes = [...checkboxes];
      newCheckboxes[index] = !newCheckboxes[index];
      setCheckboxes(newCheckboxes);
   };
   const [selectedValue, setSelectedValue] = useState('7');
   const [pageNow, setPageNow] = useState(1);
   const [totalOrder, setTotalOrder] = useState(100);
   const [search, setSearch] = useState('');
   const fetchOrder = async () => {
      const dataApi = await getListOrder({
         page: pageNow,
         index: selectedValue,
      });
      console.log('data', dataApi);
      if (dataApi?.status) {
         if (
            JSON.stringify(dataApi.result.data.orderList) !==
            JSON.stringify(data)
         ) {
            setData(dataApi.result.data.orderList);
            setTotalOrder(dataApi.result.data.totalItemCount);
            setCountCompleted(0);
            setCountPP(0);
            setCountCancel(0);
            await Promise.all(
               dataApi.result.data.orderList.map(async (el) => {
                  if (el.status === 3) {
                     setCountCompleted((prevCount) => prevCount + 1);
                  }
                  if (el.status === 1 || el.status === 0) {
                     setCountPP((prevCount) => prevCount + 1);
                  }
                  if (el.status === 4) {
                     setCountCancel((prevCount) => prevCount + 1);
                  }
               })
            );
         }
      }
   };
   useEffect(() => {
      fetchOrder();
   }, [pageNow, search, selectedValue]);
   return (
      <Container>
         <h1>eCommerce / OrderList </h1>
         <div className="card-widget-saparater-wrapper">
            <div className="card">
               <div>
                  <p>Pending Payment</p>
                  <h1>{countPP}</h1>
               </div>
               <div>
                  <MdOutlinePendingActions />
               </div>
            </div>
            <div className="card">
               <div>
                  <p> Completed</p>
                  <h1>{countCompeted}</h1>
               </div>
               <div>
                  <IoMdDoneAll />
               </div>
            </div>
            <div className="card">
               <div>
                  <p>Refunded</p>
                  <h1>{countRefunded}</h1>
               </div>
               <div>
                  <RiRefundFill />
               </div>
            </div>
            <div className="card">
               <div>
                  <p> Failed</p>
                  <h1>{countCancel}</h1>
               </div>
               <div>
                  <MdOutlineSmsFailed />
               </div>
            </div>
         </div>
         <div className="datatable">
            <div className="datatable-action">
               <input
                  className="search-input"
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
               <div className="dttable-action-button">
                  <select
                     className="action-select"
                     name=""
                     id=""
                     onChange={(e) => setSelectedValue(e.target.value)}
                  >
                     <option value="7">7</option>
                     <option value="10">10</option>
                     <option value="20">20</option>
                     <option value="50">50</option>
                  </select>
               </div>
            </div>
            <div className="wrapper-table">
               <table className="datatable-product">
                  <thead>
                     <tr>
                        <th>
                           <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={toggleSelectAll}
                           />
                        </th>
                        <th>ORDER</th>
                        <th>DATE</th>

                        <th>CUTOMER</th>
                        {/* <th>PAYMENT</th> */}
                        <th>STATUS</th>
                        <th>METHOD</th>
                     </tr>
                  </thead>
                  <tbody>
                     {data?.map((product, index) => (
                        <tr key={index}>
                           <td>
                              <input
                                 type="checkbox"
                                 checked={checkboxes[index]}
                                 onChange={() => handleCheckboxChange(index)}
                              />
                           </td>
                           <td className="td-order">
                              <div
                                 style={{
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                 }}
                                 onClick={() => {
                                    navigate(
                                       `/admin/order-detail/${product.id}`
                                    );
                                 }}
                              >
                                 {product.id}
                              </div>
                           </td>
                           <td>{ProcessDate(product.createdDate)}</td>

                           <td className="td-customer">
                              <div className="td-flex">
                                 <img
                                    src={`http://112.78.1.194:5286/api/user/pro/pic/${product.user.id}`}
                                    alt=""
                                    width="40px"
                                    height="40px"
                                 />
                                 <div>
                                    <div>{product.user.name}</div>
                                    <div>{product.user.email}</div>
                                 </div>
                              </div>
                           </td>
                           {/* <td className="td-payment">
                               <div className={product.totalPrice?.toLowerCase()}>
                                 {product.totalPrice}
                              </div> 
                           </td> */}

                           <td className="td-status">
                              <span
                                 className={
                                    product?.status === 3
                                       ? 'delivered'
                                       : product.status === 2
                                       ? 'pay'
                                       : product.status === 1
                                       ? 'dis'
                                       : product.status === 0
                                       ? 'rea'
                                       : 'del'
                                 }
                              >
                                 {product?.status === 0
                                    ? 'Khởi tạo'
                                    : product.status === 1
                                    ? 'Xác nhận'
                                    : product.status === 2
                                    ? 'Thanh toán'
                                    : product.status === 3
                                    ? 'Hoàn tất'
                                    : 'Huỷ'}
                              </span>
                           </td>
                           <td className="td-methodPayment">
                              {/* <img
                                 src={processApiImagePath(
                                    product.imagePaymentMethod
                                 )}
                                 alt=""
                              /> */}
                              <span>{product.methodPayment}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
         <Pagination
            setPageNow={setPageNow}
            obj={{
               pageNow: pageNow,
               size: selectedValue,
               totalProduct: totalOrder,
            }}
         />
      </Container>
   );
};
const boxShadow = '0 0.375rem 1rem 0 rgba(58, 53, 65, 0.12)';
const borderRadius = '0.375rem';

const Container = styled.div`
   h1 {
      font-size: 2rem;
   }
   .card-widget-saparater-wrapper {
      display: flex;
      flex-wrap: wrap;
      border-radius: ${borderRadius};
      margin-bottom: 10px;

      box-shadow: ${boxShadow};
      background-color: white;
      .card {
         flex: 1;
         display: flex;
         justify-content: space-between;
         padding: 0 20px;
         align-items: center;
         flex-direction: row;
         margin: 10px;
         border: none;
         position: relative; /* Thêm position relative */
      }

      .card:not(:last-child)::after {
         content: '';
         width: 1px;
         background-color: #e7e7e8;
         position: absolute;
         top: 10px;
         bottom: 10px;
         right: -10px;
      }

      .card svg {
         width: 40px;
         height: 40px;
      }
      @media (max-width: 1215px) {
         .card {
            min-width: calc(50% - 20px);
            border-bottom: 1px solid #e7e7e8 !important;
         }
      }

      @media (max-width: 480px) {
         .card {
            min-width: calc(100% - 20px);
         }
      }
   }
   .wrapper-table {
      max-width: 100%;
      overflow: scroll;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      margin-bottom: 10px;
   }
   .datatable {
      background-color: white;
      margin: 10px 0 0 0;

      /* Đặt kiểu cho bảng */
      .datatable-product {
         width: 100%;
         border-collapse: collapse;
         border-spacing: 0;
         border: 1px solid #ccc;
         overflow: hidden;
      }
      .datatable-product thead tr,
      .datatable-product tbody tr {
         border-bottom: 1px solid #e7e7e8;
      }
      /* Đặt kiểu cho header của bảng */
      .datatable-product thead th {
         background-color: #f5f5f5;
         font-weight: bold;
         padding: 1.5rem;
      }

      /* Đặt kiểu cho ô trong tbody */
      .datatable-product tbody td {
         padding: 1.5rem;
         height: 100%;
      }

      /* Đặt kiểu cho checkbox */
      .datatable-product input[type='checkbox'] {
         margin: 0;
      }
      input[type='checkbox'] {
         transform: scale(1.5);
         margin-right: 5px;
      }

      input[type='checkbox']:checked {
         background-color: #007bff;
         border: 2px solid #007bff;
      }

      .td-order {
         color: #9055fd;
      }
      .td-customer .td-flex {
         display: flex;
         div {
            display: flex;
            text-align: left;
            flex-direction: column;
         }
      }
      .td-customer .td-flex img {
         border-radius: 50%;
         margin-right: 10px;
      }
      .td-methodPayment {
         display: flex;
         flex-direction: row;
         align-items: center;
         img {
            width: 40px;
            height: 40px;
            object-fit: contain;
         }
      }
      .td-payment {
         div::before {
            content: '';
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: black;
            position: absolute;
            top: 6px;
            left: -15px;
         }
         .paid {
            color: #56ca00;
            &::before {
               background-color: #56ca00;
            }
         }
         .cancelled {
            color: #8d9096;
            &::before {
               background-color: #8d9096;
            }
         }
         .failed {
            color: #ff4c51;
            &::before {
               background-color: #ff4c51;
            }
         }
         .pending {
            color: #ffb503;
            &::before {
               background-color: #ffb503;
            }
         }
      }

      /* Đặt kiểu cho cột "STATUS" */
      .datatable-product .td-status {
         font-weight: bold;
         .delivered {
            background-color: #e6f7d9 !important ;
            border-radius: 50rem !important;
            padding: 8px;
            color: #008000; /* Màu xanh dương cho trạng thái 'Active' */
         }
      }

      .datatable-product .td-status {
         .out,
         .not {
            font-weight: bold;

            color: #9a65fd;
            background-color: #eee6ff !important;
            border-radius: 50rem !important;
            padding: 8px;
         }
      }
      .datatable-product .td-status {
         .dis {
            color: #41bfff; /* Màu cam cho trạng thái không 'dispatched' */

            background-color: #fff4d9 !important;
            border-radius: 50rem !important;
            padding: 8px;
            font-weight: bold;
         }
      }
      .datatable-product .td-status {
         .pay {
            color: #ff4141; /* Màu cam cho trạng thái không 'dispatched' */

            background-color: #fff4d9 !important;
            border-radius: 50rem !important;
            padding: 8px;
            font-weight: bold;
         }
      }
      .datatable-product .td-status {
         .rea {
            color: #cc2ec7;

            background-color: #dde9f4 !important;
            border-radius: 50rem !important;
            padding: 8px;
            font-weight: bold;
         }
      }
      .datatable-product .td-status .del {
         color: #cc2e46;
         background-color: #d4f5e3 !important;
         border-radius: 50rem !important;
         padding: 8px;
         font-weight: bold;
      }

      .datatable-action {
         display: flex;
         width: 100%;
         justify-content: space-between;
         align-items: center;
         padding: 10px;
         border-radius: 5px;
         margin-bottom: 10px;

         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .search-input {
         flex: 1;
         padding: 8px;
         border: none;
         border-radius: 5px;
         font-size: 14px;
      }

      .dttable-action-button {
         display: flex;
         align-items: center;
         flex: 1;
         justify-content: flex-end;
      }

      .action-select {
         background-color: #fff;
         padding: 8px;
         border-radius: 5px;
         font-size: 14px;
         margin-right: 10px;
      }
   }
`;

export default OrderList;
