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
            })
    } else {
        // Initialize search directly for home page
        initializeSearch();
    }

    function initializeSearch() {
        // Search elements
        const searchTrigger = document.getElementById('search-trigger');
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('search-input');
        const searchClose = document.getElementById('search-close');
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

        // Close search overlay
        if (searchClose) {
            searchClose.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeSearch();
            });
        }

        // Close search logic based on user's preferred approach
        if (searchOverlay && searchTrigger) {
            window.onclick = function (event) {
                if (!(event.target.closest('#search-trigger') || event.target.closest('.search-container'))) {
                    if (searchOverlay.classList.contains('active')) {
                        closeSearch();
                    }
                }
            }
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
                        // Redirect to shop page with search query
                        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
                    }
                }
            });
        }

        // Search tag click functionality
        searchTags.forEach(tag => {
            tag.addEventListener('click', function (e) {
                e.stopPropagation();
                const tagText = this.textContent.trim().toLowerCase();
                searchInput.value = tagText;
                updateSearchResults(tagText);
                showSearchDropdown();
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
            document.body.classList.add('search-active');

            // Focus on search input after animation
            setTimeout(() => {
                searchInput.focus();
            }, 300);
        }

        function closeSearch() {
            searchOverlay.classList.remove('active');
            document.body.classList.remove('search-active');
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
            // Filter products based on query (only name search)
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(query)
            );

            // Clear previous results
            searchResults.innerHTML = '';

            // Add search results
            filteredProducts.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';

                // Highlight the matching text
                const highlightedName = highlightText(product.name, query);

                resultItem.innerHTML = `
                    <div class="search-result-content">
                        <div class="search-result-icon">
                            <img src="public/images/Search.png" alt="Search" width="12" height="12">
                        </div>
                        <span class="search-result-text">${highlightedName}</span>
                    </div>
                `;

                // Add click functionality
                resultItem.addEventListener('click', function (e) {
                    e.stopPropagation();
                    window.location.href = `shop.html?search=${encodeURIComponent(product.name)}`;
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

        function highlightText(text, query) {
            if (!query) return text;

            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<strong>$1</strong>');
        }
    }
});

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
        const searchInput = document.querySelector('.search-input');
        const sortSelect = document.querySelector('.filter-select');
        const priceFilters = document.querySelectorAll('input[name="price"]');
        const roastFilters = document.querySelectorAll('input[name="roast"]');
        const originFilters = document.querySelectorAll('input[name="origin"]');
        const productCards = document.querySelectorAll('.shop-product-card');

        // If elements aren't loaded yet, try again
        if (!searchInput || !sortSelect || priceFilters.length === 0) {
            setTimeout(initializeShopFilters, 100);
            return;
        }

        // Parse URL parameters for search or category filters
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const categoryParam = urlParams.get('category');

        // Apply search parameter if present
        if (searchParam) {
            // Wait for the search input to be loaded by the dynamic header
            const searchInputInterval = setInterval(() => {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.value = searchParam;
                    // Trigger the search filter
                    filterProducts();
                    clearInterval(searchInputInterval);
                }
            }, 100);
        }

        // Apply category parameter if present (simplified - treat as search term)
        if (categoryParam) {
            const searchInputInterval = setInterval(() => {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.value = categoryParam;
                    filterProducts();
                    clearInterval(searchInputInterval);
                }
            }, 100);
        }

        // Search functionality
        // Listen for input on the shop page search input
        if (searchInput) {
            searchInput.addEventListener('input', filterProducts);
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

        // Filter products based on search and filters
        function filterProducts() {
            // Get current search term from shop page search input
            const currentSearchInput = document.querySelector('.search-input');
            const searchTerm = currentSearchInput ? currentSearchInput.value.toLowerCase() : '';

            // Get current filter values
            const currentPriceFilter = document.querySelector('input[name="price"]:checked');
            const currentRoastFilter = document.querySelector('input[name="roast"]:checked');
            const currentOriginFilter = document.querySelector('input[name="origin"]:checked');

            const selectedPrice = currentPriceFilter ? currentPriceFilter.closest('label').textContent.trim() : 'All Prices';
            const selectedRoast = currentRoastFilter ? currentRoastFilter.closest('label').textContent.trim() : 'All Roasts';
            const selectedOrigin = currentOriginFilter ? currentOriginFilter.closest('label').textContent.trim() : 'All Origins';

            // Get current product cards
            const currentProductCards = document.querySelectorAll('.shop-product-card');

            currentProductCards.forEach(card => {
                // Get product details
                const title = card.querySelector('.shop-product-title').textContent.toLowerCase();
                const priceElement = card.querySelector('.shop-product-price');
                const price = priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;

                // Get tags (if they exist)
                const tagElements = card.querySelectorAll('.product-tag');
                const tags = Array.from(tagElements).map(tag => tag.textContent.toLowerCase());

                // Check if product matches search
                const matchesSearch = title.includes(searchTerm);

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
                } else {
                    card.style.display = 'none';
                }
            });
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