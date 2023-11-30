// src/services/signalRService.js
import * as signalR from '@microsoft/signalr';

export const connectToSignalRHub = async (connectionHub) => {
   try {
      connectionHub = new signalR.HubConnectionBuilder()
         .withUrl('http://backend.misaproject.click/hub')
         .withAutomaticReconnect()
         .build();
      connectionHub.onclose(() => {
         console.log('SignalR connection closed');
      });

      await connectionHub.start();

      console.log('Connected to SignalR hub');
   } catch (error) {
      console.error('Error connecting to SignalR hub:', error);
   }
};
