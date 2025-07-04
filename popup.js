document.addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.getElementById("saveSnapshot");
  const intervalInput = document.getElementById("intervalInput");
  const snapshotsList = document.getElementById("snapshotsList");
  const timeSpan = document.getElementById("timeSpan");
  const errorMessage = document.getElementById("errorMessage");

  loadSettings();
  loadSnapshots();

  saveBtn.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "saveSnapshot" });
    setTimeout(loadSnapshots, 100);
  });

  intervalInput.addEventListener("input", function () {
    const value = this.value;
    const interval = parseInt(value);

    clearTimeout(this.saveTimeout);
    hideError();

    if (!value || value.trim() === "") {
      return;
    }

    if (isNaN(interval) || interval < 1 || interval > 60) {
      showError("Please enter a number between 1 and 60");
      return;
    }

    updateTimeSpan(interval);

    this.saveTimeout = setTimeout(() => {
      chrome.runtime.sendMessage({
        action: "updateInterval",
        interval: interval,
      });
    }, 1000);
  });

  async function loadSettings() {
    chrome.runtime.sendMessage({ action: "getSettings" }, function (settings) {
      const interval = settings.interval || 5;
      intervalInput.value = interval;
      updateTimeSpan(interval);
    });
  }

  function updateTimeSpan(interval) {
    const maxSnapshots = 100;
    const totalMinutes = interval * maxSnapshots;
    const totalHours = totalMinutes / 60;
    const totalDays = totalHours / 24;
    const totalWeeks = totalDays / 7;

    let timeSpanText;
    if (totalMinutes < 60) {
      timeSpanText = `${totalMinutes} minutes`;
    } else if (totalHours < 24) {
      timeSpanText = `${Math.round(totalHours)} hours`;
    } else if (totalDays < 7) {
      timeSpanText = `${Math.round(totalDays)} days`;
    } else {
      timeSpanText = `${Math.round(totalWeeks)} weeks`;
    }

    timeSpan.textContent = `Coverage: ~${timeSpanText}`;
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  function hideError() {
    errorMessage.style.display = "none";
  }

  async function loadSnapshots() {
    chrome.runtime.sendMessage(
      { action: "getSnapshots" },
      function (snapshots) {
        renderSnapshots(snapshots);
      },
    );
  }

  function renderSnapshots(snapshots) {
    if (!snapshots || snapshots.length === 0) {
      snapshotsList.innerHTML =
        '<div class="empty-state">No snapshots yet</div>';
      return;
    }

    snapshotsList.innerHTML = snapshots
      .map((snapshot) => {
        const date = new Date(snapshot.timestamp);
        const timeStr = date.toLocaleString();
        const dayStr = date.toLocaleDateString("en-US", { weekday: "long" });

        return `
        <div class="snapshot-item" data-id="${snapshot.id}">
          <div class="snapshot-header">
            <div class="snapshot-time">${timeStr} (${dayStr})</div>
            <div class="snapshot-count">${snapshot.tabs.length} tabs</div>
          </div>
          <div class="snapshot-tabs" id="tabs-${snapshot.id}">
            <div class="delete-options">
              <button class="delete delete-btn" data-id="${snapshot.id}">
                Delete
              </button>
              <button class="delete delete-older-btn" data-id="${snapshot.id}">
                Delete Older
              </button>
            </div>
            <div class="restore-options">
              <button class="secondary restore-btn" data-id="${
                snapshot.id
              }" data-close="false">
                Open All
              </button>
              <button class="secondary restore-btn" data-id="${
                snapshot.id
              }" data-close="true">
                Replace Current
              </button>
            </div>
            ${snapshot.tabs
              .map(
                (tab) => `
              <div class="tab-item" data-url="${tab.url}">
                <div class="tab-title">${tab.title}</div>
                <div class="tab-url">${tab.url}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `;
      })
      .join("");

    document.querySelectorAll(".snapshot-item").forEach((item) => {
      item.addEventListener("click", function (e) {
        if (
          e.target.classList.contains("restore-btn") ||
          e.target.classList.contains("tab-item") ||
          e.target.classList.contains("delete-btn") ||
          e.target.classList.contains("delete-older-btn")
        ) {
          return;
        }

        const tabsDiv = this.querySelector(".snapshot-tabs");
        tabsDiv.classList.toggle("expanded");
      });
    });

    document.querySelectorAll(".tab-item").forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();
        const url = this.getAttribute("data-url");
        chrome.tabs.create({ url: url });
      });
    });

    document.querySelectorAll(".restore-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const snapshotId = this.getAttribute("data-id");
        const closeExisting = this.getAttribute("data-close") === "true";

        chrome.runtime.sendMessage({
          action: "restoreSnapshot",
          snapshotId: snapshotId,
          closeExisting: closeExisting,
        });
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const snapshotId = this.getAttribute("data-id");
        console.log("Delete button clicked for snapshot ID:", snapshotId);

        if (confirm("Are you sure you want to delete this snapshot?")) {
          chrome.runtime.sendMessage(
            {
              action: "deleteSnapshot",
              snapshotId: snapshotId,
            },
            function (response) {
              console.log("Delete response:", response);
              if (response && response.success) {
                loadSnapshots();
              } else {
                console.error(
                  "Delete failed:",
                  response ? response.error : "No response",
                );
              }
            },
          );
        }
      });
    });

    document.querySelectorAll(".delete-older-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const snapshotId = this.getAttribute("data-id");

        if (
          confirm(
            "Are you sure you want to delete this snapshot and all older snapshots?",
          )
        ) {
          chrome.runtime.sendMessage(
            {
              action: "deleteOlderSnapshots",
              snapshotId: snapshotId,
            },
            function (response) {
              console.log("Delete older response:", response);
              if (response && response.success) {
                loadSnapshots();
              } else {
                console.error(
                  "Delete older failed:",
                  response ? response.error : "No response",
                );
              }
            },
          );
        }
      });
    });
  }
});
