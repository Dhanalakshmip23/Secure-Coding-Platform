const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   CODE EXECUTION
========================= */

app.post("/execute", async (req, res) => {
  const { code, language } = req.body;
  try {
    let output = "";

    if (language === "javascript") {
      const jsCode = code.replace(/print\((.*)\)/g, 'console.log($1)');
      const originalLog = console.log;
      let logs = [];
      console.log = (...args) => logs.push(args.join(" "));
      output = eval(jsCode);
      console.log = originalLog;
      if (logs.length > 0) return res.json({ output: logs.join("\n") });
      return res.json({ output: String(output) });

    } else if (language === "python") {
      const filePath = path.join(__dirname, "temp.py");
      fs.writeFileSync(filePath, code);
      output = execSync(`python "${filePath}"`, { stdio: 'pipe' }).toString();
      fs.unlinkSync(filePath);
      return res.json({ output });

    } else if (language === "c") {
      const filePath = path.join(__dirname, "temp.c");
      const exePath = path.join(__dirname, process.platform === "win32" ? "temp.exe" : "./temp");
      fs.writeFileSync(filePath, code);

      // Compile C code
      execSync(`gcc "${filePath}" -o "${exePath}"`);

      // Run executable
      output = execSync(`"${exePath}"`, { stdio: 'pipe' }).toString();

      fs.unlinkSync(filePath);
      fs.unlinkSync(exePath);
      return res.json({ output });

    } else if (language === "java") {
      const className = "TempJavaClass";
      const filePath = path.join(__dirname, `${className}.java`);
      let javaCode = code;

      // Wrap code in main only if user didn't write a full class
      if (!/class\s+\w+/.test(code)) {
        javaCode = `
public class ${className} {
  public static void main(String[] args) {
    ${code}
  }
}
        `;
      }

      fs.writeFileSync(filePath, javaCode);

      // Compile and run Java
      execSync(`javac "${filePath}"`);
      output = execSync(`java -cp "${__dirname}" ${className}`, { stdio: 'pipe' }).toString();

      fs.unlinkSync(filePath);
      fs.unlinkSync(path.join(__dirname, `${className}.class`));
      return res.json({ output });

    } else {
      return res.json({ output: "Language not supported." });
    }

  } catch (err) {
    return res.json({ output: err.stderr?.toString() || err.message || err.toString() });
  }
});

/* =========================
   FILE UPLOAD / PLAGIARISM
========================= */

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/plagiarism", upload.array("files"), (req, res) => {
  const files = req.files;
  if (!files || files.length < 2) return res.json({ plagiarismFound: false, matches: [] });

  function similarity(a, b) {
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    const longerLength = longer.length;
    if (longerLength === 0) return "100%";
    const same = [...shorter].filter((c, i) => c === longer[i]).length;
    return Math.floor((same / longerLength) * 100) + "%";
  }

  let matches = [];

  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      const text1 = files[i].buffer.toString();
      const text2 = files[j].buffer.toString();
      const sim = similarity(text1, text2);
      if (sim !== "0%") {
        matches.push({
          file1: files[i].originalname,
          file2: files[j].originalname,
          similarity: sim
        });
      }
    }
  }

  res.json({
    plagiarismFound: matches.length > 0,
    matches
  });
});

/* =========================
   START SERVER
========================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});