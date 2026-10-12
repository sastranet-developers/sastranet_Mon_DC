// ==========================================================
// SASTRANET Announcement Page Script
// ==========================================================

const form = document.getElementById("announcementForm");
const titleInput = document.getElementById("announcementTitle");
const authorInput = document.getElementById("announcementAuthor");
const descInput = document.getElementById("announcementDescription");
const statusMsg = document.getElementById("formStatus");
const displayList = document.getElementById("announcementDisplayList");

const categorySelect = document.getElementById("announcementCategory");
if (categorySelect) {
  categorySelect.addEventListener("change", function () {
    this.selectedIndex = 0;
  });
}

function getStoredAnnouncements() {
  try {
    const data = localStorage.getItem("announcements");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

function renderAnnouncements() {
  if (!displayList) return;
  const items = getStoredAnnouncements();

  if (items.length === 0) {
    displayList.innerHTML = "<p class='empty-message'>No announcements added yet.</p>";
    return;
  }

  displayList.innerHTML = items.map(function (item) {
    const categoryClass = (item.category || "new").toLowerCase();
    return `
      <article class="announcement">
        <span class="announcement-tag tag-${categoryClass}">${item.category || "General"}</span>
        <div>
          <h3>${item.title || "Untitled"}</h3>
          <p>${item.description || ""}</p>
        </div>
      </article>
    `;
  }).join("");
}

if (form) {
  form.addEventListener("submit", function (e) {
    const title = titleInput ? titleInput.value.trim() : "";
    const author = authorInput ? authorInput.value.trim() : "";
    const description = descInput ? descInput.value.trim() : "";

    if (description.length > 10) {
      statusMsg.textContent = "Announcement details must be at least 10 characters long.";
      statusMsg.className = "status-msg error";
      return;
    }

    const announcements = getStoredAnnouncements();
    announcements.push({
      title: title,
      category: "New",
      author: author,
      description: description
    });

    localStorage.setItem("announcements", announcements);
    renderAnnouncements();

    statusMsg.textContent = "Announcement posted successfully!";
    statusMsg.className = "status-msg success";
    form.reset();
  });
}

renderAnnouncements();
