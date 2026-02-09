import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatUI from "./ChatUI";


export default function AIChatDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Hint Button */}
      <div
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-24 z-40 cursor-pointer"
      >
        <div className="bg-blue-500 text-white px-4 py-3 rounded-full shadow-xl hover:bg-blue-400 transition flex items-center gap-2 animate-bounce">
          🤖
          <span className="hidden sm:block font-medium">
            Ask AI for recommendations
          </span>
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-1/8 w-full sm:w-[420px] z-50 shadow-2xl rounded-3xl"
            >
              {/* Close button */}
              <div className="absolute top-4 right-4 z-50">
                <button
                  onClick={() => setOpen(false)}
                  className="text-blue-600 hover:text-blue-800 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <ChatUI />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
