const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes=require("./routes/user");
const app = express();
const PORT = process.env.PORT || 7000;

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(cookieParser());

// ✅ CORS: allow backend + frontend ports
// app.use(cors({
//   origin: ["http://localhost:7000", "http://127.0.0.1:5500"], 
//   credentials: true,
// }));

// app.use(cors({ origin: "*", credentials: true }));
app.use(cors({
  origin: "http://localhost:7000", // your frontend origin
  credentials: true                // allow cookies to be sent
}));
// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use("/api/auth", authRoutes);
app.use("/users", userRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
