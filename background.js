chrome.runtime.onInstalled.addListener(() => {
  initializeExtension();
});

chrome.runtime.onStartup.addListener(() => {
  initializeExtension();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);
  if (request.action === "saveSnapshot") {
    saveCurrentTabs();
  } else if (request.action === "loadSnapshot") {
    loadSnapshot(request.snapshotId);
  } else if (request.action === "getSnapshots") {
    getSnapshots().then((snapshots) => sendResponse(snapshots));
    return true;
  } else if (request.action === "updateInterval") {
    updateSnapshotInterval(request.interval);
  } else if (request.action === "getSettings") {
    getSettings().then((settings) => sendResponse(settings));
    return true;
  } else if (request.action === "restoreSnapshot") {
    restoreSnapshot(request.snapshotId, request.closeExisting);
  } else if (request.action === "deleteSnapshot") {
    (async () => {
      try {
        await deleteSnapshot(request.snapshotId);
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  } else if (request.action === "deleteOlderSnapshots") {
    (async () => {
      try {
        await deleteOlderSnapshots(request.snapshotId);
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autoSnapshot") {
    saveCurrentTabs();
  }
});

async function initializeExtension() {
  const settings = await getSettings();
  const interval = settings.interval || 5;

  chrome.alarms.clear("autoSnapshot");
  chrome.alarms.create("autoSnapshot", {
    delayInMinutes: interval,
    periodInMinutes: interval,
  });

  console.log("Auto-snapshot initialized with", interval, "minute interval");
}

async function saveCurrentTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    const snapshot = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      tabs: tabs.map((tab) => ({
        url: tab.url,
        title: tab.title,
        pinned: tab.pinned,
      })),
    };

    const result = await chrome.storage.local.get(["snapshots"]);
    const snapshots = result.snapshots || [];

    // Check if this snapshot is identical to the most recent one
    if (snapshots.length > 0) {
      const lastSnapshot = snapshots[0];
      if (areSnapshotsIdentical(snapshot, lastSnapshot)) {
        console.log("Duplicate snapshot detected, skipping save");
        
        // Notify popup about duplicate detection
        try {
          chrome.runtime.sendMessage({
            type: 'duplicateSkipped',
            message: 'Duplicate snapshot skipped - no changes detected'
          });
        } catch (error) {
          // Popup might not be open, which is fine
          console.log('Could not notify popup about duplicate (popup likely closed)');
        }
        
        return;
      }
    }

    snapshots.unshift(snapshot);

    const maxSnapshots = 100;
    if (snapshots.length > maxSnapshots) {
      snapshots.splice(maxSnapshots);
    }

    await chrome.storage.local.set({ snapshots });

    console.log("Snapshot saved:", snapshot.tabs.length, "tabs");
  } catch (error) {
    console.error("Error saving snapshot:", error);
  }
}

async function getSnapshots() {
  try {
    const result = await chrome.storage.local.get(["snapshots"]);
    return result.snapshots || [];
  } catch (error) {
    console.error("Error getting snapshots:", error);
    return [];
  }
}

async function restoreSnapshot(snapshotId, closeExisting = false) {
  try {
    const snapshots = await getSnapshots();
    const snapshot = snapshots.find((s) => s.id === snapshotId);

    if (!snapshot) {
      console.error("Snapshot not found:", snapshotId);
      return;
    }

    if (closeExisting) {
      const currentTabs = await chrome.tabs.query({});
      for (const tab of currentTabs) {
        if (!tab.pinned) {
          chrome.tabs.remove(tab.id);
        }
      }
    }

    for (const tab of snapshot.tabs) {
      await chrome.tabs.create({
        url: tab.url,
        pinned: tab.pinned,
      });
    }

    console.log("Snapshot restored:", snapshot.tabs.length, "tabs");
  } catch (error) {
    console.error("Error restoring snapshot:", error);
  }
}

async function updateSnapshotInterval(interval) {
  try {
    const settings = await getSettings();
    settings.interval = interval;
    await chrome.storage.local.set({ settings });

    chrome.alarms.clear("autoSnapshot");
    chrome.alarms.create("autoSnapshot", {
      delayInMinutes: interval,
      periodInMinutes: interval,
    });

    console.log("Snapshot interval updated to", interval, "minutes");
  } catch (error) {
    console.error("Error updating interval:", error);
  }
}

function areSnapshotsIdentical(snapshot1, snapshot2) {
  if (snapshot1.tabs.length !== snapshot2.tabs.length) {
    return false;
  }

  for (let i = 0; i < snapshot1.tabs.length; i++) {
    const tab1 = snapshot1.tabs[i];
    const tab2 = snapshot2.tabs[i];

    if (
      tab1.url !== tab2.url ||
      tab1.title !== tab2.title ||
      tab1.pinned !== tab2.pinned
    ) {
      return false;
    }
  }

  return true;
}

async function getSettings() {
  try {
    const result = await chrome.storage.local.get(["settings"]);
    return result.settings || { interval: 5 };
  } catch (error) {
    console.error("Error getting settings:", error);
    return { interval: 5 };
  }
}

async function deleteSnapshot(snapshotId) {
  try {
    console.log("Deleting snapshot with ID:", snapshotId);
    const snapshots = await getSnapshots();
    console.log("Current snapshots count:", snapshots.length);
    console.log(
      "Snapshot IDs:",
      snapshots.map((s) => s.id),
    );
    const filteredSnapshots = snapshots.filter((s) => s.id !== snapshotId);
    console.log("Filtered snapshots count:", filteredSnapshots.length);
    await chrome.storage.local.set({ snapshots: filteredSnapshots });
    console.log("Snapshot deleted:", snapshotId);
    return true;
  } catch (error) {
    console.error("Error deleting snapshot:", error);
    throw error;
  }
}

async function deleteOlderSnapshots(snapshotId) {
  try {
    const snapshots = await getSnapshots();
    const snapshotIndex = snapshots.findIndex((s) => s.id === snapshotId);

    if (snapshotIndex === -1) {
      console.error("Snapshot not found:", snapshotId);
      throw new Error("Snapshot not found");
    }

    const filteredSnapshots = snapshots.slice(0, snapshotIndex + 1);
    await chrome.storage.local.set({ snapshots: filteredSnapshots });
    console.log("Older snapshots deleted from:", snapshotId);
    return true;
  } catch (error) {
    console.error("Error deleting older snapshots:", error);
    throw error;
  }
}
