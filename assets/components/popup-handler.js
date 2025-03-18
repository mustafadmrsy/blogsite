/**
 * Popup Handler - Senirkent Blog
 * Her fonksiyon �neki: snk_popupHandler_ (kod �ak��malar�n� �nlemek i�in)
 */

// DOM elemanlar�n� se�
const snk_popupHandler_overlay = document.getElementById('snk_popupOverlay');
const snk_popupHandler_container = document.querySelector('.snk-popup-container');
const snk_popupHandler_closeBtn = document.getElementById('snk_popupCloseBtn');
const snk_popupHandler_title = document.getElementById('snk_popupTitle');
const snk_popupHandler_content = document.getElementById('snk_popupContent');
const snk_popupHandler_readMoreBtns = document.querySelectorAll('.snk-read-more-btn');

/**
 * Popup'� a�ar
 * @param {string} title - Popup ba�l���
 * @param {string} content - Popup i�eri�i (HTML format�nda)
 */
function snk_popupHandler_openPopup(title, content) {
    console.log('Popup a��l�yor:', title);

    // Popup i�eri�ini ayarla
    if (snk_popupHandler_title) {
        snk_popupHandler_title.textContent = title;
    }

    if (snk_popupHandler_content) {
        snk_popupHandler_content.innerHTML = content;
    }

    // Popup'� g�r�n�r yap
    if (snk_popupHandler_overlay) {
        snk_popupHandler_overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Arka plan kayd�rmay� engelle
    }

    // Popup animasyonu i�in timeout kullan
    setTimeout(() => {
        if (snk_popupHandler_container) {
            snk_popupHandler_container.classList.add('active');
        }
    }, 10);
}

/**
 * Popup'� kapat�r
 */
function snk_popupHandler_closePopup() {
    console.log('Popup kapat�l�yor');

    if (snk_popupHandler_container) {
        snk_popupHandler_container.classList.remove('active');
    }

    // �nce container animasyonunu tamamla, sonra overlay'i gizle
    setTimeout(() => {
        if (snk_popupHandler_overlay) {
            snk_popupHandler_overlay.classList.remove('active');
            document.body.style.overflow = ''; // Arka plan kayd�rmay� etkinle�tir
        }
    }, 300); // CSS ge�i� s�resiyle e�le�meli
}

/**
 * "Devam�n� Oku" butonlar�na t�klama olay� ekler
 */
function snk_popupHandler_setupReadMoreButtons() {
    console.log('Devam�n� Oku butonlar� ayarlan�yor');

    const readMoreButtons = document.querySelectorAll('.snk-read-more-btn');
    if (readMoreButtons.length > 0) {
        readMoreButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault(); // Ba�lant� davran���n� engelle

                const postId = this.getAttribute('data-post-id');
                console.log('Post ID:', postId);

                if (postId) {
                    // popup.js i�indeki fonksiyonu �a��r
                    if (typeof snk_popup_fetchPostData === 'function') {
                        snk_popup_fetchPostData(postId);
                    } else {
                        console.error('snk_popup_fetchPostData fonksiyonu bulunamad�');
                    }
                } else {
                    console.error('Ge�ersiz post ID');
                }
            });
        });
    } else {
        console.warn('Hi� "Devam�n� Oku" butonu bulunamad�');
    }
}

/**
 * Popup eventlerini ayarlar
 */
function snk_popupHandler_setupEvents() {
    console.log('Popup olaylar� ayarlan�yor');

    // Kapat butonuna t�klama olay�
    if (snk_popupHandler_closeBtn) {
        snk_popupHandler_closeBtn.addEventListener('click', snk_popupHandler_closePopup);
    }

    // Overlay'e t�klama olay� (popup d���na t�klan�nca kapanmas� i�in)
    if (snk_popupHandler_overlay) {
        snk_popupHandler_overlay.addEventListener('click', function (e) {
            // Sadece do�rudan overlay'e t�klan�rsa kapat (i�eri�e t�klamay� engelle)
            if (e.target === snk_popupHandler_overlay) {
                snk_popupHandler_closePopup();
            }
        });
    }

    // Esc tu�una basma olay�
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            snk_popupHandler_closePopup();
        }
    });

    // Oturum A�ma butonuna t�klama olay�
    const loginBtn = document.getElementById('snk_login_btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', snk_popupHandler_showLoginForm);
    }

    // Kaydol butonuna t�klama olay�
    const registerBtn = document.getElementById('snk_register_btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', snk_popupHandler_showRegisterForm);
    }
}

/**
 * Oturum a�ma formunu g�sterir
 */
function snk_popupHandler_showLoginForm() {
    console.log('Oturum a�ma formu g�steriliyor');

    const loginFormContent = `
        <div class="snk-login-form-container">
            <form id="snk_login_form" class="snk-auth-form">
                <div class="snk-form-group">
                    <label for="snk_login_email">E-posta</label>
                    <input type="email" id="snk_login_email" class="snk-form-input" placeholder="E-posta adresiniz" required>
                </div>
                
                <div class="snk-form-group">
                    <label for="snk_login_password">�ifre</label>
                    <div class="snk-password-container">
                        <input type="password" id="snk_login_password" class="snk-form-input" placeholder="�ifreniz" required>
                        <button type="button" class="snk-password-toggle" id="snk_login_toggle_password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="snk-auth-submit">Oturum A�</button>
                <div id="snk_login_message" class="snk-form-message" style="display: none;"></div> 
                <div class="snk-auth-toggle">
                    Hesab�n�z yok mu? <a href="#" id="snk_switch_to_register">Kaydolun</a>
                </div>
            </form>
        </div>
    `;

    // Popup'� a�
    snk_popupHandler_openPopup('Oturum A�', loginFormContent);

    // Form olaylar�n� ekle
    setTimeout(() => {
        const loginForm = document.getElementById('snk_login_form');
        const passwordToggle = document.getElementById('snk_login_toggle_password');
        const switchToRegister = document.getElementById('snk_switch_to_register');
        const messageDiv = document.getElementById('snk_login_message');

        // Mesaj g�sterme fonksiyonu
        function showMessage(message, isError = true) {
            messageDiv.textContent = message;
            messageDiv.style.display = 'block';
            messageDiv.className = 'snk-form-message ' + (isError ? 'snk-error-message' : 'snk-success-message');
        }

        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const email = document.getElementById('snk_login_email').value.trim();
                const password = document.getElementById('snk_login_password').value;

                // Kullan�c� veritaban�n� kontrol et
                const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    // Ba�ar�l� giri�
                    showMessage('Giri� ba�ar�l�. Y�nlendiriliyorsunuz...', false);

                    // Kullan�c� oturum durumunu g�ncelle
                    localStorage.setItem('snk_currentUser', JSON.stringify({
                        id: user.id,
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        isLoggedIn: true,
                        lastLogin: new Date().toISOString()
                    }));

                    // 2 saniye sonra popup'� kapat ve kullan�c� sayfas�na y�nlendir
                    setTimeout(() => {
                        snk_popupHandler_closePopup();
                        // Kullan�c� sayfas�na y�nlendir
                        window.location.href = 'userpage.html';
                    }, 2000);
                } else {
                    // Do�rulanmam�� e-posta kontrol�
                    const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
                    const pendingUser = pendingUsers.find(u => u.email === email);

                    if (pendingUser) {
                        showMessage('Hesab�n�z hen�z do�rulanmam��. L�tfen e-postan�z� kontrol ediniz.');
                    } else {
                        showMessage('Ge�ersiz e-posta veya �ifre.');
                    }
                }
            });
        }

        if (passwordToggle) {
            passwordToggle.addEventListener('click', function () {
                const passwordInput = document.getElementById('snk_login_password');
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // G�z ikonunu de�i�tir
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }

        // "Kaydolun" ba�lant�s� event listener'� - d�zeltildi
        console.log('switchToRegister elementi:', switchToRegister);
        if (switchToRegister) {
            // Event listener'� temizle ve yeniden ekle (olas� �ift ba�lant�lar� �nlemek i�in)
            switchToRegister.removeEventListener('click', handleSwitchToRegister);
            switchToRegister.addEventListener('click', handleSwitchToRegister);
        } else {
            console.error('"Kaydolun" ba�lant�s� bulunamad� (#snk_switch_to_register)');
            // Alternatif olarak document event delegation y�ntemini kullan
            document.addEventListener('click', function (e) {
                if (e.target && e.target.id === 'snk_switch_to_register') {
                    handleSwitchToRegister(e);
                }
            });
        }

        // Kay�t formuna ge�i� i�in i�leyici fonksiyon
        function handleSwitchToRegister(e) {
            console.log('Kay�t formuna ge�i� yap�l�yor');
            e.preventDefault();
            snk_popupHandler_showRegisterForm();
        }
    }, 200); // Zaman a��m�n� 200ms'ye ��kard�k, DOM elementlerinin y�klenmesi i�in daha fazla zaman
}

/**
 * Kaydolma formunu g�sterir
 */
function snk_popupHandler_showRegisterForm() {
    console.log('Kaydolma formu g�steriliyor');

    const registerFormContent = `
        <div class="snk-register-form-container">
            <form id="snk_register_form" class="snk-auth-form">
                <div class="snk-form-row">
                    <div class="snk-form-group">
                        <label for="snk_register_name">Ad</label>
                        <input type="text" id="snk_register_name" class="snk-form-input" placeholder="Ad�n�z" required>
                    </div>
                    
                    <div class="snk-form-group">
                        <label for="snk_register_surname">Soyad</label>
                        <input type="text" id="snk_register_surname" class="snk-form-input" placeholder="Soyad�n�z" required>
                    </div>
                </div>
                
                <div class="snk-form-group">
                    <label for="snk_register_email">E-posta</label>
                    <input type="email" id="snk_register_email" class="snk-form-input" placeholder="E-posta adresiniz (@isparta.edu.tr)" required>
                    <small class="snk-email-info">Sadece @isparta.edu.tr uzant�l� e-postalar kabul edilmektedir.</small>
                </div>
                
                <div class="snk-form-group">
                    <label for="snk_register_password">�ifre</label>
                    <div class="snk-password-container">
                        <input type="password" id="snk_register_password" class="snk-form-input" placeholder="�ifreniz" required>
                        <button type="button" class="snk-password-toggle" id="snk_register_toggle_password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="snk-form-group">
                    <label for="snk_register_password_confirm">�ifre (Tekrar)</label>
                    <div class="snk-password-container">
                        <input type="password" id="snk_register_password_confirm" class="snk-form-input" placeholder="�ifrenizi tekrar girin" required>
                    </div>
                </div>
                
                <div class="snk-terms-container">
                    <input type="checkbox" id="snk_terms_agreement" required>
                    <label for="snk_terms_agreement">
                        <a href="#" class="snk-terms-link">Kullan�m Ko�ullar�</a> ve 
                        <a href="#" class="snk-terms-link">Gizlilik Politikas�</a>'n� okudum ve kabul ediyorum.
                    </label>
                </div>
                
                <button type="submit" class="snk-auth-submit">Kaydol</button>
                
                <div id="snk_register_message" class="snk-form-message" style="display: none;"></div>
                <div class="snk-auth-toggle">
                    Zaten hesab�n�z var m�? <a href="#" id="snk_switch_to_login">Oturum A��n</a>
                </div>
            </form>
        </div>
    `;

    // Popup'� a�
    snk_popupHandler_openPopup('Kaydol', registerFormContent);

    // Form olaylar�n� ekle
    setTimeout(() => {
        const registerForm = document.getElementById('snk_register_form');
        const passwordToggle = document.getElementById('snk_register_toggle_password');
        const switchToLogin = document.getElementById('snk_switch_to_login');
        const emailInput = document.getElementById('snk_register_email');
        const messageDiv = document.getElementById('snk_register_message');

        // E-posta format� kontrol�
        function isValidEmail(email) {
            // ol2413615008@isparta.edu.tr format�nda e-postalar
            const regex = /^ol\d{10}@isparta\.edu\.tr$/;
            return regex.test(email);
        }

        // Hata mesaj�n� g�ster
        function showMessage(message, isError = true) {
            messageDiv.textContent = message;
            messageDiv.style.display = 'block';
            messageDiv.className = 'snk-form-message ' + (isError ? 'snk-error-message' : 'snk-success-message');
        }

        // E-posta do�rulama g�nderimi
        function sendVerificationEmail(name, surname, email, password) {
            // Normalde burada API'ye istek at�l�r, �imdilik simulasyon yap�yoruz
            console.log(`Kullan�c� kayd� i�leniyor: ${email}`);

            // Demo ama�l� asenkron i�lem
            setTimeout(() => {
                showMessage(`Kay�t i�leminiz al�nm��t�r. Onay i�in bekleyiniz.`, false);

                // Kullan�c� bilgilerini local storage'a ge�ici olarak kaydet
                const userData = {
                    id: 'user_' + Date.now(),
                    name: name || '',
                    surname: surname || '',
                    email: email || '',
                    password: password || '',
                    isVerified: false,
                    pendingApproval: true,
                    createdAt: new Date().toISOString(),
                    registrationDate: new Date().toLocaleDateString('tr-TR')
                };

                // Kaydedilen kullan�c�lar� al veya bo� dizi ba�lat
                let pendingUsers = [];
                try {
                    pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
                    if (!Array.isArray(pendingUsers)) {
                        console.error('snk_pendingUsers bir dizi de�il, s�f�rlan�yor');
                        pendingUsers = [];
                    }
                } catch (error) {
                    console.error('snk_pendingUsers parse edilemedi:', error);
                    pendingUsers = [];
                }

                // Daha �nce bu e-posta ile kay�t var m� kontrol et
                const existingUserIndex = pendingUsers.findIndex(user => user.email === email);
                if (existingUserIndex !== -1) {
                    // Varsa g�ncelle
                    console.log(`${email} i�in mevcut kay�t g�ncelleniyor`);
                    pendingUsers[existingUserIndex] = userData;
                } else {
                    // Yoksa ekle
                    console.log(`${email} i�in yeni kay�t ekleniyor`);
                    pendingUsers.push(userData);
                }

                // Local storage'a kaydet
                try {
                    localStorage.setItem('snk_pendingUsers', JSON.stringify(pendingUsers));
                    console.log('Onay bekleyen kullan�c� kaydedildi:', userData);
                    console.log('Toplam bekleyen kullan�c� say�s�:', pendingUsers.length);
                } catch (error) {
                    console.error('Kullan�c� kaydedilemedi:', error);
                }

                // UI g�ncelle
                if (registerForm) {
                    registerForm.reset();
                }

                // Onay bekleme ekran�n� g�ster (e�er admin.html'deki fonksiyon varsa)
                if (typeof window.showPendingApproval === 'function') {
                    window.showPendingApproval();
                } else {
                    // Fonksiyon yoksa alternatif bir bildirim g�ster
                    alert('Kayd�n�z al�nm��t�r! Y�netici onay� bekleniyor.');
                }
            }, 1500);
        }

        if (registerForm) {
            registerForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const name = document.getElementById('snk_register_name').value.trim();
                const surname = document.getElementById('snk_register_surname').value.trim();
                const email = document.getElementById('snk_register_email').value.trim();
                const password = document.getElementById('snk_register_password').value;
                const passwordConfirm = document.getElementById('snk_register_password_confirm').value;

                // E-posta format� kontrol�
                if (!isValidEmail(email)) {
                    showMessage('Ge�ersiz e-posta format�. Sadece isparta.edu.tr uzant�l� e-postalar (�rn: ol2413615008@isparta.edu.tr) kabul edilmektedir.');
                    return;
                }

                // �ifre e�le�mesi kontrol�
                if (password !== passwordConfirm) {
                    showMessage('�ifreler e�le�miyor. L�tfen tekrar kontrol ediniz.');
                    return;
                }

                // �ifre uzunlu�u kontrol�
                if (password.length < 6) {
                    showMessage('�ifre en az 6 karakter uzunlu�unda olmal�d�r.');
                    return;
                }

                // Kay�tl� kullan�c�lar� kontrol et
                const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
                if (users.some(user => user.email === email)) {
                    showMessage('Bu e-posta adresi ile daha �nce kay�t yap�lm��.');
                    return;
                }

                // Do�rulama e-postas� g�nder
                sendVerificationEmail(name, surname, email, password);
            });
        }

        if (passwordToggle) {
            passwordToggle.addEventListener('click', function () {
                const passwordInput = document.getElementById('snk_register_password');
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // G�z ikonunu de�i�tir
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }

        // "Oturum A��n" ba�lant�s� event listener'� - d�zeltildi
        console.log('switchToLogin elementi:', switchToLogin);
        if (switchToLogin) {
            // Event listener'� temizle ve yeniden ekle (olas� �ift ba�lant�lar� �nlemek i�in)
            switchToLogin.removeEventListener('click', handleSwitchToLogin);
            switchToLogin.addEventListener('click', handleSwitchToLogin);
        } else {
            console.error('"Oturum A��n" ba�lant�s� bulunamad� (#snk_switch_to_login)');
            // Alternatif olarak document event delegation y�ntemini kullan
            document.addEventListener('click', function (e) {
                if (e.target && e.target.id === 'snk_switch_to_login') {
                    handleSwitchToLogin(e);
                }
            });
        }

        // Oturum a�ma formuna ge�i� i�in i�leyici fonksiyon
        function handleSwitchToLogin(e) {
            console.log('Oturum a�ma formuna ge�i� yap�l�yor');
            e.preventDefault();
            snk_popupHandler_showLoginForm();
        }

        // E-posta input alan� i�in canl� kontrol
        if (emailInput) {
            emailInput.addEventListener('blur', function () {
                const email = this.value.trim();
                if (email && !isValidEmail(email)) {
                    showMessage('Ge�ersiz e-posta format�. Sadece isparta.edu.tr uzant�l� e-postalar (�rn: ol2413615008@isparta.edu.tr) kabul edilmektedir.');
                } else {
                    messageDiv.style.display = 'none';
                }
            });
        }
    }, 200); // Zaman a��m�n� 200ms'ye ��kard�k, DOM elementlerinin y�klenmesi i�in daha fazla zaman
}

// Sayfa y�klendi�inde haz�rl�k
document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup Handler y�klendi');

    // Popup eventlerini kurulum
    snk_popupHandler_setupEvents();

    // "Devam�n� Oku" butonlar� i�in eventleri ekle
    snk_popupHandler_setupReadMoreButtons();

    // Kullan�m Ko�ullar� ve Gizlilik Politikas� ba�lant�lar� i�in click event'lerini ayarla
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('snk-terms-link')) {
            e.preventDefault();
            const linkText = e.target.textContent.trim();
            if (linkText === "Kullan�m Ko�ullar�") {
                snk_popupHandler_showTermsPopup();
            } else if (linkText === "Gizlilik Politikas�") {
                snk_popupHandler_showPrivacyPopup();
            }
        }
    });
});

/**
 * Kullan�m Ko�ullar� popup'�n� g�sterir
 */
function snk_popupHandler_showTermsPopup() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;

    const termsContent = `
        <div class="snk-terms-policy-container">
            <h2 class="snk-terms-policy-title">Kullan�m Ko�ullar�</h2>
            <p class="snk-terms-policy-date">Son G�ncelleme: ${formattedDate}</p>
            
            <div class="snk-terms-policy-section">
                <h3>1. Kabul Edilen Ko�ullar</h3>
                <p>Bu blog platformunu kullanarak a�a��daki ko�ullar� kabul etmi� say�l�rs�n�z. Kullan�m ko�ullar�n� kabul etmiyorsan�z, l�tfen platformu kullanmay�n.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>2. Hizmet Tan�m�</h3>
                <p>Bu platform, kullan�c�lar�n blog yaz�lar� olu�turmas� ve yay�nlamas� i�in tasarlanm��t�r. Platformun sunulan hizmetler konusunda herhangi bir garanti vermedi�ini ve de�i�ikli�e tabi olabilece�ini kabul edersiniz.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>3. Kullan�c� Y�k�ml�l�kleri</h3>
                <ul class="snk-terms-policy-list">
                    <li>Yasalara ve etik kurallara uygun i�erik yay�nlamak.</li>
                    <li>Di�er kullan�c�lar�n haklar�na sayg� g�stermek.</li>
                    <li>Platforma zarar verebilecek veya hizmetin s�reklili�ini riske atacak herhangi bir faaliyetten ka��nmak.</li>
                </ul>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>4. ��erik Sahipli�i</h3>
                <p>Platformda yay�nlad���n�z t�m i�eriklerin sorumlulu�u size aittir. Yay�nlad���n�z i�eri�in telif hakk� ve di�er yasal d�zenlemelere uygun oldu�unu taahh�t edersiniz.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>5. Hesap Kapatma ve Eri�im Engelleme</h3>
                <p>Platform, kullan�c�lar�n kurallara ayk�r� davranmas� durumunda hesaplar�n� ask�ya alma veya sonland�rma hakk�n� sakl� tutar.</p>
            </div>
            
            <div class="snk-terms-policy-back">
                <button id="snk_terms_back_button" class="snk-back-button">
                    <i class="fas fa-arrow-left"></i> Kay�t Formuna Geri D�n
                </button>
            </div>
        </div>
    `;

    snk_popupHandler_openPopup('Kullan�m Ko�ullar�', termsContent);

    // Geri d�n�� butonu event listener'� ekle
    setTimeout(() => {
        const backButton = document.getElementById('snk_terms_back_button');
        if (backButton) {
            backButton.addEventListener('click', function () {
                snk_popupHandler_showRegisterForm();
            });
        }
    }, 100);
}

/**
 * Gizlilik Politikas� popup'�n� g�sterir
 */
function snk_popupHandler_showPrivacyPopup() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;

    const privacyContent = `
        <div class="snk-terms-policy-container">
            <h2 class="snk-terms-policy-title">Gizlilik Politikas�</h2>
            <p class="snk-terms-policy-date">Son G�ncelleme: ${formattedDate}</p>
            
            <div class="snk-terms-policy-section">
                <h3>1. Toplanan Bilgiler</h3>
                <p>Platformu kullan�rken a�a��daki bilgiler toplanabilir:</p>
                <ul class="snk-terms-policy-list">
                    <li>Ad, e-posta adresi ve di�er hesap bilgileri.</li>
                    <li>Blog yaz�lar�, yorumlar ve di�er payla��lan i�erikler.</li>
                    <li>IP adresi, taray�c� bilgileri ve platform kullan�m verileri.</li>
                </ul>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>2. Bilgilerin Kullan�m�</h3>
                <p>Toplanan bilgiler, platformun daha iyi hizmet sunmas�, g�venli�in sa�lanmas� ve yasal y�k�ml�l�klerin yerine getirilmesi amac�yla kullan�labilir.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>3. �erezler ve Takip Teknolojileri</h3>
                <p>Platform, kullan�c� deneyimini iyile�tirmek i�in �erezler ve benzeri teknolojiler kullanabilir. Taray�c� ayarlar�n�z� de�i�tirerek �erezleri reddedebilirsiniz.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>4. Bilgilerin Payla��m�</h3>
                <p>Kullan�c� bilgileriniz, �zel durumlar d���nda (yasal zorunluluklar, hizmet sa�lay�c�larla payla��m vb.) ���nc� ki�ilerle payla��lmaz.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>5. G�venlik</h3>
                <p>Bilgilerinizin g�venli�ini sa�lamak i�in uygun teknik ve idari �nlemler al�nmaktad�r. Ancak internet �zerinden veri iletiminin tam g�venlik sa�lamayabilece�ini unutmay�n.</p>
            </div>
            
            <div class="snk-terms-policy-back">
                <button id="snk_privacy_back_button" class="snk-back-button">
                    <i class="fas fa-arrow-left"></i> Kay�t Formuna Geri D�n
                </button>
            </div>
        </div>
    `;

    snk_popupHandler_openPopup('Gizlilik Politikas�', privacyContent);

    // Geri d�n�� butonu event listener'� ekle
    setTimeout(() => {
        const backButton = document.getElementById('snk_privacy_back_button');
        if (backButton) {
            backButton.addEventListener('click', function () {
                snk_popupHandler_showRegisterForm();
            });
        }
    }, 100);
}

// Global alanda tan�mla
window.snk_popupHandler_openPopup = snk_popupHandler_openPopup;
window.snk_popupHandler_closePopup = snk_popupHandler_closePopup;
