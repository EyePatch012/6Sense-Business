window.addEventListener("DOMContentLoaded", () => {
    const intro = document.getElementById("intro-screen");
    const video = document.getElementById("intro-video");

    // Fade out intro video
    const triggerFade = () => {
        setTimeout(() => {
            intro.classList.add("fade-out");
            setTimeout(() => {
                intro.style.display = "none";
            }, 1500);
        }, 4000);
    };

    if (video.readyState >= 3) {
        triggerFade();
    } else {
        video.addEventListener("canplaythrough", triggerFade);
    }

    // Smooth transition to about.html
    const aboutLink = document.getElementById("about-link");
    if (aboutLink) {
        aboutLink.addEventListener("click", (e) => {
            e.preventDefault();
            document.body.style.transition = "opacity 0.6s ease";
            document.body.style.opacity = 0;
            setTimeout(() => {
                window.location.href = aboutLink.href;
            }, 600);
        });
    }

    // Search button alert
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            alert("You searched for: " + searchInput.value);
        });
    }
});
