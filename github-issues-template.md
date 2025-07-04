# GitHub Issues Template

Copy and paste these into GitHub Issues manually:

## Issue #1: Duplicate Snapshot Detection ✅
**Labels**: `enhancement`, `resolved`
**Priority**: High

**Description**: Implement logic to detect when a new snapshot is identical to the previous one and remove the duplicate to save space.

**Resolution**: Added `areSnapshotsIdentical()` function in background.js:146-161 that compares tab URLs, titles, and pinned status. Duplicate snapshots are now skipped during save.

**Status**: ✅ Resolved

---

## Issue #2: Max Snapshots Limit ✅
**Labels**: `enhancement`, `resolved`
**Priority**: High

**Description**: Update the maximum number of snapshots from 50 to 100 as specified in requirements.

**Resolution**: Updated `maxSnapshots` constant from 50 to 100 in background.js:73.

**Status**: ✅ Resolved

---

## Issue #3: Time Span Display ✅
**Labels**: `enhancement`, `resolved`
**Priority**: Medium

**Description**: Add a time span calculator to the UI that shows the total time coverage based on interval and max snapshots (e.g., "1 hour", "2 days", "3 weeks").

**Resolution**: Added `updateTimeSpan()` function in popup.js:39-58 that calculates and displays coverage time. Updates dynamically when interval changes.

**Status**: ✅ Resolved

---

## Issue #4: Auto Save Interval ✅
**Labels**: `enhancement`, `resolved`
**Priority**: Medium

**Description**: Don't need to show the Update button, but auto save the interval change when it's updated. Show error message and don't save if the input isn't a valid positive number.

**Resolution**: Removed Update button from popup.html:150. Added auto-save with 1-second debounce in popup.js:16-37. Added validation with error display for invalid inputs.

**Status**: ✅ Resolved

---

## Issue #5: URL Overflow ✅
**Labels**: `bug`, `resolved`
**Priority**: Medium

**Description**: URL in the snapshot detail page overflows. Let it wrap to next line.

**Resolution**: Added CSS word-wrap properties to .tab-url class in popup.html:141-147 to properly wrap long URLs.

**Status**: ✅ Resolved

---

## Issue #6: Show Day in Snapshot Title ✅
**Labels**: `enhancement`, `resolved`
**Priority**: Medium

**Description**: In the title row, also show what day was the snapshot captured.

**Resolution**: Added day display to snapshot title row in popup.js:92. Now shows format like "12/25/2023, 10:30:00 AM (Monday)" using toLocaleDateString with weekday option.

**Status**: ✅ Resolved

---

## Issue #7: Allow Deleting Snapshots ✅
**Labels**: `enhancement`, `resolved`
**Priority**: Medium

**Description**: Allow deleting individual snapshots, or deleting all older snapshots from certain snapshot.

**Resolution**: Added delete functionality with two options: "Delete" button removes individual snapshots, "Delete Older" button removes the selected snapshot and all older ones. Added deleteSnapshot() and deleteOlderSnapshots() functions in background.js:177-204 and corresponding UI buttons with confirmation dialogs in popup.js:161-189.

**Status**: ✅ Resolved

---

## Instructions for Creating Issues:
1. Go to https://github.com/XiupengMa/Tabs-Snapshot/issues
2. Click "New issue"
3. Copy each issue title and body from above
4. Add the suggested labels
5. Create the issue and immediately close it (since it's resolved)