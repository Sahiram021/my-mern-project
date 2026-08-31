import { configureStore } from '@reduxjs/toolkit'
import  loginReducer  from '../slice/loginSLice'
import  cartReducer  from '../slice/cartSLise'
import wishlistReducer from "../slice/wishlistSlice";
export let store=configureStore({
    reducer:{
        userStore:loginReducer,
        cartStore:cartReducer,
        wishlistStore: wishlistReducer,
        
    }
})