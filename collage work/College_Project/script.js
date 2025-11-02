let allProducts = [];

async function loadProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products/");
    const data = await res.json();
    allProducts = data; // save all products
    displayProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Function to display products
function displayProducts(products) {
  document.getElementById("products").innerHTML = products.map(item => `
    <div class="card">
      <a href="detail.html?id=${item.id}" style="text-decoration:none; color:inherit;">
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p class="price">$${item.price}</p>
        <button class="buy-btn">Buy Now</button>
      </a>
    </div>
  `).join("");
}

// Search functionality
document.querySelector(".search-box").addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();
  const filtered = allProducts.filter(item =>
    item.title.toLowerCase().includes(searchText)
  );
  displayProducts(filtered);
});

// Load products on page load
window.onload = loadProducts;

// Go to top
document.querySelector(".go-to-top button").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Scroll to about
document.querySelector(".about").addEventListener("click", () => {
  document.getElementById("about-section").scrollIntoView({ behavior: "smooth" });
});
