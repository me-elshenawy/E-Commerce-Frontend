// Load header & footer dynamically
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("components/header.html", "header");
  loadComponent("components/footer.html", "footer");
});

// Function to load components
function loadComponent(file, elementId) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(elementId).innerHTML = data;
    });
}

// Example: Add product to cart
function addToCart() {
  alert("Product added to cart!");
}