#!/bin/bash

# Build the React app
echo "Building React application..."
npm run build

# Create extension package directory
echo "Creating extension package..."
rm -rf extension-package
mkdir extension-package

# Copy required files for Chrome Web Store
cp manifest.json extension-package/
cp background.js extension-package/
cp popup-react.html extension-package/
cp -r dist extension-package/
cp LICENSE extension-package/

# Copy icons if they exist
if [ -d "icons" ]; then
    cp -r icons extension-package/
fi

# Create ZIP file for submission
echo "Creating ZIP package..."
cd extension-package
zip -r ../tabs-snapshot-extension.zip .
cd ..

echo "✅ Extension package created: tabs-snapshot-extension.zip"
echo "📁 Package contents in: extension-package/"