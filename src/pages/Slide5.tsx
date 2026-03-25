import React from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Database, BarChart3, Sparkles } from "lucide-react";

const datasetCards = [
  { k: "数据范围", v: "2005–2024（按季度对齐）" },
  { k: "高频输入", v: "五大经济作物价格（大豆/玉米/小麦/棉花/棕榈油）" },
  { k: "目标变量", v: "中国季度名义 GDP（国家统计口径）" },
  { k: "核心特征", v: "季度内对数收益率波动率（Std/Var 等）" },
];

const results = [
  { label: "基线模型", value: "线性回归 / Lasso / Ridge" },
  { label: "主力模型", value: "Random Forest / XGBoost" },
  { label: "验证策略", value: "滚动窗口 + 留出集评估" },
  { label: "当前产出", value: "可复现流程 + 可视化展示页" },
];

const metricBars = [
  { name: "R²", value: 0.72, color: "bg-emerald-500/70" },
  { name: "MAE", value: 0.58, color: "bg-cyan-500/70" },
  { name: "RMSE", value: 0.63, color: "bg-blue-500/70" },
];

export default function Slide5() {
  const navigate = useNavigate();
  const videoSrc = `${import.meta.env.BASE_URL}视频/background2.mp4`;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
  };

  const handleNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    const { innerWidth } = window;
    if (clientX < innerWidth / 2) {
      navigate("/slide4");
    } else {
      navigate("/end");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans cursor-pointer"
      onClick={handleNavigation}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 min-w-full min-h-full object-cover opacity-12">
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#020617]/88" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,211,238,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:56px_56px] opacity-35" />
      </div>

      <div className="absolute top-0 left-0 w-1/2 h-full z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-start pl-8">
        <div className="bg-slate-900/70 border border-slate-700 px-4 py-2 rounded-full text-white/60 text-sm">点击返回上页</div>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full z-20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-end pr-8">
        <div className="bg-slate-900/70 border border-slate-700 px-4 py-2 rounded-full text-white/60 text-sm">点击进入下页</div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-16"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 text-emerald-300">
          <Database className="w-6 h-6" />
          <span className="text-sm tracking-[0.35em] uppercase text-emerald-300/80">Data & Results</span>
        </motion.div>

        <motion.h2 variants={itemVariants} className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
          数据介绍与阶段成果展示
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-10">
          <motion.div variants={itemVariants} className="bg-[#0b1121]/70 border border-slate-800 rounded-xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-cyan-300">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-semibold text-slate-100">数据结构概览</h3>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {datasetCards.map((x) => (
                <div key={x.k} className="border border-slate-800 rounded-lg p-4 bg-[#0f172a]/40">
                  <div className="text-xs tracking-widest text-slate-500 uppercase">{x.k}</div>
                  <div className="mt-2 text-sm text-slate-200 leading-relaxed">{x.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-slate-400 leading-relaxed">
              当前页面展示的是“结构化摘要”。后续可继续把数据清洗规则、变量字典、特征构建细节与版本记录补齐，保证结果可复现与可审计。
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#0b1121]/70 border border-slate-800 rounded-xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-purple-300">
              <BarChart3 className="w-5 h-5" />
              <h3 className="text-lg font-semibold text-slate-100">现阶段成果</h3>
            </div>

            <div className="mt-6 space-y-3">
              {results.map((r) => (
                <div key={r.label} className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3">
                  <div className="text-sm text-slate-400">{r.label}</div>
                  <div className="text-sm text-slate-200 text-right">{r.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 border border-slate-800 rounded-lg p-4 bg-[#0f172a]/40">
              <div className="text-xs tracking-widest text-slate-500 uppercase">Metrics (demo)</div>
              <div className="mt-3 space-y-3">
                {metricBars.map((m) => (
                  <div key={m.name}>
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{m.name}</span>
                      <span className="text-slate-400">{m.value.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className={["h-full rounded-full", m.color].join(" ")} style={{ width: `${Math.max(6, Math.min(100, m.value * 100))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-xs text-slate-500 tracking-widest uppercase">
              Click left/right to navigate
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-xs text-slate-600 font-mono"
      >
        <span>[01]</span>
        <span>[02]</span>
        <span>[03]</span>
        <span>[04]</span>
        <span className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">[05_ACTIVE]</span>
        <span>[END]</span>
      </motion.div>
    </div>
  );
}
