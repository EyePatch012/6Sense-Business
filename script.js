// Smooth scroll for any element with data-scroll
const scrollButtons = document.querySelectorAll('[data-scroll]');
scrollButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const target = document.querySelector(btn.dataset.scroll);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Search behavior: find matching text and highlight the first match
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

function clearHighlights() {
    document.querySelectorAll('.highlighted-search').forEach((el) => {
        el.classList.remove('highlighted-search');
    });
}

function handleSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    clearHighlights();
    if (!query) return;

    const candidates = Array.from(document.querySelectorAll('h1, h2, h3, p'));
    const match = candidates.find((el) => el.textContent.toLowerCase().includes(query));

    if (match) {
        match.classList.add('highlighted-search');
        match.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => match.classList.remove('highlighted-search'), 2000);
    } else {
        alert(`No results found for "${query}".`);
    }
}

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

// Reveal animations
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.16 }
);

reveals.forEach((el) => observer.observe(el));

// INTRO SCREEN FADE OUT AFTER 5 SECONDS
window.addEventListener('load', () => {
    const intro = document.getElementById('intro-screen');
    setTimeout(() => {
        if (intro) intro.classList.add('fade-out');
    }, 4000);
});
