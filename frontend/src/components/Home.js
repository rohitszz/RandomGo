import React from 'react'
import { NavLink } from 'react-router-dom';
import "./home.css"
const Home = () => {
  return (
    <div className='h-full w-full border-2 border-[green] text-white'>
    <div className=' flex flex-row justify-center gap-20 items-center'>
    <div className='text-[2.5rem] flex items-center justify-center text-[#ffffff] font-bold demo '>RandomPing</div>
    <NavLink to="/login" > 
    <button className=" translate-x-8 demo"> Login </button>
    </NavLink>  
    
    <NavLink to="/signup">
      <button  className="demo"> Signup </button>
    </NavLink> 
    </div>

     <div className='flex flex-col items-center justify-center gap-y-10 h-[80%]'>
         <div className='text-[red] demo'>*make sure you allow third party cookies</div>
      <div className='text-[1.7rem]  p-6 demo'>Demo Login with</div>
    <div className=' '>
      <div className='flex gap-x-6 demo'> 
      <div className=' demo'>example1@gmail.com </div>
      <div>password: aa</div>
      </div>
      <div className='flex gap-x-6 demo'>
      <div>example2@gmail.com </div>
      <div>password: aa</div>
      </div>
    </div>
      
    </div>
    </div>
  )
}

export default Home
