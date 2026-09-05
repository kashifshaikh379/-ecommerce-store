const products = [
  {
    id: 1,
    name: "Nova Wireless Earbuds",
    category: "Tech",
    price: 2499,
    icon: "🎧",
    description: "Compact wireless earbuds for everyday listening."
  },
  {
    id: 2,
    name: "Smart Desk Lamp",
    category: "Home",
    price: 1799,
    icon: "💡",
    description: "Minimal desk lighting for work and study."
  },
  {
    id: 3,
    name: "Everyday Backpack",
    category: "Lifestyle",
    price: 2199,
    icon: "🎒",
    description: "Simple everyday backpack with useful storage."
  },
  {
    id: 4,
    name: "Portable Power Bank",
    category: "Tech",
    price: 1499,
    icon: "🔋",
    description: "Compact backup power for your devices."
  },
  {
    id: 5,
    name: "Minimal Water Bottle",
    category: "Lifestyle",
    price: 899,
    icon: "🧴",
    description: "Reusable bottle designed for everyday use."
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug",
    category: "Home",
    price: 699,
    icon: "☕",
    description: "Clean and simple mug for your daily coffee."
  },
  {
    id: 7,
    name: "Wireless Keyboard",
    category: "Tech",
    price: 1999,
    icon: "⌨️",
    description: "Slim wireless keyboard for your workspace."
  },
  {
    id: 8,
    name: "Soft Travel Pouch",
    category: "Lifestyle",
    price: 799,
    icon: "👜",
    description: "Compact pouch for travel and everyday essentials."
  }
];

let cart = JSON.parse(localStorage.getItem("novaCart")) || [];
let currentCategory = "All";
let searchTerm = "";

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const totalElement = document.getElementById("total");
const checkoutButton = document.getElementById("checkout");

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}

function renderProducts() {
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      currentCategory === "All" ||
      product.category === currentCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `
      <div class="empty-state">
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <div class="product-image">${product.icon}</div>

      <div class="product-info">
        <h3>${product.name}</h3>

        <p>${product.description}</p>

        <div class="product-row">
          <span class="price">${formatPrice(product.price)}</span>

          <button
            class="add-button"
            onclick="addToCart(${product.id})"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  updateCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);

  saveCart();
  updateCart();
}

function changeQuantity(productId, amount) {
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCart();
}

function updateCart() {
  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    const product = products.find(product => product.id === item.id);

    if (product) {
      totalItems += item.quantity;
      totalPrice += product.price * item.quantity;
    }
  });

  cartCount.textContent = totalItems;
  totalElement.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty</h3>
        <p>Add something you like.</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(product => product.id === item.id);

    if (!product) return "";

    return `
      <div class="cart-item">

        <div class="cart-thumb">
          ${product.icon}
        </div>

        <div>
          <h4>${product.name}</h4>

          <small>
            ${formatPrice(product.price)}
          </small>

          <div class="qty">
            <button onclick="changeQuantity(${product.id}, -1)">
              −
            </button>

            <span>${item.quantity}</span>

            <button onclick="changeQuantity(${product.id}, 1)">
              +
            </button>
          </div>
        </div>

        <button
          onclick="removeFromCart(${product.id})"
          style="border:0;background:none;font-size:18px;"
          aria-label="Remove item"
        >
          ×
        </button>

      </div>
    `;
  }).join("");
}

function saveCart() {
  localStorage.setItem("novaCart", JSON.stringify(cart));
}

function openCart() {
  drawer.classList.add("open");
  overlay.classList.add("open");
}

function closeCartDrawer() {
  drawer.classList.remove("open");
  overlay.classList.remove("open");
}

cartButton.addEventListener("click", openCart);

closeCart.addEventListener("click", closeCartDrawer);

overlay.addEventListener("click", closeCartDrawer);

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});

document.querySelectorAll(".categories button").forEach(button => {
  button.addEventListener("click", () => {

    document
      .querySelectorAll(".categories button")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    currentCategory = button.dataset.category;

    renderProducts();
  });
});

checkoutButton.addEventListener("click", () => {

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  alert(
    "Checkout is coming next! Your cart is working correctly."
  );
});

renderProducts();
updateCart();
