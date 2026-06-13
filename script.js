/**
 * RAJAPAKSHE CLOTHING - script.js
 * Full e-commerce functionality: cart, filtering, search, navigation
 */

// ==========================================
// PRODUCT DATA
// ==========================================

const products = [
    {
        id: 1,
        name: "Linen Blend Shirt",
        price: 89,
        category: "men",
        image: "images/product1.jpg",
        description: "Crafted from premium European linen, this relaxed-fit shirt features a mandarin collar and natural breathability perfect for warm days."
    },
    {
        id: 2,
        name: "Structured Blazer",
        price: 245,
        category: "men",
        image: "images/product2.jpg",
        description: "A modern take on classic tailoring. This navy structured blazer features a slim silhouette and premium fabric blend for all-day comfort."
    },
    {
        id: 3,
        name: "Wide Leg Trouser",
        price: 178,
        category: "women",
        image: "images/product3.jpg",
        description: "Elegant wide-leg trousers with a high waist and flowing silhouette. The perfect foundation for a sophisticated look."
    },
    {
        id: 4,
        name: "Cashmere Knit",
        price: 320,
        category: "women",
        image: "images/product4.jpg",
        description: "Luxuriously soft cashmere sweater in a versatile cream tone. Lightweight warmth for layering through every season."
    },
    {
        id: 5,
        name: "Silk Midi Dress",
        price: 265,
        category: "women",
        image: "images/product5.jpg",
        description: "A flowing silk midi dress in dusty rose. The V-neckline and delicate straps create an effortlessly elegant silhouette."
    },
    {
        id: 6,
        name: "Cotton Tailored Short",
        price: 98,
        category: "men",
        image: "images/product6.jpg",
        description: "Smart tailored shorts in breathable cotton. Designed with a modern cut that transitions seamlessly from casual to refined."
    },
    {
        id: 7,
        name: "Oversized Trench",
        price: 385,
        category: "women",
        image: "images/product7.jpg",
        description: "The ultimate wardrobe investment. A timeless camel trench coat with an oversized fit and water-resistant finish."
    },
    {
        id: 8,
        name: "Merino Polo",
        price: 125,
        category: "men",
        image: "images/product8.jpg",
        description: "Refined merino wool polo shirt in deep navy. Superior softness meets classic style for elevated everyday wear."
    },
    {
        id: 9,
        name: "Kids Formal Set",
        price: 145,
        category: "kids",
        image: "images/cat-kids.jpg",
        description: "Adorable navy blazer set for your little gentleman. Includes blazer, shirt, chinos, bow tie, and matching shoes."
    },
    {
        id: 10,
        name: "Leather Belt",
        price: 68,
        category: "accessories",
        image: "images/cat-accessories.jpg",
        description: "Handcrafted genuine leather belt with gold-tone buckle. A timeless accessory that complements any outfit."
    },
    {
        id: 11,
        name: "Summer Sundress",
        price: 156,
        category: "kids",
        image: "images/product5.jpg",
        description: "A charming sundress for your little one. Made from soft, breathable cotton with a playful floral print."
    },
    {
        id: 12,
        name: "Silk Scarf",
        price: 85,
        category: "accessories",
        image: "images/product4.jpg",
        description: "Pure silk scarf with an elegant paisley pattern. The perfect finishing touch for any ensemble."
    }
];

// ==========================================
// CART MANAGEMENT (localStorage)
// ==========================================

function getCart() {
    return JSON.parse(localStorage.getItem('rajapakshe_cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('rajapakshe_cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(productId, size = 'M', quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId && item.size === size);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size,
                quantity: quantity
            });
        }
    }

    saveCart(cart);
    showToast('Added to cart');
}

function removeFromCart(productId, size) {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart(cart);
    renderCart();
}

function updateQuantity(productId, size, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }
    }
    saveCart(cart);
    renderCart();
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartBadge() {
    const badges = document.querySelectorAll('#cartBadge');
    const count = getCartCount();
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });
}

function clearCart() {
    localStorage.removeItem('rajapakshe_cart');
    updateCartBadge();
}

// ==========================================
// UI HELPERS
// ==========================================

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
    `;

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function getWishlist() {
    return JSON.parse(localStorage.getItem('rajapakshe_wishlist')) || [];
}

function toggleWishlist(productId) {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showToast('Added to wishlist');
    }

    localStorage.setItem('rajapakshe_wishlist', JSON.stringify(wishlist));
}

function isWishlisted(productId) {
    return getWishlist().includes(productId);
}

// ==========================================
// PRODUCT CARD RENDERER
// ==========================================

function createProductCard(product, showWishlist = true) {
    const wishlisted = isWishlisted(product.id);
    const wishlistHTML = showWishlist ? `
        <button class="wishlist-btn ${wishlisted ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${wishlisted ? '#e74c3c' : 'none'}" stroke="${wishlisted ? '#e74c3c' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
            </svg>
        </button>
    ` : '';

    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${wishlistHTML}
                <button class="quick-add" data-id="${product.id}">Add to Bag</button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <p class="product-category">${product.category}</p>
            </div>
        </div>
    `;
}

// ==========================================
// PAGE-SPECIFIC RENDERERS
// ==========================================

// Home Page - Featured Products
function renderFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featured = products.slice(0, 8);
    container.innerHTML = featured.map(p => createProductCard(p)).join('');
    attachProductListeners();
}

// Shop Page - All Products
function renderShopProducts(filter = 'all', sort = 'default') {
    const container = document.getElementById('shopProducts');
    const countEl = document.getElementById('productCount');
    if (!container) return;

    let filtered = filter === 'all'
        ? [...products]
        : products.filter(p => p.category === filter);

    // Sorting
    switch (sort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    container.innerHTML = filtered.map(p => createProductCard(p)).join('');
    if (countEl) {
        countEl.textContent = `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
    }
    attachProductListeners();
}

// Product Detail Page
function renderProductDetail() {
    const container = document.getElementById('productDetail');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        container.innerHTML = '<div class="container"><p>Product not found. <a href="shop.html">Back to shop</a></p></div>';
        return;
    }

    // Update breadcrumb
    const breadcrumbProduct = document.getElementById('breadcrumbProduct');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.name;
    }

    container.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <span class="detail-category">${product.category}</span>
                <h1 class="detail-title">${product.name}</h1>
                <p class="detail-price">$${product.price}</p>
                <p class="detail-description">${product.description}</p>

                <div class="size-section">
                    <span class="size-label">Select Size</span>
                    <div class="size-options">
                        <button class="size-btn" data-size="S">S</button>
                        <button class="size-btn selected" data-size="M">M</button>
                        <button class="size-btn" data-size="L">L</button>
                        <button class="size-btn" data-size="XL">XL</button>
                    </div>
                </div>

                <div class="add-to-cart-section">
                    <div class="quantity-selector">
                        <button class="qty-minus">-</button>
                        <input type="text" value="1" readonly>
                        <button class="qty-plus">+</button>
                    </div>
                    <button class="btn-add-cart" data-id="${product.id}">Add to Cart</button>
                </div>

                <div class="product-meta">
                    <div class="meta-item">
                        <span>Material</span>
                        <span>Premium Quality</span>
                    </div>
                    <div class="meta-item">
                        <span>Shipping</span>
                        <span>Free worldwide</span>
                    </div>
                    <div class="meta-item">
                        <span>Returns</span>
                        <span>30-day returns</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Attach listeners
    const sizeBtns = container.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    const qtyInput = container.querySelector('.quantity-selector input');
    container.querySelector('.qty-minus').addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val > 1) qtyInput.value = val - 1;
    });
    container.querySelector('.qty-plus').addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val < 10) qtyInput.value = val + 1;
    });

    container.querySelector('.btn-add-cart').addEventListener('click', function() {
        const size = container.querySelector('.size-btn.selected').dataset.size;
        const qty = parseInt(qtyInput.value);
        addToCart(product.id, size, qty);
    });

    // Related products
    renderRelatedProducts(product.id, product.category);
}

function renderRelatedProducts(currentId, category) {
    const container = document.getElementById('relatedProducts');
    if (!container) return;

    const related = products
        .filter(p => p.id !== currentId && (p.category === category || Math.random() > 0.5))
        .slice(0, 4);

    container.innerHTML = related.map(p => createProductCard(p)).join('');
    attachProductListeners();
}

// Cart Page
function renderCart() {
    const itemsContainer = document.getElementById('cartItems');
    const summaryEl = document.getElementById('cartSummary');
    const layoutEl = document.getElementById('cartLayout');
    const emptyEl = document.getElementById('emptyCart');

    if (!itemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        if (layoutEl) layoutEl.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }

    if (layoutEl) layoutEl.style.display = 'grid';
    if (emptyEl) emptyEl.style.display = 'none';

    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price}</p>
                <p class="item-size">Size: ${item.size}</p>
                <div class="quantity-selector" style="margin-top: 12px; width: fit-content;">
                    <button onclick="updateQuantity(${item.id}, '${item.size}', -1)">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button onclick="updateQuantity(${item.id}, '${item.size}', 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <p class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.size}')">Remove</button>
            </div>
        </div>
    `).join('');

    // Update summary
    const subtotal = getCartTotal();
    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function attachProductListeners() {
    // Product card click -> product detail
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist-btn') || e.target.closest('.quick-add')) return;
            const id = card.dataset.id;
            window.location.href = `product.html?id=${id}`;
        });
    });

    // Quick add buttons
    document.querySelectorAll('.quick-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            toggleWishlist(id);
            btn.classList.toggle('active');
            const svg = btn.querySelector('svg');
            if (btn.classList.contains('active')) {
                svg.setAttribute('fill', '#e74c3c');
                svg.setAttribute('stroke', '#e74c3c');
            } else {
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'currentColor');
            }
        });
    });
}

// Filter buttons
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    // Check URL for category param
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            const sort = document.getElementById('sortSelect')?.value || 'default';
            renderShopProducts(filter, sort);
        });
    });

    // If URL has category, activate that filter
    if (categoryParam) {
        const matchingBtn = document.querySelector(`.filter-btn[data-filter="${categoryParam}"]`);
        if (matchingBtn) {
            filterBtns.forEach(b => b.classList.remove('active'));
            matchingBtn.classList.add('active');
            renderShopProducts(categoryParam);
        }
    }
}

// Sort select
function setupSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', () => {
        const activeFilter = document.querySelector('.filter-btn.active');
        const filter = activeFilter ? activeFilter.dataset.filter : 'all';
        renderShopProducts(filter, sortSelect.value);
    });
}

// Search functionality
function setupSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (!searchToggle) return;

    searchToggle.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            setTimeout(() => searchInput.focus(), 100);
        }
    });

    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('active');
        searchResults.innerHTML = '';
        searchInput.value = '';
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        const matches = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            searchResults.innerHTML = '<p style="padding: 12px; color: #6b6b6b; font-size: 14px;">No products found</p>';
            return;
        }

        searchResults.innerHTML = matches.slice(0, 5).map(p => `
            <div class="search-result-item" onclick="window.location.href='product.html?id=${p.id}'">
                <img src="${p.image}" alt="${p.name}">
                <span>${p.name} - $${p.price}</span>
            </div>
        `).join('');
    });

    // Close search on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchBar.classList.remove('active');
            searchResults.innerHTML = '';
        }
    });
}

// Mobile menu
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');

    if (!menuToggle) return;

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    menuClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
}

// Sticky navbar shadow
function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 1px 10px rgba(0,0,0,0.06)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// Newsletter form
function setupNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thank you for subscribing!');
        form.reset();
    });
}

// Checkout modal
function setupCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const modal = document.getElementById('checkoutModal');
    const modalClose = document.getElementById('modalClose');

    if (!checkoutBtn || !modal) return;

    checkoutBtn.addEventListener('click', () => {
        modal.classList.add('active');
        clearCart();
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Scroll animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .section-title, .story-content, .promo-content').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderFeaturedProducts();
    renderShopProducts();
    renderProductDetail();
    renderCart();
    setupFilters();
    setupSort();
    setupSearch();
    setupMobileMenu();
    setupNavbarScroll();
    setupNewsletter();
    setupCheckout();
    setupScrollAnimations();
});
