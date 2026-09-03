import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthToken } from "../utils/authToken.js";

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL || "https://jgbmtrading.online/api/web/"
).replace(/\/?$/, "/");

function requestError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function responseSucceeded(data) {
  return Boolean(data?.status || data?.success);
}

export const fetchCartById = createAsyncThunk(
  "carts/fetchById",
  async (_, { rejectWithValue }) => {
    const token = getAuthToken();

    if (!token) {
      return [];
    }

    try {
      const res = await axios.get(`${apiBaseUrl}cart/view-cart`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      if (!responseSucceeded(res.data)) {
        return rejectWithValue(res.data?.message || "Unable to load your cart");
      }

      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (error) {
      return rejectWithValue(requestError(error, "Unable to load your cart"));
    }
  },
  {
    // Header and Cart page both initialize the shared store. Do not issue two
    // competing requests or let a slower response overwrite a newer one.
    condition: (_, { getState }) => getState().cartStore?.status !== "loading",
  }
);

export const updateCartQuantity = createAsyncThunk(
  "carts/updateQuantity",
  async ({ id, qty }, { rejectWithValue }) => {
    const token = getAuthToken();

    if (!token) {
      return rejectWithValue("Please sign in again to update your cart");
    }

    try {
      const res = await axios.put(
        `${apiBaseUrl}cart/change-qty/${id}`,
        { qty },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );

      if (!responseSucceeded(res.data)) {
        return rejectWithValue(res.data?.message || "Unable to update quantity");
      }

      return { id, qty, message: res.data?.message };
    } catch (error) {
      return rejectWithValue(requestError(error, "Unable to update quantity"));
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "carts/deleteItem",
  async (id, { rejectWithValue }) => {
    const token = getAuthToken();

    if (!token) {
      return rejectWithValue("Please sign in again to update your cart");
    }

    try {
      const res = await axios.delete(`${apiBaseUrl}cart/remove-cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      if (!responseSucceeded(res.data)) {
        return rejectWithValue(res.data?.message || "Unable to remove this item");
      }

      return { id, message: res.data?.message };
    } catch (error) {
      return rejectWithValue(requestError(error, "Unable to remove this item"));
    }
  }
);

export const cartSlice = createSlice({
  name: "carts",
  initialState: {
    cart: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCartById.fulfilled, (state, action) => {
        state.cart = action.payload || [];
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchCartById.rejected, (state, action) => {
        // Preserve the last known cart during a temporary network/API failure.
        state.status = "failed";
        state.error = action.payload || "Unable to load your cart";
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const item = state.cart.find(
          (cartItem) => String(cartItem._id) === String(action.payload.id)
        );
        if (item) item.qty = action.payload.qty;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cart = state.cart.filter(
          (item) => String(item._id) !== String(action.payload.id)
        );
        state.status = "succeeded";
        state.error = null;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
