// Shop page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const searchInput = document.querySelector('.search-input');
    const sortSelect = document.querySelector('.filter-select');
    const priceFilters = document.querySelectorAll('input[name="price"]');
    const roastFilters = document.querySelectorAll('input[name="roast"]');
    const originFilters = document.querySelectorAll('input[name="origin"]');
    const productCards = document.querySelectorAll('.shop-product-card');

    // If not on shop page, don't execute rest of code that requires shop page elements
    if (document.body.classList.contains('shop-page')) {

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

        // Apply category parameter if present
        if (categoryParam) {
            // Handle category filtering based on the category parameter
            handleCategoryFilter(categoryParam);
        }

        // Function to handle category filtering
        function handleCategoryFilter(category) {
            const lowerCategory = category.toLowerCase();

            // Find and check the corresponding filter based on category type
            const filterElements = document.querySelectorAll('input[name="roast"], input[name="origin"]');
            filterElements.forEach(filter => {
                const filterLabel = filter.closest('label').textContent.trim().toLowerCase();
                if (filterLabel.includes(lowerCategory.replace('n', ''))) { // Handle "colombian" vs "colombia"
                    filter.checked = true;
                }
            });

            // Apply filters
            filterProducts();
        }

        // Search functionality
        // Listen for input on the dynamically loaded search input
        document.addEventListener('input', function (e) {
            if (e.target && e.target.classList.contains('search-bar-input')) {
                filterProducts();
            }
        });


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
            const currentSearchInput = document.querySelector('.search-input');
            const searchTerm = currentSearchInput ? currentSearchInput.value.toLowerCase() : '';
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

// Load and initialize search dropdown
document.addEventListener('DOMContentLoaded', function () {
    fetch('search-dropdown.html')
        .then(response => response.text())
        .then(html => {
            const searchDropdownPlaceholder = document.getElementById('search-dropdown-placeholder');
            if (searchDropdownPlaceholder) {
                searchDropdownPlaceholder.innerHTML = html;

                // Elements (get them after HTML is loaded)
                const searchTrigger = document.getElementById('search-trigger');
                const searchDropdown = document.getElementById('search-dropdown');
                const searchInput = document.getElementById('search-input');
                const initialContent = document.getElementById('initial-content');
                const suggestionsContent = document.getElementById('suggestions-content');

                // Sample search data - this would normally come from a database or API
                const searchData = [
                    { title: 'espresso beans', count: 12 },
                    { title: 'espresso machine', count: 5 },
                    { title: 'espresso grinder', count: 3 },
                    { title: 'espresso cups', count: 8 },
                    { title: 'medium roast', count: 15 },
                    { title: 'light roast', count: 9 },
                    { title: 'dark roast', count: 11 },
                    { title: 'brazilian santos', count: 7 },
                    { title: 'colombian coffee', count: 6 },
                    { title: 'decaffeinated coffee', count: 4 },
                    { title: 'organic coffee', count: 10 }
                ];

                // Recent search items (get them after HTML is loaded)
                const recentItems = searchDropdown.querySelectorAll('.recent-item');

                // Category tags (get them after HTML is loaded)
                const categoryTags = searchDropdown.querySelectorAll('.category-tag');

                // Toggle search dropdown
                searchTrigger.addEventListener('click', function (e) {
                    e.preventDefault();
                    searchDropdown.classList.toggle('active');
                    document.body.classList.toggle('no-scroll', searchDropdown.classList.contains('active'));

                    if (searchDropdown.classList.contains('active')) {
                        // Focus on search input when dropdown is opened
                        searchInput.focus();
                    }
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', function (e) {
                    if (!searchDropdown.contains(e.target) && e.target !== searchTrigger && !searchTrigger.contains(e.target)) {
                        searchDropdown.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                    }
                });

                // Handle search input
                searchInput.addEventListener('input', function () {
                    const searchTerm = this.value.toLowerCase().trim();

                    if (searchTerm === '') {
                        // Show initial content when search is empty
                        initialContent.style.display = 'block';
                        suggestionsContent.style.display = 'none';
                    } else {
                        // Filter search results based on search term
                        const filteredResults = searchData.filter(item =>
                            item.title.toLowerCase().startsWith(searchTerm)
                        );

                        // Show filtered results
                        initialContent.style.display = 'none';
                        suggestionsContent.style.display = 'block';

                        // Clear previous suggestions
                        while (suggestionsContent.children.length > 1) {
                            suggestionsContent.removeChild(suggestionsContent.lastChild);
                        }

                        // Add new suggestions
                        filteredResults.forEach(item => {
                            const suggestionDiv = document.createElement('div');
                            suggestionDiv.className = 'search-suggestion';
                            suggestionDiv.innerHTML = `
                                <div class="suggestion-icon">
                                    <img src="public/images/Search.png" alt="Search Icon">
                                </div>
                                <div class="suggestion-content">
                                    <div class="suggestion-title">${item.title}</div>
                                </div>
                                <div class="suggestion-count">${item.count} products</div>
                            `;

                            // Add click event to suggestion
                            suggestionDiv.addEventListener('click', function () {
                                window.location.href = `shop.html?search=${encodeURIComponent(item.title)}`;
                            });

                            suggestionsContent.appendChild(suggestionDiv);
                        });

                        // If no results found
                        if (filteredResults.length === 0) {
                            const noResults = document.createElement('div');
                            noResults.textContent = 'No suggestions found';
                            noResults.style.color = 'var(--cream)';
                            noResults.style.textAlign = 'center';
                            noResults.style.padding = '20px 0';
                            suggestionsContent.appendChild(noResults);
                        }
                    }
                });

                // Handle recent item clicks
                recentItems.forEach(item => {
                    item.addEventListener('click', function () {
                        const searchTerm = this.textContent.trim();
                        window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
                    });
                });

                // Handle category tag clicks
                categoryTags.forEach(tag => {
                    tag.addEventListener('click', function () {
                        const category = this.textContent.trim();
                        window.location.href = `shop.html?category=${encodeURIComponent(category)}`;
                    });
                });

                // Handle search suggestions clicks
                // Need to use event delegation as suggestions are added dynamically
                suggestionsContent.addEventListener('click', function (e) {
                    const suggestionDiv = e.target.closest('.search-suggestion');
                    if (suggestionDiv) {
                        const title = suggestionDiv.querySelector('.suggestion-title').textContent.trim();
                        window.location.href = `shop.html?search=${encodeURIComponent(title)}`;
                    }
                });

                // Handle pressing Enter in search input
                searchInput.addEventListener('keyup', function (e) {
                    if (e.key === 'Enter') {
                        const searchTerm = this.value.trim();
                        if (searchTerm !== '') {
                            window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
                        }
                    }
                });
            }
        });
});

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

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Prevent negative values
    });
});