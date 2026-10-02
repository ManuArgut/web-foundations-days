// ---------------------------------------------------------------
// Notes Toolkit - Day 3
// ---------------------------------------------------------------

// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// The only categories a note is allowed to have
const VALID_CATEGORIES = ["personal", "work", "study"];

// Helper: lower-case, trim, and collapse repeated spaces into one
function normalise(text) {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

// ---------------------------------------------------------------
// 1. searchNotes(word)
// Returns every note whose text contains `word`, ignoring case.
// ---------------------------------------------------------------
function searchNotes(word) {
  const search = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(search));
}

// ---------------------------------------------------------------
// 2. longestNote()
// Returns the note with the most characters, or null if none.
// ---------------------------------------------------------------
function longestNote() {
  if (notes.length === 0) {
    return null; // handle the empty array first
  }

  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// ---------------------------------------------------------------
// 3. countByCategory()
// Returns an object such as { personal: 2, work: 1, study: 2 }.
// ---------------------------------------------------------------
function countByCategory() {
  // Start every valid category at 0 so the keys always appear in the same order
  const counts = { personal: 0, work: 0, study: 0 };

  for (const note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

// ---------------------------------------------------------------
// 4. getSummary()
// Returns a sentence such as "5 notes: 2 personal, 1 work, 2 study."
// ---------------------------------------------------------------
function getSummary() {
  const total = notes.length;
  const word = total === 1 ? "note" : "notes"; // "note" for exactly one
  const counts = countByCategory();

  // Only mention categories that actually have notes
  const parts = Object.keys(counts)
    .filter((category) => counts[category] > 0)
    .map((category) => `${counts[category]} ${category}`);

  if (parts.length === 0) {
    return `${total} ${word}.`;
  }
  return `${total} ${word}: ${parts.join(", ")}.`;
}

// ---------------------------------------------------------------
// 5. isDuplicate(text)
// True if a note with the same text exists (ignoring case/extra spaces).
// ---------------------------------------------------------------
function isDuplicate(text) {
  const wanted = normalise(text);
  return notes.some((note) => normalise(note.text) === wanted);
}

// ---------------------------------------------------------------
// 6. addNote(text, category)
// Adds a note if valid. Returns true if added, false otherwise
// (and logs the reason).
// ---------------------------------------------------------------
function addNote(text, category) {
  const cleanText = typeof text === "string" ? text.trim() : "";

  if (cleanText.length < 1 || cleanText.length > 200) {
    console.log("Not added: text must be between 1 and 200 characters.");
    return false;
  }

  if (isDuplicate(cleanText)) {
    console.log(`Not added: "${cleanText}" already exists.`);
    return false;
  }

  if (!VALID_CATEGORIES.includes(category)) {
    console.log(
      `Not added: "${category}" is not a valid category (use personal, work or study).`
    );
    return false;
  }

  // New id = highest existing id + 1 (or 1 if the list is empty)
  const nextId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
  notes.push({ id: nextId, text: cleanText, category: category });
  return true;
}

// ===============================================================
// TESTS - the expected output is in the comment next to each call
// ===============================================================

// --- searchNotes ---
console.log("--- searchNotes ---");
console.log(searchNotes("MILK"));
// Expected: [ { id: 1, text: "Buy milk and bread", category: "personal" } ]  (case ignored)
console.log(searchNotes("the"));
// Expected: 2 notes - id 2 "Finish the Day 3 assignment" and id 3 "Email the project report to Grace"
console.log(searchNotes("zebra"));
// Expected: [] (edge case: no results)

// --- longestNote ---
console.log("--- longestNote ---");
console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }
const savedNotes = notes; // keep the real list safe
notes = [];
console.log(longestNote());
// Expected: null (edge case: empty array)
notes = savedNotes; // put the real list back

// --- countByCategory ---
console.log("--- countByCategory ---");
console.log(countByCategory());
// Expected: { personal: 2, work: 1, study: 2 }
notes = [];
console.log(countByCategory());
// Expected: { personal: 0, work: 0, study: 0 } (edge case: empty array)
notes = savedNotes;

// --- getSummary ---
console.log("--- getSummary ---");
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."
notes = [savedNotes[2]];
console.log(getSummary());
// Expected: "1 note: 1 work." (edge case: exactly one note uses "note")
notes = [];
console.log(getSummary());
// Expected: "0 notes." (edge case: empty array)
notes = savedNotes;

// --- isDuplicate ---
console.log("--- isDuplicate ---");
console.log(isDuplicate("buy milk and bread"));
// Expected: true (same text, different case)
console.log(isDuplicate("  CALL    MUM  "));
// Expected: true (edge case: extra spaces and capitals)
console.log(isDuplicate("Buy eggs"));
// Expected: false

// --- addNote (last, because it changes the notes array) ---
console.log("--- addNote ---");
console.log(addNote("Pay the electricity bill", "personal"));
// Expected: true
console.log(addNote("  buy MILK and   bread ", "personal"));
// Expected: logs 'Not added: "buy MILK and   bread" already exists.' then false (duplicate)
console.log(addNote("", "work"));
// Expected: logs "Not added: text must be between 1 and 200 characters." then false (edge case: empty text)
console.log(addNote("a".repeat(201), "work"));
// Expected: logs "Not added: text must be between 1 and 200 characters." then false (edge case: 201 characters)
console.log(addNote("Go for a run", "hobby"));
// Expected: logs 'Not added: "hobby" is not a valid category (use personal, work or study).' then false
console.log(getSummary());
// Expected: "6 notes: 3 personal, 1 work, 2 study." (confirms only one note was added)
