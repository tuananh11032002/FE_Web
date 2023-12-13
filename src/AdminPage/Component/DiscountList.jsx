import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Pagination from './Pagination';
import { BiSolidDiscount } from 'react-icons/bi';
import { MdOutlineDiscount, MdWeb } from 'react-icons/md';
import styled from 'styled-components';
import DiscountEditForm from './DiscountEditForm';
import DetailDiscount from './DetailDiscount';

const DiscountList = () => {
   const [isOpenEditForm, setIsOpenEditForm] = useState(false);
   const [isOpenDetailDiscount, setIsOpenDeatilDiscount] = useState(false);
   const [dataEdit, setDataEdit] = useState(null);
   const openDetailDiscount = () => {
      setIsOpenDeatilDiscount(true);
   };
   const closeDetailDiscount = () => {
      setIsOpenDeatilDiscount(false);
   };
   const openDiscountEdit = () => {
      setIsOpenEditForm(true);
   };
   const closwDiscountEdit = () => {
      setIsOpenEditForm(false);
   };
   const fakeDiscountData = [
      {
         id: 1,
         discountCode: 'DISCOUNT123',
         discountAmount: 10,
         quantity: 50,
         expirationDate: '2023-12-31',
         status: 'active',
      },
      {
         id: 2,
         discountCode: 'DISCOUNT123',

         discountAmount: 50,
         quantity: 100,
         expirationDate: '2023-08-15',
         status: 'inactive',
      },
   ];

   return (
      <>
         {isOpenEditForm ? (
            <DiscountEditForm closeForm={closwDiscountEdit} />
         ) : null}
         {isOpenDetailDiscount ? (
            <DetailDiscount
               discount={dataEdit}
               openFormEdit={openDiscountEdit}
               closeForm={closeDetailDiscount}
            />
         ) : null}
         <Container>
            <h1>eCommerce / Discount List</h1>
            <div className="card-widget-saparater-wrapper">
               <div className="card">
                  <div>
                     <h3>Total number of discount codes</h3>
                     <h1>{0} Mã giảm giá</h1>
                     <p>
                        <span className="card-widget-rate-increase">+5.7%</span>
                     </p>
                  </div>
                  <div>
                     <MdOutlineDiscount />
                  </div>
               </div>
               <div className="card">
                  <div>
                     <h3> Total number of discount codes used</h3>
                     <h1>{0} Mã giảm giá</h1>
                     <p>
                        <span className="card-widget-rate-increase">
                           +12.4%
                        </span>
                     </p>
                  </div>
                  <div>
                     <MdWeb />
                  </div>
               </div>
               <div className="card">
                  <div>
                     <h3>Total number of unused discount codes</h3>
                     <h1>{0} Mã giảm giá </h1>
                     <p>
                        <span className="card-widget-rate-increase">+5.7%</span>
                     </p>
                  </div>
                  <div>
                     <BiSolidDiscount />
                  </div>
               </div>
            </div>
            <div className="datatable">
               <div className="datatable-filter">
                  <div className=" product_status">
                     <select>
                        <option value="null">Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                     </select>
                  </div>
                  <div className="product_category">
                     <div className="datetime-wrapper">
                        <span>Từ: &nbsp;</span>
                        <input type="date" name="" id="" />
                     </div>
                     <div className="datetime-wrapper">
                        <span>&nbsp;Đến: &nbsp;</span>
                        <input type="date" name="" id="" />
                     </div>
                  </div>
               </div>
               <div className="datatable-action">
                  <input
                     className="search-input"
                     type="text"
                     placeholder="Search"
                  />
                  <div className="dttable-action-button">
                     <select className="action-select" name="" id="">
                        <option value="7">7</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                     </select>
                     <div
                        className="action-button"
                        onClick={() => openDiscountEdit()}
                     >
                        <AiOutlinePlus />
                        <span>ADD DISCOUNT</span>
                     </div>
                  </div>
               </div>
               <div className="wrapper-table">
                  <table className="datatable-product">
                     <thead>
                        <tr>
                           <th></th>
                           <th>
                              <input type="checkbox" />
                           </th>
                           <th>Mã của giảm giá</th>
                           <th>Giá trị của mã</th>

                           <th>Số tiền giảm</th>
                           <th>Số lượng</th>
                           <th>Hạn sử dụng</th>
                           <th>Trạng thái</th>
                        </tr>
                     </thead>
                     <tbody>
                        {fakeDiscountData.map((data, index) => {
                           return (
                              <tr key={index}>
                                 <td className="td-action">
                                    <span
                                       onClick={() => {
                                          openDetailDiscount();
                                          setDataEdit(data);
                                       }}
                                    >
                                       <AiOutlinePlus />
                                    </span>
                                 </td>
                                 <td>
                                    <input type="checkbox" />
                                 </td>
                                 <td>#{data.id}</td>
                                 <td>{data.discountCode}</td>
                                 <td>{data.discountAmount}</td>
                                 <td>{data.quantity}</td>
                                 <td>{data.expirationDate}</td>
                                 <td className={`${data.status}-ic`}>
                                    <span>{data.status}</span>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
            <Pagination
               setPageNow={1}
               obj={{
                  pageNow: 1,
                  size: 1,
                  totalProduct: 100,
               }}
            />
         </Container>
      </>
   );
};
const Container = styled.div`
   .card-widget-saparater-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .card {
         flex: 1;
         display: flex;
         justify-content: space-around;
         align-items: center;
         flex-direction: row;
         margin: 10px;
         border: none;
         box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
         padding: 10px 0;
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
      .card-widget-rate-increase {
         color: #56ca00 !important;
         background-color: #e6f7d9;
      }
      .card-widget-rate-decrease {
         background-color: #ffe4e5 !important;
         color: #ff4c51 !important;
      }
      .card svg {
         width: 40px;
         height: 40px;
      }
   }
   .datatable {
      background-color: white;
      margin: 10px 0 0 0;
      & > div {
         margin-bottom: 10px;
      }

      .datatable-filter {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 15px;
      }
      .datatable-filter .product_status {
         padding: 5px;
         flex: 1;
      }
      .datatable-filter .product_status select {
         width: 100%;
         margin: 0 10px;
         border-radius: 5px;
      }
      .datatable-filter .product_category {
         flex: 2;
         display: flex;
         flex-direction: row;
      }
      .datetime-wrapper {
         flex: 1;
      }
      .datetime-wrapper input[type='date'] {
         padding: 8px;
         font-size: 14px;
         width: 80%;
         border-radius: 5px;
      }

      .product_status {
         margin-right: 10px;
      }

      .product_status select {
         padding: 8px;
         font-size: 14px;
      }

      .datatable-product {
         width: 100%;
         border-collapse: collapse;
         border-spacing: 0;
         border: 1px solid #ccc;
         overflow: hidden;
      }
      .datatable-product thead th,
      .datatable-product tbody td {
         border-bottom: 1px solid #e7e7e8;
      }
      .datatable-product thead th {
         background-color: #f5f5f5;
         font-weight: bold;
         padding: 1.5rem;
      }

      .datatable-product tbody td {
         padding: 1.5rem;
      }

      .datatable-product input[type='checkbox'] {
         margin: 0;
         padding: 0 10px;
         visibility: hidden;
      }
      input[type='checkbox'] {
         transform: scale(1.5);
         margin-right: 5px;
      }

      input[type='checkbox']:checked {
         background-color: #007bff;
         border: 2px solid #007bff;
      }
      /* Đặt kiểu cho cột "ACTIONS" */
      .datatable-product td:last-child {
      }
      .datatable-product .td-action svg {
         fill: white;
      }
      .datatable-product .td-action span {
         display: flex;
         justify-content: center;
         align-items: center;
         width: 25px;
         height: 25px;
         background-color: #9055fd;
         border: 2px solid #fff;
         box-shadow: 0 0 3px rgba(58, 53, 65, 0.8);
         border-radius: 50%;
      }

      .datatable-product .td-flex {
         display: flex;
         div {
            margin-left: 10px;
            text-align: left;
         }
      }

      .datatable-product td {
         .toggle-label {
            position: relative;
            display: inline-block;
            width: 40px; /* Điều chỉnh chiều rộng */
            height: 20px; /* Điều chỉnh chiều cao */
         }

         .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            border-radius: 20px; /* Điều chỉnh độ cong của góc */
            transition: 0.4s;
         }

         .toggle-slider:before {
            position: absolute;
            content: '';
            height: 16px; /* Điều chỉnh chiều cao của nút trượt */
            width: 16px; /* Điều chỉnh chiều rộng của nút trượt */
            left: 2px; /* Điều chỉnh vị trí từ trái */
            bottom: 2px; /* Điều chỉnh vị trí từ dưới */
            background-color: white;
            border-radius: 50%;
            transition: 0.4s;
         }
         .toggle-label input:checked + .toggle-slider {
            background-color: #007bff; /* Màu nền của toggle khi bật */
         }

         .toggle-label input:checked + .toggle-slider:before {
            transform: translateX(20px);
         }
      }
      /* Đặt kiểu cho cột "STATUS" */
      .datatable-product .active-ic {
         font-weight: bold;
         color: #008000; /* Màu xanh dương cho trạng thái 'Active' */
         span {
            background-color: #e6f7d9 !important ;
            border-radius: 50rem !important;
            padding: 8px;
         }
      }

      .datatable-product .inactive-ic {
         color: #ff0000; /* Màu đỏ cho trạng thái không 'Active' */
         span {
            background-color: #ffe4e5 !important;
            border-radius: 50rem !important;
            padding: 8px;
         }
      }

      .datatable-action {
         display: flex;
         width: 100%;
         justify-content: space-between;
         align-items: center;
         padding: 10px;
         border-radius: 5px;
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

      .action-button {
         background-color: #007bff;
         color: #fff;
         padding: 10px 20px;
         border: none;
         border-radius: 5px;
         cursor: pointer;
         font-size: 14px;
         text-align: center;
         display: flex;
         align-items: center;
         justify-content: center;
      }

      .action-button:hover {
         background-color: #0056b3;
      }
   }
`;
export default DiscountList;
