const cartItems = [];

function navToggle() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");

  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}
navToggle();

function openCart() {
  const cartPanel = document.querySelector(".cart-panel");
  const toggle = document.querySelector(".cart-summary");

  if (!cartPanel || !toggle) return;
  toggle.addEventListener("click", () => {
    cartPanel.classList.toggle("show-cart");
  });
}

const buttons = document.querySelectorAll(".add-to-cart-button");
function addToCart() {
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      if (!card) return;

      const item = {
        id: `${index}`,
        name: card.querySelector(".product-card-name").textContent.trim(),
        price: Number(
          card.querySelector(".product-card-price-value").textContent.trim()
        ),
        image: card.querySelector(".product-card-image").src,
        quantity: 1,
      };
      cartItems.push(item);
      console.log(cartItems);
    });
  });
}

addToCart();
openCart();
