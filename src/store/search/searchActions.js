import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const backendURL = "https://message-api-1bt8.onrender.com/v1/api/users"

export const searchUsers = createAsyncThunk(
    'search/users',
    async ({token, keyword} , {rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
            const response = await axios.post(`${backendURL}/search`,{keyword}, config)
            return response.data;
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
              } else {
                return rejectWithValue(error.message)
              }
        }
    }
)