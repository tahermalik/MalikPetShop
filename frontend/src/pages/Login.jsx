import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { USER_ENDPOINTS } from "./endpoints";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryState, setDetailOption, setLoginOption, setUserData } from "../redux/slices/userSlice";

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const location= useLocation();
  const {user}=location.state; /// user will either be normal user or the admin
  const [username,setUserName]=useState("")
  const [email,setEMail]=useState("")
  const [password,setPassword]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("");
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const showLoginOption=useSelector((state)=>state?.user?.loginOption)
  const showDetailOption=useSelector((state)=>state?.user?.detailOption)
  const categoryState=useSelector((state)=>state?.user?.categoryState)

  async function loginUser(){
    try{
      const res= await axios.post(`${USER_ENDPOINTS}/login/${user}`,{email:email,password:password},{withCredentials:true})
      let result=res?.data?.bool
      // console.log(result)
      if(result){
        dispatch(setUserData(res?.data?.user))
        if(showLoginOption===true) dispatch(setLoginOption())
        if(showDetailOption===true) dispatch(setDetailOption())
        if(categoryState===true) dispatch(setCategoryState())
        navigate("/")
      }
    }catch(error){
      console.log("Wrong in user login")
    }

  }

  async function registerUser(){
    try{

      if(password!==confirmPassword){
        console.log(password,confirmPassword)
        console.log("both password and its confirmation should be same")
      }else{
        const res= await axios.post(`${USER_ENDPOINTS}/register`,{email:email,password:password,username:username},{withCredentials:true})
        // console.log(res)
        let result=res?.data?.bool
        if(result){
          setIsLoginMode(true)
          setUserName("")
          setEMail("")
          setPassword("")
          setConfirmPassword("")
        }
      }
    }catch(error){
      console.log("Wrong in user register")
    }
  }
  
  return (
    <div className="grid w-screen h-screen place-items-center bg-blue-200">
      <div className="w-[90%] min-w-[250px] max-w-[430px] bg-white p-8 rounded-2xl shadow-lg">
        {/* Header Title  */}
        <div className="flex justify-center mb-4">
          <h2 className="text-3xl font-semibold text-center">
            {isLoginMode ? user==="user" ? "Login":"Admin Login" : "Sign Up"}
          </h2>
        </div>

        {/* tab control  will be visible only to the normal user and not to the admin*/}
        {user==="user" && <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
          <button
            className={`w-1/2 text-lg font-medium transition-all z-10 ${
              isLoginMode ? "text-white" : "text-black"
            }`}
            type="button"
            onClick={() => setIsLoginMode(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 text-lg font-medium transition-all z-10 ${
              !isLoginMode ? "text-white" : "text-black"
            }`}
            type="button"
            onClick={() => setIsLoginMode(false)}
          >
            Sign Up
          </button>
          <div
            className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transition-all ${
              isLoginMode ? "left-0" : "left-1/2"
            }`}
          ></div>
        </div>}

        {/* form section  */}
        <form action="" className="space-y-4">
          {/* signup field  */}
          {!isLoginMode && (
            <input
              type="text"
              placeholder="Name"
              required
              value={username}
              onChange={(e)=>setUserName(e.target.value)}
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-blue-500 placeholder-gray-400"
            />
          )}

          {/* shared field  */}
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e)=>setEMail(e.target.value)}
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-blue-500 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-blue-500 placeholder-gray-400"
          />

          {/* signup field  */}
          {!isLoginMode && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-blue-500 placeholder-gray-400"
            />
          )}

          {/* Login field  */}
          {isLoginMode && (
            <div className="text-right">
              <a href="#" className="text-orange-600 hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          {/* shared button  */}
          <button type="button" className="w-full p-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded-full text-lg font-medium hover:opacity-90 transition cursor-pointer"
            onClick={(e)=>{e.preventDefault();isLoginMode ? loginUser():registerUser()}}>
            {isLoginMode ? "Login" : "Signup"}
          </button>

          {/* switch link  */}

          {user==="user" && <p className="text-center text-gray-600">
            {isLoginMode
              ? "Dont have an account ? "
              : "Already have an account "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLoginMode(!isLoginMode);
              }}
              className="text-orange-600 hover:underline"
            >
              {isLoginMode ? "Signup now" : "Login"}
            </a>
          </p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
