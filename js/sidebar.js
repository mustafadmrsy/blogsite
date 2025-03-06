/**
 * Senirkent MYO Blog - Sidebar İşlevselliği
 * Açıklama: Sidebar'ın açılıp-kapanması, daraltılması ve mobil uyumluluğu için script
 * Yazar: Mustafa Demirsoy
 * Sürüm: 2.0.0
 * Güncelleme Tarihi: 6 Mart 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar ve ilgili elementleri tanımla
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
    const sidebarFixedToggleBtn = document.querySelector('.sidebar-fixed-toggle');
    const mainContent = document.querySelector('main');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobil menü elementleri
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileLogoLink = document.querySelector('.mobile-logo-link');
    
    // Popup ile ilgili elementler
    const readMoreButtons = document.querySelectorAll('.btn-daha, .read-more');
    const categoryItems = document.querySelectorAll('.category-item');
    
    // Geçerli sayfayı belirle ve aktif linkini işaretle
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
        
        // Tooltip için data attribute ekle (daraltılmış sidebar için)
        if (link.querySelector('.nav-text')) {
            const text = link.querySelector('.nav-text').textContent.trim();
            link.setAttribute('data-title', text);
        }
    });
    
    // Mobil nav linklerinde aktif olanı işaretle
    mobileNavLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Sidebar overlay'i oluştur (mobil görünüm için)
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        body.appendChild(overlay);
    }
    
    // Mobil cihazlarda görünüme uygun sınıfları ekle
    function checkMobileView() {
        if (window.innerWidth <= 768) {
            body.classList.add('mobile-view');
            if (!sidebar.classList.contains('active')) {
                body.classList.remove('sidebar-active');
            }
        } else {
            body.classList.remove('mobile-view');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    }
    
    // Sayfa yüklendiğinde mobil görünümü kontrol et
    checkMobileView();
    
    // Sidebar Toggle Fonksiyonu - Masaüstü/Mobil durumuna göre davran
    function toggleSidebar() {
        // Masaüstü görünümünde (769px ve üzeri) sidebar'ı daralt/genişlet
        if (window.innerWidth >= 769) {
            sidebar.classList.toggle('collapsed');
            body.classList.toggle('sidebar-collapsed');
            
            // Sidebar durumunu kaydet
            localStorage.setItem('sidebarState', sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
            
            // Sidebar daraltıldığında ikon yönünü değiştir
            if (sidebar.classList.contains('collapsed')) {
                if (sidebarToggleBtn.querySelector('i')) {
                    sidebarToggleBtn.querySelector('i').classList.remove('fa-chevron-left');
                    sidebarToggleBtn.querySelector('i').classList.add('fa-chevron-right');
                }
            } else {
                if (sidebarToggleBtn.querySelector('i')) {
                    sidebarToggleBtn.querySelector('i').classList.remove('fa-chevron-right');
                    sidebarToggleBtn.querySelector('i').classList.add('fa-chevron-left');
                }
            }
        } 
        // Mobil görünümünde (768px ve altı) sidebar'ı aç/kapat
        else {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            body.classList.toggle('sidebar-active');
            
            // Sidebar açılınca scroll'u engelle
            if (sidebar.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        }
    }
    
    // Hamburger menü işlevselliği
    function toggleMobileMenu(e) {
        // Bu fonksiyon hamburger-menu.js tarafından ele alındığı için devre dışı bırakıldı
        console.log("Sidebar.js: toggleMobileMenu fonksiyonu hamburger-menu.js tarafından yönetiliyor");
        return; // Hiçbir işlem yapma
    }
    
    // Mobil logoya tıklandığında ana sayfaya yönlendir
    if (mobileLogoLink) {
        mobileLogoLink.addEventListener('click', function(e) {
            e.preventDefault(); // Default davranışı engelle
            e.stopImmediatePropagation(); // Diğer event dinleyicilerini engelle
            window.location.href = this.getAttribute('href'); // Ana sayfaya yönlendir
        });
    }
    
    // Devamını oku butonlarına ve kategori öğelerine özel işleyici ekle
    document.addEventListener('click', function(e) {
        // Mobil görünümde değilsek işlem yapma
        if (window.innerWidth > 768) return;
        
        // Tıklanan eleman "Devamını Oku" butonuysa
        if (e.target.classList.contains('btn-daha') || 
            e.target.closest('.btn-daha') ||
            e.target.classList.contains('read-more') || 
            e.target.closest('.read-more')) {
            
            e.stopPropagation(); // Üst elemanlara olay yayılımını engelle
            
            // Hamburger butonunun tetiklenmesini engelle
            const ev = e || window.event;
            if (ev.stopImmediatePropagation) {
                ev.stopImmediatePropagation();
            }
        }
        
        // Tıklanan eleman kategori öğesiyse
        if (e.target.classList.contains('category-item') || 
            e.target.closest('.category-item')) {
            
            e.stopPropagation(); // Üst elemanlara olay yayılımını engelle
            
            // Hamburger butonunun tetiklenmesini engelle
            const ev = e || window.event;
            if (ev.stopImmediatePropagation) {
                ev.stopImmediatePropagation();
            }
        }
    }, true); // Yakalama aşamasında olayları ele al
    
    // Sidebar toggle butonuna tıklama olayını ekle
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', function(e) {
            toggleSidebar();
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
    }
    
    // Sabit toggle butonuna tıklama olayını ekle
    if (sidebarFixedToggleBtn) {
        sidebarFixedToggleBtn.addEventListener('click', function(e) {
            toggleSidebar();
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
    }
    
    // Hamburger butonuna tıklama olayını ekle
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function(e) {
            toggleMobileMenu(e);
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
    }
    
    // Mobil menü kapatma butonuna tıklama olayını ekle
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', function(e) {
            toggleMobileMenu(e);
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
    }
    
    // Mobil overlay'e tıklama olayını ekle
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function(e) {
            toggleMobileMenu(e);
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
    }
    
    // Overlay'e tıklama olayını ekle
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            toggleSidebar();
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
    }
    
    // Pencere boyutu değiştiğinde mobil görünümü kontrol et
    window.addEventListener('resize', function() {
        checkMobileView();
        
        // Masaüstü görünümüne geçildiğinde mobil menüyü kapat
        if (window.innerWidth > 768) {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Sidebar durumunu kontrol et - sayfa yüklendiğinde
    function checkSidebarState() {
        const savedState = localStorage.getItem('sidebarState');
        
        // Eğer önceden kaydedilmiş durum varsa
        if (savedState === 'collapsed') {
            sidebar.classList.add('collapsed');
            body.classList.add('sidebar-collapsed');
            
            if (sidebarToggleBtn && sidebarToggleBtn.querySelector('i')) {
                sidebarToggleBtn.querySelector('i').classList.remove('fa-chevron-left');
                sidebarToggleBtn.querySelector('i').classList.add('fa-chevron-right');
            }
        }
    }
    
    // Sayfa yüklendiğinde sidebar durumunu kontrol et
    checkSidebarState();
});
