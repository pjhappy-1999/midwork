import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
 

export default function End() {
  const navigate = useNavigate();
  const videoSrc = `${import.meta.env.BASE_URL}视频/background2.mp4`;

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
      className="relative min-h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans cursor-pointer flex items-center justify-center"
      onClick={handleNavigation}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 min-w-full min-h-full object-cover opacity-12">
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#020617]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_35%,rgba(59,130,246,0.22),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
      </div>

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
