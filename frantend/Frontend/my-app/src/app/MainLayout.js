"use client"
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store'
import 'izitoast/dist/css/iziToast.min.css';

export default function MainLayout({children}) {
  return (
    <Provider store={store}>
        {children}
        
    </Provider>
  )
}
