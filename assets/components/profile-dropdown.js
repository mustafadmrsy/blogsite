/**
 * Profile Dropdown JavaScript - Senirkent Blog
 * Her fonksiyon �neki: snk_profileDropdown_ (kod �ak��malar�n� �nlemek i�in)
 */

// DOM elemanlar�n� tan�mla
const snk_profileDropdownBtn = document.getElementById('profileDropdownBtn');
const snk_profileDropdownMenu = document.getElementById('profileDropdownMenu');
const snk_darkModeToggle = document.getElementById('darkModeToggle');
const snk_logoutButton = document.querySelector('.snk-logout');
const snk_userProfileDropdown = document.querySelector('.snk-user-profile-dropdown');
const snk_loginBtn = document.getElementById('snk_login_btn');
const snk_registerBtn = document.getElementById('snk_register_btn');

/**
 * Sayfa y�klendi�inde �al��acak fonksiyonlar
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("profile-dropdown.js y�klendi");

    // DOM elemanlar�n� kontrol et ve ekrana bilgi yazd�r
    console.log("Profil dropdown elemanlar�:", {
        profileDropdownBtn: snk_profileDropdownBtn,
        profileDropdownMenu: snk_profileDropdownMenu,
        darkModeToggle: snk_darkModeToggle,
        logoutButton: snk_logoutButton,
        userProfileDropdown: snk_userProfileDropdown,
        loginBtn: snk_loginBtn,
        registerBtn: snk_registerBtn
    });

    // Oturum durumunu kontrol et
    snk_profileDropdown_checkAuthStatus();

    // Olay dinleyicilerini ekle
    snk_profileDropdown_setupEventListeners();
});

/**
 * Olay dinleyicilerini ekler
 */
function snk_profileDropdown_setupEventListeners() {
    // Profil dropdown butonu i�in olay dinleyicisi
    if (snk_profileDropdownBtn) {
        snk_profileDropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // T�klaman�n d��ar� yay�lmas�n� engelle
            snk_profileDropdown_toggleMenu();
        });
        console.log("Profil dropdown butonu olay dinleyicisi eklendi");
    } else {
        console.warn("Profil dropdown butonu bulunamad�");
    }

    // Karanl�k mod toggle i�in olay dinleyicisi
    if (snk_darkModeToggle) {
        snk_darkModeToggle.addEventListener('change', () => {
            snk_profileDropdown_toggleDarkMode();
        });
        console.log("Karanl�k mod toggle olay dinleyicisi eklendi");
    }

    // ��k�� yap butonu i�in olay dinleyicisi
    if (snk_logoutButton) {
        snk_logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            snk_profileDropdown_logout();
        });
        console.log("��k�� yap butonu olay dinleyicisi eklendi");
    } else {
        console.warn("��k�� yap butonu bulunamad�");
    }

    // Sayfa d���na t�klan�nca dropdown'� kapat
    document.addEventListener('click', (event) => {
        if (snk_profileDropdownMenu &&
            snk_profileDropdownMenu.classList.contains('active') &&
            !snk_profileDropdownBtn.contains(event.target) &&
            !snk_profileDropdownMenu.contains(event.target)) {
            snk_profileDropdownMenu.classList.remove('active');
        }
    });
}

/**
 * Profil dropdown men�s�n� a�/kapat
 */
function snk_profileDropdown_toggleMenu() {
    if (!snk_profileDropdownMenu) return;

    snk_profileDropdownMenu.classList.toggle('active');
}

/**
 * Karanl�k mod ayar�n� de�i�tirir
 */
function snk_profileDropdown_toggleDarkMode() {
    if (!snk_darkModeToggle) return;

    const isDarkMode = snk_darkModeToggle.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('snk_dark_mode', isDarkMode ? 'true' : 'false');

    console.log(`Karanl�k mod ${isDarkMode ? 'a��ld�' : 'kapat�ld�'}`);
}

/**
 * Kullan�c� ��k���n� yapar
 */
function snk_profileDropdown_logout() {
    console.log('Kullan�c� ��k�� yap�yor...');

    // Kullan�c� bilgilerini localStorage'dan temizle
    localStorage.removeItem('snk_currentUser');
    localStorage.removeItem('snk_userToken');
    localStorage.removeItem('snk_authExpires');

    // Dropdownu kapat
    if (snk_profileDropdownMenu) {
        snk_profileDropdownMenu.classList.remove('active');
    }

    // UI g�ncelleme - Profilim butonu gizle, Giri�/Kay�t butonlar�n� g�ster
    if (snk_userProfileDropdown) {
        snk_userProfileDropdown.style.display = 'none';
    }

    // Giri�/Kay�t butonlar�n� g�ster
    if (snk_loginBtn) {
        snk_loginBtn.style.display = 'flex';
    }
    if (snk_registerBtn) {
        snk_registerBtn.style.display = 'flex';
    }

    console.log('Kullan�c� ��k�� yapt� ve UI g�ncellendi');

    // Sayfay� yenileme olmadan do�rudan UI g�ncellendi
    // window.location.reload();
}

/**
 * Oturum durumunu kontrol eder ve uygun UI elemanlar�n� g�sterir/gizler
 */
function snk_profileDropdown_checkAuthStatus() {
    // LocalStorage'dan kullan�c� bilgisini al
    const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || 'null');

    if (currentUser) {
        // Kullan�c� oturum a�m��: Profilim butonunu g�ster, Giri�/Kay�t butonlar�n� gizle
        if (snk_userProfileDropdown) {
            snk_userProfileDropdown.style.display = 'block';
        }

        if (snk_loginBtn) {
            snk_loginBtn.style.display = 'none';
        }
        if (snk_registerBtn) {
            snk_registerBtn.style.display = 'none';
        }

        // Kullan�c� bilgilerini dropdown'da g�ncelle
        const userName = document.querySelector('.snk-user-name');
        const userHandle = document.querySelector('.snk-user-handle');

        if (userName && currentUser.displayName) {
            userName.textContent = currentUser.displayName;
        }

        if (userHandle && currentUser.username) {
            userHandle.textContent = '@' + currentUser.username;
        }

        console.log('Kullan�c� oturum a�m��: UI g�ncellendi');
    } else {
        // Kullan�c� oturum a�mam��: Profilim butonunu gizle, Giri�/Kay�t butonlar�n� g�ster
        if (snk_userProfileDropdown) {
            snk_userProfileDropdown.style.display = 'none';
        }

        if (snk_loginBtn) {
            snk_loginBtn.style.display = 'flex';
        }
        if (snk_registerBtn) {
            snk_registerBtn.style.display = 'flex';
        }

        console.log('Kullan�c� oturum a�mam��: UI g�ncellendi');
    }
}

// Sayfa y�klendi�inde karanl�k mod ayar�n� kontrol et
function snk_profileDropdown_checkDarkModePreference() {
    const savedPreference = localStorage.getItem('snk_dark_mode') === 'true';

    if (snk_darkModeToggle) {
        snk_darkModeToggle.checked = savedPreference;
    }

    document.body.classList.toggle('dark-mode', savedPreference);
}

// Sayfa y�klendi�inde karanl�k mod ayar�n� kontrol et
document.addEventListener('DOMContentLoaded', snk_profileDropdown_checkDarkModePreference);

// Global eri�im i�in
window.snk_profileDropdown_toggleMenu = snk_profileDropdown_toggleMenu;
window.snk_profileDropdown_toggleDarkMode = snk_profileDropdown_toggleDarkMode;
window.snk_profileDropdown_logout = snk_profileDropdown_logout;
window.snk_profileDropdown_checkAuthStatus = snk_profileDropdown_checkAuthStatus;
