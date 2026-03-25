import React from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, Activity, TrendingDown } from "lucide-react";

export default function Slide2() {
  const navigate = useNavigate();

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  };

  const handleNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    const { innerWidth } = window;
    if (clientX < innerWidth / 2) {
      navigate("/");
    } else {
      navigate("/slide3");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-[#0a0a0a] text-slate-200 overflow-hidden flex flex-col items-center justify-center font-sans cursor-pointer"
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

      {/* Navigation Hint */}
      <div className="absolute top-0 left-0 w-1/2 h-full z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-start pl-8">
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/50 text-sm">点击返回上页</div>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-end pr-8">
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/50 text-sm">点击进入下页</div>
      </div>

      {/* SVG Path Animations overlaying the video */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 3, duration: 2 }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        <svg className="w-full h-full" preserveAspectRatio="none">
          <motion.path
            d="M0,500 C150,400 300,600 450,450 C600,300 750,700 900,400 C1050,100 1200,600 1400,200 C1600,-200 1800,800 2000,300"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ delay: 3.5, duration: 4, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,600 C200,500 400,800 600,600 C800,400 1000,900 1200,500 C1400,100 1600,800 1800,300 C2000,100 2200,600 2400,200"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ delay: 4, duration: 5, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 3.5 }, // Delayed to wait for video
          },
        }}
        initial="hidden"
        animate="visible"
        className="z-10 max-w-7xl w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 md:gap-16 items-center pointer-events-none"
      >
        {/* Left Column: Titles */}
        <div className="flex flex-col space-y-6 md:pr-8">
          <motion.div variants={itemVariants} className="flex items-center space-x-3 text-red-500">
            <Globe className="w-8 h-8 flex-shrink-0" />
            <span className="text-sm font-semibold tracking-widest uppercase whitespace-nowrap">Global Macro</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg whitespace-nowrap">
            国际局势引发 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">经济震动</span>
          </motion.h2>
        </div>

        {/* Right Column: Key Points / Data Visualization concept */}
        <div className="flex flex-col space-y-8">
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-end text-right"
          >
            <div className="flex items-center justify-end space-x-4">
              <h3 className="text-3xl font-semibold mb-2 tracking-wide text-white/90">从生活必需品洞察宏观动荡</h3>
              <div className="p-3 bg-red-500/10 rounded-full text-red-400">
                <Activity className="w-8 h-8" />
              </div>
            </div>
            <p className="text-slate-400 text-base leading-relaxed max-w-md mt-2">
              当世界陷入动荡时，与生活息息相关的农产品（如大豆、玉米、小麦等）往往最先受到冲击。它们的高频价格波动，成为了映射全球地缘政治与供应链危机的最敏锐“晴雨表”。
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col items-end text-right"
          >
            <div className="flex items-center justify-end space-x-4">
              <h3 className="text-3xl font-semibold mb-2 tracking-wide text-white/90">预测中国经济的全新锚点</h3>
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                <TrendingDown className="w-8 h-8" />
              </div>
            </div>
            <p className="text-slate-400 text-base leading-relaxed max-w-md mt-2">
              中国作为核心进口国，外部农产品价格的剧烈波动会通过成本推动和通胀预期传导至国内。通过机器学习捕捉这一前瞻性信号，为预测中国GDP走势提供了全新的实证锚点。
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Page Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2"
      >
        <div className="w-2 h-2 rounded-full bg-white/20"></div>
        <div className="w-8 h-2 rounded-full bg-white/80"></div>
        <div className="w-2 h-2 rounded-full bg-white/20"></div>
      </motion.div>
    </div>
  );
}
