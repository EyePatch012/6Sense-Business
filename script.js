(() => {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const feedback = document.getElementById('searchFeedback');
  const navLinks = Array.from(document.querySelectorAll('.navbar a'));
  let highlightedLink = null;

  const updateFeedback = (message, { isHTML = false, hasResult = false } = {}) => {
    if (!feedback) return;
    if (isHTML) {
      feedback.innerHTML = message;
    } else {
      feedback.textContent = message;
    }
    feedback.classList.toggle('has-result', hasResult);
  };

  const highlightLink = (link) => {
    if (highlightedLink) {
      highlightedLink.classList.remove('is-highlighted');
    }
    highlightedLink = link || null;
    if (highlightedLink) {
      highlightedLink.classList.add('is-highlighted');
    }
  };

  const runSearch = () => {
    if (!searchInput) return;
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      highlightLink(null);
      updateFeedback('Enter a keyword such as "offerings" or "insights" to jump to a page.');
      return;
    }

    const match = navLinks.find((link) => link.textContent.toLowerCase().includes(query));

    if (match) {
      highlightLink(match);
      const href = match.getAttribute('href') || '#';
      updateFeedback(`Navigate to <a href="${href}">${match.textContent}</a>`, {
        isHTML: true,
        hasResult: true,
      });
      match.focus({ preventScroll: true });
    } else {
      highlightLink(null);
      updateFeedback(`No navigation match for "${query}". Try the Insights page or send us a note.`, {
        hasResult: false,
      });
    }
  };

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', runSearch);
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        runSearch();
      }
    });
  }
})();
