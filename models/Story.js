const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["public", "private"],
    lowercase: true,
    default: "public",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

StorySchema.statics.isWrittenBy = function (userId) {
  if (!user) {
    return false;
  }
  console.log(`This user: `, this.user);
  return this.user === userId;
};

module.exports = mongoose.model("Story", StorySchema);
