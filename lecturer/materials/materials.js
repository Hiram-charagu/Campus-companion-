let materials = [
    { id: 1, title: "Operating Systems - Week 3 Notes", type: "pdf",   unit: "Operating Systems", uploaded: "2025-01-10" },
    { id: 2, title: "Data Structures Lecture Video",    type: "video", unit: "Data Structures",   uploaded: "2025-01-09" },
    { id: 3, title: "Database Systems Reference Book",  type: "pdf",   unit: "Database Systems",  uploaded: "2025-01-07" },
    { id: 4, title: "Networks - External Reading",      type: "link",  unit: "Networks",          uploaded: "2025-01-05" },
    { id: 5, title: "Algorithms Slides Week 1",         type: "ppt",   unit: "Algorithms",        uploaded: "2025-01-03" }
];

let nextId = 6;

const typeBadge = {
    pdf:   '<span class="badge badge-pdf">PDF</span>',
    word:  '<span class="badge badge-word">Word</span>',
    ppt:   '<span class="badge badge-ppt">PPT</span>',
    video: '<span class="badge badge-video">Video</span>',
    link:  '<span class="badge badge-link">Link</span>'
};

function renderTable(data) {
    const tbody = document.getElementById("materials-tbody");
    if (data.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="6">📭 No materials found.</td></tr>`;
        return;
    }
    tbody.innerHTML = data.map((m, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${m.title}</td>
            <td>${typeBadge[m.type] || m.type}</td>
            <td>${m.unit}</td>
            <td>${m.uploaded}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" data-action="edit" data-id="${m.id}">✏️ Edit</button>
                    <button class="btn-delete" data-action="delete" data-id="${m.id}">🗑️ Delete</button>
                </div>
            </td>
        </tr>
    `).join("");

    tbody.querySelectorAll("[data-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const materialId = Number(button.dataset.id);
            if (button.dataset.action === "edit") editMaterial(materialId);
            if (button.dataset.action === "delete") deleteMaterial(materialId);
        });
    });
}

function filterMaterials() {
    const search = document.getElementById("search-input").value.toLowerCase();
    const type   = document.getElementById("filter-type").value;
    const unit   = document.getElementById("filter-unit").value;

    const filtered = materials.filter(m => {
        const matchSearch = m.title.toLowerCase().includes(search);
        const matchType   = type === "all" || m.type === type;
        const matchUnit   = unit === "all" || m.unit.toLowerCase().replace(/\s/g, "") === unit;
        return matchSearch && matchType && matchUnit;
    });

    renderTable(filtered);
}

function deleteMaterial(id) {
    if (!confirm("Delete this material?")) return;
    materials = materials.filter(m => m.id !== id);
    filterMaterials();
    showToast("Material deleted.");
}

function editMaterial(id) {
    const m = materials.find(m => m.id === id);
    if (!m) return;
    document.getElementById("mat-title").value = m.title;
    document.getElementById("mat-type").value  = m.type;
    document.getElementById("mat-unit").value  = m.unit;
    document.getElementById("upload-modal").classList.add("active");

    document.getElementById("submit-material").onclick = () => {
        m.title = document.getElementById("mat-title").value.trim();
        m.type  = document.getElementById("mat-type").value;
        m.unit  = document.getElementById("mat-unit").value;
        closeModal();
        filterMaterials();
        showToast("Material updated.");
        resetSubmitButton();
    };
}

function resetSubmitButton() {
    document.getElementById("submit-material").onclick = submitMaterial;
}

function submitMaterial() {
    const title = document.getElementById("mat-title").value.trim();
    const type  = document.getElementById("mat-type").value;
    const unit  = document.getElementById("mat-unit").value;

    if (!title) { showToast("Please enter a title."); return; }

    const today = new Date().toISOString().split("T")[0];
    materials.unshift({ id: nextId++, title, type, unit, uploaded: today });
    closeModal();
    filterMaterials();
    showToast("Material uploaded successfully! ✅");
}

function closeModal() {
    document.getElementById("upload-modal").classList.remove("active");
    document.getElementById("mat-title").value = "";
    document.getElementById("mat-link").value  = "";
    document.getElementById("file-name-display").textContent = "";
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    renderTable(materials);

    document.getElementById("open-upload-modal").addEventListener("click", () => {
        document.getElementById("upload-modal").classList.add("active");
    });

    document.getElementById("close-upload-modal").addEventListener("click", closeModal);

    document.getElementById("submit-material").addEventListener("click", submitMaterial);

    document.getElementById("file-input").addEventListener("change", function () {
        const name = this.files[0] ? this.files[0].name : "";
        document.getElementById("file-name-display").textContent = name;
    });

    document.getElementById("search-input").addEventListener("input", filterMaterials);
    document.getElementById("filter-type").addEventListener("change", filterMaterials);
    document.getElementById("filter-unit").addEventListener("change", filterMaterials);

    document.getElementById("upload-modal").addEventListener("click", function (e) {
        if (e.target === this) closeModal();
    });
});
