// ================= PRODUCT DATA =================

const products = {
    1: {
        id: 1,
        name: "TRAIL RUNNER",
        price: 6495,
        category: "trail",
        subtitle: "All Terrain / Outdoor",
        image: "assets/images/sneaker-01.jpg"
    },
    2: {
        id: 2,
        name: "URBAN TREK",
        price: 5995,
        category: "urban",
        subtitle: "Everyday / Street",
        image: "assets/images/sneaker-02.png"
    },
    3: {
        id: 3,
        name: "WILD EDGE",
        price: 7495,
        category: "outdoor",
        subtitle: "Adventure / Leather",
        image: "assets/images/sneaker-03.png"
    },
    4: {
        id: 4,
        name: "RIDGE WALKER",
        price: 6995,
        category: "trail",
        subtitle: "Trail / Performance",
        image: "assets/images/sneaker-04.jpg"
    },
    5: {
        id: 5,
        name: "FOREST LOW",
        price: 5495,
        category: "outdoor",
        subtitle: "Outdoor / Casual",
        image: "assets/images/sneaker-05.jpg"
    },
    6: {
        id: 6,
        name: "STREET TREKKER",
        price: 6295,
        category: "urban",
        subtitle: "Urban / Everyday",
        image: "assets/images/sneaker-06.jpg"
    }
};

// ================= ADD TO CART =================

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("woodlandCart")) || [];
    const product = products[id];

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            subtitle: product.subtitle,
            quantity: 1
        });
    }

    localStorage.setItem("woodlandCart", JSON.stringify(cart));
    updateCartCount();
    showCartMessage(product.name, product.image);
}

// ================= CART COUNT =================

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("woodlandCart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    const counts = document.querySelectorAll("#cart-count");
    counts.forEach(count => {
        if (count) {
            count.textContent = total;
            count.classList.add("bump");
            setTimeout(() => count.classList.remove("bump"), 300);
        }
    });
}

// ================= LUXURY CART TOAST =================

function showCartMessage(name, image) {
    const existingMessage = document.querySelector(".cart-message");
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement("div");
    message.className = "cart-message";

    const imgTag = image 
        ? `<div class="toast-thumb"><img src="${image}" alt="${name}"></div>` 
        : "";

    message.innerHTML = `
        ${imgTag}
        <div class="toast-info">
            <span class="toast-tag">ADDED TO BAG</span>
            <strong>${name}</strong>
        </div>
        <a href="cart.html" class="toast-link">VIEW BAG →</a>
    `;

    document.body.appendChild(message);

    requestAnimationFrame(() => {
        message.classList.add("show");
    });

    setTimeout(() => {
        message.classList.remove("show");
        setTimeout(() => {
            message.remove();
        }, 400);
    }, 3200);
}

// ================= INITIALIZE =================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateCartCount);
} else {
    updateCartCount();
}