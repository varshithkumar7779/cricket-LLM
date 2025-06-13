require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const session = require("express-session");
const passportStrategy = require("./passport");
const app = express();

app.use(
    session({
        secret: "cyberwolve", // use a secure secret in production
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use("/auth", authRoute);

const port = process.env.PORT || 8080;
app.listen(port,'0.0.0.0', () => console.log(`Listenting on port ${port}...`));