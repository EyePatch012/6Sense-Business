window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-enabled");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const methodGrain = document.querySelector(".method-grain");
    if (methodGrain) {
        let ticking = false;
        window.addEventListener(
            "scroll",
            () => {
                if (ticking) return;
                ticking = true;
                window.requestAnimationFrame(() => {
                    const grainShift = window.scrollY * 0.2;
                    methodGrain.style.setProperty("--grain-shift", `${grainShift.toFixed(2)}px`);
                    ticking = false;
                });
            },
            { passive: true }
        );
    }

    // Fade out intro video
    const intro = document.getElementById("intro-screen");
    const video = document.getElementById("intro-video");

    if (intro && video) {
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
    }

    // Smooth transition between pages
    const pageLinks = document.querySelectorAll("a[href]");
    pageLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

        link.addEventListener("click", (event) => {
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin) return;

            event.preventDefault();
            document.body.classList.add("page-fade-out");
            setTimeout(() => {
                window.location.href = link.href;
            }, 550);
        });
    });

    window.addEventListener("pageshow", () => {
        document.body.classList.remove("page-fade-out");
    });

    // Search button alert
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            alert("You searched for: " + searchInput.value);
        });
    }

    // Scroll-based reveal animations
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length > 0) {
        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            revealElements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("is-visible", entry.isIntersecting);
                });
            },
            { threshold: 0.2 }
        );

        revealElements.forEach((element) => observer.observe(element));
    }
});
