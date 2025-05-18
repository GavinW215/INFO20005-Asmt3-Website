// Shop page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const searchInput = document.querySelector('.search-input');
    const sortSelect = document.querySelector('.filter-select');
    const priceFilters = document.querySelectorAll('input[name="price"]');
    const roastFilters = document.querySelectorAll('input[name="roast"]');
    const originFilters = document.querySelectorAll('input[name="origin"]');
    const productCards = document.querySelectorAll('.shop-product-card');

    // If not on shop page, don't execute rest of code
    if (!searchInput) return;

    // Search functionality
    searchInput.addEventListener('input', filterProducts);

    // Sort functionality
    sortSelect.addEventListener('change', sortProducts);

    // Filter change listeners
    priceFilters.forEach(filter => {
        filter.addEventListener('change', filterProducts);
    });

    roastFilters.forEach(filter => {
        filter.addEventListener('change', filterProducts);
    });

    originFilters.forEach(filter => {
        filter.addEventListener('change', filterProducts);
    });

    // Filter products based on search and filter selections
    function filterProducts() {
        // Get filter values
        const searchTerm = searchInput.value.toLowerCase();
        const selectedPrice = document.querySelector('input[name="price"]:checked').closest('label').textContent.trim();
        const selectedRoast = document.querySelector('input[name="roast"]:checked').closest('label').textContent.trim();
        const selectedOrigin = document.querySelector('input[name="origin"]:checked').closest('label').textContent.trim();

        productCards.forEach(card => {
            // Get product details
            const title = card.querySelector('.shop-product-title').textContent.toLowerCase();
            const price = parseFloat(card.querySelector('.shop-product-price').textContent.replace('$', ''));

            // Get tags
            const tagElements = card.querySelectorAll('.product-tag');
            const tags = Array.from(tagElements).map(tag => tag.textContent.toLowerCase());

            // Check if product matches filters
            const matchesSearch = title.includes(searchTerm);

            let matchesPrice = true;
            if (selectedPrice !== 'All Prices') {
                if (selectedPrice === 'Under $20' && price >= 20) {
                    matchesPrice = false;
                } else if (selectedPrice === '$20 - $30' && (price < 20 || price > 30)) {
                    matchesPrice = false;
                } else if (selectedPrice === 'Over $30' && price <= 30) {
                    matchesPrice = false;
                }
            }

            let matchesRoast = true;
            if (selectedRoast !== 'All Roasts') {
                const roastType = selectedRoast.toLowerCase();
                matchesRoast = tags.includes(roastType);
            }

            let matchesOrigin = true;
            if (selectedOrigin !== 'All Origins') {
                const originType = selectedOrigin.toLowerCase();
                matchesOrigin = tags.includes(originType);
            }

            // Show/hide product based on filter matches
            if (matchesSearch && matchesPrice && matchesRoast && matchesOrigin) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Sort products by price or name
    function sortProducts() {
        const sortValue = sortSelect.value;
        const productsContainer = document.querySelector('.product-grid');
        const productsArray = Array.from(productCards);

        // Sort products based on selected option
        productsArray.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.shop-product-price').textContent.replace('$', ''));
            const priceB = parseFloat(b.querySelector('.shop-product-price').textContent.replace('$', ''));
            const nameA = a.querySelector('.shop-product-title').textContent;
            const nameB = b.querySelector('.shop-product-title').textContent;

            if (sortValue === 'Price: Low to High') {
                return priceA - priceB;
            } else if (sortValue === 'Price: High to Low') {
                return priceB - priceA;
            } else if (sortValue === 'Name: A to Z') {
                return nameA.localeCompare(nameB);
            } else if (sortValue === 'Name: Z to A') {
                return nameB.localeCompare(nameA);
            }

            // Default (Featured) - restore original order
            return 0;
        });

        // Re-append products in sorted order
        productsArray.forEach(product => {
            productsContainer.appendChild(product);
        });
    }
});

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function () {
    // Create mobile menu toggle
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');

    // Create the mobile menu toggle button
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = `
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    `;
    header.appendChild(menuToggle);

    // Toggle mobile menu
    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        document.querySelector('.nav-menu').classList.toggle('active');
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function () {
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Add hover effects to product cards
    const productCards = document.querySelectorAll('.product-card, .shop-product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Product detail page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0) return; // Not on product detail page

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get the tab to activate
            const tabToActivate = this.getAttribute('data-tab');
            document.getElementById(tabToActivate).classList.add('active');
        });
    });

    // Quantity controls
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    const quantityInput = document.querySelector('#quantity');

    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function () {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });

        increaseBtn.addEventListener('click', function () {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });

        // Validate manual input
        quantityInput.addEventListener('change', function () {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    }

    // Size selection affects price
    const sizeSelect = document.querySelector('#size');
    const priceDisplay = document.querySelector('.product-detail-price');

    if (sizeSelect && priceDisplay) {
        sizeSelect.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            const priceText = selectedOption.textContent.split('-')[1].trim();
            priceDisplay.textContent = priceText;
        });
    }

    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            const productTitle = document.querySelector('.product-detail-title').textContent;
            const size = document.querySelector('#size').value;
            const grind = document.querySelector('#grind').value;
            const quantity = document.querySelector('#quantity').value;
            const price = document.querySelector('.product-detail-price').textContent;

            // In a real app, this would send data to cart system
            // For demo purposes we'll just show an alert
            alert(`Added to cart: ${quantity}x ${productTitle} (${size}, ${grind}) - ${price}`);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Only run on pages that are not index.html
    const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    if (isHome) return;

    // Fetch index.html and extract nav and footer
    fetch('index.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Nav
            const nav = doc.querySelector('header');
            if (nav && document.getElementById('nav-placeholder')) {
                document.getElementById('nav-placeholder').innerHTML = nav.outerHTML;
            }

            // Footer
            const footer = doc.querySelector('footer');
            if (footer && document.getElementById('footer-placeholder')) {
                document.getElementById('footer-placeholder').innerHTML = footer.outerHTML;
            }
        });
});