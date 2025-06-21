import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ManageCategory from './pages/owner/manageCategory'
import ManageMenu from './pages/owner/ManageMenu'
function App() {


  return (
    <>
    <ManageMenu/>
    <ManageCategory/>
    </>
  )
}

export default App
