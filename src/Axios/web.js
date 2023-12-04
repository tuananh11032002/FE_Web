import axiosClient from './axiosClient';
import checkAndRenewToken from '../Token/token';

const END_POINT = {
   ADDRESS: 'address',
   CHAT: 'chat',
   COMMENT: 'comment',
   FILE: 'file',
   ORDER: 'order',
   PRODUCT: 'product',
   CATEGORY: 'category',
   USER: 'user',
};
// Address
//add
export const addAddress = async (address) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.post(`${END_POINT.ADDRESS}`, address, {
      headers: {
         'Content-Type': 'application/json',
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//update
export const updateAddress = async (address) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.put(`${END_POINT.ADDRESS}`, address, {
      headers: {
         'Content-Type': 'application/json',
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//delete
export const deleteAddress = async (id) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.delete(`${END_POINT.ADDRESS}/${id}`, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//get(id)
export const getAddress = (id) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.get(`${END_POINT.ADDRESS}/${id}`, {
      headers: {
         Authorization: token,
      },
   });
};
//get list
export const getListAddress = (data) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.post(`${END_POINT.ADDRESS}/list`, data, {
      headers: {
         Authorization: token,
      },
   });
};

// end Address

// Chat
//add
export const addChat = async (chat) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.post(`${END_POINT.CHAT}`, chat, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//get list group
export const getListGroup = async (data) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.post(`${END_POINT.CHAT}/list`, data, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//get message by group
export const getMessageByGroup = async (data) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.post(`${END_POINT.CHAT}/message`, data, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//get message by my group
export const getMessageByMyGroup = async (data) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.post(`${END_POINT.CHAT}/mine`, data, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
// end Chat

// Comment
//add
export const addComment = async (comment) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.post(`${END_POINT.COMMENT}`, comment, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//get list
export const getListComment = (data) => {
   return axiosClient.post(`${END_POINT.COMMENT}/list`, data);
};
// end Comment

// File
//add
export const addFile = async (files) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.post(`${END_POINT.FILE}`, files, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//delete
export const deleteFile = (id) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.delete(`${END_POINT.FILE}/${id}`, {
      headers: {
         Authorization: token,
      },
   });
};
//get(id)
export const getFile = (id) => {
   //require author
   return axiosClient.get(`${END_POINT.FILE}/${id}`);
};
// end File

// Order
//add
export const addOrder = async (order) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.post(`${END_POINT.ORDER}`, order, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//update
export const updateOrder = (id, body) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.put(`${END_POINT.ORDER}/${id}`, body, {
      headers: {
         Authorization: token,
      },
   });
};
//delete
export const deleteOrder = (id) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.delete(`${END_POINT.ORDER}/${id}`, {
      headers: {
         Authorization: token,
      },
   });
};
//get(id) order information
export const getOrder = async (id) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.get(`${END_POINT.ORDER}/${id}`, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//confirm order
export const confirmOrder = (id, body) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.put(`${END_POINT.ORDER}/cof/${id}`, body, {
      headers: {
         Authorization: token,
      },
   });
};
//finish order
export const finishOrder = (id) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.put(`${END_POINT.ORDER}/fin/${id}`, {
      headers: {
         Authorization: token,
      },
   });
};
//cancel order
export const cancelOrder = (id) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.put(`${END_POINT.ORDER}/can/${id}`, {
      headers: {
         Authorization: token,
      },
   });
};
//get list
export const getListOrder = (data) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.post(`${END_POINT.ORDER}/list`, data, {
      headers: {
         Authorization: token,
      },
   });
};
//get list by userId
export const getListOrderByUserId = async (userId, body) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.post(`${END_POINT.ORDER}/list/${userId}`, body, {
      headers: {
         'Content-Type': 'application/json',
         Authorization: token,
      },
   });
};
//get my list
export const getMyListOrder = async (data) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.post(`${END_POINT.ORDER}/listmine`, data, {
      headers: {
         'Content-Type': 'application/json',
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
// end Order

// Product
//add
export const addProduct = async (product) => {
   //require author
   const {token} = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res= axiosClient.post(`${END_POINT.PRODUCT}`, product, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//update
export const updateProduct = async (product) => {
   //require author
   const {token} = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res= axiosClient.put(`${END_POINT.PRODUCT}`, product, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//delete
export const deleteProduct = async (id) => {
   //require author
   const {token} = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res= axiosClient.delete(`${END_POINT.PRODUCT}/${id}`, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//get(id)
export const getProduct = (id) => {
   return axiosClient.get(`${END_POINT.PRODUCT}/${id}`);
};
//get list
export const getListProduct = (data) => {
   return axiosClient.post(`${END_POINT.PRODUCT}/list`, data);
};
//get list admin
export const getListProductForAdmin = (data) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.post(`${END_POINT.PRODUCT}/la`, data, {
      headers: {
         Authorization: token,
      },
   });
};
// end Product

// ProductCategory
//add
export const addCategory = async (category) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = axiosClient.post(`${END_POINT.CATEGORY}`, category, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//update
export const updateCategory = async (category) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = axiosClient.put(`${END_POINT.CATEGORY}`, category, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//delete
export const deleteCategory = async (id) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = axiosClient.delete(`${END_POINT.CATEGORY}/${id}`, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//get(id)
export const getCategory = (id) => {
   return axiosClient.get(`${END_POINT.CATEGORY}/${id}`);
};
//get list
export const getListCategory = (data) => {
   return axiosClient.post(`${END_POINT.CATEGORY}/list`, data);
};
//get list admin
export const getListCategoryForAdmin = (data) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.post(`${END_POINT.CATEGORY}/la`, data, {
      headers: {
         Authorization: token,
      },
   });
};
// end ProductCategory

// User
//register
export const register = (data) => {
   return axiosClient.post(`${END_POINT.USER}`, data);
};
//update profile
export const updateProfile = async (data) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.put(`${END_POINT.USER}`, data, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//login
export const login = (data) => {
   return axiosClient.post(`${END_POINT.USER}/lg`, data);
};
//List account
export const getListAccount = (data) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.post(`${END_POINT.USER}/list`, data, {
      headers: {
         Authorization: token,
      },
   });
};
//upload avatar
export const uploadAvatar = async (file) => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.post(`${END_POINT.USER}/pro/pic`, file, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//get avatar
export const getAvatar = () => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.get(`${END_POINT.USER}/pro/pic`, {
      headers: {
         Authorization: token,
      },
   });
};
//get account by id
export const getAccountById = (id) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.get(`${END_POINT.USER}/${id}`, {
      headers: {
         Authorization: token,
      },
   });
};
//delete account
export const deleteAccount = (id) => {
   //require author
   const token = JSON.parse(localStorage.getItem('webbanbalo_user'));
   return axiosClient.delete(`${END_POINT.USER}/${id}`, {
      headers: {
         Authorization: token,
      },
   });
};
//get account by token
export const getProfileByToken = async () => {
   //require author
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.get(`${END_POINT.USER}/pro`, {
      headers: {
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};
//get avatar by id
export const getAvatarById = (id) => {
   //require author
   return axiosClient.get(`${END_POINT.USER}/pro/pic/${id}`, {
      headers: {
         Authorization: JSON.parse(localStorage.getItem('webbanbalo_user')),
      },
   });
};

//get avatar by id
export const getAvatarByToken = () => {
   //require author
   return axiosClient.get(`${END_POINT.USER}/pro/pic`, {
      headers: {
         Authorization: localStorage.getItem('webbanbalo_user'),
      },
   });
};

// end User

export const getCategoryApi = () => {
   return axiosClient.get(`${END_POINT.CATEGORY}`);
};

export const getCategoryApiForAdmin = (search) => {
   return axiosClient.get(`${END_POINT.CATEGORY}/admin?search=${search}`);
};
export const createCategoryApi = (category) => {
   return axiosClient.post(`${END_POINT.CATEGORY}`, category, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   });
};
export const putCategory = (category) => {
   return axiosClient.put(`${END_POINT.CATEGORY}`, category, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   });
};
export const deleteCategoryApi = (categoryId) => {
   return axiosClient.delete(`${END_POINT.CATEGORY}/${categoryId}`, {
      headers: {
         'Content-Type': 'json/text',
      },
   });
};

export const getProductApiWithNameCategory = async (
   categoryId = -1,
   search = '',
   orderBy = '',

   pageSize = 10,
   pageIndex = 1
) => {
   return await axiosClient.get(`${END_POINT.PRODUCT}/get-with-category`, {
      params: {
         categoryId,
         search,
         orderBy,
         pageSize,
         pageIndex,
      },
   });
};

export const getProductApi = (
   search,
   orderBy,
   categoryId,
   stock,
   status,
   page,
   pageSize
) => {
   return axiosClient.get(`${END_POINT.PRODUCT}`, {
      params: {
         search,
         orderBy,
         categoryId,
         stock,
         status,
         page,
         pageSize,
      },
   });
};

export const getProductApiById = (id) => {
   return axiosClient.get(`${END_POINT.PRODUCT}/${id}`);
};
export const deleteProductApi = (id) => {
   return axiosClient.delete(`${END_POINT.PRODUCT}/${id}`);
};

export const createProductAPI = (productDto) => {
   return axiosClient.post(
      `${END_POINT.PRODUCT}/create-product-with-images`,
      productDto,
      {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }
   );
};

export const updateProductAPI = async (productId, productInput) => {
   console.log(productInput);
   return await axiosClient.put(
      `${END_POINT.PRODUCT}/update/${productId}`,
      productInput,
      {
         headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization: `Bearer ${yourAccessToken}`,
         },
      }
   );
};

export const AddProductIntoOrder = async (orderItemDto) => {
   try {
      // Tiếp tục với cuộc gọi axios sau khi đã cấp mới token
      const response = await axiosClient.post(
         `${END_POINT.ORDER}/${END_POINT.PRODUCT}`,
         orderItemDto,
         {
            headers: {
               Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem('webbanbalo_user')).token
               }`,
            },
         }
      );
      await checkAndRenewToken(response);
      return response;
   } catch (error) {
      // Xử lý lỗi ở đây nếu có
      console.error(
         'Lỗi trong quá trình kiểm tra và cấp mới token hoặc cuộc gọi axios:',
         error
      );
      throw error;
   }
};
export const ChangeStockApi = async (stock, productId) => {
   console.log('stock', stock);
   return await axiosClient.post(
      `${END_POINT.PRODUCT}/changeStock/${productId}?stock=${stock}`
   );
};

export const GetOrderAdminApi = async (search, pageIndex, pageSize) => {
   try {
      const token = JSON.parse(localStorage.getItem('webbanbalo_user'));

      const response = await axiosClient.get(
         `${END_POINT.ORDER}?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}`,
         {
            headers: {
               Authorization: token,
            },
         }
      );
      await checkAndRenewToken(response);
      return response;
   } catch (error) {
      console.error(
         'Lỗi trong quá trình kiểm tra và cấp mới token hoặc cuộc gọi axios:',
         error
      );
      throw error;
   }
};
// export const GetOrder = async () => {
//    try {
//       const token = JSON.parse(localStorage.getItem('webbanbalo_user'));

//       const response = await axiosClient.get(`${END_POINT.ORDER}/orderNow`, {
//          headers: {
//             Authorization: token,
//          },
//       });
//       await checkAndRenewToken(response);
//       return response;
//    } catch (error) {
//       console.error(
//          'Lỗi trong quá trình kiểm tra và cấp mới token hoặc cuộc gọi axios:',
//          error
//       );
//       throw error;
//    }
// };
export const ConfirmOrder = async (order) => {
   try {
      const token = JSON.parse(localStorage.getItem('webbanbalo_user'));

      const response = await axiosClient.put(
         `${END_POINT.ORDER}/payments`,
         order,
         {
            headers: {
               Authorization: token,
            },
         }
      );
      await checkAndRenewToken(response);
      return response;
   } catch (error) {
      console.error(
         'Lỗi trong quá trình kiểm tra và cấp mới token hoặc cuộc gọi axios:',
         error
      );
      throw error;
   }
};

export const DeleteProductIntoOrder = async (productid) => {
   const response = await axiosClient.delete(`${END_POINT.ORDER}`, {
      params: { productid },
      headers: {
         Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('webbanbalo_user')).token
         }`,
      },
   });
   await checkAndRenewToken(response);
   return response;
};

export const GetOrderDone = async ({ status, pageNow, pageSize }) => {
   try {
      const response = await axiosClient.get(
         `${END_POINT.ORDER}/${END_POINT.PRODUCT}/Done?pageSize=${pageSize}&pageIndex=${pageNow}&status=${status}`,
         {
            headers: {
               Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem('webbanbalo_user')).token
               }`,
            },
         }
      );
      await checkAndRenewToken(response);
      return response;
   } catch (error) {
      // Xử lý lỗi ở đây nếu có
      console.error(
         'Lỗi trong quá trình kiểm tra và cấp mới token hoặc cuộc gọi axios:',
         error
      );
      throw error; // Re-throw lỗi để cho phép code gọi GetProductIntoOrder xử lý lỗi tiếp theo
   }
};

export const GetOrderDetailAndCustomerInfo = async (orderId) => {
   return axiosClient.get(`${END_POINT.ORDER}/${orderId}`);
};
export const UpdateStatusOrder = async (orderId) => {
   return axiosClient.put(`${END_POINT.ORDER}/${orderId}`);
};
export const CancelOrder = async (orderId) => {
   try {
      const response = await axiosClient.put(
         `${END_POINT.ORDER}/cancel-order/${orderId}`,
         {
            headers: {
               Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem('webbanbalo_user')).token
               }`,
            },
         }
      );
      await checkAndRenewToken(response);
      return response;
   } catch (error) {
      console.error(
         'Lỗi trong quá trình kiểm tra và cấp mới token hoặc cuộc gọi axios:',
         error
      );
      throw error;
   }
};
export const getSalesRevenue = async (orderId) => {
   try {
      const response = await axiosClient.get(
         `${END_POINT.ORDER}/get-sale-revenue`,
         {
            headers: {
               Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem('webbanbalo_user')).token
               }`,
            },
         }
      );
      await checkAndRenewToken(response);
      return response;
   } catch (error) {
      console.error(
         'Lỗi trong quá trình kiểm tra và cấp mới token hoặc cuộc gọi axios:',
         error
      );
      throw error;
   }
};

export const DeleteOrder = async (orderId) => {
   try {
      const response = await axiosClient.delete(
         `${END_POINT.ORDER}/${orderId}`,
         {
            headers: {
               Authorization: JSON.parse(
                  localStorage.getItem('webbanbalo_user')
               ),
            },
         }
      );
      await checkAndRenewToken(response);
      return response;
   } catch (error) {
      console.error(
         'Lỗi trong quá trình kiểm tra và cấp mới token hoặc cuộc gọi axios:',
         error
      );
      throw error;
   }
};

export const getCoupon = async (coupon) => {
   return axiosClient.get(`${END_POINT.ORDER}/coupon?coupon=${coupon}`);
};
export const getVNPayLink = async (data) => {
   console.log(data);
   return axiosClient.post(`${END_POINT.PAYMENT}`, data);
};
export const getProdctFromCategoryApi = (id) => {
   return axiosClient.get(`${END_POINT.CATEGORY}/${id}/product`);
};
export const getCategoryApiById = (id) => {
   return axiosClient.get(`${END_POINT.CATEGORY}/${id}`);
};

export const delCATEGORYApi = (id) => {
   return axiosClient.delete(`${END_POINT.CATEGORY}/${id}`);
};

//Area user api
export const getUser = (search, pageIndex, pageSize, userRole, userStatus) => {
   return axiosClient.get(
      `${END_POINT.USER}?search=${search}&pageSize=${pageSize}&pageIndex=${pageIndex}&userRole=${userRole}&userStatus=${userStatus}`
   );
};
export const getUserWithId = (userId) => {
   return axiosClient.get(`${END_POINT.USER}/${userId}`);
};
export const updateUserInfo = async (infor) => {
   const { token } = JSON.parse(localStorage.getItem('webbanbalo_user'));
   const res = await axiosClient.put(`${END_POINT.USER}`, infor, {
      headers: {
         'Content-Type': 'application/json',
         Authorization: token,
      },
   });
   await checkAndRenewToken(res);
   return res;
};

export const updateUserInfoforAdmin = (infor) => {
   return axiosClient.put(`${END_POINT.USER}/for-admin`, infor, {
      headers: {},
   });
};
export const insertUserforAdmin = (infor) => {
   return axiosClient.post(`${END_POINT.USER}/add-user-for-admin`, infor, {
      headers: {},
   });
};
export const deleteUser = (userId) => {
   return axiosClient.delete(`${END_POINT.USER}/${userId}`);
};

export const Login = (infor) => {
   return axiosClient.post(`${END_POINT.USER}/Login`, infor);
};
export const Register = async (userInfor) => {
   return await axiosClient.post(`${END_POINT.USER}/AddUser`, {
      ...userInfor,
      id: 0,
   });
};
export const RenewToken = async (tokenModel) => {
   const data = await axiosClient.post(
      `${END_POINT.USER}/RenewToken`,
      tokenModel
   );
   return data;
};
export const ChangePasswordApi = async (data) => {
   try {
      // Tiếp tục với cuộc gọi axios sau khi đã cấp mới token
      const response = await axiosClient.put(
         `${END_POINT.USER}/change-password`,
         data,
         {
            headers: {
               Authorization: JSON.parse(
                  localStorage.getItem('webbanbalo_user')
               ),
            },
         }
      );
      await checkAndRenewToken(response);
      return response;
   } catch (error) {
      // Xử lý lỗi ở đây nếu có
      console.error(
         'Lỗi trong quá trình kiểm tra và cấp mới token hoặc cuộc gọi axios:',
         error
      );
      throw error;
   }
};
export const getCustomerApi = async (search, pageIndex, pageSize) => {
   console.log('search', search);

   const data = await axiosClient.get(
      `${END_POINT.USER}/get-customer-infor?search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`
   );
   return data;
};
export const getCustomerWithId = async (id) => {
   const data = await axiosClient.get(`${END_POINT.USER}/customer/${id}`);
   return data;
};

//areas message
export const getUserMessage = async () => {
   const response = await axiosClient.get(`${END_POINT.MESSAGE}/userList`, {
      headers: {
         Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('webbanbalo_user')).token
         }`,
      },
   });
   await checkAndRenewToken(response);
   return response;
};

export const getMessageWithUserId = async (receiverId) => {
   const response = await axiosClient.get(
      `${END_POINT.MESSAGE}/${receiverId}`,
      {
         headers: {
            Authorization: `Bearer ${
               JSON.parse(localStorage.getItem('webbanbalo_user')).token
            }`,
         },
      }
   );
   await checkAndRenewToken(response);
   return response;
};

export const InsertReview = (infor) => {
   return axiosClient.post(`${END_POINT.REVIEW}`, infor);
};
