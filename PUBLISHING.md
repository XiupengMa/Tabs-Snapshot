# Chrome Extension Publishing Guide

## 🚀 Publishing Tabs Snapshot to Chrome Web Store

### 📋 Prerequisites
- [ ] Google account for Chrome Web Store
- [ ] $5 one-time developer registration fee
- [ ] Extension icons (✅ included in this repo)
- [ ] Extension package (use build script)

## 🔧 Step 1: Prepare Extension Package

### Build the Extension
```bash
# Make sure you're in the project directory
cd /path/to/tabs_snapshot

# Run the build script
./build-extension.sh
```

This will create:
- `tabs-snapshot-extension.zip` - Ready for upload
- `extension-package/` - Package contents

### What's Included
- ✅ `manifest.json` - Extension configuration
- ✅ `background.js` - Service worker
- ✅ `popup-react.html` - UI entry point
- ✅ `dist/` - Built React application
- ✅ `icons/` - Required extension icons (16x16, 48x48, 128x128)
- ✅ `LICENSE` - MIT license

## 🏪 Step 2: Chrome Web Store Developer Account

### Registration
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay **$5 one-time registration fee**
4. Accept Developer Agreement

## 📦 Step 3: Submit Extension

### Upload Process
1. **Click "Add a new item"**
2. **Upload ZIP file**: `tabs-snapshot-extension.zip`
3. **Fill out store listing** (see details below)

### Store Listing Information

#### Basic Info
- **Name**: Tabs Snapshot
- **Summary**: Automatically capture tab snapshots to recover from auth redirects and tab management
- **Category**: Productivity
- **Language**: English

#### Detailed Description
```
Tabs Snapshot is a powerful Chrome extension that automatically captures snapshots of your open tabs to help you recover from authentication redirects and manage your browsing sessions effectively.

🚀 KEY FEATURES

📸 Automatic Snapshots
• Configurable intervals from 1-60 minutes
• Smart duplicate detection to save storage
• Coverage calculator shows total time span
• Auto-save settings with validation

💾 Snapshot Management
• Manual snapshots with "Capture Now" button
• Maximum 100 snapshots with automatic cleanup
• Day display in snapshot titles (e.g., "Monday")
• Individual and bulk deletion options

🔄 Tab Restoration
• "Open All" - Opens all tabs from snapshot
• "Replace Current" - Closes existing tabs and opens snapshot tabs
• Individual tab opening by clicking
• Preserves pinned tab status

🎨 Modern Interface
• React-powered UI with TypeScript
• Sticky headers when scrolling through snapshots
• Accordion behavior (one snapshot open at a time)
• Auto-scroll to opened snapshots
• Compact, responsive design

💡 USE CASES
• Recover from authentication redirects that close your tabs
• Save research sessions for later
• Backup important tab configurations
• Quickly restore complex browsing setups
• Manage multiple project contexts

🔒 PRIVACY
• All data stored locally on your device
• No external servers or data transmission
• Open source with transparent code

Perfect for developers, researchers, and power users who work with multiple tabs and need reliable tab management.
```

#### Screenshots Requirements
Take 5 screenshots showing:
1. **Main popup interface** with snapshot list
2. **Expanded snapshot** showing tab details and controls
3. **Settings section** with interval configuration
4. **Delete confirmation** dialog
5. **Restored tabs** in action

**Screenshot specs**:
- **Size**: 1280x800 pixels (recommended) or 640x400
- **Format**: PNG or JPEG
- **Content**: Show actual extension functionality

#### Promotional Images (Optional but Recommended)
- **Small tile**: 440x280 pixels
- **Large tile**: 920x680 pixels
- **Marquee**: 1400x560 pixels

## 🔍 Step 4: Review Process

### Timeline
- **New developers**: 1-7 days
- **Established developers**: 1-3 days
- **Updates**: Usually within 24 hours

### Review Checklist
- [ ] Extension follows Chrome Web Store policies
- [ ] Manifest permissions are justified
- [ ] Description accurately reflects functionality
- [ ] Screenshots show actual features
- [ ] No malicious or misleading content

### Common Issues
- **Permission justification**: Clearly explain why you need tabs, storage, and alarms permissions
- **Privacy policy**: May be required if collecting user data (not applicable for this extension)
- **Functionality testing**: Ensure all features work as described

## ✅ Step 5: Post-Publication

### After Approval
1. **Extension goes live** on Chrome Web Store
2. **Get your extension URL**: `https://chrome.google.com/webstore/detail/[extension-id]`
3. **Update README.md** with Chrome Web Store link
4. **Share with users**

### Updating Your Extension
1. **Increment version** in `manifest.json`
2. **Build new package** with `./build-extension.sh`
3. **Upload new ZIP** to existing store listing
4. **Review process** (usually faster for updates)

## 🛠️ Development Notes

### Local Testing
```bash
# Load unpacked extension for testing
1. Open chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the project directory
```

### Version Management
- Use semantic versioning: `1.0.0`, `1.0.1`, `1.1.0`, etc.
- Update version in `manifest.json` before each release
- Keep changelog in README.md

## 📞 Support

### If Extension is Rejected
1. **Check email** for specific rejection reasons
2. **Fix identified issues**
3. **Resubmit** with changes
4. **Appeal if necessary** through developer dashboard

### Resources
- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Publishing Guidelines](https://developer.chrome.com/docs/webstore/publish/)

---

**Good luck with your Chrome Extension publication! 🚀**

*This extension was built with React, TypeScript, and modern web technologies for the best user experience.*