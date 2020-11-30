const express = require("express");

const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/Story");

const router = express.Router();

// @desc  Login/Landing page
// @route GET /
router.get("/", ensureGuest, (req, res) => {
  res.render(`login`, { layout: "login-layout" });
});

// @desc  Dashboard
// @route GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    // console.log(req.user);
    const { firstName: name, image, id } = req.user;
    const stories = await Story.find({ user: id }).lean();
    res.render(`dashboard`, { name, image, stories });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
