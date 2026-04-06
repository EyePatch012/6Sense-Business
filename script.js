window.addEventListener("DOMContentLoaded", () => {
    const palettes = {
        mintDarkMossOlive: { r1: "165,185,166", r2: "56,74,64", r3: "105,126,98", r4: "56,74,64", l1: "#a5b9a6", l2: "#384a40", l3: "#697e62" },
        darkBrownBeigeSilver: { r1: "55,40,24", r2: "165,148,132", r3: "202,197,195", r4: "165,148,132", l1: "#372818", l2: "#a59484", l3: "#cac5c3" },
        darkTealBabyBlueTeal: { r1: "19,53,59", r2: "175,200,207", r3: "64,141,150", r4: "175,200,207", l1: "#13353b", l2: "#afc8cf", l3: "#408d96" },
        darkGreyOrangeBrownGreyBrown: { r1: "58,73,73", r2: "197,135,85", r3: "117,95,87", r4: "197,135,85", l1: "#3a4949", l2: "#c58755", l3: "#755f57" },
        goldGreyBrown: { r1: "227,187,32", r2: "92,88,70", r3: "156,120,58", r4: "92,88,70", l1: "#e3bb20", l2: "#5c5846", l3: "#9c783a" },
        seaDeep: { r1: "29,54,64", r2: "35,46,21", r3: "100,129,130", r4: "35,46,21", l1: "#1d3640", l2: "#232e15", l3: "#648182" },
        darkMintMoss: { r1: "165,185,166", r2: "56,74,64", r3: "25,32,15", r4: "56,74,64", l1: "#a5b9a6", l2: "#384a40", l3: "#19200f" },
        fnbSoft: { r1: "103,121,125", r2: "207,215,204", r3: "167,191,193", r4: "207,215,204", l1: "#67797d", l2: "#cfd7cc", l3: "#a7bfc1" },
        fnbWarm: { r1: "217,196,133", r2: "223,190,97", r3: "112,95,49", r4: "223,190,97", l1: "#d9c485", l2: "#dfbe61", l3: "#705f31" },
        fnbBlue: { r1: "75,99,111", r2: "183,193,197", r3: "30,40,44", r4: "183,193,197", l1: "#4b636f", l2: "#b7c1c5", l3: "#1e282c" },
        fnbGreyBlue: { r1: "103,120,127", r2: "209,215,217", r3: "125,161,176", r4: "209,215,217", l1: "#67787F", l2: "#D1D7D9", l3: "#7DA1B0" },
        fnbGreenBlue: { r1: "206,216,205", r2: "209,215,217", r3: "125,161,176", r4: "209,215,217", l1: "#CED8CD", l2: "#D1D7D9", l3: "#7DA1B0" },
        fnbSoftGreen: { r1: "85,100,95", r2: "152,179,171", r3: "240,243,240", r4: "152,179,171", l1: "#55645F", l2: "#98B3AB", l3: "#F0F3F0" },
        fnbBlueGreySoft: { r1: "159,189,191", r2: "152,179,171", r3: "84,96,97", r4: "152,179,171", l1: "#9FBDBF", l2: "#98B3AB", l3: "#546061" },
        fnbGreenBlueDark: { r1: "164,186,162", r2: "180,207,202", r3: "73,97,109", r4: "180,207,202", l1: "#A4BAA2", l2: "#B4CFCA", l3: "#49616D" },
        fnbNavySet: { r1: "201,208,212", r2: "128,144,154", r3: "48,91,117", r4: "128,144,154", l1: "#C9D0D4", l2: "#80909A", l3: "#305B75" },
        fnbGoldSand: { r1: "217,190,111", r2: "236,226,194", r3: "254,250,238", r4: "236,226,194", l1: "#D9BE6F", l2: "#ECE2C2", l3: "#FEFAEE" },
        fnbGoldCream: { r1: "222,192,96", r2: "226,188,105", r3: "254,250,238", r4: "226,188,105", l1: "#DEC060", l2: "#E2BC69", l3: "#FEFAEE" },
        greyBlueWhite: { r1: "111,133,150", r2: "154,170,182", r3: "241,243,245", r4: "154,170,182", l1: "#6F8596", l2: "#9AAAB6", l3: "#F1F3F5" },
        forestGreenWhite: { r1: "108,134,128", r2: "159,185,179", r3: "241,243,245", r4: "159,185,179", l1: "#6C8680", l2: "#9FB9B3", l3: "#F1F3F5" },
        blueGreenLight: { r1: "104,139,156", r2: "164,212,203", r3: "227,239,233", r4: "164,212,203", l1: "#688B9C", l2: "#A4D4CB", l3: "#E3EFE9" }
    };

    const root = document.documentElement;
    const paletteSelect = document.getElementById("paletteSelect");

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

        try {
            localStorage.setItem("6sense-palette", name);
        } catch (_error) {
            // Ignore storage errors (private browsing, security settings)
        }
    };

    if (paletteSelect) {
        const defaultPalette = paletteSelect.value || "mintDarkMossOlive";
        let savedPalette = "";

        try {
            savedPalette = localStorage.getItem("6sense-palette") || "";
        } catch (_error) {
            savedPalette = "";
        }

        const paletteToApply = palettes[savedPalette] ? savedPalette : defaultPalette;
        paletteSelect.value = paletteToApply;
        applyPalette(paletteToApply);

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
