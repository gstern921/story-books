const express = require("express");

const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");

const router = express.Router();

// @desc  Get Stories By User ID
// @route GET /stories/user/:id
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      $and: [
        {
          user: req.params.userId,
        },
        {
          $or: [
            {
              user: req.user.id,
            },
            {
              status: "public",
            },
          ],
        },
      ],
    }).populate({ path: "user", select: "displayName _id image" });

    // .lean();

    if (!stories) {
      return res.render("error/404");
    }

    return res.render("stories/index", { stories });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc  Get Public Stories
// @route GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate({ path: "user", select: "displayName _id image" })
      .sort({ createdAt: "desc" })
      .lean();
    return res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc  Add Story page
// @route GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render(`stories/add`, { layout: "main-layout" });
});

// @desc  Process add form
// @route POST /stories
router.post("/", ensureAuth, async (req, res) => {
  const { title, body, status } = req.body;
  try {
    await Story.create({
      title,
      body,
      status,
      user: req.user.id,
    });
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc  Get Edit Page
// @route GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user.toString() !== req.user.id) {
      return res.redirect("/stories");
    }

    return res.render("stories/edit", { story });
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc  Get Story By ID
// @route GET /stories
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      $and: [
        {
          _id: req.params.id,
        },
        {
          $or: [
            {
              user: req.user.id,
            },
            {
              status: "public",
            },
          ],
        },
      ],
    })
      .populate({ path: "user", select: "displayName _id image" })
      .lean();
    if (!story) {
      return res.render("error/404");
    }
    return res.render("stories/show", { story });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc  Update Story By ID
// @route PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    const { title, body, status } = req.body;

    let story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.render("error/404");
    } else if (story.user.toString() !== req.user.id) {
      // Only the story's author is permitted to edit it
      return res.redirect("/stories");
    }

    story = await Story.findByIdAndUpdate(
      req.params.id,
      { title, body, status },
      { new: true, runValidators: true }
    );

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc  Delete Story By ID
// @route DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const result = await Story.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });
    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

module.exports = router;
