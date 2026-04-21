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
    const pagePaletteStorageKey = `6sense-palette:${window.location.pathname}`;
    const heroVideo = document.getElementById("hero-palette-video");
    const heroVideoSource = heroVideo?.querySelector("source");
    const heroVideoFallbackSrc = "Videos/Intro4.mp4";

    const getPaletteVideoSrc = (paletteName) => `Videos/${paletteName}.mp4`;

    const ensureVideoLayer = (container) => {
        if (!container) return null;
        const existingVideo = container.querySelector("video.palette-video");
        if (existingVideo) return existingVideo;

        const videoEl = document.createElement("video");
        videoEl.className = "palette-video";
        videoEl.autoplay = true;
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.playsInline = true;
        videoEl.preload = "metadata";
        videoEl.setAttribute("aria-hidden", "true");

        const sourceEl = document.createElement("source");
        sourceEl.src = heroVideoFallbackSrc;
        sourceEl.type = "video/mp4";
        videoEl.appendChild(sourceEl);
        container.prepend(videoEl);
        return videoEl;
    };

    const ensurePaletteVideoLayers = () => {
        const autoTargets = document.querySelectorAll(".hero-bg, .method-bg, .about-hero, .about-main2-bg, .about-highlight-full, .about-result-box");
        autoTargets.forEach((target) => {
            target.setAttribute("data-palette-video-target", "");
            ensureVideoLayer(target);
        });

        return Array.from(document.querySelectorAll("[data-palette-video-target] video.palette-video"));
    };

    const paletteVideoLayers = ensurePaletteVideoLayers();

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
            localStorage.setItem(pagePaletteStorageKey, name);
        } catch (_error) {
            // Ignore storage errors (private browsing, security settings)
        }
    };

    const defaultPalette = paletteSelect?.value || "anchorGreyMistyGreenMistyBlue";
    let savedPalette = "";

    try {
        savedPalette = localStorage.getItem(pagePaletteStorageKey) || "";
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

            const isSamePath = url.pathname === window.location.pathname;
            const hasHash = Boolean(url.hash);

            if (isSamePath && hasHash) {
                const target = document.querySelector(url.hash);
                if (!target) return;
                event.preventDefault();
                const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
                history.replaceState(null, "", url.hash);
                return;
            }

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

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                entry.target.classList.add("section-active");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.24 });

        sections.forEach((section) => sectionObserver.observe(section));
    }

    const slideBullets = Array.from(document.querySelectorAll(".about-slide-bullets li"));
    if (slideBullets.length > 0 && "IntersectionObserver" in window) {
        const bulletObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const bullets = Array.from(entry.target.querySelectorAll("li"));
                bullets.forEach((bullet, index) => {
                    setTimeout(() => bullet.classList.add("is-visible"), index * 220);
                });
                bulletObserver.unobserve(entry.target);
            });
        }, { threshold: 0.35 });

        document.querySelectorAll(".about-slide-bullets").forEach((list) => bulletObserver.observe(list));
    }

    const twirlItems = Array.from(document.querySelectorAll("[data-twirl]"));
    if (twirlItems.length > 0 && "IntersectionObserver" in window) {
        const twirlObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const items = Array.from(entry.target.parentElement?.querySelectorAll("[data-twirl]") || [entry.target]);
                items.forEach((item, index) => setTimeout(() => item.classList.add("in-view"), index * 180));
                twirlObserver.unobserve(entry.target);
            });
        }, { threshold: 0.24 });
        twirlItems.forEach((item) => twirlObserver.observe(item));
    }

    const foldRevealItems = document.querySelectorAll(".offer-fold-reveal");
    if (foldRevealItems.length > 0 && "IntersectionObserver" in window) {
        const foldObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("in-view", entry.isIntersecting);
            });
        }, { threshold: 0.35 });
        foldRevealItems.forEach((item) => foldObserver.observe(item));
    }

    const windowOpenSection = document.querySelector("[data-window-open]");
    const windowPanel = document.querySelector(".offer-window-panel");
    if (windowOpenSection && windowPanel && !prefersReducedMotion) {
        const onWindowScroll = () => {
            const rect = windowOpenSection.getBoundingClientRect();
            const total = rect.height + window.innerHeight;
            const progress = Math.min(Math.max((window.innerHeight - rect.top) / total, 0), 1);
            const openProgress = Math.min(progress * 1.1, 1);
            const slideProgress = Math.max((progress - 0.62) / 0.38, 0);
            const translateX = (openProgress * 38) + (slideProgress * 92);
            windowPanel.style.transform = `translateX(${translateX}%)`;
            windowPanel.style.opacity = `${0.42 - (openProgress * 0.18) - (slideProgress * 0.22)}`;
        };

        onWindowScroll();
        window.addEventListener("scroll", onWindowScroll, { passive: true });
        window.addEventListener("resize", onWindowScroll);
    }
});
