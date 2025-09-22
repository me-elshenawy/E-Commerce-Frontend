# Amazon - E-commerce Frontend Project

A responsive and interactive e-commerce frontend project designed to replicate the core browsing and shopping cart experience of Amazon. This project is built using modern web technologies like HTML5, CSS3, Bootstrap 5, and JavaScript, focusing on a clean, modular, and dynamic user experience.

The application features multiple pages including a homepage, product category page, detailed product view, and a fully functional shopping cart that persists data using browser `localStorage`.

[//]: # (Replace this with a link to your live demo if you deploy it)
**[Live Demo Here]**

## Screenshots

| Homepage | Category Page |
| :---: | :---: |
| *Your Screenshot of home.html* | *Your Screenshot of category.html* |
| **Product Page** | **Shopping Cart** |
| *Your Screenshot of product.html* | *Your Screenshot of cart.html* |

## Features

- **Responsive Design**: Fully responsive layout for seamless viewing on desktops, tablets, and mobile devices, thanks to the Bootstrap 5 grid system.
- **Modular Components**: Dynamically loaded header and footer across all pages for easy maintenance and consistency.
- **Homepage**: Features a dynamic carousel, promotional cards, and sections for deals and budget-friendly items.
- **Category Page**:
  - Displays a grid of products.
  - Client-side filtering by brand and price range.
  - Sorting options for relevance, price, rating, etc.
- **Product Details Page**:
  - Image gallery with main image and clickable thumbnails.
  - Product title, description, rating, and pricing.
  - Options to select quantity and color.
- **Dynamic Shopping Cart**:
  - **Add to Cart**: Add products from the category or product pages.
  - **Persistent Storage**: The cart state is saved in the browser's `localStorage`, so items are not lost on page reload.
  - **Manage Items**: Users can update the quantity of items or remove them completely.
  - **Clear Cart**: Option to empty the entire cart with one click.
  - **Live Summary**: The order summary (subtotal, shipping, tax, total) updates automatically as the cart changes.
- **Interactive Modals**: Bootstrap modals are used for user confirmations like "Added to Cart", "Remove Item", and "Clear Cart".

## Technologies Used

- **HTML5**: For the structure and content of the web pages.
- **CSS3**: For custom styling, animations, and layout enhancements.
- **JavaScript (ES6)**: For all client-side logic, interactivity, and DOM manipulation.
  - **CartManager Class**: An object-oriented approach to manage all shopping cart functionalities.
  - **Local Storage API**: To persist cart data on the user's browser.
- **Bootstrap 5**: The core CSS framework for layout, components (modals, carousel, navbar), and responsiveness.
- **Font Awesome**: For scalable vector icons used throughout the application.

## Project Structure

```
/
|-- assets/
|   |-- css/
|   |   |-- bootstrap.min.css
|   |   |-- style.css
|   |   |-- home.css
|   |   |-- category-style.css
|   |
|   |-- js/
|       |-- bootstrap.bundle.min.js
|       |-- script.js                 # Core cart and product logic
|       |-- main.js                   # Component loading logic
|
|-- components/
|   |-- header.html                 # Reusable header component
|   |-- footer.html                 # Reusable footer component
|
|-- home.html                       # Main landing page
|-- category.html                   # Product listing page
|-- product.html                    # Single product detail page
|-- cart.html                       # Shopping cart page
|-- README.md                       # This file
```

## Getting Started

This is a pure front-end project and requires no special build steps or server environment to run.

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone https://your-repository-url.git
    ```
2.  Navigate into the project directory:
    ```sh
    cd amazon-clone-project
    ```

### Running the Project

Simply open the `home.html` file in your preferred web browser.

```
# On Windows
start home.html

# On macOS
open home.html

# On Linux
xdg-open home.html
```

You can then navigate through the website as you would with any live site.

## How It Works

- **Component Loading**: The `assets/js/main.js` script contains a function that uses the `fetch()` API to dynamically load the content of `components/header.html` and `components/footer.html` into the respective `<header>` and `<footer>` tags on each page. This ensures a single source of truth for these repeating elements.

- **Cart Management**: The `assets/js/script.js` file initializes a `CartManager` class. This class handles all cart operations:
  - When the page loads, it checks `localStorage` for any existing cart data.
  - When a user adds an item, the `addToCart` method updates the cart array and saves it back to `localStorage`.
  - The cart count in the header is updated whenever the cart changes.
  - On the `cart.html` page, the `renderCartItems` method dynamically generates the HTML for each item in the cart and calculates the order summary.
