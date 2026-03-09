window.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const intro = document.getElementById("intro-screen");
    const video = document.getElementById("intro-video");

    if (intro && video) {
        const fadeOutIntro = () => {
            const delay = Math.min(Math.max(video.duration * 900, 2200), 4200) || 3200;
            setTimeout(() => {
                intro.classList.add("fade-out");
                setTimeout(() => {
                    intro.style.display = "none";
                }, 1000);
            }, delay);
        };

        if (video.readyState >= 3) {
            fadeOutIntro();
        } else {
            video.addEventListener("canplaythrough", fadeOutIntro, { once: true });
            setTimeout(fadeOutIntro, 3200);
        }
    }

    const pageLinks = document.querySelectorAll("a[href]");
    pageLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#")) return;

        link.addEventListener("click", (event) => {
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin || event.metaKey || event.ctrlKey) return;

            event.preventDefault();
            document.body.classList.add("page-fade-out");
            setTimeout(() => {
                window.location.href = link.href;
            }, 350);
        });
    });

    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            alert(`You searched for: ${searchInput.value}`);
        });
    }

    const slideElements = document.querySelectorAll(".about-main2-text, .about-main2-bg");
    if (slideElements.length > 0 && "IntersectionObserver" in window) {
        const slideObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => entry.target.classList.toggle("in-view", entry.isIntersecting));
            },
            { threshold: 0.3 }
        );

        slideElements.forEach((el) => slideObserver.observe(el));
    }

    const revealSections = document.querySelectorAll(".reveal-section, section");
    if (!prefersReducedMotion && revealSections.length > 0 && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                    }
                });
            },
            { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
        );

        revealSections.forEach((section) => revealObserver.observe(section));
    } else {
        revealSections.forEach((section) => section.classList.add("in-view"));
    }

    const parallaxTargets = document.querySelectorAll("[data-depth]");
    if (!prefersReducedMotion && parallaxTargets.length > 0) {
        const onScroll = () => {
            const viewportMid = window.scrollY + window.innerHeight / 2;
            parallaxTargets.forEach((target) => {
                const depth = Number(target.dataset.depth || 0.1);
                const rect = target.getBoundingClientRect();
                const top = window.scrollY + rect.top;
                const offset = (viewportMid - top) * depth;

                const bg = target.querySelector(".hero-bg");
                if (bg) {
                    bg.style.transform = `translateY(${offset * -0.1}px) scale(1.08)`;
                } else {
                    target.style.transform = `translateY(${offset * 0.015}px)`;
                }
            });
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }
});
