document.addEventListener("DOMContentLoaded", function () {
  M.FormSelect.init(document.querySelector("#status"));
  M.Sidenav.init(document.querySelector(".sidenav"));
  if (typeof CKEDITOR !== "undefined") {
    CKEDITOR.replace("body", {
      plugins: "wysiwygarea, toolbar, basicstyles, link",
    });
  }
});
