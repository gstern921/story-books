const moment = require("moment");
const stripTags = require("striptags");

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  truncate: function (str, len, suffix = "...") {
    if (
      typeof str !== "string" ||
      typeof len !== "number" ||
      len < 0 ||
      str.length <= len
    ) {
      return str;
    }
    const suf = typeof suffix === "string" ? suffix : "";

    return str.substring(0, len) + suf;
  },
  editIcon: function (storyUser, loggedInUser, storyId, floating = true) {
    if (storyUser._id.toString() === loggedInUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfay-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      }
      return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
    }
  },
  equals: function (val1, val2) {
    return val1 === val2;
  },
  isStoryByUser: function (story, user) {
    const result =
      user &&
      user._id &&
      story &&
      story.user &&
      story.user._id &&
      String(user._id) === String(story.user._id);

    return result;
  },
  stripTags,
};
