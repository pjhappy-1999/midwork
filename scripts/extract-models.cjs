const fs = require("fs");
const path = require("path");
const PDFParser = require("pdf2json");

async function main() {
  try {
    const pdfPath = path.resolve(process.cwd(), "work", "开题报告1.1.pdf");
    if (!fs.existsSync(pdfPath)) {
      console.error(JSON.stringify({ error: "PDF_NOT_FOUND", path: pdfPath }));
      process.exit(2);
    }
    const text = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      pdfParser.on("pdfParser_dataError", (err) => reject(err.parserError || err));
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const pages = pdfData?.formImage?.Pages || [];
          const all = [];
          for (const p of pages) {
            const txs = p.Texts || [];
            for (const t of txs) {
              const str = (t.R || []).map((r) => decodeURIComponent(r.T || "")).join("");
              all.push(str);
            }
            all.push("\n");
          }
          resolve(all.join("\n"));
        } catch (e) {
          reject(e);
        }
      });
      pdfParser.loadPDF(pdfPath);
    });
    const lines = String(text).split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

    function norm(s) {
      return s.toLowerCase().replace(/\s+/g, "").replace(/[·•．\.\-—_]/g, "");
    }
    function grab(keywords) {
      const idx = lines.findIndex((l) =>
        keywords.some((k) => norm(l).includes(norm(k)))
      );
      if (idx === -1) return [];
      const out = [];
      for (let i = idx; i < Math.min(lines.length, idx + 30); i++) {
        const s = lines[i];
        if (
          i !== idx &&
          /^(X\s*G\s*B\s*O\s*O\s*S\s*T|随机森林|V\s*A\s*R|4\.\d+(\.\d+)?)/i.test(s)
        )
          break;
        if (i === idx) continue; // skip the heading line itself
        const cleaned = s.replace(/^[-•·\s]+/, "");
        if (cleaned.length > 0) out.push(cleaned);
        if (out.length >= 5) break;
      }
      return out;
    }

    function grabByHeading(headings) {
      const idx = lines.findIndex((l) =>
        headings.some((h) => new RegExp(h, "i").test(l))
      );
      if (idx === -1) return [];
      const out = [];
      for (let i = idx + 1; i < Math.min(lines.length, idx + 40); i++) {
        const s = lines[i];
        if (/^4\.\d+(\.\d+)?\s*/.test(s) || /^(X\s*G\s*B\s*O\s*O\s*S\s*T|随机森林|V\s*A\s*R)\b/i.test(s)) break;
        const cleaned = s.replace(/^[-•·\s]+/, "");
        if (cleaned.length > 0) out.push(cleaned);
        if (out.length >= 6) break;
      }
      return out;
    }

    let xgb = grab(["XGBoost", "X GBoost", "X G B o o s t", "XGB", "提升树", "极端梯度提升"]);
    let rf = grab(["随机森林", "Random Forest", "Random-Forest", "RF算法"]);
    let varm = grab([
      "VAR 基准模型",
      "基准 VAR",
      "VAR模型",
      "向量自回归",
      "Vector Autoregression",
    ]);

    if (xgb.length === 0) xgb = grabByHeading(["^4\\.1\\.1\\b", "X\\s*G\\s*B\\s*O\\s*O\\s*S\\s*T", "极端梯度提升"]);
    if (rf.length === 0) rf = grabByHeading(["^4\\.1\\.2\\b", "随机森林", "Random\\s*Forest"]);
    if (varm.length === 0) varm = grabByHeading(["^4\\.1\\.3\\b", "\\bVAR\\b", "向量自回归"]);

    const result = { xgboost: xgb, randomForest: rf, varModel: varm };
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(JSON.stringify({ error: String(e) }));
    process.exit(1);
  }
}

main();
