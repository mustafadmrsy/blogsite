<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senirkent Blog</title>
    <link rel="stylesheet" href="style/aboutus.css" />
    <link rel="stylesheet" href="style/categories.css" />
    <link rel="stylesheet" href="style/contact.css" />
    <link rel="stylesheet" href="style/main.css" />
    <link rel="stylesheet" href="style/userpage.css" />
    <link rel="stylesheet" href="style/sidebar.css" />
    <link rel="stylesheet" href="style/indexspesific.css" />
    <link rel="stylesheet" href="style/blogcard.css" />
    <link rel="stylesheet" href="style/blogdetails.css" />
    <link rel="stylesheet" href="style/blogpopup.css" />
    <link rel="stylesheet" href="style/commentsystem.css" />
    <link rel="stylesheet" href="style/formfixes.css" />
    <link rel="stylesheet" href="style/notification.css" />
    <link rel="stylesheet" href="style/terms-policy.css" />
    <script src="../components/login-handler.js" defer></script>
    <script src="../components/password-toggle.js" defer></script>
    <style>
        .snk-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--color-primary, #007bff);
            color: #fff;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease-out forwards;
            max-width: 400px;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .notification-close {
            position: absolute;
            top: 5px;
            right: 8px;
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }
        
        body.eren-dark-theme .snk-notification {
            background-color: #2c3e50;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
    </style>

</head>
<body>
    <script src="components/admin-auth.js"></script>
    <script src="components/admin-posts.js"></script>
    <script src="components/admin-users.js"></script>
    <script src="components/auth-handler.js"></script>
    <script src="components/blod-detail.js"></script>
    <script src="components/categories.js"></script>
    <script src="components/comment-system.js"></script>
    <script src="components/contact.js"></script>
    <script src="components/dom-utils.js"></script>
    <script src="components/login-handler.js"></script>
    <script src="components/main.js"></script>
    <script src="components/password-toggle.js"></script>
    <script src="components/popup-handler.js"></script>
    <script src="components/popup.js"></script>
    <script src="components/profile-dropdown.js"></script>
    <script src="components/profile-editor.js"></script>
    <script src="components/sidebar.js"></script>
    <script src="components/userpage.js"></script>
    <script src="components/verification.js"></script>
    <!-- Bildirim alan� - JavaScript ile dinamik olu�turulacak -->
    <div id="notificationArea"></div>
    
    <div class="snk-container">
        <!-- Header -->
        <header class="snk-header">
            <!-- Logo Alan� -->
            <div class="snk-header-logo">
                <img src="../public/img/logo.png" alt="Senirkent Blog" class="snk-logo-img">
                <h1 class="snk-site-title">Senirkent Blog</h1>
            </div>
            
            <!-- Arama Alan� -->
            <div class="snk-header-search">
                <div class="snk-search-icon">
                    <i class="fas fa-search"></i>
                </div>
                <input type="text" class="snk-search-input" placeholder="Blog'da ara...">
            </div>
            
            <!-- Butonlar ve Profil -->
            <div class="snk-header-actions">
                <!-- Profil Dropdown Men�s� -->
                <div class="snk-user-profile-dropdown">
                    <button id="profileDropdownBtn" class="snk-profile-dropdown-btn">
                        <i class="fas fa-user"></i> Profilim
                    </button>
                    <div id="profileDropdownMenu" class="snk-profile-dropdown-menu">
                        <div class="snk-profile-header">
                            <img src="../public/images/profile.png" alt="Profil" class="snk-menu-profile-img">
                            <div class="snk-profile-info">
                                <h4 class="snk-user-name">Mustafa Demirsoy</h4>
                                <p class="snk-user-handle">@mustafademirsoy</p>
                            </div>
                        </div>
                        <ul class="snk-profile-menu-list">
                            <li><a href="userpage.html"><i class="fas fa-user-circle"></i> Profili G�r�nt�le</a></li>
                            <li class="snk-toggle-item">
                                <span><i class="fas fa-moon"></i> Karanl�k Mod</span>
                                <label class="snk-toggle-switch">
                                    <input type="checkbox" id="darkModeToggle" checked>
                                    <span class="snk-toggle-slider"></span>
                                </label>
                            </li>
                            <li class="snk-divider"></li>
                            <li><a href="#" class="snk-logout"><i class="fas fa-sign-out-alt"></i> ��k�� Yap</a></li>
                            <li><a href="#"><i class="fas fa-cog"></i> Ayarlar</a></li>
                        </ul>
                    </div>
                </div>

                <button class="snk-header-btn snk-login-btn" id="snk_login_btn">
                    <i class="fas fa-sign-in-alt"></i>
                    Oturum A�
                </button>
                <button class="snk-header-btn snk-register-btn" id="snk_register_btn">
                    <i class="fas fa-user-plus"></i>
                    Kaydol
                </button>
                <button class="snk-header-btn snk-create-btn" id="snk_create_btn">
                    <i class="fas fa-plus"></i>
                    Olu�tur
                </button>
            </div>
        </header>

        <div class="snk-content-wrapper">
            <!-- Sidebar -->
            <div class="snk-sidebar">
                <!-- Sidebar Header ve Toggle Butonu -->
                <div class="snk-sidebar-header">
                    <h3 class="snk-sidebar-title">Men�</h3>
                    <!-- Sidebar Toggle Button -->
                    <button class="snk-sidebar-toggle" id="sidebarToggle">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                </div>
                
                <!-- Ana Navigasyon -->
                <div class="snk-sidebar-section">
                    <a href="main.aspx" class="snk-sidebar-item active">
                        <i class="fas fa-home"></i>
                        <span class="snk-sidebar-text">Ana Sayfa</span>
                    </a>
                    <a href="categories.aspx" class="snk-sidebar-item">
                        <i class="fas fa-th-large"></i>
                        <span class="snk-sidebar-text">Kategoriler</span>
                    </a>
                </div>
                
                <!-- �zel Beslemeler -->
                <div class="snk-sidebar-section">
                    <h3 class="snk-sidebar-heading">�ZEL BESLEMELER</h3>
                    <a href="#" class="snk-sidebar-item">
                        <i class="fas fa-star"></i>
                        <span class="snk-sidebar-text">Favoriler</span>
                    </a>
                    <a href="#" class="snk-sidebar-item">
                        <i class="fas fa-history"></i>
                        <span class="snk-sidebar-text">Ge�mi�</span>
                    </a>
                </div>               
                <!-- Kaynaklar -->
                <div class="snk-sidebar-section">
                    <h3 class="snk-sidebar-heading">KAYNAKLAR</h3>
                    <a href="Aboutus.aspx" class="snk-sidebar-item">
                        <i class="fas fa-info-circle"></i>
                        <span class="snk-sidebar-text">Hakk�m�zda</span>
                    </a>
                    <a href="contact.aspx" class="snk-sidebar-item">
                        <i class="fas fa-envelope"></i>
                        <span class="snk-sidebar-text">�leti�im</span>
                    </a>
                </div>
            </div>
            
            <!-- Ana ��erik -->
            <main class="snk-main-content">
                <div class="snk-content-layout">
                    <div class="snk-contact-container">
                        <div class="snk-contact-header">
                            <h2 class="snk-content-title">Bizimle �leti�ime Ge�in</h2>
                            <p class="snk-contact-subtitle">Sorular�n�z, �nerileriniz veya i�birli�i talepleriniz i�in a�a��daki ileti�im formunu kullanabilirsiniz.</p>
                        </div>
                        
                        <div class="snk-contact-content">
                            <!-- Sol taraf - �leti�im Formu -->
                            <div class="snk-contact-form-container">
                                <h3 class="snk-contact-section-title"><i class="fas fa-paper-plane"></i> �leti�im Formu</h3>
                                <form class="snk-contact-form" id="contactForm" action="mailto:senirkentblog@outlook.com.tr" method="post" enctype="text/plain">
                                    <div class="snk-form-group">
                                        <label for="name"><i class="fas fa-user"></i> Ad�n�z Soyad�n�z</label>
                                        <input type="text" id="name" name="name" class="snk-form-input" placeholder="Ad�n�z ve soyad�n�z" required>
                                    </div>
                                    <div class="snk-form-group">
                                        <label for="email"><i class="fas fa-envelope"></i> E-posta Adresiniz</label>
                                        <input type="email" id="email" name="email" class="snk-form-input" placeholder="E-posta adresiniz" required>
                                    </div>
                                    <div class="snk-form-group">
                                        <label for="subject"><i class="fas fa-heading"></i> Konu</label>
                                        <input type="text" id="subject" name="subject" class="snk-form-input" placeholder="Mesaj�n�z�n konusu" required>
                                    </div>
                                    <div class="snk-form-group">
                                        <label for="message"><i class="fas fa-comment-alt"></i> Mesaj�n�z</label>
                                        <textarea id="message" name="message" class="snk-form-textarea" placeholder="Mesaj�n�z� buraya yaz�n..." rows="5" required></textarea>
                                    </div>
                                    <button type="submit" class="snk-contact-submit-btn">
                                        <i class="fas fa-paper-plane"></i> Mesaj� G�nder
                                    </button>
                                </form>
                            </div>
                            
                            <!-- Sa� taraf - �leti�im Bilgileri -->
                            <div class="snk-contact-info-container">
                                <h3 class="snk-contact-section-title"><i class="fas fa-info-circle"></i> �leti�im Bilgilerimiz</h3>
                                <div class="snk-contact-info">
                                    <div class="snk-contact-info-item">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <div>
                                            <h4>Adres</h4>
                                            <p>Senirkent Meslek Y�ksekokulu, Isparta, T�rkiye</p>
                                        </div>
                                    </div>
                                    <div class="snk-contact-info-item">
                                        <i class="fas fa-phone-alt"></i>
                                        <div>
                                            <h4>Telefon</h4>
                                            <p>+90 543 947 22 19</p>
                                        </div>
                                    </div>
                                    <div class="snk-contact-info-item">
                                        <i class="fas fa-envelope"></i>
                                        <div>
                                            <h4>E-posta</h4>
                                            <p>senirkentblog@outlook.com</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="snk-social-media">
                                    <h3 class="snk-contact-section-title"><i class="fas fa-share-alt"></i> Sosyal Medya</h3>
                                    <div class="snk-social-icons">
                                        <a href="#" class="snk-social-icon"><i class="fab fa-twitter"></i></a>
                                        <a href="https://www.instagram.com/senirkentblog/" class="snk-social-icon" target="_blank"><i class="fab fa-instagram"></i></a>
                                        <a href="https://www.linkedin.com/company/senirkent-blog/about/" class="snk-social-icon" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Harita B�l�m� -->
                        <div class="snk-map-container">
                            <h3 class="snk-contact-section-title"><i class="fas fa-map"></i> Konum</h3>
                            <div class="snk-map">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3158.5796663094287!2d30.55394251089855!3d38.105546671482695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c5b975752bc8c7%3A0x41b61d56e9071f3e!2sSenirkent%20Meslek%20Y%C3%BCksekokulu!5e0!3m2!1str!2str!4v1646498567123!5m2!1str!2str" 
                                    width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Popup Container -->
    <div class="snk-popup-overlay" id="snk_popupOverlay">
        <div class="snk-popup-container">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title" id="snk_popupTitle"></h2>
                <button class="snk-popup-close-btn" id="snk_popupCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-popup-content" id="snk_popupContent">
                <!-- Popup i�eri�i JavaScript ile y�klenir -->
            </div>
        </div>
    </div>

    <!-- Login Popup -->
    <div class="snk-popup-overlay" id="snk_loginPopup">
        <div class="snk-popup-container auth-popup">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">Giri� Yap</h2>
                <button class="snk-popup-close-btn" id="snk_loginCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-popup-content" id="snk_popupContent">
                <div class="snk-login-form-container">
                    <form id="loginForm" class="snk-auth-form">
                        <div class="snk-form-group">
                            <label for="loginEmail">E-posta</label>
                            <input type="email" id="loginEmail" name="email" class="snk-form-input" placeholder="ol2413615XXX@isparta.edu.tr" required>
                        </div>
                        <div class="snk-form-group">
                            <label for="loginPassword">�ifre</label>
                            <div class="snk-password-container">
                                <input type="password" id="loginPassword" name="password" class="snk-form-input" placeholder="�ifreniz" required>
                                <button type="button" class="snk-password-toggle" id="snk_login_toggle_password">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="snk-form-options">
                            <div class="snk-remember-me">
                                <input type="checkbox" id="snk_remember_me">
                                <label for="snk_remember_me">Beni hat�rla</label>
                            </div>
                            <a href="#" class="snk-forgot-password">�ifremi unuttum</a>
                        </div>
                        <button type="submit" class="snk-auth-submit">Oturum A�</button>
                        <div id="loginAlertBox" class="snk-form-message" style="display: none;"></div>
                        <div class="snk-auth-toggle">
                            Hesab�n�z yok mu? <a href="#" id="showRegisterPopup">Kaydolun</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Register Popup -->
    <div class="snk-popup-overlay" id="snk_registerPopup">
        <div class="snk-popup-container auth-popup">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">Kay�t Ol</h2>
                <button class="snk-popup-close-btn" id="snk_registerCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-popup-content">
                <div id="registerAlertBox" class="auth-alert"></div>
                <form id="registerForm" class="snk-auth-form">
                    <div class="snk-form-group">
                        <label for="registerName">Ad</label>
                        <input type="text" id="registerName" name="name" class="snk-form-input" required>
                    </div>
                    <div class="snk-form-group">
                        <label for="registerSurname">Soyad</label>
                        <input type="text" id="registerSurname" name="surname" class="snk-form-input" required>
                    </div>
                    <div class="snk-form-group">
                        <label for="registerEmail">��renci E-posta</label>
                        <input type="email" id="registerEmail" name="email" class="snk-form-input" placeholder="ol2413615XXX@isparta.edu.tr" required>
                    </div>
                    <div class="snk-form-group">
                        <label for="registerPassword">�ifre</label>
                        <div class="snk-password-container">
                            <input type="password" id="registerPassword" name="password" class="snk-form-input" required>
                            <button type="button" class="snk-password-toggle" id="snk_register_toggle_password">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <button type="submit" class="snk-auth-submit">Kay�t Ol</button>
                </form>
                <div class="snk-auth-toggle">
                    Hesab�n�z var m�? <a href="#" id="showLoginPopup">Giri� Yap</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Verification Popup -->
    <div class="snk-popup-overlay" id="snk_verificationPopup">
        <div class="snk-popup-container auth-popup">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">E-posta Do�rulama</h2>
                <button class="snk-popup-close-btn" id="snk_verificationCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-popup-content">
                <div id="verificationAlertBox" class="auth-alert"></div>
                <p class="verification-info">Hesab�n�z� aktifle�tirmek i�in size verilen do�rulama kodunu giriniz.</p>
                <form id="verificationForm" class="auth-form">
                    <div class="form-group">
                        <label for="verificationCode">Do�rulama Kodu</label>
                        <input type="text" id="verificationCode" name="verificationCode" required>
                        <input type="hidden" id="verificationEmail" name="email">
                    </div>
                    <button type="submit" class="auth-button">Do�rula</button>
                </form>
                <div class="auth-links">
                    <p><a href="#" id="resendVerificationCode">Yeni kod g�nder</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobil Men� Butonu -->
    <button class="snk-mobile-menu-btn" id="mobileSidebarToggle">
        <i class="fas fa-bars"></i>
    </button>

    <!-- JavaScript dosyalar� -->
    <script src="../components/dom-utils.js"></script>
    <script src="../components/sidebar.js"></script>
    <script src="../components/popup.js"></script>
    <script src="../components/popup-handler.js"></script>
    <script src="../components/verification.js"></script>
    <script src="../components/auth-handlers.js"></script>
    <script src="../components/profile-dropdown.js"></script>
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <script src="../components/login-handler.js"></script>
    <script src="../components/comment-system.js"></script>
    <script src="../components/main.js"></script>
    <script src="../darkjs/darkmode.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // LocalStorage'dan bildirim mesaj�n� kontrol et
            const notification = localStorage.getItem('snk_notification');
            if (notification) {
                // Bildirim div'ini olu�tur
                const notificationDiv = document.createElement('div');
                notificationDiv.className = 'snk-notification';
                notificationDiv.innerHTML = `
                    ${notification}
                    <button class="notification-close">&times;</button>
                `;
                
                // Bildirim alan�na ekle
                document.getElementById('notificationArea').appendChild(notificationDiv);
                
                // Bildirim kapatma butonu i�levi
                const closeButton = notificationDiv.querySelector('.notification-close');
                if (closeButton) {
                    closeButton.addEventListener('click', function() {
                        notificationDiv.remove();
                        localStorage.removeItem('snk_notification');
                    });
                }
                
                // 10 saniye sonra otomatik kapat
                setTimeout(() => {
                    if (notificationDiv.parentNode) {
                        notificationDiv.remove();
                        localStorage.removeItem('snk_notification');
                    }
                }, 10000);
            }
            
            // Dark mode durumunu kontrol et ve ayarla
            const isDarkMode = localStorage.getItem('eren-theme') === 'dark';
            if (isDarkMode) {
                document.body.classList.add('eren-dark-theme');
            }
            
            // �ifre g�sterme/gizleme i�levi i�in �zel kod
            function setupPasswordToggles() {
                console.log("�ifre toggle butonlar� ayarlan�yor (ileti�im sayfas�)");
                
                // Login i�in �ifre g�ster/gizle 
                const loginToggle = document.getElementById('snk_login_toggle_password');
                if (loginToggle) {
                    const loginPassword = document.getElementById('loginPassword');
                    if (loginPassword) {
                        loginToggle.addEventListener('click', function(e) {
                            e.preventDefault();
                            const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                            loginPassword.setAttribute('type', type);
                            const icon = loginToggle.querySelector('i');
                            if (icon) {
                                icon.classList.toggle('fa-eye');
                                icon.classList.toggle('fa-eye-slash');
                            }
                        });
                    }
                }
                
                // Register i�in �ifre g�ster/gizle
                const registerToggle = document.getElementById('snk_register_toggle_password');
                if (registerToggle) {
                    console.log("Register toggle butonu bulundu");
                    const registerPassword = document.getElementById('registerPassword');
                    if (registerPassword) {
                        console.log("Register password input bulundu");
                        registerToggle.addEventListener('click', function(e) {
                            e.preventDefault();
                            console.log("Register toggle butonuna t�kland�");
                            const type = registerPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                            registerPassword.setAttribute('type', type);
                            console.log("�ifre tipi de�i�tirildi:", type);
                            const icon = registerToggle.querySelector('i');
                            if (icon) {
                                icon.classList.toggle('fa-eye');
                                icon.classList.toggle('fa-eye-slash');
                            }
                        });
                    } else {
                        console.warn("Register password input bulunamad�");
                    }
                } else {
                    console.warn("Register toggle butonu bulunamad�");
                }
            }
            
            // �lk y�klemede �ifre butonlar�n� ayarla
            setupPasswordToggles();
            
            // Popup a��ld���nda �ifre butonlar�n� tekrar ayarla
            const registerBtn = document.getElementById('snk_register_btn');
            if (registerBtn) {
                registerBtn.addEventListener('click', function() {
                    setTimeout(setupPasswordToggles, 300);
                });
            }
            
            const loginBtn = document.getElementById('snk_login_btn');
            if (loginBtn) {
                loginBtn.addEventListener('click', function() {
                    setTimeout(setupPasswordToggles, 300);
                });
            }
            
            // Kay�t formunda �ifre g�ster/gizle butonu i�in do�rudan olay dinleyici
            document.addEventListener('click', function(event) {
                if (event.target && event.target.id === 'snk_register_toggle_password') {
                    console.log("�ifre toggle butonu t�kland� (delegasyon ile)");
                    const registerPassword = document.getElementById('registerPassword');
                    if (registerPassword) {
                        const type = registerPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                        registerPassword.setAttribute('type', type);
                        const icon = event.target.querySelector('i') || event.target;
                        if (icon.classList) {
                            icon.classList.toggle('fa-eye');
                            icon.classList.toggle('fa-eye-slash');
                        }
                    }
                }
                // E�er ikon t�kland�ysa
                else if (event.target && event.target.parentElement && event.target.parentElement.id === 'snk_register_toggle_password') {
                    console.log("�ifre toggle ikonu t�kland�");
                    const registerPassword = document.getElementById('registerPassword');
                    if (registerPassword) {
                        const type = registerPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                        registerPassword.setAttribute('type', type);
                        const icon = event.target;
                        if (icon.classList) {
                            icon.classList.toggle('fa-eye');
                            icon.classList.toggle('fa-eye-slash');
                        }
                    }
                }
            });
            
        });
    </script>
</body>
</html>
