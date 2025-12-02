// Search button functionality
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

searchBtn.addEventListener("click", function () {
    alert("You searched for: " + searchInput.value);
});

// INTRO SCREEN FADE OUT AFTER 5 SECONDS
window.addEventListener("load", () => {
    const intro = document.getElementById("intro-screen");

    setTimeout(() => {
        intro.classList.add("fade-out");
    }, 5000); // fade after 5 seconds
});
