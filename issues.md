# Issues Tracker

## Open Issues

_No open issues_

## Resolved Issues

### Issue #1: Duplicate Snapshot Detection

**Description**: Implement logic to detect when a new snapshot is identical to the previous one and remove the duplicate to save space.
**Status**: Resolved
**Priority**: High
**Resolution**: Added `areSnapshotsIdentical()` function in background.js:146-161 that compares tab URLs, titles, and pinned status. Duplicate snapshots are now skipped during save.

### Issue #2: Max Snapshots Limit

**Description**: Update the maximum number of snapshots from 50 to 100 as specified in requirements.
**Status**: Resolved
**Priority**: High
**Resolution**: Updated `maxSnapshots` constant from 50 to 100 in background.js:73.

### Issue #3: Time Span Display

**Description**: Add a time span calculator to the UI that shows the total time coverage based on interval and max snapshots (e.g., "1 hour", "2 days", "3 weeks").
**Status**: Resolved
**Priority**: Medium
**Resolution**: Added `updateTimeSpan()` function in popup.js:39-58 that calculates and displays coverage time. Updates dynamically when interval changes.

### Issue #4: Auto save interval

**Description**: Don't need to show the Update button, but auto save the interval change when it's updated. Show error message and don't save if the input isn't a valid positive number.
**Status**: Resolved
**Priority**: Medium
**Resolution**: Removed Update button from popup.html:150. Added auto-save with 1-second debounce in popup.js:16-37. Added validation with error display for invalid inputs.

### Issue #5: URL overflow

**Description**: URL in the snapshot detail page overflows. Let it wrap to next line.
**Status**: Resolved
**Priority**: Medium
**Resolution**: Added CSS word-wrap properties to .tab-url class in popup.html:141-147 to properly wrap long URLs.

### Issue #6: Show day in URL title

**Description**: in the title row, also show what day was the snapshot captured
**Status**: Resolved
**Priority**: Medium
**Resolution**: Added day display to snapshot title row in popup.js:92. Now shows format like "12/25/2023, 10:30:00 AM (Monday)" using toLocaleDateString with weekday option.

### Issue #7: Allow deleting snapshots

**Description**: Allow deleting individual snapshots, or deleting all older snapshots from certain snapshot
**Status**: Resolved
**Priority**: Medium
**Resolution**: Added delete functionality with two options: "Delete" button removes individual snapshots, "Delete Older" button removes the selected snapshot and all older ones. Added deleteSnapshot() and deleteOlderSnapshots() functions in background.js:177-204 and corresponding UI buttons with confirmation dialogs in popup.js:161-189.

## Notes

- Issues are tracked with description, status (Open/In Progress/Resolved), and priority (High/Medium/Low)
- Update status as work progresses on each issue
