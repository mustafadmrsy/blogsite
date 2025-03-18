/**
 * Profile Dropdown JavaScript - Senirkent Blog
 * Her fonksiyon öneki: snk_profileDropdown_ (kod çakýþmalarýný önlemek için)
 */

// DOM elemanlarýný tanýmla
const snk_profileDropdownBtn = document.getElementById('profileDropdownBtn');
const snk_profileDropdownMenu = document.getElementById('profileDropdownMenu');
const snk_darkModeToggle = document.getElementById('darkModeToggle');
const snk_logoutButton = document.querySelector('.snk-logout');
const snk_userProfileDropdown = document.querySelector('.snk-user-profile-dropdown');
const snk_loginBtn = document.getElementById('snk_login_btn');
const snk_registerBtn = document.getElementById('snk_register_btn');

/**
 * Sayfa yüklendiðinde çalýþacak fonksiyonlar
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("profile-dropdown.js yüklendi");

    // DOM elemanlarýný kontrol et ve ekrana bilgi yazdýr
    console.log("Profil dropdown elemanlarý:", {
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
    // Profil dropdown butonu için olay dinleyicisi
    if (snk_profileDropdownBtn) {
        snk_profileDropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Týklamanýn dýþarý yayýlmasýný engelle
            snk_profileDropdown_toggleMenu();
        });
        console.log("Profil dropdown butonu olay dinleyicisi eklendi");
    } else {
        console.warn("Profil dropdown butonu bulunamadý");
    }

    // Karanlýk mod toggle için olay dinleyicisi
    if (snk_darkModeToggle) {
        snk_darkModeToggle.addEventListener('change', () => {
            snk_profileDropdown_toggleDarkMode();
        });
        console.log("Karanlýk mod toggle olay dinleyicisi eklendi");
    }

    // Çýkýþ yap butonu için olay dinleyicisi
    if (snk_logoutButton) {
        snk_logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            snk_profileDropdown_logout();
        });
        console.log("Çýkýþ yap butonu olay dinleyicisi eklendi");
    } else {
        console.warn("Çýkýþ yap butonu bulunamadý");
    }

    // Sayfa dýþýna týklanýnca dropdown'ý kapat
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
 * Profil dropdown menüsünü aç/kapat
 */
function snk_profileDropdown_toggleMenu() {
    if (!snk_profileDropdownMenu) return;

    snk_profileDropdownMenu.classList.toggle('active');
}

/**
 * Karanlýk mod ayarýný deðiþtirir
 */
function snk_profileDropdown_toggleDarkMode() {
    if (!snk_darkModeToggle) return;

    const isDarkMode = snk_darkModeToggle.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('snk_dark_mode', isDarkMode ? 'true' : 'false');

    console.log(`Karanlýk mod ${isDarkMode ? 'açýldý' : 'kapatýldý'}`);
}

/**
 * Kullanýcý çýkýþýný yapar
 */
function snk_profileDropdown_logout() {
    console.log('Kullanýcý çýkýþ yapýyor...');

    // Kullanýcý bilgilerini localStorage'dan temizle
    localStorage.removeItem('snk_currentUser');
    localStorage.removeItem('snk_userToken');
    localStorage.removeItem('snk_authExpires');

    // Dropdownu kapat
    if (snk_profileDropdownMenu) {
        snk_profileDropdownMenu.classList.remove('active');
    }

    // UI güncelleme - Profilim butonu gizle, Giriþ/Kayýt butonlarýný göster
    if (snk_userProfileDropdown) {
        snk_userProfileDropdown.style.display = 'none';
    }

    // Giriþ/Kayýt butonlarýný göster
    if (snk_loginBtn) {
        snk_loginBtn.style.display = 'flex';
    }
    if (snk_registerBtn) {
        snk_registerBtn.style.display = 'flex';
    }

    console.log('Kullanýcý çýkýþ yaptý ve UI güncellendi');

    // Sayfayý yenileme olmadan doðrudan UI güncellendi
    // window.location.reload();
}

/**
 * Oturum durumunu kontrol eder ve uygun UI elemanlarýný gösterir/gizler
 */
function snk_profileDropdown_checkAuthStatus() {
    // LocalStorage'dan kullanýcý bilgisini al
    const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || 'null');

    if (currentUser) {
        // Kullanýcý oturum açmýþ: Profilim butonunu göster, Giriþ/Kayýt butonlarýný gizle
        if (snk_userProfileDropdown) {
            snk_userProfileDropdown.style.display = 'block';
        }

        if (snk_loginBtn) {
            snk_loginBtn.style.display = 'none';
        }
        if (snk_registerBtn) {
            snk_registerBtn.style.display = 'none';
        }

        // Kullanýcý bilgilerini dropdown'da güncelle
        const userName = document.querySelector('.snk-user-name');
        const userHandle = document.querySelector('.snk-user-handle');

        if (userName && currentUser.displayName) {
            userName.textContent = currentUser.displayName;
        }

        if (userHandle && currentUser.username) {
            userHandle.textContent = '@' + currentUser.username;
        }

        console.log('Kullanýcý oturum açmýþ: UI güncellendi');
    } else {
        // Kullanýcý oturum açmamýþ: Profilim butonunu gizle, Giriþ/Kayýt butonlarýný göster
        if (snk_userProfileDropdown) {
            snk_userProfileDropdown.style.display = 'none';
        }

        if (snk_loginBtn) {
            snk_loginBtn.style.display = 'flex';
        }
        if (snk_registerBtn) {
            snk_registerBtn.style.display = 'flex';
        }

        console.log('Kullanýcý oturum açmamýþ: UI güncellendi');
    }
}

// Sayfa yüklendiðinde karanlýk mod ayarýný kontrol et
function snk_profileDropdown_checkDarkModePreference() {
    const savedPreference = localStorage.getItem('snk_dark_mode') === 'true';

    if (snk_darkModeToggle) {
        snk_darkModeToggle.checked = savedPreference;
    }

    document.body.classList.toggle('dark-mode', savedPreference);
}

// Sayfa yüklendiðinde karanlýk mod ayarýný kontrol et
document.addEventListener('DOMContentLoaded', snk_profileDropdown_checkDarkModePreference);

// Global eriþim için
window.snk_profileDropdown_toggleMenu = snk_profileDropdown_toggleMenu;
window.snk_profileDropdown_toggleDarkMode = snk_profileDropdown_toggleDarkMode;
window.snk_profileDropdown_logout = snk_profileDropdown_logout;
window.snk_profileDropdown_checkAuthStatus = snk_profileDropdown_checkAuthStatus;
