import React from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const text = "寻找一种可能性";
  const letters = text.split("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const letterVariants: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 50,
      filter: "blur(10px)",
    },
  };

  const handleNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    const { innerWidth } = window;
    // 开场页只能往后翻，所以只要点击右侧就进入下一页，点击左侧可以加个小提示或者什么都不做
    if (clientX >= innerWidth / 2) {
      navigate("/slide2");
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center font-sans cursor-pointer"
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
        className="absolute top-[10%] left-[15%] w-72 h-72 md:w-96 md:h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          x: [0, -80, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[10%] right-[15%] w-80 h-80 md:w-[30rem] md:h-[30rem] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-blue-400/5 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Decorative Grid and Contour Lines Background */}
      <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='topographic' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 100 Q 25 50, 50 100 T 100 100 M 0 80 Q 25 30, 50 80 T 100 80 M 0 60 Q 25 10, 50 60 T 100 60 M 0 40 Q 25 -10, 50 40 T 100 40' fill='none' stroke='white' stroke-width='0.5' stroke-opacity='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23topographic)'/%3E%3C/svg%3E")`,
        backgroundSize: '300px 300px',
      }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center px-4">
        {/* Title */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex overflow-visible pb-4"
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="text-5xl md:text-7xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-widest drop-shadow-sm"
              style={{ paddingRight: letter === "种" ? "1rem" : "0" }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
          className="mt-6 text-slate-400 text-lg md:text-2xl font-light tracking-[0.3em] uppercase"
        >
          Discover New Possibilities
        </motion.p>

      </div>
    </div>
  );
}
