# Mercator Pole Explorer

An interactive web application that lets you explore how the Mercator projection distorts the world map when you change the location of the poles. Click anywhere on the map or search for a city to see what the world would look like if that location were the North Pole!

## Features

- **Interactive Map**: Click anywhere to set a new pole location
- **City Search**: Search for major cities worldwide to use as pole locations
- **Real-time Projection**: Watch the map transform as the projection recalculates
- **Beautiful Design**: Distinctive cartography-inspired aesthetic with smooth animations
- **Fully Static**: No backend required - just a single HTML file

## How It Works

The Mercator projection is a cylindrical map projection that preserves angles but severely distorts area, especially near the poles. This is why Greenland appears similar in size to Africa on standard maps, even though Africa is actually 14 times larger!

This app uses D3.js to rotate the globe before applying the Mercator projection, allowing you to see how different locations would appear if they were at the poles. Try setting the pole to:
- **Equatorial cities** (Singapore, Nairobi) - minimal distortion everywhere
- **Mid-latitude cities** (Paris, Tokyo) - interesting mixed effects
- **Extreme locations** (Ushuaia, Murmansk) - dramatic distortion patterns

## Deployment Instructions

Since this is a single static HTML file, deployment is extremely simple. Choose any of the options below:

### Option 1: GitHub Pages (Free, Easiest)

1. Create a new GitHub repository
2. Upload `index.html` to the repository
3. Go to repository Settings → Pages
4. Under "Source", select "main" branch
5. Click Save
6. Your site will be live at `https://yourusername.github.io/repository-name/`

**Quick commands:**
```bash
git init
git add index.html README.md
git commit -m "Initial commit: Mercator Pole Explorer"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

Then enable GitHub Pages in your repository settings.

### Option 2: Netlify Drop (Free, Instant)

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the `index.html` file
3. Your site is live instantly with a generated URL
4. Optional: Claim the site and customize the domain

### Option 3: Vercel (Free, Professional)

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts
4. Your site will be deployed with a `.vercel.app` URL

**Or use the web interface:**
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Click Deploy

### Option 4: Cloudflare Pages (Free, Fast CDN)

1. Go to [https://pages.cloudflare.com/](https://pages.cloudflare.com/)
2. Connect your GitHub account
3. Select your repository
4. Click "Begin setup" and then "Save and Deploy"
5. Your site will be live on Cloudflare's global CDN

### Option 5: Local Development Server

For local testing, you can use any static file server:

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js (with npx):**
```bash
npx http-server
```

**PHP:**
```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Option 6: Traditional Web Hosting

Upload `index.html` to any web hosting service via FTP/SFTP:
- Rename it to `index.html` if it isn't already
- Upload to your `public_html` or `www` directory
- Access via your domain

Works with: Bluehost, HostGator, GoDaddy, DigitalOcean, AWS S3, etc.

## Technologies Used

- **D3.js v7**: Data visualization and map projections
- **TopoJSON**: Efficient geographic data format
- **World Atlas**: Geographic boundary data
- **CSS3**: Modern styling with animations and gradients
- **Vanilla JavaScript**: No framework dependencies

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Customization

The app is contained in a single HTML file, making it easy to customize:

- **Colors**: Edit the CSS custom properties in `:root`
- **Fonts**: Change the Google Fonts import and font-family declarations
- **Cities**: Add more cities to the `cities` object in the JavaScript
- **Map Style**: Modify the `.land` CSS class for different country colors
- **Animation Speed**: Adjust the `.transition().duration()` values

## Performance Notes

- Initial load fetches ~50KB of map data from CDN
- Smooth 60fps animations on modern devices
- No external API calls after initial load
- Works completely offline after first load (if cached)

## Contributing

Feel free to fork and enhance! Some ideas:
- Add more cities to the database
- Allow custom coordinate input
- Add different map projections
- Show antipodes
- Display area distortion metrics
- Add sharing functionality

## License

MIT License - feel free to use this for any purpose!

---

**Enjoy exploring the world from different perspectives!** 🗺️
