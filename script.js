window.addEventListener("DOMContentLoaded", () => {
    const palettes = {
        anchorGreyMistyGreenMistyBlue: {
            r1: "103,121,125", r2: "207,215,204", r3: "167,191,193", r4: "207,215,204",
            l1: "#67797d", l2: "#cfd7cc", l3: "#a7bfc1"
        },
        springDustYellowstoneYellowstoneDark: {
            r1: "217,196,133", r2: "223,190,97", r3: "112,95,49", r4: "223,190,97",
            l1: "#d9c485", l2: "#dfbe61", l3: "#705f31"
        },
        stickyBlueLightStickyBlueDarkStickyBlue: {
            r1: "75,99,111", r2: "183,193,197", r3: "30,40,44", r4: "183,193,197",
            l1: "#4b636f", l2: "#b7c1c5", l3: "#1e282c"
        },
        greyUltraLightGreyBlue: {
            r1: "103,120,127", r2: "209,215,217", r3: "125,161,176", r4: "209,215,217",
            l1: "#67787f", l2: "#d1d7d9", l3: "#7da1b0"
        },
        greenUltraLightGreyBlue: {
            r1: "206,216,205", r2: "209,215,217", r3: "125,161,176", r4: "209,215,217",
            l1: "#ced8cd", l2: "#d1d7d9", l3: "#7da1b0"
        },
        greenLightGreenWhite: {
            r1: "85,100,95", r2: "152,179,171", r3: "240,243,240", r4: "152,179,171",
            l1: "#55645f", l2: "#98b3ab", l3: "#f0f3f0"
        },
        lightBlueLightBlueGreyDarkBlueGrey: {
            r1: "159,189,191", r2: "152,179,171", r3: "84,96,97", r4: "152,179,171",
            l1: "#9fbdbf", l2: "#98b3ab", l3: "#546061"
        },
        greenBlueGreenDarkBlue: {
            r1: "164,186,162", r2: "180,207,202", r3: "73,97,109", r4: "180,207,202",
            l1: "#a4baa2", l2: "#b4cfca", l3: "#49616d"
        },
        lightGreyDarkGreyBlueNavyBlue: {
            r1: "201,208,212", r2: "128,144,154", r3: "48,91,117", r4: "128,144,154",
            l1: "#c9d0d4", l2: "#80909a", l3: "#305b75"
        },
        goldSandCream: {
            r1: "217,190,111", r2: "236,226,194", r3: "254,250,238", r4: "236,226,194",
            l1: "#d9be6f", l2: "#ece2c2", l3: "#fefaee"
        },
        goldGoldCream: {
            r1: "222,192,96", r2: "226,188,105", r3: "254,250,238", r4: "226,188,105",
            l1: "#dec060", l2: "#e2bc69", l3: "#fefaee"
        },
        greyBlueGreyWhite: {
            r1: "111,133,150", r2: "154,170,182", r3: "241,243,245", r4: "154,170,182",
            l1: "#6f8596", l2: "#9aaab6", l3: "#f1f3f5"
        },
        forestGreenLightForestGreenWhite: {
            r1: "108,134,128", r2: "159,185,179", r3: "241,243,245", r4: "159,185,179",
            l1: "#6c8680", l2: "#9fb9b3", l3: "#f1f3f5"
        }
    };

    const root = document.documentElement;
    const paletteSelect = document.getElementById("paletteSelect");
    const heroVideo = document.getElementById("hero-palette-video");
    const heroVideoSource = heroVideo?.querySelector("source");
    const paletteVideoLayers = Array.from(document.querySelectorAll("[data-palette-video-target] video"));
    const heroVideoFallbackSrc = "Videos/Intro4.mp4";

    const getPaletteVideoSrc = (paletteName) => `Videos/${paletteName}.mp4`;

    const applyVideoSource = (videoEl, sourceEl, paletteName) => {
        sourceEl.src = getPaletteVideoSrc(paletteName);
        videoEl.load();
        videoEl.play().catch(() => {
            // Autoplay can be blocked by browser policies; muted+playsinline should handle most cases.
        });
    };

    const applyPaletteVideos = (paletteName) => {
        if (heroVideo && heroVideoSource) {
            applyVideoSource(heroVideo, heroVideoSource, paletteName);
        }

        paletteVideoLayers.forEach((videoEl) => {
            const sourceEl = videoEl.querySelector("source");
            if (!sourceEl) return;
            applyVideoSource(videoEl, sourceEl, paletteName);
        });
    };

    const addFallbackHandler = (videoEl, sourceEl) => {
        videoEl.addEventListener("error", () => {
            if (sourceEl.getAttribute("src") === heroVideoFallbackSrc) return;
            sourceEl.src = heroVideoFallbackSrc;
            videoEl.load();
            videoEl.play().catch(() => {
                // Ignore play errors for fallback too.
            });
        });
    };

    if (heroVideo && heroVideoSource) {
        addFallbackHandler(heroVideo, heroVideoSource);
    }

    paletteVideoLayers.forEach((videoEl) => {
        const sourceEl = videoEl.querySelector("source");
        if (!sourceEl) return;
        addFallbackHandler(videoEl, sourceEl);
    });

    if (paletteVideoLayers.length > 0 && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const videoEl = entry.target;
                if (entry.isIntersecting) {
                    videoEl.play().catch(() => {
                        // Ignore blocked autoplay attempts.
                    });
                } else {
                    videoEl.pause();
                }
            });
        }, { threshold: 0.05 });

        paletteVideoLayers.forEach((videoEl) => observer.observe(videoEl));
    }

    const hexToRgb = (hex) => {
        const cleanHex = hex.replace("#", "");
        const bigint = parseInt(cleanHex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    };

    const relativeLuminance = ({ r, g, b }) => {
        const channel = (value) => {
            const normalized = value / 255;
            return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
        };

        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    const applyReadableText = (palette) => {
        const avgLuminance = (relativeLuminance(hexToRgb(palette.l1)) + relativeLuminance(hexToRgb(palette.l2)) + relativeLuminance(hexToRgb(palette.l3))) / 3;
        const isLightPalette = avgLuminance > 0.44;

        root.style.setProperty("--hero-text", isLightPalette ? "#112017" : "#f2f6ef");
        root.style.setProperty("--hero-text-muted", isLightPalette ? "rgba(17, 32, 23, 0.84)" : "rgba(242, 246, 239, 0.9)");
        root.style.setProperty("--hero-text-shadow", isLightPalette ? "0 1px 16px rgba(255, 255, 255, 0.2)" : "0 2px 24px rgba(7, 10, 8, 0.3)");
    };

    const applyPalette = (name) => {
        const palette = palettes[name];
        if (!palette) return;

        root.style.setProperty("--hero-r1", palette.r1);
        root.style.setProperty("--hero-r2", palette.r2);
        root.style.setProperty("--hero-r3", palette.r3);
        root.style.setProperty("--hero-r4", palette.r4);
        root.style.setProperty("--hero-l1", palette.l1);
        root.style.setProperty("--hero-l2", palette.l2);
        root.style.setProperty("--hero-l3", palette.l3);
        applyReadableText(palette);
        applyPaletteVideos(name);

        try {
            localStorage.setItem("6sense-palette", name);
        } catch (_error) {
            // Ignore storage errors (private browsing, security settings)
        }
    };

    const defaultPalette = paletteSelect?.value || "anchorGreyMistyGreenMistyBlue";
    let savedPalette = "";

    try {
        savedPalette = localStorage.getItem("6sense-palette") || "";
    } catch (_error) {
        savedPalette = "";
    }

    const paletteToApply = palettes[savedPalette] ? savedPalette : defaultPalette;
    applyPalette(paletteToApply);

    if (paletteSelect) {
        paletteSelect.value = paletteToApply;
        paletteSelect.addEventListener("change", (event) => {
            applyPalette(event.target.value);
        });
    }

    const intro = document.getElementById("intro-screen");
    const video = document.getElementById("intro-video");

    if (intro && video) {
        let introHandled = false;

        const triggerFade = () => {
            if (introHandled) return;
            introHandled = true;

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
            video.addEventListener("canplaythrough", triggerFade, { once: true });
            video.addEventListener("error", triggerFade, { once: true });
        }
    }

    const pageLinks = document.querySelectorAll("a[href]");
    pageLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#")) return;

        link.addEventListener("click", (event) => {
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            event.preventDefault();
            document.body.classList.add("page-fade-out");
            setTimeout(() => {
                window.location.href = link.href;
            }, 540);
        });
    });

    window.addEventListener("pageshow", () => {
        document.body.classList.remove("page-fade-out");
    });

    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            alert(`You searched for: ${searchInput.value}`);
        });
    }

    const extraImages = document.querySelectorAll(".about-extra-img, .about-extra-img-right");
    if (extraImages.length > 0 && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("is-visible", entry.isIntersecting);
            });
        }, { threshold: 0.4 });

        extraImages.forEach((image) => observer.observe(image));
    }

    const slideElements = document.querySelectorAll(".about-main2-text, .about-main2-bg");
    if (slideElements.length > 0 && "IntersectionObserver" in window) {
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("in-view", entry.isIntersecting);
            });
        }, { threshold: 0.3 });

        slideElements.forEach((el) => slideObserver.observe(el));
    }

    const methodGrain = document.querySelector(".method-grain");
    if (methodGrain) {
        window.addEventListener("scroll", () => {
            const grainShift = window.scrollY * 0.2;
            methodGrain.style.setProperty("--grain-shift", `${grainShift.toFixed(2)}px`);
        }, { passive: true });
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(document.querySelectorAll("section"));

    if (!prefersReducedMotion && sections.length > 0) {
        sections.forEach((section) => {
            section.style.opacity = "0";
            section.style.transform = "translateY(54px)";
            section.style.transition = "opacity 0.75s ease, transform 0.75s ease";
            section.style.willChange = "opacity, transform";
        });

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.style.opacity = entry.isIntersecting ? "1" : "0";
                entry.target.style.transform = entry.isIntersecting ? "translateY(0)" : "translateY(54px)";
                entry.target.classList.toggle("section-active", entry.intersectionRatio >= 0.6);
            });
        }, { threshold: [0, 0.3, 0.6, 1] });

        sections.forEach((section) => sectionObserver.observe(section));

        let currentScroll = window.scrollY;
        let targetScroll = window.scrollY;
        let isAnimating = false;

        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
        const getMaxScroll = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
        const isInteractiveTarget = (target) => target instanceof HTMLElement && (
            target.closest("input, textarea, select, button, [contenteditable='true'], .palette-switcher, .submenu")
        );

        const animateScroll = () => {
            currentScroll += (targetScroll - currentScroll) * 0.12;

            if (Math.abs(targetScroll - currentScroll) < 0.5) {
                currentScroll = targetScroll;
            }

            window.scrollTo(0, currentScroll);

            if (currentScroll !== targetScroll) {
                requestAnimationFrame(animateScroll);
            } else {
                isAnimating = false;
            }
        };

        const requestAnimation = () => {
            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(animateScroll);
            }
        };

        window.addEventListener("wheel", (event) => {
            if (isInteractiveTarget(event.target) || event.ctrlKey) return;

            event.preventDefault();
            targetScroll = clamp(targetScroll + event.deltaY, 0, getMaxScroll());
            requestAnimation();
        }, { passive: false });

        window.addEventListener("keydown", (event) => {
            if (isInteractiveTarget(event.target)) return;

            const maxScroll = getMaxScroll();
            const keyDelta = {
                ArrowDown: 120,
                ArrowUp: -120,
                PageDown: window.innerHeight * 0.9,
                PageUp: -window.innerHeight * 0.9
            };

            if (event.key === "Home") {
                event.preventDefault();
                targetScroll = 0;
                requestAnimation();
                return;
            }

            if (event.key === "End") {
                event.preventDefault();
                targetScroll = maxScroll;
                requestAnimation();
                return;
            }

            if (event.code === "Space") {
                event.preventDefault();
                const delta = window.innerHeight * (event.shiftKey ? -0.9 : 0.9);
                targetScroll = clamp(targetScroll + delta, 0, maxScroll);
                requestAnimation();
                return;
            }

            if (!(event.key in keyDelta)) return;

            event.preventDefault();
            targetScroll = clamp(targetScroll + keyDelta[event.key], 0, maxScroll);
            requestAnimation();
        });

        window.addEventListener("scroll", () => {
            if (!isAnimating) {
                currentScroll = window.scrollY;
                targetScroll = window.scrollY;
            }
        }, { passive: true });
    }
});
