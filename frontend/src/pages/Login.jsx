import React, { useState } from "react";

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  return (
    <div className="grid w-screen h-screen place-items-center bg-amber-200">
      <div className="w-[90%] min-w-[250px] max-w-[430px] bg-white p-8 rounded-2xl shadow-lg">
        {/* Header Title  */}
        <div className="flex justify-center mb-4">
          <h2 className="text-3xl font-semibold text-center">
            {isLoginMode ? "Login" : "Sign Up"}
          </h2>
        </div>

        {/* tab control  */}
        <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
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
            className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 transition-all ${
              isLoginMode ? "left-0" : "left-1/2"
            }`}
          ></div>
        </div>

        {/* form section  */}
        <form action="" className="space-y-4">
          {/* signup field  */}
          {!isLoginMode && (
            <input
              type="text"
              placeholder="Name"
              required
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-amber-500 placeholder-gray-400"
            />
          )}

          {/* shared field  */}
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-amber-500 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-amber-500 placeholder-gray-400"
          />

          {/* signup field  */}
          {!isLoginMode && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-amber-500 placeholder-gray-400"
            />
          )}

          {/* Login field  */}
          {isLoginMode && (
            <div className="text-right">
              <a href="#" className="text-amber-600 hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          {/* shared button  */}
          <button className="w-full p-3 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition">
            {isLoginMode ? "Login" : "Signup"}
          </button>

          {/* switch link  */}
          <p className="text-center text-gray-600">
            {isLoginMode
              ? "Dont have an account ? "
              : "Already have an account "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsLoginMode(!isLoginMode);
              }}
              className="text-amber-600 hover:underline"
            >
              {isLoginMode ? "Signup now" : "Login"}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
