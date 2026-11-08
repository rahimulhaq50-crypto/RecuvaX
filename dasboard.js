// =====================================
// RecuvaX Dashboard - Demo JavaScript
// =====================================

// Sample file records
const sampleFiles = [
    { id: 1, name: "Vacation-Photo.jpg", type: "image", icon: "🖼️", location: "C:/Pictures", deleted: "1 hour ago", hours: 1, size: "2.4 MB", status: "Recoverable" },
    { id: 2, name: "Family-Video.mp4", type: "video", icon: "🎬", location: "D:/Videos", deleted: "3 hours ago", hours: 3, size: "18 MB", status: "Recoverable" },
    { id: 3, name: "Project-Report.pdf", type: "document", icon: "📄", location: "C:/Documents", deleted: "5 hours ago", hours: 5, size: "840 KB", status: "Recoverable" },
    { id: 4, name: "Song-Collection.mp3", type: "audio", icon: "🎵", location: "D:/Music", deleted: "7 hours ago", hours: 7, size: "5.2 MB", status: "Recoverable" },
    { id: 5, name: "Backup-Archive.zip", type: "other", icon: "📦", location: "E:/Backup", deleted: "9 hours ago", hours: 9, size: "32 MB", status: "Poor" },
    { id: 6, name: "Profile-Picture.png", type: "image", icon: "🖼️", location: "C:/Pictures", deleted: "12 hours ago", hours: 12, size: "1.8 MB", status: "Recoverable" },
    { id: 7, name: "Presentation.docx", type: "document", icon: "📄", location: "D:/Work", deleted: "14 hours ago", hours: 14, size: "1.1 MB", status: "Recoverable" },
    { id: 8, name: "Travel-Clip.mov", type: "video", icon: "🎬", location: "E:/Videos", deleted: "18 hours ago", hours: 18, size: "45 MB", status: "Poor" },
    { id: 9, name: "Voice-Note.wav", type: "audio", icon: "🎵", location: "C:/Audio", deleted: "20 hours ago", hours: 20, size: "3.5 MB", status: "Recoverable" },
    { id: 10, name: "Design-File.zip", type: "other", icon: "📦", location: "D:/Projects", deleted: "30 hours ago", hours: 30, size: "12 MB", status: "Recoverable" },
    { id: 11, name: "Wedding-Photo.jpg", type: "image", icon: "🖼️", location: "USB:/Photos", deleted: "2 hours ago", hours: 2, size: "4.1 MB", status: "Recoverable" },
    { id: 12, name: "Meeting-Notes.pdf", type: "document", icon: "📄", location: "E:/Office", deleted: "22 hours ago", hours: 22, size: "620 KB", status: "Recoverable" }
];

let currentFiles = [];
let selectedIds = new Set();
let selectedDrive = "C:";
let scanMode = "quick";
let scanTimer = null;
let recoveryTimer = null;
let scanRunning = false;

// HTML elements
const resultsBody = document.getElementById("resultsBody");
const startScanBtn = document.getElementById("startScan");
const cancelScanBtn = document.getElementById("cancelScan");
const progressArea = document.getElementById("scanProgressArea");
const progressBar = document.getElementById("scanProgressBar");
const scanPercent = document.getElementById("scanPercent");
const scanStatus = document.getElementById("scanStatus");
const selectAll = document.getElementById("selectAll");
const recoverButton = document.getElementById("recoverButton");


// =====================================
// Drive selection
// =====================================

document.querySelectorAll(".drive-card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".drive-card").forEach(item => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");
        selectedDrive = card.dataset.drive;

        document.getElementById("selectedDrive").textContent = selectedDrive;

        addHistory("Drive selected: " + selectedDrive);
    });
});


// =====================================
// Scan mode selection
// =====================================

document.querySelectorAll(".scan-mode").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".scan-mode").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        scanMode = button.dataset.mode;
    });
});


// =====================================
// Start scanning
// =====================================

startScanBtn.addEventListener("click", startScan);

function startScan() {
    if (scanRunning) return;

    scanRunning = true;
    startScanBtn.disabled = true;
    startScanBtn.textContent = "Scanning...";

    progressArea.classList.add("show");

    let progress = 0;

    progressBar.style.width = "0%";
    scanPercent.textContent = "0%";

    scanStatus.textContent = scanMode === "quick"
        ? "Running quick demo scan..."
        : "Running deep demo scan...";

    const scanDuration = scanMode === "quick" ? 4500 : 8000;
    const intervalTime = 100;

    const totalSteps = scanDuration / intervalTime;
    const increment = 100 / totalSteps;

    scanTimer = setInterval(() => {
        progress += increment;

        if (progress > 100) progress = 100;

        progressBar.style.width = progress + "%";
        scanPercent.textContent = Math.floor(progress) + "%";

        if (progress >= 100) {
            finishScan();
        }
    }, intervalTime);
}


// =====================================
// Finish scanning
// =====================================

function finishScan() {
    clearInterval(scanTimer);

    scanRunning = false;
    startScanBtn.disabled = false;
    startScanBtn.textContent = "Scan Again →";

    scanStatus.textContent = "Demo scan completed!";

    let timeValue = document.getElementById("timeFilter").value;

    let filtered = sampleFiles.filter(file => {
        if (timeValue === "all") return true;
        return file.hours <= Number(timeValue);
    });

    if (scanMode === "quick") {
        filtered = filtered.filter(file => file.status === "Recoverable");
    }

    currentFiles = filtered;

    selectedIds.clear();

    renderFiles();
    updateStats();

    document.getElementById("resultsDescription").textContent =
        "Sample results for " + selectedDrive + " — demo data only.";

    addHistory(
        scanMode.toUpperCase() + " demo scan completed. " +
        currentFiles.length + " sample files found."
    );
}


// =====================================
// Cancel scan
// =====================================

cancelScanBtn.addEventListener("click", () => {
    if (!scanRunning) return;

    clearInterval(scanTimer);

    scanRunning = false;

    startScanBtn.disabled = false;
    startScanBtn.textContent = "Start Scan →";

    scanStatus.textContent = "Scan cancelled.";

    progressArea.classList.remove("show");
});


// =====================================
// Render files in table
// =====================================

function renderFiles() {
    const searchValue = document.getElementById("searchFiles")
        .value.toLowerCase();

    const categoryValue = document.getElementById("categoryFilter").value;

    const filteredFiles = currentFiles.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchValue);

        const matchesCategory =
            categoryValue === "all" || file.type === categoryValue;

        return matchesSearch && matchesCategory;
    });

    if (filteredFiles.length === 0) {
        resultsBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    No matching sample files found.
                </td>
            </tr>
        `;
    } else {
        resultsBody.innerHTML = filteredFiles.map(file => `
            <tr>
                <td>
                    <input
                        type="checkbox"
                        class="file-checkbox"
                        data-id="${file.id}"
                        ${selectedIds.has(file.id) ? "checked" : ""}
                    >
                </td>

                <td>
                    <span class="file-name">${file.icon} ${file.name}</span>
                </td>

                <td class="file-type">${file.type}</td>
                <td>${file.location}</td>
                <td>${file.deleted}</td>
                <td>${file.size}</td>

                <td>
                    <span class="status ${file.status === "Poor" ? "poor" : ""}">
                        ${file.status}
                    </span>
                </td>

                <td>
                    <button class="table-action preview-btn" data-id="${file.id}">
                        Preview
                    </button>
                </td>
            </tr>
        `).join("");
    }

    // Checkbox events
    document.querySelectorAll(".file-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const id = Number(checkbox.dataset.id);

            if (checkbox.checked) {
                selectedIds.add(id);
            } else {
                selectedIds.delete(id);
            }

            updateStats();
        });
    });

    // Preview events
    document.querySelectorAll(".preview-btn").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);
            openPreview(id);
        });
    });

    document.getElementById("resultCount").textContent =
        filteredFiles.length + " files";

    updateStats();
}


// =====================================
// Search and category filters
// =====================================

document.getElementById("searchFiles").addEventListener("input", renderFiles);

document.getElementById("categoryFilter").addEventListener("change", renderFiles);


// =====================================
// Select all files
// =====================================

selectAll.addEventListener("change", () => {
    const searchValue = document.getElementById("searchFiles")
        .value.toLowerCase();

    const categoryValue = document.getElementById("categoryFilter").value;

    const visibleFiles = currentFiles.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchValue);
        const matchesCategory =
            categoryValue === "all" || file.type === categoryValue;

        return matchesSearch && matchesCategory;
    });

    if (selectAll.checked) {
        visibleFiles.forEach(file => selectedIds.add(file.id));
    } else {
        visibleFiles.forEach(file => selectedIds.delete(file.id));
    }

    renderFiles();
});


// =====================================
// Update dashboard statistics
// =====================================

function updateStats() {
    document.getElementById("totalFiles").textContent = currentFiles.length;

    document.getElementById("recoverableFiles").textContent =
        currentFiles.filter(file => file.status === "Recoverable").length;

    document.getElementById("selectedFiles").textContent = selectedIds.size;

    document.getElementById("selectionInfo").textContent =
        selectedIds.size + " files selected";

    recoverButton.disabled = selectedIds.size === 0;

    const visibleCheckboxes = [
        ...document.querySelectorAll(".file-checkbox")
    ];

    selectAll.checked =
        visibleCheckboxes.length > 0 &&
        visibleCheckboxes.every(box => box.checked);
}


// =====================================
// File preview modal
// =====================================

function openPreview(id) {
    const file = currentFiles.find(item => item.id === id);

    if (!file) return;

    document.getElementById("previewIcon").textContent = file.icon;
    document.getElementById("previewName").textContent = file.name;

    document.getElementById("previewDetails").textContent =
        "Type: " + file.type +
        " | Size: " + file.size +
        " | Status: " + file.status;

    document.getElementById("previewModal").classList.add("show");
}

document.getElementById("closePreview").addEventListener("click", () => {
    document.getElementById("previewModal").classList.remove("show");
});


// =====================================
// Recovery modal
// =====================================

recoverButton.addEventListener("click", () => {
    if (selectedIds.size === 0) return;

    document.getElementById("recoveryProgress").classList.remove("show");
    document.getElementById("recoveryProgressBar").style.width = "0%";

    document.getElementById("confirmRecovery").disabled = false;
    document.getElementById("confirmRecovery").textContent =
        "Confirm Demo Recovery";

    document.getElementById("recoveryModal").classList.add("show");
});

document.getElementById("closeRecovery").addEventListener("click", () => {
    clearInterval(recoveryTimer);
    document.getElementById("recoveryModal").classList.remove("show");
});


// =====================================
// Confirm simulated recovery
// =====================================

document.getElementById("confirmRecovery").addEventListener("click", () => {
    const confirmButton = document.getElementById("confirmRecovery");
    const recoveryArea = document.getElementById("recoveryProgress");
    const recoveryBar = document.getElementById("recoveryProgressBar");
    const recoveryStatus = document.getElementById("recoveryStatus");

    const destination = document.getElementById("destination").value;

    const totalSelected = selectedIds.size;

    if (totalSelected === 0) return;

    clearInterval(recoveryTimer);

    confirmButton.disabled = true;
    confirmButton.textContent = "Processing...";

    recoveryArea.classList.add("show");

    let progress = 0;

    recoveryStatus.textContent = "Simulating recovery...";

    recoveryTimer = setInterval(() => {
        progress += 5;

        recoveryBar.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(recoveryTimer);

            recoveryStatus.textContent =
                "Demo completed! " + totalSelected +
                " sample file(s) processed for " + destination + ".";

            confirmButton.textContent = "Demo Completed";

            addHistory(
                totalSelected + " sample file(s) processed. Destination: " +
                destination + ". No real files were recovered."
            );

            // Clear the selected files after the demo operation
            selectedIds.clear();

            renderFiles();
        }
    }, 100);
});


// =====================================
// Recovery history
// =====================================

function addHistory(message) {
    const historyList = document.getElementById("historyList");

    if (historyList.querySelector(".empty-state")) {
        historyList.innerHTML = "";
    }

    const entry = document.createElement("div");
    entry.className = "history-entry";

    const title = document.createElement("strong");
    title.textContent = message;

    const time = document.createElement("small");
    time.textContent = new Date().toLocaleString();

    entry.appendChild(title);
    entry.appendChild(time);

    historyList.prepend(entry);
}


// =====================================
// Mobile sidebar
// =====================================

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");

mobileMenu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

document.querySelectorAll(".side-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".side-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
        sidebar.classList.remove("open");
    });
});


// =====================================
// Initial dashboard state
// =====================================

renderFiles();
updateStats();