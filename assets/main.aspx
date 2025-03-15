<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senirkent Blog</title>
    <link rel="stylesheet" href="style/aboutus.css"/>
    <link rel="stylesheet" href="style/categories.css"/>
    <link rel="stylesheet" href="style/contact.css"/>
    <link rel="stylesheet" href="style/main.css"/>
    <link rel="stylesheet" href="style/userpage.css"/>
    <link rel="stylesheet" href="style/sidebar.css"/>
    <link rel="stylesheet" href="style/indexspesific.css"/>
    <link rel="stylesheet" href="style/blogcard.css"/>
    <link rel="stylesheet" href="style/blogdetails.css"/>
    <link rel="stylesheet" href="style/blogpopup.css"/>
    <link rel="stylesheet" href="style/commentsystem.css"/>
    <link rel="stylesheet" href="style/formfixes.css"/>
    <link rel="stylesheet" href="style/notification.css"/>
    <link rel="stylesheet" href="style/terms-policy.css"/>

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
                    <a href="#" class="snk-sidebar-item" id="snk_sidebarPopular">
                        <i class="fas fa-fire"></i>
                        <span class="snk-sidebar-text">Pop�ler</span>
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
                    <!-- Sol S�tun (Blog Yaz�lar�) -->
                    <div class="snk-content-main">
                        <div class="snk-content-header">
                            <h2 class="snk-content-title">En G�ncel Payla��mlar</h2>
                            <!-- Filtreleme butonlar� kald�r�ld� -->
                        </div>
                        
                        <!-- Son Blog Yaz�lar� -->
                        <div class="snk-recent-posts" id="snk_postsContainer">
                            <!-- Blog Yaz�lar� JavaScript ile y�klenir -->
                            <div class="snk-loading">
                                <i class="fas fa-spinner fa-spin"></i> Y�kleniyor...
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sa� S�tun (Kutucuklar i�in) -->
                    <div class="snk-content-sidebar" id="snk_contentSidebar">
                        <!-- En �ok Okunan Yaz�lar Kutucu�u -->
                        <div class="snk-sidebar-widget">
                            <div class="snk-sidebar-widget-header">
                                <h3 class="snk-sidebar-widget-title">Blog Yaz�lar�</h3>
                            </div>
                            <div class="snk-sidebar-widget-content">
                                <div class="snk-popular-posts" id="snk_popularPosts">
                                    <!-- En pop�ler ve en yeni �zelli�i kald�r�ld� -->
                                    <div class="snk-no-posts">
                                        Filtreleme �zelli�i kald�r�ld�.
                                    </div>
                                </div>
                                <a href="categories.aspx" class="snk-more-link">T�m kategorileri g�r <i class="fas fa-angle-right"></i></a>
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
                <form id="registerForm" class="auth-form">
                    <div class="form-group">
                        <label for="registerName">Ad</label>
                        <input type="text" id="registerName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="registerSurname">Soyad</label>
                        <input type="text" id="registerSurname" name="surname" required>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">��renci E-posta</label>
                        <input type="email" id="registerEmail" name="email" placeholder="ol2413615XXX@isparta.edu.tr" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">�ifre</label>
                        <input type="password" id="registerPassword" name="password" required>
                    </div>
                    <button type="submit" class="auth-button">Kay�t Ol</button>
                </form>
                <div class="auth-links">
                    <p>Zaten bir hesab�n�z var m�? <a href="#" id="showLoginPopup">Giri� Yap</a></p>
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
    <script src="../components/main.js"></script>
    <script src="../components/popup.js"></script>
    <script src="../components/popup-handler.js"></script>
    <script src="../components/verification.js"></script>
    <script src="../components/auth-handlers.js"></script>
    <script src="../components/profile-dropdown.js"></script>
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <script src="../components/login-handler.js"></script>
    <script src="../components/comment-system.js"></script>
    <script src="../components/password-toggle.js" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // T�m sayfa i�eri�i y�klendikten sonra ana fonksiyonlar ba�lat�l�r
            snk_main_initializePage();

            // Sayfa t�klamalar�n�n bo�luk kontrol�
            document.addEventListener('click', function (e) {
                console.log('Sayfa t�kland�:', e.target);
            });
        });
    </script>
    <script src="components/main.js"
    <script src="components/sidebar.js"</script>
    <script src="components/popup.js"</script>
    <script src="components/comment-system.js"</script>
</body>