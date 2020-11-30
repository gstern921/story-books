const express = require("express");
const passport = require("passport");

const router = express.Router();

// @desc  Auth with Google
// @route GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc  Google Auth Callback
// @route GET /auth/google/callback
router.get(
  "/google/callback",
  (req, res, next) => {
    console.log(req.query);
    return next();
  },
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
