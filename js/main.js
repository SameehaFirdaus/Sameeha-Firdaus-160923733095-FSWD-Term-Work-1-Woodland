// ================= WOODLAND MAIN JAVASCRIPT =================

document.addEventListener("DOMContentLoaded", () => {

    // ================= 1. PRELOADER =================
    const preloader = document.getElementById("preloader");
    if (preloader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                preloader.classList.add("hide");
            }, 1200);
        });

        // Fallback safety timeout if window load event is delayed
        setTimeout(() => {
            if (!preloader.classList.contains("hide")) {
                preloader.classList.add("hide");
            }
        }, 2500);
    }

    // ================= 2. NAVBAR SCROLL EFFECT =================
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
    }

    // ================= 3. MOBILE MENU DRAWER =================
    const menuButton = document.getElementById("menuButton");
    const mobileNav = document.getElementById("mobileNav");
    const mobileBackdrop = document.getElementById("mobileBackdrop");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    if (menuButton && mobileNav) {
        const toggleMobileMenu = (open) => {
            const isOpen = open !== undefined ? open : !mobileNav.classList.contains("open");
            if (isOpen) {
                mobileNav.classList.add("open");
                if (mobileBackdrop) mobileBackdrop.classList.add("open");
                menuButton.classList.add("active");
                document.body.classList.add("menu-locked");
            } else {
                mobileNav.classList.remove("open");
                if (mobileBackdrop) mobileBackdrop.classList.remove("open");
                menuButton.classList.remove("active");
                document.body.classList.remove("menu-locked");
            }
        };

        menuButton.addEventListener("click", () => toggleMobileMenu());
        if (mobileBackdrop) {
            mobileBackdrop.addEventListener("click", () => toggleMobileMenu(false));
        }

        mobileLinks.forEach(link => {
            link.addEventListener("click", () => toggleMobileMenu(false));
        });
    }

    // ================= 4. MOUSE PARALLAX FOR HERO =================
    const heroSection = document.querySelector(".hero");
    const heroShoe = document.getElementById("heroProduct") || document.querySelector(".hero-shoe");
    const heroBg = document.querySelector(".hero-image");
    const heroChameleon = document.querySelector(".chameleon");

    if (heroSection && (heroShoe || heroBg || heroChameleon)) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener("mousemove", (e) => {
            const rect = heroSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            }
        });

        const animateParallax = () => {
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;

            if (heroShoe) {
                heroShoe.style.transform = `translate(${currentX * 18}px, ${currentY * 14}px)`;
            }
            if (heroBg) {
                heroBg.style.transform = `translate(${currentX * -10}px, ${currentY * -8}px)`;
            }
            if (heroChameleon) {
                heroChameleon.style.transform = `translate(${currentX * 12}px, ${currentY * 10}px)`;
            }

            requestAnimationFrame(animateParallax);
        };

        animateParallax();
    }

    // ================= 5. SCROLL REVEAL OBSERVER =================
    const revealElements = document.querySelectorAll(".reveal, .reveal-up, .reveal-fade, .reveal-stagger");
    if ("IntersectionObserver" in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add("revealed"));
    }

    // ================= 6. SEARCH MODAL / FOCUS =================
    const searchBtns = document.querySelectorAll(".nav-icon");
    searchBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (window.location.pathname.endsWith("products.html")) {
                const filterSec = document.querySelector(".filter-section");
                if (filterSec) {
                    filterSec.scrollIntoView({ behavior: "smooth" });
                }
            } else {
                window.location.href = "products.html";
            }
        });
    });

});