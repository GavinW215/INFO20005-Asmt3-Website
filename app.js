// Navigation and Search component loading for non-home pages
document.addEventListener('DOMContentLoaded', function () {
    const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    if (!isHome) {
        // Fetch index.html and extract nav and search components
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

                // Search component
                const searchComponent = doc.querySelector('.search-overlay');
                if (searchComponent && document.getElementById('search-component-placeholder')) {
                    document.getElementById('search-component-placeholder').innerHTML = searchComponent.outerHTML;
                }

                // Footer
                const footer = doc.querySelector('footer');
                if (footer && document.getElementById('footer-placeholder')) {
                    document.getElementById('footer-placeholder').innerHTML = footer.outerHTML;
                }

                // Initialize search after loading
                initializeSearch();
                // Initialize cart functionality
                initializeCart();
            })
    } else {
        // Initialize search directly for home page
        initializeSearch();
        // Initialize cart functionality
        initializeCart();
    }

    function initializeSearch() {
        // Search elements
        const searchTrigger = document.getElementById('search-trigger');
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('search-input');
        const searchClose = document.getElementById('search-close');
        const searchOverlayClose = document.getElementById('search-overlay-close');
        const searchDropdown = document.getElementById('search-dropdown');
        const searchResults = document.getElementById('search-results');
        const searchTags = document.querySelectorAll('.search-tag');

        // Sample product data for search suggestions
        const products = [
            { name: 'Daily Blend coffee beans' },
            { name: 'Espresso coffee beans' },
            { name: 'Mocca coffee beans' },
            { name: 'Decaffeinated coffee beans' },
            { name: 'Crema coffee beans' },
            { name: 'Fairtrade coffee beans' },
        ];

        // Open search overlay
        if (searchTrigger) {
            searchTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                openSearch();
            });
        }

        // Close search overlay (original close button)
        if (searchClose) {
            searchClose.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeSearch();
            });
        }

        // Close search overlay (new cancel button in corner)
        if (searchOverlayClose) {
            searchOverlayClose.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeSearch();
            });
        }



        // Search input functionality
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                const query = this.value.trim().toLowerCase();

                if (query.length > 0) {
                    showSearchDropdown();
                    updateSearchResults(query);
                } else {
                    hideSearchDropdown();
                }
            });

            // Prevent form submission on Enter
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = this.value.trim();
                    if (query) {
                        // Redirect to search results page with search query
                        window.location.href = `search-results.html?search=${encodeURIComponent(query)}`;
                    }
                }
            });
        }

        // Search tag click functionality
        searchTags.forEach(tag => {
            tag.addEventListener('click', function (e) {
                e.stopPropagation();
                const tagText = this.textContent.trim().toLowerCase();
                // Redirect to search results page
                window.location.href = `search-results.html?search=${encodeURIComponent(tagText)}`;
            });
        });

        // ESC key to close search
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
        });

        function openSearch() {
            searchOverlay.classList.add('active');

            // Focus on search input after animation
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        }

        function closeSearch() {
            searchOverlay.classList.remove('active');
            hideSearchDropdown();
            searchInput.value = '';
        }

        function showSearchDropdown() {
            searchDropdown.classList.add('show');
        }

        function hideSearchDropdown() {
            searchDropdown.classList.remove('show');
        }

        function updateSearchResults(query) {
            // Simple filtering - just check if product name contains the query
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );

            // Clear previous results
            searchResults.innerHTML = '';

            // Add search results
            filteredProducts.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';

                resultItem.innerHTML = `
                    <div class="search-result-content">
                        <div class="search-result-icon">
                            <img src="public/images/Search.png" alt="Search" width="12" height="12">
                        </div>
                        <span class="search-result-text">${product.name}</span>
                    </div>
                `;

                // Add click functionality - use exact product name
                resultItem.addEventListener('click', function (e) {
                    e.stopPropagation();
                    window.location.href = `search-results.html?search=${encodeURIComponent(product.name)}`;
                });

                searchResults.appendChild(resultItem);
            });

            // If no results found
            if (filteredProducts.length === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'search-result-item';
                noResults.innerHTML = `
                    <div class="search-result-content">
                        <span class="search-result-text">No products found for "${query}"</span>
                    </div>
                `;
                searchResults.appendChild(noResults);
            }
        }


    }
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initializeCart() {
    updateCartDisplay();
    updateCartCount();

    // Handle add to cart button on product pages
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            // Get product details
            const productName = document.querySelector('.product-detail-title').textContent.trim();
            const priceText = document.querySelector('.product-detail-price').textContent;
            const basePrice = parseFloat(priceText.replace('$', ''));

            // Get selected options
            const sizeSelect = document.getElementById('size');
            const grindSelect = document.getElementById('grind');
            const quantityInput = document.getElementById('quantity');

            const selectedSize = sizeSelect.value;
            const selectedGrind = grindSelect.value;
            const quantity = parseInt(quantityInput.value);

            let price = basePrice;

            // Get product image
            const productImage = document.querySelector('.product-detail-image img').src;

            // Create product object
            const product = {
                name: productName,
                size: selectedSize,
                grind: selectedGrind,
                price: price,
                quantity: quantity,
                image: productImage
            };

            // Add to cart
            addToCart(product);
        });
    }

    // Handle checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            // Redirect to checkout page (to be implemented)
            window.location.href = 'checkout.html';
        });
    }
}

// Function to add item to cart
function addToCart(product) {
    // Check if item already exists in cart
    const existingItem = cart.find(item =>
        item.name === product.name &&
        item.size === product.size &&
        item.grind === product.grind
    );

    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push(product);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Show confirmation message
    showNotification('Product added to cart!');
}

// Function to update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartDiv = document.getElementById('empty-cart');

    if (!cartItemsContainer) return; // Not on cart page

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartDiv.style.display = 'block';
        updateSummary();
        return;
    }

    cartItemsContainer.style.display = 'block';
    emptyCartDiv.style.display = 'none';

    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';

        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image clickable-item" onclick="goToProductDetail('${item.name}')">
                <div class="cart-item-details">
                    <h3 class="clickable-item" onclick="goToProductDetail('${item.name}')">${item.name}</h3>
                    <p>Size: ${item.size} | Grind: ${item.grind}</p>
                </div>
            </div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn-cart" onclick="updateQuantity(${index}, -1)">-</button>
                <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input-cart" 
                       onchange="updateQuantityInput(${index}, this.value)">
                <button class="quantity-btn-cart" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="cart-item-remove">
                <img src="public/images/X.png" alt="Remove" class="remove-btn-icon" onclick="removeFromCart(${index})">
            </div>
        `;

        cartItemsContainer.appendChild(cartItemDiv);
    });

    updateSummary();
}

// Function to go to product detail page
function goToProductDetail(productName) {
    // Enhanced mapping from product name to detail page - handles various naming conventions
    const productPages = {
        'Daily Blend coffee beans': 'daily_blend.html',
        'Espresso coffee beans': 'espresso.html',
        'Mocha coffee beans': 'mocha.html',
        'Decaffeinated coffee beans': 'decaf.html',
        'Decaf coffee beans': 'decaf.html',
        'Crema coffee beans': 'crema.html',
        'Fairtrade coffee beans': 'fairtrade.html'
    };

    // Try direct mapping first
    let pageUrl = productPages[productName];

    // If not found, try normalized search (lowercase, remove "coffee beans" suffix)
    if (!pageUrl) {
        const normalizedName = productName.toLowerCase().replace(/\s*coffee\s*beans\s*$/i, '').trim();

        // Check if normalized name matches any key
        for (const [key, value] of Object.entries(productPages)) {
            const normalizedKey = key.toLowerCase().replace(/\s*coffee\s*beans\s*$/i, '').trim();
            if (normalizedKey === normalizedName) {
                pageUrl = value;
                break;
            }
        }
    }

    if (pageUrl) {
        window.location.href = pageUrl;
    } else {
        console.warn(`No page found for product: ${productName}`);
    }
}

// Function to update quantity
function updateQuantity(index, change) {
    const newQuantity = cart[index].quantity + change;

    if (newQuantity > 0 && newQuantity <= 10) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }
}

// Function to update quantity from input
function updateQuantityInput(index, value) {
    const quantity = parseInt(value);

    if (quantity > 0 && quantity <= 10) {
        cart[index].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    showNotification('Item removed from cart');
}

// Function to update order summary
function updateSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping as requested
    const total = subtotal + shipping;

    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Function to update cart count in header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'block' : 'none';
    });
}

// Function to show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--dark-brown);
        color: var(--white);
        padding: 1rem 2rem;
        border-radius: 4px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Shop page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the shop page
    const isShopPage = window.location.pathname.endsWith('shop.html');

    if (isShopPage) {
        // Initialize shop functionality after a short delay to ensure elements are loaded
        setTimeout(initializeShopFilters, 100);
    }

    function initializeShopFilters() {
        // Elements (re-query after components are loaded)
        const sortSelect = document.querySelector('.filter-select');
        const priceFilters = document.querySelectorAll('input[name="price"]');
        const roastFilters = document.querySelectorAll('input[name="roast"]');
        const originFilters = document.querySelectorAll('input[name="origin"]');
        const productCards = document.querySelectorAll('.shop-product-card');

        // If elements aren't loaded yet, try again
        if (!sortSelect || priceFilters.length === 0) {
            setTimeout(initializeShopFilters, 100);
            return;
        }

        // Parse URL parameters for search or category filters
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const categoryParam = urlParams.get('category');

        // Apply search parameter if present - redirect to search results page
        if (searchParam || categoryParam) {
            const query = searchParam || categoryParam;
            window.location.href = `search-results.html?search=${encodeURIComponent(query)}`;
            return;
        }


        // Sort functionality
        if (sortSelect) {
            sortSelect.addEventListener('change', sortProducts);
        }

        // Filter change listeners
        if (priceFilters.length > 0) {
            priceFilters.forEach(filter => {
                filter.addEventListener('change', filterProducts);
            });
        }

        if (roastFilters.length > 0) {
            roastFilters.forEach(filter => {
                filter.addEventListener('change', filterProducts);
            });
        }

        if (originFilters.length > 0) {
            originFilters.forEach(filter => {
                filter.addEventListener('change', filterProducts);
            });
        }

        // Filter products based on filters only (no search in shop page now)
        function filterProducts() {
            // Get current filter values
            const currentPriceFilter = document.querySelector('input[name="price"]:checked');
            const currentRoastFilter = document.querySelector('input[name="roast"]:checked');
            const currentOriginFilter = document.querySelector('input[name="origin"]:checked');

            const selectedPrice = currentPriceFilter ? currentPriceFilter.closest('label').textContent.trim() : 'All Prices';
            const selectedRoast = currentRoastFilter ? currentRoastFilter.closest('label').textContent.trim() : 'All Roasts';
            const selectedOrigin = currentOriginFilter ? currentOriginFilter.closest('label').textContent.trim() : 'All Origins';

            // Get current product cards
            const currentProductCards = document.querySelectorAll('.shop-product-card');
            let visibleCount = 0;

            currentProductCards.forEach(card => {
                // Get product details
                const priceElement = card.querySelector('.shop-product-price');
                const price = priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;

                // Get tags (if they exist)
                const tagElements = card.querySelectorAll('.product-tag');
                const tags = Array.from(tagElements).map(tag => tag.textContent.toLowerCase());

                // Check if product matches price filter
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

                // Check if product matches roast filter
                let matchesRoast = true;
                if (selectedRoast !== 'All Roasts') {
                    const roastType = selectedRoast.toLowerCase();
                    matchesRoast = tags.includes(roastType);
                }

                // Check if product matches origin filter
                let matchesOrigin = true;
                if (selectedOrigin !== 'All Origins') {
                    const originType = selectedOrigin.toLowerCase();
                    matchesOrigin = tags.includes(originType);
                }

                // Show/hide product based on filter criteria
                if (matchesPrice && matchesRoast && matchesOrigin) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Update product count
            const shopProductCount = document.getElementById('shop-product-count');
            if (shopProductCount) {
                shopProductCount.textContent = `${visibleCount} product${visibleCount !== 1 ? 's' : ''} found`;
            }
        }

        // Sort products by price or name
        function sortProducts() {
            const currentSortSelect = document.querySelector('.filter-select');
            if (!currentSortSelect) return;

            const sortValue = currentSortSelect.value;
            const productsContainer = document.querySelector('.product-grid');
            const currentProductCards = document.querySelectorAll('.shop-product-card');
            const productsArray = Array.from(currentProductCards);

            // Define featured products (Daily Blend, Espresso Roast, Mocha)
            const featuredProducts = ['Daily Blend', 'Espresso Roast', 'Mocha coffee beans'];

            // Sort products based on selected option
            productsArray.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.shop-product-price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.shop-product-price').textContent.replace('$', ''));
                const nameA = a.querySelector('.shop-product-title').textContent;
                const nameB = b.querySelector('.shop-product-title').textContent;

                if (sortValue === 'Featured') {
                    // Check if products are featured
                    const aIsFeatured = featuredProducts.includes(nameA);
                    const bIsFeatured = featuredProducts.includes(nameB);

                    // If both are featured or both are not featured, maintain relative order
                    if (aIsFeatured && bIsFeatured) {
                        // Sort featured products by their order in the featuredProducts array
                        return featuredProducts.indexOf(nameA) - featuredProducts.indexOf(nameB);
                    } else if (aIsFeatured && !bIsFeatured) {
                        return -1; // a comes first
                    } else if (!aIsFeatured && bIsFeatured) {
                        return 1; // b comes first
                    } else {
                        // Neither is featured, maintain alphabetical order
                        return nameA.localeCompare(nameB);
                    }
                } else if (sortValue === 'Price: Low to High') {
                    return priceA - priceB;
                } else if (sortValue === 'Price: High to Low') {
                    return priceB - priceA;
                } else if (sortValue === 'Name: A to Z') {
                    return nameA.localeCompare(nameB);
                } else if (sortValue === 'Name: Z to A') {
                    return nameB.localeCompare(nameA);
                }

                // Default fallback
                return 0;
            });

            // Re-append products in sorted order
            productsArray.forEach(product => {
                productsContainer.appendChild(product);
            });
        }
    }
});

// Search Results Page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the search results page
    const isSearchResultsPage = window.location.pathname.endsWith('search-results.html');

    if (isSearchResultsPage) {
        // Initialize search results functionality after a short delay to ensure elements are loaded
        setTimeout(initializeSearchResults, 100);
    }

    function initializeSearchResults() {
        const searchResultsInput = document.getElementById('search-results-input');
        const searchResultsBtn = document.getElementById('search-results-btn');
        const searchQueryDisplay = document.getElementById('search-query-display');
        const searchResultsCount = document.getElementById('search-results-count');
        const productGrid = document.getElementById('search-product-grid');
        const noResults = document.getElementById('no-results');

        // Filter elements
        const sortSelect = document.getElementById('search-sort-select');
        const priceFilters = document.querySelectorAll('input[name="search-price"]');
        const roastFilters = document.querySelectorAll('input[name="search-roast"]');
        const originFilters = document.querySelectorAll('input[name="search-origin"]');

        // If elements aren't loaded yet, try again
        if (!searchResultsInput || !productGrid) {
            setTimeout(initializeSearchResults, 100);
            return;
        }

        // Get search query from URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search') || '';

        // Set the search input value and display
        if (searchQuery) {
            searchResultsInput.value = searchQuery;
            searchQueryDisplay.textContent = `Results for: "${searchQuery}"`;
            performSearch(searchQuery);
        }

        // Add filter event listeners
        if (sortSelect) {
            sortSelect.addEventListener('change', applyFilters);
        }

        if (priceFilters.length > 0) {
            priceFilters.forEach(filter => {
                filter.addEventListener('change', applyFilters);
            });
        }

        if (roastFilters.length > 0) {
            roastFilters.forEach(filter => {
                filter.addEventListener('change', applyFilters);
            });
        }

        if (originFilters.length > 0) {
            originFilters.forEach(filter => {
                filter.addEventListener('change', applyFilters);
            });
        }

        // Search button functionality
        searchResultsBtn.addEventListener('click', function () {
            const query = searchResultsInput.value.trim();
            if (query) {
                // Update URL and perform search
                window.history.pushState({}, '', `search-results.html?search=${encodeURIComponent(query)}`);
                searchQueryDisplay.textContent = `Results for: "${query}"`;
                performSearch(query);
            }
        });

        // Enter key functionality
        searchResultsInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                if (query) {
                    // Update URL and perform search
                    window.history.pushState({}, '', `search-results.html?search=${encodeURIComponent(query)}`);
                    searchQueryDisplay.textContent = `Results for: "${query}"`;
                    performSearch(query);
                }
            }
        });

        function performSearch(query) {
            const allProductCards = document.querySelectorAll('.shop-product-card');
            let visibleCount = 0;

            // Process the query to extract core search terms
            const searchTerms = extractSearchTerms(query);

            allProductCards.forEach(card => {
                const title = card.querySelector('.shop-product-title').textContent;
                // Check if any search term matches the product title
                const matchesSearch = searchTerms.some(term =>
                    title.toLowerCase().includes(term.toLowerCase())
                );

                if (matchesSearch) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Apply filters after search
            applyFilters();
        }

        function applyFilters() {
            const allProductCards = document.querySelectorAll('.shop-product-card');
            let visibleCount = 0;

            // Get search query to reapply search filter
            const currentQuery = searchResultsInput.value.trim();
            const searchTerms = currentQuery ? extractSearchTerms(currentQuery) : [];

            // Get current filter values
            const currentPriceFilter = document.querySelector('input[name="search-price"]:checked');
            const currentRoastFilter = document.querySelector('input[name="search-roast"]:checked');
            const currentOriginFilter = document.querySelector('input[name="search-origin"]:checked');

            const selectedPrice = currentPriceFilter ? currentPriceFilter.closest('label').textContent.trim() : 'All Prices';
            const selectedRoast = currentRoastFilter ? currentRoastFilter.closest('label').textContent.trim() : 'All Roasts';
            const selectedOrigin = currentOriginFilter ? currentOriginFilter.closest('label').textContent.trim() : 'All Origins';

            // Apply both search and filter criteria
            allProductCards.forEach(card => {
                const title = card.querySelector('.shop-product-title').textContent;

                // Check search criteria first
                let matchesSearch = true;
                if (searchTerms.length > 0) {
                    matchesSearch = searchTerms.some(term =>
                        title.toLowerCase().includes(term.toLowerCase())
                    );
                }

                // Get product details for filtering
                const priceElement = card.querySelector('.shop-product-price');
                const price = priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;

                // Get tags (if they exist)
                const tagElements = card.querySelectorAll('.product-tag');
                const tags = Array.from(tagElements).map(tag => tag.textContent.toLowerCase());

                // Check if product matches price filter
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

                // Check if product matches roast filter
                let matchesRoast = true;
                if (selectedRoast !== 'All Roasts') {
                    const roastType = selectedRoast.toLowerCase();
                    matchesRoast = tags.includes(roastType);
                }

                // Check if product matches origin filter
                let matchesOrigin = true;
                if (selectedOrigin !== 'All Origins') {
                    const originType = selectedOrigin.toLowerCase();
                    matchesOrigin = tags.includes(originType);
                }

                // Show/hide product based on all criteria
                if (matchesSearch && matchesPrice && matchesRoast && matchesOrigin) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Sort products after filtering
            sortSearchResults();

            // Update results count
            searchResultsCount.textContent = `${visibleCount} product${visibleCount !== 1 ? 's' : ''} found`;

            // Show/hide no results message
            if (visibleCount === 0) {
                noResults.style.display = 'block';
                productGrid.style.display = 'none';
            } else {
                noResults.style.display = 'none';
                productGrid.style.display = 'grid';
            }
        }

        function sortSearchResults() {
            const currentSortSelect = document.getElementById('search-sort-select');
            if (!currentSortSelect) return;

            const sortValue = currentSortSelect.value;
            const productsContainer = document.getElementById('search-product-grid');
            const currentProductCards = document.querySelectorAll('.shop-product-card');
            const productsArray = Array.from(currentProductCards);

            // Define featured products (Daily Blend, Espresso Roast, Mocha)
            const featuredProducts = ['Daily Blend', 'Espresso Roast', 'Mocha coffee beans'];

            // Sort products based on selected option
            productsArray.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.shop-product-price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.shop-product-price').textContent.replace('$', ''));
                const nameA = a.querySelector('.shop-product-title').textContent;
                const nameB = b.querySelector('.shop-product-title').textContent;

                if (sortValue === 'Featured') {
                    // Check if products are featured
                    const aIsFeatured = featuredProducts.includes(nameA);
                    const bIsFeatured = featuredProducts.includes(nameB);

                    // If both are featured or both are not featured, maintain relative order
                    if (aIsFeatured && bIsFeatured) {
                        // Sort featured products by their order in the featuredProducts array
                        return featuredProducts.indexOf(nameA) - featuredProducts.indexOf(nameB);
                    } else if (aIsFeatured && !bIsFeatured) {
                        return -1; // a comes first
                    } else if (!aIsFeatured && bIsFeatured) {
                        return 1; // b comes first
                    } else {
                        // Neither is featured, maintain alphabetical order
                        return nameA.localeCompare(nameB);
                    }
                } else if (sortValue === 'Price: Low to High') {
                    return priceA - priceB;
                } else if (sortValue === 'Price: High to Low') {
                    return priceB - priceA;
                } else if (sortValue === 'Name: A to Z') {
                    return nameA.localeCompare(nameB);
                } else if (sortValue === 'Name: Z to A') {
                    return nameB.localeCompare(nameA);
                }

                // Default fallback
                return 0;
            });

            // Re-append products in sorted order
            productsArray.forEach(product => {
                productsContainer.appendChild(product);
            });
        }

        // Extract core search terms by removing "coffee beans" and handling synonyms
        function extractSearchTerms(query) {
            // Remove "coffee beans" suffix (case insensitive)
            let processedQuery = query.trim().replace(/\s+coffee\s+beans$/i, '').trim();

            // If nothing left after removing suffix, use original query
            if (!processedQuery) {
                processedQuery = query.trim();
            }

            // Split into words and clean them
            const words = processedQuery.split(/\s+/).filter(word => word.length > 0);

            // Synonym mapping
            const synonyms = {
                'decaffeinated': ['decaf'],
                'decaf': ['decaffeinated'],
                'espresso': ['expresso'],
                'expresso': ['espresso'],
                'mocha': ['mocca'],
                'mocca': ['mocha']
            };

            // Collect all search terms including synonyms
            const searchTerms = [];

            words.forEach(word => {
                const lowerWord = word.toLowerCase();
                searchTerms.push(word); // Original word

                // Add synonyms if they exist
                if (synonyms[lowerWord]) {
                    searchTerms.push(...synonyms[lowerWord]);
                }
            });

            return searchTerms;
        }
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

    if (tabButtons.length > 0) {
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
    }

    // Quantity controls for product detail page only (not cart page)
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
});

// Old loading code removed - now handled by the unified component loading system above

// Hide/show header on scroll
document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTop) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    });
});