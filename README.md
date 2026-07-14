# Arif R. — Portfolio (static site)

A static, no-build website. Deployable as-is to GitHub Pages, Netlify, Vercel, or any static host. All visible content — bio, projects, experience, links — lives in one file, so you can update the site by editing text in GitHub, no code required.

## Structure

```
index.html              Homepage (hero, highlighted projects, experience, contact)
projects.html           Full projects index
data/content.json       ALL editable content — edit this to update the site
assets/css/style.css    Visual design (Braun / Dieter Rams inspired system)
assets/js/main.js       Renders content.json into the pages
assets/img/projects/    Put real project images here (see below)
```

## How to edit content

Open `data/content.json` in the GitHub web editor (pencil icon on the file) and change values between the quotes. Save/commit, and the live site updates automatically (if hosted on GitHub Pages/Netlify/Vercel with auto-deploy).

Key sections:

- `site` — your name, role, location, email, resume link, social links.
- `hero` — the "Available for Work" flag, headline, and bio paragraph.
  - Set `"available": false` to switch the status light to grey and change the label if you're not currently open to work.
- `projects` — an array of project objects. Add a new one by copying an existing block inside the `[ ]` and editing the fields:
  ```json
  {
    "id": "unique-id",
    "tag": "Case Study — Category",
    "title": "Project Name",
    "year": "2026",
    "description": "One or two sentences on what the project was and what you did.",
    "role": "Your Role",
    "href": "https://link-to-case-study-or-pdf"
  }
  ```
  The homepage shows the first 4 entries under "Highlighted Projects"; `projects.html` shows all of them. Reorder the array to change what's featured.
- `experience` — your work history, oldest fields first (`years`, `company`, `role`, `description`).
- `cta` / `footer` — the closing call-to-action and copyright line.

**Important:** `content.json` must stay valid JSON — every string in double quotes, commas between items, no trailing comma after the last item in a list. If the site stops loading content after an edit, check for a missing comma or quote (GitHub's editor will underline JSON errors).

### If you open index.html by double-clicking it

Browsers block `fetch()` for local files opened as `file://`, which is what happens if you just double-click `index.html` instead of running a server. To avoid a blank page in that case, each HTML file also has a backup copy of the content embedded directly in it (`<script type="application/json" id="content-fallback">`), which is used automatically only if the live fetch fails.

This means: **when you edit `data/content.json` and deploy normally (GitHub Pages, Netlify, a local server), that's the only file that matters** — the embedded fallback is just a safety net for opening the raw file locally, and it's fine for it to fall out of sync. If you want the double-click preview to reflect your latest edits too, copy the updated JSON into the matching `<script id="content-fallback">` block in `index.html` and `projects.html`.

## Adding real project images

The project cards currently show a generated placeholder (a simple dial/scale graphic) instead of a screenshot. To use real images:

1. Add an image file to `assets/img/projects/` (e.g. `samsat-redesign.jpg`).
2. In `assets/js/main.js`, inside `projectCardHTML`, replace the placeholder line:
   ```js
   <div class="project-thumb">${placeholderThumb(i)}</div>
   ```
   with:
   ```js
   <div class="project-thumb"><img src="assets/img/projects/${p.image}" alt="${p.title}"></div>
   ```
3. Add an `"image": "samsat-redesign.jpg"` field to the matching project entry in `content.json`.

## Design notes

The visual language follows Dieter Rams' ten principles as applied to Braun's product design: one warm neutral background, near-black type, a single functional signal color (used only for status, links, and active states — never decoration), hairline dividers instead of shadows or rounded cards, and a monospace face for labels/data the way a control panel prints its dial markings. The horizontal tick-mark bars between sections are the one recurring "signature" device, styled after a measuring scale.

## Local preview

No build step is required. From this folder, run any static file server, for example:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. (Opening `index.html` directly via `file://` will not work, because the page loads `data/content.json` with `fetch`, which browsers block for local files.)

## Deploying

- **GitHub Pages**: Settings → Pages → deploy from the branch root. No build step needed.
- **Netlify / Vercel**: import the repo, leave build command empty, publish directory = repo root.
