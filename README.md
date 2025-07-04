# Tabs Snapshot

A Chrome extension that automatically captures tab snapshots to help you recover from authentication redirects and accidental tab closures.

## 🚀 Features

### 📸 Automatic Snapshots
- **Configurable intervals**: Set auto-snapshot frequency from 1-60 minutes
- **Smart duplicate detection**: Avoids saving identical snapshots to conserve storage
- **Coverage calculator**: Shows total time span covered (e.g., "8 hours", "3 days")
- **Auto-save settings**: Interval changes save automatically with validation

### 💾 Snapshot Management
- **Manual snapshots**: Click "Save Now" for immediate capture
- **Maximum 100 snapshots**: Automatic cleanup of oldest snapshots
- **Day display**: Shows weekday in snapshot titles (e.g., "Monday")
- **Individual deletion**: Remove specific snapshots with confirmation
- **Bulk deletion**: Delete selected snapshot and all older ones

### 🔄 Tab Restoration
- **Open All**: Opens all tabs from snapshot in new tabs
- **Replace Current**: Closes existing tabs and opens snapshot tabs
- **Individual tabs**: Click any tab to open it individually
- **Pinned tab support**: Preserves pinned status when restoring

### 🎨 User Interface
- **Expandable snapshots**: Click snapshot headers to view details
- **Tab count display**: Shows number of tabs in each snapshot
- **URL wrapping**: Long URLs wrap properly in the interface
- **Organized controls**: Delete buttons positioned at top of snapshot details

## 📋 Installation

### From Chrome Web Store
*Coming soon...*

### Manual Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The Tabs Snapshot icon will appear in your browser toolbar

## 🛠️ Usage

### Basic Usage
1. **Click the extension icon** to open the popup
2. **Set your preferred interval** (default: 5 minutes)
3. **Snapshots are automatically saved** at your chosen interval
4. **Click "Save Now"** for immediate manual snapshots

### Managing Snapshots
- **View snapshots**: Click any snapshot header to expand details
- **Restore tabs**: Use "Open All" or "Replace Current" buttons
- **Open individual tabs**: Click any tab entry to open it
- **Delete snapshots**: Use "Delete" for single removal or "Delete Older" for bulk cleanup

### Configuration
- **Interval setting**: Enter 1-60 minutes for auto-snapshot frequency
- **Time coverage**: See estimated coverage time based on interval and max snapshots
- **Auto-save**: Changes save automatically after 1 second delay

## 🔧 Technical Details

### Permissions
- **`tabs`**: Read tab information for snapshots
- **`storage`**: Save snapshots and settings locally
- **`alarms`**: Schedule automatic snapshots

### Storage
- Snapshots are stored locally using Chrome's storage API
- Maximum 100 snapshots (configurable in code)
- Automatic cleanup of oldest snapshots when limit reached

### Architecture
- **Manifest V3**: Uses modern Chrome extension standards
- **Service Worker**: Background script for scheduled snapshots
- **Popup Interface**: Clean, responsive UI for management

## 🐛 Known Issues

All known issues have been resolved! Check the [issues.md](./issues.md) file for historical issue tracking.

## 📁 Project Structure

```
tabs_snapshot/
├── manifest.json     # Extension configuration
├── background.js     # Service worker for auto-snapshots
├── popup.html        # Extension popup interface
├── popup.js          # Popup functionality and UI logic
├── specs.md          # Technical specifications
├── issues.md         # Issue tracking and resolutions
└── README.md         # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with full snapshot management
- Auto-snapshot with configurable intervals
- Manual snapshot creation
- Tab restoration with multiple options
- Snapshot deletion (individual and bulk)
- Smart duplicate detection
- Day display in snapshot titles
- URL wrapping and UI improvements

---

**Made with ❤️ for productivity and tab management**