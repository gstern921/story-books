const path = require("path");

// App Config
require("dotenv").config({ path: "./config/config.env" });

const exphbs = require("express-handlebars");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const sanitize = require("express-mongo-sanitize");
const compression = require("compression");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// DB Config
const connectDB = require("./config/db");

// Passport Config
require("./config/passport")(passport);

const FALLBACK_PORT = 3000;
const {
  PORT = FALLBACK_PORT,
  NODE_ENV = "development",
  SESSION_SECRET,
} = process.env;

const IS_PRODUCTION = NODE_ENV === "production";
const IS_DEV = !IS_PRODUCTION;

connectDB();

const app = express();

app.set("trust proxy", 1);

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(
  "/stories",
  methodOverride(function (req, res) {
    // console.log(req.body._method);
    // console.log(typeof req.body._method);
    if (
      req.body &&
      typeof req.body === "object" &&
      "_method" in req.body &&
      typeof req.body._method === "string" &&
      ["PUT", "DELETE"].includes(req.body._method.toUpperCase())
    ) {
      // console.log("Got here");
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Use compression
app.use(compression());

// Handlebars

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main-layout",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    helpers: require("./helpers/hbs"),
  })
);
app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: !IS_DEV, httpOnly: true, sameSite: "lax" },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport Middleware

app.use(passport.initialize());
app.use(passport.session());

// Set Global Variable
app.use((req, res, next) => {
  res.locals.user = req.user;
  // console.log(res.locals.user.id);
  next();
});

// Static Folder

app.use(express.static(path.join(__dirname, "public")));

// Mongo Sanitize
app.use(sanitize());

// Routes

app.use("/", require("./routes/index"));

app.use("/auth", require("./routes/auth"));

app.use("/stories", require("./routes/stories"));

if (IS_DEV) {
  app.use(morgan("dev"));
}

app.listen(PORT, () =>
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`)
);
