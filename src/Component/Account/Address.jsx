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
      console.log('res user profile', res);
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
               <div className="edit-form">
                  <input
                     type="text"
                     placeholder="Tên"
                     value={editedData.name}
                     onChange={(e) =>
                        setEditedData({ ...editedData, name: e.target.value })
                     }
                  />
                  <input
                     type="text"
                     placeholder="Số điện thoại"
                     value={editedData.phone}
                     onChange={(e) =>
                        setEditedData({ ...editedData, phone: e.target.value })
                     }
                  />
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
                  <button onClick={() => handleSave()}>Lưu</button>
                  <AiOutlineClose
                     className="close-button"
                     onClick={() => {
                        setIsEditing(false);
                     }}
                  />
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
      justify-content: center;
      align-items: center;
      z-index: 1000;
   }

   .edit-form {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      width: 300px;
   }

   .edit-form input {
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
      border-radius: 3px;
      cursor: pointer;
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
   .close-button {
      position: absolute;
      top: 0.625rem;
      right: 0.625rem;
      color: red;
      cursor: pointer;
   }
`;
export default Address;
