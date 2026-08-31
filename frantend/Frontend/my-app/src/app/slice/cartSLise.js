import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
let apibaseUrl = process.env.NEXT_PUBLIC_API_URL
import Cookies from 'js-cookie'
import axios from 'axios'

export const fetchCartById = createAsyncThunk(
  'carts/fetchById',
  async () => {
    let token = Cookies.get("token") ? Cookies.get("token") : ''

    if (!token) {
      return []
    }

    try {
      const res = await axios.get(`${apibaseUrl}cart/view-cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return res.data?.data || []
    } catch(error) {
      return []  
    }
  },
)

export const cartSlice = createSlice({
  name: 'carts',
  initialState: {
    cart: []
  },
  reducers: {
    clearCart: (state) => {
      state.cart = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartById.fulfilled, (state, action) => {
      state.cart = action.payload || []
    })
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
