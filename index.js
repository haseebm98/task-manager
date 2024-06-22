import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";

const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/logout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

app.get("/tasks", async (req, res) => {
    console.log(req.user);
    if (req.isAuthenticated()) {
      try {
        const result = await db.query(
          `SELECT id, title, description, due_date, status FROM tasks WHERE user_id = $1`,
          [req.user.id]
        );
        console.log(result.rows)
        res.render("tasks.ejs", { tasks: result.rows });
      } catch (err) {
        console.log(err);
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
});

app.get("/add-task", async (req, res) => {
    if (req.isAuthenticated()) {
        res.render("add-task.ejs");
    } else {
        res.redirect("/login");
    }
});

app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/tasks",
      failureRedirect: "/register",
    })
);
  
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (checkResult.rows.length > 0) {
      res.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
            [username, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/tasks");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/add-task", async (req, res) => {
    if (req.isAuthenticated()) {
        const { title, description, due_date, status } = req.body;
        try {
            await db.query("INSERT INTO tasks (user_id, title, description, due_date, status) values ($1, $2, $3, $4, $5)", [req.user.id, title, description, due_date, status]);
            res.redirect("/tasks"); 
        } catch (err) {
            console.log(err);
            res.redirect("/add-task");
        }
    } else {
        res.redirect("/login");
    }
});

app.post("/remove-task", async (req, res) => {
    if (req.isAuthenticated()) {
      const taskId = req.body.taskId;
      try {
        await db.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [taskId, req.user.id]);
        res.redirect("/tasks");
      } catch (err) {
        console.log(err);
        res.redirect("/tasks");
      }
    } else {
      res.redirect("/login");
    }
  });

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
