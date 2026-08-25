// ================= CART PAGE LOGIC =================

const cartItemsContainer = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const subtotalElement = document.getElementById("subtotal");
const shippingElement = document.getElementById("shipping");
const totalElement = document.getElementById("total");
const itemCountElement = document.getElementById("cart-item-count");
const checkoutBtn = document.getElementById("checkout-button");

// ================= LOAD CART =================

function getCart() {
    return JSON.parse(localStorage.getItem("woodlandCart")) || [];
}

// ================= SAVE CART =================

function saveCart(cart) {
    localStorage.setItem("woodlandCart", JSON.stringify(cart));
}

// ================= DISPLAY CART =================

function renderCart() {
    if (!cartItemsContainer) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = "";

    let subtotal = 0;
    let totalItems = 0;

    // EMPTY CART STATE
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = "block";
        if (itemCountElement) itemCountElement.textContent = "0 ITEMS";
        if (subtotalElement) subtotalElement.textContent = "₹0";
        if (shippingElement) shippingElement.textContent = "₹0";
        if (totalElement) totalElement.textContent = "₹0";
        if (checkoutBtn) {
            checkoutBtn.style.opacity = "0.4";
            checkoutBtn.style.pointerEvents = "none";
        }
        return;
    }

    if (emptyCart) emptyCart.style.display = "none";
    if (checkoutBtn) {
        checkoutBtn.style.opacity = "1";
        checkoutBtn.style.pointerEvents = "auto";
    }

    // RENDER PRODUCTS
    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        totalItems += item.quantity;

        // Fallback image lookup if missing
        let imageSrc = item.image;
        if (!imageSrc && typeof products !== "undefined" && products[item.id]) {
            imageSrc = products[item.id].image;
        }
        if (!imageSrc) {
            const fallbackMap = {
                1: "assets/images/sneaker-01.jpg",
                2: "assets/images/sneaker-02.png",
                3: "assets/images/sneaker-03.png",
                4: "assets/images/sneaker-04.jpg",
                5: "assets/images/sneaker-05.jpg",
                6: "assets/images/sneaker-06.jpg"
            };
            imageSrc = fallbackMap[item.id] || "assets/images/sneaker-01.jpg";
        }

        const itemElement = document.createElement("article");
        itemElement.className = "cart-item";
        itemElement.dataset.index = index;

        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${imageSrc}" alt="${item.name}" onerror="this.src='assets/images/sneaker-01.jpg'">
            </div>

            <div class="cart-item-info">
                <span class="item-cat">${item.subtitle || "Woodland Outdoor Collection"}</span>
                <h2>${item.name}</h2>
                <div class="item-unit-price">₹${item.price.toLocaleString("en-IN")} each</div>

                <div class="quantity-control">
                    <button type="button" aria-label="Decrease quantity" onclick="changeQuantity(${index}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" aria-label="Increase quantity" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            </div>

            <div class="cart-item-price">
                <strong>₹${(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                <button type="button" class="remove-item" onclick="removeItem(${index})">
                    ✕ REMOVE
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    // SHIPPING CALCULATION
    const shipping = subtotal >= 5000 ? 0 : 150;
    const total = subtotal + shipping;

    // UPDATE SUMMARY UI
    if (itemCountElement) {
        itemCountElement.textContent = `${totalItems} ${totalItems === 1 ? "ITEM" : "ITEMS"}`;
    }
    if (subtotalElement) {
        subtotalElement.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    }
    if (shippingElement) {
        shippingElement.textContent = shipping === 0 ? "FREE" : `₹${shipping}`;
    }
    if (totalElement) {
        totalElement.textContent = `₹${total.toLocaleString("en-IN")}`;
    }
}

// ================= QUANTITY CHANGE =================

function changeQuantity(index, change) {
    const cart = getCart();
    if (!cart[index]) return;

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
}

// ================= REMOVE ITEM =================

function removeItem(index) {
    const cart = getCart();
    if (!cart[index]) return;

    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
}

// ================= INITIALIZE =================

document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    if (typeof updateCartCount === "function") {
        updateCartCount();
    }
});