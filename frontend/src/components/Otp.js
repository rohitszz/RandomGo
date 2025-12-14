import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import "./home.css"

const Otp = ({copyEmail, setcopyEmail, otpVerified, setOtpVerified}) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [isOtp, setIsOtp] = useState(true);
  const [data, setData] = useState(null);
   const location = useLocation();
   const token = location.state.token;

  useEffect ( () => {
    if(otp.length === 0){
        setIsOtp(true);
    }
  }, [otp])

  useEffect( () => {
    verificationHandler();
  }, [])

  async function verificationHandler(){
   
    try{
        const res = await fetch("https://chatapp-backend-1rq1.onrender.com/api/users/signup/sendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`},
        body: JSON.stringify({
         copyEmail })
     } )
        const result = await res.json();
        setData(result);
    }
    catch(error){
        return error;
    }
  }

  async function verifyOtp(e){
    e.preventDefault();
    try{
    const res = await fetch("https://chatapp-backend-1rq1.onrender.com/api/users/signup/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        credentials: "include", 
        body: JSON.stringify({
         otp ,copyEmail })
    })
    const data = await res.json();
    if(data.success) {
            setIsOtp(true);
            setOtpVerified(true);
            navigate("/dashboard", {state: { token:data.token }} );
        }
        else {
            setIsOtp(false);
            setOtp("");
            }
        }
        catch(error){

        }
  }
  
  return (
    <div className='flex flex-row bg-black text-[white] gap-4'>

     <input className='bg-black border-2 rounded-full p-2 mt-2 demo' type='text' placeholder='enter otp' onChange={(e) => setOtp(e.target.value)}></input> 
     <button className='demo' onClick={verificationHandler}>resend</button> 
     <button className='demo' onClick={verifyOtp}> verify</button>
    { !isOtp && <p className="text-red-500"> Wrong OTP! Please try again. </p> }
    </div>
  )
}

export default Otp
