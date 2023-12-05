import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { updateOrder, getProduct, getListComment } from '../../Axios/web';
import { VscLoading } from 'react-icons/vsc';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useStateProvider } from '../../StateProvider/StateProvider';
import { reducerCases } from '../../StateProvider/reducer';
import { useLocation } from 'react-router-dom';
import processApiImagePath from '../../Helper/EditLinkImage';
import ReviewList from './ReviewList';
import RatingStars from './RatingStar';

const ProductDetail = () => {
   const [{ productdetail, cart, user, connection }, dispatch] =
      useStateProvider();
   const navigate = useNavigate();
   const { productId } = useParams();
   const { pathname } = useLocation();

   const [count, setCount] = useState(1);
   //const [isAdd, setIsAdd] = useState(true);
   const [loading, setLoading] = useState(false);
   const [productReview, setProductReview] = useState([]);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, [pathname]);

   const SaveData = async (productdetail) => {
      let cartdetail = cart?.detail?.map((item) => ({
         productId: item.productId,
         itemCount: item.itemCount,
      }));

      if (user) {
         setLoading(true);
         let cartproduct = cartdetail?.find(
            (item) => item.productId === productdetail.id
         );
         if (cartproduct) {
            cartproduct.itemCount = cartproduct.itemCount + count;
            cartdetail = cartdetail.filter(
               (item) => item.productId !== productdetail.id
            );
            cartdetail = [cartproduct, ...cartdetail];
         } else {
            cartdetail = [
               {
                  productId: productdetail?.id,
                  itemCount: count,
               },
               ...cartdetail,
            ];
         }
         const response = await updateOrder(cart?.id, {
            orderDetail: cartdetail,
         });
         //const dataApi = await getOrder(user.newOrderId);
         // if (dataApi.status) {
         //    if (JSON.stringify(dataApi.result) !== JSON.stringify(cart)) {
         //       dispatch({
         //          type: reducerCases.SET_CART,
         //          cart: dataApi.result.data.order.detail,
         //       });
         //    }
         // }
         setLoading(false);
         if (response?.status) {
            dispatch({
               type: reducerCases.SET_CART,
               cart: 1,
            });
            toast.info('Thêm thành công', {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 1000,
            });
         } else {
            toast.error(`${response.result}`, {
               position: toast.POSITION.TOP_CENTER,
               autoClose: 3000,
            });
         }

         //setIsAdd(!isAdd);
      } else {
         navigate('/login');
      }
   };
   const handlerClick = (e) => {
      //e.stopPropagation();
      if (user) {
         SaveData(productdetail);
      } else {
         toast.info('Bạn cần đăng nhập', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
         });
      }
   };
   useEffect(() => {
      const fetchData = async () => {
         if (connection) {
            connection.on('Received', async (Receive) => {
               setProductReview((pre) => [Receive.message, ...pre]);
            });

            connection.invoke('Join', productId);
         }
         const dataDetail = await getProduct(productId);
         if (dataDetail?.status) {
            if (productdetail !== dataDetail.result) {
               let dataP = dataDetail.result.product;
               const dataComment = await getListComment({
                  index: 5,
                  page: 1,
                  productId: dataP.id,
               });
               if (dataComment?.status) {
                  setProductReview(dataComment.result.commentList);
               }
               dispatch({
                  type: reducerCases.SET_PRODUCTDETAIL,
                  productdetail: dataP,
               });
            }
         }
      };
      fetchData();
      return () => {
         if (connection) {
            connection.off('Received');
         }
      };
   }, [productId]);

   return (
      <div>
         <ToastContainer />
         <Header />
         <Container>
            <div className="body">
               <div className="productdetail__image">
                  <img
                     src={processApiImagePath(productdetail?.files[0]) || null}
                  />
               </div>
               <div className="productdetail__infor">
                  <div
                     style={{
                        fontSize: '2rem',
                        borderBottom: '1px solid black',
                     }}
                  >
                     {productdetail?.name}
                  </div>
                  <div className="price-container">
                     {productdetail?.discount === 0 ? (
                        <div className="price">
                           {productdetail?.unitPrice.toLocaleString() || 0} vnđ
                        </div>
                     ) : (
                        <div>
                           <div className="price">
                              {(
                                 productdetail?.unitPrice -
                                 productdetail?.discount
                              ).toLocaleString() || 0}{' '}
                              vnđ
                           </div>
                           <div className="original-price">
                              {productdetail?.unitPrice.toLocaleString() || 0}{' '}
                              vnđ
                           </div>
                        </div>
                     )}
                     <div className="rating">
                        <RatingStars
                           rating={productdetail?.rating || 0}
                           totalRating={productdetail?.totalRating || 0}
                        />
                     </div>
                  </div>
                  <div className="introduce">
                     Chẳng ai muốn phải lục tìm món đồ mình cần trong một chiếc
                     balo. Để chuẩn bị cho hành trang gọn gàng, sắp xếp mọi thứ
                     tối ưu hơn thì bạn không thể bỏ lỡ Slash Backpack. Rung
                     động trong thiết kế ngăn đa dạng và thể tích chứa lớn, sẵn
                     sàng giúp bạn tự tin gói gọn nhiều món đồ cần mang theo.
                  </div>
                  <br />
                  <label>
                     THÔNG TIN SẢN PHẨM:{' '}
                     {productdetail?.decription ||
                        `Chất liệu: Vải Polyester Canvas cao cấp
                     trượt nước Kích thước: 42cm x 32cm x 16cm Bao gồm 12 ngăn:
                     1 ngăn chống sốc, 3 ngăn lớn, 5 ngăn phụ, 2 ngăn bên hong,
                     1 ngăn phụ phía sau Ngăn chống sốc đựng vừa laptop 15.6
                     inch`}
                  </label>

                  <div className="quantity-container">
                     <span className="quantity-label">Số lượng:</span>
                     <div className="total">
                        <button
                           className="add"
                           onClick={() => setCount(Math.max(1, count - 1))}
                        >
                           -
                        </button>
                        <div className="count-container">
                           <input
                              className="count"
                              value={count}
                              type="number"
                              onChange={(e) => {
                                 setCount(
                                    e.target.value > productdetail?.totalItem
                                       ? productdetail?.totalItem
                                       : e.target.value < 1
                                       ? 1
                                       : e.target.value
                                 );
                              }}
                           />
                        </div>
                        <button
                           className="add"
                           onClick={() =>
                              setCount(
                                 count + 1 > productdetail?.totalItem
                                    ? productdetail?.totalItem
                                    : count + 1
                              )
                           }
                        >
                           +
                        </button>
                     </div>

                     <div className="quantity-label">
                        {productdetail?.totalItem} sản phẩm có sẵn
                     </div>
                  </div>

                  <div className="button-parent">
                     {productdetail?.totalItem !== 0 ? (
                        <>
                           <div
                              className="button"
                              onClick={() => {
                                 handlerClick();
                              }}
                           >
                              <span> Thêm vào giỏ hàng</span>
                              {loading ? (
                                 <span className="loading-icons">
                                    <VscLoading />
                                 </span>
                              ) : null}
                           </div>
                           {/*<div
                              className="button red"
                              onClick={() => {
                                 navigate('/pay');
                              }}
                           >
                              Mua ngay
                           </div>*/}
                        </>
                     ) : (
                        <div
                           className="button"
                           style={{
                              backgroundColor: 'red',
                           }}
                        >
                           Hàng tạm hết
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </Container>
         <ReviewList reviews={productReview} />
         <div>
            <Footer />
         </div>
      </div>
   );
};
const Container = styled.div`
   max-width: 100%;
   box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
   background-color: #ffffff;
   overflow: hidden;
   padding: 20px;
   .body {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      padding: 0 20px;
   }
   .red {
      background-color: red;
      color: white;
   }
   .color {
      display: inline-block;
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 50%;
   }
   .button-parent {
      display: flex;
      margin-top: 20px;
      .button {
         cursor: pointer;
         padding: 10px 20px;
         background-color: #3498db;
         color: #fff;
         border: none;
         border-radius: 4px;
         font-size: 1rem;
         transition: background-color 0.3s;
         text-align: center;
         display: flex;
         align-items: center;
         justify-content: center;
         margin-right: 10px;
      }

      .button.red {
         background-color: #e74c3c;
      }

      .button.red:hover {
         background-color: red;
      }
      .button:hover {
         background-color: #2980b9;
      }
   }

   .productdetail__infor {
      flex: 0.5;
   }
   .productdetail__image {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 50%;
   }
   .productdetail__image img {
      width: 350px;
      height: 350px;
      object-fit: contain;
      border-radius: 10px;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
   }
   .productdetail__infor .price-container {
      display: flex;
      align-items: center;
   }
   .price-container > .price {
      color: red;
      font-weight: bold;
      font-size: 20px;
      padding: 10px;
   }
   .price-container > .original-price {
      text-decoration: line-through;
      color: #999;
   }
   .price-container .rating {
      display: flex;
      align-items: center;
      padding: 10px;
   }
   .price-container .rating .div {
      margin: 0 5px;
   }
   .quantity-container {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .quantity-label {
         font-size: 1.2rem;
         margin-right: 10px;
      }

      .total {
         display: flex;
         align-items: center;
      }

      .count-container {
         background-color: #f2f2f2;
         border: 1px solid #ccc;
         border-radius: 4px;
         padding: 5px 10px;
         display: flex;
         align-items: center;
      }

      .count {
         background-color: #f2f2f2;
         border: none;
         outline: none;
         font-size: 1.2rem;
         margin: 0 10px;
         max-width: 50px;
      }

      .add {
         width: 30px;
         height: 30px;
         background-color: #3498db;
         color: #fff;
         border: none;
         cursor: pointer;
         font-weight: bold;
         font-size: 1.2rem;
         display: flex;
         justify-content: center;
         align-items: center;
         border-radius: 50%;
         margin: 0 10px;
      }

      .add:hover {
         background-color: #2980b9;
      }
   }
   .loading-icons {
      margin-left: 10px;
   }
   .loading-icons svg {
      animation: spin 2s linear infinite;
   }
   @media screen and (max-width: 756px) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .productdetail__image {
         flex: none;
         width: 100%;
      }
      .productdetail__image img {
         object-fit: cover;
      }
      .productdetail__infor {
         flex: 1;
      }
   }
   @media screen and (max-width: 950px) {
      .productdetail__image {
         flex: 0.5;
      }
   }
   @media screen and (max-width: 765px) {
      .body {
         padding: 0;
      }
      img {
         padding: 0 20px;
      }
      .productdetail__image,
      .productdetail__infor {
         min-width: 100%;
      }
   }
`;

export default ProductDetail;
