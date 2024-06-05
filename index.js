import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import mysql from "mysql2";
import morgan from "morgan";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import ProductRoute from "./routes/ProductRoute.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const port = 5000;

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/api/v1/users", UserRoute);
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/product", ProductRoute);

// store.sync();

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
