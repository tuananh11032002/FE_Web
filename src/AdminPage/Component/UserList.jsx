import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiUserCheck } from 'react-icons/bi';
import { FaUserPen } from 'react-icons/fa6';
import styled from 'styled-components';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../Admin';
import { deleteAccount, getListAccount, register,UpdateAccountForAdmin } from '../../Axios/web';
import adminSVG from '../../Assets/Image/admin.svg';
import customerSVG from '../../Assets/Image/customer.svg';
import processApiImagePath from '../../Helper/EditLinkImage';
import { MdAutoDelete, MdChangeCircle } from 'react-icons/md';
import ConfirmationDialog from '../../Sharing/MessageBox';
import { ToastContainer, toast } from 'react-toastify';

const UserList = () => {
   const [data, setData] = useState([]);
   const { closeMenu } = useContext(AdminContext);
   const [isOpenEditUser, setIsOpenEditUser] = useState(false);
   const navigate = useNavigate();
   const [selectAll, setSelectAll] = useState(false);
   const [totalUser, setTotalUser] = useState(100);
   const [checkboxes, setCheckboxes] = useState(Array(data.length).fill(false));
   const [pageNow, setPageNow] = useState(1);
   const messageBoxRef = useRef();
   const [userIdEdit, setUserIdEdit] = useState(null);
   const [role, setRole] = useState();
   const [activeUPay, setActiveUPay] = useState(0);
   const [inActiveUPay, setInactiveUPay] = useState(0);
   const [activeUOrder, setActiveUOrder] = useState(0);
   const [inActiveUOrder, setInactiveUOrder] = useState(0);
   const handleYes = async () => {
      console.log('userIdEdit', userIdEdit);

      const data = await deleteAccount(userIdEdit);

      console.log('delete', data);
      if (data?.status) {
         fetchData();
         toast.info('Thao tác thành công', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
         });
      } else {
         toast.error(`${data.result}`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
         });
      }
   };

   const handleNo = () => {
      console.log('User clicked No');
   };

   const HandleDelete = (userId) => {
      messageBoxRef.current.show();
      setUserIdEdit(userId);
   };
   const toggleSelectAll = () => {
      setSelectAll(!selectAll);
      setCheckboxes(Array(data.length).fill(!selectAll));
   };

   const handleCheckboxChange = (index) => {
      const newCheckboxes = [...checkboxes];
      newCheckboxes[index] = !newCheckboxes[index];
      setCheckboxes(newCheckboxes);
   };
   const [selectedValue, setSelectedValue] = useState('7');
   const [formData, setFormData] = useState({
      userName: '',
      password: '',
      name: '',
   });
   const [selection, setSelection] = useState({
      userRole: '',
      userStatus: '',
   });
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const data = await register(formData);
      console.log('api:', data);
      if(role==="Admin"&&data.result.id){
         const res = await UpdateAccountForAdmin({id:data.result.id,role:role});
      }
      if (data?.status) {
         toast.info('Thao tác thành công', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
         });
         setIsOpenEditUser(false);
         fetchData();
      } else {
         toast.error(`${data.result}`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
         });
      }
   };
   const [search, setSearch] = useState('');
   const fetchData = async () => {
      const dataAPi = await getListAccount(
         {
            page:pageNow,
            index:selectedValue,
            search:search,
            role:selection.userRole===""?null:selection.userRole==="Admin"?"Admin":"Member",
            status:selection.userStatus===""?null:selection.userStatus==="Active"?true:false
         }
      );
      console.log('dataApi', dataAPi);
      if (dataAPi?.status) {
         if (JSON.stringify(data) !== JSON.stringify(dataAPi.result.data.userList)) {
            setData(dataAPi.result.data.userList);
            setTotalUser(dataAPi.result.data.totalItemCount);
            setActiveUPay(0);setInactiveUPay(0);setActiveUOrder(0);setInactiveUOrder(0);
            await Promise.all(dataAPi.result.data.userList.map(async (el) => {
               if(el.status===true){
                  setActiveUPay((prevCount) => prevCount + el.totalSpent);
                  setActiveUOrder((prevCount) => prevCount + el.totalOrder);
               }
               if(el.status===false){
                  setInactiveUPay((prevCount) => prevCount + el.totalSpent);
                  setInactiveUOrder((prevCount) => prevCount + el.totalOrder);
               }
            }));
         }
      }
   };
   useEffect(() => {
      fetchData();
   }, [selectedValue, search, pageNow, selection]);
   return (
      <>
         <ToastContainer />

         <ConfirmationDialog
            ref={messageBoxRef}
            onYesClick={handleYes}
            onNoClick={handleNo}
         />
         {isOpenEditUser ? (
            <Overlay>
               {closeMenu()}
               <div className="form-container">
                  <form onSubmit={handleSubmit}>
                     <div className="form-group">
                        <label htmlFor="fullName" className="require force">
                           Nhập username:
                        </label>
                        <input
                           type="text"
                           name="userName"
                           value={formData.userName}
                           onChange={handleChange}
                        />
                     </div>

                     <div className="form-group">
                        <label className="force" htmlFor="password">
                           Nhập password:
                        </label>
                        <input
                           name="password"
                           value={formData.password}
                           onChange={handleChange}
                        />
                     </div>
                     <div className="form-group">
                        <label htmlFor="fullName" className="force">
                           Nhập họ tên:
                        </label>
                        <input
                           type="text"
                           name="name"
                           value={formData.name}
                           onChange={handleChange}
                        />
                     </div>

                     <div className="form-group">
                        <label htmlFor="role" className="force">
                           Chọn vai trò:
                        </label>
                        <select
                           name="role"
                           value={role}
                           onChange={(e)=>{setRole(e.target.value)}}
                        >
                           <option value="Member">Customer</option>
                           <option value="Admin">Admin</option>
                        </select>
                     </div>

                     <div className="button-group">
                        <button type="submit" className="submit-button">
                           Submit
                        </button>
                        <button
                           type="button"
                           className="cancel-button"
                           onClick={() => {
                              setIsOpenEditUser(false);
                              
                           }}
                        >
                           Cancel
                        </button>
                     </div>
                  </form>
               </div>
            </Overlay>
         ) : null}
         <Container>
            <h1>eCommerce / User List</h1>
            <div className="card-widget-saparater-wrapper">
               <div className="card">
                  <div>
                     <p>Active Users</p>
                     <h1>{activeUPay.toLocaleString()}đ</h1>
                     <p>
                        <span> {activeUOrder} orders</span>
                        {/* <span className="card-widget-rate-increase">+5.7%</span> */}
                     </p>
                  </div>
                  <div>
                     <BiUserCheck />
                  </div>
               </div>
               <div className="card">
                  <div>
                     <p> Inactive Users</p>
                     <h1>{inActiveUPay.toLocaleString()}đ</h1>
                     <p>
                        <span> {inActiveUOrder} orders</span>
                        {/* <span className="card-widget-rate-decrease">-3.5%</span> */}
                     </p>
                  </div>
                  <div>
                     <FaUserPen />
                  </div>
               </div>
            </div>
            <div className="datatable">
               <div className="datatable-filter">
                  <div className=" product_status">
                     <select
                        value={selection.userRole}
                        onChange={(e) => {
                           setPageNow(1);
                           setSelection({
                              ...selection,
                              userRole: e.target.value,
                           });
                        }}
                     >
                        <option value=""> Select Role </option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Customer</option>
                     </select>
                  </div>

                  <div className="product_stock">
                     <select
                        value={selection.userStatus}
                        onChange={(e) => {
                           setPageNow(1);
                           setSelection({
                              ...selection,
                              userStatus: e.target.value,
                           });
                        }}
                     >
                        <option value=""> Select Status </option>
                        <option value="Active" className="text-capitalize">
                           Active
                        </option>
                        <option value="Inactive" className="text-capitalize">
                           Inactive
                        </option>
                     </select>
                  </div>
               </div>
               <div className="datatable-action">
                  <input
                     className="search-input"
                     type="text"
                     placeholder="Search"
                     value={search}
                     onChange={(e) => {
                        setPageNow(1);
                        setSearch(e.target.value);
                     }}
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
                     <div
                        className="action-button"
                        onClick={() => {
                           setIsOpenEditUser(true);
                        }}
                     >
                        <AiOutlinePlus />
                        <span>Add User</span>
                     </div>
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
                           <th>USER</th>
                           <th>EMAIL</th>

                           <th>ROLE</th>
                           <th>STATUS</th>
                           <th>ACTION</th>
                        </tr>
                     </thead>
                     <tbody>
                        {data.map((user, index) => (
                           <tr key={index}>
                              <td>
                                 <input
                                    type="checkbox"
                                    checked={checkboxes[index]}
                                    onChange={() => handleCheckboxChange(index)}
                                 />
                              </td>
                              <td>
                                 <div className="td-flex">
                                    <img
                                       src={`http://112.78.1.194:5286/api/user/pro/pic/${user.id}`}
                                       alt=""
                                       width="40px"
                                       height="40px"
                                    />
                                    <div>
                                       <div
                                          onClick={() => {
                                             navigate(
                                                `/admin/account-detail/${user.id}`
                                             );
                                          }}
                                       >
                                          {user.name}
                                       </div>
                                       <div>{user.userName}</div>
                                    </div>
                                 </div>
                              </td>
                              <td>{user.userName}</td>
                              <td className={`td-role ${user.role}`}>
                                 {user.role.toLowerCase() === 'admin' ? (
                                    <span>
                                       <img src={adminSVG} alt="" />
                                    </span>
                                 ) : (
                                    <span>
                                       <img src={customerSVG} alt="" />
                                    </span>
                                 )}
                                 <span>{user.role}</span>
                              </td>

                              <td
                                 className={`${user.status===true?("active"):("inctive")}-user`}
                              >
                                 <span>{user.status===true?"active":"inactive"}</span>
                              </td>
                              <td className="td-action">
                                 <span onClick={() => HandleDelete(user.id)}>
                                    <MdAutoDelete />
                                 </span>
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
                  totalProduct: totalUser,
               }}
            />
         </Container>
      </>
   );
};
const boxShadow = '0 0.375rem 1rem 0 rgba(58, 53, 65, 0.12)';
const borderRadius = '0.375rem';
const Overlay = styled.div`
   background-color: rgba(0, 0, 0, 0.3);
   position: fixed;
   top: 0;
   right: 0;
   left: 0;
   bottom: 0;

   width: 100%;
   z-index: 1;
   height: 100vh;
   display: flex;
   justify-content: flex-end;

   .form-container {
      background-color: white;
      padding: 20px;
      max-width: 400px;
      width: 400px;
      border: 1px solid #ddd;
      z-index: 2;
      animation: slide 0.2s linear;
      @keyframes slide {
         from {
            transform: translateX(100%);
         }
         to {
            transform: translateX(0%);
         }
      }
   }

   .form-group {
      margin: 10px 0;
   }

   label {
      display: block;
   }
   .force::after {
      color: red;
      content: ' *';
   }
   input,
   select {
      width: 100%;
      padding: 10px;
      margin: 5px 0;
   }

   .button-group {
      margin-top: 10px;
   }

   .cancel-button {
      background-color: #ff6666;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
   }

   .submit-button {
      background-color: #3399ff;
      color: white;
      border: none;
      padding: 10px 20px;
      margin-right: 10px;
      border-radius: 5px;
      transition: box-shadow 0.1s;
   }

   .cancel-button:active {
      background-color: red;
   }

   .submit-button:active {
      background-color: #0066cc;
   }
   .submit-button:hover,
   .cancel-button:hover {
      box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.2);
   }
`;
const Container = styled.div`
   h1 {
      font-size: 2rem;
   }
   .card-widget-saparater-wrapper {
      display: flex;
      flex-wrap: wrap;
      border-radius: ${borderRadius};

      box-shadow: ${boxShadow};
      background-color: white;
      .card {
         flex: 1;
         display: flex;
         justify-content: space-around;
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
   }
   .datatable {
      background-color: white;
      margin: 10px 0 0 0;
      .datatable-filter {
         display: flex;
         justify-content: space-between;
         align-items: center;
         padding: 1.5rem 0;
         flex-wrap: wrap;
      }
      .datatable-filter div {
         display: flex;
         flex: 1;
         margin: 0 10px;
      }
      .datatable-filter select {
         padding: 5px;
         border: 1px solid #ccc;
         border-radius: 4px;
         width: 100%; /* Chiều rộng bằng chiều rộng của cha */
         background-color: transparent; /* Loại bỏ màu nền của select */
         transition: border 0.3s; /* Hiệu ứng border */
      }

      .datatable-filter select:focus {
         border: 2px solid #9055fd; /* Hiệu ứng border khi được chọn */
      }

      /* Điều chỉnh màu nền và các kiểu khác cho các select phù hợp với mục tiêu của bạn */

      /* Đặt kiểu cho bảng */
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
      /* Đặt kiểu cho header của bảng */
      .datatable-product thead th {
         background-color: #f5f5f5;
         font-weight: bold;
         padding: 1.5rem;
      }

      /* Đặt kiểu cho ô trong tbody */
      .datatable-product tbody td {
         padding: 1.5rem;
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
      /* Đặt kiểu cho cột "ACTIONS" */

      .datatable-product .td-role img {
         width: 40px;
         height: 40px;
         object-fit: contain;
         margin-right: 5px;
         align-items: center;
      }
      .datatable-product .admin svg {
         color: red;
      }
      .datatable-product .user svg {
         color: blue;
      }
      .datatable-product .td-action span {
         margin: 0 5px;
         width: 30px;
         height: 30px;
         cursor: pointer;
      }
      .datatable-product td:nth-child(2) {
         .td-flex {
            display: flex;
            align-items: center;
         }
         .td-flex img {
            border-radius: 50%;
            margin-right: 10px;
         }
         .td-flex > div {
            text-align: left;
         }
         .td-flex > div > div:first-child {
            font-weight: 500;
            cursor: pointer;
         }
      }

      /* Đặt kiểu cho cột "STATUS" */
      .datatable-product .active-user {
         font-weight: bold;
         color: #008000; /* Màu xanh dương cho trạng thái 'Active' */
         span {
            background-color: #e6f7d9 !important ;
            border-radius: 50rem !important;
            padding: 8px;
         }
      }

      .datatable-product .inactive-user {
         color: #ff0000; /* Màu đỏ cho trạng thái không 'Active' */
         span {
            background-color: #ffe4e5 !important;
            border-radius: 50rem !important;
            padding: 8px;
         }
      }
      .datatable-product .pending-user {
         color: #ffb400; /* Màu cam cho trạng thái không 'Scheduled' */
         span {
            background-color: #fff4d9 !important;
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
      }

      .action-button:hover {
         background-color: #0056b3;
      }
   }
   @media screen and (max-width: 756px) {
      .datatable-filter div {
         min-width: calc(100%);
         margin: 1rem 0 !important;
      }
   }
   @media screen and (max-width: 600px) {
      .action-button span {
         display: none;
      }
   }
`;

export default UserList;
