// Catalogue shown in "Explore Our Collection". Prices are in Georgian lari.
const PRODUCTS = [
  { title: "The Georgian Chronicles", price: 15, image: "images/book-chronicles.jpg" },
  { title: "Whispers of the Mountains", price: 12, image: "images/book-mountains.jpg" },
  { title: "Audiobook: Language of the Heart", price: 10, image: "images/book-audiobook.jpg" }
];

function formatPrice(amount) {
  return "₾" + amount.toFixed(2).replace(".", ",");
}

function renderProducts() {
  const list = document.getElementById("products");
  for (const product of PRODUCTS) {
    const item = document.createElement("li");
    item.className = "product";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "product-info";

    const title = document.createElement("div");
    title.className = "product-title";
    title.textContent = product.title;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    info.append(title, price);
    item.append(image, info);
    list.appendChild(item);
  }
}

// The site is static, so the forms only confirm on the page; nothing is sent.
function setUpForms() {
  for (const form of document.querySelectorAll(".signup-form")) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = form.querySelector(".form-message");
      message.textContent = form.dataset.thanks;
      message.hidden = false;
      form.reset();
    });
  }
}

function setUpMenu() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.addEventListener("click", (event) => {
    if (event.target.tagName !== "A") return;
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    for (const link of links.querySelectorAll("a")) {
      link.classList.toggle("active", link === event.target);
    }
  });
}

renderProducts();
setUpForms();
setUpMenu();
