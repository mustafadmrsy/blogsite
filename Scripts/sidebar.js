/**
 * Sidebar JavaScript Dosyası
 * 
 * Tüm sayfalarda ortak olarak kullanılan sidebar işlevselliği
 * Modülerleştirilmiş kod yapısı ve daha iyi olay dinleyiciler içerir
 */

// Sidebar bileşenleri
const Sidebar = {
    // DOM elemanları
    elements: {
        sidebarContainer: document.querySelector('.sidebar'),
        toggleButton: document.querySelector('.sidebar-toggle'),
        profileTrigger: document.querySelector('.profile-trigger'),
        profileMenu: document.querySelector('.profile-menu'),
        searchInput: document.querySelector('.search-input'),
        searchButton: document.querySelector('.search-button'),
        navigationLinks: document.querySelectorAll('.nav-link'),
        overlay: document.querySelector('.overlay')
    },
    
    // Durum değişkenleri
    state: {
        isSidebarOpen: false,
        isProfileMenuOpen: false,
        isMobile: window.innerWidth <= 768
    },
    
    // İlklendirme fonksiyonu
    init: function() {
        // Mobil modu güncelle
        this.updateMobileState();
        
        // Olay dinleyicileri ekle
        this.setupEventListeners();
        
        // Aktif sayfayı belirle
        this.setActivePage();
    },
    
    // Olay dinleyicileri
    setupEventListeners: function() {
        // DOM elemanlarına kısa erişim
        const el = this.elements;
        
        // Toggle butonu tıklama olayı
        if (el.toggleButton) {
            el.toggleButton.addEventListener('click', this.toggleSidebar.bind(this));
        }
        
        // Profil menü tıklama olayı
        if (el.profileTrigger) {
            el.profileTrigger.addEventListener('click', this.toggleProfileMenu.bind(this));
        }
        
        // Arama butonu tıklama olayı
        if (el.searchButton) {
            el.searchButton.addEventListener('click', this.handleSearch.bind(this));
        }
        
        // Arama inputu enter tuşu olayı
        if (el.searchInput) {
            el.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }
        
        // Pencere yeniden boyutlandırma olayı
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Overlay tıklama olayı
        if (el.overlay) {
            el.overlay.addEventListener('click', this.closeSidebar.bind(this));
        }
        
        // ESC tuşu ile kapatma olayı
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.state.isSidebarOpen) {
                    this.closeSidebar();
                }
                if (this.state.isProfileMenuOpen) {
                    this.closeProfileMenu();
                }
            }
        });
    },
    
    // Sidebar aç/kapa
    toggleSidebar: function() {
        const el = this.elements;
        
        if (this.state.isSidebarOpen) {
            this.closeSidebar();
        } else {
            // Sidebar'ı aç
            if (el.sidebarContainer) {
                el.sidebarContainer.classList.add('open');
            }
            if (el.overlay) {
                el.overlay.classList.add('active');
            }
            this.state.isSidebarOpen = true;
            
            // Profil menüsünü kapat
            this.closeProfileMenu();
            
            // Body scroll engelle (mobilde)
            if (this.state.isMobile) {
                document.body.style.overflow = 'hidden';
            }
        }
    },
    
    // Sidebar'ı kapat
    closeSidebar: function() {
        const el = this.elements;
        
        if (el.sidebarContainer) {
            el.sidebarContainer.classList.remove('open');
        }
        if (el.overlay) {
            el.overlay.classList.remove('active');
        }
        this.state.isSidebarOpen = false;
        
        // Body scroll'u serbest bırak
        document.body.style.overflow = '';
    },
    
    // Profil menüsü aç/kapa
    toggleProfileMenu: function(e) {
        if (e) e.preventDefault();
        
        const el = this.elements;
        
        if (this.state.isProfileMenuOpen) {
            this.closeProfileMenu();
        } else {
            // Profil menüsünü aç
            if (el.profileMenu) {
                el.profileMenu.classList.add('open');
            }
            this.state.isProfileMenuOpen = true;
        }
    },
    
    // Profil menüsünü kapat
    closeProfileMenu: function() {
        const el = this.elements;
        
        if (el.profileMenu) {
            el.profileMenu.classList.remove('open');
        }
        this.state.isProfileMenuOpen = false;
    },
    
    // Arama işlevi
    handleSearch: function() {
        const el = this.elements;
        
        if (el.searchInput) {
            const searchTerm = el.searchInput.value.trim();
            
            if (searchTerm) {
                // Arama sayfasına yönlendir
                window.location.href = `Arama.aspx?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    },
    
    // Boyut değişimini yönet
    handleResize: function() {
        // Mobil durumunu güncelle
        const wasMobile = this.state.isMobile;
        this.updateMobileState();
        
        // Mobil modundan çıkıldığında sidebar'ı kapat
        if (wasMobile && !this.state.isMobile && this.state.isSidebarOpen) {
            this.closeSidebar();
        }
    },
    
    // Mobil modu durumunu güncelle
    updateMobileState: function() {
        this.state.isMobile = window.innerWidth <= 768;
        
        // Mobil class'ını body'ye ekle/çıkar
        if (this.state.isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    },
    
    // Aktif sayfayı belirle
    setActivePage: function() {
        const el = this.elements;
        
        if (el.navigationLinks && el.navigationLinks.length) {
            // Aktif sayfa URL'ine göre navigasyon linkini bul ve active class'ı ekle
            const currentUrl = window.location.pathname;
            const pageName = currentUrl.substring(currentUrl.lastIndexOf('/') + 1).toLowerCase();
            
            el.navigationLinks.forEach(link => {
                // Link href'ini al
                const href = link.getAttribute('href').toLowerCase();
                const linkPageName = href.substring(href.lastIndexOf('/') + 1).toLowerCase();
                
                // Sayfa adları eşleşiyorsa active class'ı ekle
                if (pageName === linkPageName || 
                   (pageName === '' && linkPageName === 'default.aspx') ||
                   (pageName === 'default.aspx' && linkPageName === 'default.aspx')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }
};

// Sayfa yüklendiğinde Sidebar'ı başlat
document.addEventListener('DOMContentLoaded', function() {
    Sidebar.init();
});
