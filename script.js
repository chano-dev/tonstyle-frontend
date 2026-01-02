/* ============================================================
   TEU ESTILO - SCRIPT.JS
   JavaScript Principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

    /* ============================================================
       TOP BAR - MENSAGENS ROTATIVAS
       ============================================================ */
    const messagesWrapper = document.getElementById('messagesWrapper');
    if (messagesWrapper) {
        const messages = messagesWrapper.querySelectorAll('.message-item');
        let currentMessage = 0;

        function rotateMessages() {
            messages[currentMessage].classList.remove('active');
            currentMessage = (currentMessage + 1) % messages.length;
            messages[currentMessage].classList.add('active');
        }

        // Rotação a cada 5 segundos
        setInterval(rotateMessages, 5000);
    }


    /* ============================================================
       BANNER SLIDER
       ============================================================ */
    const bannerSlides = document.getElementById('bannerSlides');
    const bannerDots = document.getElementById('bannerDots');
    const bannerPrev = document.getElementById('bannerPrev');
    const bannerNext = document.getElementById('bannerNext');

    if (bannerSlides) {
        const slides = bannerSlides.querySelectorAll('.banner-slide');
        const dots = bannerDots ? bannerDots.querySelectorAll('.banner-dot') : [];
        let currentSlide = 0;
        let bannerInterval;
        let isTransitioning = false;

        function goToSlide(index) {
            if (isTransitioning) return;
            isTransitioning = true;

            currentSlide = index;
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;

            bannerSlides.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });

            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startAutoplay() {
            bannerInterval = setInterval(nextSlide, 6000);
        }

        function stopAutoplay() {
            clearInterval(bannerInterval);
        }

        // Event listeners
        if (bannerNext) bannerNext.addEventListener('click', () => {
            stopAutoplay();
            nextSlide();
            startAutoplay();
        });

        if (bannerPrev) bannerPrev.addEventListener('click', () => {
            stopAutoplay();
            prevSlide();
            startAutoplay();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                goToSlide(index);
                startAutoplay();
            });
        });

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        bannerSlides.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        bannerSlides.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });

        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        }

        // Start autoplay
        startAutoplay();
    }


    /* ============================================================
       COPYWRITING CAROUSEL (Mobile)
       ============================================================ */
    const copyTrack = document.getElementById('copyTrack');
    const copyDots = document.getElementById('copyDots');

    if (copyTrack && copyDots && window.innerWidth < 768) {
        const copyCards = copyTrack.querySelectorAll('.copy-card');
        const dots = copyDots.querySelectorAll('.copy-dot');
        let currentCopy = 0;
        let copyStartX = 0;
        let copyScrollLeft = 0;
        let isCopyDragging = false;

        function updateCopyDots() {
            const scrollPosition = copyTrack.scrollLeft;
            const cardWidth = copyCards[0].offsetWidth + 16; // gap
            const newIndex = Math.round(scrollPosition / cardWidth);
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === newIndex);
            });
        }

        copyTrack.addEventListener('scroll', updateCopyDots, { passive: true });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const cardWidth = copyCards[0].offsetWidth + 16;
                copyTrack.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                });
            });
        });

        // Drag support
        copyTrack.addEventListener('mousedown', (e) => {
            isCopyDragging = true;
            copyTrack.classList.add('dragging');
            copyStartX = e.pageX - copyTrack.offsetLeft;
            copyScrollLeft = copyTrack.scrollLeft;
        });

        copyTrack.addEventListener('mouseleave', () => {
            isCopyDragging = false;
            copyTrack.classList.remove('dragging');
        });

        copyTrack.addEventListener('mouseup', () => {
            isCopyDragging = false;
            copyTrack.classList.remove('dragging');
        });

        copyTrack.addEventListener('mousemove', (e) => {
            if (!isCopyDragging) return;
            e.preventDefault();
            const x = e.pageX - copyTrack.offsetLeft;
            const walk = (x - copyStartX) * 2;
            copyTrack.scrollLeft = copyScrollLeft - walk;
        });
    }


    /* ============================================================
       CATEGORIES CAROUSEL
       ============================================================ */
    const categoriesTrack = document.getElementById('categoriesTrack');
    const catPrev = document.getElementById('catPrev');
    const catNext = document.getElementById('catNext');
    const categoriesProgress = document.getElementById('categoriesProgress');

    if (categoriesTrack) {
        const cards = categoriesTrack.querySelectorAll('.category-card');
        const progressDots = categoriesProgress ? categoriesProgress.querySelectorAll('.progress-dot') : [];
        let catStartX = 0;
        let catScrollLeft = 0;
        let isCatDragging = false;

        function getVisibleCards() {
            const width = window.innerWidth;
            if (width >= 1024) return 5;
            if (width >= 768) return 4;
            if (width >= 640) return 3;
            return 2;
        }

        function getCardWidth() {
            const card = cards[0];
            const style = window.getComputedStyle(card);
            return card.offsetWidth + parseInt(style.marginRight) || 16;
        }

        function updateProgressDots() {
            if (!progressDots.length) return;
            const scrollPosition = categoriesTrack.scrollLeft;
            const maxScroll = categoriesTrack.scrollWidth - categoriesTrack.clientWidth;
            const progress = scrollPosition / maxScroll;
            const dotIndex = Math.round(progress * (progressDots.length - 1));

            progressDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === dotIndex);
            });
        }

        function scrollCategories(direction) {
            const cardWidth = getCardWidth();
            const visibleCards = getVisibleCards();
            const scrollAmount = cardWidth * Math.max(1, Math.floor(visibleCards / 2));
            
            categoriesTrack.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }

        if (catPrev) catPrev.addEventListener('click', () => scrollCategories(-1));
        if (catNext) catNext.addEventListener('click', () => scrollCategories(1));

        categoriesTrack.addEventListener('scroll', updateProgressDots, { passive: true });

        progressDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const maxScroll = categoriesTrack.scrollWidth - categoriesTrack.clientWidth;
                const targetScroll = (index / (progressDots.length - 1)) * maxScroll;
                categoriesTrack.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            });
        });

        // Drag support
        categoriesTrack.addEventListener('mousedown', (e) => {
            isCatDragging = true;
            categoriesTrack.classList.add('dragging');
            catStartX = e.pageX - categoriesTrack.offsetLeft;
            catScrollLeft = categoriesTrack.scrollLeft;
        });

        categoriesTrack.addEventListener('mouseleave', () => {
            isCatDragging = false;
            categoriesTrack.classList.remove('dragging');
        });

        categoriesTrack.addEventListener('mouseup', () => {
            isCatDragging = false;
            categoriesTrack.classList.remove('dragging');
        });

        categoriesTrack.addEventListener('mousemove', (e) => {
            if (!isCatDragging) return;
            e.preventDefault();
            const x = e.pageX - categoriesTrack.offsetLeft;
            const walk = (x - catStartX) * 2;
            categoriesTrack.scrollLeft = catScrollLeft - walk;
        });
    }


    /* ============================================================
       CATEGORIES 3-DOT MENU
       ============================================================ */
    const catMenuBtn = document.getElementById('catMenuBtn');
    const catDropdown = document.getElementById('catDropdown');

    if (catMenuBtn && catDropdown) {
        catMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            catDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!catDropdown.contains(e.target) && !catMenuBtn.contains(e.target)) {
                catDropdown.classList.remove('show');
            }
        });
    }


    /* ============================================================
       TRENDING PRODUCTS CAROUSEL
       ============================================================ */
    const trendingTrack = document.getElementById('trendingTrack');
    const trendingPrev = document.getElementById('trendingPrev');
    const trendingNext = document.getElementById('trendingNext');
    const trendingProgress = document.getElementById('trendingProgress');

    if (trendingTrack) {
        const products = trendingTrack.querySelectorAll('.product-card');
        const progressDots = trendingProgress ? trendingProgress.querySelectorAll('.trending-dot') : [];
        let trendStartX = 0;
        let trendScrollLeft = 0;
        let isTrendDragging = false;

        function getVisibleProducts() {
            const width = window.innerWidth;
            if (width >= 1024) return 4;
            if (width >= 768) return 4;
            if (width >= 640) return 3;
            return 2;
        }

        function getProductWidth() {
            const product = products[0];
            if (!product) return 200;
            const style = window.getComputedStyle(product);
            return product.offsetWidth + parseInt(style.marginRight) || 16;
        }

        function updateTrendingDots() {
            if (!progressDots.length) return;
            const scrollPosition = trendingTrack.scrollLeft;
            const maxScroll = trendingTrack.scrollWidth - trendingTrack.clientWidth;
            if (maxScroll <= 0) return;
            const progress = scrollPosition / maxScroll;
            const dotIndex = Math.round(progress * (progressDots.length - 1));

            progressDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === dotIndex);
            });
        }

        function scrollTrending(direction) {
            const productWidth = getProductWidth();
            const visibleProducts = getVisibleProducts();
            const scrollAmount = productWidth * Math.max(1, Math.floor(visibleProducts / 2));
            
            trendingTrack.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }

        if (trendingPrev) trendingPrev.addEventListener('click', () => scrollTrending(-1));
        if (trendingNext) trendingNext.addEventListener('click', () => scrollTrending(1));

        trendingTrack.addEventListener('scroll', updateTrendingDots, { passive: true });

        progressDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const maxScroll = trendingTrack.scrollWidth - trendingTrack.clientWidth;
                const targetScroll = (index / (progressDots.length - 1)) * maxScroll;
                trendingTrack.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            });
        });

        // Drag support
        trendingTrack.addEventListener('mousedown', (e) => {
            isTrendDragging = true;
            trendingTrack.classList.add('dragging');
            trendStartX = e.pageX - trendingTrack.offsetLeft;
            trendScrollLeft = trendingTrack.scrollLeft;
        });

        trendingTrack.addEventListener('mouseleave', () => {
            isTrendDragging = false;
            trendingTrack.classList.remove('dragging');
        });

        trendingTrack.addEventListener('mouseup', () => {
            isTrendDragging = false;
            trendingTrack.classList.remove('dragging');
        });

        trendingTrack.addEventListener('mousemove', (e) => {
            if (!isTrendDragging) return;
            e.preventDefault();
            const x = e.pageX - trendingTrack.offsetLeft;
            const walk = (x - trendStartX) * 2;
            trendingTrack.scrollLeft = trendScrollLeft - walk;
        });
    }


    /* ============================================================
       TRENDING FILTERS
       ============================================================ */
    const trendingFilters = document.getElementById('trendingFilters');
    const trendingEmpty = document.getElementById('trendingEmpty');

    if (trendingFilters && trendingTrack) {
        const filterBtns = trendingFilters.querySelectorAll('.filter-btn');
        const allProducts = trendingTrack.querySelectorAll('.product-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.dataset.category;
                let visibleCount = 0;

                // Filter products
                allProducts.forEach(product => {
                    const productCategory = product.dataset.category;
                    if (category === 'todos' || productCategory === category) {
                        product.style.display = 'block';
                        visibleCount++;
                    } else {
                        product.style.display = 'none';
                    }
                });

                // Show/hide empty state
                if (trendingEmpty) {
                    if (visibleCount === 0) {
                        trendingEmpty.classList.add('show');
                        trendingTrack.style.display = 'none';
                    } else {
                        trendingEmpty.classList.remove('show');
                        trendingTrack.style.display = 'flex';
                    }
                }

                // Reset scroll position
                trendingTrack.scrollLeft = 0;
            });
        });
    }


    /* ============================================================
       PRODUCT CARD - 3-DOT MENU
       ============================================================ */
    const productMenuBtns = document.querySelectorAll('.product-menu-btn');

    productMenuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Close all other dropdowns
            document.querySelectorAll('.product-dropdown.show').forEach(dropdown => {
                if (dropdown !== btn.nextElementSibling) {
                    dropdown.classList.remove('show');
                }
            });

            // Toggle current dropdown
            const dropdown = btn.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.product-menu-wrapper')) {
            document.querySelectorAll('.product-dropdown.show').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });


    /* ============================================================
       FAVORITE BUTTON - LOGIN POPUP
       ============================================================ */
    const loginPopup = document.getElementById('loginPopup');
    const loginPopupClose = document.getElementById('loginPopupClose');
    const favoriteBtns = document.querySelectorAll('.product-favorite-btn, .favorite-trigger');

    // Simular estado de login (false = não logado)
    const isLoggedIn = false;

    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!isLoggedIn) {
                // Show login popup
                if (loginPopup) {
                    loginPopup.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            } else {
                // Toggle favorite state
                btn.classList.toggle('active');
                const icon = btn.querySelector('svg');
                if (icon) {
                    if (btn.classList.contains('active')) {
                        icon.setAttribute('fill', 'currentColor');
                    } else {
                        icon.setAttribute('fill', 'none');
                    }
                }
            }
        });
    });

    if (loginPopupClose) {
        loginPopupClose.addEventListener('click', () => {
            loginPopup.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    if (loginPopup) {
        loginPopup.addEventListener('click', (e) => {
            if (e.target === loginPopup) {
                loginPopup.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginPopup && loginPopup.classList.contains('show')) {
            loginPopup.classList.remove('show');
            document.body.style.overflow = '';
        }
    });


    /* ============================================================
       ADD TO CART - TOAST NOTIFICATION
       ============================================================ */
    const cartToast = document.getElementById('cartToast');
    const toastClose = document.getElementById('toastClose');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-trigger, .product-cart-btn');
    let toastTimeout;

    function showToast() {
        if (cartToast) {
            cartToast.classList.add('show');
            
            // Auto-hide after 3 seconds
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                cartToast.classList.remove('show');
            }, 3000);
        }
    }

    function hideToast() {
        if (cartToast) {
            cartToast.classList.remove('show');
            clearTimeout(toastTimeout);
        }
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const productId = btn.dataset.product;
            console.log('Adding to cart:', productId);

            // Update cart badge
            const cartBadges = document.querySelectorAll('.action-icon .badge.dark');
            cartBadges.forEach(badge => {
                const currentCount = parseInt(badge.textContent) || 0;
                badge.textContent = currentCount + 1;
            });

            // Show toast
            showToast();

            // Close dropdown if open
            const dropdown = btn.closest('.product-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        });
    });

    if (toastClose) {
        toastClose.addEventListener('click', hideToast);
    }


    /* ============================================================
       SHARE BUTTON
       ============================================================ */
    const shareBtns = document.querySelectorAll('.share-trigger');

    shareBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const productCard = btn.closest('.product-card');
            const productName = productCard ? productCard.querySelector('.product-name a')?.textContent : 'Produto';
            const productUrl = productCard ? productCard.querySelector('.product-name a')?.href : window.location.href;

            // Close dropdown
            const dropdown = btn.closest('.product-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }

            // Use Web Share API if available
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: productName,
                        text: `Vê este produto no Teu Estilo: ${productName}`,
                        url: productUrl
                    });
                } catch (err) {
                    console.log('Share cancelled');
                }
            } else {
                // Fallback: copy to clipboard
                try {
                    await navigator.clipboard.writeText(productUrl);
                    alert('Link copiado para a área de transferência!');
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        });
    });


    /* ============================================================
       HEADER DROPDOWNS (Desktop Navigation)
       ============================================================ */
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const dropdown = item.querySelector('.dropdown');
        if (!dropdown) return;

        let timeoutId;

        item.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            // Close other dropdowns
            navItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherDropdown = otherItem.querySelector('.dropdown');
                    if (otherDropdown) otherDropdown.classList.remove('show');
                }
            });
            dropdown.classList.add('show');
        });

        item.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                dropdown.classList.remove('show');
            }, 150);
        });
    });


    /* ============================================================
       TAP BAR - ACTIVE STATE
       ============================================================ */
    const tapItems = document.querySelectorAll('.tap-item');
    const currentPath = window.location.pathname;

    tapItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            item.classList.add('active');
        } else if (currentPath !== '/' && href !== '/' && currentPath.startsWith(href)) {
            item.classList.add('active');
        }
    });


    /* ============================================================
       SEARCH FORM
       ============================================================ */
    const searchForms = document.querySelectorAll('.search-form');

    searchForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const input = form.querySelector('.search-input');
            if (input && input.value.trim() === '') {
                e.preventDefault();
                input.focus();
            }
        });
    });


    /* ============================================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    /* ============================================================
       LAZY LOADING IMAGES (Native fallback)
       ============================================================ */
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback: use Intersection Observer
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }


    /* ============================================================
       WINDOW RESIZE HANDLER
       ============================================================ */
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate carousels if needed
            // Add any resize-dependent logic here
        }, 250);
    });


    /* ============================================================
       CONSOLE LOG - Development
       ============================================================ */
    console.log('🎨 Teu Estilo - Website loaded successfully!');
    console.log('📧 Contact: teuestilo.ao');

});