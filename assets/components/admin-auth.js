/**
 * Admin Authentication Module
 * 
 * Bu mod�l, admin sayfas�na eri�im i�in kimlik do�rulama i�lemlerini y�netir.
 * Admin �ifresi do�rudan bu dosyada tan�mlanm��t�r.
 */

// Admin �ifresi (sabit olarak tan�mlanm��t�r)
const ADMIN_PASSWORD = "SN2023MYO4321"; // Admin �ifresi

/**
 * Admin giri� formunu g�ster
 */
function showAdminLoginForm() {
    // Admin giri� formunu olu�tur
    const loginForm = document.createElement('div');
    loginForm.className = 'admin-login-overlay';
    loginForm.innerHTML = `
        <div class="admin-login-container">
            <h2>Admin Paneli</h2>
            <p>Bu sayfa sadece y�neticiler i�in eri�ilebilir.</p>
            <p>L�tfen admin giri� kodunu girin:</p>
            <input type="password" id="adminPasswordInput" class="admin-password-input" placeholder="Admin Kodu">
            <div class="admin-login-buttons">
                <button id="adminLoginButton" class="admin-login-button">Giri� Yap</button>
            </div>
        </div>
    `;

    // Formu sayfaya ekle
    document.body.appendChild(loginForm);

    // Giri� butonuna t�klama olay� ekle
    document.getElementById('adminLoginButton').addEventListener('click', validateAdminLogin);

    // Enter tu�una bas�ld���nda da giri� yap
    document.getElementById('adminPasswordInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            validateAdminLogin();
        }
    });
}

/**
 * Admin giri�ini do�rula
 */
function validateAdminLogin() {
    const passwordInput = document.getElementById('adminPasswordInput');
    const enteredPassword = passwordInput.value;

    // �ifre do�ru mu kontrol et
    if (enteredPassword === ADMIN_PASSWORD) {
        // Ba�ar�l� giri� - art�k localStorage kullanm�yoruz, yaln�zca oturum i�in ge�erli

        // Giri� formunu kald�r
        const loginForm = document.querySelector('.admin-login-overlay');
        if (loginForm) {
            loginForm.remove();
        }

        // Admin i�eri�ini g�ster
        showAdminContent();
    } else {
        // Ba�ar�s�z giri�
        alert('Hatal� admin kodu! L�tfen tekrar deneyin.');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

/**
 * Admin i�eri�ini g�ster
 */
function showAdminContent() {
    // Admin panelinin i�eri�ini g�r�n�r yap
    const adminContainer = document.querySelector('.admin-container');
    if (adminContainer) {
        adminContainer.style.display = 'block';
    }

    // Kar��lama mesaj�n� g�ster
    const welcomeBanner = document.querySelector('.admin-welcome-banner');
    if (welcomeBanner) {
        welcomeBanner.style.display = 'block';
        welcomeBanner.innerHTML = `Ho�geldiniz, De�erli Y�netim �yesi! | Senirkent MYO Blog Admin Paneline Ho�geldiniz! | ${new Date().toLocaleDateString('tr-TR')} | Y�netim Paneli Aktif`;
    }

    // ��k�� butonu i�in olay dinleyici ekle
    const logoutButton = document.getElementById('admin-logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutAdmin);
    }
}

/**
 * Admin ��k��� yapma
 */
function logoutAdmin() {
    // Sayfay� yeniden y�kle
    window.location.reload();
}

/**
 * Admin sayfas�n� ba�lat
 */
function initAdminPage() {
    // Dark mode durumunu kontrol et ve uygula
    const isDarkMode = localStorage.getItem('eren-theme') === 'dark';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    // Admin sayfas� i�eri�ini gizle
    const adminContainer = document.querySelector('.admin-container');
    if (adminContainer) {
        adminContainer.style.display = 'none';
    }

    // Kullan�c�n�n onay durumunu kontrol et
    checkUserApprovalStatus();

    // Dark mode de�i�ikliklerini dinle
    window.addEventListener('storage', function (e) {
        if (e.key === 'eren-theme') {
            if (e.newValue === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
}

/**
 * Kullan�c�n�n onay durumunu kontrol et
 */
function checkUserApprovalStatus() {
    // Mevcut kullan�c� bilgisini al
    const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || '{}');

    console.log('checkUserApprovalStatus �al���yor, currentUser:', currentUser);

    // Kullan�c� giri� yapm�� m� kontrol et
    if (currentUser && currentUser.email) {
        console.log('Kullan�c� giri� yapm��:', currentUser.email);

        // Kullan�c�n�n durumunu kontrol et
        const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
        console.log('Onay bekleyen kullan�c�lar:', pendingUsers);

        const isPending = pendingUsers.some(user => user.email === currentUser.email);
        console.log('Kullan�c� onay bekliyor mu:', isPending);

        // Blog yaz�lar� kontrol� - hem snk_blog_posts hem de snk_blogPosts'u kontrol et
        let blogPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
        if (blogPosts.length === 0) {
            blogPosts = JSON.parse(localStorage.getItem('snk_blogPosts') || '[]');
        }

        console.log('Blog yaz�lar�:', blogPosts);

        // Kullan�c�n�n onaylanmam�� blog yaz�lar� var m�?
        const hasPendingPosts = blogPosts.some(post => {
            // post.author kontrol�
            if (!post.author) return false;

            // post.author bir string olabilir veya bir obje olabilir
            let authorEmail = '';
            if (typeof post.author === 'string') {
                authorEmail = post.author;
            } else if (post.author.email) {
                authorEmail = post.author.email;
            }

            const isPendingPost =
                authorEmail === currentUser.email &&
                (post.status === 'pending' || post.status !== 'published');

            console.log('Post kontrol�:', post.title, 'Yazar:', authorEmail, 'Status:', post.status, 'Pending mi:', isPendingPost);

            return isPendingPost;
        });

        console.log('Kullan�c�n�n onaylanmam�� yaz�s� var m�:', hasPendingPosts);

        if (isPending || hasPendingPosts) {
            console.log('Kullan�c� onay bekliyor veya onaylanmam�� yaz�s� var, modal g�steriliyor');
            // Kullan�c� onay bekliyor veya onaylanmam�� blog yaz�s� var
            showPendingApprovalMessage();
            return;
        }
    }

    console.log('Normal admin giri� formu g�steriliyor');
    // Her seferinde giri� formunu g�ster (localStorage kontrol�n� kald�rd�k)
    showAdminLoginForm();
}

/**
 * Onay bekleyen kullan�c� i�in bilgi mesaj� g�ster
 */
function showPendingApprovalMessage() {
    console.log('showPendingApprovalMessage fonksiyonu �al��t�');

    const pendingModal = document.getElementById('pending-approval-modal');
    console.log('pending-approval-modal elementi:', pendingModal);

    if (pendingModal) {
        // Mevcut onay bekleme modal�n� g�ster
        pendingModal.style.display = 'flex';

        // OK butonuna olay dinleyicisi ekle
        const okButton = document.getElementById('pending-approval-ok');
        if (okButton) {
            console.log('OK butonu bulundu, event listener ekleniyor');
            // E�er zaten olay dinleyicisi varsa, yeni bir tane eklemeyi �nle
            okButton.removeEventListener('click', handlePendingOkClick);
            okButton.addEventListener('click', handlePendingOkClick);
        } else {
            console.error('pending-approval-ok butonu bulunamad�');
        }
    } else {
        console.error('pending-approval-modal elementi bulunamad�');
        // Modal yok, daha basit bir uyar� g�ster
        alert('Hesab�n�z veya blog yaz�lar�n�z y�netici onay� bekliyor. �u anda admin paneline eri�emezsiniz.');

        // Ana sayfaya y�nlendir
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// OK butonu t�klama olay� i�in ayr�lm�� fonksiyon
function handlePendingOkClick() {
    console.log('Onay bekleme modal� kapat�l�yor');
    const pendingModal = document.getElementById('pending-approval-modal');
    if (pendingModal) {
        pendingModal.style.display = 'none';
    }

    // Ana sayfaya y�nlendir
    console.log('Ana sayfaya y�nlendiriliyor');
    window.location.href = 'index.html';
}

// Sayfa y�klendi�inde admin sayfas�n� ba�lat
document.addEventListener('DOMContentLoaded', initAdminPage);

// Fonksiyonlar� global scope'a ekle
window.showAdminLoginForm = showAdminLoginForm;
window.validateAdminLogin = validateAdminLogin;
window.initAdminPage = initAdminPage;
window.logoutAdmin = logoutAdmin;
window.checkUserApprovalStatus = checkUserApprovalStatus;
window.showPendingApprovalMessage = showPendingApprovalMessage;
window.handlePendingOkClick = handlePendingOkClick;
