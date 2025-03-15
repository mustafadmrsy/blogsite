/**
 * Sidebar JavaScript - Senirkent Blog
 * Her fonksiyon �neki: snk_sidebar_ (kod �ak��malar�n� �nlemek i�in)
 */

// DOM elemanlar�n� tan�mla
const snk_sidebar = document.querySelector('.snk-sidebar');
const snk_mainContent = document.querySelector('.snk-main-content');
const snk_sidebarToggle = document.getElementById('sidebarToggle');
const snk_mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
const snk_profileTrigger = document.getElementById('profileTrigger');
const snk_profileMenu = document.getElementById('profileMenu');

// Medya sorgusu - mobil mi masa�st� m�
const snk_sidebar_isMobile = () => window.innerWidth <= 768;

/**
 * Sayfa y�klendi�inde �al��acak fonksiyonlar
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sidebar.js y�klendi");

    // DOM elemanlar�n� kontrol et ve ekrana bilgi yazd�r
    console.log("Sidebar elemanlar�:", {
        sidebar: snk_sidebar,
        mainContent: snk_mainContent,
        sidebarToggle: snk_sidebarToggle,
        mobileSidebarToggle: snk_mobileSidebarToggle,
        profileTrigger: snk_profileTrigger,
        profileMenu: snk_profileMenu
    });

    // Ba�lang�� durumunu ayarla
    snk_sidebar_setupInitialState();

    // Olay dinleyicilerini ekle
    snk_sidebar_setupEventListeners();

    // Pencere yeniden boyutland�r�ld���nda kontrolleri yap
    window.addEventListener('resize', snk_sidebar_handleResize);
});

/**
 * Sidebar ba�lang�� durumunu ayarlar
 */
function snk_sidebar_setupInitialState() {
    if (!snk_sidebar) {
        console.error("Sidebar bulunamad�");
        return;
    }

    // Yerel depolamadan sidebar durumunu al (collapsed m� de�il mi)
    const isCollapsed = localStorage.getItem('snk_sidebar_collapsed') === 'true';

    if (snk_sidebar_isMobile()) {
        // Mobil g�r�n�mde sidebar varsay�lan olarak kapal�
        snk_sidebar.classList.remove('collapsed');
        snk_sidebar.classList.remove('active');

        // Mobil men� butonunu g�ster
        if (snk_mobileSidebarToggle) {
            snk_mobileSidebarToggle.style.display = 'flex';
        }

        // Mobil g�r�n�me ge�ince sidebar toggle butonunun ikonunu g�ncelle
        if (snk_sidebarToggle) {
            const icon = snk_sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = ''; // �nceki t�m s�n�flar� temizle
                icon.classList.add('fas', 'fa-times'); // �arp� ikonu ekle
            }
        }

        // Ana i�eri�in margin'ini kald�r
        if (snk_mainContent) {
            snk_mainContent.style.marginLeft = '0';
        }
    } else {
        // Masa�st� g�r�n�mde yerel depolamadaki durumu uygula
        if (isCollapsed) {
            snk_sidebar.classList.add('collapsed');
            if (snk_mainContent) {
                snk_mainContent.style.marginLeft = 'var(--snk-sidebar-collapsed-width)';
            }

            // Toggle butonundaki ikonu g�ncelle
            if (snk_sidebarToggle) {
                const icon = snk_sidebarToggle.querySelector('i');
                if (icon) {
                    icon.className = ''; // �nceki t�m s�n�flar� temizle
                    icon.classList.add('fas', 'fa-chevron-right');
                }
            }
        } else {
            snk_sidebar.classList.remove('collapsed');
            if (snk_mainContent) {
                snk_mainContent.style.marginLeft = 'var(--snk-sidebar-width)';
            }

            // Toggle butonundaki ikonu g�ncelle
            if (snk_sidebarToggle) {
                const icon = snk_sidebarToggle.querySelector('i');
                if (icon) {
                    icon.className = ''; // �nceki t�m s�n�flar� temizle
                    icon.classList.add('fas', 'fa-chevron-left');
                }
            }
        }

        // Mobil men� butonunu gizle
        if (snk_mobileSidebarToggle) {
            snk_mobileSidebarToggle.style.display = 'none';
        }
    }
}

/**
 * Olay dinleyicilerini ekler
 */
function snk_sidebar_setupEventListeners() {
    // Sidebar toggle butonu i�in olay dinleyicisi
    if (snk_sidebarToggle) {
        snk_sidebarToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // T�klaman�n d��ar� yay�lmas�n� engelle

            // Mobil g�r�n�mde farkl� davran��
            if (snk_sidebar_isMobile()) {
                snk_sidebar_toggleMobileSidebar();
            } else {
                snk_sidebar_toggleSidebar();
            }
        });
        console.log("Sidebar toggle butonu olay dinleyicisi eklendi");
    } else {
        console.warn("Sidebar toggle butonu bulunamad� (ID: sidebarToggle)");
    }

    // Mobil hamburger men�s� i�in olay dinleyicisi
    if (snk_mobileSidebarToggle) {
        snk_mobileSidebarToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // T�klaman�n d��ar� yay�lmas�n� engelle
            snk_sidebar_toggleMobileSidebar();
        });
        console.log("Mobil menu butonu olay dinleyicisi eklendi");
    } else {
        console.warn("Mobil sidebar toggle butonu bulunamad� (ID: mobileSidebarToggle)");
    }

    // Profil men�s� i�in olay dinleyicisi
    if (snk_profileTrigger && snk_profileMenu) {
        snk_profileTrigger.addEventListener('click', (event) => {
            event.stopPropagation(); // T�klaman�n d��ar� yay�lmas�n� engelle
            snk_profileMenu.classList.toggle('active');

            // Profil men�s� a��ld���nda d��ar� t�kland���nda kapanmas� i�in
            document.addEventListener('click', snk_sidebar_handleDocumentClick);
        });
    } else {
        console.warn("Profil trigger veya profil men�s� bulunamad�");
    }

    // Mobil g�r�n�mde sayfa d���na t�klan�nca sidebar'� kapat
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
 * Sayfa geni�li�i de�i�ti�inde �al��acak fonksiyon
 */
function snk_sidebar_handleResize() {
    // Medya sorgusuna g�re sidebar'� ayarla
    snk_sidebar_setupInitialState();
}

/**
 * Belge t�klamalar�n� i�ler (profil men�s� i�in)
 */
function snk_sidebar_handleDocumentClick(event) {
    if (snk_profileTrigger &&
        snk_profileMenu &&
        !snk_profileTrigger.contains(event.target) &&
        !snk_profileMenu.contains(event.target)) {

        snk_profileMenu.classList.remove('active');

        // Event listener'� kald�r (performans i�in)
        document.removeEventListener('click', snk_sidebar_handleDocumentClick);
    }
}

/**
 * Sidebar'� geni�let/daralt (masa�st� g�r�n�m� i�in)
 */
function snk_sidebar_toggleSidebar() {
    if (!snk_sidebar) {
        console.error("Sidebar bulunamad�");
        return;
    }

    // Mobil g�r�n�mde sidebar davran���n� farkl� ele al
    if (snk_sidebar_isMobile()) {
        snk_sidebar_toggleMobileSidebar();
        return;
    }

    // Masa�st� g�r�n�m�nde sidebar davran���
    const isCollapsed = snk_sidebar.classList.contains('collapsed');

    if (isCollapsed) {
        // Sidebar daralt�lm��sa geni�let
        snk_sidebar.classList.remove('collapsed');
        if (snk_mainContent) {
            snk_mainContent.style.marginLeft = 'var(--snk-sidebar-width)';
        }

        // �konu g�ncelle
        if (snk_sidebarToggle) {
            const icon = snk_sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = ''; // �nceki t�m s�n�flar� temizle
                icon.classList.add('fas', 'fa-chevron-left');
            }
        }
    } else {
        // Sidebar geni�se daralt
        snk_sidebar.classList.add('collapsed');
        if (snk_mainContent) {
            snk_mainContent.style.marginLeft = 'var(--snk-sidebar-collapsed-width)';
        }

        // �konu g�ncelle
        if (snk_sidebarToggle) {
            const icon = snk_sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = ''; // �nceki t�m s�n�flar� temizle
                icon.classList.add('fas', 'fa-chevron-right');
            }
        }
    }

    // Yeni durumu yerel depolamaya kaydet
    localStorage.setItem('snk_sidebar_collapsed', !isCollapsed);

    console.log("Sidebar durumu de�i�tirildi:", !isCollapsed ? "daralt�ld�" : "geni�letildi");
}

/**
 * Mobil g�r�n�mde sidebar'� a�/kapat
 */
function snk_sidebar_toggleMobileSidebar() {
    if (!snk_sidebar) {
        console.error("Sidebar bulunamad�");
        return;
    }

    // Mobil g�r�n�mde active class'� ile a�/kapat
    const isActive = snk_sidebar.classList.contains('active');

    if (isActive) {
        // A��ksa kapat
        snk_sidebar.classList.remove('active');

        // �konu g�ncelle (toggle butonunda)
        if (snk_sidebarToggle) {
            const icon = snk_sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = '';
                icon.classList.add('fas', 'fa-times');
            }
        }
    } else {
        // Kapal�ysa a�
        snk_sidebar.classList.add('active');

        // �konu g�ncelle (toggle butonunda)
        if (snk_sidebarToggle) {
            const icon = snk_sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = '';
                icon.classList.add('fas', 'fa-times');
            }
        }
    }

    console.log("Mobil sidebar durumu de�i�tirildi:", !isActive ? "a��ld�" : "kapand�");
}

// Global eri�im i�in
window.snk_sidebar_toggleSidebar = snk_sidebar_toggleSidebar;
window.snk_sidebar_toggleMobileSidebar = snk_sidebar_toggleMobileSidebar;
