﻿<!DOCTYPE html>
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
    <link rel="stylesheet" href="assets/style/terms-policy.css" />
</head>
<body>
    <div class="snk-container">
        <!-- Header -->
        <header class="snk-header">
            <!-- Logo Alanı -->
            <div class="snk-header-logo">
                <img src="images/logo.jpg" alt="Senirkent Blog" class="snk-logo-img">
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
                            <li><a href="#"><i class="fas fa-user-circle"></i> Profili Görüntüle</a></li>
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

                <button class="snk-header-btn snk-create-btn" id="snk_create_btn">
                    <i class="fas fa-plus"></i>
                    Oluştur
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
                    <a href="default.aspx" class="snk-sidebar-item active">
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
            <main class="snk-main-content snk-user-main">
                <!-- Profil Üst Kısmı -->
                <div class="snk-user-header">
                    <div class="snk-user-cover">
                        <img src="../public/images/cover.jpg" alt="Kapak Fotoğrafı">
                    </div>
                    
                    <!-- Profil Düzenle Butonu -->
                    <button class="snk-profile-edit-btn" id="profileEditBtn">
                        <i class="fas fa-edit"></i> Profili Düzenle
                    </button>
                    
                    <div class="snk-profile-image-container">
                        <img src="../public/images/profile.png" alt="Profil Fotoğrafı" class="snk-user-profile" id="userProfileImg">
                    </div>
                    
                    <div class="snk-user-info">
                        <h1 class="snk-user-name">Kullanıcı Adı</h1>
                        <div class="snk-user-username">@kullanıcıadı</div>
                        <p class="snk-user-bio">Biyografi</p>
                        
                        <div class="snk-user-stats">
                            <div class="snk-stat-item">
                                <span class="snk-stat-value">57</span>
                                <span class="snk-stat-label">Yazı</span>
                            </div>
                            <div class="snk-stat-item">
                                <span class="snk-stat-value">142</span>
                                <span class="snk-stat-label">Takipçi</span>
                            </div>
                            <div class="snk-stat-item">
                                <span class="snk-stat-value">38</span>
                                <span class="snk-stat-label">Takip</span>
                            </div>
                            <div class="snk-stat-item">
                                <span class="snk-stat-value">12</span>
                                <span class="snk-stat-label">Rozet</span>
                            </div>
                        </div>
                        
                        <div class="snk-user-actions">
                            <button class="snk-user-action-btn snk-follow-btn" id="user_followBtn">
                                <i class="fas fa-user-plus"></i>
                                Takip Et
                            </button>
                            <button class="snk-user-action-btn snk-message-btn" id="user_messageBtn">
                                <i class="fas fa-envelope"></i>
                                Mesaj Gönder
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Profil Sekme Navigasyonu -->
                <div class="snk-user-tabs" id="user_tabNav">
                    <div class="snk-user-tab active" data-tab="posts">Yazılar</div>
                    <div class="snk-user-tab" data-tab="badges">Rozetler</div>
                    <div class="snk-user-tab" data-tab="favorites">Favoriler</div>
                    <div class="snk-user-tab" data-tab="about">Hakkında</div>
                </div>
                
                <!-- Profil Yazılar Bölümü -->
                <div class="snk-user-section active" id="user_postsSection">
                    <div class="snk-user-posts">
                        <!-- JavaScript ile kullanıcının blog yazıları burada gösterilecek -->
                        <div class="snk-loading">
                            <i class="fas fa-spinner fa-spin"></i> Yazılar yükleniyor...
                        </div>
                        
                        <!-- Örnek Blog Kartı 1 (JavaScript ile dinamik oluşturulacak) -->
                        <div class="snk-user-post-card fade-in">
                            <div class="snk-user-post-image">
                                <img src="../public/images/placeholder.jpg" alt="Yazı Görseli">
                                <span class="snk-user-post-category" data-category="egitim">Eğitim</span>
                            </div>
                            <div class="snk-user-post-content">
                                <h3 class="snk-user-post-title">Web Geliştirme İçin Başlangıç Rehberi</h3>
                                <p class="snk-user-post-excerpt">Web geliştirme dünyasına yeni adım atanlar için kapsamlı bir rehber. HTML, CSS ve JavaScript temelleri ile başlayarak modern web uygulamaları geliştirmeye kadar ilerleyin.</p>
                                <div class="snk-user-post-meta">
                                    <span><i class="fas fa-calendar-alt"></i> 12 Şubat 2025</span>
                                    <span><i class="fas fa-eye"></i> 348 Okunma</span>
                                </div>
                                <div class="snk-post-actions">
                                    <button class="snk-action-button snk-like-button" data-post-id="1">
                                        <i class="far fa-heart"></i> <span class="snk-like-count">0</span> Beğen
                                    </button>
                                    <button class="snk-action-button snk-comment-button" data-post-id="1">
                                        <i class="far fa-comment"></i> Yorum Yap
                                    </button>
                                    <button class="snk-action-button snk-share-button" data-post-id="1">
                                        <i class="far fa-share-square"></i> Paylaş
                                    </button>
                                    <button class="snk-action-button snk-delete-button" data-post-id="1">
                                        <i class="far fa-trash-alt"></i> Sil
                                    </button>
                                </div>
                                <div class="snk-user-post-read-more">
                                    <button class="snk-user-read-more-btn">
                                        Devamını Oku <i class="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Örnek Blog Kartı 2 (JavaScript ile dinamik oluşturulacak) -->
                        <div class="snk-user-post-card fade-in">
                            <div class="snk-user-post-image">
                                <img src="../public/images/placeholder.jpg" alt="Yazı Görseli">
                                <span class="snk-user-post-category" data-category="teknoloji">Teknoloji</span>
                            </div>
                            <div class="snk-user-post-content">
                                <h3 class="snk-user-post-title">Yapay Zeka ve Günlük Hayatımıza Etkileri</h3>
                                <p class="snk-user-post-excerpt">Yapay zeka teknolojilerinin günlük hayatımıza nasıl entegre olduğu ve gelecekte bizi nelerin beklediği hakkında detaylı bir inceleme.</p>
                                <div class="snk-user-post-meta">
                                    <span><i class="fas fa-calendar-alt"></i> 5 Mart 2025</span>
                                    <span><i class="fas fa-eye"></i> 205 Okunma</span>
                                </div>
                                <div class="snk-post-actions">
                                    <button class="snk-action-button snk-like-button" data-post-id="2">
                                        <i class="far fa-heart"></i> <span class="snk-like-count">0</span> Beğen
                                    </button>
                                    <button class="snk-action-button snk-comment-button" data-post-id="2">
                                        <i class="far fa-comment"></i> Yorum Yap
                                    </button>
                                    <button class="snk-action-button snk-share-button" data-post-id="2">
                                        <i class="far fa-share-square"></i> Paylaş
                                    </button>
                                    <button class="snk-action-button snk-delete-button" data-post-id="2">
                                        <i class="far fa-trash-alt"></i> Sil
                                    </button>
                                </div>
                                <div class="snk-user-post-read-more">
                                    <button class="snk-user-read-more-btn">
                                        Devamını Oku <i class="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Profil Rozetler Bölümü -->
                <div class="snk-user-section" id="user_badgesSection">
                    <!-- Rozet 1 -->
                    <div class="snk-badge-card slide-in">
                        <div class="snk-badge-icon">
                            <i class="fas fa-award"></i>
                        </div>
                        <h3 class="snk-badge-name">İçerik Üretici</h3>
                        <p class="snk-badge-description">50'den fazla yazı yayınladı</p>
                        <span class="snk-badge-date">10 Ocak 2025</span>
                    </div>
                    
                    <!-- Rozet 2 -->
                    <div class="snk-badge-card slide-in">
                        <div class="snk-badge-icon">
                            <i class="fas fa-fire"></i>
                        </div>
                        <h3 class="snk-badge-name">Popüler Yazar</h3>
                        <p class="snk-badge-description">Yazıları 10.000+ kez okundu</p>
                        <span class="snk-badge-date">15 Aralık 2024</span>
                    </div>
                    
                    <!-- Rozet 3 -->
                    <div class="snk-badge-card slide-in">
                        <div class="snk-badge-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3 class="snk-badge-name">Topluluk Lideri</h3>
                        <p class="snk-badge-description">100+ takipçiye ulaştı</p>
                        <span class="snk-badge-date">5 Kasım 2024</span>
                    </div>
                    
                    <!-- Rozet 4 -->
                    <div class="snk-badge-card slide-in">
                        <div class="snk-badge-icon">
                            <i class="fas fa-newspaper"></i>
                        </div>
                        <h3 class="snk-badge-name">Teknoloji Uzmanı</h3>
                        <p class="snk-badge-description">Teknoloji kategorisinde 25+ yazı yazdı</p>
                        <span class="snk-badge-date">1 Ekim 2024</span>
                    </div>
                </div>
                
                <!-- Profil Favoriler Bölümü -->
                <div class="snk-user-section" id="user_favoritesSection">
                </div>
                
                <!-- Profil Hakkında Bölümü -->
                <div class="snk-user-section" id="user_aboutSection">
                    <!-- Kişisel Bilgiler Kartı -->
                    <div class="snk-user-about-card-single">
                        <h2><i class="fas fa-user-circle"></i> Kişisel Bilgiler</h2>
                        <div class="snk-about-personal-info">
                            <div class="snk-about-info-item">
                                <h4>Ad Soyad</h4>
                                <p class="snk-user-name-display">İsim-Soyad</p>
                            </div>
                            <div class="snk-about-info-item">
                                <h4>Kullanıcı Adı</h4>
                                <p class="snk-user-username-display">Kullanıcı Adı</p>
                            </div>
                            <div class="snk-about-info-item">
                                <h4>E-posta</h4>
                                <p class="snk-user-email-display">e-posta</p>
                            </div>
                            <div class="snk-about-info-item">
                                <h4>Telefon</h4>
                                <p class="snk-user-phone-display">Telefon Numarası</p>
                            </div>
                            <div class="snk-about-info-item">
                                <h4>Biyografi</h4>
                                <p class="snk-user-bio-display">Biyografi</p>
                            </div>
                        </div>
                        
                        <h2 class="mt-4"><i class="fas fa-share-alt"></i> Sosyal Medya</h2>
                        <div class="snk-about-social-info">
                            <div class="snk-about-social-item">
                                <h4><i class="fab fa-twitter"></i> Twitter</h4>
                                <p class="snk-user-twitter-display">Twitter</p>
                            </div>
                            <div class="snk-about-social-item">
                                <h4><i class="fab fa-instagram"></i> Instagram</h4>
                                <p class="snk-user-instagram-display">ınstagram</p>
                            </div>
                            <div class="snk-about-social-item">
                                <h4><i class="fab fa-linkedin"></i> LinkedIn</h4>
                                <p class="snk-user-linkedin-display">LinkedIn</p>
                            </div>
                            <div class="snk-about-social-item">
                                <h4><i class="fab fa-github"></i> GitHub</h4>
                                <p class="snk-user-github-display">GitHub</p>
                            </div>
                            <div class="snk-about-social-item">
                                <h4><i class="fas fa-globe"></i> Web Sitesi</h4>
                                <p class="snk-user-website-display">Web Sitesi</p>
                            </div>
                            <div class="snk-about-social-item">
                                <h4><i class="fab fa-youtube"></i> YouTube</h4>
                                <p class="snk-user-youtube-display">YouTube</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Profil Düzenleme Modal -->
    <div class="snk-profile-edit-overlay" id="profileEditOverlay">
        <div class="snk-profile-edit-container">
            <div class="snk-profile-edit-header">
                <h3 class="snk-profile-edit-title">Profili Düzenle</h3>
                <button class="snk-profile-edit-close" id="profileEditClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form class="snk-profile-edit-form" id="profileEditForm">
                <!-- Sekme Navigasyonu -->
                <div class="snk-profile-edit-tabs">
                    <div class="snk-profile-edit-tab active" data-tab="personal">
                        <i class="fas fa-user-circle"></i> Kişisel Bilgiler
                    </div>
                    <div class="snk-profile-edit-tab" data-tab="images">
                        <i class="fas fa-images"></i> Fotoğraflar
                    </div>
                    <div class="snk-profile-edit-tab" data-tab="social">
                        <i class="fas fa-share-alt"></i> Sosyal Medya
                    </div>
                    <div class="snk-profile-edit-tab" data-tab="account">
                        <i class="fas fa-cog"></i> Hesap Ayarları
                    </div>
                </div>
                
                <div class="snk-profile-edit-sections">
                    <!-- Kişisel Bilgiler Sekmesi -->
                    <div class="snk-profile-edit-section active" id="profileEdit_personal">
                        <div class="snk-form-group">
                            <label for="profileDisplayName" class="snk-form-label">Ad Soyad</label>
                            <input type="text" class="snk-form-control" id="profileDisplayName" name="displayName" placeholder="Ad Soyad">
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profileName" class="snk-form-label">Kullanıcı Adı</label>
                            <input type="text" class="snk-form-control" id="profileName" name="username" placeholder="kullanici_adi">
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profileEmail" class="snk-form-label">E-posta</label>
                            <input type="email" class="snk-form-control" id="profileEmail" name="email" placeholder="ornek@email.com">
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profilePhone" class="snk-form-label">Telefon</label>
                            <input type="tel" class="snk-form-control" id="profilePhone" name="phone" placeholder="05XX XXX XX XX">
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profileBio" class="snk-form-label">Biyografi</label>
                            <textarea class="snk-form-control snk-form-textarea" id="profileBio" name="bio" placeholder="Kendinizi kısaca tanıtın..."></textarea>
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profileLocation" class="snk-form-label">Konum</label>
                            <input type="text" class="snk-form-control" id="profileLocation" name="location" placeholder="Şehir, Ülke">
                        </div>
                    </div>
                    
                    <!-- Fotoğraflar Sekmesi -->
                    <div class="snk-profile-edit-section" id="profileEdit_images">
                        <div class="snk-form-group">
                            <label class="snk-form-label">Profil Fotoğrafı</label>
                            <div class="snk-image-preview snk-profile-picture-preview" id="profilePicturePreview">
                                <div class="snk-image-placeholder">
                                    <i class="fas fa-user"></i>
                                    <p>Profil fotoğrafınızı yüklemek için tıklayın veya sürükleyin</p>
                                </div>
                                <input type="file" class="snk-image-input" id="profilePictureInput" name="profilePicture" accept="image/*">
                            </div>
                        </div>
                        
                        <div class="snk-form-group">
                            <label class="snk-form-label">Kapak Fotoğrafı</label>
                            <div class="snk-image-preview" id="coverPicturePreview">
                                <div class="snk-image-placeholder">
                                    <i class="fas fa-image"></i>
                                    <p>Kapak fotoğrafınızı yüklemek için tıklayın veya sürükleyin</p>
                                </div>
                                <input type="file" class="snk-image-input" id="coverPictureInput" name="coverPicture" accept="image/*">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sosyal Medya Sekmesi -->
                    <div class="snk-profile-edit-section" id="profileEdit_social">
                        <div class="snk-form-group">
                            <label for="profileTwitter" class="snk-form-label">Twitter</label>
                            <div class="snk-social-input">
                                <input type="text" class="snk-form-control" id="profileTwitter" name="twitter" placeholder="@kullanici_adi">
                                <i class="fab fa-twitter"></i>
                            </div>
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profileInstagram" class="snk-form-label">Instagram</label>
                            <div class="snk-social-input">
                                <input type="text" class="snk-form-control" id="profileInstagram" name="instagram" placeholder="kullanici_adi">
                                <i class="fab fa-instagram"></i>
                            </div>
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profileLinkedin" class="snk-form-label">LinkedIn</label>
                            <div class="snk-social-input">
                                <input type="text" class="snk-form-control" id="profileLinkedin" name="linkedin" placeholder="linkedin.com/in/...">
                                <i class="fab fa-linkedin"></i>
                            </div>
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profileGithub" class="snk-form-label">GitHub</label>
                            <div class="snk-social-input">
                                <input type="text" class="snk-form-control" id="profileGithub" name="github" placeholder="github.com/...">
                                <i class="fab fa-github"></i>
                            </div>
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profileWebsite" class="snk-form-label">Web Sitesi</label>
                            <div class="snk-social-input">
                                <input type="text" class="snk-form-control" id="profileWebsite" name="website" placeholder="www.ornek.com">
                                <i class="fas fa-globe"></i>
                            </div>
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profileYoutube" class="snk-form-label">YouTube</label>
                            <div class="snk-social-input">
                                <input type="text" class="snk-form-control" id="profileYoutube" name="youtube" placeholder="youtube.com/c/...">
                                <i class="fab fa-youtube"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Hesap Ayarları Sekmesi -->
                    <div class="snk-profile-edit-section" id="profileEdit_account">
                        <div class="snk-form-group">
                            <label for="profilePassword" class="snk-form-label">Şifre Değiştir</label>
                            <input type="password" class="snk-form-control" id="profilePassword" name="password" placeholder="Yeni şifre">
                        </div>
                        
                        <div class="snk-form-group">
                            <label for="profileConfirmPassword" class="snk-form-label">Şifre Tekrar</label>
                            <input type="password" class="snk-form-control" id="profileConfirmPassword" name="confirmPassword" placeholder="Yeni şifreyi tekrar girin">
                        </div>
                        
                        <div class="snk-form-group">
                            <label class="snk-form-label">Bildirim Tercihleri</label>
                            <div class="snk-checkbox-group">
                                <div class="snk-checkbox">
                                    <input type="checkbox" id="notifEmail" name="notifEmail">
                                    <label for="notifEmail">E-posta bildirimleri</label>
                                </div>
                                
                                <div class="snk-checkbox">
                                    <input type="checkbox" id="notifWeb" name="notifWeb" checked>
                                    <label for="notifWeb">Web site bildirimleri</label>
                                </div>
                                
                                <div class="snk-checkbox">
                                    <input type="checkbox" id="notifContent" name="notifContent" checked>
                                    <label for="notifContent">İçerik güncellemeleri bildirimleri</label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="snk-form-group">
                            <label class="snk-form-label">Gizlilik Ayarları</label>
                            <div class="snk-checkbox-group">
                                <div class="snk-checkbox">
                                    <input type="checkbox" id="privacyProfile" name="privacyProfile" checked>
                                    <label for="privacyProfile">Profilimi herkes görebilir</label>
                                </div>
                                
                                <div class="snk-checkbox">
                                    <input type="checkbox" id="privacyEmail" name="privacyEmail">
                                    <label for="privacyEmail">E-posta adresimi gizle</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Form Butonları -->
                <div class="snk-profile-buttons">
                    <button type="button" class="snk-profile-btn snk-profile-cancel-btn" id="profileCancelBtn">
                        <i class="fas fa-times"></i> İptal
                    </button>
                    <button type="submit" class="snk-profile-btn snk-profile-save-btn">
                        <i class="fas fa-save"></i> Kaydet
                    </button>
                </div>
            </form>
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
                <!-- Popup içeriği JavaScript ile yüklenir -->
            </div>
        </div>
    </div>

    <!-- Mobil Menü Butonu -->
    <button class="snk-mobile-menu-btn" id="mobileSidebarToggle">
        <i class="fas fa-bars"></i>
    </button>

    <!-- JavaScript -->
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
    <script src="assets/components/profile-editor.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Kullanıcı oturum durumunu kontrol et
            const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || localStorage.getItem('snk_current_user') || 'null');

            if (!currentUser) {
                // Kullanıcı oturum açmamış, ana sayfaya yönlendir
                window.location.href = 'main.aspx';
                return;
            }

            // Kullanıcı bilgilerini sayfaya yerleştir
            const userName = document.querySelector('.snk-user-name');
            if (userName) {
                userName.textContent = currentUser.displayName || `${currentUser.name || ''} ${currentUser.surname || ''}`;
            }

            const userUsername = document.querySelector('.snk-user-handle');
            if (userUsername) {
                userUsername.textContent = `@${currentUser.username || (currentUser.name ? currentUser.name.toLowerCase() : '')}`;
            }

            // Profil sekmesi işlevselliği
            const tabItems = document.querySelectorAll('.snk-user-tab');
            const sectionItems = document.querySelectorAll('.snk-user-section');

            tabItems.forEach(tab => {
                tab.addEventListener('click', function () {
                    // Aktif sekmeyi değiştir
                    tabItems.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');

                    // İlgili içerik bölümünü göster
                    const tabName = this.getAttribute('data-tab');
                    sectionItems.forEach(section => {
                        section.classList.remove('active');
                        if (section.id === `user_${tabName}Section`) {
                            section.classList.add('active');
                        }
                    });

                    // Eğer Yazılar sekmesine tıklandıysa, kullanıcının yazılarını güncelle
                    if (tabName === 'posts') {
                        updateUserPostsDisplay();
                    }
                });
            });

            // Sayfa yüklendiğinde kullanıcı yazılarını göster
            updateUserPostsDisplay();

            // Çıkış Yap butonuna işlevsellik ekle
            const logoutLink = document.querySelector('.snk-logout');
            if (logoutLink) {
                logoutLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    // Kullanıcı oturumunu sonlandır
                    localStorage.removeItem('snk_currentUser');
                    localStorage.removeItem('snk_current_user');
                    // Ana sayfaya yönlendir
                    window.location.href = 'main.aspx';
                });
            }
        });
    </script>
</body>
</html>
