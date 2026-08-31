import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

export let loginSlice=createSlice(
    {
        name:"userData",
        initialState:{
            token:Cookies.get("token") ? Cookies.get("token") : ''
        },
        reducers:{
            getToken:(oldState,{payload})=>{
            
                

                oldState.token=payload.token
                Cookies.set("token",oldState.token)
            },
            LogOut:(oldState)=>{
                 oldState.token=''
                 Cookies.remove("token")

            }
        }
    }
)
export const {getToken,LogOut}=loginSlice.actions
export default  loginSlice.reducer
