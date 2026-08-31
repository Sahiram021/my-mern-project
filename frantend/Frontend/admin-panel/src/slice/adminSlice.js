import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const getInitialAdminInfo = () => {
  try {
    const saved = localStorage.getItem('adminInfo')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export let adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admintoken: Cookies.get('token') || localStorage.getItem('token') || '',
    adminInfo: getInitialAdminInfo(),
    adminImage: localStorage.getItem('adminImage') || '',
  },
  reducers: {
    getToken: (oldState, { payload }) => {
      oldState.admintoken = payload.token
      Cookies.set('token', payload.token)
      localStorage.setItem('token', payload.token)
      if (payload.data) {
        oldState.adminInfo = payload.data
        localStorage.setItem('adminInfo', JSON.stringify(payload.data))
      }
    },
    setAdminData: (oldState, { payload }) => {
      if (payload.data) {
        oldState.adminInfo = payload.data
        localStorage.setItem('adminInfo', JSON.stringify(payload.data))
      }
      if (payload.imageUrl) {
        oldState.adminImage = payload.imageUrl
        localStorage.setItem('adminImage', payload.imageUrl)
      } else if (payload.data?.image) {
        const path = payload.imagePath || 'http://localhost:8000/uploads/admin/'
        const fullUrl = `${path}${payload.data.image}`
        oldState.adminImage = fullUrl
        localStorage.setItem('adminImage', fullUrl)
      }
    },
    LogOut: (oldState) => {
      oldState.admintoken = ''
      oldState.adminInfo = null
      oldState.adminImage = ''
      Cookies.remove('token')
      localStorage.removeItem('token')
      localStorage.removeItem('adminInfo')
      localStorage.removeItem('adminImage')
    },
  },
})

export const { getToken, setAdminData, LogOut } = adminSlice.actions
export default adminSlice.reducer