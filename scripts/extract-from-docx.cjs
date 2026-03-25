const path = require("path");
const fs = require("fs");
const mammoth = require("mammoth");

function toLines(html) {
  const text = html
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\r?\n+/g, "\n")
    .trim();
  return text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
}

function norm(s) {
  return s.toLowerCase().replace(/\s+/g, "").replace(/[·•．\.\-—_]/g, "");
}

function grabSections(lines, patterns) {
  const idx = lines.findIndex((l) => patterns.some((p) => new RegExp(p, "i").test(l)));
  if (idx === -1) return [];
  const out = [];
  for (let i = idx + 1; i < Math.min(lines.length, idx + 60); i++) {
    const s = lines[i];
    if (/^4\.\d+(\.\d+)?\s*/.test(s)) break;
    out.push(s.replace(/^[-•·\s]+/, ""));
    if (out.length >= 8) break;
  }
  return out.filter(Boolean);
}

function grabAround(lines, keywords) {
  const idx = lines.findIndex((l) => keywords.some((k) => norm(l).includes(norm(k))));
  if (idx === -1) return [];
  const out = [];
  for (let i = idx + 1; i < Math.min(lines.length, idx + 20); i++) {
    const s = lines[i];
    if (/^\d+(\.\d+)+\s*/.test(s)) break;
    out.push(s.replace(/^[-•·\s]+/, ""));
    if (out.length >= 6) break;
  }
  return out.filter(Boolean);
}

async function main() {
  const docxPath = path.resolve(process.cwd(), "work", "3部分编写.docx");
  const altPath = path.resolve(process.cwd(), "work", "开题报告1.1.docx");
  const usePath = fs.existsSync(docxPath) ? docxPath : altPath;
  if (!fs.existsSync(usePath)) {
    console.error(JSON.stringify({ error: "DOCX_NOT_FOUND", path: usePath }));
    process.exit(2);
  }
  const { value: html } = await mammoth.convertToHtml({ path: usePath });
  const lines = toLines(html);
  let xgb = grabSections(lines, ["^4\\.1\\.1\\b", "XGBoost", "极端梯度提升"]);
  let rf = grabSections(lines, ["^4\\.1\\.2\\b", "随机森林", "Random\\s*Forest"]);
  let varm = grabSections(lines, ["^4\\.1\\.3\\b", "\\bVAR\\b", "向量自回归"]);
  if (xgb.length === 0) xgb = grabAround(lines, ["XGBoost", "极端梯度提升", "提升树"]);
  if (rf.length === 0) rf = grabAround(lines, ["随机森林", "Random Forest"]);
  if (varm.length === 0) varm = grabAround(lines, ["VAR", "向量自回归"]);
  console.log(JSON.stringify({ xgboost: xgb, randomForest: rf, varModel: varm }, null, 2));
}

main().catch((e) => {
  console.error(JSON.stringify({ error: String(e) }));
  process.exit(1);
});
