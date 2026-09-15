import React, { useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config.js'

const Blog = React.memo(() => {
   const [user, setUser] = useState(null)
    
     const getuser = () => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid=user.id
            setUser(user)
          } else {
            setUser(null);
          }
        });
      };
      useEffect(()=>{
        getuser()
      })
  return (

    <>
    <Navbar />
      <h1>User Dashboard</h1>
    </>

  )
})

export default Blog