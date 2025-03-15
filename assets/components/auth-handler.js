/**
 * Auth Handlers - Senirkent Blog
 * Kimlik do�rulama popup ve formlar� i�in JavaScript
 */

// DOM elementlerini se�me
const loginBtn = document.getElementById('snk_login_btn');
const registerBtn = document.getElementById('snk_register_btn');

const loginPopup = document.getElementById('snk_loginPopup');
const registerPopup = document.getElementById('snk_registerPopup');
const verificationPopup = document.getElementById('snk_verificationPopup');

const loginCloseBtn = document.getElementById('snk_loginCloseBtn');
const registerCloseBtn = document.getElementById('snk_registerCloseBtn');
const verificationCloseBtn = document.getElementById('snk_verificationCloseBtn');

const showRegisterPopupLink = document.getElementById('showRegisterPopup');
const showLoginPopupLink = document.getElementById('showLoginPopup');
const resendVerificationCodeLink = document.getElementById('resendVerificationCode');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const verificationForm = document.getElementById('verificationForm');

const loginAlertBox = document.getElementById('loginAlertBox');
const registerAlertBox = document.getElementById('registerAlertBox');
const verificationAlertBox = document.getElementById('verificationAlertBox');

const verificationEmail = document.getElementById('verificationEmail');

// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Yard�mc� Fonksiyonlar

/**
 * Alert mesaj� g�ster
 * @param {HTMLElement} alertBox - Alert kutusu elementi
 * @param {string} message - G�sterilecek mesaj
 * @param {string} type - Alert tipi ('success' veya 'error')
 */
function showAlert(alertBox, message, type) {
    alertBox.textContent = message;
    alertBox.className = `auth-alert ${type}`;
    alertBox.style.display = 'block';

    // 5 saniye sonra alert'i gizle
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}

/**
 * Popup g�ster
 * @param {HTMLElement} popup - G�sterilecek popup
 */
function showPopup(popup) {
    // T�m popup'lar� gizle
    loginPopup.style.display = 'none';
    registerPopup.style.display = 'none';
    verificationPopup.style.display = 'none';

    // �stenen popup'� g�ster
    popup.style.display = 'flex';
}

/**
 * Popup gizle
 * @param {HTMLElement} popup - Gizlenecek popup
 */
function hidePopup(popup) {
    popup.style.display = 'none';
}

// Event Listeners

// Buton t�klamalar�
if (loginBtn) {
    loginBtn.addEventListener('click', () => showPopup(loginPopup));
}

if (registerBtn) {
    registerBtn.addEventListener('click', () => showPopup(registerPopup));
}

// Kapatma butonlar�
if (loginCloseBtn) {
    loginCloseBtn.addEventListener('click', () => hidePopup(loginPopup));
}

if (registerCloseBtn) {
    registerCloseBtn.addEventListener('click', () => hidePopup(registerPopup));
}

if (verificationCloseBtn) {
    verificationCloseBtn.addEventListener('click', () => hidePopup(verificationPopup));
}

// Popup ge�i�leri
if (showRegisterPopupLink) {
    showRegisterPopupLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPopup(registerPopup);
    });
}

if (showLoginPopupLink) {
    showLoginPopupLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPopup(loginPopup);
    });
}

// Form G�nderme ��leyicileri

// Kay�t formu
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Kay�t formu g�nderildi');

        // Form verilerini al
        const name = document.getElementById('registerName').value;
        const surname = document.getElementById('registerSurname').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        console.log('Form verileri:', { name, surname, email });

        try {
            // API iste�i
            console.log('API iste�i yap�l�yor:', `${API_BASE_URL}/register`);
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, surname, email, password })
            });

            const data = await response.json();
            console.log('API yan�t�:', data);

            if (data.success) {
                // Ba�ar�l� kay�t
                showAlert(registerAlertBox, data.message, 'success');

                // Do�rulama formuna ge�i�
                verificationEmail.value = email;
                setTimeout(() => {
                    showPopup(verificationPopup);
                }, 1500);
            } else {
                // Hata
                showAlert(registerAlertBox, data.message, 'error');
            }
        } catch (error) {
            console.error('Kay�t hatas�:', error);
            showAlert(registerAlertBox, 'Bir hata olu�tu. L�tfen daha sonra tekrar deneyin.', 'error');
        }
    });
}

// Do�rulama formu
if (verificationForm) {
    verificationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Form verilerini al
        const email = verificationEmail.value;
        const verificationCode = document.getElementById('verificationCode').value;

        try {
            // API iste�i
            const response = await fetch(`${API_BASE_URL}/verify-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, verificationCode })
            });

            const data = await response.json();

            if (data.success) {
                // Ba�ar�l� do�rulama
                showAlert(verificationAlertBox, data.message, 'success');

                // Giri� formuna y�nlendir
                setTimeout(() => {
                    showPopup(loginPopup);
                }, 2000);
            } else {
                // Hata
                showAlert(verificationAlertBox, data.message, 'error');
            }
        } catch (error) {
            console.error('Do�rulama hatas�:', error);
            showAlert(verificationAlertBox, 'Bir hata olu�tu. L�tfen tekrar deneyin.', 'error');
        }
    });
}

// Do�rulama kodu yeniden g�nderme
if (resendVerificationCodeLink) {
    resendVerificationCodeLink.addEventListener('click', async (e) => {
        e.preventDefault();

        const email = verificationEmail.value;

        if (!email) {
            showAlert(verificationAlertBox, 'E-posta adresi bulunamad�.', 'error');
            return;
        }

        try {
            // API iste�i
            const response = await fetch(`${API_BASE_URL}/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                showAlert(verificationAlertBox, data.message, 'success');
            } else {
                showAlert(verificationAlertBox, data.message, 'error');
            }
        } catch (error) {
            console.error('Kod yeniden g�nderme hatas�:', error);
            showAlert(verificationAlertBox, 'Bir hata olu�tu. L�tfen tekrar deneyin.', 'error');
        }
    });
}

// Giri� formu
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Form verilerini al
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // API iste�i
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Ba�ar�l� giri�
                showAlert(loginAlertBox, data.message, 'success');

                // Kullan�c� bilgilerini sakla
                localStorage.setItem('snk_current_user', JSON.stringify(data.user));

                // Sayfay� yenile
                setTimeout(() => {
                    hidePopup(loginPopup);
                    window.location.reload();
                }, 1500);
            } else {
                // Hata
                showAlert(loginAlertBox, data.message, 'error');
            }
        } catch (error) {
            console.error('Giri� hatas�:', error);
            showAlert(loginAlertBox, 'Bir hata olu�tu. L�tfen tekrar deneyin.', 'error');
        }
    });
}

// Arka plana t�klay�nca popup'� kapat
window.addEventListener('click', (e) => {
    if (e.target === loginPopup) {
        hidePopup(loginPopup);
    } else if (e.target === registerPopup) {
        hidePopup(registerPopup);
    } else if (e.target === verificationPopup) {
        hidePopup(verificationPopup);
    }
});

// Oturum durumunu kontrol et ve UI'� g�ncelle
function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('snk_current_user') || 'null');

    if (currentUser) {
        // Kullan�c� giri� yapm��
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';

        // Profil g�ster (e�er profil elementi varsa)
        const profileContainer = document.querySelector('.snk-profile-container');
        if (profileContainer) {
            profileContainer.style.display = 'block';
        }

        // Profil bilgilerini g�ncelle
        const profileName = document.querySelector('.snk-profile-name');
        if (profileName) {
            profileName.textContent = `${currentUser.name} ${currentUser.surname}`;
        }

        const profileUsername = document.querySelector('.snk-profile-username');
        if (profileUsername) {
            profileUsername.textContent = `@${currentUser.email.split('@')[0]}`;
        }
    } else {
        // Kullan�c� giri� yapmam��
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';

        // Profili gizle
        const profileContainer = document.querySelector('.snk-profile-container');
        if (profileContainer) {
            profileContainer.style.display = 'none';
        }
    }
}

// Sayfa y�klendi�inde oturum durumunu kontrol et
document.addEventListener('DOMContentLoaded', checkAuthStatus);
