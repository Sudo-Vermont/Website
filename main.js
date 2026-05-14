// ==========================================
// GOODSTUFF — Main JavaScript
// ==========================================

// CUSTOM CURSOR
const cursor = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

if (cursor && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .col-card, .product-card, .tier-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });
}

// NAVBAR SCROLL
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ACTIVE NAV LINK
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  if (link.getAttribute('href') === window.location.pathname.split('/').pop() ||
      (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) && link.getAttribute('href') === 'index.html') {
    link.classList.add('active');
  }
});

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// ==========================================
// CART SYSTEM
// ==========================================
let cart = JSON.parse(localStorage.getItem('gs-cart') || '[]');

function saveCart() {
  localStorage.setItem('gs-cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.length;
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  }
  renderCartItems();
}

function addToCart(item) {
  cart.push({ ...item, id: Date.now() + Math.random() });
  saveCart();
  showToast(`${item.name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function renderCartItems() {
  const container = document.querySelector('.cart-items');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">⛓️</div>
        <p>Your cart is empty</p>
      </div>`;
    const totalEl = document.querySelector('.cart-total-price');
    if (totalEl) totalEl.textContent = '$0';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji || '⛓️'}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>`).join('');

  const totalEl = document.querySelector('.cart-total-price');
  if (totalEl) totalEl.textContent = `$${total}`;
}

// CART SIDEBAR TOGGLE
const cartOverlay = document.querySelector('.cart-overlay');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartClose = document.querySelector('.cart-close');
const navCart = document.querySelector('.nav-cart');

function openCart() {
  cartOverlay.classList.add('open');
  cartSidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartOverlay.classList.remove('open');
  cartSidebar.classList.remove('open');
  document.body.style.overflow = '';
}

if (navCart) navCart.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// ==========================================
// TOAST NOTIFICATION
// ==========================================
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = '✦ ' + message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ==========================================
// CUSTOM ORDER MODAL
// ==========================================
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');
const orderForm = document.querySelector('.order-form');
const openOrderBtns = document.querySelectorAll('[data-open-order]');

function openModal() {
  if (modalOverlay) {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

openOrderBtns.forEach(btn => btn.addEventListener('click', openModal));
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
    showToast('Order submitted! We\'ll DM you within 24h');
  });
}

// ==========================================
// PRODUCT FILTER
// ==========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ==========================================
// QUICK ADD BUTTONS
// ==========================================
document.querySelectorAll('.product-quick-add, .product-add-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.product-card');
    if (!card) return;
    const name = card.querySelector('.product-name')?.textContent || 'Item';
    const price = parseInt(card.querySelector('.product-price')?.textContent?.replace('$', '') || '10');
    const emoji = card.querySelector('.product-img')?.textContent?.trim() || '⛓️';

    addToCart({ name, price, emoji });

    const addBtn = card.querySelector('.product-add-btn');
    if (addBtn) {
      addBtn.classList.add('added');
      addBtn.textContent = '✓';
      setTimeout(() => {
        addBtn.classList.remove('added');
        addBtn.textContent = '+';
      }, 1500);
    }
  });
});

// TIER ORDER BUTTONS
document.querySelectorAll('.tier-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.tier-card');
    const name = card?.querySelector('.tier-name')?.textContent || 'Custom Chain';
    const price = parseInt(card?.querySelector('.tier-price')?.textContent?.replace('$', '') || '20');
    openModal();
    const tierSelect = document.querySelector('#tier-select');
    if (tierSelect) {
      const optionMap = { 20: 'starter', 35: 'premium', 50: 'diamond' };
      tierSelect.value = optionMap[price] || 'starter';
    }
  });
});

// ==========================================
// CHECKOUT
// ==========================================
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!');
      return;
    }
    showToast('Redirecting to checkout...');
    setTimeout(() => {
      cart = [];
      saveCart();
      closeCart();
      showToast('Order placed! Check your Discord DMs');
    }, 1500);
  });
}

// INIT
updateCartUI();
