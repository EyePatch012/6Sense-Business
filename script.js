window.addEventListener("DOMContentLoaded", () => {
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.scrollBehavior = "smooth";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
        let targetScroll = window.scrollY;
        let currentScroll = window.scrollY;
        let isTicking = false;

        const clampScroll = (value) => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            return Math.max(0, Math.min(value, maxScroll));
        };

        const animateScroll = () => {
            currentScroll += (targetScroll - currentScroll) * 0.12;
            if (Math.abs(targetScroll - currentScroll) < 0.5) {
                currentScroll = targetScroll;
            }
            window.scrollTo(0, currentScroll);
            if (Math.abs(targetScroll - currentScroll) > 0.5) {
                requestAnimationFrame(animateScroll);
            } else {
                isTicking = false;
            }
        };

        window.addEventListener(
            "wheel",
            (event) => {
                event.preventDefault();
                targetScroll = clampScroll(targetScroll + event.deltaY * 1.1);
                if (!isTicking) {
                    isTicking = true;
                    requestAnimationFrame(animateScroll);
                }
            },
            { passive: false }
        );
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
