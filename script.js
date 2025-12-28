
const state = {
  cart: [],
  currentFilter: "all",
  searchQuery: "",
};


const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function cloneTemplate(templateId) {
  const template = $(templateId);
  return template.content.cloneNode(true);
}

function renderSiteConfig() {
  $("#phone-number").textContent = siteConfig.phone;
  $("#about-text").textContent = siteConfig.aboutText;
  $("#about-image").src = siteConfig.aboutImage;
}

function renderNavMenu() {
  const navMenu = $("#nav-menu");
  navMenu.innerHTML = "";

  navItems.forEach((item) => {
    const clone = cloneTemplate("#nav-item-template");
    const link = clone.querySelector(".nav-menu-link");
    link.href = item.href;
    link.textContent = item.label;
    navMenu.appendChild(clone);
  });
}

function renderFilters() {
  const filterBar = $("#filter-bar");
  filterBar.innerHTML = "";

  categories.forEach((category) => {
    const clone = cloneTemplate("#filter-button-template");
    const button = clone.querySelector(".filter-button");
    button.dataset.filter = category;
    button.textContent = category;
    if (state.currentFilter === category) {
      button.classList.add("active");
    }
    filterBar.appendChild(clone);
  });
}

function renderProducts() {
  const storeItems = $("#store-items");
  storeItems.innerHTML = "";

  const filteredProducts = products.filter((product) => {
    const matchesFilter =
      state.currentFilter === "all" || product.category === state.currentFilter;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(state.searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "no-products";
    emptyMsg.textContent = "No products found matching your criteria.";
    storeItems.appendChild(emptyMsg);
    return;
  }

  filteredProducts.forEach((product) => {
    const clone = cloneTemplate("#product-card-template");
    const card = clone.querySelector(".product-card");
    const img = clone.querySelector(".product-card-image");
    const name = clone.querySelector(".product-card-name");
    const price = clone.querySelector(".product-card-price-value");
    const addBtn = clone.querySelector(".add-to-cart-button");

    card.dataset.item = product.category;
    card.dataset.id = product.id;
    img.src = product.image;
    img.alt = product.name;
    name.textContent = product.name;
    price.textContent = product.price;
    addBtn.dataset.productId = product.id;

    storeItems.appendChild(clone);
  });
}

function renderCart() {
  const cartContainer = $("#cart-items-container");
  const itemCount = $("#item-count");
  const cartTotal = $("#cart-total");

  console.log("cartTotal", cartTotal);

  cartContainer.innerHTML = "";

  const total = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  if (state.cart.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "cart-empty";
    emptyMsg.textContent = "Your cart is empty";
    cartContainer.appendChild(emptyMsg);
  } else {
    state.cart.forEach((item) => {
      const clone = cloneTemplate("#cart-item-template");
      const cartItem = clone.querySelector(".cart-item");
      const img = clone.querySelector(".cart-item-image");
      const name = clone.querySelector(".cart-item-name");
      const qty = clone.querySelector(".cart-item-qty");
      const price = clone.querySelector(".cart-item-price");
      const removeBtn = clone.querySelector(".cart-item-remove");

      cartItem.dataset.cartId = item.id;
      img.src = item.image;
      img.alt = item.name;
      name.textContent = item.name + " ";
      qty.textContent = `(x${item.quantity})`;
      name.appendChild(qty);
      price.textContent = `$${item.price}`;
      removeBtn.dataset.id = item.id;

      cartContainer.appendChild(clone);
    });
  }

  itemCount.textContent = `${count} items - $${total}`;
  cartTotal.textContent = total.toFixed(2);
}

function setupNavToggle() {
  const nav = $(".nav");
  const toggle = $(".nav-toggle");
  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => nav.classList.toggle("is-open"));
}

function setupCartToggle() {
  const cartPanel = $(".cart-panel");
  const cartButton = $(".cart-summary");
  if (!cartPanel || !cartButton) return;

  cartButton.addEventListener("click", () =>
    cartPanel.classList.toggle("show-cart")
  );
}

function setupAddToCart() {
  const storeItems = $("#store-items");
  if (!storeItems) return;

  storeItems.addEventListener("click", (e) => {
    const button = e.target.closest(".add-to-cart-button");
    if (!button) return;

    const productId = parseInt(button.dataset.productId);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = state.cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    renderCart();
    showNotification(`${product.name} added to cart!`);
  });
}

function setupRemoveFromCart() {
  const cartContainer = $("#cart-items-container");
  if (!cartContainer) return;

  cartContainer.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".cart-item-remove");
    if (!removeBtn) return;

    const itemId = parseInt(removeBtn.dataset.id);
    state.cart = state.cart.filter((item) => item.id !== itemId);
    renderCart();
  });
}

function setupClearCart() {
  const clearBtn = $("#clear-cart");
  if (!clearBtn) return;

  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    state.cart = [];
    renderCart();
  });
}

function setupFilter() {
  const filterBar = $("#filter-bar");
  if (!filterBar) return;

  filterBar.addEventListener("click", (e) => {
    const button = e.target.closest(".filter-button");
    if (!button) return;

    state.currentFilter = button.dataset.filter;
    renderFilters();
    renderProducts();
  });
}

function setupSearch() {
  const searchInput = $("#search-item");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderProducts();
  });
}


function showNotification(message) {
  const existing = $(".notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add("show"), 10);
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function initApp() {
  // Render dynamic content
  renderSiteConfig();
  renderNavMenu();
  renderFilters();
  renderProducts();
  renderCart();

  // Setup event listeners
  setupNavToggle();
  setupCartToggle();
  setupAddToCart();
  setupRemoveFromCart();
  setupClearCart();
  setupFilter();
  setupSearch();
}

document.addEventListener("DOMContentLoaded", initApp);
