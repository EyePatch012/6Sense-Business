window.addEventListener("DOMContentLoaded", () => {
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.scrollBehavior = "smooth";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
        const methodGrain = document.querySelector(".method-grain");
        if (!methodGrain) {
            return;
        }
        let scrollTicking = false;
        const updateGrain = () => {
            methodGrain.style.setProperty("--grain-shift", `${(window.scrollY * 0.12).toFixed(2)}px`);
            scrollTicking = false;
        };
        window.addEventListener("scroll", () => {
            if (!scrollTicking) {
                scrollTicking = true;
                requestAnimationFrame(updateGrain);
            }
        });
    }

    const intro = document.getElementById("intro-screen");
    const video = document.getElementById("intro-video");

    // Fade out intro video
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
        if (!href || href.startsWith("#")) {
            return;
        }
        link.addEventListener("click", (e) => {
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin) {
                return;
            }
            e.preventDefault();
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

    const extraImages = document.querySelectorAll(".about-extra-img");
    if (extraImages.length > 0 && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("is-visible", entry.isIntersecting);
                });
            },
            { threshold: 0.4 }
        );

        extraImages.forEach((image) => observer.observe(image));
    }
});
