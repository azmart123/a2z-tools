        document.addEventListener('DOMContentLoaded', () => {
            const navToggle = document.getElementById('navToggle');
            const mainNav = document.getElementById('mainNav');
            const navOverlay = document.querySelector('.nav-overlay'); // Get the overlay

            // --- Mobile Navigation ---
            if (navToggle && mainNav && navOverlay) {
                navToggle.addEventListener('click', () => {
                    const isExpanded = mainNav.classList.toggle('active');
                    navToggle.classList.toggle('active');
                    navToggle.setAttribute('aria-expanded', isExpanded);
                    navOverlay.classList.toggle('active', isExpanded); // Toggle overlay with nav
                    document.body.style.overflow = isExpanded ? 'hidden' : '';
                });

                // Close nav when overlay is clicked
                navOverlay.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            // --- Smooth Scroll & Close Mobile Nav ---
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
                        window.scrollTo({
                             top: offsetPosition,
                             behavior: "smooth"
                        });

                        // Close mobile nav if active
                        if (mainNav?.classList.contains('active')) {
                            mainNav.classList.remove('active');
                            navToggle.classList.remove('active');
                            navToggle.setAttribute('aria-expanded', 'false');
                            navOverlay.classList.remove('active');
                            document.body.style.overflow = '';
                        }
                    }
                });
            });

            // --- Live Search Functionality ---
            const searchInput = document.getElementById('toolSearchInput');
            const toolCards = document.querySelectorAll('.tool-card');
            const toolCategories = document.querySelectorAll('.tool-category');
            const noResultsContainer = document.getElementById('no-results-message-container');
            let noResultsMessageElement = null;

            function performSearch() {
                const searchTerm = searchInput.value.toLowerCase().trim();
                let hasVisibleResults = false;

                toolCards.forEach(card => {
                    const toolName = card.querySelector('h3').textContent.toLowerCase();
                    const toolDescription = card.querySelector('p').textContent.toLowerCase();
                    const keywords = card.dataset.keywords?.toLowerCase() || '';
                    
                    const isMatch = searchTerm === '' || toolName.includes(searchTerm) || toolDescription.includes(searchTerm) || keywords.includes(searchTerm);
                    
                    // More efficient show/hide
                    if (isMatch) {
                        card.style.display = '';
                        card.classList.remove('hidden'); // For any CSS relying on .hidden
                         hasVisibleResults = true;
                    } else {
                        card.style.display = 'none';
                        card.classList.add('hidden');
                    }
                });

                toolCategories.forEach(category => {
                    const visibleCardsInCategory = category.querySelectorAll('.tool-card:not([style*="display: none"])'); // Check actual visibility
                    category.style.display = (searchTerm === '' || visibleCardsInCategory.length > 0) ? '' : 'none';
                });

                // Manage "No Results" message
                if (!hasVisibleResults && searchTerm !== '') {
                    if (!noResultsMessageElement) {
                        noResultsMessageElement = document.createElement('p');
                        noResultsMessageElement.id = 'no-results-message';
                        noResultsContainer.appendChild(noResultsMessageElement);
                    }
                    noResultsMessageElement.textContent = `No tools found for "${searchInput.value}". Try different keywords.`;
                    noResultsMessageElement.style.display = 'block';
                } else if (noResultsMessageElement) {
                    noResultsMessageElement.style.display = 'none';
                }
            }

            if (searchInput && toolCards.length > 0) {
                searchInput.addEventListener('input', performSearch);
            }
            
            const searchForm = document.getElementById('toolSearchForm');
            if(searchForm){
                searchForm.addEventListener('submit', (e) => e.preventDefault()); // Prevent page reload on Enter
            }

            // --- Footer: Current Year ---
            const currentYearSpan = document.getElementById('currentYear');
            if (currentYearSpan) {
                currentYearSpan.textContent = new Date().getFullYear();
            }

            // --- Intersection Observer for Animations ---
            const animatedElements = document.querySelectorAll('.anim-slide-in-up');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target); // Unobserve after animation for performance
                    }
                });
            }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

            animatedElements.forEach(el => observer.observe(el));

            // --- Dark Mode Toggle ---
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                // Load saved theme preference
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
                
                // Apply initial theme
                applyTheme(initialTheme);
                
                themeToggle.addEventListener('click', () => {
                    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    applyTheme(newTheme);
                    localStorage.setItem('theme', newTheme);
                });
            }

            function applyTheme(theme) {
                const isDark = theme === 'dark';
                document.documentElement.classList.toggle('dark', isDark);
                const themeIcon = themeToggle.querySelector('i');
                if (themeIcon) {
                    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
                }
            }

            // --- Recent Tools Tracking ---
            const recentToolsGrid = document.getElementById('recent-tools-grid');
            if (recentToolsGrid) {
                // Track tool clicks
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('tool-button') && e.target.href) {
                        const toolCard = e.target.closest('.tool-card');
                        if (toolCard) {
                            const toolData = {
                                title: toolCard.querySelector('h3').textContent,
                                description: toolCard.querySelector('p').textContent,
                                icon: toolCard.querySelector('.tool-icon i').className,
                                link: e.target.href,
                                timestamp: Date.now()
                            };
                            addToRecentTools(toolData);
                        }
                    }
                });

                // Load and display recent tools
                displayRecentTools();
            }

            function addToRecentTools(toolData) {
                let recentTools = JSON.parse(localStorage.getItem('recentTools') || '[]');
                
                // Remove if already exists
                recentTools = recentTools.filter(tool => tool.link !== toolData.link);
                
                // Add to beginning
                recentTools.unshift(toolData);
                
                // Keep only last 4
                recentTools = recentTools.slice(0, 4);
                
                localStorage.setItem('recentTools', JSON.stringify(recentTools));
                displayRecentTools();
            }

            function displayRecentTools() {
                const recentTools = JSON.parse(localStorage.getItem('recentTools') || '[]');
                const recentToolsGrid = document.getElementById('recent-tools-grid');
                
                if (!recentToolsGrid) return;
                
                if (recentTools.length === 0) {
                    recentToolsGrid.innerHTML = '<p style="text-align: center; color: var(--text-light); grid-column: 1 / -1;">No recent tools yet. Start using tools to see them here!</p>';
                    return;
                }
                
                recentToolsGrid.innerHTML = recentTools.map(tool => `
                    <div class="recent-tool-card anim-slide-in-up">
                        <div class="tool-icon"><i class="${tool.icon}"></i></div>
                        <h3>${tool.title}</h3>
                        <p>${tool.description}</p>
                        <a href="${tool.link}" class="tool-button">Use Again</a>
                    </div>
                `).join('');
            }
        });