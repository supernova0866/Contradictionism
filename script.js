const icons = {
    light: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    dark: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    cobalt: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    midnight: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    sepia: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
    ivory: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
    terminal: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 10 3 3-3 3"/><path d="M12 17h7"/></svg>`
};

const articles = [
    { title: "Reality as Change: A Thesis on Identity, Truth, and Becoming", slug: "AR-T1" },
    { title: "The Art of Becoming: A Thesis on Change, Suffering, Comfort, and Ethical Growth", slug: "AR-T2" },
    { title: "On Meaning, Memory, and Living Well in an Indifferent Universe", slug: "AR-T3" },
    { title: "On Selfishness, Cooperation, and the Ethics of Survival", slug: "AR-T4" }
];

let quotes = [];

async function loadQuotes() {
    try {
        const response = await fetch('data/quotes.json');
        quotes = await response.json();
        displayRandomQuote();
    } catch (e) {
        console.error('Error loading quotes:', e);
    }
}

function displayRandomQuote() {
    if (quotes.length === 0) return;
    const container = document.getElementById('quotes-container');
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    container.innerHTML = `<div class="quote-card font-display italic opacity-75 mt-12 pt-8 border-t border-dashed border-gray-300 dark:border-gray-700">"${quote}"</div>`;
}

function setTheme(theme) {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
    const iconContainer = document.getElementById('current-theme-icon');
    if (iconContainer) iconContainer.innerHTML = icons[theme];
    const menu = document.getElementById('theme-menu');
    if (menu) menu.classList.remove('show');
}

async function loadContent(slug) {
    const contentDiv = document.getElementById('content');
    contentDiv.style.opacity = 0;
    
    let path = `articles/${slug}.html`;

    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Not found');
        contentDiv.innerHTML = await response.text();
        contentDiv.style.opacity = 1;
        window.location.hash = slug;
        
        document.querySelectorAll('nav a').forEach(a => {
            const href = a.getAttribute('href');
            a.classList.toggle('active', href === `#${slug}` || (slug === 'home' && href === '#home'));
        });
        
        // Re-attach surprise button listener if on home page
        const homeSurpriseBtn = document.getElementById('home-surprise-btn');
        if (homeSurpriseBtn) {
            homeSurpriseBtn.onclick = () => {
                const slugs = ['creed', 'manifesto', ...articles.map(a => a.slug)];
                const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];
                loadContent(randomSlug);
            };
        }
        
        displayRandomQuote();
    } catch (e) {
        contentDiv.innerHTML = "<h1>404</h1><p>Content not found.</p>";
        contentDiv.style.opacity = 1;
    }
}

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    const articleList = document.getElementById('article-list');
    if (articleList) {
        articleList.innerHTML = articles.map(a => `<li><a href="#${a.slug}">${a.title}</a></li>`).join('');
    }

    window.addEventListener('hashchange', () => {
        const slug = window.location.hash.slice(1) || 'home';
        loadContent(slug);
    });

    const themeTrigger = document.getElementById('theme-trigger');
    if (themeTrigger) {
        themeTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('theme-menu').classList.toggle('show');
        });
    }

    const mobileToggle = document.getElementById('mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('sidebar').classList.toggle('open');
        });
    }

    document.addEventListener('click', () => {
        const themeMenu = document.getElementById('theme-menu');
        const sidebar = document.getElementById('sidebar');
        if (themeMenu) themeMenu.classList.remove('show');
        if (sidebar) sidebar.classList.remove('open');
    });

    loadQuotes();
    const initialSlug = window.location.hash.slice(1) || 'home';
    loadContent(initialSlug);
});