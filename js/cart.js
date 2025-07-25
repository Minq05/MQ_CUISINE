// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initCartModal();
});

// Modal Functions
function initCartModal() {
    const modal = document.getElementById('dishModal');
    const viewBtns = document.querySelectorAll('.view-btn');
    const closeBtn = document.querySelector('.close');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const addToCartBtn = document.getElementById('addToCart');

    let currentDish = {};
    let quantity = 1;

    // Open modal
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.dish-card, .menu-item');
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            const priceText = card.querySelector('.price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            const image = card.querySelector('.image-placeholder').textContent;

            currentDish = { title, description, price, image };
            quantity = 1;

            // Update modal content
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalDescription').textContent = description;
            document.getElementById('modalPrice').textContent = priceText;
            document.getElementById('modalImage').textContent = image;
            document.getElementById('quantity').textContent = quantity;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Quantity controls
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                document.getElementById('quantity').textContent = quantity;
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            quantity++;
            document.getElementById('quantity').textContent = quantity;
        });
    }

    // Add to cart
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCart(currentDish, quantity);
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            quantity = 1;
        });
    }

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
}

// Add item to cart
function addToCart(dish, qty) {
    const existingItem = cart.find(item => item.title === dish.title);
    
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({
            ...dish,
            quantity: qty
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`Đã thêm ${dish.title} vào giỏ hàng!`);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Open cart modal
function openCart() {
    const cartModal = document.getElementById('cartModal');
    renderCartItems();
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Render cart items
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Giỏ hàng trống</p>';
        cartTotal.textContent = '0 VNĐ';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div class="cart-item-price">${item.price.toLocaleString()} VNĐ</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">×</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = total.toLocaleString() + ' VNĐ';
}

// Update cart quantity
function updateCartQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Checkout
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Giỏ hàng trống!');
                return;
            }
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const orderSummary = cart.map(item => 
                `${item.title} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} VNĐ`
            ).join('\n');
            
            alert(`Đơn hàng của bạn:\n\n${orderSummary}\n\nTổng cộng: ${total.toLocaleString()} VNĐ\n\nCảm ơn bạn đã đặt hàng!`);
            
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            closeModal('cartModal');
        });
    }
});

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f8a5c2;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);