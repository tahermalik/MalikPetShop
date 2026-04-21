import { Server } from "socket.io";

let io; // 🔥 shared variable

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173","http://localhost:5174", "https://malikpetshop.onrender.com", "https://malik-pet-shop-git-main-taher-maliks-projects.vercel.app", "https://malik-pet-shop-iu40gnfxf-taher-maliks-projects.vercel.app","https://malik-pet-shop-main.vercel.app","https://malik-pet-shop-main-irrlw7uzk-taher-maliks-projects.vercel.app"],  // your React frontend URL

            credentials: true
        }
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};