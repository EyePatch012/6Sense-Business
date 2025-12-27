window.addEventListener("DOMContentLoaded", () => {
    // Disable native smooth scrolling so we can provide a cinematic scroll feel.
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";

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

    // ✅ Fade-in + Zoom scroll effect for both image classes
    const extraImages = document.querySelectorAll(".about-extra-img, .about-extra-img-right");
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

    // ---------------------------------------------------------------------
    // Scroll-based cinematic section animations
    // ---------------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(document.querySelectorAll("section"));

    if (!prefersReducedMotion && sections.length > 0) {
        sections.forEach((section) => {
            section.style.opacity = "0";
            section.style.transform = "translateY(60px)";
            section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            section.style.willChange = "opacity, transform";
        });

        const setActiveSection = (activeSection) => {
            sections.forEach((section) => {
                section.classList.toggle("section-active", section === activeSection);
            });
        };

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const { target, isIntersecting, intersectionRatio } = entry;

                    if (isIntersecting) {
                        target.style.opacity = "1";
                        target.style.transform = "translateY(0px)";
                    } else {
                        target.style.opacity = "0";
                        target.style.transform = "translateY(60px)";
                    }

                    if (intersectionRatio >= 0.6) {
                        setActiveSection(target);
                    }
                });
            },
            {
                threshold: [0, 0.3, 0.6, 1],
            }
        );

        sections.forEach((section) => sectionObserver.observe(section));

        // Smooth scroll engine
        let currentScroll = window.scrollY;
        let targetScroll = window.scrollY;
        let isAnimatingScroll = false;
        let maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        const updateMaxScroll = () => {
            maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        };

        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

        const animateScroll = () => {
            currentScroll += (targetScroll - currentScroll) * 0.12;
            if (Math.abs(targetScroll - currentScroll) < 0.5) {
                currentScroll = targetScroll;
            }

            window.scrollTo(0, currentScroll);

            if (currentScroll !== targetScroll) {
                requestAnimationFrame(animateScroll);
            } else {
                isAnimatingScroll = false;
            }
        };

        const requestScrollAnimation = () => {
            if (!isAnimatingScroll) {
                isAnimatingScroll = true;
                requestAnimationFrame(animateScroll);
            }
        };

        window.addEventListener("wheel", (event) => {
            event.preventDefault();
            updateMaxScroll();
            targetScroll = clamp(targetScroll + event.deltaY, 0, maxScroll);
            requestScrollAnimation();
        }, { passive: false });

        window.addEventListener("keydown", (event) => {
            if (
                event.target instanceof HTMLElement &&
                (event.target.isContentEditable ||
                    event.target.tagName === "INPUT" ||
                    event.target.tagName === "TEXTAREA")
            ) {
                return;
            }

            const keySteps = {
                ArrowDown: 120,
                ArrowUp: -120,
                PageDown: window.innerHeight * 0.9,
                PageUp: -window.innerHeight * 0.9,
                Space: window.innerHeight * (event.shiftKey ? -0.9 : 0.9),
                Home: -maxScroll,
                End: maxScroll,
            };

            if (!(event.code in keySteps) && event.key !== "ArrowDown" && event.key !== "ArrowUp") {
                return;
            }

            event.preventDefault();
            updateMaxScroll();

            if (event.key === "Home") {
                targetScroll = 0;
            } else if (event.key === "End") {
                targetScroll = maxScroll;
            } else {
                const delta = keySteps[event.key] ?? keySteps[event.code] ?? 0;
                targetScroll = clamp(targetScroll + delta, 0, maxScroll);
            }

            requestScrollAnimation();
        });

        window.addEventListener("resize", updateMaxScroll);

        window.addEventListener("scroll", () => {
            if (!isAnimatingScroll) {
                currentScroll = window.scrollY;
                targetScroll = window.scrollY;
            }
        }, { passive: true });
    }

    // Slide-in animation for .about-main2-text and .about-main2-bg
    const slideElements = document.querySelectorAll(".about-main2-text, .about-main2-bg");
    if (slideElements.length > 0 && "IntersectionObserver" in window) {
        const slideObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("in-view", entry.isIntersecting);
                });
            },
            { threshold: 0.3 }
        );

        slideElements.forEach((el) => slideObserver.observe(el));
    }
});
