let announcements = [
    {
        id: 1,
        title: "Lecture Cancelled — OS Friday Class",
        category: "cancellation",
        unit: "Operating Systems",
        message: "The Operating Systems lecture scheduled for this Friday has been cancelled due to a departmental meeting. A make-up class will be announced shortly.",
        date: "2025-01-10"
    },
    {
        id: 2,
        title: "CAT 1 — Data Structures on 20th Jan",
        category: "cat",
        unit: "Data Structures",
        message: "CAT 1 for Data Structures will be held on 20th January 2025 from 9:00 AM to 10:30 AM in Lab 3. Topics covered: Arrays, Linked Lists, Stacks, and Queues.",
        date: "2025-01-09"
    },
    {
        id: 3,
        title: "Make-up Class — Networks Saturday 10am",
        category: "makeup",
        unit: "Networks",
        message: "A make-up class for Networks will be held this Saturday at 10:00 AM in Room B204. Attendance is mandatory.",
        date: "2025-01-08"
    },
    {
        id: 4,
        title: "Project Presentations — Week 12",
        category: "presentation",
        unit: "Database Systems",
        message: "Project presentations for Database Systems will take place during Week 12. Each group will have 15 minutes to present. Submission of slides is due by Week 11 Friday.",
        date: "2025-01-06"
    }
];

let nextId = 5;
let activeFilter = "all";

const categoryLabels = {
    cancellation: "Cancellation",
    makeup:       "Make-up Class",
    cat:          "CAT Date",
    presentation: "Presentation"
};

const categoryIcons = {
    cancellation: "🚫",
    makeup:       "🔄",
    cat:          "📝",
    presentation: "🎤"
};

function renderAnnouncements(data) {
    const list = document.getElementById("announcement-list");

    if (data.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>No announcements found.</p>
            </div>`;
        return;
    }

    list.innerHTML = data.map(a => `
        <div class="ann-card ${a.category}">
            <div class="ann-body">
                <div class="ann-top">
                    <h4>${categoryIcons[a.category]} ${a.title}</h4>
                    <span class="ann-badge ${a.category}">${categoryLabels[a.category]}</span>
                </div>
                <p class="ann-message">${a.message}</p>
                <p class="ann-meta">📖 ${a.unit} &nbsp;•&nbsp; 📅 ${a.date}</p>
            </div>
            <div class="ann-actions">
                <button class="btn-edit" data-action="edit" data-id="${a.id}">✏️ Edit</button>
                <button class="btn-delete" data-action="delete" data-id="${a.id}">🗑️ Delete</button>
            </div>
        </div>
    `).join("");

    list.querySelectorAll("[data-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const announcementId = Number(button.dataset.id);
            if (button.dataset.action === "edit") editAnnouncement(announcementId);
            if (button.dataset.action === "delete") deleteAnnouncement(announcementId);
        });
    });
}

function applyFilter() {
    const filtered = activeFilter === "all"
        ? announcements
        : announcements.filter(a => a.category === activeFilter);
    renderAnnouncements(filtered);
}

function deleteAnnouncement(id) {
    if (!confirm("Delete this announcement?")) return;
    announcements = announcements.filter(a => a.id !== id);
    applyFilter();
    showToast("Announcement deleted.");
}

function editAnnouncement(id) {
    const a = announcements.find(a => a.id === id);
    if (!a) return;

    document.getElementById("ann-title").value    = a.title;
    document.getElementById("ann-category").value = a.category;
    document.getElementById("ann-unit").value      = a.unit;
    document.getElementById("ann-message").value   = a.message;
    document.getElementById("ann-modal").classList.add("active");

    document.getElementById("submit-ann").onclick = () => {
        a.title    = document.getElementById("ann-title").value.trim();
        a.category = document.getElementById("ann-category").value;
        a.unit     = document.getElementById("ann-unit").value;
        a.message  = document.getElementById("ann-message").value.trim();
        closeModal();
        applyFilter();
        showToast("Announcement updated.");
        resetSubmitButton();
    };
}

function submitAnnouncement() {
    const title    = document.getElementById("ann-title").value.trim();
    const category = document.getElementById("ann-category").value;
    const unit     = document.getElementById("ann-unit").value;
    const message  = document.getElementById("ann-message").value.trim();

    if (!title || !message) { showToast("Please fill in all fields."); return; }

    const today = new Date().toISOString().split("T")[0];
    announcements.unshift({ id: nextId++, title, category, unit, message, date: today });
    closeModal();
    applyFilter();
    showToast("Announcement posted! 📢");
}

function resetSubmitButton() {
    document.getElementById("submit-ann").onclick = submitAnnouncement;
}

function closeModal() {
    document.getElementById("ann-modal").classList.remove("active");
    document.getElementById("ann-title").value   = "";
    document.getElementById("ann-message").value = "";
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    renderAnnouncements(announcements);

    document.getElementById("open-ann-modal").addEventListener("click", () => {
        document.getElementById("ann-modal").classList.add("active");
    });

    document.getElementById("close-ann-modal").addEventListener("click", closeModal);

    document.getElementById("submit-ann").addEventListener("click", submitAnnouncement);

    document.getElementById("ann-modal").addEventListener("click", function (e) {
        if (e.target === this) closeModal();
    });

    document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeFilter = tab.dataset.filter;
            applyFilter();
        });
    });
});
