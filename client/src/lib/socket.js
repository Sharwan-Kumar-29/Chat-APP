import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!userId) return;

  // Prevent reconnecting if already connected
  if (socket) return socket;

  // Connect to backend Socket.IO server
  socket = io(import.meta.env.MODE==="development" ? "http://localhost:4000":"/", {
    query: { userId },
    
  });
  
  return socket;
};

export const getSocket = () => socket;


export const disconnectSocket=()=>{
    if(socket){
        socket.disconnect()
        socket=null
    }
}
