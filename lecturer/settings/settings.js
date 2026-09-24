const SETTINGS_KEY = "lecturer_settings";

const defaults = {
    notifAdmin: true,
    notifUpload: true,
    notifCat: true,
    notifEmail: false,
    darkMode: false,
    compactSidebar: false,
    language: "en"
};

function getSettings() {
    try {
        return { ...defaults, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) };
    } catch {
        return defaults;
    }
}

function loadSettings() {
    const saved = getSettings();
    document.getElementById("notif-admin").checked = saved.notifAdmin;
    document.getElementById("notif-upload").checked = saved.notifUpload;
    document.getElementById("notif-cat").checked = saved.notifCat;
    document.getElementById("notif-email").checked = saved.notifEmail;
    document.getElementById("dark-mode").checked = saved.darkMode;
    document.getElementById("compact-sidebar").checked = saved.compactSidebar;
    document.getElementById("language-select").value = saved.language;
}

function saveSettings() {
    const settings = {
        notifAdmin: document.getElementById("notif-admin").checked,
        notifUpload: document.getElementById("notif-upload").checked,
        notifCat: document.getElementById("notif-cat").checked,
        notifEmail: document.getElementById("notif-email").checked,
        darkMode: document.getElementById("dark-mode").checked,
        compactSidebar: document.getElementById("compact-sidebar").checked,
        language: document.getElementById("language-select").value
    };

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.CampusPortal.applyPreferences();
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();

    document.getElementById("dark-mode").addEventListener("change", (event) => {
        saveSettings();
        showToast(event.target.checked ? "Dark mode enabled." : "Light mode enabled.");
    });

    document.getElementById("compact-sidebar").addEventListener("change", (event) => {
        saveSettings();
        showToast(event.target.checked ? "Compact sidebar enabled." : "Full sidebar restored.");
    });

    ["notif-admin", "notif-upload", "notif-cat", "notif-email"].forEach((id) => {
        document.getElementById(id).addEventListener("change", () => {
            saveSettings();
            showToast("Notification preference saved.");
        });
    });

    document.getElementById("language-select").addEventListener("change", () => {
        saveSettings();
        showToast("Language preference saved.");
    });

    document.getElementById("logout-btn").addEventListener("click", () => {
        if (!window.confirm("Are you sure you want to log out?")) return;
        showToast("Logging out...");
        window.setTimeout(() => {
            window.location.href = "../dashboard/dashboard.html";
        }, 900);
    });
});
