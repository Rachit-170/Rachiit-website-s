async function loadProductDetail() {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get("id");
      
      if (!productId) {
        document.getElementById("product-detail").innerHTML = "<p>Product not found!</p>";
        return;
      }

      try {
        const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const product = await res.json();

        document.getElementById("product-detail").innerHTML = `
          <div class="detail-container">
            <img src="${product.image}" alt="${product.title}">
            <div class="detail-info">
              <h2>${product.title}</h2>
              <p><strong>Category:</strong> ${product.category}</p>
              <p>${product.description}</p>
              <p class="detail-price">$${product.price}</p>
              <a href ="buy.html"><button class="buy-btn">Buy Now</button></a>
              <br><br>
              <a href="index.html" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Back to Shop</a>
            </div>
          </div>
        `;
      } catch (error) {
        console.error("Error loading product detail:", error);
      }
    }

    window.onload = loadProductDetail;