let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Life is really simple, but we insist on making it complicated.", category: "Philosophy" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");

// Populate dropdown with unique categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Show a random quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}

// Add a new quote to the array
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });
  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  alert("Quote added!");
}

// Dynamically create the form to add a new quote
function createAddQuoteForm() {
  const container = document.createElement("div");
  container.id = "addQuoteSection";

  const heading = document.createElement("h2");
  heading.textContent = "Add a New Quote";
  container.appendChild(heading);

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  container.appendChild(textInput);

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  container.appendChild(categoryInput);

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.onclick = addQuote;
  container.appendChild(button);

  document.body.appendChild(container);
}

// Setup
populateCategories();
createAddQuoteForm();

newQuoteBtn.addEventListener("click", showRandomQuote);
categorySelect.addEventListener("change", showRandomQuote);
