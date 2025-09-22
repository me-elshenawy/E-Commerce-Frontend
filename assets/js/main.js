// Function to load components dynamically
function loadComponent(file, elementId) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = data;
      }
    })
    .catch(err => console.error(`Failed to load component ${file}:`, err));
}

// Load header & footer on all pages
document.addEventListener("DOMContentLoaded", () => {
  loadComponent('components/header.html', 'header');
  loadComponent('components/footer.html', 'footer');
});
