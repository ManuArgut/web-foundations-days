// ---------------------------------------------------------------
// Note Counter - Day 4
// ---------------------------------------------------------------

const MAX_CHARS = 200;
const WARNING_AT = 180;

// 1. Select all the elements once
const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

// 2. Update both counters and the warning / over classes
function updateCounts() {
  const text = noteText.value;
  const chars = text.length;

  // Words: trim, split on any run of whitespace, ignore empty pieces
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  charCount.textContent = `${chars} / ${MAX_CHARS} characters`;
  wordCount.textContent = `${words} words`;

  // toggle(name, condition) adds the class when true and removes it when false
  charCount.classList.toggle("warning", chars > WARNING_AT);
  charCount.classList.toggle("over", chars > MAX_CHARS);
}

// 3. Draft saving (localStorage)
function saveDraft() {
  if (noteText.value === "") {
    localStorage.removeItem("draft");
  } else {
    localStorage.setItem("draft", noteText.value);
  }
}

function restoreDraft() {
  const draft = localStorage.getItem("draft");
  if (draft !== null) {
    noteText.value = draft;
  }
}

// 4. Clear everything: textarea, counters and the saved draft
function clearNote() {
  noteText.value = "";
  localStorage.removeItem("draft");
  updateCounts();
  noteText.focus();
}

// 5. Theme (dark / light), remembered in localStorage
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  // The button names the mode you will switch TO
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("theme", nextTheme);
}

// 6. Event listeners
noteText.addEventListener("input", function () {
  updateCounts();
  saveDraft();
});

noteText.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    clearNote();
  }
});

clearBtn.addEventListener("click", clearNote);
themeToggle.addEventListener("click", toggleTheme);

// 7. On page load: restore the draft and theme, then update the counters
restoreDraft();
applyTheme(localStorage.getItem("theme"));
updateCounts();
