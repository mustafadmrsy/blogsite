/**
 * Popup Handler - Senirkent Blog
 * Her fonksiyon öneki: snk_popupHandler_ (kod çakýþmalarýný önlemek için)
 */

// DOM elemanlarýný seç
const snk_popupHandler_overlay = document.getElementById('snk_popupOverlay');
const snk_popupHandler_container = document.querySelector('.snk-popup-container');
const snk_popupHandler_closeBtn = document.getElementById('snk_popupCloseBtn');
const snk_popupHandler_title = document.getElementById('snk_popupTitle');
const snk_popupHandler_content = document.getElementById('snk_popupContent');
const snk_popupHandler_readMoreBtns = document.querySelectorAll('.snk-read-more-btn');

/**
 * Popup'ý açar
 * @param {string} title - Popup baþlýðý
 * @param {string} content - Popup içeriði (HTML formatýnda)
 */
function snk_popupHandler_openPopup(title, content) {
    console.log('Popup açýlýyor:', title);

    // Popup içeriðini ayarla
    if (snk_popupHandler_title) {
        snk_popupHandler_title.textContent = title;
    }

    if (snk_popupHandler_content) {
        snk_popupHandler_content.innerHTML = content;
    }

    // Popup'ý görünür yap
    if (snk_popupHandler_overlay) {
        snk_popupHandler_overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Arka plan kaydýrmayý engelle
    }

    // Popup animasyonu için timeout kullan
    setTimeout(() => {
        if (snk_popupHandler_container) {
            snk_popupHandler_container.classList.add('active');
        }
    }, 10);
}

/**
 * Popup'ý kapatýr
 */
function snk_popupHandler_closePopup() {
    console.log('Popup kapatýlýyor');

    if (snk_popupHandler_container) {
        snk_popupHandler_container.classList.remove('active');
    }

    // Önce container animasyonunu tamamla, sonra overlay'i gizle
    setTimeout(() => {
        if (snk_popupHandler_overlay) {
            snk_popupHandler_overlay.classList.remove('active');
            document.body.style.overflow = ''; // Arka plan kaydýrmayý etkinleþtir
        }
    }, 300); // CSS geçiþ süresiyle eþleþmeli
}

/**
 * "Devamýný Oku" butonlarýna týklama olayý ekler
 */
function snk_popupHandler_setupReadMoreButtons() {
    console.log('Devamýný Oku butonlarý ayarlanýyor');

    const readMoreButtons = document.querySelectorAll('.snk-read-more-btn');
    if (readMoreButtons.length > 0) {
        readMoreButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault(); // Baðlantý davranýþýný engelle

                const postId = this.getAttribute('data-post-id');
                console.log('Post ID:', postId);

                if (postId) {
                    // popup.js içindeki fonksiyonu çaðýr
                    if (typeof snk_popup_fetchPostData === 'function') {
                        snk_popup_fetchPostData(postId);
                    } else {
                        console.error('snk_popup_fetchPostData fonksiyonu bulunamadý');
                    }
                } else {
                    console.error('Geçersiz post ID');
                }
            });
        });
    } else {
        console.warn('Hiç "Devamýný Oku" butonu bulunamadý');
    }
}

/**
 * Popup eventlerini ayarlar
 */
function snk_popupHandler_setupEvents() {
    console.log('Popup olaylarý ayarlanýyor');

    // Kapat butonuna týklama olayý
    if (snk_popupHandler_closeBtn) {
        snk_popupHandler_closeBtn.addEventListener('click', snk_popupHandler_closePopup);
    }

    // Overlay'e týklama olayý (popup dýþýna týklanýnca kapanmasý için)
    if (snk_popupHandler_overlay) {
        snk_popupHandler_overlay.addEventListener('click', function (e) {
            // Sadece doðrudan overlay'e týklanýrsa kapat (içeriðe týklamayý engelle)
            if (e.target === snk_popupHandler_overlay) {
                snk_popupHandler_closePopup();
            }
        });
    }

    // Esc tuþuna basma olayý
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            snk_popupHandler_closePopup();
        }
    });

    // Oturum Açma butonuna týklama olayý
    const loginBtn = document.getElementById('snk_login_btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', snk_popupHandler_showLoginForm);
    }

    // Kaydol butonuna týklama olayý
    const registerBtn = document.getElementById('snk_register_btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', snk_popupHandler_showRegisterForm);
    }
}

/**
 * Oturum açma formunu gösterir
 */
function snk_popupHandler_showLoginForm() {
    console.log('Oturum açma formu gösteriliyor');

    const loginFormContent = `
        <div class="snk-login-form-container">
            <form id="snk_login_form" class="snk-auth-form">
                <div class="snk-form-group">
                    <label for="snk_login_email">E-posta</label>
                    <input type="email" id="snk_login_email" class="snk-form-input" placeholder="E-posta adresiniz" required>
                </div>
                
                <div class="snk-form-group">
                    <label for="snk_login_password">Þifre</label>
                    <div class="snk-password-container">
                        <input type="password" id="snk_login_password" class="snk-form-input" placeholder="Þifreniz" required>
                        <button type="button" class="snk-password-toggle" id="snk_login_toggle_password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="snk-auth-submit">Oturum Aç</button>
                <div id="snk_login_message" class="snk-form-message" style="display: none;"></div> 
                <div class="snk-auth-toggle">
                    Hesabýnýz yok mu? <a href="#" id="snk_switch_to_register">Kaydolun</a>
                </div>
            </form>
        </div>
    `;

    // Popup'ý aç
    snk_popupHandler_openPopup('Oturum Aç', loginFormContent);

    // Form olaylarýný ekle
    setTimeout(() => {
        const loginForm = document.getElementById('snk_login_form');
        const passwordToggle = document.getElementById('snk_login_toggle_password');
        const switchToRegister = document.getElementById('snk_switch_to_register');
        const messageDiv = document.getElementById('snk_login_message');

        // Mesaj gösterme fonksiyonu
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

                // Kullanýcý veritabanýný kontrol et
                const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    // Baþarýlý giriþ
                    showMessage('Giriþ baþarýlý. Yönlendiriliyorsunuz...', false);

                    // Kullanýcý oturum durumunu güncelle
                    localStorage.setItem('snk_currentUser', JSON.stringify({
                        id: user.id,
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        isLoggedIn: true,
                        lastLogin: new Date().toISOString()
                    }));

                    // 2 saniye sonra popup'ý kapat ve kullanýcý sayfasýna yönlendir
                    setTimeout(() => {
                        snk_popupHandler_closePopup();
                        // Kullanýcý sayfasýna yönlendir
                        window.location.href = 'userpage.html';
                    }, 2000);
                } else {
                    // Doðrulanmamýþ e-posta kontrolü
                    const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
                    const pendingUser = pendingUsers.find(u => u.email === email);

                    if (pendingUser) {
                        showMessage('Hesabýnýz henüz doðrulanmamýþ. Lütfen e-postanýzý kontrol ediniz.');
                    } else {
                        showMessage('Geçersiz e-posta veya þifre.');
                    }
                }
            });
        }

        if (passwordToggle) {
            passwordToggle.addEventListener('click', function () {
                const passwordInput = document.getElementById('snk_login_password');
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Göz ikonunu deðiþtir
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }

        // "Kaydolun" baðlantýsý event listener'ý - düzeltildi
        console.log('switchToRegister elementi:', switchToRegister);
        if (switchToRegister) {
            // Event listener'ý temizle ve yeniden ekle (olasý çift baðlantýlarý önlemek için)
            switchToRegister.removeEventListener('click', handleSwitchToRegister);
            switchToRegister.addEventListener('click', handleSwitchToRegister);
        } else {
            console.error('"Kaydolun" baðlantýsý bulunamadý (#snk_switch_to_register)');
            // Alternatif olarak document event delegation yöntemini kullan
            document.addEventListener('click', function (e) {
                if (e.target && e.target.id === 'snk_switch_to_register') {
                    handleSwitchToRegister(e);
                }
            });
        }

        // Kayýt formuna geçiþ için iþleyici fonksiyon
        function handleSwitchToRegister(e) {
            console.log('Kayýt formuna geçiþ yapýlýyor');
            e.preventDefault();
            snk_popupHandler_showRegisterForm();
        }
    }, 200); // Zaman aþýmýný 200ms'ye çýkardýk, DOM elementlerinin yüklenmesi için daha fazla zaman
}

/**
 * Kaydolma formunu gösterir
 */
function snk_popupHandler_showRegisterForm() {
    console.log('Kaydolma formu gösteriliyor');

    const registerFormContent = `
        <div class="snk-register-form-container">
            <form id="snk_register_form" class="snk-auth-form">
                <div class="snk-form-row">
                    <div class="snk-form-group">
                        <label for="snk_register_name">Ad</label>
                        <input type="text" id="snk_register_name" class="snk-form-input" placeholder="Adýnýz" required>
                    </div>
                    
                    <div class="snk-form-group">
                        <label for="snk_register_surname">Soyad</label>
                        <input type="text" id="snk_register_surname" class="snk-form-input" placeholder="Soyadýnýz" required>
                    </div>
                </div>
                
                <div class="snk-form-group">
                    <label for="snk_register_email">E-posta</label>
                    <input type="email" id="snk_register_email" class="snk-form-input" placeholder="E-posta adresiniz (@isparta.edu.tr)" required>
                    <small class="snk-email-info">Sadece @isparta.edu.tr uzantýlý e-postalar kabul edilmektedir.</small>
                </div>
                
                <div class="snk-form-group">
                    <label for="snk_register_password">Þifre</label>
                    <div class="snk-password-container">
                        <input type="password" id="snk_register_password" class="snk-form-input" placeholder="Þifreniz" required>
                        <button type="button" class="snk-password-toggle" id="snk_register_toggle_password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="snk-form-group">
                    <label for="snk_register_password_confirm">Þifre (Tekrar)</label>
                    <div class="snk-password-container">
                        <input type="password" id="snk_register_password_confirm" class="snk-form-input" placeholder="Þifrenizi tekrar girin" required>
                    </div>
                </div>
                
                <div class="snk-terms-container">
                    <input type="checkbox" id="snk_terms_agreement" required>
                    <label for="snk_terms_agreement">
                        <a href="#" class="snk-terms-link">Kullaným Koþullarý</a> ve 
                        <a href="#" class="snk-terms-link">Gizlilik Politikasý</a>'ný okudum ve kabul ediyorum.
                    </label>
                </div>
                
                <button type="submit" class="snk-auth-submit">Kaydol</button>
                
                <div id="snk_register_message" class="snk-form-message" style="display: none;"></div>
                <div class="snk-auth-toggle">
                    Zaten hesabýnýz var mý? <a href="#" id="snk_switch_to_login">Oturum Açýn</a>
                </div>
            </form>
        </div>
    `;

    // Popup'ý aç
    snk_popupHandler_openPopup('Kaydol', registerFormContent);

    // Form olaylarýný ekle
    setTimeout(() => {
        const registerForm = document.getElementById('snk_register_form');
        const passwordToggle = document.getElementById('snk_register_toggle_password');
        const switchToLogin = document.getElementById('snk_switch_to_login');
        const emailInput = document.getElementById('snk_register_email');
        const messageDiv = document.getElementById('snk_register_message');

        // E-posta formatý kontrolü
        function isValidEmail(email) {
            // ol2413615008@isparta.edu.tr formatýnda e-postalar
            const regex = /^ol\d{10}@isparta\.edu\.tr$/;
            return regex.test(email);
        }

        // Hata mesajýný göster
        function showMessage(message, isError = true) {
            messageDiv.textContent = message;
            messageDiv.style.display = 'block';
            messageDiv.className = 'snk-form-message ' + (isError ? 'snk-error-message' : 'snk-success-message');
        }

        // E-posta doðrulama gönderimi
        function sendVerificationEmail(name, surname, email, password) {
            // Normalde burada API'ye istek atýlýr, þimdilik simulasyon yapýyoruz
            console.log(`Kullanýcý kaydý iþleniyor: ${email}`);

            // Demo amaçlý asenkron iþlem
            setTimeout(() => {
                showMessage(`Kayýt iþleminiz alýnmýþtýr. Onay için bekleyiniz.`, false);

                // Kullanýcý bilgilerini local storage'a geçici olarak kaydet
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

                // Kaydedilen kullanýcýlarý al veya boþ dizi baþlat
                let pendingUsers = [];
                try {
                    pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
                    if (!Array.isArray(pendingUsers)) {
                        console.error('snk_pendingUsers bir dizi deðil, sýfýrlanýyor');
                        pendingUsers = [];
                    }
                } catch (error) {
                    console.error('snk_pendingUsers parse edilemedi:', error);
                    pendingUsers = [];
                }

                // Daha önce bu e-posta ile kayýt var mý kontrol et
                const existingUserIndex = pendingUsers.findIndex(user => user.email === email);
                if (existingUserIndex !== -1) {
                    // Varsa güncelle
                    console.log(`${email} için mevcut kayýt güncelleniyor`);
                    pendingUsers[existingUserIndex] = userData;
                } else {
                    // Yoksa ekle
                    console.log(`${email} için yeni kayýt ekleniyor`);
                    pendingUsers.push(userData);
                }

                // Local storage'a kaydet
                try {
                    localStorage.setItem('snk_pendingUsers', JSON.stringify(pendingUsers));
                    console.log('Onay bekleyen kullanýcý kaydedildi:', userData);
                    console.log('Toplam bekleyen kullanýcý sayýsý:', pendingUsers.length);
                } catch (error) {
                    console.error('Kullanýcý kaydedilemedi:', error);
                }

                // UI güncelle
                if (registerForm) {
                    registerForm.reset();
                }

                // Onay bekleme ekranýný göster (eðer admin.html'deki fonksiyon varsa)
                if (typeof window.showPendingApproval === 'function') {
                    window.showPendingApproval();
                } else {
                    // Fonksiyon yoksa alternatif bir bildirim göster
                    alert('Kaydýnýz alýnmýþtýr! Yönetici onayý bekleniyor.');
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

                // E-posta formatý kontrolü
                if (!isValidEmail(email)) {
                    showMessage('Geçersiz e-posta formatý. Sadece isparta.edu.tr uzantýlý e-postalar (örn: ol2413615008@isparta.edu.tr) kabul edilmektedir.');
                    return;
                }

                // Þifre eþleþmesi kontrolü
                if (password !== passwordConfirm) {
                    showMessage('Þifreler eþleþmiyor. Lütfen tekrar kontrol ediniz.');
                    return;
                }

                // Þifre uzunluðu kontrolü
                if (password.length < 6) {
                    showMessage('Þifre en az 6 karakter uzunluðunda olmalýdýr.');
                    return;
                }

                // Kayýtlý kullanýcýlarý kontrol et
                const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
                if (users.some(user => user.email === email)) {
                    showMessage('Bu e-posta adresi ile daha önce kayýt yapýlmýþ.');
                    return;
                }

                // Doðrulama e-postasý gönder
                sendVerificationEmail(name, surname, email, password);
            });
        }

        if (passwordToggle) {
            passwordToggle.addEventListener('click', function () {
                const passwordInput = document.getElementById('snk_register_password');
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);

                // Göz ikonunu deðiþtir
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }

        // "Oturum Açýn" baðlantýsý event listener'ý - düzeltildi
        console.log('switchToLogin elementi:', switchToLogin);
        if (switchToLogin) {
            // Event listener'ý temizle ve yeniden ekle (olasý çift baðlantýlarý önlemek için)
            switchToLogin.removeEventListener('click', handleSwitchToLogin);
            switchToLogin.addEventListener('click', handleSwitchToLogin);
        } else {
            console.error('"Oturum Açýn" baðlantýsý bulunamadý (#snk_switch_to_login)');
            // Alternatif olarak document event delegation yöntemini kullan
            document.addEventListener('click', function (e) {
                if (e.target && e.target.id === 'snk_switch_to_login') {
                    handleSwitchToLogin(e);
                }
            });
        }

        // Oturum açma formuna geçiþ için iþleyici fonksiyon
        function handleSwitchToLogin(e) {
            console.log('Oturum açma formuna geçiþ yapýlýyor');
            e.preventDefault();
            snk_popupHandler_showLoginForm();
        }

        // E-posta input alaný için canlý kontrol
        if (emailInput) {
            emailInput.addEventListener('blur', function () {
                const email = this.value.trim();
                if (email && !isValidEmail(email)) {
                    showMessage('Geçersiz e-posta formatý. Sadece isparta.edu.tr uzantýlý e-postalar (örn: ol2413615008@isparta.edu.tr) kabul edilmektedir.');
                } else {
                    messageDiv.style.display = 'none';
                }
            });
        }
    }, 200); // Zaman aþýmýný 200ms'ye çýkardýk, DOM elementlerinin yüklenmesi için daha fazla zaman
}

// Sayfa yüklendiðinde hazýrlýk
document.addEventListener('DOMContentLoaded', () => {
    console.log('Popup Handler yüklendi');

    // Popup eventlerini kurulum
    snk_popupHandler_setupEvents();

    // "Devamýný Oku" butonlarý için eventleri ekle
    snk_popupHandler_setupReadMoreButtons();

    // Kullaným Koþullarý ve Gizlilik Politikasý baðlantýlarý için click event'lerini ayarla
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('snk-terms-link')) {
            e.preventDefault();
            const linkText = e.target.textContent.trim();
            if (linkText === "Kullaným Koþullarý") {
                snk_popupHandler_showTermsPopup();
            } else if (linkText === "Gizlilik Politikasý") {
                snk_popupHandler_showPrivacyPopup();
            }
        }
    });
});

/**
 * Kullaným Koþullarý popup'ýný gösterir
 */
function snk_popupHandler_showTermsPopup() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;

    const termsContent = `
        <div class="snk-terms-policy-container">
            <h2 class="snk-terms-policy-title">Kullaným Koþullarý</h2>
            <p class="snk-terms-policy-date">Son Güncelleme: ${formattedDate}</p>
            
            <div class="snk-terms-policy-section">
                <h3>1. Kabul Edilen Koþullar</h3>
                <p>Bu blog platformunu kullanarak aþaðýdaki koþullarý kabul etmiþ sayýlýrsýnýz. Kullaným koþullarýný kabul etmiyorsanýz, lütfen platformu kullanmayýn.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>2. Hizmet Tanýmý</h3>
                <p>Bu platform, kullanýcýlarýn blog yazýlarý oluþturmasý ve yayýnlamasý için tasarlanmýþtýr. Platformun sunulan hizmetler konusunda herhangi bir garanti vermediðini ve deðiþikliðe tabi olabileceðini kabul edersiniz.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>3. Kullanýcý Yükümlülükleri</h3>
                <ul class="snk-terms-policy-list">
                    <li>Yasalara ve etik kurallara uygun içerik yayýnlamak.</li>
                    <li>Diðer kullanýcýlarýn haklarýna saygý göstermek.</li>
                    <li>Platforma zarar verebilecek veya hizmetin sürekliliðini riske atacak herhangi bir faaliyetten kaçýnmak.</li>
                </ul>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>4. Ýçerik Sahipliði</h3>
                <p>Platformda yayýnladýðýnýz tüm içeriklerin sorumluluðu size aittir. Yayýnladýðýnýz içeriðin telif hakký ve diðer yasal düzenlemelere uygun olduðunu taahhüt edersiniz.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>5. Hesap Kapatma ve Eriþim Engelleme</h3>
                <p>Platform, kullanýcýlarýn kurallara aykýrý davranmasý durumunda hesaplarýný askýya alma veya sonlandýrma hakkýný saklý tutar.</p>
            </div>
            
            <div class="snk-terms-policy-back">
                <button id="snk_terms_back_button" class="snk-back-button">
                    <i class="fas fa-arrow-left"></i> Kayýt Formuna Geri Dön
                </button>
            </div>
        </div>
    `;

    snk_popupHandler_openPopup('Kullaným Koþullarý', termsContent);

    // Geri dönüþ butonu event listener'ý ekle
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
 * Gizlilik Politikasý popup'ýný gösterir
 */
function snk_popupHandler_showPrivacyPopup() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;

    const privacyContent = `
        <div class="snk-terms-policy-container">
            <h2 class="snk-terms-policy-title">Gizlilik Politikasý</h2>
            <p class="snk-terms-policy-date">Son Güncelleme: ${formattedDate}</p>
            
            <div class="snk-terms-policy-section">
                <h3>1. Toplanan Bilgiler</h3>
                <p>Platformu kullanýrken aþaðýdaki bilgiler toplanabilir:</p>
                <ul class="snk-terms-policy-list">
                    <li>Ad, e-posta adresi ve diðer hesap bilgileri.</li>
                    <li>Blog yazýlarý, yorumlar ve diðer paylaþýlan içerikler.</li>
                    <li>IP adresi, tarayýcý bilgileri ve platform kullaným verileri.</li>
                </ul>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>2. Bilgilerin Kullanýmý</h3>
                <p>Toplanan bilgiler, platformun daha iyi hizmet sunmasý, güvenliðin saðlanmasý ve yasal yükümlülüklerin yerine getirilmesi amacýyla kullanýlabilir.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>3. Çerezler ve Takip Teknolojileri</h3>
                <p>Platform, kullanýcý deneyimini iyileþtirmek için çerezler ve benzeri teknolojiler kullanabilir. Tarayýcý ayarlarýnýzý deðiþtirerek çerezleri reddedebilirsiniz.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>4. Bilgilerin Paylaþýmý</h3>
                <p>Kullanýcý bilgileriniz, özel durumlar dýþýnda (yasal zorunluluklar, hizmet saðlayýcýlarla paylaþým vb.) üçüncü kiþilerle paylaþýlmaz.</p>
            </div>
            
            <div class="snk-terms-policy-section">
                <h3>5. Güvenlik</h3>
                <p>Bilgilerinizin güvenliðini saðlamak için uygun teknik ve idari önlemler alýnmaktadýr. Ancak internet üzerinden veri iletiminin tam güvenlik saðlamayabileceðini unutmayýn.</p>
            </div>
            
            <div class="snk-terms-policy-back">
                <button id="snk_privacy_back_button" class="snk-back-button">
                    <i class="fas fa-arrow-left"></i> Kayýt Formuna Geri Dön
                </button>
            </div>
        </div>
    `;

    snk_popupHandler_openPopup('Gizlilik Politikasý', privacyContent);

    // Geri dönüþ butonu event listener'ý ekle
    setTimeout(() => {
        const backButton = document.getElementById('snk_privacy_back_button');
        if (backButton) {
            backButton.addEventListener('click', function () {
                snk_popupHandler_showRegisterForm();
            });
        }
    }, 100);
}

// Global alanda tanýmla
window.snk_popupHandler_openPopup = snk_popupHandler_openPopup;
window.snk_popupHandler_closePopup = snk_popupHandler_closePopup;
