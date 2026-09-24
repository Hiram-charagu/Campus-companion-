const storageKey = "campusCompanionStudent";
const lecturerStorageKey = "campusCompanionLecturer";
const roleButtons = document.querySelectorAll("[data-role]");
const formButtons = document.querySelectorAll("[data-form]");
const lecturerFormButtons = document.querySelectorAll("[data-lecturer-form]");
const studentPanel = document.getElementById("studentPanel");
const lecturerPanel = document.getElementById("lecturerPanel");
const adminPanel = document.getElementById("adminPanel");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const lecturerLoginForm = document.getElementById("lecturerLoginForm");
const lecturerRegisterForm = document.getElementById("lecturerRegisterForm");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminControls = document.getElementById("adminControls");
const approveLecturerButton = document.getElementById("approveLecturerButton");
const adminLogoutButton = document.getElementById("adminLogoutButton");
const logoutButton = document.getElementById("logoutButton");
const studentName = document.getElementById("studentName");

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = `message show ${type}`;
}

function clearMessage(element) {
  element.textContent = "";
  element.className = "message";
}

function getStudent() {
  const savedStudent = localStorage.getItem(storageKey);
  return savedStudent ? JSON.parse(savedStudent) : null;
}

function getLecturer() {
  const savedLecturer = localStorage.getItem(lecturerStorageKey);
  return savedLecturer ? JSON.parse(savedLecturer) : null;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showForm(formId) {
  document.querySelectorAll("#studentPanel .form").forEach((form) => {
    form.classList.toggle("active", form.id === formId);
  });

  formButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.form === formId);
  });
}

function showLecturerForm(formId) {
  document.querySelectorAll("#lecturerPanel .form").forEach((form) => {
    form.classList.toggle("active", form.id === formId);
  });

  lecturerFormButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lecturerForm === formId);
  });
}

function showStudentPanel() {
  studentPanel.hidden = false;
  lecturerPanel.hidden = true;
  adminPanel.hidden = true;
  dashboard.classList.remove("active");
}

function showLecturerPanel() {
  studentPanel.hidden = true;
  lecturerPanel.hidden = false;
  adminPanel.hidden = true;
  dashboard.classList.remove("active");
}

function showAdminPanel() {
  studentPanel.hidden = true;
  lecturerPanel.hidden = true;
  adminPanel.hidden = false;
  dashboard.classList.remove("active");
  renderPendingLecturer();
}

function renderPendingLecturer() {
  const savedLecturer = getLecturer();
  const pendingCard = document.getElementById("pendingLecturerCard");
  const pendingName = document.getElementById("pendingLecturerName");
  const pendingEmail = document.getElementById("pendingLecturerEmail");

  pendingCard.classList.add("show");

  if (!savedLecturer) {
    pendingName.textContent = "No lecturer request";
    pendingEmail.textContent = "Lecturer registration details will appear here.";
    return;
  }

  pendingName.textContent = savedLecturer.name;
  pendingEmail.textContent = savedLecturer.approved
    ? `${savedLecturer.email} - approved`
    : `${savedLecturer.email} - waiting for approval`;
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    roleButtons.forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");

    if (button.dataset.role === "student") {
      showStudentPanel();
    } else if (button.dataset.role === "lecturer") {
      showLecturerPanel();
    } else {
      showAdminPanel();
    }
  });
});

formButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showForm(button.dataset.form);
    clearMessage(document.getElementById("loginMessage"));
    clearMessage(document.getElementById("registerMessage"));
  });
});

lecturerFormButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showLecturerForm(button.dataset.lecturerForm);
    clearMessage(document.getElementById("lecturerMessage"));
    clearMessage(document.getElementById("lecturerRegisterMessage"));
  });
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = normalizeEmail(document.getElementById("registerEmail").value);
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("registerMessage");

  if (!name || !email || !password || !confirmPassword) {
    showMessage(message, "Please fill in all registration fields.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage(message, "Please enter a valid email address.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage(message, "Password must be at least 6 characters long.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage(message, "Passwords do not match.", "error");
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify({ name, email, password }));
  registerForm.reset();
  showMessage(message, "Registration successful. You can now login.", "success");
  showForm("loginForm");
  showMessage(document.getElementById("loginMessage"), "Account created. Login with the same details.", "success");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("loginName").value.trim();
  const email = normalizeEmail(document.getElementById("loginEmail").value);
  const password = document.getElementById("loginPassword").value;
  const message = document.getElementById("loginMessage");
  const savedStudent = getStudent();

  if (!name || !email || !password) {
    showMessage(message, "Please enter your name, email, and password.", "error");
    return;
  }

  if (!savedStudent) {
    showMessage(message, "No student account found. Please register first.", "error");
    return;
  }

  const detailsMatch =
    savedStudent.name.toLowerCase() === name.toLowerCase() &&
    savedStudent.email === email &&
    savedStudent.password === password;

  if (!detailsMatch) {
    showMessage(message, "Login failed. Check that your details match your registration.", "error");
    return;
  }

  studentName.textContent = savedStudent.name;
  studentPanel.hidden = true;
  lecturerPanel.hidden = true;
  adminPanel.hidden = true;
  dashboard.classList.add("active");
  loginForm.reset();
});

lecturerRegisterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("lecturerRegisterName").value.trim();
  const email = normalizeEmail(document.getElementById("lecturerRegisterEmail").value);
  const password = document.getElementById("lecturerRegisterPassword").value;
  const confirmPassword = document.getElementById("lecturerConfirmPassword").value;
  const message = document.getElementById("lecturerRegisterMessage");

  if (!name || !email || !password || !confirmPassword) {
    showMessage(message, "Please fill in all lecturer registration fields.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage(message, "Please enter a valid email address.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage(message, "Password must be at least 6 characters long.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage(message, "Passwords do not match.", "error");
    return;
  }

  localStorage.setItem(lecturerStorageKey, JSON.stringify({
    name,
    email,
    password,
    approved: false
  }));

  lecturerRegisterForm.reset();
  showMessage(message, "Request sent. Wait for admin approval before logging in.", "info");
  showLecturerForm("lecturerLoginForm");
  showMessage(document.getElementById("lecturerMessage"), "Lecturer account is pending admin approval.", "info");
  renderPendingLecturer();
});

adminLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = normalizeEmail(document.getElementById("adminEmail").value);
  const password = document.getElementById("adminPassword").value;
  const message = document.getElementById("adminLoginMessage");

  if (email !== "admin@campus.com" || password !== "admin123") {
    showMessage(message, "Use admin@campus.com and password admin123.", "error");
    return;
  }

  clearMessage(message);
  adminLoginForm.hidden = true;
  adminControls.hidden = false;
  renderPendingLecturer();
});

approveLecturerButton.addEventListener("click", () => {
  const message = document.getElementById("adminMessage");
  const savedLecturer = getLecturer();

  if (!savedLecturer) {
    showMessage(message, "No lecturer registration found to approve.", "error");
    return;
  }

  savedLecturer.approved = true;
  localStorage.setItem(lecturerStorageKey, JSON.stringify(savedLecturer));
  showMessage(message, `${savedLecturer.name} has been approved.`, "success");
  renderPendingLecturer();
});

lecturerLoginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("lecturerLoginName").value.trim();
  const email = normalizeEmail(document.getElementById("lecturerLoginEmail").value);
  const password = document.getElementById("lecturerLoginPassword").value;
  const message = document.getElementById("lecturerMessage");
  const savedLecturer = getLecturer();

  if (!name || !email || !password) {
    showMessage(message, "Please enter your name, email, and password.", "error");
    return;
  }

  if (!savedLecturer) {
    showMessage(message, "No lecturer account found. Please register first.", "error");
    return;
  }

  const detailsMatch =
    savedLecturer.name.toLowerCase() === name.toLowerCase() &&
    savedLecturer.email === email &&
    savedLecturer.password === password;

  if (!detailsMatch) {
    showMessage(message, "Login failed. Check that your lecturer details are correct.", "error");
    return;
  }

  if (!savedLecturer.approved) {
    showMessage(message, "Your lecturer account is still waiting for admin approval.", "info");
    return;
  }

  showMessage(message, `Welcome, ${savedLecturer.name}. Lecturer login approved.`, "success");
  lecturerLoginForm.reset();
});

logoutButton.addEventListener("click", () => {
  dashboard.classList.remove("active");
  showStudentPanel();
  showForm("loginForm");
});

adminLogoutButton.addEventListener("click", () => {
  adminControls.hidden = true;
  adminLoginForm.hidden = false;
  adminLoginForm.reset();
  clearMessage(document.getElementById("adminLoginMessage"));
  clearMessage(document.getElementById("adminMessage"));
});
