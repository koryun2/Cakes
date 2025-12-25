const cartItems = [];

function navToggle() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");

  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

function openCart() {
  const cartPanel = document.querySelector(".cart-panel");
  const toggle = document.querySelector(".cart-summary");

  if (!cartPanel || !toggle) return;
  toggle.addEventListener("click", () => {
    cartPanel.classList.toggle("show-cart");
  });
}

function addToCart() {
  const buttons = document.querySelectorAll(".add-to-cart-button");
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      if (!card) return;
      alert("Item added to cart!");

      const item = {
        id: `${index}`,
        name: card.querySelector(".product-card-name").textContent,
        price: Number(
          card.querySelector(".product-card-price-value").textContent
        ),
        image: card.querySelector(".product-card-image").src,
        quantity: 1,
      };

      const existingItem = cartItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push(item);
      }
      console.log(cartItems);
      renderCart();
    });
  });
}
const cartItemsContainer = document.querySelector("#cart-items-container");

function renderCart() {
  const itemCount = document.querySelector("#item-count");
  const cartTotal = document.querySelector("#cart-total");

  cartItemsContainer.innerHTML = "";

  let total = 0;
  let countItems = 0;

  cartItems.forEach((item) => {
    total += item.price * item.quantity;
    countItems += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${item.image}" class="cart-item-image" alt="${item.name}">
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name} <span class="cart-item-qty">(x${item.quantity})</span></p>
        <p class="cart-item-price">$${item.price}</p>
      </div>
      <button class="cart-item-remove">
                <svg
                  viewBox="0 0 448 512"
                  width="16"
                  height="16"
                  fill="#ef7998"
                >
                  <path
                    d="M135.2 17.7C140.6 7.4 151.3 0 163.8 0h120.4c12.5 0 23.2 7.4 28.6 17.7L328 32h88c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64s14.3-32 32-32h88l15.2-14.3zM53.2 467c1.6 25.4 22.7 45 48.2 45h245.2c25.5 0 46.6-19.6 48.2-45L416 128H32l21.2 339z"
                  />
                </svg>
              </button>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  itemCount.textContent = countItems + " items - " + "$" + total;
  cartTotal.textContent = total.toFixed(2);
}

cartItemsContainer.addEventListener("click", (e) => {
  const removeButton = e.target.closest(".cart-item-remove");
  const id = removeButton.dataset.id;
  const index = cartItems.findIndex((item) => item.id === id);
  cartItems.splice(index, 1);
  renderCart();
});

const clearCartBtn = document.querySelector("#clear-cart");

clearCartBtn.addEventListener("click", (e) => {
  cartItems.length = 0;
  renderCart();
});

openCart();
navToggle();
addToCart();
