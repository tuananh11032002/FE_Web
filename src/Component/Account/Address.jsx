import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import styled from 'styled-components';
import { useStateProvider } from '../../StateProvider/StateProvider';
import {
   updateAddress,
   getProfileByToken,
   addAddress,
   deleteAddress,
} from '../../Axios/web';
import { reducerCases } from '../../StateProvider/reducer';
import ProvinceList from '../../Data/Province';

const Address = () => {
   const [{ user }, dispatch] = useStateProvider();
   const [data, setData] = useState();
   const [isEditing, setIsEditing] = useState(false);
   const [editedData, setEditedData] = useState({
      id: null,
      name: '',
      phone: '',
      address: '',
   });
   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
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
      const temp = async () => {
         if (user) {
            setData(
               user.addressList.map((i) => ({
                  id: i.id,
                  name: i.name,
                  phone: i.contact,
                  address: i.description,
               }))
            );
         }
      };
      temp();
   }, [user]);

   const handleEdit = async (id) => {
      const selectedData = data.find((item) => item.id === id);
      setIsEditing(true);
      setEditedData(selectedData);
   };
   const handleDelete = async (id) => {
      const res = await deleteAddress(id);
      if (res?.status) {
         await fetchUser();
      }
   };
   const fetchUser = async () => {
      const res = await getProfileByToken();
      if (res?.status) {
         dispatch({
            type: reducerCases.SET_USER,
            user: res?.result?.data?.user,
         });
      }
   };
   const handleSave = async () => {
      if (editedData.id ? true : false) {
         const res = await updateAddress(
            JSON.stringify({
               id: editedData.id,
               name: editedData.name,
               contact: editedData.phone,
               decription: editedData.address,
            })
         );
         if (res?.status) {
            await fetchUser();
         }
      } else {
         const res = await addAddress(
            JSON.stringify({
               name: editedData.name,
               contact: editedData.phone,
               address: editedData.address,
            })
         );
         if (res?.status) {
            await fetchUser();
         }
      }
      setIsEditing(false);
      setEditedData({ id: null, name: '', phone: '', address: '' });
   };
   return (
      <Container>
         {isEditing ? (
            <div className="edit-form-overlay">
               <div className="container-form">
                  <div className="edit-form">
                     <div className="row">
                        <div>Nhập tên</div>
                        <input
                           type="text"
                           placeholder="Tên"
                           value={editedData.name}
                           onChange={(e) =>
                              setEditedData({
                                 ...editedData,
                                 name: e.target.value,
                              })
                           }
                        />
                     </div>
                     <div className="row">
                        <div>Nhập số điện thoại</div>
                        <input
                           type="text"
                           placeholder="Số điện thoại"
                           value={editedData.phone}
                           onChange={(e) =>
                              setEditedData({
                                 ...editedData,
                                 phone: e.target.value,
                              })
                           }
                        />
                     </div>
                     <div className="row">
                        <div>Nhập địa chỉ</div>{' '}
                        <input
                           type="text"
                           placeholder="Địa chỉ"
                           value={editedData.address}
                           onChange={(e) =>
                              setEditedData({
                                 ...editedData,
                                 address: e.target.value,
                              })
                           }
                        />
                     </div>

                     <div className="row">
                        <div htmlFor="">Chọn tỉnh</div>

                        <select
                           className="custom-select"
                           onChange={(e) => {
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
                     </div>

                     <div className="row">
                        <div htmlFor="">Chọn huyện</div>

                        <select
                           className="custom-select"
                           onChange={(e) => {
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
                     </div>
                     <div className="row">
                        <div htmlFor="">Chọn xã</div>

                        <select className="custom-select">
                           <option value="">Chọn Xã</option>
                           {wards.map((ward, index) => (
                              <option key={index} value={ward.name}>
                                 {ward.name}
                              </option>
                           ))}
                        </select>
                     </div>
                     <div className="button-container">
                        <button onClick={() => handleSave()}>Lưu</button>
                     </div>
                     <AiOutlineClose
                        className="close-button"
                        onClick={() => {
                           setIsEditing(false);
                        }}
                     />
                  </div>
               </div>
            </div>
         ) : null}
         <nav className="header">
            <div>Địa chỉ của tôi</div>
            <div className="button" onClick={() => setIsEditing(true)}>
               Thêm địa chỉ mới
            </div>
         </nav>
         <div className="data">
            {data ? (
               <>
                  {data.map((da, index) => (
                     <div key={index} className="data-child">
                        <div className="infomation">
                           <div>
                              <b>{da.name}</b> | &nbsp; {da.phone}
                           </div>

                           <div>{da.address}</div>
                        </div>
                        <div>
                           <i
                              style={{ color: 'Highlight' }}
                              onClick={() => {
                                 handleEdit(da.id);
                              }}
                           >
                              Chính sửa &nbsp;
                           </i>
                           <i
                              style={{ color: 'Red' }}
                              onClick={() => {
                                 handleDelete(da.id);
                              }}
                           >
                              Xóa &nbsp;
                           </i>
                        </div>
                     </div>
                  ))}
               </>
            ) : null}
         </div>
      </Container>
   );
};
const Container = styled.div`
   .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid;
      padding: 0.675rem;
      * {
         font-size: 16px;
      }

      .button {
         user-select: none;
         cursor: pointer;
         background-color: #3c3cec;
         color: white;
         font-style: italic;
         border: none;
         padding: 10px 20px;
         border-radius: 4px;
         box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Tạo hiệu ứng bóng */
         transition: box-shadow 0.3s ease-in-out; /* Tạo transition khi hover */
      }

      .button:hover {
         box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2); /* Hiệu ứng bóng khi hover */
      }
   }

   .data {
      display: flex;
      flex-direction: column;

      .data-child {
         display: flex;
         justify-content: space-between;
         border: 1px solid #ccc;
         border-radius: 8px;
         padding: 10px;
         margin: 10px 0;
         background-color: #f2f2f2;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .infomation {
         flex: 1;
      }

      .infomation div {
         font-size: 1rem;
      }

      .infomation b {
         font-weight: bold;
      }

      .data-child i {
         cursor: pointer;
      }
   }
   .edit-form-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1000;
   }
   .container-form {
      background-color: white;
      margin-top: 15px;
      border-radius: 5px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
   }
   .edit-form {
      background-color: white;
      padding: 20px;
      max-width: 400px;
      width: 400px;
   }
   .edit-form > div {
      width: 100%;
   }

   .edit-form input,
   .edit-form select {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 3px;
   }

   .edit-form button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      justify-content: center;
   }

   .edit-form button:hover {
      background-color: #0056b3;
   }

   button {
      margin-top: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
   }

   .container button:hover {
      background-color: #0056b3;
   }
   .button-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
   }
   .close-button {
      position: absolute;
      top: 0.625rem;
      right: 0.625rem;
      color: red;
      cursor: pointer;
   }
   .row div:nth-child(1)::after {
      content: ' *';
      color: red;
   }
`;
export default Address;
