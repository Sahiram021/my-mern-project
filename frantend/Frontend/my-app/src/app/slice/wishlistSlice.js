import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";

let apibaseUrl = process.env.NEXT_PUBLIC_API_URL;

function getProductId(item) {
  return item?.productId?._id || item?.productId;
}

function normalizeId(value) {
  return value ? String(value) : "";
}

function makeWishlistItem(productData) {
  return {
    _id: productData._id || productData.productId,
    productId: productData._id || productData.productId,
    name: productData.name || productData.title,
    price: productData.price,
    image: productData.image,
    slug: productData.slug,
    category:
      productData?.parentCategory?.name ||
      productData?.category?.name ||
      productData?.category ||
      "Calcium Powder",
  };
}

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async () => {
    let token = Cookies.get("token") ? Cookies.get("token") : "";
    if (!token) return [];

    try {
      const res = await axios.get(
        `${apibaseUrl}wishlist/get-wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productData) => {
    let token = Cookies.get("token") ? Cookies.get("token") : "";

    try {
      let wishlistObject = makeWishlistItem(productData);
      const res = await axios.post(
        `${apibaseUrl}wishlist/add-to-wishlist`,
        wishlistObject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return {
        status: 0,
        message: error?.response?.data?.message || "Unable to add wishlist",
      };
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (wishlistId) => {
    let token = Cookies.get("token") ? Cookies.get("token") : "";

    try {
      const res = await axios.delete(
        `${apibaseUrl}wishlist/remove-wishlist/${wishlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return {
        status: 0,
        message: error?.response?.data?.message || "Unable to remove wishlist",
      };
    }
  }
);

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
  },
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.wishlist = action.payload || [];
    });

    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      if (action.payload?.status) {
        let newWishlist = action.payload.data || makeWishlistItem(action.meta.arg);
        if (!newWishlist) return;

        let alreadyExists = state.wishlist.some(
          (item) =>
            item._id === newWishlist?._id ||
            normalizeId(getProductId(item)) === normalizeId(getProductId(newWishlist))
        );

        if (!alreadyExists) {
          state.wishlist.push(newWishlist);
        }
      }
    });

    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      if (action.payload?.status) {
        state.wishlist = state.wishlist.filter(
          (item) => item._id !== action.meta.arg
        );
      }
    });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
