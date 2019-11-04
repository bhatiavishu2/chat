import axios from 'axios';

const baseUrl = 'http://localhost:4300/chats';

export const getRooms = async () => {
    return await axios.get(`${baseUrl}/list`,{ headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
      });
}

export const createRoom = async (chatData) => {
    return await axios.post(`${baseUrl}/create`, chatData);
}