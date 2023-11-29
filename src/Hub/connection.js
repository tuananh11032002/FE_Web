// src/services/signalRService.js
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
   .withUrl('http://backend.misaproject.click/hub', {
      accessTokenFactory: () => {
         const token = JSON.parse(
            localStorage.getItem('webbanbalo_user')
         ).token;
         return token;
      },
   })
   .build();
export default connection;
