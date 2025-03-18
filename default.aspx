<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="blogsite123._default" %>

<!DOCTYPE html lang="tr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senirkent Blog</title>
    <link rel="stylesheet" href="assets/style/main.css" />
    <link rel="stylesheet" href="assets/style/indexspesific.css" />
    <link rel="stylesheet" href="assets/style/userpage.css" />
    <link rel="stylesheet" href="assets/style/blogcard.css" />
    <link rel="stylesheet" href="assets/style/blogpopup.css" />
    <link rel="stylesheet" href="assets/style/notification.css" />
    <link rel="stylesheet" href="assets/style/commentsystem.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="assets/style/auth-forms.css" />
    <link rel="stylesheet" href="assets/style/formfixes.css" />
    <link rel="stylesheet" href="assets/style/terms-policy.css" />
</head>

</>
<body>
    <div class="snk-container">
        <!-- Header -->
        <header class="snk-header">
            <!-- Logo Alanı -->
            <div class="snk-header-logo">
                <img src="assets/images/logo.jpg" alt="Senirkent Blog" class="snk-logo-img">
                <h1 class="snk-site-title">Senirkent Blog</h1>
            </div>
            
            <!-- Arama Alanı -->
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
                            <li><a href="userpage.aspx"><i class="fas fa-user-circle"></i> Profili Görüntüle</a></li>
                            <li class="snk-toggle-item">
                                <span><i class="fas fa-moon"></i> Karanlık Mod</span>
                                <label class="snk-toggle-switch">
                                    <input type="checkbox" id="darkModeToggle" checked>
                                    <span class="snk-toggle-slider"></span>
                                </label>
                            </li>
                            <li class="snk-divider"></li>
                            <li><a href="#" class="snk-logout"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</a></li>
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
                    Oluştur
                </button>
            </div>
        </header>

        <div class="snk-content-wrapper"></div>
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
          <a href="default.aspx" class="snk-sidebar-item active">
              <i class="fas fa-home"></i>
              <span class="snk-sidebar-text">Ana Sayfa</span>
          </a>
          <a href="categories.aspx" class="snk-sidebar-item">
              <i class="fas fa-th-large"></i>
              <span class="snk-sidebar-text">Kategoriler</span>
          </a>
      </div>
      
      <!-- Özel Beslem1eler -->
      <div class="snk-sidebar-section">
          <h3 class="snk-sidebar-heading">ÖZEL BESLEMELE</h3>
          <a href="#" class="snk-sidebar-item">
              <i class="fas fa-star"></i>
              <span class="snk-sidebar-text">Favoriler</span>
          </a>
          <a href="#" class="snk-sidebar-item">
              <i class="fas fa-history"></i>
              <span class="snk-sidebar-text">Geçmiş</span>
          </a>
      </div>
                <!-- Kaynaklar -->
                <div class="snk-sidebar-section">
                    <h3 class="snk-sidebar-heading">KAYNAKLAR</h3>
                    <a href="Aboutus.aspx" class="snk-sidebar-item">
                        <i class="fas fa-info-circle"></i>
                        <span class="snk-sidebar-text">Hakkımızda</span>
                    </a>
                    <a href="contact.aspx"class="snk-sidebar-item">
                        <i class="fas fa-envelope"></i>
                        <span class="snk-sidebar-text">İletişim</span>
                    </a>
                </div>
            </div>
            
            <!-- Ana İçerik -->
            <main class="snk-main-content">
                <div class="snk-content-layout">
                    <!-- Sol Sütun (Blog Yazıları) -->
          <div class="snk-content-main">
                    <div class="snk-content-header">
                     <h2 class="snk-content-title">En Güncel Paylaşımlar</h2>
          </div>
                    <asp:Repeater ID="Repeater1" runat="server">
                    <ItemTemplate>
                       <a href="blog.aspx?postid=<%#Eval("PostID") %>">
                <h1><%#Eval("Title") %></h1>
            </a>
            <p><%#Eval("Content") %></p>
            </ItemTemplate>
            </asp:Repeater>
             </div>
                    
                    <!-- Sağ Sütun (Kutucuklar için) -->
                    <div class="snk-content-sidebar" id="snk_contentSidebar">
                        <!-- En Çok Okunan Yazılar Kutucuğu -->
                        <div class="snk-sidebar-widget">
                            <div class="snk-sidebar-widget-header">
                                <h3 class="snk-sidebar-widget-title">Blog Yazıları</h3>
                            </div>
                            <div class="snk-sidebar-widget-content">
                                <div class="snk-popular-posts" id="snk_popularPosts">
                                    <!-- En popüler ve en yeni özelliği kaldırıldı -->
                                    <div class="snk-no-posts">
                                        Filtreleme özelliği kaldırıldı.
                                    </div>
                                </div>
                                <a href="categories.aspx" class="snk-more-link">Tüm kategorileri gör <i class="fas fa-angle-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
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
                <!-- Popup içeriği JavaScript ile yüklenir -->
            </div>
        </div>
    </div>

    <!-- Login Popup -->
    <div class="snk-popup-overlay" id="snk_loginPopup">
        <div class="snk-popup-container auth-popup">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">Giriş Yap</h2>
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
                            <label for="loginPassword">Şifre</label>
                            <div class="snk-password-container">
                                <input type="password" id="loginPassword" name="password" class="snk-form-input" placeholder="Şifreniz" required>
                                <button type="button" class="snk-password-toggle" id="snk_login_toggle_password">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="snk-form-options">
                            <div class="snk-remember-me">
                                <input type="checkbox" id="snk_remember_me">
                                <label for="snk_remember_me">Beni hatırla</label>
                            </div>
                            <a href="#" class="snk-forgot-password">Şifremi unuttum</a>
                        </div>
                        <button type="submit" class="snk-auth-submit">Oturum Aç</button>
                        <div id="loginAlertBox" class="snk-form-message" style="display: none;"></div>
                        <div class="snk-auth-toggle">
                            Hesabınız yok mu? <a href="#" id="showRegisterPopup">Kaydolun</a>
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
                <h2 class="snk-popup-title">Kayıt Ol</h2>
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
                    </div>seBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
                    <div class="form-group">
                        <label for="registerEmail">Öğrenci E-posta</label>
                        <input type="email" id="registerEmail" name="email" placeholder="ol2413615XXX@isparta.edu.tr" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Şifre</label>
                        <input type="password" id="registerPassword" name="password" required>
                    </div>
                    <button type="submit" class="auth-button">Kayıt Ol</button>
                <div class="auth-links">
                    <p>Zaten bir hesabınız var mı? <a href="#" id="showLoginPopup">Giriş Yap</a></p>
                </div>
            </div>
        </div>

    <!-- Verification Popup -->
    <div class="snk-popup-overlay" id="snk_verificationPopup"></div>
        <div class="snk-popup-container auth-popup">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">E-posta Doğrulama</h2>
                <button class="snk-popup-close-btn" id="snk_verificationCloseBtn"></button>
            <div class="snk-popup-content">
                <div id="verificationAlertBox" class="auth-alert"></div>
                <p class="verification-info">Hesabınızı aktifleştirmek için size verilen doğrulama kodunu giriniz.</p>
                <form id="verificationForm" class="auth-form">
                    <div class="form-group">
                        <label for="verificationCode">Doğrulama Kodu</label>
                        <input type="text" id="verificationCode" name="verificationCode" required>
                        <input type="hidden" id="verificationEmail" name="email">
                    </div>
                    <button type="submit" class="auth-button">Doğrula</button>
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

    <!-- JavaScript dosyaları -->
    <script src="assets/components/dom-utils.js"></script>
    <script src="assets/components/main.js"></script>
    <script src="assets/components/popup.js"></script>
    <script src="assets/components/popup-handler.js"></script>
    <script src="assets/components/verification.js"></script>
    <script src="assets/components/auth-handler.js"></script>
    <script src="assets/components/profile-dropdown.js"></script>
    <script src="assets/components/login-handler.js"></script>
    <script src="assets/components/comment-system.js"></script>
    <script src="assets/components/password-toggle.js"></script>
    <script src="assets/components/sidebar.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Tüm sayfa içeriği yüklendikten sonra ana fonksiyonlar başlatılır
            snk_main_initializePage();

            // Sayfa tıklamalarının boşluk kontrolü
            document.addEventListener('click', function (e) {
                console.log('Sayfa tıklandı:', e.target);
            });
        });
    </script>
</body>
</>
