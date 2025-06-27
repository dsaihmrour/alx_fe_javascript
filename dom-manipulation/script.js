// ===== DOM: Dynamic Quote Generator with Web Storage and JSON Handling =====

let quotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");
const categoryFilter = document.getElementById("categoryFilter");

// ===== Local Storage Functions =====
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [];
}

function saveSelectedCategory() {
  localStorage.setItem("selectedCategory", categoryFilter.value);
}

function loadSelectedCategory() {
  return localStorage.getItem("selectedCategory") || "all";
}

// ===== Display & Category =====
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const opt1 = document.createElement("option");
    opt1.value = cat;
    opt1.textContent = cat;
    categorySelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = cat;
    opt2.textContent = cat;
    categoryFilter.appendChild(opt2);
  });

  categoryFilter.value = loadSelectedCategory();
}

function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;

  sessionStorage.setItem("lastQuote", quoteDisplay.textContent);
}

function filterQuotes() {
  const selected = categoryFilter.value;
  saveSelectedCategory();

  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  quoteDisplay.innerHTML = filtered.map(q => `<p>"${q.text}" — ${q.category}</p>`).join("");
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  alert("Quote added!");
}

function createAddQuoteForm() {
  const container = document.createElement("div");
  container.id = "addQuoteSection";

  container.innerHTML = `
    <h2>Add a New Quote</h2>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
    <br><br>
    <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
    <button onclick="exportToJsonFile()">Export Quotes to JSON</button>
  `;

  document.body.appendChild(container);
}

// ===== JSON Import/Export =====
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error parsing JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// ===== Initialization =====
window.onload = function () {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();

  const lastViewed = sessionStorage.getItem("lastQuote");
  if (lastViewed) {
    quoteDisplay.textContent = lastViewed;
  }

  newQuoteBtn.addEventListener("click", showRandomQuote);
  categorySelect.addEventListener("change", showRandomQuote);
  categoryFilter.addEventListener("change", filterQuotes);
};
