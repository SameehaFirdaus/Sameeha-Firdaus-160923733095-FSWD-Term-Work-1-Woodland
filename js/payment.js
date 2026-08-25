// ================= WOODLAND PAYMENT & CHECKOUT =================

document.addEventListener("DOMContentLoaded", () => {

    const paymentForm = document.getElementById("paymentForm");
    const cardDetails = document.getElementById("cardDetails");
    const upiDetails = document.getElementById("upiDetails");
    const successScreen = document.getElementById("successScreen");
    const itemsContainer = document.getElementById("paymentItems");

    // ================= 1. LOAD ORDER SUMMARY =================

    function loadPaymentSummary() {
        const cart = JSON.parse(localStorage.getItem("woodlandCart")) || [];
        let subtotal = 0;

        if (itemsContainer) {
            itemsContainer.innerHTML = "";

            if (cart.length === 0) {
                itemsContainer.innerHTML = `
                    <div class="empty-checkout-notice">
                        <p>No items in bag.</p>
                        <a href="products.html" class="text-link">Explore Collection →</a>
                    </div>
                `;
            } else {
                cart.forEach(item => {
                    subtotal += item.price * item.quantity;

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

                    const itemElement = document.createElement("div");
                    itemElement.className = "payment-item";

                    itemElement.innerHTML = `
                        <div class="payment-item-thumb">
                            <img src="${imageSrc}" alt="${item.name}" onerror="this.src='assets/images/sneaker-01.jpg'">
                        </div>
                        <div class="payment-item-info">
                            <span class="payment-item-name">${item.name}</span>
                            <span class="payment-item-qty">Qty: ${item.quantity}</span>
                        </div>
                        <strong class="payment-item-price">
                            ₹${(item.price * item.quantity).toLocaleString("en-IN")}
                        </strong>
                    `;

                    itemsContainer.appendChild(itemElement);
                });
            }
        }

        const shipping = subtotal === 0 ? 0 : (subtotal >= 5000 ? 0 : 150);
        const total = subtotal + shipping;

        const subtotalEl = document.getElementById("paymentSubtotal");
        const shippingEl = document.getElementById("paymentShipping");
        const totalEl = document.getElementById("paymentTotal");

        if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
        if (shippingEl) shippingEl.textContent = shipping === 0 ? "FREE" : `₹${shipping}`;
        if (totalEl) totalEl.textContent = `₹${total.toLocaleString("en-IN")}`;
    }

    // ================= 2. PAYMENT METHOD SWITCHER =================

    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');

    function updatePaymentMethod(method) {
        if (!cardDetails || !upiDetails) return;

        if (method === "card") {
            cardDetails.style.display = "block";
            upiDetails.style.display = "none";
            setTimeout(() => cardDetails.classList.add("show"), 10);
            upiDetails.classList.remove("show");
        } else if (method === "upi") {
            cardDetails.style.display = "none";
            upiDetails.style.display = "block";
            setTimeout(() => upiDetails.classList.add("show"), 10);
            cardDetails.classList.remove("show");
        } else {
            cardDetails.style.display = "none";
            upiDetails.style.display = "none";
            cardDetails.classList.remove("show");
            upiDetails.classList.remove("show");
        }
    }

    paymentOptions.forEach(option => {
        option.addEventListener("change", () => {
            updatePaymentMethod(option.value);
        });
    });

    // Initialize default method state
    const defaultChecked = document.querySelector('input[name="paymentMethod"]:checked');
    if (defaultChecked) {
        updatePaymentMethod(defaultChecked.value);
    }

    // ================= 3. VALIDATION HELPERS =================

    function setError(input, message) {
        if (!input) return false;
        input.classList.remove("valid");
        input.classList.add("invalid");

        const parent = input.closest(".form-field") || input.parentElement;
        const error = parent.querySelector(".error-message");
        if (error) {
            error.textContent = message;
        }
        return false;
    }

    function setValid(input) {
        if (!input) return true;
        input.classList.remove("invalid");
        input.classList.add("valid");

        const parent = input.closest(".form-field") || input.parentElement;
        const error = parent.querySelector(".error-message");
        if (error) {
            error.textContent = "";
        }
        return true;
    }

    function validateRequired(input, message) {
        if (!input || input.value.trim() === "") {
            return setError(input, message);
        }
        return setValid(input);
    }

    // ================= 4. INPUT FORMATTERS =================

    const cardInput = document.getElementById("cardNumber");
    if (cardInput) {
        cardInput.addEventListener("input", () => {
            let val = cardInput.value.replace(/\D/g, "").substring(0, 16);
            let formatted = val.match(/.{1,4}/g);
            cardInput.value = formatted ? formatted.join(" ") : "";
            if (val.length === 16) setValid(cardInput);
        });
    }

    const expiryInput = document.getElementById("expiry");
    if (expiryInput) {
        expiryInput.addEventListener("input", () => {
            let val = expiryInput.value.replace(/\D/g, "").substring(0, 4);
            if (val.length >= 3) {
                expiryInput.value = val.substring(0, 2) + "/" + val.substring(2);
            } else {
                expiryInput.value = val;
            }
            if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryInput.value)) {
                setValid(expiryInput);
            }
        });
    }

    const cvvInput = document.getElementById("cvv");
    if (cvvInput) {
        cvvInput.addEventListener("input", () => {
            cvvInput.value = cvvInput.value.replace(/\D/g, "").substring(0, 3);
            if (cvvInput.value.length === 3) setValid(cvvInput);
        });
    }

    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
        phoneInput.addEventListener("input", () => {
            phoneInput.value = phoneInput.value.replace(/\D/g, "").substring(0, 10);
            if (/^[6-9]\d{9}$/.test(phoneInput.value)) setValid(phoneInput);
        });
    }

    const pinInput = document.getElementById("pin");
    if (pinInput) {
        pinInput.addEventListener("input", () => {
            pinInput.value = pinInput.value.replace(/\D/g, "").substring(0, 6);
            if (/^\d{6}$/.test(pinInput.value)) setValid(pinInput);
        });
    }

    // ================= 5. FORM SUBMISSION =================

    if (paymentForm) {
        paymentForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullName = document.getElementById("fullName");
            const email = document.getElementById("email");
            const phone = document.getElementById("phone");
            const address = document.getElementById("address");
            const city = document.getElementById("city");
            const state = document.getElementById("state");
            const pin = document.getElementById("pin");

            let isValid = true;

            // Name
            if (!validateRequired(fullName, "Please enter your full name.")) {
                isValid = false;
            }

            // Email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailPattern.test(email.value.trim())) {
                setError(email, "Enter a valid email address.");
                isValid = false;
            } else {
                setValid(email);
            }

            // Phone
            if (!phone || !/^[6-9]\d{9}$/.test(phone.value.trim())) {
                setError(phone, "Enter a valid 10-digit mobile number.");
                isValid = false;
            } else {
                setValid(phone);
            }

            // Address
            if (!validateRequired(address, "Please enter your delivery address.")) {
                isValid = false;
            }

            // City
            if (!validateRequired(city, "Please enter your city.")) {
                isValid = false;
            }

            // State
            if (!validateRequired(state, "Please enter your state.")) {
                isValid = false;
            }

            // PIN
            if (!pin || !/^\d{6}$/.test(pin.value.trim())) {
                setError(pin, "Enter a valid 6-digit postal PIN code.");
                isValid = false;
            } else {
                setValid(pin);
            }

            // Payment Specific Validation
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "card";

            if (selectedMethod === "card") {
                const cleanCard = (cardInput?.value || "").replace(/\s/g, "");
                if (!/^\d{16}$/.test(cleanCard)) {
                    setError(cardInput, "Enter a valid 16-digit card number.");
                    isValid = false;
                } else {
                    setValid(cardInput);
                }

                if (!expiryInput || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryInput.value.trim())) {
                    setError(expiryInput, "Use MM/YY format.");
                    isValid = false;
                } else {
                    setValid(expiryInput);
                }

                if (!cvvInput || !/^\d{3}$/.test(cvvInput.value.trim())) {
                    setError(cvvInput, "Enter a valid 3-digit CVV.");
                    isValid = false;
                } else {
                    setValid(cvvInput);
                }
            } else if (selectedMethod === "upi") {
                const upiInput = document.getElementById("upiId");
                if (!upiInput || !/^[\w.-]+@[\w.-]+$/.test(upiInput.value.trim())) {
                    setError(upiInput, "Enter a valid UPI ID (e.g. name@bank).");
                    isValid = false;
                } else {
                    setValid(upiInput);
                }
            }

            // On Successful Validation
            if (isValid) {
                localStorage.removeItem("woodlandCart");

                if (typeof updateCartCount === "function") {
                    updateCartCount();
                }

                if (successScreen) {
                    successScreen.classList.add("show");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            } else {
                // Scroll smoothly to first invalid field
                const firstInvalid = document.querySelector(".form-field input.invalid");
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
                    firstInvalid.focus();
                }
            }
        });
    }

    // Initialize summary
    loadPaymentSummary();
    if (typeof updateCartCount === "function") {
        updateCartCount();
    }

});