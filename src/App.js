import styled from 'styled-components';
import Home from './Page/Home';
import Test from './Component/Tam';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import ProductDetail from './Component/Body/ProductDetail';
import WebSocket from './AppSocket';
import PayPage from './Page/PayPage';
import About from './Page/About';
import Membership from './Page/Membership';
import Address from './Page/Address';
import Slide from './Page/Slide';
import './AppTransition.css';
import LoginPage from './Page/Login';
import { useStateProvider } from './StateProvider/StateProvider';
import { useEffect, useState } from 'react';
import { reducerCases } from './StateProvider/reducer';
import ProfileAccount from './Page/ProfileAccount';
import AddressAccount from './Page/AddressAccount';
import { OrderAccount, OrderDetail } from './Page/OrderAccount';
//import * as signalR from '@microsoft/signalr';
import Hub from './Hub/connection';
import ProductListPage from './AdminPage/Page/ProductListPage';
import ChatPage from './AdminPage/Page/ChatPage';
import CategoryListPage from './AdminPage/Page/CategoryListPage';
import OrderListPage from './AdminPage/Page/OrderListPage';
import UserListPage from './AdminPage/Page/UserListPage';
import CustomerListPage from './AdminPage/Page/CustomerListPage';
import AddProductPage from './AdminPage/Page/AddProductPage';
import CustomerDetailPage from './AdminPage/Page/CustomerDetailPage';
import DetailOrderPage from './AdminPage/Page/DetailOrderPage';
import NotFound from './Page/NotFound';
import AccountDetailPage from './AdminPage/Page/AccountDetailPage';
import RegistrationPage from './Page/RegistrationPage';
import PaymentInfo from './Page/PaymentInfo';
import PasswordAccount from './Page/PasswordAccount';
import PermissionDenied from './Component/Body/PermissionDenied ';
import DiscountPage from './AdminPage/Page/DiscountPage';

function App() {
   const [isUserReady, setIsUserReady] = useState(false);
   const [{ user, connection }, dispatch] = useStateProvider();
   const UserRoute = (props) => {
      //console.log('props', props);
      if (user) {
         return props.children;
      } else {
         return <PermissionDenied />;
      }
   };

   const AdminRoute = (props) =>
      user && user?.role.toLowerCase() === 'admin' ? (
         props.children
      ) : (
         <PermissionDenied />
      );
   // useEffect(() => {
   //    setIsUserReady(true);
   // }, [user]);
   useEffect(() => {
      console.log('abc');
      if (connection === null || connection.state === 'Disconnected') {
         Hub.startConnection();
         dispatch({
            connection: Hub.connection,
            type: reducerCases.SET_CONNECTIONHUB,
         });
      }
      return () => {
         if (connection != null) {
            Hub.Disconnect();
            dispatch({
               connection: null,
               type: reducerCases.SET_CONNECTIONHUB,
            });
         }
      };
   }, [connection]);

   return (
      <Container>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Slide child={<Home />} />}></Route>
               <Route
                  path="/products"
                  element={<Slide child={<Home />} />}
               ></Route>
               <Route
                  path="/products/:productId"
                  element={<Slide child={<ProductDetail />} />}
               ></Route>
               <Route
                  path="/collections/:id"
                  element={<Slide child={<Home />} />}
               ></Route>

               <Route
                  path="/pay-method"
                  element={<Slide child={<PaymentInfo />} />}
               ></Route>

               {/* <Route
                     path="/cart"
                     element={
                        <UserRoute>
                           <Slide child={<Cart />} />
                        </UserRoute>
                     }
                  ></Route> */}
               <Route
                  path="/pay"
                  element={
                     <UserRoute>
                        <PayPage />
                     </UserRoute>
                  }
               ></Route>

               <Route
                  path="/about-us"
                  element={<Slide child={<About />} />}
               ></Route>
               <Route
                  path="/membership"
                  element={<Slide child={<Membership />} />}
               ></Route>
               <Route
                  path="/address"
                  element={<Slide child={<Address />} />}
               ></Route>

               <Route
                  path="/account/address"
                  element={
                     <UserRoute>
                        <AddressAccount />
                     </UserRoute>
                  }
               />
               <Route
                  path="/account/profile"
                  element={
                     <UserRoute>
                        <ProfileAccount />
                     </UserRoute>
                  }
               />
               <Route
                  path="/account/order"
                  exact
                  element={
                     <UserRoute>
                        <OrderAccount />
                     </UserRoute>
                  }
               />
               <Route
                  path="/account/order/:id"
                  element={
                     <UserRoute>
                        <OrderDetail />
                     </UserRoute>
                  }
               />
               <Route
                  path="/login"
                  element={<>{user ? <Navigate to="/" /> : <LoginPage />}</>}
               />
               <Route
                  path="/register"
                  element={
                     <>{user ? <Navigate to="/" /> : <RegistrationPage />}</>
                  }
               />
               <Route
                  path="/account/address"
                  element={
                     <UserRoute>
                        <AddressAccount />
                     </UserRoute>
                  }
               />
               <Route
                  path="/account/profile"
                  element={
                     <UserRoute>
                        <ProfileAccount />
                     </UserRoute>
                  }
               />
               <Route
                  path="/account/order"
                  exact
                  element={
                     <UserRoute>
                        <OrderAccount />
                     </UserRoute>
                  }
               />
               <Route
                  path="/account/order/:id"
                  element={
                     <UserRoute>
                        <OrderDetail />
                     </UserRoute>
                  }
               />

               <Route
                  path="/account/change-password"
                  element={
                     <UserRoute>
                        <PasswordAccount />
                     </UserRoute>
                  }
               />

               <Route
                  path="/chat/:id"
                  element={
                     <UserRoute>
                        <Slide child={<WebSocket />} />
                     </UserRoute>
                  }
               />

               <Route
                  path="/admin"
                  element={
                     <AdminRoute>
                        <Slide child={<ProductListPage />} />
                     </AdminRoute>
                  }
               />
               <Route
                  path="/admin/chat"
                  element={
                     <AdminRoute>
                        <Slide child={<ChatPage />} />
                     </AdminRoute>
                  }
               />
               <Route
                  path="/admin/order-list"
                  element={
                     <AdminRoute>
                        <Slide child={<OrderListPage />} />
                     </AdminRoute>
                  }
               />
               <Route
                  path="/admin/category-list"
                  element={
                     <AdminRoute>
                        <Slide child={<CategoryListPage />} />
                     </AdminRoute>
                  }
               />
               <Route
                  path="/admin/user-list"
                  element={
                     <AdminRoute>
                        <Slide child={<UserListPage />} />
                     </AdminRoute>
                  }
               />
               <Route
                  path="/admin/customer-list"
                  element={
                     <AdminRoute>
                        <Slide child={<CustomerListPage />} />
                     </AdminRoute>
                  }
               />

               <Route
                  path="/admin/add-product/:id"
                  element={
                     <AdminRoute>
                        <Slide child={<AddProductPage />} />
                     </AdminRoute>
                  }
               />
               <Route
                  path="/admin/customer-detail/:id"
                  element={
                     <AdminRoute>
                        <Slide child={<CustomerDetailPage />} />
                     </AdminRoute>
                  }
               />
               <Route
                  path="/admin/order-detail/:id"
                  element={
                     <AdminRoute>
                        <Slide child={<DetailOrderPage />} />
                     </AdminRoute>
                  }
               />
               <Route path="/test123" element={<Test />} />

               <Route
                  path="/admin/account-detail/:id"
                  element={
                     <AdminRoute>
                        <Slide child={<AccountDetailPage />} />
                     </AdminRoute>
                  }
               />
               <Route
                  path="/admin/discount"
                  element={
                     <AdminRoute>
                        <Slide child={<DiscountPage />} />
                     </AdminRoute>
                  }
               />
               <Route path="*" element={<Slide child={<NotFound />} />} />
            </Routes>
         </BrowserRouter>
      </Container>
   );
}
const Container = styled.div`
   height: 100vh;
   width: 100vw;
`;
export default App;
