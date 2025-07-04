# Chrome Extension Specifications

## Overview

This document outlines the requirements and specifications for the Tabs Snapshot Chrome extension.

## Current Basic Implementation

- **Name**: Tabs Snapshot
- **Version**: 1.0
- **Permissions**: tabs, storage
- **Basic Features**:
  - Auto capture a snapshot of open tabs.
  - View the snapshot history.
  - Restore to previous snapshot.
  - Simple popup interface

## Requirements (To be defined)

In Snap's corp security set up, our google auth expires after certain period of time. Because of that we lose access to some internal pages and get redirected to google auth page. The google auth page clears the history of that tab so we some times can't go back to the original page even after re-gaining a new google auth session.

To address this issue, this chrome extension can take snapshot's open tabs every X minutes so we won't lose track of previously open page. We can also easily 1-click restore to previous snapshots.

1. Take Snapshot of open tabs.
   Functionality: 
    * Every X minutes, where X is configurable, take a snapshot of the open tabs. Don't need to snapshot the content of tabs but just capture the URLs and titles. 
    * The snapshot is stored locally in the browser. The snapshot can be restored to in the future. 
    * If a snapshot is identical to the previous one, delete the previous one to save space. 
    * Save up to 100 snapshots.
   UI: a input box letting user specify X. Default to 5 mins. Based on the max snapshots to save, in the UI show the total time span that can be covered, e.g. 1 hour, 2 days, 3 weeks, etc.

2. View snapshot history.
   Functionality: users can open the chrome extension and view the list of saved snapshots.
   UI: A list of snapshots. Clicking into each snapshot can see the tab titles. Clicking on any title can open the corresponding URL in a new tab. There is an option to open all the tabs, optionally close existing tabs.

## Notes

_Add any additional notes or considerations here_
