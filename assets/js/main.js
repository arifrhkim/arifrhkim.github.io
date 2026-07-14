/* =================================================================
   Arif R. — Portfolio
   All rendering reads from /data/content.json so the site content
   can be edited without touching any HTML/CSS/JS.
   ================================================================= */

async function loadContent() {
  // Primary source: data/content.json, fetched over http(s). This is what
  // GitHub Pages / Netlify / a local `python3 -m http.server` will use, and
  // it's the file to edit for content changes.
  try {
    const res = await fetch('data/content.json');
    if (!res.ok) throw new Error('Bad response for content.json');
    return await res.json();
  } catch (err) {
    // Fallback: if the page was opened directly as a file (file:// — e.g.
    // double-clicking index.html), fetch() is blocked by the browser and
    // throws. In that case, fall back to the copy embedded in the page
    // itself so the site still renders instead of showing a blank page.
    const fallback = document.getElementById('content-fallback');
    if (fallback) {
      try {
        return JSON.parse(fallback.textContent);
      } catch (parseErr) {
        console.error('Embedded fallback content is not valid JSON:', parseErr);
      }
    }
    console.error('Could not load site content:', err);
    throw err;
  }
}

function el(tag, opts = {}) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.html !== undefined) node.innerHTML = opts.html;
  if (opts.text !== undefined) node.textContent = opts.text;
  if (opts.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  }
  return node;
}

function arrowSVG() {
  return `<svg class="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="currentColor" stroke-width="1.4"/>
  </svg>`;
}

/* A generic geometric placeholder thumbnail in the dial/scale
   visual language, used until a real project image is dropped
   into assets/img/projects/ and wired up via content.json. */
function placeholderThumb(seed = 0) {
  const angle = (seed * 47) % 360;
  return `
  <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="250" fill="var(--bg-panel)"/>
    <line x1="0" y1="125" x2="400" y2="125" stroke="var(--line)" stroke-width="1"/>
    <circle cx="200" cy="125" r="54" fill="none" stroke="var(--ink)" stroke-width="1.2"/>
    <circle cx="200" cy="125" r="3" fill="var(--signal)"/>
    <line x1="200" y1="125" x2="${200 + 50 * Math.cos((angle * Math.PI) / 180)}" y2="${
      125 + 50 * Math.sin((angle * Math.PI) / 180)
    }" stroke="var(--signal)" stroke-width="1.4"/>
    ${Array.from({ length: 12 })
      .map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x1 = 200 + 60 * Math.cos(a);
        const y1 = 125 + 60 * Math.sin(a);
        const x2 = 200 + 66 * Math.cos(a);
        const y2 = 125 + 66 * Math.sin(a);
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--ink-faint)" stroke-width="1"/>`;
      })
      .join('')}
  </svg>`;
}

function renderHeader(site) {
  document.querySelectorAll('[data-header]').forEach((mount) => {
    mount.innerHTML = `
      <div class="wrap">
        <a href="index.html" class="logo">${site.name}</a>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" id="navToggle">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M0 1H16M0 6H16M0 11H16" stroke="currentColor" stroke-width="1.3"/></svg>
        </button>
        <nav class="nav" id="siteNav">
          <a href="projects.html">Projects</a>
          <a href="index.html#experience">Works</a>
          <a href="${site.resumeUrl}" target="_blank" rel="noopener">Resume</a>
          <a href="index.html#contact" class="nav-cta">Contact Me</a>
        </nav>
      </div>
    `;
  });

  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
}

function renderFooter(data) {
  const { site, cta, footer } = data;
  document.querySelectorAll('[data-footer]').forEach((mount) => {
    mount.innerHTML = `
      <div class="scale" data-label="Contact"></div>
      <div class="wrap cta" id="contact">
        <span class="mono-label mono-label--signal">${cta.heading}</span>
        <h2>${cta.sub}</h2>
        <a class="btn btn-primary" href="mailto:${site.email}">
          ${cta.buttonLabel} ${arrowSVG()}
        </a>
      </div>
      <div class="wrap footer-social">
        <span class="mono-label">${site.location}</span>
        <div class="links">
          ${site.social.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('')}
        </div>
      </div>
      <div class="wrap footer-bottom">
        <span class="mono-label">${site.year} \u00A9 ${footer.copyright}</span>
        <div class="links">
          <a href="projects.html">Projects</a>
          <a href="index.html#experience">Works</a>
          <a href="#top">Back to top</a>
        </div>
      </div>
    `;
  });
}

function projectCardHTML(p, i) {
  return `
    <article class="project-card">
      <div class="project-thumb">${placeholderThumb(i)}</div>
      <div class="project-card-top">
        <span class="mono-label">${p.tag}</span>
        <span class="project-year">${p.year}</span>
      </div>
      <h3>${p.title}</h3>
      <p class="desc">${p.description}</p>
      <a class="view-link" href="${p.href}">View Details ${arrowSVG()}</a>
    </article>
  `;
}

window.ArifSite = { loadContent, renderHeader, renderFooter, projectCardHTML, placeholderThumb, arrowSVG, el };
