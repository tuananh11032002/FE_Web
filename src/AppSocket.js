import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useStateProvider } from './StateProvider/StateProvider';
import {
   getMessageByMyGroup,
   getMessageByGroup,
   getListGroup,
   addChat,
} from './Axios/web';
import { FcHome } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from './AdminPage/Admin';
import { ToastContainer, toast } from 'react-toastify';

function App() {
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const [userList, setUserList] = useState([]);
   const [selectedUser, setSelectedUser] = useState(null);
   const [isOpenUser, setIsOpenUser] = useState(false);

   const messageListRef = useRef(null);
   const inputRef = useRef(null);
   const navigate = useNavigate();
   const [{ connection, user }] = useStateProvider();
   const [dataContext, setDataContext] = useState({
      closeMenu: null,
      occupy: null,
   });

   const contextTemp = useContext(AdminContext);

   //UI
   useEffect(() => {
      if (contextTemp) {
         setDataContext({
            closeMenu: contextTemp.closeMenu,
            occupy: contextTemp.occupy,
         });
      }
   }, []);

   //get user message
   useEffect(() => {
      const getUser = async () => {
         if (user.role === 'Admin') {
            connection.invoke('Join', 'Admin');
            const response = await getListGroup({
               page: 1,
               index: 1000,
            });
            if (response?.status) {
               const temp = [...response.result.data.rooms].sort(
                  (a, b) =>
                     new Date(b?.message?.createdDate ?? '1000-1-1') -
                     new Date(a?.message?.createdDate ?? '1000-1-1')
               );
               setUserList(temp);
               if (temp.length > 0) {
                  setSelectedUser(temp[0]);
               }
            }
         } else {
            connection.invoke('Join', user.id);
            setSelectedUser({
               id: user.id,
               name: user.name,
               message: null,
            });
         }
      };
      getUser();
      return () => {
         if (connection) {
            if (user.role === 'Admin') {
               connection.invoke('Leave', 'Admin');
            } else {
               connection.invoke('Leave', user.id);
            }
         }
      };
   }, [user]);

   //get message with userid
   useEffect(() => {
      const getMessage = async () => {
         if (user.role === 'Admin') {
            if (selectedUser) {
               const response = await getMessageByGroup({
                  id: selectedUser.id,
                  index: 10000,
                  page: 1,
               });
               if (response?.status) {
                  setMessages(
                     response?.result?.data?.chatline.map((item) => ({
                        sendedUser: item.sendedUser,
                        content: item.description,
                     }))
                  );
               }
            }
         } else {
            const response = await getMessageByMyGroup({
               index: 10000,
               page: 1,
            });
            if (response?.status) {
               setMessages(
                  response?.result?.data?.chatline.map((item) => ({
                     sendedUser: item.sendedUser,
                     content: item.description,
                  }))
               );
            }
         }
      };
      getMessage();
   }, [selectedUser]);

   //scroll
   useEffect(() => {
      if (messageListRef.current) {
         messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
   }, [messages]);

   //connect server hub
   useEffect(() => {
      // Đăng ký lắng nghe sự kiện từ Hub
      //console.log('cone', connection);

      if (connection) {
         connection.on('Received', async (Receive) => {
            console.log('Received :', Receive);
            console.log('selectedUser :', selectedUser);
            if (
               user.role !== 'Admin' ||
               Receive?.message?.value?.sendedUser === selectedUser?.id
            ) {
               console.log('abc');
               setMessages((pre) => [...pre, Receive.message.value]);
            } else if (user.role === 'Admin') {
               const response = await getListGroup({
                  page: 1,
                  index: 10000,
               });
               if (response?.status) {
                  const temp = [...response.result.data.rooms].sort(
                     (a, b) =>
                        new Date(b?.message?.createdDate ?? '1000-1-1') -
                        new Date(a?.message?.createdDate ?? '1000-1-1')
                  );
                  setUserList(temp);
                  if (temp.length > 0) {
                     setSelectedUser(
                        temp.find((item) => item.id === selectedUser?.id)
                     );
                  }
               }
            }
         });
      }

      return () => {
         if (connection) {
            connection.off('Received');
         }
      };
   }, [connection]);

   const handleInputChange = (e) => {
      setNewMessage(e.target.value);
   };

   const handleSubmit = async () => {
      if (newMessage.trim() !== '') {
         const res = await addChat({
            userId: user.role === 'Admin' ? selectedUser.id : user.id,
            description: newMessage,
         });
         if (res?.status) {
            const sendmess = {
               type: user.role === 'Admin' ? 1 : 0,
               groupid: user.role === 'Admin' ? selectedUser.id : 'Admin',
               value: { sendedUser: user.id, content: newMessage },
            };
            setNewMessage('');
            setMessages((pre) => [...pre, sendmess.value]);
            connection.invoke('SendToGroup', sendmess, sendmess.groupid);
         } else {
            toast.info(res?.result, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 1000,
            });
         }
      }
      if (inputRef.current) {
         inputRef.current.focus();
      }
   };
   const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
         handleSubmit();
      }
   };
   function calculateTimeDifference(lastMessageSentTimeString) {
      // Kiểm tra xem chuỗi có đúng định dạng không
      // const dateRegex = /^(\d{2}:\d{2}:\d{2} \d{2}\/\d{2}\/\d{4})$/;
      // if (!dateRegex.test(lastMessageSentTimeString)) {
      //    return 'Invalid date format';
      // }

      // // Tách thông tin thời gian và ngày
      // const [time, date] = lastMessageSentTimeString.split(' ');
      // const [hours, minutes, seconds] = time.split(':');
      // const [day, month, year] = date.split('/');

      // Tạo đối tượng Date
      // const lastMessageSentTime = new Date(
      //    year,
      //    month - 1,
      //    day,
      //    hours,
      //    minutes,
      //    seconds
      // );
      if (!lastMessageSentTimeString) {
         return ``;
      }
      const lastMessageSentTime = new Date(lastMessageSentTimeString);
      const currentTime = new Date();

      const timeDifferenceInSeconds = Math.floor(
         (currentTime - lastMessageSentTime) / 1000
      );

      if (timeDifferenceInSeconds < 60) {
         return `${timeDifferenceInSeconds}m ago`;
      } else if (timeDifferenceInSeconds < 3600) {
         const minutes = Math.floor(timeDifferenceInSeconds / 60);
         return `${minutes}m ago`;
      } else if (timeDifferenceInSeconds < 86400) {
         const hours = Math.floor(timeDifferenceInSeconds / 3600);
         const remainingMinutes = Math.floor(
            (timeDifferenceInSeconds % 3600) / 60
         );

         if (remainingMinutes === 0) {
            return `${hours}h ago`;
         } else {
            return `${hours}h${remainingMinutes} ago`;
         }
      } else {
         const days = Math.floor(timeDifferenceInSeconds / 86400);
         return `${days} day${days > 1 ? 's' : ''} ago`;
      }
   }

   const handleUserClick = async (userclick) => {
      console.log('selectedUser 1 :', selectedUser);
      console.log('userclick :', userclick);
      await setSelectedUser(userclick);
      console.log('selectedUser 2 :', selectedUser);
      if (isPhone && isOpenUser) {
         setIsOpenUser(false);
      }
   };
   const [isPhone, setIsPhone] = useState(window.innerWidth < 756);

   useEffect(() => {
      const handleResize = () => {
         setIsPhone(window.innerWidth <= 756);
      };

      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);

   return (
      <>
         <ToastContainer />
         <Container height={dataContext.occupy}>
            {user.role === 'Admin' && (
               <div className={`user ${isOpenUser ? 'show-user' : null}`}>
                  {userList?.map((usertemp, index) => {
                     return (
                        <div
                           className={`user-single ${
                              selectedUser?.Id == usertemp.Id ? 'selected' : ''
                           }`}
                           key={index}
                           onClick={() => {
                              handleUserClick(usertemp);
                           }}
                           style={
                              usertemp.id === selectedUser.id
                                 ? { backgroundColor: '#808080' }
                                 : { backgroundColor: '#DCDCDC' }
                           }
                        >
                           <img
                              src={`http://backend.misaproject.click/api/user/pro/pic/${usertemp.id}`}
                              alt="Account Image"
                              width="48px"
                              height="48px"
                           />
                           <div>
                              <div className="userName">{usertemp.name}</div>
                              <div className="lastMessageTime">
                                 {calculateTimeDifference(
                                    usertemp?.message?.createdDate
                                 )}
                              </div>
                              <div className="lastMessage">
                                 {usertemp?.message?.description}
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}

            <div className="chat-box">
               <div className="action">
                  {isPhone ? (
                     <div
                        className={`container-bar`}
                        onClick={() => setIsOpenUser(!isOpenUser)}
                     >
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                     </div>
                  ) : null}
                  <FcHome
                     onClick={() => {
                        navigate('/');
                     }}
                  />
               </div>
               <div
                  className="message-list"
                  ref={messageListRef}
                  style={{ backgroundColor: '#EEEEEE' }}
               >
                  {messages?.map((message, index) => (
                     <div
                        key={index}
                        className={`message ${
                           message.sendedUser == user.id ? 'you' : 'other'
                        }`}
                     >
                        {message.content}
                     </div>
                  ))}
               </div>
               <div className="message-input">
                  <input
                     type="text"
                     placeholder="Nhập tin nhắn..."
                     value={newMessage}
                     onChange={handleInputChange}
                     ref={inputRef}
                     onKeyDown={handleKeyDown}
                  />
                  <button onClick={handleSubmit}>Gửi</button>
               </div>
            </div>
         </Container>
      </>
   );
}
const Container = styled.div`
   display: flex;
   justify-content: center;
   height: ${(props) => (props.height != null ? `${100 - 20}vh` : '100vh')};

   max-height: 100%;
   background-color: white;
   width: 100%;
   /* CSS cho lớp cha 'user' */
   .user {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 5px;
      margin-right: 10px;
      max-width: 300px;
      /* CSS cho lớp con 'user-single' */
      .user-single {
         display: flex;
         align-items: flex-start;
         margin-bottom: 10px;
         padding: 10px;
         border: 1px solid #ccc;
         transition: background-color 0.2s; /* Hiệu ứng màu nền */
         width: 100%;
         border-radius: 5px;
         user-select: none;
      }

      .user-single:hover {
         background-color: #f0f0f0; /* Màu nền khi hover */
      }

      .user-single img {
         margin-right: 10px;
         border-radius: 50%;
         width: 40px;
         height: 40px;
         object-fit: contain;
      }

      .user-single > div {
         display: flex;
         flex-direction: column;
         width: 100%;
      }

      .user-single .userName {
         font-weight: bold;
      }

      .user-single .lastMessageTime {
         font-size: 0.8em;
         color: #888;
      }

      .user-single .lastMessage {
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
         max-width: 70%;
      }
      .selected {
         background-color: #f0f0f0;
      }
   }

   .chat-box {
      flex: 1;
      border: 1px solid #ccc;
      padding: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      flex-direction: column; /* Hiển thị tin nhắn từ trên xuống dưới */
      height: 100%;
      .action {
         display: flex;
         align-items: center;
      }
      .container-bar {
         margin-right: 10px;
      }
      .bar {
         height: 3px;
         width: 25px;
         background-color: black;
         margin: 3px 0;
      }
      .message-list {
         flex: 1; /* Đặt chiều cao tự động */
         display: flex;
         flex-direction: column;
         overflow-y: auto;
      }

      .message-list-inner {
         flex: 1; /* Để tin nhắn lấp đầy chiều cao còn trống */
         padding: 16px;
         overflow-y: auto;
      }

      .message {
         background-color: #f1f0f0;
         padding: 8px;
         margin-bottom: 8px;
         border-radius: 4px;
      }

      /* Định dạng tin nhắn của bạn (you) */
      .message.you {
         align-self: flex-end;
         background-color: #0099ff;
         color: white;
      }
      .message.other {
         align-self: flex-start;
         color: white;
         background-color: black;
         width: auto;
      }

      .message-input {
         display: flex;
         align-items: center;
         padding: 16px;
         background-color: #f1f0f0;
         border-top: 1px solid #ccc; /* Thêm đường kẻ trên cùng */
      }
   }

   input[type='text'] {
      flex: 1;
      padding: 8px;
      border: none; /* Loại bỏ đường biên của input */
   }

   button {
      background-color: #0099ff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
   }
   svg {
      height: 40px;
      width: 40px;
   }
   @media screen and (max-width: 756px) {
      height: ${(props) =>
         props.height != null ? `${props.height - 50}px` : '90vh'};
      .user {
         display: none;
      }
      .show-user {
         background-color: white;
         display: flex;
         z-index: 1;
         max-width: 50%;
      }
      .chat-box {
      }
   }
`;
export default App;
