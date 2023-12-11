import React, { useState, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { useStateProvider } from '../StateProvider/StateProvider';
import { getAllDiscount } from '../Axios/web';
import { useNavigate } from 'react-router-dom';
import PaymentInfo from './PaymentInfo';
import { validateEmail, validatePhone } from '../Helper/CheckInput';
import ProvinceList from '../Data/Province';
import { ToastContainer, toast } from 'react-toastify';

const PayPage = () => {
   const [{ cart, user }] = useStateProvider();
   const navigate = useNavigate();
   //const [loading, setLoading] = useState(false);
   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const [numberState, setNumberState] = useState(1);
   const spanRef = useRef(null);
   const [customerInfor, setCustomerInfo] = useState({
      address: '',
      customerName: user.name,
      customerPhone: user.contact,
      customerEmail: user.userName,
      customerProvince: '',
      customerWard: '',
      customerDistrict: '',
      coupon: null,
   });

   // const discountCodes = [
   //    { id: 1, code: 'DISCOUNT10', discount: 100000 },
   //    { id: 2, code: 'SAVE20', discount: 200000 },
   //    { id: 3, code: 'DEAL30', discount: 300000 },
   // ];
   const [discountCodes, setDiscountCodes] = useState([]);

   const [addresses] = useState(
      user?.addressList?.map((item) => ({
         id: item?.id,
         address: item?.description,
         name: item?.name,
         contact: item?.contact,
      }))
   );

   const [isDropdownVisible, setDropdownVisible] = useState(false);
   const [isDropdownAddress, setDropdownAddress] = useState(false);

   const getDiscountList = async () => {
      const res = await getAllDiscount();
      if (res?.status) {
         if (
            JSON.stringify(res?.result?.data?.discountList) !==
            JSON.stringify(discountCodes)
         ) {
            setDiscountCodes(
               res?.result?.data?.discountList?.map((item) => ({
                  id: item.id,
                  code: item.code,
                  discount: item.value,
               }))
            );
         }
      }
   };

   const handleLiClick = (data, type) => {
      setDropdownAddress(false);
      setDropdownVisible(false);
      switch (type) {
         case 'Address':
            setCustomerInfo({
               ...customerInfor,
               customerName: data?.name,
               customerPhone: data?.contact,
               address: data?.address,
            });
            break;
         case 'Coupon':
            setCustomerInfo({
               ...customerInfor,
               coupon: data,
            });
            break;
         default:
            break;
      }
   };

   // const handleUseCoupon = async () => {
   //    setLoading(true);
   //    const data = await getCoupon(couponRef.current.value);

   //    setLoading(false);
   //    console.log(data);
   //    if (data?.status) {
   //       setDiscount(data.result);
   //       setCustomerInfo({ ...customerInfor, coupon: couponRef.current.value });
   //    } else {
   //       toast.error(`${data?.result}`, {
   //          position: toast.POSITION.TOP_CENTER,
   //          autoClose: 3000,
   //       });
   //    }
   // };

   useEffect(() => {
      //api province
      const fetchData = async () => {
         try {
            const province = ProvinceList.map((item, index) => {
               return { name: item.name, index: index };
            });
            setProvinces(province);
         } catch (error) {
            console.error(error);
         }
      };
      fetchData();
   }, []);

   //api district
   const fetchDataDistrict = (code) => {
      try {
         const district = ProvinceList[code].districts.map((item, index) => {
            return {
               name: item.name,
               index: index,
               wards: item.wards,
            };
         });

         setDistricts(district);
      } catch (error) {
         console.error(error);
      }
   };

   //api wards
   const fetchDataWard = (code) => {
      try {
         const wards = districts[code].wards;
         console.log('ward', districts.wards);
         setWards(wards);
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => {
      if (spanRef.current) {
         const spanHeight = spanRef.current.clientHeight;
         spanRef.current.style.width = `${spanHeight}px`;
      }
   }, []);

   return (
      <Container>
         <ToastContainer />
         <div className="column">
            <nav>
               <span>Pay &gt; </span>
               <span
                  onClick={() => setNumberState(1)}
                  className={numberState === 1 ? 'active' : ''}
               >
                  Thông tin khách hàng
               </span>
               {numberState === 2 ? (
                  <span className={numberState === 2 ? 'active' : ''}>
                     &gt; Phương thức thanh toán
                  </span>
               ) : null}
            </nav>
            {numberState === 1 ? (
               <>
                  <div className="introduce">
                     <i>Misaproject</i>
                     <h3>Thông tin thanh toán</h3>
                  </div>
                  <div className="input-container">
                     <div className="input-row">
                        <div className="input-column">
                           <label>Tên người nhận </label>
                           <input
                              type="text"
                              className="input"
                              placeholder="Tên của người nhận"
                              name="name"
                              value={customerInfor?.customerName}
                              onChange={(e) =>
                                 setCustomerInfo({
                                    ...customerInfor,
                                    customerName: e.target.value,
                                 })
                              }
                           />
                           {customerInfor?.customerName === '' ? (
                              <p className="red">Nhập giá trị cho Name</p>
                           ) : (
                              <p className="green">Đã nhập giá trị cho Name</p>
                           )}
                        </div>
                     </div>
                     <div className="input-row">
                        <div className="input-column">
                           <label htmlFor="">Email </label>
                           <input
                              type="text"
                              className="input"
                              placeholder="Email liên hệ sau khi giao hàng"
                              name="email"
                              value={customerInfor?.customerEmail}
                              onChange={(e) =>
                                 setCustomerInfo({
                                    ...customerInfor,
                                    customerEmail: e.target.value,
                                 })
                              }
                           />
                           {customerInfor?.customerEmail === '' ? (
                              <p className="red">Nhập giá trị cho Mail</p>
                           ) : !validateEmail(customerInfor.customerEmail) ? (
                              <p className="red">Mail chưa hợp lệ</p>
                           ) : (
                              <p className="green">Email hợp lệ</p>
                           )}
                        </div>
                        <div className="input-column">
                           <label htmlFor="">Phone </label>
                           <input
                              type="text"
                              className="input"
                              placeholder="Số điện thoại nhận hàng"
                              name="phone"
                              value={customerInfor?.customerPhone}
                              onChange={(e) =>
                                 setCustomerInfo({
                                    ...customerInfor,
                                    customerPhone: e.target.value,
                                 })
                              }
                           />

                           {customerInfor?.customerPhone === '' ? (
                              <p className="red">Nhập giá trị cho Phone</p>
                           ) : !validatePhone(customerInfor?.customerPhone) ? (
                              <p className="red">Số điện thoại chưa hợp lệ</p>
                           ) : (
                              <p className="green">Số điện thoại hợp lệ</p>
                           )}
                        </div>
                     </div>
                     <div className="input-row">
                        <div
                           className="input-column addressHome"
                           onFocus={() => setDropdownAddress(true)}
                           onMouseLeave={() => setDropdownAddress(false)}
                        >
                           <label htmlFor="">Địa chỉ</label>
                           <input
                              type="text"
                              className="input"
                              placeholder="Địa chỉ giao hàng"
                              value={customerInfor?.address}
                              onChange={(e) =>
                                 setCustomerInfo({
                                    ...customerInfor,
                                    address: e.target.value,
                                 })
                              }
                           />
                           {isDropdownAddress === true ? (
                              <ul className="code-list">
                                 {addresses?.map((address, index) => (
                                    <li
                                       key={index}
                                       onClick={(e) =>
                                          handleLiClick(address, 'Address')
                                       }
                                    >
                                       <strong>
                                          {address?.name} - {address?.contact} -{' '}
                                          {address?.address}
                                       </strong>
                                    </li>
                                 ))}
                              </ul>
                           ) : null}
                        </div>
                     </div>
                  </div>
                  <div>
                     <div>Thông tin thêm: </div>
                     <div className="select">
                        <div>
                           <div htmlFor="">Chọn tỉnh</div>

                           <select
                              className="custom-select"
                              value={customerInfor?.customerProvince}
                              onChange={(e) => {
                                 setCustomerInfo({
                                    ...customerInfor,
                                    customerProvince: e.target.value,
                                    customerDistrict: '',
                                    customerWard: '',
                                 });

                                 const code =
                                    e.target.selectedOptions[0].getAttribute(
                                       'data-key'
                                    );
                                 fetchDataDistrict(code);
                              }}
                           >
                              <option value="">Chọn Tỉnh</option>
                              {provinces?.map((province, index) => (
                                 <option
                                    key={index}
                                    value={province.name}
                                    data-key={province.index}
                                 >
                                    {province.name}
                                 </option>
                              ))}
                           </select>

                           {/* {customerInfor.customerProvince === '' ? (
                           <p className="red">Chọn tỉnh đi bạn yêu</p>
                        ) : (
                           <p className="green">Đã chọn tỉnh</p>
                        )} */}
                        </div>

                        <div>
                           <div htmlFor="">Chọn huyện</div>

                           <select
                              className="custom-select"
                              value={customerInfor?.customerDistrict}
                              onChange={(e) => {
                                 setCustomerInfo({
                                    ...customerInfor,
                                    customerDistrict: e.target.value,
                                    customerWard: '',
                                 });

                                 const code =
                                    e.target.selectedOptions[0].getAttribute(
                                       'data-key'
                                    );
                                 fetchDataWard(code);
                              }}
                           >
                              <option value="">Chọn Huyện</option>
                              {districts.map((district, index) => (
                                 <option
                                    key={index}
                                    value={district.name}
                                    data-key={district.index}
                                 >
                                    {district.name}
                                 </option>
                              ))}
                           </select>

                           {/* {customerInfor.customerDistrict === '' ? (
                           <p className="red">Chọn huyện đi bạn yêu </p>
                        ) : (
                           <p className="green">Đã chọn huyện </p>
                        )} */}
                        </div>
                        <div>
                           <div htmlFor="">Chọn xã</div>

                           <select
                              className="custom-select"
                              value={customerInfor.customerWard}
                              onChange={(e) => {
                                 setCustomerInfo({
                                    ...customerInfor,
                                    customerWard: e.target.value,
                                 });
                              }}
                           >
                              <option value="">Chọn Xã</option>
                              {wards.map((ward, index) => (
                                 <option key={index} value={ward.name}>
                                    {ward.name}
                                 </option>
                              ))}
                           </select>

                           {/* {customerInfor.customerWard === '' ? (
                           <p className="red">Chọn xã đi bạn yêu</p>
                        ) : (
                           <p className="green">Đã chọn xã</p>
                        )} */}
                        </div>
                     </div>
                  </div>

                  <div className="button-container">
                     <div>
                        <button
                           onClick={() => {
                              navigate(`/`);
                           }}
                        >
                           Quay lại trang chủ
                        </button>
                     </div>
                     <button
                        onClick={() => {
                           if (
                              customerInfor &&
                              customerInfor?.customerName !== '' &&
                              customerInfor?.address !== '' &&
                              customerInfor?.customerPhone !== '' &&
                              validatePhone(customerInfor?.customerPhone) &&
                              customerInfor?.customerEmail !== '' &&
                              validateEmail(customerInfor?.customerEmail)
                           ) {
                              setNumberState(2);
                           } else {
                              toast.error('Vui lòng nhập đầy đủ thông tin', {
                                 position: toast.POSITION.TOP_CENTER,
                                 autoClose: 3000,
                              });
                           }
                        }}
                     >
                        Phương thức thanh toán
                     </button>
                  </div>
               </>
            ) : (
               <PaymentInfo customerInfor={customerInfor} orderId={cart?.id} />
            )}
         </div>

         <div className="column">
            <ul className="cart">
               {cart?.detail?.map((detail, index) => (
                  <li key={index}>
                     <div className="image">
                        <img
                           src={
                              process.env.REACT_APP_URL_IMG + detail?.mainFile
                           }
                           alt=""
                        />
                        <span className="quantity-badge">
                           {detail.itemCount}
                        </span>
                     </div>

                     <span>{detail?.productName}</span>
                     <span>
                        {(
                           detail?.unitPrice * detail?.itemCount
                        ).toLocaleString()}{' '}
                        vnđ
                     </span>
                  </li>
               ))}
            </ul>
            {numberState === 1 ? (
               <div
                  className="code-container"
                  onMouseLeave={() => setDropdownVisible(false)}
               >
                  <input
                     type="text"
                     placeholder="Nhập mã giảm giá tại đây"
                     className="discount-input"
                     value={customerInfor?.coupon?.code ?? ''}
                     onClick={() => {
                        getDiscountList();
                        setDropdownVisible(true);
                     }}
                  />
                  {isDropdownVisible && (
                     <ul className="code-list">
                        {discountCodes?.map((code, index) => (
                           <li
                              key={index}
                              onClick={() => handleLiClick(code, 'Coupon')}
                           >
                              <div>
                                 <strong>{code?.code}</strong>
                              </div>
                              <div>{code?.discount} vnđ</div>
                           </li>
                        ))}
                     </ul>
                     // <table className="code-list">
                     //    {discountCodes?.map((code, index) => (
                     //       <tr
                     //          key={index}
                     //          onClick={() => handleLiClick(code, 'Coupon')}
                     //       >
                     //          <td>
                     //             <strong>{code?.code}</strong>
                     //          </td>
                     //          <td>{code?.discount} vnđ</td>
                     //       </tr>
                     //    ))}
                     // </table>
                  )}
                  <button
                     className="apply-button"
                     // onClick={(e) => {
                     //    handleUseCoupon();
                     // }}
                     onClick={() =>
                        setCustomerInfo({
                           ...customerInfor,
                           coupon: null,
                        })
                     }
                  >
                     <span>Reset</span>
                     {/* {loading ? (
                        <span className="loading-icons">
                           <VscLoading />
                        </span>
                     ) : null} */}
                  </button>
               </div>
            ) : null}
            <div className="price-ship">
               <div className="price">
                  <div>Tạm tính</div>
                  <div>{`${cart?.totalPrice?.toLocaleString()} vnđ`}</div>
               </div>
               <div className="ship">
                  <div>Giảm giá</div>
                  <div>
                     {(customerInfor?.coupon?.discount ?? 0).toLocaleString()}{' '}
                     vnđ
                  </div>
               </div>
               <hr />
               <div className="ship">
                  <h3>Tổng tiền</h3>
                  <div>
                     {`${Math.max(
                        cart?.totalPrice -
                           (customerInfor?.coupon?.discount ?? 0),
                        0
                     ).toLocaleString()} vnđ`}
                  </div>
               </div>
            </div>
         </div>
      </Container>
   );
};
const Container = styled.div`
   margin: 15vh 10%;
   display: flex;
   flex-direction: row;

   .column {
      flex: 1;
      margin: 0 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      padding: 10px;
   }

   .cart {
      max-height: 300px;
      overflow: auto;
      padding: 10px;
      margin-bottom: 10px !important;
      list-style: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

      margin: 0;
      padding: 0;

      li {
         display: flex;
         align-items: center;
         margin: 10px 0;
         border: 1px solid #ccc;
         border-radius: 8px;
         padding: 10px;
      }

      .image {
         display: flex;
         align-items: center;
         margin-right: 10px;
      }

      .image img {
         height: 90%;
         width: 50px;
         border-radius: 8px;
      }

      .quantity-badge {
         position: absolute;
         background-color: #3498db;
         color: #fff;
         border-radius: 50%;
         width: 22px;
         height: 22px;
         text-align: center;
         line-height: 22px;
         top: -10px;
         right: -10px;
      }

      span {
         flex: 1;
      }

      span:last-child {
         text-align: center;
      }
   }
   nav span:first-child {
      color: #333;
      margin-right: 5px;
   }

   nav span.active {
      font-weight: bold;
      color: #0099ff;
      cursor: pointer;
   }

   nav span:last-child {
      margin-left: 5px;
   }
   nav span {
      cursor: pointer;
   }
   .input-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
   }

   .input-row {
      display: flex;
      margin-bottom: 10px;
      flex-wrap: wrap;

      @media (max-width: 768px) {
         flex-direction: column;
         margin: 0;
         margin-bottom: 10px;

         .input-column {
            width: 100%;
            margin-bottom: 10px;
         }
         .input-column:not(:last-child) {
            margin-bottom: 10px;
         }
         .input-column:last-child {
            margin-bottom: 0px;
         }
         .input-column:not(:first-child) {
            margin-left: 0px;
         }
      }
   }

   .input-column {
      flex: 1;
      display: flex;
      flex-direction: column;

      &:not(:first-child) {
         margin-left: 10px;
      }
   }
   .input-column.addressHome {
      .code-list {
         list-style: none;
         padding: 0;
         margin: 0;
         position: absolute;
         top: 100%;
         left: 0;
         background-color: #fff;
         border: 1px solid #ccc;
         border-radius: 4px;
         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
         max-height: 150px;
         overflow-y: auto;
         width: 100%;
         z-index: 1;
         border-radius: 8px;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .code-list li {
         padding: 8px;
         border-bottom: 1px solid #ccc;
         cursor: pointer;
         transition: background-color 0.3s;
         display: flex;
      }

      .code-list li:hover {
         background-color: #f0f0f0;
      }

      .code-list li:last-child {
         border-bottom: none;
      }
   }
   .green {
      color: green !important;
   }
   .red {
      color: red !important;
   }

   label::after {
      content: ' *';
      color: red;
   }
   .input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      transition: all 0.3s;

      &::placeholder {
         font-size: 14px;
      }

      &:focus {
         padding: 5px;
         border-top-width: 2px;
      }
   }

   .button-container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
   }
   .button-container button {
      background-color: #338dbc;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      border: none;
   }

   .select {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      * {
         color: black;
      }
   }
   .select > div {
      flex: 1;
      margin: 10px;
   }
   .custom-select {
      width: 100%;
      padding: 10px;
      border: 1px solid gray;
      border-radius: 5px;
      margin-right: 10px;
   }

   .custom-select:focus {
      outline: none;
   }

   .code-container {
      display: flex;
      align-items: center;

      .code-list {
         list-style: none;
         padding: 0;
         margin: 0;
         position: absolute;
         top: 100%;
         left: 0;
         background-color: #fff;
         border: 1px solid #ccc;
         border-radius: 4px;
         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
         max-height: 150px;
         overflow-y: auto;
         width: calc(100% - 95px);
         z-index: 1;
         border-radius: 8px;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .code-list li {
         padding: 8px;
         border-bottom: 1px solid #ccc;
         cursor: pointer;
         transition: background-color 0.3s;
      }

      .code-list li:hover {
         background-color: #f0f0f0;
      }

      .code-list li:last-child {
         border-bottom: none;
      }
      .discount-input {
         flex: 1;
         padding: 10px;
         border: 1px solid #ccc;
         border-radius: 4px;
         font-size: 1rem;
      }

      .apply-button {
         background-color: #3498db;
         color: #fff;
         border: none;
         border-radius: 4px;
         font-size: 1rem;
         padding: 10px 20px;
         cursor: pointer;
         margin-left: 10px;
      }

      .apply-button:hover {
         background-color: #2980b9;
      }
      .apply-button .loading-icons {
         margin-left: 10px;
      }
      .apply-button .loading-icons svg {
         animation: spin 2s linear infinite;
      }
   }

   .price-ship {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .price,
      .ship {
         width: 100%;
         display: flex;
         justify-content: space-between;
         margin: 5px 0;
      }

      .price div,
      .ship div {
         font-size: 1.2rem;
      }

      hr {
         border: 1px solid #ccc;
         width: 100%;
      }

      .ship h3 {
         font-size: 1.4rem;
         color: #3498db;
         font-weight: bold;
      }
   }
   @media (max-width: 768px) {
      flex-direction: column-reverse;
      margin: 15vh 0;
      padding: 0 5%;
      box-sizing: border-box;
      .select {
         flex: 1;

         flex-direction: column;
      }
      .select > div {
         width: 100%;
         margin: 0 0 10px 0;
      }
      > .column > div {
         padding-left: 0;
      }
      .select,
      .input-column {
         margin: auto;
      }
   }
`;
export default PayPage;
