// Simple icon generator for Tabs Snapshot extension
// Creates PNG icons using Canvas API (requires node-canvas or browser environment)

const fs = require('fs');

// Create SVG content for the icon
function createIconSVG(size) {
    return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <!-- Background gradient circle -->
    <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2196F3;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- Background circle -->
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="url(#bg-gradient)" />
    
    <!-- Tab layers representing snapshots -->
    <g fill="white" opacity="0.9">
        <rect x="${size * 0.2}" y="${size * 0.25}" width="${size * 0.6}" height="${size * 0.08}" rx="2"/>
        <rect x="${size * 0.2}" y="${size * 0.37}" width="${size * 0.6}" height="${size * 0.08}" rx="2"/>
        <rect x="${size * 0.2}" y="${size * 0.49}" width="${size * 0.6}" height="${size * 0.08}" rx="2"/>
        <rect x="${size * 0.2}" y="${size * 0.61}" width="${size * 0.6}" height="${size * 0.08}" rx="2"/>
    </g>
    
    <!-- Camera/snapshot indicator -->
    <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.15}" fill="#FFC107"/>
    <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.09}" fill="white"/>
</svg>`.trim();
}

// Create SVG files
const sizes = [16, 48, 128];
sizes.forEach(size => {
    const svgContent = createIconSVG(size);
    fs.writeFileSync(`icons/icon${size}.svg`, svgContent);
    console.log(`Created icons/icon${size}.svg`);
});

console.log('SVG icons created! To convert to PNG:');
console.log('1. Open create-icons.html in a browser');
console.log('2. Click download buttons to get PNG files');
console.log('3. Or use online SVG to PNG converter');
console.log('4. Place PNG files in icons/ directory as icon16.png, icon48.png, icon128.png');