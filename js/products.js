// ================= PRODUCTS FILTER & INTERACTIONS =================

document.addEventListener("DOMContentLoaded", () => {

    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");
    const visibleCount = document.getElementById("visible-count");

    function applyFilter(filterCategory) {
        let count = 0;

        filterButtons.forEach(btn => {
            if (btn.dataset.filter === filterCategory) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        productCards.forEach((card, index) => {
            const category = card.dataset.category;
            const matches = (filterCategory === "all" || category === filterCategory);

            if (matches) {
                card.classList.remove("hidden");
                card.style.opacity = "0";
                card.style.transform = "translateY(20px)";
                
                setTimeout(() => {
                    card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, index * 50);

                count++;
            } else {
                card.classList.add("hidden");
            }
        });

        if (visibleCount) {
            visibleCount.textContent = String(count).padStart(2, "0");
        }
    }

    // Filter button click events
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            applyFilter(filter);
        });
    });

    // Check URL parameters (e.g., products.html?filter=trail)
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get("filter") || urlParams.get("category");
    if (initialFilter && ["all", "trail", "urban", "outdoor"].includes(initialFilter.toLowerCase())) {
        applyFilter(initialFilter.toLowerCase());
    }

});