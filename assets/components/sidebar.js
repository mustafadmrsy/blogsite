/**
 * Sidebar JavaScript - Senirkent Blog
 * Her fonksiyon öneki: snk_sidebar_ (kod çakýþmalarýný önlemek için)
 */

// DOM elemanlarýný tanýmla
const snk_sidebar = document.querySelector('.snk-sidebar');
const snk_mainContent = document.querySelector('.snk-main-content');
const snk_sidebarToggle = document.getElementById('sidebarToggle');
const snk_mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
const snk_profileTrigger = document.getElementById('profileTrigger');
const snk_profileMenu = document.getElementById('profileMenu');

// Medya sorgusu - mobil mi masaüstü mü
const snk_sidebar_isMobile = () => window.innerWidth <= 768;

/**
 * Sayfa yüklendiðinde çalýþacak fonksiyonlar
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sidebar.js yüklendi");

    // DOM elemanlarýný kontrol et ve ekrana bilgi yazdýr
    console.log("Sidebar elemanlarý:", {
        sidebar: snk_sidebar,
        mainContent: snk_mainContent,
        sidebarToggle: snk_sidebarToggle,
        mobileSidebarToggle: snk_mobileSidebarToggle,
        profileTrigger: snk_profileTrigger,
        profileMenu: snk_profileMenu
    });

    // Baþlangýç durumunu ayarla
    snk_sidebar_setupInitialState();

    // Olay dinleyicilerini ekle
    snk_sidebar_setupEventListeners();

    // Pencere yeniden boyutlandýrýldýðýnda kontrolleri yap
    window.addEventListener('resize', snk_sidebar_handleResize);
});

/**
 * Sidebar baþlangýç durumunu ayarlar
 */
function snk_sidebar_setupInitialState() {
    if (!snk_sidebar) {
        console.error("Sidebar bulunamadý");
        return;
    }

    // Yerel depolamadan sidebar durumunu al (collapsed mý deðil mi)
    const isCollapsed = localStorage.getItem('snk_sidebar_collapsed') === 'true';

    if (snk_sidebar_isMobile()) {
        // Mobil görünümde sidebar varsayýlan olarak kapalý
        snk_sidebar.classList.remove('collapsed');
        snk_sidebar.classList.remove('active');

        // Mobil menü butonunu göster
        if (snk_mobileSidebarToggle) {
            snk_mobileSidebarToggle.style.display = 'flex';
        }

        // Mobil görünüme geçince sidebar toggle butonunun ikonunu güncelle
        if (snk_sidebarToggle) {
            const icon = snk_sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = ''; // Önceki tüm sýnýflarý temizle
                icon.classList.add('fas', 'fa-times'); // Çarpý ikonu ekle
            }
        }

        // Ana içeriðin margin'ini kaldýr
        if (snk_mainContent) {
            snk_mainContent.style.marginLeft = '0';
        }
    } else {
        // Masaüstü görünümde yerel depolamadaki durumu uygula
        if (isCollapsed) {
            snk_sidebar.classList.add('collapsed');
            if (snk_mainContent) {
                snk_mainContent.style.marginLeft = 'var(--snk-sidebar-collapsed-width)';
            }

            // Toggle butonundaki ikonu güncelle
            if (snk_sidebarToggle) {
                const icon = snk_sidebarToggle.querySelector('i');
                if (icon) {
                    icon.className = ''; // Önceki tüm sýnýflarý temizle
                    icon.classList.add('fas', 'fa-chevron-right');
                }
            }
        } else {
            snk_sidebar.classList.remove('collapsed');
            if (snk_mainContent) {
                snk_mainContent.style.marginLeft = 'var(--snk-sidebar-width)';
            }

            // Toggle butonundaki ikonu güncelle
            if (snk_sidebarToggle) {
                const icon = snk_sidebarToggle.querySelector('i');
                if (icon) {
                    icon.className = ''; // Önceki tüm sýnýflarý temizle
                    icon.classList.add('fas', 'fa-chevron-left');
                }
            }
        }

        // Mobil menü butonunu gizle
        if (snk_mobileSidebarToggle) {
            snk_mobileSidebarToggle.style.display = 'none';
        }
    }
}

/**
 * Olay dinleyicilerini ekler
 */
function snk_sidebar_setupEventListeners() {
    // Sidebar toggle butonu için olay dinleyicisi
    if (snk_sidebarToggle) {
        snk_sidebarToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Týklamanýn dýþarý yayýlmasýný engelle

            // Mobil görünümde farklý davranýþ
            if (snk_sidebar_isMobile()) {
                snk_sidebar_toggleMobileSidebar();
            } else {
                snk_sidebar_toggleSidebar();
            }
        });
        console.log("Sidebar toggle butonu olay dinleyicisi eklendi");
    } else {
        console.warn("Sidebar toggle butonu bulunamadý (ID: sidebarToggle)");
    }

    // Mobil hamburger menüsü için olay dinleyicisi
    if (snk_mobileSidebarToggle) {
        snk_mobileSidebarToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Týklamanýn dýþarý yayýlmasýný engelle
            snk_sidebar_toggleMobileSidebar();
        });
        console.log("Mobil menu butonu olay dinleyicisi eklendi");
    } else {
        console.warn("Mobil sidebar toggle butonu bulunamadý (ID: mobileSidebarToggle)");
    }

    // Profil menüsü için olay dinleyicisi
    if (snk_profileTrigger && snk_profileMenu) {
        snk_profileTrigger.addEventListener('click', (event) => {
            event.stopPropagation(); // Týklamanýn dýþarý yayýlmasýný engelle
            snk_profileMenu.classList.toggle('active');

            // Profil menüsü açýldýðýnda dýþarý týklandýðýnda kapanmasý için
            document.addEventListener('click', snk_sidebar_handleDocumentClick);
        });
    } else {
        console.warn("Profil trigger veya profil menüsü bulunamadý");
    }

    // Mobil görünümde sayfa dýþýna týklanýnca sidebar'ý kapat
    document.addEventListener('click', (event) => {
        if (snk_sidebar_isMobile() &&
            snk_sidebar &&
            snk_sidebar.classList.contains('active') &&
            !snk_sidebar.contains(event.target) &&
            (!snk_mobileSidebarToggle || !snk_mobileSidebarToggle.contains(event.target))) {
            snk_sidebar.classList.remove('active');
        }
    });
}

/**
 * Sayfa geniþliði deðiþtiðinde çalýþacak fonksiyon
 */
function snk_sidebar_handleResize() {
    // Medya sorgusuna göre sidebar'ý ayarla
    snk_sidebar_setupInitialState();
}

/**
 * Belge týklamalarýný iþler (profil menüsü için)
 */
function snk_sidebar_handleDocumentClick(event) {
    if (snk_profileTrigger &&
        snk_profileMenu &&
        !snk_profileTrigger.contains(event.target) &&
        !snk_profileMenu.contains(event.target)) {

        snk_profileMenu.classList.remove('active');

        // Event listener'ý kaldýr (performans için)
        document.removeEventListener('click', snk_sidebar_handleDocumentClick);
    }
}

/**
 * Sidebar'ý geniþlet/daralt (masaüstü görünümü için)
 */
function snk_sidebar_toggleSidebar() {
    if (!snk_sidebar) {
        console.error("Sidebar bulunamadý");
        return;
    }

    // Mobil görünümde sidebar davranýþýný farklý ele al
    if (snk_sidebar_isMobile()) {
        snk_sidebar_toggleMobileSidebar();
        return;
    }

    // Masaüstü görünümünde sidebar davranýþý
    const isCollapsed = snk_sidebar.classList.contains('collapsed');

    if (isCollapsed) {
        // Sidebar daraltýlmýþsa geniþlet
        snk_sidebar.classList.remove('collapsed');
        if (snk_mainContent) {
            snk_mainContent.style.marginLeft = 'var(--snk-sidebar-width)';
        }

        // Ýkonu güncelle
        if (snk_sidebarToggle) {
            const icon = snk_sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = ''; // Önceki tüm sýnýflarý temizle
                icon.classList.add('fas', 'fa-chevron-left');
            }
        }
    } else {
        // Sidebar geniþse daralt
        snk_sidebar.classList.add('collapsed');
        if (snk_mainContent) {
            snk_mainContent.style.marginLeft = 'var(--snk-sidebar-collapsed-width)';
        }

        // Ýkonu güncelle
        if (snk_sidebarToggle) {
            const icon = snk_sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = ''; // Önceki tüm sýnýflarý temizle
                icon.classList.add('fas', 'fa-chevron-right');
            }
        }
    }

    // Yeni durumu yerel depolamaya kaydet
    localStorage.setItem('snk_sidebar_collapsed', !isCollapsed);

    console.log("Sidebar durumu deðiþtirildi:", !isCollapsed ? "daraltýldý" : "geniþletildi");
}

/**
 * Mobil görünümde sidebar'ý aç/kapat
 */
function snk_sidebar_toggleMobileSidebar() {
    if (!snk_sidebar) {
        console.error("Sidebar bulunamadý");
        return;
    }

    // Mobil görünümde active class'ý ile aç/kapat
    const isActive = snk_sidebar.classList.contains('active');

    if (isActive) {
        // Açýksa kapat
        snk_sidebar.classList.remove('active');

        // Ýkonu güncelle (toggle butonunda)
        if (snk_sidebarToggle) {
            const icon = snk_sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = '';
                icon.classList.add('fas', 'fa-times');
            }
        }
    } else {
        // Kapalýysa aç
        snk_sidebar.classList.add('active');

        // Ýkonu güncelle (toggle butonunda)
        if (snk_sidebarToggle) {
            const icon = snk_sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = '';
                icon.classList.add('fas', 'fa-times');
            }
        }
    }

    console.log("Mobil sidebar durumu deðiþtirildi:", !isActive ? "açýldý" : "kapandý");
}

// Global eriþim için
window.snk_sidebar_toggleSidebar = snk_sidebar_toggleSidebar;
window.snk_sidebar_toggleMobileSidebar = snk_sidebar_toggleMobileSidebar;
