import { configureStore } from '@reduxjs/toolkit'
import  adminSlice  from '../slice/adminSlice'

export let store=configureStore({
    reducer:{
        adminStore:adminSlice,
        
    }
})