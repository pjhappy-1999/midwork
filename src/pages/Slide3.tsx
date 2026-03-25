import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Terminal, X } from "lucide-react";

type FlowNodeProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  vertical?: boolean;
  customClass?: string;
  children: React.ReactNode;
};

type FlowPathHighlight = "cyan" | "red";

type FlowPathProps = {
  d: string;
  highlight?: FlowPathHighlight;
  dashed?: boolean;
};

const FlowNode = ({ x, y, w, h, vertical = false, customClass = "", children }: FlowNodeProps) => (
  <foreignObject x={x} y={y} width={w} height={h}>
    <div 
      className={`w-full h-full border border-slate-600 bg-[#0f172a] text-center rounded text-slate-300 flex items-center justify-center text-sm shadow-lg p-2 leading-snug ${customClass}`}
      style={vertical ? { writingMode: 'vertical-rl', letterSpacing: '0.1em' } : {}}
    >
      {children}
    </div>
  </foreignObject>
);

const FlowPath = ({ d, highlight, dashed }: FlowPathProps) => (
  <path 
    d={d} 
    fill="none" 
    stroke={highlight ? (highlight === 'cyan' ? '#06b6d4' : '#ef4444') : '#64748b'} 
    strokeWidth={highlight ? "3" : "2"} 
    strokeDasharray={dashed ? "8,8" : "none"}
    markerEnd={`url(#arrowhead${highlight ? `-${highlight}` : ''})`} 
    className={highlight ? `transition-colors duration-300` : ''}
  />
);

// 提取出宏观传导机制图表为一个独立的组件，方便复用
const techRouteData = [
  { id: 'STEP1', name: '数据收集', color: '#10b981', short: '高频收集' }, // emerald-500
  { id: 'STEP2', name: '数据探索', color: '#06b6d4', short: '数据探索' }, // cyan-500
  { id: 'STEP3', name: '特征构建', color: '#3b82f6', short: '特征构建' }, // blue-500
  { id: 'STEP4', name: '模型训练', color: '#6366f1', short: '模型训练' }, // indigo-500
  { id: 'STEP5', name: '性能评估', color: '#8b5cf6', short: '性能评估' }, // violet-500
];

const TechRouteDoughnut = ({ onNodeClick }: { onNodeClick: (id: string) => void }) => {
  const cx = 150;
  const cy = 110;
  const R = 60;
  const r = 35;
  const numSlices = techRouteData.length;
  const sliceAngle = 360 / numSlices;

  // 使用 SVG 路径组合：画外圆弧后连线到内圆，再画内圆弧返回，实现真正的“中心挖空”圆环
  const getDoughnutSlice = (startAngle: number, endAngle: number) => {
    const rad1 = (startAngle - 90) * Math.PI / 180;
    const rad2 = (endAngle - 90) * Math.PI / 180;
    
    const x1 = cx + R * Math.cos(rad1);
    const y1 = cy + R * Math.sin(rad1);
    const x2 = cx + R * Math.cos(rad2);
    const y2 = cy + R * Math.sin(rad2);
    
    const x3 = cx + r * Math.cos(rad2);
    const y3 = cy + r * Math.sin(rad2);
    const x4 = cx + r * Math.cos(rad1);
    const y4 = cy + r * Math.sin(rad1);
    
    // M: 起点, A: 外圆弧(顺时针), L: 连线到内圆, A: 内圆弧(逆时针退回), Z: 闭合
    return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 0 0 ${x4} ${y4} Z`;
  };

  return (
    <svg viewBox="0 0 300 220" className="w-full h-full drop-shadow-2xl">
      <defs>
        <marker id="arrowhead-flow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
        </marker>
      </defs>

      {techRouteData.map((step, i) => {
        const startAngle = i * sliceAngle + 3; // +3 留出切片间隙
        const endAngle = (i + 1) * sliceAngle - 3;
        const midAngle = (startAngle + endAngle) / 2;
        const midRad = (midAngle - 90) * Math.PI / 180;
        
        // 箭头引线起点和终点
        const lineStartX = cx + (R + 2) * Math.cos(midRad);
        const lineStartY = cy + (R + 2) * Math.sin(midRad);
        const lineEndX = cx + (R + 20) * Math.cos(midRad);
        const lineEndY = cy + (R + 20) * Math.sin(midRad);
        
        // 文字坐标
        const textX = cx + (R + 25) * Math.cos(midRad);
        const textY = cy + (R + 25) * Math.sin(midRad) + 4;
        const textAnchor = Math.cos(midRad) > 0 ? "start" : (Math.cos(midRad) < 0 ? "end" : "middle");

        // 计算流程箭头的坐标 (位于两个切片之间的间隙，沿顺时针方向)
        const arrowAngle = (i + 1) * sliceAngle;
        const arrowRad = (arrowAngle - 90) * Math.PI / 180;
        const arrowRadius = r + (R - r) / 2; // 圆环正中间
        // 顺时针微调偏移量来绘制弧线箭头
        const arrowStartRad = arrowRad - 0.1;
        const arrowEndRad = arrowRad + 0.1;
        const ax1 = cx + arrowRadius * Math.cos(arrowStartRad);
        const ay1 = cy + arrowRadius * Math.sin(arrowStartRad);
        const ax2 = cx + arrowRadius * Math.cos(arrowEndRad);
        const ay2 = cy + arrowRadius * Math.sin(arrowEndRad);

        return (
          <g 
            key={step.name} 
            className="group cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onNodeClick(step.id);
            }}
          >
            <path 
              d={getDoughnutSlice(startAngle, endAngle)} 
              fill={step.color} 
              className="opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:stroke-white group-hover:stroke-[1px]" 
            />
            
            {/* 引线 */}
            <line 
              x1={lineStartX} y1={lineStartY} 
              x2={lineEndX} y2={lineEndY} 
              stroke={step.color} strokeWidth="1.5" 
              className="opacity-50 group-hover:opacity-100 transition-opacity duration-300" 
            />
            <circle cx={lineEndX} cy={lineEndY} r="2" fill={step.color} className="opacity-80 group-hover:opacity-100" />
            
            {/* 标号文字 */}
            <text 
              x={textX} y={textY} 
              fill={step.color} 
              fontSize="12" 
              fontWeight="bold"
              fontFamily="sans-serif" 
              textAnchor={textAnchor} 
              className="opacity-80 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md"
            >
              0{i + 1}. {step.name}
            </text>

            {/* 顺时针流程指示箭头 (不画在最后一个和第一个之间) */}
            {i < numSlices - 1 && (
              <path 
                d={`M ${ax1} ${ay1} A ${arrowRadius} ${arrowRadius} 0 0 1 ${ax2} ${ay2}`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                markerEnd="url(#arrowhead-flow)"
                className="opacity-60"
              />
            )}
          </g>
        );
      })}
      
      {/* 中间文字 */}
      <text x={cx} y={cy - 6} fill="#94a3b8" fontSize="10" textAnchor="middle" className="font-mono tracking-widest pointer-events-none">DATA</text>
      <text x={cx} y={cy + 10} fill="#e2e8f0" fontSize="13" textAnchor="middle" className="font-bold pointer-events-none">PIPELINE</text>
    </svg>
  );
};

const MacroFlowchart = () => (
  <svg viewBox="0 0 1200 800" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
      </marker>
      <marker id="arrowhead-cyan" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
      </marker>
      <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
      </marker>
    </defs>
    
    {/* === ORTHOGONAL LINES === */}
    <FlowPath d="M 70 400 L 110 400 L 110 175 L 150 175" />
    <FlowPath d="M 70 400 L 150 400" />
    <FlowPath d="M 70 400 L 110 400 L 110 625 L 150 625" />

    <FlowPath d="M 310 175 L 520 175 L 520 350 L 560 350" />
    <FlowPath d="M 310 400 L 560 400" />
    <FlowPath d="M 330 625 L 380 625" />
    
    <FlowPath d="M 500 625 L 530 625 L 530 450 L 560 450" />
    <FlowPath d="M 440 650 L 440 700" />
    <FlowPath d="M 520 725 L 540 725 L 540 575 L 560 575" />

    <FlowPath d="M 590 500 L 590 550" />
    <FlowPath d="M 605 500 L 605 650" />
    <FlowPath d="M 620 500 L 620 750" />

    <FlowPath d="M 620 320 L 710 320 L 710 125 L 750 125" highlight="cyan" />
    <FlowPath d="M 620 360 L 690 360 L 690 225 L 750 225" highlight="cyan" />
    <FlowPath d="M 620 400 L 690 400 L 690 325 L 750 325" highlight="cyan" />
    <FlowPath d="M 620 440 L 690 440 L 690 425 L 750 425" highlight="cyan" />

    <FlowPath d="M 700 575 L 750 575" />
    <FlowPath d="M 820 600 L 820 675 L 680 675" />
    <FlowPath d="M 560 775 L 500 775 L 500 480 L 560 480" dashed />
    <FlowPath d="M 560 675 L 515 675 L 515 465 L 560 465" dashed />
    <FlowPath d="M 530 285 L 560 320" dashed />
    
    <FlowPath d="M 930 125 L 950 125 L 950 105 L 980 105" />
    <FlowPath d="M 930 125 L 950 125 L 950 225 L 980 225" />
    <FlowPath d="M 910 225 L 980 225" />
    <FlowPath d="M 950 325 L 980 325" />
    <FlowPath d="M 930 425 L 980 425" />

    <FlowPath d="M 1020 400 L 1020 350" />
    <FlowPath d="M 1020 250 L 1020 300" />
    <FlowPath d="M 1060 225 L 1080 225" />
    <FlowPath d="M 1130 270 L 1130 325 L 1120 325" />

    <FlowPath d="M 1120 325 L 1135 325 L 1135 400 L 1150 400" highlight="red" />
    <FlowPath d="M 1140 105 L 1175 105 L 1175 300" highlight="red" />

    {/* === NODES === */}
    <FlowNode x={20} y={300} w={50} h={200} vertical customClass="text-[16px] font-bold">国际粮价上涨</FlowNode>
    
    <FlowNode x={150} y={150} w={160} h={50}>现货市场传导</FlowNode>
    <FlowNode x={150} y={375} w={160} h={50}>期货市场联动</FlowNode>
    <FlowNode x={150} y={600} w={180} h={50}>由于价格差出现套利</FlowNode>

    <FlowNode x={350} y={250} w={180} h={70} customClass="text-xs border-dashed text-slate-400 bg-transparent">成本推动、需求拉动、进出口、心理预期、货币因素等</FlowNode>
    
    <FlowNode x={380} y={600} w={120} h={50}>交易成本<span className="text-red-400 ml-1">↑</span></FlowNode>
    <FlowNode x={380} y={700} w={140} h={50}>种植效益变化</FlowNode>
    
    {/* CORE */}
    <FlowNode x={560} y={300} w={60} h={200} vertical customClass="border-2 border-cyan-500/50 bg-[#082f49] text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] text-[16px] z-20">国内粮价上涨</FlowNode>
    
    <FlowNode x={560} y={550} w={140} h={50}>种粮积极性<span className="text-emerald-400 ml-1">↓</span></FlowNode>
    <FlowNode x={560} y={650} w={120} h={50}>粮食安全</FlowNode>
    <FlowNode x={560} y={750} w={160} h={50}>进出口贸易额<span className="text-emerald-400 ml-1">↓</span></FlowNode>

    <FlowNode x={750} y={100} w={180} h={50}>食品类商品价格<span className="text-red-400 ml-1">↑</span></FlowNode>
    <FlowNode x={750} y={200} w={160} h={50}>居民通胀预期</FlowNode>
    <FlowNode x={750} y={300} w={200} h={50}>食品消费及加工业利润<span className="text-emerald-400 ml-1">↓</span></FlowNode>
    <FlowNode x={750} y={400} w={180} h={50}>工业原材料成本<span className="text-red-400 ml-1">↑</span></FlowNode>
    
    <FlowNode x={750} y={550} w={140} h={50}>农业投资<span className="text-red-400 ml-1">↑</span></FlowNode>

    <FlowNode x={980} y={80} w={160} h={50}>居民开支<span className="text-red-400 mx-1">↑</span>消费<span className="text-emerald-400 ml-1">↓</span></FlowNode>
    <FlowNode x={980} y={200} w={80} h={50} customClass="font-bold tracking-widest">CPI<span className="text-red-400 ml-1">↑</span></FlowNode>
    <FlowNode x={980} y={300} w={140} h={50}>工业投资<span className="text-emerald-400 ml-1">↓</span></FlowNode>
    <FlowNode x={980} y={400} w={80} h={50} customClass="font-bold tracking-widest">PPI<span className="text-red-400 ml-1">↑</span></FlowNode>
    
    <FlowNode x={1080} y={210} w={100} h={60} customClass="text-xs leading-tight">国家宏观<br/>调控政策</FlowNode>

    {/* FINAL */}
    <FlowNode x={1150} y={300} w={50} h={200} vertical customClass="border-2 border-red-500/50 bg-[#450a0a] text-red-300 font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] text-[16px]">阻碍经济增长</FlowNode>
  </svg>
);

export default function Slide3() {
  const navigate = useNavigate();
  const [dataStream, setDataStream] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Generate fake data stream
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = Array.from({ length: 8 })
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")
        .toUpperCase();
      const val = (Math.random() * 100 - 50).toFixed(4);
      setDataStream((prev) => [`0x${hex}  VOL_IDX: ${val}`, ...prev].slice(0, 15));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  };

  const handleNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    // If a modal is open, ANY click on the background container should close it and do nothing else
    if (activeModal) {
      closeModal();
      return;
    }

    // If clicking on a card (or its children) when no modal is open, don't trigger page navigation
    if ((e.target as HTMLElement).closest('.clickable-card')) {
      return;
    }

    const { clientX } = e;
    const { innerWidth } = window;
    if (clientX < innerWidth / 2) {
      navigate("/slide2");
    } else {
      navigate("/slide4");
    }
  };

  const handleCardClick = (module: string) => {
    setActiveModal(module);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div
      className="relative min-h-screen min-w-[1024px] w-full bg-[#0a0a0a] text-slate-200 overflow-hidden font-mono cursor-pointer"
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
      
      {/* Animated Data Stream in Background */}
      <div className="absolute left-8 top-1/4 opacity-10 pointer-events-none text-emerald-500 text-sm leading-relaxed whitespace-pre font-mono">
        {dataStream.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="absolute right-8 bottom-1/4 opacity-10 pointer-events-none text-cyan-500 text-sm leading-relaxed whitespace-pre font-mono text-right">
        {dataStream.map((line, i) => (
          <div key={i}>{line.split('').reverse().join('')}</div>
        ))}
      </div>

      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 right-1/3 w-[40rem] h-[40rem] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute bottom-1/4 left-1/3 w-[35rem] h-[35rem] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Top Border Terminal Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 opacity-50" />

      {/* Navigation Hint */}
      <div className="absolute top-0 left-0 w-1/2 h-full z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-start pl-8">
        <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 text-emerald-500/70 text-xs tracking-widest uppercase">&lt; SYS.NAV.PREV /&gt;</div>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-end pr-8">
        <div className="bg-slate-900/80 border border-slate-700 px-4 py-2 text-emerald-500/70 text-xs tracking-widest uppercase">&lt; SYS.NAV.NEXT /&gt;</div>
      </div>

      {/* Header - Moved to Top Left */}
      <div className="absolute top-8 left-10 z-30 pointer-events-none">
        <motion.div variants={itemVariants} className="flex items-center space-x-3 text-emerald-400 mb-2">
          <Terminal className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-widest uppercase">root@data-model:~/framework# ./init.sh</span>
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold leading-tight font-sans tracking-tight">
          DATA-DRIVEN MACRO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
            研究框架与技术路径
          </span>
        </motion.h2>
      </div>

      {/* Main Content Area - Absolute Full-Screen Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute top-36 left-10 right-10 bottom-16 z-20 flex gap-8 pointer-events-none"
      >
        
        {/* Left Column: Split into Top (WHAT - 目标定义) and Bottom (Tech Route Pipeline) */}
        <div className="w-[24rem] flex-shrink-0 flex flex-col gap-6 h-full">
          
          {/* Top Half: WHAT - 目标定义 */}
          <motion.div
            variants={itemVariants}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick('WHAT');
            }}
            className="clickable-card flex-[2] flex flex-col bg-[#0b1121]/80 border border-slate-800 rounded-lg p-6 relative overflow-hidden group hover:border-emerald-500/50 hover:bg-[#0f172a] transition-all cursor-pointer pointer-events-auto shadow-2xl"
          >
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />

            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
              <div>
                <p className="text-emerald-500 text-xs tracking-widest mb-1 font-mono">MODULE_01</p>
                <h3 className="text-xl font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">研究目标定义</h3>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col font-sans overflow-hidden">
              <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors shrink-0">
                构建全球五大核心经济作物（<span className="text-slate-300 group-hover:text-white transition-colors font-bold">大豆、玉米、小麦、棉花、棕榈油</span>）价格波动与中国GDP增长之间的关联模型。
              </p>
              
              <div className="flex-grow"></div>

              <div className="bg-[#0f172a] group-hover:bg-black p-3 rounded border border-slate-800 group-hover:border-emerald-900 mt-2 font-mono text-xs transition-colors shrink-0">
                <span className="text-slate-500">INPUT:</span> VOLATILITY_IDX<br/>
                <span className="text-slate-500">PROCESS:</span> ML_ALGORITHMS (XGBoost / RF)<br/>
                <span className="text-slate-500">OUTPUT:</span> GDP_FORECAST
              </div>
            </div>
          </motion.div>

          {/* Bottom Half: Data Processing Pipeline (Doughnut Chart) */}
          <motion.div
            variants={itemVariants}
            className="flex-[3] flex flex-col bg-[#0b1121]/80 border border-slate-800 rounded-lg p-6 relative overflow-hidden shadow-2xl group hover:border-blue-500/50 hover:bg-[#0f172a] transition-all pointer-events-auto"
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />

            <div className="mb-4 shrink-0 border-b border-slate-800 pb-2">
              <p className="text-blue-500 text-xs tracking-widest mb-1 font-mono">MODULE_02 // PIPELINE</p>
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-blue-400 transition-colors">数据建模技术路线</h3>
            </div>

            <div className="flex-grow min-h-0 flex items-center justify-center relative">
              <TechRouteDoughnut onNodeClick={handleCardClick} />
              <div className="absolute bottom-2 right-2 text-xs text-slate-500 font-mono flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                CLICK_NODE_FOR_DETAILS
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Feasibility Flowchart (Takes up remaining space) */}
        <motion.div
            variants={itemVariants}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick('TECH');
            }}
            className="clickable-card flex-[3] flex flex-col bg-[#0b1121]/80 border border-slate-800 rounded-lg p-6 relative overflow-hidden shadow-2xl group hover:border-cyan-500/50 hover:bg-[#0f172a] transition-all cursor-pointer pointer-events-auto"
          >
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500 transition-all duration-300 group-hover:w-4 group-hover:h-4" />

            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-2 z-20">
              <div>
                <p className="text-cyan-500 text-xs tracking-widest mb-1 font-mono">MODULE_02 // SYSTEM_ARCHITECTURE</p>
                <h3 className="text-xl font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">预测可行性分析：粮价波动宏观传导机制</h3>
              </div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                CLICK_FOR_DETAILS
              </div>
            </div>
            
            {/* Complex Flowchart Container */}
            <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden font-sans mt-2">
              <MacroFlowchart />
            </div>
          </motion.div>

      </motion.div>

      {/* Page Indicator - Terminal Style */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 items-center text-xs text-slate-600 font-mono"
      >
        <span>[01]</span>
        <span>[02]</span>
        <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">[03_ACTIVE]</span>
        <span>[04]</span>
        <span>[05]</span>
        <span>[END]</span>
      </motion.div>

        {/* Modals for Tech Route Steps */}
          {['STEP1', 'STEP2', 'STEP3', 'STEP4', 'STEP5'].includes(activeModal || '') && (
            <motion.div
              key="modal-steps"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto cursor-pointer"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0b1121] border border-blue-500/50 rounded-xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] font-sans cursor-default"
                onClick={(e) => { e.stopPropagation(); }}
              >
                <button 
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors pointer-events-auto z-50"
                  onClick={closeModal}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6 border-b border-slate-800 pb-4">
                  <p className="text-blue-500 font-mono text-sm mb-2">PIPELINE // DETAILS</p>
                  <h3 className="text-2xl font-bold text-slate-100">
                    {activeModal === 'STEP1' && "01. 数据收集 (Data Collection)"}
                    {activeModal === 'STEP2' && "02. 数据探索 (Data Exploration)"}
                    {activeModal === 'STEP3' && "03. 特征构建 (Feature Engineering)"}
                    {activeModal === 'STEP4' && "04. 模型训练 (Model Training)"}
                    {activeModal === 'STEP5' && "05. 性能评估 (Performance Evaluation)"}
                  </h3>
                </div>

                <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
                  {activeModal === 'STEP1' && (
                    <>
                      <p><strong>目标：</strong>构建匹配的宏观与高频农产品面板数据集。</p>
                      <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li><strong>被解释变量：</strong>中国季度名义 GDP 水平值（单位：亿元人民币），数据来源于国家统计局。</li>
                        <li><strong>核心解释变量：</strong>五类农产品（大豆、玉米、小麦、棉花、棕榈油）的日度/周度高频价格数据。</li>
                        <li><strong>控制变量：</strong>同步收集石油价格等宏观控制变量数据。</li>
                        <li><strong>时间跨度：</strong>收集并处理 2005–2024 年的长周期数据。</li>
                      </ul>
                    </>
                  )}
                  {activeModal === 'STEP2' && (
                    <>
                      <p><strong>目标：</strong>分析不同经济作物价格数据的波动特征和市场机制差异。</p>
                      <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>对大豆、玉米、小麦、棉花、棕榈油的价格时间序列进行平稳性检验。</li>
                        <li>分析各农产品价格波动与 GDP 之间的初步相关性与滞后性（通常存在 2-4 个季度、约 5 个月的时滞效应）。</li>
                        <li>识别数据中的缺失值与异常值，为后续特征构建提供依据。</li>
                      </ul>
                    </>
                  )}
                  {activeModal === 'STEP3' && (
                    <>
                      <p><strong>目标：</strong>将高频价格数据转化为反映市场不稳定性的季度波动指标。</p>
                      <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li><strong>核心方法：</strong>对每类作物在季度 t 内的所有日度/周度价格，计算其<span className="text-blue-400 font-bold">对数收益率的标准差</span>，作为该季度的价格波动指标。</li>
                        <li><strong>统一尺度：</strong>解决不同作物价格数据在波动特征和市场机制上的差异，在统一时间尺度下构建具有可比性的价格波动指标。</li>
                        <li><strong>特征矩阵：</strong>最终形成包含当季农产品及石油价格波动等输入特征的矩阵，用于预测同期中国 GDP 总量。</li>
                      </ul>
                    </>
                  )}
                  {activeModal === 'STEP4' && (
                    <>
                      <p><strong>目标：</strong>建立从农产品价格波动到中国GDP的预测关系，处理非线性与高维特征。</p>
                      <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li><strong>XGBoost 模型：</strong>使用高效的梯度提升树模型，自动捕捉变量间的非线性关系与高阶交互效应，对异常值鲁棒。</li>
                        <li><strong>随机森林模型：</strong>通过集成多棵决策树降低过拟合风险，在小样本（约 80 期季度数据）下稳定性较好，作为 XGBoost 的稳健性对照。</li>
                        <li><strong>调优策略：</strong>在小样本条件下合理设置超参数，谨慎平衡模型复杂度与泛化能力，防止过拟合导致虚假显著。</li>
                      </ul>
                    </>
                  )}
                  {activeModal === 'STEP5' && (
                    <>
                      <p><strong>目标：</strong>评估模型预测效果，并进行变量重要性与经济解释分析。</p>
                      <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li><strong>基准对比：</strong>引入传统计量方法 VAR（向量自回归）模型作为基准对照。</li>
                        <li><strong>量化评估：</strong>采用均方误差（MSE）、均方根误差（RMSE）、平均绝对误差（MAE）等指标量化机器学习方法的增量价值。</li>
                        <li><strong>可解释性分析：</strong>通过 SHAP（Shapley Additive Explanations）等工具输出可解释的变量重要性排序，识别关键驱动品类与传导强度。</li>
                      </ul>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        <AnimatePresence>
          {activeModal === 'WHAT' && (
            <motion.div
              key="modal-what"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto cursor-pointer"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0b1121] border border-emerald-500/50 rounded-xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.15)] font-sans cursor-default"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <button 
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors pointer-events-none"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6 border-b border-slate-800 pb-4">
                  <p className="text-emerald-500 font-mono text-sm mb-2">SYSTEM.QUERY // WHY_THESE_CROPS</p>
                  <h3 className="text-2xl font-bold text-slate-100">核心作物选择依据</h3>
                </div>

                <div className="space-y-6 text-slate-300 leading-relaxed">
                  <p>
                    根据《基于机器学习方法的全球经济作物价格波动对中国 GDP 的影响研究》，选择<strong className="text-emerald-400">大豆、玉米、小麦、棉花、棕榈油</strong>五大作物的核心原因在于：
                  </p>

                  <div className="grid grid-cols-1 gap-4 font-mono text-sm">
                    <div className="bg-[#0f172a] border border-slate-800 p-4 rounded hover:border-emerald-500/30 transition-colors">
                      <span className="text-emerald-400 block mb-1">01 // 极高的进口依存度</span>
                      <span className="text-slate-400">中国是全球最大的农产品进口国之一，特别是大豆的对外依存度常年保持在高位。这些作物的国际价格波动能直接、迅速地传导至国内经济体系。</span>
                    </div>

                    <div className="bg-[#0f172a] border border-slate-800 p-4 rounded hover:border-emerald-500/30 transition-colors">
                      <span className="text-emerald-400 block mb-1">02 // 基础产业链的源头</span>
                      <span className="text-slate-400">它们不仅是居民生活必需品，更是畜牧业、食品加工业甚至轻工业（如棉花）的绝对上游原材料。其价格波动会引发广泛的成本推动型通胀。</span>
                    </div>

                    <div className="bg-[#0f172a] border border-slate-800 p-4 rounded hover:border-emerald-500/30 transition-colors">
                      <span className="text-emerald-400 block mb-1">03 // 全球宏观的“晴雨表”</span>
                      <span className="text-slate-400">这五类作物的金融化程度深，对地缘政治、极端气候及国际资本流动极其敏感。它们的高频价格波动包含了丰富的“全球系统性风险”早期信号。</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeModal === 'TECH' && (
            <motion.div
              key="modal-tech"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto cursor-pointer"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-[95vw] h-[90vh] bg-[#0b1121] border border-cyan-500/50 rounded-xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] font-sans cursor-default flex flex-col"
                onClick={(e) => { e.stopPropagation(); }}
              >
                <button 
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors pointer-events-auto z-50"
                  onClick={closeModal}
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="mb-4 border-b border-slate-800 pb-2 shrink-0">
                  <p className="text-cyan-500 font-mono text-sm mb-1">SYSTEM.QUERY // FEASIBILITY_ANALYSIS</p>
                  <h3 className="text-2xl font-bold text-slate-100">预测可行性分析：粮价波动宏观传导机制</h3>
                </div>

                <div className="flex-grow flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
                  {/* Left: Flowchart (takes up most space) */}
                  <div className="flex-[3] bg-[#0f172a]/50 rounded-lg border border-slate-800 p-2 flex items-center justify-center overflow-hidden relative">
                     <MacroFlowchart />
                  </div>

                  {/* Right: Text explanations */}
                  <div className="flex-[1] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    <div className="grid grid-cols-1 gap-4 font-mono text-sm">
                      <div className="bg-[#0f172a] border border-slate-800 p-4 rounded hover:border-cyan-500/30 transition-colors">
                        <span className="text-cyan-400 block mb-1">FEASIBILITY_01 // 传导机制的确定性 (Causal Certainty)</span>
                        <span className="text-slate-400">如左图所示，国际粮价通过现货与期货市场双重渠道向国内传导，最终引发PPI、CPI及各项投资的连锁反应。这种宏观经济传导链条在经济学中具有极强的确定性和滞后性，为利用早期价格信号预测GDP提供了坚实的理论基础。</span>
                      </div>

                      <div className="bg-[#0f172a] border border-slate-800 p-4 rounded hover:border-cyan-500/30 transition-colors">
                        <span className="text-cyan-400 block mb-1">FEASIBILITY_02 // 数据高频与维度的优势 (Data Dimension)</span>
                        <span className="text-slate-400">传统宏观预测往往依赖低频（月度/季度）的滞后指标。而全球核心农产品的期货和现货价格是高频实时数据，能够捕捉到更早期的市场预期和通胀压力，从而在时间窗口上领先于传统GDP预测模型。</span>
                      </div>

                      <div className="bg-[#0f172a] border border-slate-800 p-4 rounded hover:border-cyan-500/30 transition-colors">
                        <span className="text-cyan-400 block mb-1">FEASIBILITY_03 // 机器学习对非线性的捕捉 (Non-linear Modeling)</span>
                        <span className="text-slate-400">粮价波动对宏观经济的影响并非简单的线性关系（如适度通胀有利，恶性通胀有害）。引入 XGBoost 等非线性机器学习算法，能够有效处理多变量间复杂的阈值效应和交叉影响，极大提高预测的准确率与鲁棒性。</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
