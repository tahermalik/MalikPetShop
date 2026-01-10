import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_ENDPOINTS } from './endpoints';
import toast from 'react-hot-toast';
/**
 * PasswordRecovery.jsx
 * Single-file React component (Tailwind CSS required)
 * - Detects `token` from URL query string: if present shows Reset Password UI, otherwise shows Forgot Password UI
 * - Blue-themed, responsive, accessible, and production-ready UI
 * - Expects backend endpoints:
 *    POST  /api/auth/forgot-password    { email }
 *    POST  /api/auth/reset-password/:token   { password }
 *
 * Usage:
 *  - Place this file in your React app (e.g. src/components/PasswordRecovery.jsx)
 *  - Ensure Tailwind CSS is configured in the project
 *  - Mount component on routes /forgot-password and /reset-password (or single route that accepts token query)
 */

export default function PasswordRecovery() {
  const navigate=useNavigate();
  const [flow, setFlow] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [otpLoading,setOtpLoading]=useState(false)
  const [showOTP,setShowOTP]=useState(false)
  const [passwordLengthWarning,setPasswordLengthWarning]=useState(false);

  const [OTP, setOTP] = useState(["", "", "", "", "", ""]);

  // Forgot-password specific
  const [email, setEmail] = useState('');

  // Reset-password specific
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  async function submitMail(e) {
    try {

      //// to prevent the backend call
      const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if(!mailRegex.test(email)){
        toast.error("Email is not valid")
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      setLoading(true)
      const result = await axios.post(`${USER_ENDPOINTS}/forgotPassword`, { userEmail: email },{withCredentials:true})
      setShowOTP(true)
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log("Wrong in submit mail", error)
    } finally{
      setLoading(false)
    }
  }

  async function submitOTP(e){
    try{
      e.preventDefault();
      e.stopPropagation();
      setOtpLoading(true)
      const result = await axios.post(`${USER_ENDPOINTS}/verifyOTP`, { OTPArray: OTP,userEmail:email },{withCredentials:true})
      setOtpLoading(false)
      if(result?.data?.bool){
        setFlow(true)
        setOTP(["", "", "", "", "", ""])
      }else{

      }
    }catch(error){
      console.log("wrong in OTP submission",error)
    }
  }

  function handleChange(e, index) {

    setOTP(prev => {
      let copy = [...prev]
      copy[index] = e.target.value
      return copy
    })
  }

  async function submitPasswd(e){
    try{
      e.preventDefault();
      e.stopPropagation();
      if(password!==confirmPassword) {
        toast.error("Both the field should contain the same data")
        console.log("Both the field should contain the same data")
        return;
      }

      if(password.length<6){
        setPasswordLengthWarning(true);
        return;
      }
      const res=await axios.post(`${USER_ENDPOINTS}/resetPassword`,{password:password,email:email},{withCredentials:true});
      if(res?.data?.bool){
        toast.success(res?.data?.message)
        navigate("/Login",{state:{user:"user"}})
      }

    }catch(error){
      toast.error(error?.response?.data?.message)
      console.log("front end error at submit password "+error)
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <h1 className="text-2xl font-semibold">{flow ? 'Reset your password' : 'Forgot your password?'}</h1>
            <p className="mt-1 text-sm opacity-90">{flow ? 'Choose a new secure password for your account.' : 'Enter your email and we will send a password reset link.'}</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {!flow ? (
              // Forgot password form
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <div className="flex items-center justify-between">
                  <div
                    type="submit"
                    disabled={loading}
                    onClick={(e) => submitMail(e)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </div>

                  <Link to="/Login" state={{ user: "user" }} className="text-sm text-blue-600 hover:underline">Back to login</Link>
                </div>

                { showOTP && <div className='flex flex-col gap-2 items-center bg-blue-100 p-2 rounded-2xl'>
                  <div className="flex gap-2 justify-center">
                    {
                      Array.from({ length: 6 }).map((_, index) => {
                        return (
                          <div className='border border-blue-400 rounded-xl w-[40px] h-[40px]'><input type="text" inputMode='numeric' value={OTP[index]} maxLength={1} onChange={(e) => handleChange(e, index)} disabled={index !== 0 && OTP[index - 1] === ""} className={`h-[100%] w-[100%] text-center focus:outline-blue-500 rounded-xl`} /></div>
                        )
                      })
                    }
                  </div>
                  <div onClick={(e)=>submitOTP(e)} className='inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60'>{loading ? 'Sending OTP...' : 'Submit OTP'}</div>
                </div>}

                <div className="mt-4 text-xs text-gray-500">Didn't receive the email? Check your spam folder or try again.</div>

              </div>
            ) : (
              // Reset password form
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">New password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Confirm password</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </label>

                <div className="flex items-center justify-between">
                  <div
                    onClick={(e) => submitPasswd(e)}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </div>

                  <Link to="/Login" state={{ user: "user" }} className="text-sm text-blue-600 hover:underline">Back to login</Link>
                </div>

                { passwordLengthWarning && <div className='text-red-600 text-xs'>Paword length is less then 6</div>}
                <div className="mt-4 text-xs text-gray-500">Make sure your password is at least 6 characters. Use a mix of letters and numbers for security.</div>

              </div>
            )}

            <div className="mt-6 text-center text-xs text-gray-400">© {new Date().getFullYear()} YourApp. All rights reserved.</div>
          </div>

        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <a href="/help" className="text-blue-600 hover:underline">Need help?</a>
        </div>
      </div>
    </div>
  );
}
