import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const backendURL = "https://message-api-1bt8.onrender.com/v1/api/chats"

export const getChats = createAsyncThunk(
    'chats/chatslist',
    async({token}, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }

            const response = await axios.get(`${backendURL}`, config)
            const chats = response.data
            return chats
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
              } else {
                return rejectWithValue(error.message)
              }
        }
    }
)

export const getMessages = createAsyncThunk(
    'chats/messages',
    async({chatId, token}, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
            const response = await axios.get(`${backendURL}/${chatId}`, config)
            const messages = response.data.chat.messages
            return messages
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
              } else {
                return rejectWithValue(error.message)
              }
        }
    }
)

export const postMessage = createAsyncThunk(
    'chats/message',
    async ({chatId, senderId, content, token}) => {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
        const data = {
          chatId,
          senderId,
          content
        }
        try {
            const response = await axios.post(`https://message-api-1bt8.onrender.com/v1/api/messages`,data, config)
            return response.data.message;
            //socket
        } catch (error) {
          console.log(error);
          if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message)
          } else {
            return rejectWithValue(error.message)
          }
        }
    }
)

