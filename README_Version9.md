# Expo Lead Capture App

## How to Use

### 1. Setup

- Copy all files into a directory or GitHub repository.
- (Recommended) Use [GitHub Pages](https://pages.github.com/) for free static hosting.

### 2. Configure as Admin

- Open `admin.html` in your browser.
- Enter products, salespeople, endpoint, and user keys.
- (Optionally) Export settings as JSON for sync/backup or sync from GitHub by updating the URL in `admin.js`.

### 3. User Login

- Open `login.html`.
- Enter your user key (provided by admin).
- Enter your name.
- You’ll be redirected to `index.html` to capture leads.

### 4. Capture Leads

- Use OCR by clicking "Scan Business Card" (Tesseract.js runs in-browser).
- Edit or fill remaining fields.
- Submit to save (sent to the endpoint configured by admin).

### 5. Styling

- Change `style.css` for branding/colors.

### 6. GitHub Sync

- To sync settings from a central repo, set the correct raw GitHub URL in `admin.js` under `syncFromGithub()`.

---

## Customization & Server

- For advanced backend (saving leads/analytics), connect to your own API by changing the endpoint.
- For Google Sheets, use a Google Apps Script web endpoint (make sure to allow CORS and POST).

---

## License

MIT (use, modify, and share!).