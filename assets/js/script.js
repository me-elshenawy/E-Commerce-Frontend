// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartCount();
        this.initEventListeners();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('amazonCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('amazonCart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Update cart count in navigation
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // Add item to cart
    addToCart(productData) {
        const existingItem = this.cart.find(item => 
            item.id === productData.id && item.color === productData.color
        );

        if (existingItem) {
            existingItem.quantity += productData.quantity;
        } else {
            this.cart.push({
                id: productData.id || Date.now(),
                name: productData.name,
                price: productData.price,
                image: productData.image,
                quantity: productData.quantity,
                color: productData.color || 'black'
            });
        }

        this.saveCart();
        this.showSuccessModal();
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCartItems();
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.renderCartItems();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCartItems();
    }

    // Calculate cart totals
    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 25 ? 0 : 5.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        return {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
            itemCount: this.cart.reduce((sum, item) => sum + item.quantity, 0)
        };
    }

    // Render cart items
    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            if (emptyCart) emptyCart.style.display = 'block';
            this.updateCartSummary();
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">Color: ${item.color}</small>
                </div>
                <div class="cart-item-quantity">
                    <button class="btn btn-sm btn-outline-secondary" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="form-control form-control-sm text-center" value="${item.quantity}" min="1" max="10" 
                           onchange="cartManager.updateQuantity(${item.id}, parseInt(this.value))" style="width: 60px;">
                    <button class="btn btn-sm btn-outline-secondary" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="btn btn-sm btn-outline-primary edit-btn" onclick="openQuantityModal(${item.id})" title="Edit Quantity">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" onclick="openDeleteModal(${item.id})" title="Remove Item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        this.updateCartSummary();
    }

    // Update cart summary
    updateCartSummary() {
        const totals = this.calculateTotals();
        
        const itemCountEl = document.getElementById('itemCount');
        const subtotalEl = document.getElementById('subtotal');
        const shippingEl = document.getElementById('shipping');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');
        const checkoutBtn = document.querySelector('.proceed-checkout-btn');

        if (itemCountEl) itemCountEl.textContent = totals.itemCount;
        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal}`;
        if (shippingEl) shippingEl.textContent = totals.shipping === '0.00' ? 'Free' : `$${totals.shipping}`;
        if (taxEl) taxEl.textContent = `$${totals.tax}`;
        if (totalEl) totalEl.textContent = `$${totals.total}`;
        
        if (checkoutBtn) {
            checkoutBtn.disabled = totals.itemCount === 0;
        }
    }

    // Show success modal
    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    }

    // Initialize event listeners
    initEventListeners() {
        // Color selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('color-option')) {
                document.querySelectorAll('.color-option').forEach(option => {
                    option.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });

    }
}

// Global cart manager instance
let cartManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    cartManager = new CartManager();
    
    // If we're on the cart page, render cart items
    if (document.getElementById('cartItems')) {
        cartManager.renderCartItems();
    }
});

// Product page functions
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = thumbnail.src.replace('w=100&h=100', 'w=600&h=600');
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
    }
}

function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput && parseInt(quantityInput.value) < 10) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput && parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

function addToCart() {
    const productTitle = document.getElementById('productTitle');
    const productPrice = document.getElementById('productPrice');
    const quantityInput = document.getElementById('quantity');
    const mainImage = document.getElementById('mainProductImage');
    const selectedColor = document.querySelector('.color-option.active');

    if (!cartManager) {
        cartManager = new CartManager();
    }

    const productData = {
        name: productTitle ? productTitle.textContent : 'Premium Wireless Headphones',
        price: parseFloat(productPrice ? productPrice.textContent.replace('$', '') : 299.99),
        image: mainImage ? mainImage.src : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        quantity: parseInt(quantityInput ? quantityInput.value : 1),
        color: selectedColor ? selectedColor.dataset.color : 'black'
    };

    cartManager.addToCart(productData);
}

function buyNow() {
    addToCart();
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
}

function goToCart() {
    window.location.href = 'cart.html';
}

// Modal functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    }
}

// Cart page functions
let itemToDelete = null;
let itemToEdit = null;

function openDeleteModal(itemId) {
    itemToDelete = itemId;
    const modal = document.getElementById('deleteModal');
    if (modal) {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

function confirmDelete() {
    if (itemToDelete && cartManager) {
        cartManager.removeFromCart(itemToDelete);
        closeModal('deleteModal');
        itemToDelete = null;
    }
}

function clearCart() {
    const modal = document.getElementById('clearCartModal');
    if (modal) {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

function confirmClearCart() {
    if (cartManager) {
        cartManager.clearCart();
        closeModal('clearCartModal');
    }
}

function openQuantityModal(itemId) {
    itemToEdit = itemId;
    const item = cartManager.cart.find(item => item.id === itemId);
    const modalQuantity = document.getElementById('modalQuantity');
    
    if (modalQuantity && item) {
        modalQuantity.value = item.quantity;
    }
    
    const modal = document.getElementById('quantityModal');
    if (modal) {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

function increaseQuantityModal() {
    const modalQuantity = document.getElementById('modalQuantity');
    if (modalQuantity && parseInt(modalQuantity.value) < 10) {
        modalQuantity.value = parseInt(modalQuantity.value) + 1;
    }
}

function decreaseQuantityModal() {
    const modalQuantity = document.getElementById('modalQuantity');
    if (modalQuantity && parseInt(modalQuantity.value) > 1) {
        modalQuantity.value = parseInt(modalQuantity.value) - 1;
    }
}

function confirmQuantityUpdate() {
    const modalQuantity = document.getElementById('modalQuantity');
    if (itemToEdit && modalQuantity && cartManager) {
        cartManager.updateQuantity(itemToEdit, parseInt(modalQuantity.value));
        closeModal('quantityModal');
        itemToEdit = null;
    }
}

function proceedToCheckout() {
    if (cartManager && cartManager.cart.length > 0) {
        alert('Redirecting to checkout page...\n\nIn a real application, this would take you to the payment process.');
    }
}

function addRecommendedToCart(name, price, image) {
    if (!cartManager) {
        cartManager = new CartManager();
    }

    const productData = {
        name: name,
        price: price,
        image: image,
        quantity: 1,
        color: 'default'
    };

    cartManager.addToCart(productData);
    
    // Show a quick notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `<i class="fas fa-check"></i> ${name} added to cart!`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);