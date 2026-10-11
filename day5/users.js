// ---------------------------------------------------------------
// User Directory - Day 5
// ---------------------------------------------------------------

const API_URL = "https://jsonplaceholder.typicode.com/users";

// 1. Select the elements
const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

// 2. All loaded users are stored here, so filtering never needs a new request
let allUsers = [];

// Show a message in #status (isError turns it red)
function setStatus(message, isError) {
  statusText.textContent = message;
  statusText.className = isError ? "error" : "";
}

// 3. Draw any array of users (the full list or a filtered one)
function renderUsers(list) {
  usersList.textContent = "";   // empty the list first

  if (list.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No users match your filter.";
    usersList.append(empty);
    return;
  }

  list.forEach(function (user) {
    const item = document.createElement("li");
    item.className = "user-card";

    const name = document.createElement("h2");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = "Email: " + user.email;

    const city = document.createElement("p");
    city.textContent = "City: " + user.address.city;

    const company = document.createElement("p");
    company.textContent = "Company: " + user.company.name;

    item.append(name, email, city, company);
    usersList.append(item);
  });
}

// 4. Keep only users whose name contains the typed text (not case-sensitive)
function filterUsers() {
  const text = filterInput.value.trim().toLowerCase();
  return allUsers.filter(function (user) {
    return user.name.toLowerCase().includes(text);
  });
}

// 5. Fetch the users from the API
async function loadUsers() {
  setStatus("Loading users...", false);
  loadButton.disabled = true;           // stop double clicks while loading

  try {
    const response = await fetch(API_URL);

    // fetch only fails on network problems, so we must check response.ok ourselves
    if (!response.ok) {
      throw new Error("Server responded with status " + response.status);
    }

    allUsers = await response.json();
    renderUsers(filterUsers());         // respects any text already in the filter box
    setStatus("Loaded " + allUsers.length + " users.", false);
  } catch (error) {
    allUsers = [];
    usersList.textContent = "";
    setStatus("Could not load users: " + error.message, true);
  } finally {
    loadButton.disabled = false;        // runs on success AND on error
  }
}

// 6. Events
loadButton.addEventListener("click", loadUsers);

// Filtering uses the stored array, so no new request is made
filterInput.addEventListener("input", function () {
  if (allUsers.length === 0) {
    return;                             // nothing loaded yet
  }
  const matches = filterUsers();
  renderUsers(matches);
  setStatus("Showing " + matches.length + " of " + allUsers.length + " users.", false);
});
