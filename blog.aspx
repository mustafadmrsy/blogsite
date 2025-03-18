<!DOCTYPE html>
<html lang="tr">
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
    <link rel="stylesheet" href="assets/style/blogdetails.css" />
    <script src="assets/components/blod-detail.js" defer></script>

</head>
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
                <link rel="stylesheet" href="style/main.css"/>
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
                    <a href="default.aspx"class="snk-sidebar-item active">
                        <i class="fas fa-home"></i>
                        <span class="snk-sidebar-text">Ana Sayfa</span>
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
                    <a href="contact.aspx" class="snk-sidebar-item">
                        <i class="fas fa-envelope"></i>
                        <span class="snk-sidebar-text">İletişim</span>
                    </a>
                </div>
            </div>
            
            <!-- Ana İçerik -->
            <main class="snk-main-content blog-detail-container">
                <div class="blog-detail">
                    <div class="blog-title">
                        <h1 id="blog-title">SenirkentBlog: Öğrenciler İçin Paylaşım ve Bilgi Merkezi! 🎓📚</h1>
                        <div class="blog-meta">
                            <span class="blog-author">Yazar: <span id="blog-author">Mustafa Demirsoy</span></span>
                            <span class="blog-date">Tarih: <span id="blog-date">18.03.2025</span></span>
                            <span class="blog-category">Kategori: <span id="blog-category">Akademik ve Destek</span></span>
                        </div>
                    </div>
                    <div class="blog-content" id="blog-content">
                        <!-- Blog içeriği buraya dinamik olarak yüklenecek -->
                        <p>Öğrencilik hayatı, akademik başarıdan barınmaya, sosyal hayattan bireysel gelişime kadar birçok farklı dinamiği içinde barındırır. İşte tam da bu noktada SenirkentBlog devreye giriyor! 🚀

SenirkentBlog, öğrencilerin deneyimlerini paylaşabileceği, faydalı bilgiler edinebileceği ve birbirine destek olabileceği bir platformdur.

💡 Neler Paylaşabilirsin?
✅ Akademik Başarı Hikayeleri: Ders çalışma tekniklerin, sınav hazırlık ipuçların veya akademik hayatını kolaylaştıran önerilerin mi var? Paylaş, başkalarına da ilham ol!
🏠 Bina ve Apart Bilgileri: Senirkent’te öğrenciye uygun apart ve yurtlarla ilgili deneyimlerini paylaşarak yeni gelen öğrencilere rehberlik edebilirsin.
🛠️ İhtiyaç Duyulan Hizmetler: Uygun fiyatlı yemek yerleri, kırtasiyeler, ulaşım bilgileri ve daha fazlası hakkında paylaşım yaparak öğrenci hayatını kolaylaştırabilirsin.
🎉 Etkinlikler ve Sosyal Hayat: Konserler, festivaller, öğrenci kulüpleri ve sosyal aktiviteler hakkında bilgi vererek topluluk bilincini artırabilirsin.

👥 Neden SenirkentBlog?
✨ Gerçek öğrenci deneyimlerine dayalı içerikler
✨ Öğrenciler arası bilgi ve destek ağı
✨ Güncel ve sürekli yenilenen içerikler

Sen de SenirkentBlog’a katıl, deneyimlerini paylaş ve öğrenci hayatını daha keyifli hale getir! 💙

🚀 SenirkentBlog – Öğrenciler İçin, Öğrenciler Tarafından! 🚀</p>
                    </div>
                    
                    <div class="blog-comments-section">
                        <h3>Yorumlar</h3>
                        <div class="comments-container" id="comments-container">
                            <!-- Yorumlar buraya dinamik olarak yüklenecek -->
                        </div>
                        
                        <div class="comment-form">
                            <h4>Yorum Yap</h4>
                            <form id="comment-form">
                                <div class="form-group">
                                    <input type="text" id="comment-name" placeholder="Adınız" required>
                                </div>
                                <div class="form-group">
                                    <textarea id="comment-text" placeholder="Yorumunuz" required></textarea>
                                </div>
                                <button type="submit" class="comment-submit-btn">Yorum Gönder</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

   <!-- Popup Container -->
  <div class="snk-popup-overlay" id="snk_loginPopup">
      <div class="snk-popup-container auth-popup">
          <div class="snk-popup-header">
              <h2 class="snk-popup-title">Giriş Yap</h2>
              <button class="snk-popup-close-btn" id="snk_loginCloseBtn">
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
              </form>
              <div class="auth-links">
                  <p>Zaten bir hesabınız var mı? <a href="#" id="showLoginPopup">Giriş Yap</a></p>
              </div>
          </div>
      </div>
  </div>

  <!-- Verification Popup -->
  <div class="snk-popup-overlay" id="snk_verificationPopup">
      <div class="snk-popup-container auth-popup">
          <div class="snk-popup-header">
              <h2 class="snk-popup-title">E-posta Doğrulama</h2>
              <button class="snk-popup-close-btn" id="snk_verificationCloseBtn">
                  <i class="fas fa-times"></i>
              </button>
          </div>
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
    <script src="assets/components/sidebar.js"></script>
    <script src="assets/components/main.js"></script>
    <script src="assets/components/popup.js"></script>
    <script src="assets/components/popup-handler.js"></script>
    <script src="assets/components/verification.js"></script>
    <script src="assets/components/auth-handler.js"></script>
    <script src="assets/components/profile-dropdown.js"></script>
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <script src="assets/components/login-handler.js"></script>
    <script src="assets/components/comment-system.js"></script>
    <script src="assets/components/password-toggle.js" defer></script>

</body>
</html>
