import React from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flag, ListChecks, Rocket } from "lucide-react";

const milestones = [
  { title: "研究框架与选题聚焦", status: "done", detail: "确定宏观传导逻辑与变量口径" },
  { title: "数据收集与清洗", status: "done", detail: "构建多品种高频价格数据集" },
  { title: "波动指标构建", status: "done", detail: "统一频率、生成季度波动特征" },
  { title: "模型训练与评估", status: "doing", detail: "对比多模型、验证稳健性" },
  { title: "写作与展示产出", status: "todo", detail: "报告与可视化页面完善" },
];

const plans = [
  {
    title: "4.1 模型搭建与预测验证",
    points: [
      "XGBoost 模型（检验方法：交叉验证、超参搜索、SHAP 等）",
      "随机森林模型（检验方法：袋外误差 OOB、交叉验证、特征重要性 等）",
      "VAR 基准模型（检验方法：单位根/协整、AIC/BIC 滞后阶、脉冲响应/方差分解 等）",
    ],
  },
  {
    title: "4.2 其他规划",
    points: [
      "数据版本与复现记录（配置/参数快照）",
      "可视化交互与故事线优化",
      "答辩材料与演示流程准备",
    ],
  },
];

export default function Slide4() {
  const navigate = useNavigate();

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
      navigate("/slide3");
    } else {
      navigate("/slide5");
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === "done") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    if (status === "doing") return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    return "bg-slate-500/10 text-slate-300 border-slate-500/30";
  };

  const getStatusText = (status: string) => {
    if (status === "done") return "DONE";
    if (status === "doing") return "IN_PROGRESS";
    return "PLANNED";
  };

  return (
    <div
      className="relative min-h-screen w-full bg-[#0a0a0a] text-slate-200 overflow-hidden font-sans cursor-pointer"
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
        <div className="bg-slate-900/70 border border-slate-700 px-4 py-2 rounded-full text-white/60 text-sm">点击进入下页</div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-16"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 text-cyan-300">
          <Flag className="w-6 h-6" />
          <span className="text-sm tracking-[0.35em] uppercase text-cyan-300/80">Project Status</span>
        </motion.div>

        <motion.h2 variants={itemVariants} className="mt-4 text-4xl md:text-6xl font-bold leading-tight">
          项目进展与后续规划
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10">
          <motion.div variants={itemVariants} className="bg-[#0b1121]/70 border border-slate-800 rounded-xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-300">
              <ListChecks className="w-5 h-5" />
              <h3 className="text-lg font-semibold text-slate-100">阶段里程碑</h3>
            </div>

            <div className="mt-6 space-y-4">
              {milestones.map((m) => (
                <div key={m.title} className="flex gap-4">
                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-white/20">
                    <div
                      className={[
                        "w-2.5 h-2.5 rounded-full",
                        m.status === "done" ? "bg-emerald-400" : m.status === "doing" ? "bg-cyan-400" : "bg-slate-500",
                      ].join(" ")}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-base font-semibold text-slate-100">{m.title}</div>
                      <div className={["text-xs px-2 py-0.5 rounded border", getStatusStyle(m.status)].join(" ")}>
                        {getStatusText(m.status)}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-slate-400 leading-relaxed">{m.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#0b1121]/70 border border-slate-800 rounded-xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-purple-300">
              <Rocket className="w-5 h-5" />
              <h3 className="text-lg font-semibold text-slate-100">后续规划</h3>
            </div>

            <div className="mt-6 space-y-5">
              {plans.map((p) => (
                <div key={p.title} className="border border-slate-800 rounded-lg p-4 bg-[#0f172a]/40">
                  <div className="text-sm font-semibold text-slate-100">{p.title}</div>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {p.points.map((x) => (
                      <div key={x} className="text-sm text-slate-400 leading-relaxed">
                        • {x}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
        <span className="text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">[04_ACTIVE]</span>
        <span>[05]</span>
        <span>[END]</span>
      </motion.div>
    </div>
  );
}
