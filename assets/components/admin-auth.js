/**
 * Admin Authentication Module
 * 
 * Bu modül, admin sayfasýna eriþim için kimlik doðrulama iþlemlerini yönetir.
 * Admin þifresi doðrudan bu dosyada tanýmlanmýþtýr.
 */

// Admin þifresi (sabit olarak tanýmlanmýþtýr)
const ADMIN_PASSWORD = "SN2023MYO4321"; // Admin þifresi

/**
 * Admin giriþ formunu göster
 */
function showAdminLoginForm() {
    // Admin giriþ formunu oluþtur
    const loginForm = document.createElement('div');
    loginForm.className = 'admin-login-overlay';
    loginForm.innerHTML = `
        <div class="admin-login-container">
            <h2>Admin Paneli</h2>
            <p>Bu sayfa sadece yöneticiler için eriþilebilir.</p>
            <p>Lütfen admin giriþ kodunu girin:</p>
            <input type="password" id="adminPasswordInput" class="admin-password-input" placeholder="Admin Kodu">
            <div class="admin-login-buttons">
                <button id="adminLoginButton" class="admin-login-button">Giriþ Yap</button>
            </div>
        </div>
    `;

    // Formu sayfaya ekle
    document.body.appendChild(loginForm);

    // Giriþ butonuna týklama olayý ekle
    document.getElementById('adminLoginButton').addEventListener('click', validateAdminLogin);

    // Enter tuþuna basýldýðýnda da giriþ yap
    document.getElementById('adminPasswordInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            validateAdminLogin();
        }
    });
}

/**
 * Admin giriþini doðrula
 */
function validateAdminLogin() {
    const passwordInput = document.getElementById('adminPasswordInput');
    const enteredPassword = passwordInput.value;

    // Þifre doðru mu kontrol et
    if (enteredPassword === ADMIN_PASSWORD) {
        // Baþarýlý giriþ - artýk localStorage kullanmýyoruz, yalnýzca oturum için geçerli

        // Giriþ formunu kaldýr
        const loginForm = document.querySelector('.admin-login-overlay');
        if (loginForm) {
            loginForm.remove();
        }

        // Admin içeriðini göster
        showAdminContent();
    } else {
        // Baþarýsýz giriþ
        alert('Hatalý admin kodu! Lütfen tekrar deneyin.');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

/**
 * Admin içeriðini göster
 */
function showAdminContent() {
    // Admin panelinin içeriðini görünür yap
    const adminContainer = document.querySelector('.admin-container');
    if (adminContainer) {
        adminContainer.style.display = 'block';
    }

    // Karþýlama mesajýný göster
    const welcomeBanner = document.querySelector('.admin-welcome-banner');
    if (welcomeBanner) {
        welcomeBanner.style.display = 'block';
        welcomeBanner.innerHTML = `Hoþgeldiniz, Deðerli Yönetim Üyesi! | Senirkent MYO Blog Admin Paneline Hoþgeldiniz! | ${new Date().toLocaleDateString('tr-TR')} | Yönetim Paneli Aktif`;
    }

    // Çýkýþ butonu için olay dinleyici ekle
    const logoutButton = document.getElementById('admin-logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutAdmin);
    }
}

/**
 * Admin çýkýþý yapma
 */
function logoutAdmin() {
    // Sayfayý yeniden yükle
    window.location.reload();
}

/**
 * Admin sayfasýný baþlat
 */
function initAdminPage() {
    // Dark mode durumunu kontrol et ve uygula
    const isDarkMode = localStorage.getItem('eren-theme') === 'dark';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    // Admin sayfasý içeriðini gizle
    const adminContainer = document.querySelector('.admin-container');
    if (adminContainer) {
        adminContainer.style.display = 'none';
    }

    // Kullanýcýnýn onay durumunu kontrol et
    checkUserApprovalStatus();

    // Dark mode deðiþikliklerini dinle
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
 * Kullanýcýnýn onay durumunu kontrol et
 */
function checkUserApprovalStatus() {
    // Mevcut kullanýcý bilgisini al
    const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || '{}');

    console.log('checkUserApprovalStatus çalýþýyor, currentUser:', currentUser);

    // Kullanýcý giriþ yapmýþ mý kontrol et
    if (currentUser && currentUser.email) {
        console.log('Kullanýcý giriþ yapmýþ:', currentUser.email);

        // Kullanýcýnýn durumunu kontrol et
        const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
        console.log('Onay bekleyen kullanýcýlar:', pendingUsers);

        const isPending = pendingUsers.some(user => user.email === currentUser.email);
        console.log('Kullanýcý onay bekliyor mu:', isPending);

        // Blog yazýlarý kontrolü - hem snk_blog_posts hem de snk_blogPosts'u kontrol et
        let blogPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
        if (blogPosts.length === 0) {
            blogPosts = JSON.parse(localStorage.getItem('snk_blogPosts') || '[]');
        }

        console.log('Blog yazýlarý:', blogPosts);

        // Kullanýcýnýn onaylanmamýþ blog yazýlarý var mý?
        const hasPendingPosts = blogPosts.some(post => {
            // post.author kontrolü
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

            console.log('Post kontrolü:', post.title, 'Yazar:', authorEmail, 'Status:', post.status, 'Pending mi:', isPendingPost);

            return isPendingPost;
        });

        console.log('Kullanýcýnýn onaylanmamýþ yazýsý var mý:', hasPendingPosts);

        if (isPending || hasPendingPosts) {
            console.log('Kullanýcý onay bekliyor veya onaylanmamýþ yazýsý var, modal gösteriliyor');
            // Kullanýcý onay bekliyor veya onaylanmamýþ blog yazýsý var
            showPendingApprovalMessage();
            return;
        }
    }

    console.log('Normal admin giriþ formu gösteriliyor');
    // Her seferinde giriþ formunu göster (localStorage kontrolünü kaldýrdýk)
    showAdminLoginForm();
}

/**
 * Onay bekleyen kullanýcý için bilgi mesajý göster
 */
function showPendingApprovalMessage() {
    console.log('showPendingApprovalMessage fonksiyonu çalýþtý');

    const pendingModal = document.getElementById('pending-approval-modal');
    console.log('pending-approval-modal elementi:', pendingModal);

    if (pendingModal) {
        // Mevcut onay bekleme modalýný göster
        pendingModal.style.display = 'flex';

        // OK butonuna olay dinleyicisi ekle
        const okButton = document.getElementById('pending-approval-ok');
        if (okButton) {
            console.log('OK butonu bulundu, event listener ekleniyor');
            // Eðer zaten olay dinleyicisi varsa, yeni bir tane eklemeyi önle
            okButton.removeEventListener('click', handlePendingOkClick);
            okButton.addEventListener('click', handlePendingOkClick);
        } else {
            console.error('pending-approval-ok butonu bulunamadý');
        }
    } else {
        console.error('pending-approval-modal elementi bulunamadý');
        // Modal yok, daha basit bir uyarý göster
        alert('Hesabýnýz veya blog yazýlarýnýz yönetici onayý bekliyor. Þu anda admin paneline eriþemezsiniz.');

        // Ana sayfaya yönlendir
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// OK butonu týklama olayý için ayrýlmýþ fonksiyon
function handlePendingOkClick() {
    console.log('Onay bekleme modalý kapatýlýyor');
    const pendingModal = document.getElementById('pending-approval-modal');
    if (pendingModal) {
        pendingModal.style.display = 'none';
    }

    // Ana sayfaya yönlendir
    console.log('Ana sayfaya yönlendiriliyor');
    window.location.href = 'index.html';
}

// Sayfa yüklendiðinde admin sayfasýný baþlat
document.addEventListener('DOMContentLoaded', initAdminPage);

// Fonksiyonlarý global scope'a ekle
window.showAdminLoginForm = showAdminLoginForm;
window.validateAdminLogin = validateAdminLogin;
window.initAdminPage = initAdminPage;
window.logoutAdmin = logoutAdmin;
window.checkUserApprovalStatus = checkUserApprovalStatus;
window.showPendingApprovalMessage = showPendingApprovalMessage;
window.handlePendingOkClick = handlePendingOkClick;
