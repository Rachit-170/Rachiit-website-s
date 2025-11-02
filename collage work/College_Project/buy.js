// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct() {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
    const product = await res.json();

    document.getElementById("product-details").innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="product-info">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p><strong>Price: $${product.price}</strong></p>
      </div>
    `;
  } catch (error) {
    console.error("Error loading product:", error);
  }
}
loadProduct();

// Handle form submission

