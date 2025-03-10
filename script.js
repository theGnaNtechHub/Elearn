document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab-button");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      let target = this.getAttribute("data-tab");
      contents.forEach((content) => {
        content.style.display = "none";
      });
      document.getElementById(target).style.display = "block";
    });
  });

  document.getElementById("courses").style.display = "block"; // Show default tab
});

function validateCode() {
  let code = document.getElementById("pseudo-code").value;
  if (code.trim() === "") {
    alert("Please enter pseudo-code before running.");
    return;
  }
  alert("Pseudo-code executed successfully!");
}

function validateFlowchart() {
  alert("Flowchart validation is a work in progress!");
}
