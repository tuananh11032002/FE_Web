// // src/services/signalRService.js
import * as signalR from '@microsoft/signalr';

class SignalRConnection {
   constructor() {
      this.connection = null;
   }
   async Disconnect() {
      if (this.connection != null) {
         this.connection.stop();
         this.connection = null;
         console.log('Closing');
      }
   }
   async startConnection() {
      this.connection = new signalR.HubConnectionBuilder()
         .withUrl('http://backend.misaproject.click/hub', {
            accessTokenFactory: async () => {
               const { token } = JSON.parse(
                  localStorage.getItem('webbanbalo_user')
               );
               return token;
            },
         })
         .withAutomaticReconnect()
         .build();

      try {
         this.connection.onclose(async () => {
            console.log('Closed');
         });
         this.connection.on('OnConnected', () => {
            console.log('Connected');
         });
         await this.connection.start();

         console.log('connection status', this.connection.state);
      } catch (error) {
         console.error('Error connecting to SignalR hub:', error);
      }
   }
}

const signalRConnection = new SignalRConnection();

export default signalRConnection;
