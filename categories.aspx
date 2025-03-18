<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Senirkent Blog</title>
    <link rel="stylesheet" href="assets/style/main.css" />
    <link rel="stylesheet" href="assets/style/indexspesific.css" />
    <link rel="stylesheet" href="assets/style/categories.css" />
    <link rel="stylesheet" href="assets/style/blogcard.css">
    <link rel="stylesheet" href="assets/style/blogpopup.css" />
    <link rel="stylesheet" href="assets/style/categories.css" />
    <link rel="stylesheet" href="assets/style/notification.css" />
    <link rel="stylesheet" href="assets/style/commentsystem.css" />
    <link rel="stylesheet" href="assets/style/auth-forms.css" />
    <link rel="stylesheet" href="assets/style/userpage.css" />
    <link rel="stylesheet" href="assets/style/formfixes.css" />
    <link rel="stylesheet" href="assets/style/terms-policy.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
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
                            <li><a href="userpage.aspx"><i class="fas fa-user-circle"></i> Profili G�r�nt�le</a></li>
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
                
                <!-- �zel Beslem1eler -->
                <div class="snk-sidebar-section">
                    <h3 class="snk-sidebar-heading">�ZEL BESLEMELE</h3>
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
            <main class="snk-main-content snk-categories-main">
                <!-- Kategori Ba�l�k ve Filtreler -->
                <div class="snk-categories-header">
                    <h1 class="snk-categories-title">Kategoriler</h1>
                    <div class="snk-categories-filters">
                        <button class="snk-category-filter active" data-filter="all">T�m�</button>
                        <button class="snk-category-filter" data-filter="akademik-destek">Akademik Destek</button>
                        <button class="snk-category-filter" data-filter="kariyer-staj">Kariyer ve Staj</button>
                        <button class="snk-category-filter" data-filter="sosyal-hayat">Sosyal Hayat</button>
                        <button class="snk-category-filter" data-filter="psikolojik-destek">Psikolojik Destek</button>
                        <button class="snk-category-filter" data-filter="burs-firsatlar">Burs ve F�rsatlar</button>
                        <button class="snk-category-filter" data-filter="random">Random</button>
                    </div>
                </div>
                
                <!-- Kategori Kartlar� Container -->
                <div class="snk-categories-container">
                    <!-- Akademik Destek Kategori Kart� -->
                    <div class="snk-category-card" data-category="akademik-destek">
                        <div class="snk-category-card-header">
                            <i class="fas fa-graduation-cap snk-category-icon"></i>
                            <h2 class="snk-category-name">Akademik Destek</h2>
                        </div>
                        <div class="snk-category-content">
                            <p>�devler, s�navlar, dersler ve akademik konularda ��rencilere yard�mc� olacak i�erikler.</p>
                        </div>
                        <div class="snk-category-stats">
                            <span><i class="fas fa-file-alt"></i> 24 Yaz�</span>
                            <span><i class="fas fa-eye"></i> 1.2K G�r�nt�lenme</span>
                        </div>
                        <a href="categories.aspx?category=akademik-destek" class="snk-category-btn">Yaz�lar� G�r</a>
                    </div>
                    
                    <!-- Kariyer ve Staj Kategori Kart� -->
                    <div class="snk-category-card" data-category="kariyer-staj">
                        <div class="snk-category-card-header">
                            <i class="fas fa-briefcase snk-category-icon"></i>
                            <h2 class="snk-category-name">Kariyer ve Staj</h2>
                        </div>
                        <div class="snk-category-content">
                            <p>Staj imkanlar�, i� ilanlar�, CV haz�rlama ve kariyer geli�imi ile ilgili i�erikler.</p>
                        </div>
                        <div class="snk-category-stats">
                            <span><i class="fas fa-file-alt"></i> 18 Yaz�</span>
                            <span><i class="fas fa-eye"></i> 2.3K G�r�nt�lenme</span>
                        </div>
                        <a href="categories.aspx?category=kariyer-staj" class="snk-category-btn">Yaz�lar� G�r</a>
                    </div>
                    
                    <!-- Sosyal Hayat Kategori Kart� -->
                    <div class="snk-category-card" data-category="sosyal-hayat">
                        <div class="snk-category-card-header">
                            <i class="fas fa-users snk-category-icon"></i>
                            <h2 class="snk-category-name">Sosyal Hayat</h2>
                        </div>
                        <div class="snk-category-content">
                            <p>Kamp�s etkinlikleri, ��renci kul�pleri ve sosyal aktiviteler hakk�nda bilgiler.</p>
                        </div>
                        <div class="snk-category-stats">
                            <span><i class="fas fa-file-alt"></i> 15 Yaz�</span>
                            <span><i class="fas fa-eye"></i> 1.8K G�r�nt�lenme</span>
                        </div>
                        <a href="categories.aspx?category=sosyal-hayat" class="snk-category-btn">Yaz�lar� G�r</a>
                    </div>

                    <!-- Psikolojik Destek Kategori Kart� -->
                    <div class="snk-category-card" data-category="psikolojik-destek">
                        <div class="snk-category-card-header">
                            <i class="fas fa-brain snk-category-icon"></i>
                            <h2 class="snk-category-name">Psikolojik Destek</h2>
                        </div>
                        <div class="snk-category-content">
                            <p>��renci psikolojisi, stresle ba�a ��kma y�ntemleri ve ki�isel geli�im rehberleri.</p>
                        </div>
                        <div class="snk-category-stats">
                            <span><i class="fas fa-file-alt"></i> 12 Yaz�</span>
                            <span><i class="fas fa-eye"></i> 1.5K G�r�nt�lenme</span>
                        </div>
                        <a href="categories.aspx?category=psikolojik-destek" class="snk-category-btn">Yaz�lar� G�r</a>
                    </div>

                    <!-- Burs ve F�rsatlar Kategori Kart� -->
                    <div class="snk-category-card" data-category="burs-firsatlar">
                        <div class="snk-category-card-header">
                            <i class="fas fa-hand-holding-usd snk-category-icon"></i>
                            <h2 class="snk-category-name">Burs ve F�rsatlar</h2>
                        </div>
                        <div class="snk-category-content">
                            <p>Burs imkanlar�, ��renci destekleri, yurt d��� f�rsatlar� ve ekonomik yard�mlar.</p>
                        </div>
                        <div class="snk-category-stats">
                            <span><i class="fas fa-file-alt"></i> 20 Yaz�</span>
                            <span><i class="fas fa-eye"></i> 2.7K G�r�nt�lenme</span>
                        </div>
                        <a href="categories.aspx?category=burs-firsatlar" class="snk-category-btn">Yaz�lar� G�r</a>
                    </div>

                    <!-- Random Kategori Kart� -->
                    <div class="snk-category-card" data-category="random">
                        <div class="snk-category-card-header">
                            <i class="fas fa-random snk-category-icon"></i>
                            <h2 class="snk-category-name">Random</h2>
                        </div>
                        <div class="snk-category-content">
                            <p>��renci hayat�na dair e�lenceli i�erikler, anketler ve ilgin� konular.</p>
                        </div>
                        <div class="snk-category-stats">
                            <span><i class="fas fa-file-alt"></i> 16 Yaz�</span>
                            <span><i class="fas fa-eye"></i> 1.9K G�r�nt�lenme</span>
                        </div>
                        <a href="categories.aspx?category=random" class="snk-category-btn">Yaz�lar� G�r</a>
                    </div>
                </div>
                
                <!-- Son Yaz�lar B�l�m� -->
                <div class="snk-categories-recent">
                    <h2 class="snk-recent-title">Son Eklenen Yaz�lar</h2>
                    <div class="snk-recent-posts" id="snk_postsContainer">
                        <!-- Yaz� 1 -->
                        <div class="snk-recent-post-card">
                            <div class="snk-recent-post-image">
                                <img src="../public/images/placeholder.jpg" alt="Yaz� G�rseli">
                                <span class="snk-post-category" data-category="egitim">E�itim</span>
                            </div>
                            <div class="snk-recent-post-content">
                                <h3 class="snk-recent-post-title">�niversitelerde Dijital D�n���m S�reci</h3>
                                <p class="snk-recent-post-excerpt">�niversiteler dijital d�n���m s�recinde yeni teknolojileri nas�l kullan�yor?</p>
                                <div class="snk-recent-post-meta">
                                    <span><i class="fas fa-calendar"></i> 12 �ubat 2025</span>
                                    <span><i class="fas fa-user"></i> Ahmet Y�lmaz</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Yaz� 2 -->
                        <div class="snk-recent-post-card">
                            <div class="snk-recent-post-image">
                                <img src="../public/images/placeholder.jpg" alt="Yaz� G�rseli">
                                <span class="snk-post-category" data-category="teknoloji">Teknoloji</span>
                            </div>
                            <div class="snk-recent-post-content">
                                <h3 class="snk-recent-post-title">Yapay Zeka ve G�nl�k Ya�am�m�z</h3>
                                <p class="snk-recent-post-excerpt">Yapay zeka teknolojileri g�nl�k ya�am�m�z� nas�l etkiliyor ve d�n��t�r�yor?</p>
                                <div class="snk-recent-post-meta">
                                    <span><i class="fas fa-calendar"></i> 8 �ubat 2025</span>
                                    <span><i class="fas fa-user"></i> Zeynep Kaya</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Yaz� 3 -->
                        <div class="snk-recent-post-card">
                            <div class="snk-recent-post-image">
                                <img src="../public/images/placeholder.jpg" alt="Yaz� G�rseli">
                                <span class="snk-post-category" data-category="kultur">K�lt�r</span>
                            </div>
                            <div class="snk-recent-post-content">
                                <h3 class="snk-recent-post-title">Geleneksel Sanatlar�m�z�n Modern Yorumlar�</h3>
                                <p class="snk-recent-post-excerpt">Gen� sanat��lar geleneksel sanatlar�m�z� modern yorumlarla nas�l ya�at�yor?</p>
                                <div class="snk-recent-post-meta">
                                    <span><i class="fas fa-calendar"></i> 5 �ubat 2025</span>
                                    <span><i class="fas fa-user"></i> Mehmet Demir</span>
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

    <!-- Mobil Men� Butonu -->
    <button class="snk-mobile-menu-btn" id="mobileSidebarToggle">
        <i class="fas fa-bars"></i>
    </button>

    <!-- Blog Olu�turma Popup HTML Yap�s� -->
    <div class="snk-blog-create-container" id="snk_blogCreateContainer" style="display: none;">
        <!-- Bu container dinamik olarak doldurulacak -->
    </div>

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
    <script src="assets/components/categories.js"></script>
    <!-- Sayfa �zel scriptleri -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            console.log('Kategoriler sayfas� �zel scriptleri y�kleniyor...');

            // ��k�� butonunu ayarla
            const logoutBtn = document.getElementById('snk_logout_btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    console.log('��k�� butonuna t�kland�');

                    // Kullan�c� bilgilerini localStorage'den sil
                    localStorage.removeItem('snk_currentUser');
                    localStorage.removeItem('snk_isLoggedIn');

                    alert('Ba�ar�yla ��k�� yap�ld�.');

                    // Ana sayfaya y�nlendir
                    window.location.href = '/assets/main.aspx';
                });
                console.log('��k�� butonu olay� tan�mland�');
            }

            // NOT: Buradaki olu�tur butonu kontrol� kald�r�ld�, login-handler.js dosyas�ndaki setupCreateButton() fonksiyonu kullan�lacak
        });
    </script>
</body>
</html>
