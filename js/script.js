$(document).ready(function() {
    // --- General Cart Functions ---

    // Function to get the cart from local storage
    function getCart() {
        let cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : {};
    }

    // Function to save the cart to local storage
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to update the cart display (number of items in the navbar)
    function updateCartDisplay() {
        const cart = getCart();
        const itemCount = Object.keys(cart).length;
        $('.cart-item-count').text(itemCount);
    }

    // Initial cart display update when the page loads
    updateCartDisplay();

    // --- Add to Cart Functionality (on product listing pages) ---
    $('.add-to-cart').click(function() {
        const productId = $(this).data('product-id');
        const productName = $(this).data('product-name');
        const productPrice = parseFloat($(this).data('product-price'));
        const quantity = 1; // Initially adding one item

        const cart = getCart();

        if (cart[productId]) {
            cart[productId].quantity += quantity;
        } else {
            cart[productId] = {
                name: productName,
                price: productPrice,
                quantity: quantity
            };
        }

        saveCart(cart);
        updateCartDisplay(); // Update the cart count in the navigation

        // Optionally, provide feedback to the user
        alert(`${productName} added to cart!`);
    });

    // --- Cart Page Functionality (if on cart.html) ---
    if ($('#cart-items').length > 0) {
        function displayCartItems() {
            const cart = getCart();
            const cartItemsDiv = $('#cart-items');
            let total = 0;
            cartItemsDiv.empty(); // Clear any existing content

            if (Object.keys(cart).length > 0) {
                let cartHTML = '<ul class="list-group">';
                for (const productId in cart) {
                    const item = cart[productId];
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    cartHTML += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                ${item.name}
                                <div class="input-group input-group-sm mt-2" style="width: 120px;">
                                    <div class="input-group-prepend">
                                        <button class="btn btn-outline-secondary btn-sm quantity-change" data-product-id="${productId}" data-action="decrease">-</button>
                                    </div>
                                    <input type="number" class="form-control form-control-sm quantity-input" value="${item.quantity}" min="1" data-product-id="${productId}">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary btn-sm quantity-change" data-product-id="${productId}" data-action="increase">+</button>
                                    </div>
                                </div>
                            </div>
                            <span>₱${itemTotal.toFixed(2)} <button class="btn btn-sm btn-danger remove-item" data-product-id="${productId}">Remove</button></span>
                        </li>
                    `;
                }
                cartHTML += '</ul>';
                cartItemsDiv.append(cartHTML);
                $('#cart-total').text(`₱${total.toFixed(2)}`);
            } else {
                cartItemsDiv.html('<p>Your cart is currently empty.</p>');
                $('#cart-total').text('₱0.00');
            }
        }

        displayCartItems();

        // Event listeners for quantity changes and removal on the cart page
        $('#cart-items').on('click', '.quantity-change', function() {
            const productId = $(this).data('product-id');
            const action = $(this).data('action');
            const cart = getCart();
            if (cart[productId]) {
                if (action === 'increase') {
                    cart[productId].quantity++;
                } else if (action === 'decrease' && cart[productId].quantity > 1) {
                    cart[productId].quantity--;
                }
                saveCart(cart);
                displayCartItems();
                updateCartDisplay();
            }
        });

        $('#cart-items').on('change', '.quantity-input', function() {
            const productId = $(this).data('product-id');
            const newQuantity = parseInt($(this).val());
            if (!isNaN(newQuantity) && newQuantity > 0) {
                const cart = getCart();
                if (cart[productId]) {
                    cart[productId].quantity = newQuantity;
                    saveCart(cart);
                    displayCartItems();
                    updateCartDisplay();
                }
            } else {
                const cart = getCart();
                $(this).val(cart[productId] ? cart[productId].quantity : 1); // Revert to a valid quantity
            }
        });

        $('#cart-items').on('click', '.remove-item', function() {
            const productId = $(this).data('product-id');
            const cart = getCart();
            delete cart[productId];
            saveCart(cart);
            displayCartItems();
            updateCartDisplay();
        });
    }

    // --- Checkout Form Validation (if on checkout.html) ---
    if ($('#checkout-form').length > 0) {
        const checkoutForm = $('#checkout-form');
        checkoutForm.on('submit', function(event) {
            let isValid = true;
            checkoutForm.find(':required').each(function() {
                if (!this.value.trim()) {
                    $(this).addClass('is-invalid');
                    isValid = false;
                } else {
                    $(this).removeClass('is-invalid');
                }
            });

            const emailField = $('#email');
            if (emailField.length > 0 && emailField.val().trim() !== '' && !isValidEmail(emailField.val())) {
                emailField.addClass('is-invalid');
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault(); // Prevent form submission
                alert('Please fill out all required fields correctly.'); // Basic error message
            } else {
                alert('Checkout successful! (Simulated)');
                // In a real scenario, you would process the order here
                localStorage.removeItem('cart'); // Clear the cart after checkout
                updateCartDisplay();
                // Optionally redirect to a thank you page
                window.location.href = 'index.html'; // Redirect to home for this simulation
            }
        });

        checkoutForm.find(':required').on('input', function() {
            $(this).removeClass('is-invalid'); // Remove invalid feedback on input
        });

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }
});