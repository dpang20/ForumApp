document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll(".report-form").forEach((function(t){t.addEventListener("submit",(function(e){e.preventDefault(),confirm("Are you sure you want to report this post?")&&t.submit()}))}))}));