const PROFILE_KEY = "lecturer_profile";

const defaults = {
    firstName:  "John",
    lastName:   "Doe",
    email:      "john.doe@university.ac.ke",
    phone:      "+254 700 000 000",
    department: "Computer Science",
    bio:        "Lecturer in Computer Science with 8 years of experience in Operating Systems and Data Structures.",
    photo:      null
};

function getData() {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || defaults;
}

function saveData(data) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

function renderAvatar(data) {
    const avatarEl = document.getElementById("profile-avatar-display");
    if (data.photo) {
        avatarEl.innerHTML = "";
        const img = document.createElement("img");
        img.src = data.photo;
        img.alt = "Profile Photo";
        avatarEl.appendChild(img);
    } else {
        avatarEl.textContent = (data.firstName[0] + data.lastName[0]).toUpperCase();
    }
}

function loadProfile() {
    const data = getData();

    document.getElementById("first-name").value  = data.firstName;
    document.getElementById("last-name").value   = data.lastName;
    document.getElementById("email").value        = data.email;
    document.getElementById("phone").value        = data.phone;
    document.getElementById("department").value   = data.department;
    document.getElementById("bio").value          = data.bio;

    const fullName = `Dr. ${data.firstName} ${data.lastName}`;
    document.getElementById("sidebar-name").textContent    = fullName;
    document.getElementById("sidebar-dept").textContent    = data.department;
    document.getElementById("profile-fullname").textContent = fullName;

    renderAvatar(data);
    window.CampusPortal.hydrateProfile();
}

function saveProfile() {
    const first = document.getElementById("first-name").value.trim();
    const last  = document.getElementById("last-name").value.trim();
    if (!first || !last) { showToast("Name fields cannot be empty."); return; }

    const data = getData();
    data.firstName  = first;
    data.lastName   = last;
    data.email      = document.getElementById("email").value.trim();
    data.phone      = document.getElementById("phone").value.trim();
    data.department = document.getElementById("department").value;
    data.bio        = document.getElementById("bio").value.trim();

    saveData(data);
    loadProfile();
    showToast("Profile updated successfully ✅");
}

function changePassword() {
    const current = document.getElementById("current-pass").value;
    const next    = document.getElementById("new-pass").value;
    const confirm = document.getElementById("confirm-pass").value;

    if (!current || !next || !confirm) { showToast("Please fill in all password fields."); return; }
    if (next !== confirm) { showToast("New passwords do not match."); return; }
    if (next.length < 6)  { showToast("Password must be at least 6 characters."); return; }

    document.getElementById("current-pass").value = "";
    document.getElementById("new-pass").value     = "";
    document.getElementById("confirm-pass").value = "";
    showToast("Password updated successfully 🔒");
}

function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
        const data = getData();
        data.photo = ev.target.result;
        saveData(data);
        loadProfile();
        showToast("Profile photo updated ✅");
    };
    reader.readAsDataURL(file);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    document.getElementById("save-profile-btn").addEventListener("click", saveProfile);
    document.getElementById("change-pass-btn").addEventListener("click", changePassword);
    document.getElementById("change-photo-btn").addEventListener("click", () => {
        document.getElementById("photo-input").click();
    });
    document.getElementById("photo-input").addEventListener("change", handlePhotoChange);
});
