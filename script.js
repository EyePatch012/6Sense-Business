window.addEventListener("DOMContentLoaded", () => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
        let targetScrollY = window.scrollY;
        let currentScrollY = window.scrollY;
        let isAnimating = false;

        const maxScrollY = () =>
            Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

        const animateScroll = () => {
            currentScrollY += (targetScrollY - currentScrollY) * 0.12;
            if (Math.abs(targetScrollY - currentScrollY) < 0.5) {
                currentScrollY = targetScrollY;
            }

            window.scrollTo(0, currentScrollY);

            if (currentScrollY !== targetScrollY) {
                requestAnimationFrame(animateScroll);
            } else {
                isAnimating = false;
            }
        };

        const queueScroll = (deltaY) => {
            targetScrollY = Math.max(0, Math.min(targetScrollY + deltaY, maxScrollY()));
            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(animateScroll);
            }
        };

        window.addEventListener(
            "wheel",
            (event) => {
                if (Math.abs(event.deltaY) < 1) return;
                event.preventDefault();
                queueScroll(event.deltaY);
            },
            { passive: false }
        );

        window.addEventListener("keydown", (event) => {
            const keyScrollMap = {
                ArrowDown: 120,
                ArrowUp: -120,
                PageDown: window.innerHeight * 0.9,
                PageUp: -window.innerHeight * 0.9,
                Home: -maxScrollY(),
                End: maxScrollY(),
            };
            if (!(event.key in keyScrollMap)) return;
            event.preventDefault();
            queueScroll(keyScrollMap[event.key]);
        });

        window.addEventListener(
            "scroll",
            () => {
                if (isAnimating) return;
                targetScrollY = window.scrollY;
                currentScrollY = window.scrollY;
            },
            { passive: true }
        );
    }

    const methodGrain = document.querySelector(".method-grain");
    if (methodGrain) {
        window.addEventListener(
            "scroll",
            () => {
                const grainShift = window.scrollY * 0.2;
                methodGrain.style.setProperty("--grain-shift", `${grainShift.toFixed(2)}px`);
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
        if (!href || href.startsWith("#")) return;

        link.addEventListener("click", (e) => {
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin) return;

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

    // Extra images fade-in
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
