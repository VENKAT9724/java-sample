console.log("Welcome to the Community Portal");

const portalName = "Local Community Event Portal";
const eventDate  = "2025-08-15";
let availableSeats = 50;

const welcomeMsg = `Welcome to ${portalName}! Event on: ${eventDate}. Seats left: ${availableSeats}`;
console.log(welcomeMsg);

const events = [
  { id: 1, name: "Music Festival",  category: "music",    seats: 10, date: "2025-09-01", fee: 200 },
  { id: 2, name: "Baking Workshop", category: "workshop", seats: 0,  date: "2025-07-15", fee: 500 },
  { id: 3, name: "Sports Day",      category: "sports",   seats: 30, date: "2025-10-05", fee: 0   },
  { id: 4, name: "Food Fair",       category: "food",     seats: 20, date: "2025-08-20", fee: 150 },
  { id: 5, name: "Jazz Night",      category: "music",    seats: 15, date: "2025-09-18", fee: 300 },
];

function getValidEvents() {
  const today = new Date();
  return events.filter(e => new Date(e.date) >= today && e.seats > 0);
}

function renderEventCards() {
  const validEvents = getValidEvents();
  const container = document.querySelector("#events");
  if (!container) return;

  const oldGrid = document.querySelector(".events-grid");
  if (oldGrid) oldGrid.remove();

  const grid = document.createElement("div");
  grid.className = "events-grid";

  validEvents.forEach(event => {
    const card = createEventCard(event);
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function createEventCard(event) {
  const card = document.createElement("div");
  card.className = "eventCard";
  card.innerHTML = `
    <h3>${event.name}</h3>
    <p>📅 ${event.date} &nbsp; | &nbsp; 🏷️ ${event.category}</p>
    <p>💺 ${event.seats} seats &nbsp; | &nbsp; 💰 ${event.fee === 0 ? "Free" : "₹" + event.fee}</p>
    <button class="btn-primary" style="margin-top:10px;" onclick="handleRegisterClick('${event.name}', ${event.id})">Register</button>
    <button class="btn-secondary" style="margin-top:10px; margin-left:8px;" onclick="handleCancelClick(${event.id})">Cancel</button>
  `;
  return card;
}

function handleRegisterClick(eventName, eventId) {
  const event = events.find(e => e.id === eventId);
  if (!event || event.seats <= 0) {
    alert("No seats available!");
    return;
  }
  event.seats--;
  availableSeats--;
  renderEventCards();
  alert(`You registered for: ${eventName} ✅`);
}

function handleCancelClick(eventId) {
  const event = events.find(e => e.id === eventId);
  if (event) {
    event.seats++;
    availableSeats++;
    renderEventCards();
    alert(`Registration cancelled for: ${event.name}`);
  }
}

function validatePhone(input) {
  const phoneRegex = /^[6-9]\d{9}$/;
  const errorEl = document.getElementById("phoneError");
  if (!phoneRegex.test(input.value)) {
    errorEl.textContent = "⚠️ Please enter a valid 10-digit phone number.";
    input.style.borderColor = "#e53935";
  } else {
    errorEl.textContent = "✅ Valid number";
    errorEl.style.color = "green";
    input.style.borderColor = "#43a047";
  }
}

function showEventFee(value) {
  const fees = { music: "₹200", workshop: "₹500", sports: "Free", food: "₹150" };
  const display = document.getElementById("feeDisplay");
  display.textContent = value ? `Event fee: ${fees[value]}` : "";
}

function enlargeImage(img) {
  if (img.style.transform === "scale(1.8)") {
    img.style.transform = "scale(1)";
  } else {
    img.style.transform = "scale(1.8)";
    img.style.zIndex = "100";
    img.style.position = "relative";
  }
}

function countChars(textarea) {
  const max = 300;
  const count = textarea.value.length;
  const display = document.getElementById("charCount");
  display.textContent = `${count} / ${max} characters`;
  if (count > max) {
    textarea.value = textarea.value.substring(0, max);
    display.style.color = "red";
  } else {
    display.style.color = "#666";
  }
}

function submitForm() {
  const name      = document.getElementById("fullName").value.trim();
  const email     = document.getElementById("email").value.trim();
  const date      = document.getElementById("eventDate").value;
  const eventType = document.getElementById("eventType").value;
  const output    = document.getElementById("formOutput");

  if (!name || !email || !date || !eventType) {
    output.style.display = "block";
    output.style.background = "#ffebee";
    output.style.borderColor = "#ef9a9a";
    output.style.color = "#c62828";
    output.textContent = "⚠️ Please fill in all required fields.";
    return;
  }

  savePreference(eventType);
  postRegistration({ name, email, date, eventType });

  output.style.display = "block";
  output.style.background = "#e8f5e9";
  output.style.borderColor = "#a5d6a7";
  output.style.color = "#2e7d32";
  output.textContent = `✅ Thank you, ${name}! You're registered for ${eventType} on ${date}. Confirmation sent to ${email}.`;
}

async function postRegistration(userData) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    console.log("Registered! Server ID:", result.id);
    setTimeout(() => {
      console.log("Delayed confirmation received.");
    }, 2000);
  } catch (error) {
    console.error("POST failed:", error);
  }
}

async function fetchEventsFromAPI() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await response.json();
    console.log("Fetched data:", data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

function savePreference(value) {
  localStorage.setItem("preferredEvent", value);
  sessionStorage.setItem("sessionEvent", value);
  const status = document.getElementById("prefStatus");
  if (status) status.textContent = `✅ Preference "${value}" saved!`;
}

function loadPreference() {
  const saved = localStorage.getItem("preferredEvent");
  if (saved) {
    const select = document.getElementById("prefEventType");
    if (select) select.value = saved;
    const status = document.getElementById("prefStatus");
    if (status) status.textContent = `👋 Welcome back! Last preference: "${saved}"`;
  }
}

function clearPreferences() {
  localStorage.clear();
  sessionStorage.clear();
  const status = document.getElementById("prefStatus");
  if (status) status.textContent = "🗑️ Preferences cleared.";
  const select = document.getElementById("prefEventType");
  if (select) select.value = "";
}

function findNearbyEvents() {
  const output = document.getElementById("locationOutput");
  output.style.display = "block";
  output.textContent = "📡 Detecting your location...";

  if (!navigator.geolocation) {
    output.textContent = "❌ Geolocation is not supported by your browser.";
    return;
  }

  const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude.toFixed(4);
      const lon = position.coords.longitude.toFixed(4);
      output.innerHTML = `
        <strong>📍 Your Location:</strong><br/>
        Latitude: ${lat}<br/>
        Longitude: ${lon}<br/><br/>
        <strong>🎉 Nearby Events Found:</strong>
        <ul style="margin-top:8px;">
          <li>Music Festival — 1.2 km away</li>
          <li>Food Fair — 2.4 km away</li>
          <li>Sports Day — 3.1 km away</li>
        </ul>
      `;
    },
    function (error) {
      const messages = {
        1: "❌ Permission denied. Please allow location access.",
        2: "❌ Position unavailable. Try again.",
        3: "⏳ Request timed out. Please try again.",
      };
      output.textContent = messages[error.code] || "❌ Unknown error.";
    },
    options
  );
}

window.onload = function () {
  loadPreference();
  renderEventCards();
  fetchEventsFromAPI();
};

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitForm();
  });
});

$(document).ready(function () {
  $("#submitBtn").click(function () {
    console.log("Form submitted via jQuery");
  });
  $(document).on("mouseenter", ".eventCard", function () {
    $(this).fadeTo(200, 0.85);
  });
  $(document).on("mouseleave", ".eventCard", function () {
    $(this).fadeTo(200, 1);
  });
});
