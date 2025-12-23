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

    // ---------------------------------------------------------------------
    // Scroll-based cinematic section animations (no HTML/CSS changes needed)
    // ---------------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(document.querySelectorAll("section"));

    if (!prefersReducedMotion && sections.length > 0) {
        // Apply baseline animation styles inline so we don't touch existing CSS.
        sections.forEach((section) => {
            section.style.opacity = "0";
            section.style.transform = "translateY(60px)";
            section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            section.style.willChange = "opacity, transform";
        });

        // Helper to toggle active section (one at a time).
        const setActiveSection = (activeSection) => {
            sections.forEach((section) => {
                section.classList.toggle("section-active", section === activeSection);
            });
        };

        // Observe visibility to animate sections in/out and identify the active one.
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const { target, isIntersecting, intersectionRatio } = entry;

                    // Fade and lift sections in/out as they enter/leave the viewport.
                    if (isIntersecting) {
                        target.style.opacity = "1";
                        target.style.transform = "translateY(0px)";
                    } else {
                        target.style.opacity = "0";
                        target.style.transform = "translateY(60px)";
                    }

                    // Mark a single section as "active" when it's mostly in view.
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

        // -----------------------------------------------------------------
        // Cinematic smooth scrolling (controlled, eased scrolling behavior)
        // -----------------------------------------------------------------
        let currentScroll = window.scrollY;
        let targetScroll = window.scrollY;
        let isAnimatingScroll = false;
        let maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        const updateMaxScroll = () => {
            maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        };

        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

        const animateScroll = () => {
            // Ease toward the target for a smooth, cinematic feel.
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

        // Wheel-based scroll control for a smooth, curated scroll experience.
        const handleWheel = (event) => {
            event.preventDefault();
            updateMaxScroll();

            targetScroll = clamp(targetScroll + event.deltaY, 0, maxScroll);
            requestScrollAnimation();
        };

        // Keyboard-based scrolling with the same eased feel.
        const handleKeydown = (event) => {
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
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("keydown", handleKeydown);
        window.addEventListener("resize", updateMaxScroll);

        // Sync target/current when the user scrolls via other means (e.g., scrollbar drag).
        window.addEventListener(
            "scroll",
            () => {
                if (!isAnimatingScroll) {
                    currentScroll = window.scrollY;
                    targetScroll = window.scrollY;
                }
            },
            { passive: true }
        );
    }
});
