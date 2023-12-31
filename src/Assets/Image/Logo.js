import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateProvider } from '../../StateProvider/StateProvider';

const Logo = () => {
   const navigate = useNavigate();
   const [{ user }] = useStateProvider();

   return (
      <>
         {user ? (
            <button
               onClick={() => {
                  user?.role === 'Admin'
                     ? navigate('/chat/null')
                     : navigate(`/chat/${user.id}`);
               }}
            >
               <svg
                  width="60px"
                  height="60px"
                  viewBox="0 0 60 60"
                  style={{
                     position: 'fixed',
                     zIndex: 2,
                     bottom: '20px',
                     right: '20px',
                  }}
               >
                  <svg x="0" y="0" width="60px" height="60px">
                     <defs>
                        <linearGradient
                           x1="50%"
                           y1="0%"
                           x2="50%"
                           y2="100%"
                           id="linearGradient-1"
                        >
                           <stop stopColor="#00B2FF" offset="0%"></stop>
                           <stop stopColor="#006AFF" offset="100%"></stop>
                        </linearGradient>
                     </defs>
                     <g
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                     >
                        <g>
                           <circle
                              fill="#FFFFFF"
                              cx="30"
                              cy="30"
                              r="30"
                           ></circle>
                           <svg x="10" y="10">
                              <g>
                                 <rect
                                    id="container"
                                    x="0"
                                    y="0"
                                    width="40"
                                    height="40"
                                 ></rect>
                                 <g id="logo">
                                    <path
                                       d="M20,0 C8.7334,0 0,8.2528 0,19.4 C0,25.2307 2.3896,30.2691 6.2811,33.7492 C6.6078,34.0414 6.805,34.4513 6.8184,34.8894 L6.9273,38.4474 C6.9621,39.5819 8.1343,40.3205 9.1727,39.8621 L13.1424,38.1098 C13.4789,37.9612 13.856,37.9335 14.2106,38.0311 C16.0348,38.5327 17.9763,38.8 20,38.8 C31.2666,38.8 40,30.5472 40,19.4 C40,8.2528 31.2666,0 20,0"
                                       id="bubble"
                                       fill="url(#linearGradient-1)"
                                    ></path>
                                    <path
                                       d="M7.99009,25.07344 L13.86509,15.75264 C14.79959,14.26984 16.80079,13.90064 18.20299,14.95224 L22.87569,18.45674 C23.30439,18.77834 23.89429,18.77664 24.32119,18.45264 L30.63189,13.66324 C31.47419,13.02404 32.57369,14.03204 32.00999,14.92654 L26.13499,24.24744 C25.20039,25.73014 23.19919,26.09944 21.79709,25.04774 L17.12429,21.54314 C16.69559,21.22164 16.10569,21.22334 15.67879,21.54734 L9.36809,26.33674 C8.52579,26.97594 7.42629,25.96794 7.99009,25.07344"
                                       id="bolt"
                                       fill="#FFFFFF"
                                    ></path>
                                 </g>
                              </g>
                           </svg>
                        </g>
                     </g>
                  </svg>
               </svg>
            </button>
         ) : null}
      </>
   );
};

export default Logo;
