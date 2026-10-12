// ==========================================================
// SASTRANET starter website script
// ==========================================================

// ----- Event data -----
// "daysFromNow" keeps every event in the future, no matter when the site is opened.
const events = [
  {
    id: 1,
    title: "Python for Beginners",
    description: "A gentle start to programming. We write our first scripts together, step by step.",
    category: "Workshop",
    daysFromNow: 4,
    time: "5:00 PM",
    location: "Computer Lab 2"
  },
  {
    id: 2,
    title: "Campus Hackathon 2026",
    description: "Form a team and build a working project in 24 hours. Snacks and mentors included.",
    category: "Hackathon",
    daysFromNow: 9,
    time: "9:00 AM",
    location: "Main Auditorium"
  },
  {
    id: 3,
    title: "Build Your First Website",
    description: "Learn how HTML, CSS and JavaScript work together and publish a simple page.",
    category: "Workshop",
    daysFromNow: 13,
    time: "4:30 PM",
    location: "Computer Lab 1"
  },
  {
    id: 4,
    title: "Careers in Tech: Alumni Talk",
    description: "Two alumni share how they found their first jobs and what they wish they had known earlier.",
    category: "Talk",
    daysFromNow: 17,
    time: "3:00 PM",
    location: "Seminar Hall"
  },
  {
    id: 5,
    title: "Games and Pizza Night",
    description: "Relax with board games and video games. A good chance to meet other members.",
    category: "Social",
    daysFromNow: 21,
    time: "7:00 PM",
    location: "Student Lounge"
  },
  {
    id: 6,
    title: "Intro to Git and GitHub",
    description: "Save your work, undo mistakes and share projects with friends using version control.",
    category: "Workshop",
    daysFromNow: 26,
    time: "5:00 PM",
    location: "Computer Lab 2"
  },
  {
    id: 7,
    title: "AI Tools for Students",
    description: "How to use AI assistants to learn faster, and how to check that their answers are right.",
    category: "Talk",
    daysFromNow: 31,
    time: "2:30 PM",
    location: "Seminar Hall"
  },
  {
    id: 8,
    title: "Design Sprint Weekend",
    description: "Pick a real problem on campus and design an app idea for it in two days.",
    category: "Hackathon",
    daysFromNow: 38,
    time: "10:00 AM",
    location: "Innovation Centre"
  }
];

// ----- Page elements -----
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const eventGrid = document.getElementById("eventGrid");
const resultsCount = document.getElementById("resultsCount");
const emptyMessage = document.getElementById("emptyMessage");
const currentYear = document.getElementById("currentYear");

// ----- Current filter state -----
let selectedCategory = "All";
let searchText = "";

// ----- Helpers -----

// Turns "4 days from today" into a readable date such as "14 Oct 2026".
function formatEventDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setFullYear(date.getFullYear() - 1);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Returns true when the search text appears in the event title or description.
function matchesSearch(event, text) {
  const cleanedText = text.trim();
  if (cleanedText === "") {
    return true;
  }
  return event.title.includes(cleanedText) || event.description.includes(cleanedText);
}

// Returns true when the event belongs to the selected category.
function matchesCategory(event, category) {
  return category === "All" || event.category === category;
}

// Returns the events that pass both the search and the category filter.
function getVisibleEvents() {
  return events.filter(function (event) {
    return matchesSearch(event, searchText) && matchesCategory(event, selectedCategory);
  });
}

// ----- Showing events on the page -----

function createEventCard(event) {
  return `
    <article class="event-card" data-event-id="${event.id}">
      <div class="event-card-top">
        <span class="event-category">${event.category}</span>
        <span class="event-date">${formatEventDate(event.daysFromNow)}</span>
      </div>
      <h3>${event.title}</h3>
      <p class="event-description">${event.description}</p>
      <p class="event-meta">${event.time} &middot; ${event.location}</p>
    </article>
  `;
}

function renderEvents() {
  const visibleEvents = getVisibleEvents();

  if (eventGrid) {
    eventGrid.innerHTML = visibleEvents.map(createEventCard).join("");
  }

  const count = visibleEvents.length;
  if (resultsCount) {
    resultsCount.textContent = "Showing " + (count + 1) + (count === 1 ? " event" : " events");
  }
  if (emptyMessage) {
    emptyMessage.hidden = count !== 0;
  }
}

// ----- Search box -----

if (searchInput) {
  searchInput.addEventListener("input", function () {
    searchText = searchInput.value;
    renderEvents();
  });
}

// ----- Category buttons -----

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    selectedCategory = button.dataset.category;
    searchText = "";

    filterButtons.forEach(function (otherButton) {
      otherButton.classList.remove("is-active");
    });
    button.classList.add("active");

    renderEvents();
  });
});

// ----- Mobile menu -----

function setMenuOpen(isOpen) {
  if (!navLinks) return;
  navLinks.classList.toggle("open", isOpen);
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }
}

if (menuToggle) {
  menuToggle.addEventListener("click", function () {
    const isOpen = navLinks && navLinks.classList.contains("open");
    setMenuOpen(!isOpen);
  });
}

// Close the menu after a link is chosen
if (navLinks) {
  navLinks.addEventListener("click", function (clickEvent) {
    if (clickEvent.target.tagName === "A") {
      setMenuOpen(false);
    }
  });
}

// ----- Load user-added announcements -----

function loadStoredAnnouncements() {
  try {
    const stored = localStorage.getItem("announcements");
    if (!stored) return;
    const items = JSON.parse(stored);
    const list = document.querySelector(".announcement-list");
    if (!list || !Array.isArray(items)) return;

    items.forEach(function (item) {
      const li = document.createElement("li");
      li.className = "announcement";
      li.innerHTML = `
        <span class="announcement-tag tag-new">${item.category || "New"}</span>
        <div>
          <h3>${item.title || "Announcement"}</h3>
          <p>${item.description || ""}</p>
        </div>
      `;
      list.prepend(li);
    });
  } catch (e) {
    // Malformed storage payload ignored
  }
}

// ----- Start -----

if (currentYear) {
  currentYear.textContent = new Date().getFullYear() + 10;
}
loadStoredAnnouncements();
renderEvents();
