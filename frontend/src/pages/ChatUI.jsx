import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setMessages } from "../redux/slices/chatSlice";
import axios from "axios";
import { USER_ENDPOINTS } from "./endpoints";
import { useNavigate } from "react-router-dom";

export default function ChatUI() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const messages = useSelector((state) => state?.chat?.messages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);


  const sendMessage = async () => {
    if (!input.trim()) return toast.error("You can't ask empty questions!");

    dispatch(setMessages({ role: "user", text: input }));
    const response = await axios.post(`${USER_ENDPOINTS}/recommendProducts`, { userQuery: input }, { withCredentials: true })
    const recommendedProductsArray = response?.data?.result

    const recommendedProductsObj = {
      role: "bot",
      text: "Here are some usefull recommendations!!!",
      products: []
    }
    for (let i = 0; i < recommendedProductsArray.length; i++) {

      recommendedProductsObj["products"].push(
        {
          name: `${recommendedProductsArray[i]["productName"]}`,
          usp: `${recommendedProductsArray[i]["usp"]}`,
          productData: recommendedProductsArray[i]
        }
      )
    }

    dispatch(setMessages(recommendedProductsObj))
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <div className="h-full bg-blue-50 flex flex-col rounded-3xl">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden h-[80vh]" data-lenis-prevent>

        {/* Header */}
        <div className="px-6 py-4 text-blue-800 font-semibold text-lg bg-blue-100 shadow-md">
          MalikPetShop Assistant 🐶🐱
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-blue-50 flex flex-col scrollbar-hide">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-md ${msg.role === "user" ? "bg-blue-300 text-blue-900" : "bg-white text-blue-800"
                  }`}
                >
                  {msg.text && <p>{msg.text}</p>}

                  {msg.products && (
                    <div className="mt-3 space-y-3">
                      {msg.products.map((p) => (
                        <div
                          key={p.id}
                          className="flex flex-col p-3 rounded-xl bg-blue-50 shadow hover:shadow-lg transition-all duration-300 border border-blue-100"
                        >
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-blue-900">{p.name}</p>
                          </div>
                          <p className="text-sm text-blue-800 mt-1">{p.usp}</p>
                          <div onClick={(e) => { e.stopPropagation(); navigate("/SingleProductDisplay", { state: p.productData }) }} className="mt-2 px-3 py-1 bg-blue-400 text-white rounded-lg hover:bg-blue-300 font-medium transition w-fit">
                            View Product →
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />

        </div>

        {/* Input */}
        <div className="p-4 bg-blue-100 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask for pet food, toys, grooming…"
            className="flex-1 px-4 py-3 rounded-xl bg-white focus:outline-none shadow-inner"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 rounded-xl bg-blue-400 text-white font-semibold shadow hover:bg-blue-300 active:scale-95 transition"
          >
            Send
          </button>
        </div>


      </div>
    </div>
  );
}