/**
 * Senirkent Blog - Arama Sayfası JavaScript
 * Bu dosya arama sayfasındaki etkileşimleri yönetir
 */

document.addEventListener('DOMContentLoaded', function() {
    // Arama kutusu üzerine odaklandığında
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Enter tuşu ile arama yapma
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchButton = document.querySelector('.search-button');
                if (searchButton) {
                    searchButton.click();
                }
            }
        });
    }
    
    // Sonuç öğeleri hover efekti
    const resultItems = document.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.3s, box-shadow 0.3s';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Filtre değişikliklerini yönetme
    const setupAutoPostback = (selectElement) => {
        if (selectElement) {
            selectElement.addEventListener('change', function() {
                // AutoPostBack özelliği ASP.NET tarafında çalışacak
                // Bu JavaScript ile manuel tetiklemeye gerek yok
            });
        }
    };
    
    setupAutoPostback(document.getElementById('ddlSortBy'));
    setupAutoPostback(document.getElementById('ddlTimeFrame'));
    
    // Tab geçişlerini yönetme
    const setupTabHighlight = () => {
        const tabs = document.querySelectorAll('.search-tab');
        tabs.forEach(tab => {
            tab.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.borderBottomColor = '#ddd';
                }
            });
            
            tab.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.borderBottomColor = 'transparent';
                }
            });
        });
    };
    
    setupTabHighlight();
    
    // URL parametrelerini alma yardımcı fonksiyonu
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    
    // Arama metnini vurgulama
    const highlightSearchTerms = () => {
        const searchQuery = getUrlParameter('q');
        if (!searchQuery) return;
        
        const searchTerms = searchQuery.toLowerCase().split(' ');
        const excerpts = document.querySelectorAll('.result-excerpt');
        
        excerpts.forEach(excerpt => {
            // ASP.NET tarafında zaten highlight yapılmış olabilir, bu kontrolü ekleyelim
            if (excerpt.innerHTML.includes('<span class="highlight">')) return;
            
            let text = excerpt.textContent;
            searchTerms.forEach(term => {
                if (term.length < 3) return; // Çok kısa terimleri atla
                
                const regex = new RegExp('\\b(' + term + ')\\b', 'gi');
                text = text.replace(regex, '<span class="highlight">$1</span>');
            });
            
            excerpt.innerHTML = text;
        });
    };
    
    // Sayfa yüklendiğinde arama terimlerini vurgula
    highlightSearchTerms();
    
    // Sayfalama butonlarını yönetme
    const setupPaginationButtons = () => {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn && prevBtn.getAttribute('disabled') === 'disabled') {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        }
        
        if (nextBtn && nextBtn.getAttribute('disabled') === 'disabled') {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        }
    };
    
    setupPaginationButtons();
});
