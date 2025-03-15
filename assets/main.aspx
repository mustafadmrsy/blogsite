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
            <!-- Logo Alaný -->
            <div class="snk-header-logo">
                <img src="../public/img/logo.png" alt="Senirkent Blog" class="snk-logo-img">
                <h1 class="snk-site-title">Senirkent Blog</h1>
            </div>
            
            <!-- Arama Alaný -->
            <div class="snk-header-search">
                <div class="snk-search-icon">
                    <i class="fas fa-search"></i>
                </div>
                <input type="text" class="snk-search-input" placeholder="Blog'da ara...">
            </div>
            
            <!-- Butonlar ve Profil -->
            <div class="snk-header-actions">
                <!-- Profil Dropdown Menüsü -->
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
                            <li><a href="userpage.html"><i class="fas fa-user-circle"></i> Profili Görüntüle</a></li>
                            <li class="snk-toggle-item">
                                <span><i class="fas fa-moon"></i> Karanlýk Mod</span>
                                <label class="snk-toggle-switch">
                                    <input type="checkbox" id="darkModeToggle" checked>
                                    <span class="snk-toggle-slider"></span>
                                </label>
                            </li>
                            <li class="snk-divider"></li>
                            <li><a href="#" class="snk-logout"><i class="fas fa-sign-out-alt"></i> Çýkýþ Yap</a></li>
                            <li><a href="#"><i class="fas fa-cog"></i> Ayarlar</a></li>
                        </ul>
                    </div>
                </div>

                <button class="snk-header-btn snk-login-btn" id="snk_login_btn">
                    <i class="fas fa-sign-in-alt"></i>
                    Oturum Aç
                </button>
                <button class="snk-header-btn snk-register-btn" id="snk_register_btn">
                    <i class="fas fa-user-plus"></i>
                    Kaydol
                </button>
                <button class="snk-header-btn snk-create-btn" id="snk_create_btn">
                    <i class="fas fa-plus"></i>
                    Oluþtur
                </button>
            </div>
        </header>

        <div class="snk-content-wrapper">
            <!-- Sidebar -->
            <div class="snk-sidebar">
                <!-- Sidebar Header ve Toggle Butonu -->
                <div class="snk-sidebar-header">
                    <h3 class="snk-sidebar-title">Menü</h3>
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
                        <span class="snk-sidebar-text">Popüler</span>
                    </a>
                    <a href="categories.aspx" class="snk-sidebar-item">
                        <i class="fas fa-th-large"></i>
                        <span class="snk-sidebar-text">Kategoriler</span>
                    </a>
                </div>
                <!-- Özel Beslemeler -->
                <div class="snk-sidebar-section">
                    <h3 class="snk-sidebar-heading">ÖZEL BESLEMELER</h3>
                    <a href="#" class="snk-sidebar-item">
                        <i class="fas fa-star"></i>
                        <span class="snk-sidebar-text">Favoriler</span>
                    </a>
                    <a href="#" class="snk-sidebar-item">
                        <i class="fas fa-history"></i>
                        <span class="snk-sidebar-text">Geçmiþ</span>
                    </a>
                </div>               
                <!-- Kaynaklar -->
                <div class="snk-sidebar-section">
                    <h3 class="snk-sidebar-heading">KAYNAKLAR</h3>
                    <a href="Aboutus.aspx" class="snk-sidebar-item">
                        <i class="fas fa-info-circle"></i>
                        <span class="snk-sidebar-text">Hakkýmýzda</span>
                    </a>
                    <a href="contact.aspx" class="snk-sidebar-item">
                        <i class="fas fa-envelope"></i>
                        <span class="snk-sidebar-text">Ýletiþim</span>
                    </a>
                </div>
            </div>
            
            <!-- Ana Ýçerik -->
            <main class="snk-main-content">
                <div class="snk-content-layout">
                    <!-- Sol Sütun (Blog Yazýlarý) -->
                    <div class="snk-content-main">
                        <div class="snk-content-header">
                            <h2 class="snk-content-title">En Güncel Paylaþýmlar</h2>
                            <!-- Filtreleme butonlarý kaldýrýldý -->
                        </div>
                        
                        <!-- Son Blog Yazýlarý -->
                        <div class="snk-recent-posts" id="snk_postsContainer">
                            <!-- Blog Yazýlarý JavaScript ile yüklenir -->
                            <div class="snk-loading">
                                <i class="fas fa-spinner fa-spin"></i> Yükleniyor...
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sað Sütun (Kutucuklar için) -->
                    <div class="snk-content-sidebar" id="snk_contentSidebar">
                        <!-- En Çok Okunan Yazýlar Kutucuðu -->
                        <div class="snk-sidebar-widget">
                            <div class="snk-sidebar-widget-header">
                                <h3 class="snk-sidebar-widget-title">Blog Yazýlarý</h3>
                            </div>
                            <div class="snk-sidebar-widget-content">
                                <div class="snk-popular-posts" id="snk_popularPosts">
                                    <!-- En popüler ve en yeni özelliði kaldýrýldý -->
                                    <div class="snk-no-posts">
                                        Filtreleme özelliði kaldýrýldý.
                                    </div>
                                </div>
                                <a href="categories.aspx" class="snk-more-link">Tüm kategorileri gör <i class="fas fa-angle-right"></i></a>
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
                <!-- Popup içeriði JavaScript ile yüklenir -->
            </div>
        </div>
    </div>

    <!-- Login Popup -->
    <div class="snk-popup-overlay" id="snk_loginPopup">
        <div class="snk-popup-container auth-popup">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">Giriþ Yap</h2>
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
                            <label for="loginPassword">Þifre</label>
                            <div class="snk-password-container">
                                <input type="password" id="loginPassword" name="password" class="snk-form-input" placeholder="Þifreniz" required>
                                <button type="button" class="snk-password-toggle" id="snk_login_toggle_password">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="snk-form-options">
                            <div class="snk-remember-me">
                                <input type="checkbox" id="snk_remember_me">
                                <label for="snk_remember_me">Beni hatýrla</label>
                            </div>
                            <a href="#" class="snk-forgot-password">Þifremi unuttum</a>
                        </div>
                        <button type="submit" class="snk-auth-submit">Oturum Aç</button>
                        <div id="loginAlertBox" class="snk-form-message" style="display: none;"></div>
                        <div class="snk-auth-toggle">
                            Hesabýnýz yok mu? <a href="#" id="showRegisterPopup">Kaydolun</a>
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
                <h2 class="snk-popup-title">Kayýt Ol</h2>
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
                        <label for="registerEmail">Öðrenci E-posta</label>
                        <input type="email" id="registerEmail" name="email" placeholder="ol2413615XXX@isparta.edu.tr" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Þifre</label>
                        <input type="password" id="registerPassword" name="password" required>
                    </div>
                    <button type="submit" class="auth-button">Kayýt Ol</button>
                </form>
                <div class="auth-links">
                    <p>Zaten bir hesabýnýz var mý? <a href="#" id="showLoginPopup">Giriþ Yap</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Verification Popup -->
    <div class="snk-popup-overlay" id="snk_verificationPopup">
        <div class="snk-popup-container auth-popup">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">E-posta Doðrulama</h2>
                <button class="snk-popup-close-btn" id="snk_verificationCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-popup-content">
                <div id="verificationAlertBox" class="auth-alert"></div>
                <p class="verification-info">Hesabýnýzý aktifleþtirmek için size verilen doðrulama kodunu giriniz.</p>
                <form id="verificationForm" class="auth-form">
                    <div class="form-group">
                        <label for="verificationCode">Doðrulama Kodu</label>
                        <input type="text" id="verificationCode" name="verificationCode" required>
                        <input type="hidden" id="verificationEmail" name="email">
                    </div>
                    <button type="submit" class="auth-button">Doðrula</button>
                </form>
                <div class="auth-links">
                    <p><a href="#" id="resendVerificationCode">Yeni kod gönder</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobil Menü Butonu -->
    <button class="snk-mobile-menu-btn" id="mobileSidebarToggle">
        <i class="fas fa-bars"></i>
    </button>

    <!-- JavaScript dosyalarý -->
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
            // Tüm sayfa içeriði yüklendikten sonra ana fonksiyonlar baþlatýlýr
            snk_main_initializePage();

            // Sayfa týklamalarýnýn boþluk kontrolü
            document.addEventListener('click', function (e) {
                console.log('Sayfa týklandý:', e.target);
            });
        });
    </script>
    <script src="components/main.js"
    <script src="components/sidebar.js"</script>
    <script src="components/popup.js"</script>
    <script src="components/comment-system.js"</script>
</body>