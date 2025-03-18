<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senirkent Blog</title>
    <link rel="stylesheet" href="assets/style/main.css">
    <link rel="stylesheet" href="assets/style/indexspesific.css" />
    <link rel="stylesheet" href="assets/style/userpage.css" />
    <link rel="stylesheet" href="assets/style/blogcard.css" />
    <link rel="stylesheet" href="assets/style/blogpopup.css" />
    <link rel="stylesheet" href="assets/style/notification.css" />
    <link rel="stylesheet" href="assets/style/commentsystem.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="assets/style/auth-forms.css" />
    <link rel="stylesheet" href="assets/style/aboutus.css" />
    <link rel="stylesheet" href="assets/style/formfixes.css" />
    <link rel="stylesheet" href="assets/style/terms-policy.css" />
</head>
<body>
    <div class="snk-container">
        <!-- Header -->
        <header class="snk-header">
            <!-- Logo Alan� -->
            <div class="snk-header-logo">
                <img src="assets/images/logo.jpg" alt="Senirkent Blog" class="snk-logo-img">
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
                            <li><a href="default.aspx"<i class="fas fa-user-circle"></i> Profili G�r�nt�le</a></li>
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
                    <a href="default.aspx" class="snk-sidebar-item active">
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
                <div class="snk-about-container">
                    <div class="snk-about-header">
                        <h2 class="snk-about-title">Hakk�m�zda</h2>
                        <p class="snk-about-subtitle">Senirkent Blog ekibi olarak, en g�ncel ve kaliteli i�erikleri sizlerle payla�maktay�z.</p>
                    </div>

                    <div class="snk-about-grid">
                        <!-- Biz Kimiz? -->
                        <div class="snk-about-card">
                            <div class="snk-about-card-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <h3 class="snk-about-card-title">Biz Kimiz?</h3>
                            <p class="snk-about-card-text">Biz, Eren Kaya ve Mustafa Demirsoy, Isparta Uygulamal� Bilimler �niversitesi'nde Bilgisayar Programc�l��� ��rencileri olarak, ��rencilere y�nelik faydal� bir platform olu�turmay� ama�l�yoruz. Bu platform, ��rencilerin bilgi payla��m�nda bulunabilece�i, ders notlar�na ve kaynaklara eri�ebilece�i, g�ncel duyurular ve etkinliklerden haberdar olabilece�i bir destek a�� sunar.

                                Hedefimiz, ��renciler i�in rehber niteli�inde bir topluluk olu�turmak ve akademik geli�imlerini destekleyerek onlar�n daha verimli bir ��renme deneyimi ya�amas�n� sa�lamakt�r.</p>
                        </div>

                        <!-- Misyonumuz -->
                        <div class="snk-about-card">
                            <div class="snk-about-card-icon">
                                <i class="fas fa-bullseye"></i>
                            </div>
                            <h3 class="snk-about-card-title">Misyonumuz</h3>
                            <p class="snk-about-card-text">��renciler aras�nda bilgi payla��m�n� kolayla�t�ran, akademik geli�imi destekleyen ve topluluk ruhunu g��lendiren bir platform sunuyoruz. �niversitemizdeki ��rencilerin ders notlar�na, kaynaklara ve g�ncel duyurulara kolayca eri�mesini sa�larken, fikir al��veri�i yapabilecekleri bir ortam olu�turuyoruz.

                                ��rencilerin birbirine destek olabilece�i, bilgiye h�zl� ve do�ru �ekilde ula�abilece�i etkile�imli bir topluluk in�a etmek i�in �al���yoruz.</p>
                        </div>

                        <!-- Vizyonumuz -->
                        <div class="snk-about-card">
                            <div class="snk-about-card-icon">
                                <i class="fas fa-eye"></i>
                            </div>
                            <h3 class="snk-about-card-title">Vizyonumuz</h3>
                            <p class="snk-about-card-text">Gelecekte, �niversitemizdeki t�m ��rencilerin aktif olarak katk� sa�lad���, bilgiye eri�imin h�zl� ve verimli oldu�u, s�rekli g�ncellenen ve geni�leyen bir ��renci destek platformu haline gelmeyi hedefliyoruz.

                                Uzun vadede, sadece kendi �niversitemizle s�n�rl� kalmay�p, di�er �niversitelerle i� birli�i yaparak daha geni� bir ��renci a�� olu�turmay� ve ��rencilere daha fazla imkan sunmay� ama�l�yoruz.
                                
                                </p>
                        </div>
                    </div>

                    <div class="snk-about-section">
                        <h3 class="snk-team-title">Ekibimiz</h3>
                        <div class="snk-team-container">
                            <!-- Kurucu �yeler -->
                            <div class="snk-team-category">
                                <h4 class="snk-team-category-title">Kurucu �yeler</h4>
                                <div class="snk-team-cards">
                                    <!-- Kurucu �ye 1 -->
                                    <div class="snk-team-card">
                                        <div class="snk-team-card-inner">
                                            <div class="snk-team-avatar">
                                                <img src="assets/images/mustafa-demirsoy.jpg" alt="Mustafa Demirsoy">
                                            </div>
                                            <div class="snk-team-info">
                                                <h5 class="snk-team-name">Mustafa Demirsoy</h5>
                                                <p class="snk-team-role">Kurucu & Yaz�l�m ve Geli�tirme Departman� Sorumlusu</p>
                                                <div class="snk-team-social">
                                                    <a href="http://linkedin.com/in/mustafa-demirsoy-085b4a271" target="_blank" class="snk-team-social-link"><i class="fab fa-linkedin-in"></i></a>
                                                    <a href="https://x.com/mmustafadmrsyy" target="_blank" class="snk-team-social-link"><i class="fab fa-twitter"></i></a>
                                                    <a href="https://www.instagram.com/mustafadmrsy/" target="_blank" class="snk-team-social-link"><i class="fab fa-instagram"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Kurucu �ye 2 -->
                                    <div class="snk-team-card">
                                        <div class="snk-team-card-inner">
                                            <div class="snk-team-avatar">
                                                <img src="assets/images/eren-kaya.jpg" alt="Eren Kaya">
                                            </div>
                                            <div class="snk-team-info">
                                                <h5 class="snk-team-name">Eren Kaya</h5>
                                                <p class="snk-team-role">Kurucu & Yaz�l�m ve Geli�tirme Departman� Sorumlusu</p>
                                                <div class="snk-team-social">
                                                    <a href="http://www.linkedin.com/in/eren-kaya1452" target="_blank" class="snk-team-social-link"><i class="fab fa-linkedin-in"></i></a>
                                                    <a href="https://x.com/NixionFrost" target="_blank" class="snk-team-social-link"><i class="fab fa-twitter"></i></a>
                                                    <a href="https://www.instagram.com/kyernn0/" target="_blank" class="snk-team-social-link"><i class="fab fa-instagram"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Normal �yeler -->
                            <div class="snk-team-category">
                                <h4 class="snk-team-category-title">Ekip �yeleri</h4>
                                <div class="snk-team-cards">
                                    <!-- Normal �ye 1 -->
                                    <div class="snk-team-card">
                                        <div class="snk-team-card-inner">
                                            <div class="snk-team-avatar">
                                                <img src="assets/images/ilkan-divarc�.png" alt="�lkan Divarc�">
                                            </div>
                                            <div class="snk-team-info">
                                                <h5 class="snk-team-name">�lkan Divarc�</h5>
                                                <p class="snk-team-role">Tasar�m Departman� Sorumlusu</p>
                                                <div class="snk-team-social">
                                                    <a href="https://www.linkedin.com/in/ilkan-divarc%C4%B1-2683282b0/" target="_blank" class="snk-team-social-link"><i class="fab fa-linkedin-in"></i></a>
                                                    <a href="https://www.instagram.com/ilkan.divarci?utm_source=qr&igsh=cDRucnJsaTE1cmNu" target="_blank" class="snk-team-social-link"><i class="fab fa-instagram"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Normal �ye 2 -->
                                    <div class="snk-team-card">
                                        <div class="snk-team-card-inner">
                                            <div class="snk-team-avatar">
                                                <img src="assets/images/alimert-vural.jpg" alt="Ali Mert Vural">
                                            </div>
                                            <div class="snk-team-info">
                                                <h5 class="snk-team-name">Ali Mert Vural</h5>
                                                <p class="snk-team-role">Sosyal Medya Departman� Sorumlusu</p>
                                                <div class="snk-team-social">
                                                    <a href="https://tr.linkedin.com/in/alimert-vural-237811355" target="_blank" class="snk-team-social-link"><i class="fab fa-linkedin-in"></i></a>
                                                    <a href="https://www.instagram.com/alimertvural0?igsh=NGEzdTZtNGQyZzR4" target="_blank" class="snk-team-social-link"><i class="fab fa-instagram"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
    <script src="assets/components/dom-utils.js"></script>
    <script src="assets/components/sidebar.js"></script>
    <script src="assets/components/main.js"></script>
    <script src="assets/components/popup.js"></script>
    <script src="assets/components/popup-handler.js"></script>
    <script src="assets/components/verification.js"></script>
    <script src="assets/components/auth-handler.js"></script>
    <script src="assets/components/profile-dropdown.js"></script>
    <script src="assets/components/login-handler.js"></script>
    <script src="assets/components/comment-system.js"></script>
    <script src="assets/components/password-toggle.js"></script>
</body>
</html>
