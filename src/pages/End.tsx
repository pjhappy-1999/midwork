import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
 

export default function End() {
  const navigate = useNavigate();

  const handleNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    const { innerWidth } = window;
    if (clientX < innerWidth / 2) {
      navigate("/slide5");
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-[#0a0a0a] text-slate-200 overflow-hidden font-sans cursor-pointer flex items-center justify-center"
      onClick={handleNavigation}
    >
      {/* Dynamic Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 80, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[15%] w-72 h-72 md:w-96 md:h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          x: [0, -80, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[10%] right-[15%] w-80 h-80 md:w-[30rem] md:h-[30rem] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-blue-400/5 rounded-full blur-[120px] pointer-events-none z-0"
      />

      {/* Decorative Grid and Contour Lines Background */}
      <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='topographic' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 100 Q 25 50, 50 100 T 100 100 M 0 80 Q 25 30, 50 80 T 100 80 M 0 60 Q 25 10, 50 60 T 100 60 M 0 40 Q 25 -10, 50 40 T 100 40' fill='none' stroke='white' stroke-width='0.5' stroke-opacity='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23topographic)'/%3E%3C/svg%3E")`,
        backgroundSize: '300px 300px',
      }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="absolute top-0 left-0 w-1/2 h-full z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-start pl-8">
        <div className="bg-slate-900/70 border border-slate-700 px-4 py-2 rounded-full text-white/60 text-sm">点击返回上页</div>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-end pr-8">
        <div className="bg-slate-900/70 border border-slate-700 px-4 py-2 rounded-full text-white/60 text-sm">点击回到开场</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-6 w-full max-w-4xl"
      >
        <div className="text-[11px] md:text-xs tracking-[0.3em] uppercase text-slate-400/80">Defense</div>
        <div className="mt-5 text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
          感谢聆听
        </div>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-slate-500/60 to-transparent" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-xs text-slate-600 font-mono"
      >
        <span>[01]</span>
        <span>[02]</span>
        <span>[03]</span>
        <span>[04]</span>
        <span>[05]</span>
        <span className="text-blue-300 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">[END_ACTIVE]</span>
      </motion.div>
    </div>
  );
}
