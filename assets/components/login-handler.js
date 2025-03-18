/**
 * Login Popup Handler - Senirkent Blog
 * Bu dosya login popup'ý ve form iþlemlerini yönetir.
 */

// Login popup ile ilgili global deðiþkenler
const loginPopup = document.getElementById('snk_loginPopup');
const loginCloseBtn = document.getElementById('snk_loginCloseBtn');
const passwordToggleBtn = document.getElementById('snk_login_toggle_password');
const passwordInput = document.getElementById('loginPassword');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('snk_login_btn');
const createBtn = document.getElementById('snk_create_btn'); // Oluþtur butonu

// Sayfa yüklendiðinde son yazýlarý göster
document.addEventListener('DOMContentLoaded', function () {
    console.log('Login Handler baþlatýldý!');
    initLoginPopup(); // Login popup'ýný baþlat
    setupCreateButton(); // Oluþtur butonunu ayarla
    updateRecentPostsDisplay(); // Son yazýlarý göster
});

// Login popup ve butonlarýný baþlat
function initLoginPopup() {
    console.log('Login popup baþlatýlýyor...');

    // Login butonuna týklandýðýnda popup'ý aç
    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openLoginPopup();
        });
        console.log('Login butonu tanýmlandý');
    } else {
        console.error('Login butonu bulunamadý!');
    }

    // Popup dýþýna týklandýðýnda kapat (opsiyonel)
    if (loginPopup) {
        loginPopup.addEventListener('click', function (e) {
            // Popup dýþýna týklanýrsa kapat
            if (e.target === loginPopup) {
                closeLoginPopup();
            }
        });
        console.log('Login popup tanýmlandý');
    } else {
        console.error('Login popup bulunamadý!');
    }

    // Kapatma butonuna týklandýðýnda popup'ý kapat
    if (loginCloseBtn) {
        loginCloseBtn.addEventListener('click', closeLoginPopup);
        console.log('Kapatma butonu tanýmlandý');
    } else {
        console.error('Kapatma butonu bulunamadý!');
    }

    // Þifre göster/gizle butonu
    if (passwordToggleBtn && passwordInput) {
        passwordToggleBtn.addEventListener('click', togglePassword);
        console.log('Þifre toggle butonu tanýmlandý');
    } else {
        console.error('Þifre toggle butonu veya password input bulunamadý!', {
            toggleBtn: !!passwordToggleBtn,
            passwordInput: !!passwordInput
        });
    }

    // Login formunu yönet
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login formu tanýmlandý');
    } else {
        console.error('Login formu bulunamadý!');
    }

    // Þifremi unuttum linklerini kontrol et ve event listener ekle
    setupForgotPasswordLinks();
}

// Þifremi unuttum linklerini ayarla
function setupForgotPasswordLinks() {
    document.addEventListener('click', function (e) {
        // Þifremi unuttum linkine týklandýysa
        if (e.target && (e.target.classList.contains('snk-forgot-password') || e.target.closest('.snk-forgot-password'))) {
            e.preventDefault();

            // Tüm popuplarý kapat
            clearAllPopups();

            // localStorage'a bildirim mesajý ekle
            localStorage.setItem('snk_notification', 'Þifrenizi mi unuttunuz? Lütfen iletiþim formundan bizimle iletiþime geçin.');

            // Ýletiþim sayfasýna yönlendir
            window.location.href = 'communication.html';
        }
    });
}

// Login popup'ý aç
function openLoginPopup() {
    console.log('Login popup açýlýyor...');

    // Önce diðer tüm popuplarý temizle
    clearAllPopups();

    // Eðer statik login popup varsa onu kullan, yoksa dinamik oluþtur
    const existingLoginPopup = document.getElementById('snk_loginPopup');
    if (existingLoginPopup) {
        existingLoginPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa scrollunu devre dýþý býrak
    } else {
        // Statik popup bulunamadý, dinamik oluþtur
        showLoginPopup();
    }
}

// Login popup'ý kapat
function closeLoginPopup(e) {
    if (e) e.preventDefault();
    console.log('Login popup kapatýlýyor...');

    if (loginPopup) {
        loginPopup.classList.remove('active');
        document.body.style.overflow = ''; // Sayfa scrollunu tekrar aktifleþtir
    } else {
        console.error('Login popup kapatýlamadý!');
    }
}

// Þifre göster/gizle
function togglePassword(e) {
    e.preventDefault();
    console.log('Þifre görünürlüðü deðiþtiriliyor...');

    if (passwordInput) {
        // Þifre tipini deðiþtir
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Ýkonu deðiþtir
        const icon = passwordToggleBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    } else {
        console.error('Þifre görünürlüðü deðiþtirilemedi!');
    }
}

// Login formunu iþle
function handleLogin(e) {
    e.preventDefault();
    console.log('Login formu gönderiliyor...');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('snk_remember_me').checked;

    // Login iþlemleri burada gerçekleþecek
    // Örnek bir kontrol
    if (email && password) {
        // LocalStorage'dan kullanýcýlarý kontrol et
        const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
        const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');
        const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');

        // Kullanýcýyý ara ve kullanýcý durumunu kontrol et
        let user = users.find(u => u.email === email && u.password === password) ||
            verifiedUsers.find(u => u.email === email && u.password === password);

        // Onay bekleyen kullanýcý kontrolü
        const isPending = pendingUsers.find(u => u.email === email && u.password === password);

        if (isPending) {
            // Kullanýcý onay bekliyor
            showLoginMessage('Hesabýnýz henüz onaylanmamýþ. Lütfen admin onayýný bekleyin.', 'error');
            return;
        }

        if (user) {
            // Güvenlik kontrolü: Kullanýcýnýn isVerified veya isActive durumu kontrol et
            if (user.isVerified === false) {
                showLoginMessage('Hesabýnýz henüz doðrulanmamýþ. Lütfen doðrulama iþlemini tamamlayýn.', 'error');
                return;
            }

            // Giriþ baþarýlý
            showLoginMessage('Giriþ baþarýlý! Yönlendiriliyorsunuz...', 'success');

            // Kullanýcý bilgilerini sakla
            const currentUser = {
                ...user,
                isLoggedIn: true,
                lastLoginAt: new Date().toISOString()
            };
            localStorage.setItem('snk_currentUser', JSON.stringify(currentUser));

            // 1 saniye sonra sayfayý yeniden yükle
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            // Giriþ baþarýsýz
            showLoginMessage('E-posta veya þifre hatalý!', 'error');
        }
    } else {
        // Formda eksik bilgi var
        showLoginMessage('Lütfen tüm alanlarý doldurun!', 'error');
    }
}

// Login mesajýný göster
function showLoginMessage(message, type) {
    const alertBox = document.getElementById('loginAlertBox');

    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = 'snk-form-message';
        alertBox.classList.add(`snk-${type}-message`);
        alertBox.style.display = 'block';

        // 5 saniye sonra mesajý gizle
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    }
}

// Oluþtur butonunu ayarla
function setupCreateButton() {
    console.log('Oluþtur butonu ayarlanýyor...');

    const createButton = document.querySelector('.snk-create-btn');
    if (createButton) {
        createButton.addEventListener('click', function (e) {
            console.log("Oluþtur butonuna týklandý");
            const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || localStorage.getItem('snk_current_user') || '{}');

            if (currentUser && (currentUser.username || currentUser.isLoggedIn)) {
                console.log("Kullanýcý giriþ yapmýþ, blog oluþturma gösteriliyor");
                showBlogCreatePopup(currentUser);
            } else {
                console.log("Kullanýcý giriþ yapmamýþ, login popup gösteriliyor");

                // Önce olasý açýk popup'larý temizle
                clearAllPopups();

                // Login popup'ýný göster
                const loginPopup = document.getElementById('snk_loginPopup');
                if (loginPopup) {
                    loginPopup.classList.add('active');
                } else {
                    showLoginPopup(); // Alternatif yöntem
                }
            }
        });
        console.log("Oluþtur butonu olayý tanýmlandý");
    } else {
        console.error("Oluþtur butonu bulunamadý!");
    }
}

// Tüm popup'larý temizleyen yardýmcý fonksiyon
function clearAllPopups() {
    const existingPopups = document.querySelectorAll('.snk-popup-overlay, .snk-create-post-popup, #blogCreatePopup');
    existingPopups.forEach(popup => {
        popup.classList.remove('active');
        if (popup.id !== 'snk_loginPopup') {
            popup.remove();
        }
    });
}

// Blog yazýsý oluþturma popup'ýný göster
function showBlogCreatePopup(user) {
    console.log("showBlogCreatePopup çaðrýldý, tüm popuplar temizleniyor");

    // Mevcut açýk popup'larý temizle (KAPAT)
    const existingPopups = document.querySelectorAll('.snk-popup-overlay, .snk-create-post-popup');
    if (existingPopups.length > 0) {
        console.log(`${existingPopups.length} adet popup temizleniyor`);
        existingPopups.forEach(popup => {
            popup.classList.remove('active');
            popup.remove(); // Hemen kaldýr, timeout kullanma
        });
    }

    // Popup HTML yapýsýný oluþtur
    const popupHTML = `
    <div class="snk-popup-overlay" id="blogCreatePopup">
        <div class="snk-popup-container">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">Yeni Blog Yazýsý</h2>
                <button class="snk-popup-close-btn" id="blogCreateCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-popup-content">
                <form class="snk-create-post-form">
                    <div class="snk-form-group">
                        <label for="post-title">Baþlýk</label>
                        <input type="text" id="post-title" class="snk-form-control" placeholder="Blog yazýnýzýn baþlýðýný girin" required>
                    </div>
                    
                    <div class="snk-form-group">
                        <label for="post-category">Kategori</label>
                        <select id="post-category" class="snk-form-control" required>
                            <option value="" disabled selected>Kategori seçin</option>
                            <option value="akademik-destek">Akademik Destek</option>
                            <option value="kariyer-staj">Kariyer ve Staj</option>
                            <option value="sosyal-hayat">Sosyal Hayat</option>
                            <option value="psikolojik-destek">Psikolojik Destek</option>
                            <option value="burs-firsatlar">Burs ve Fýrsatlar</option>
                            <option value="random">Random</option>
                        </select>
                    </div>
                    
                    <div class="snk-form-group">
                        <label for="post-content">Ýçerik</label>
                        <textarea id="post-content" class="snk-form-control" placeholder="Blog yazýnýzýn içeriðini girin" rows="8" required></textarea>
                    </div>
                    
                    <div class="snk-form-group">
                        <label for="post-tags">Etiketler (# ile ayýrýn)</label>
                        <input type="text" id="post-tags" class="snk-form-control" placeholder="Örn: #teknoloji #yazýlým #web">
                        <div class="snk-tags-preview"></div>
                    </div>
                    
                    <div class="snk-form-group">
                        <label for="post-image">Kapak Görseli</label>
                        <div class="snk-image-upload">
                            <input type="file" id="post-image" class="snk-image-input" accept="image/*">
                            <label for="post-image" class="snk-image-label">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>Görsel Seçin veya Sürükleyin</span>
                            </label>
                            <div class="snk-image-preview"></div>
                        </div>
                    </div>
                    
                    <div class="snk-form-actions">
                        <button type="button" class="snk-form-button snk-cancel-button" id="blogCancelBtn">Ýptal</button>
                        <button type="submit" class="snk-form-button snk-submit-button">Yazýyý Yayýnla</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;

    // Popup'ý body'ye ekle
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Popup'ý göster
    const popup = document.getElementById('blogCreatePopup');
    setTimeout(() => {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Arka planý kaydýrmayý engelle
    }, 10);

    // Kapat butonuna týklanýnca popup'ý kapat
    document.getElementById('blogCreateCloseBtn').addEventListener('click', function () {
        closePopup(popup);
    });

    // Ýptal butonuna týklanýnca popup'ý kapat
    document.getElementById('blogCancelBtn').addEventListener('click', function () {
        closePopup(popup);
    });

    // Popup dýþýna týklandýðýnda kapat
    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            closePopup(popup);
        }
    });

    // Form gönderildiðinde blog yazýsýný kaydet
    const form = document.querySelector('.snk-create-post-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;
        const tagsInput = document.getElementById('post-tags').value;
        const tags = tagsInput ? tagsInput.split('#').filter(tag => tag.trim() !== '').map(tag => tag.trim()) : [];

        // Görsel için base64 veri URL'sini al
        let imageUrl = '../public/images/blog-placeholder.jpg';
        const imagePreview = document.querySelector('.snk-image-preview img');
        if (imagePreview && imagePreview.src) {
            imageUrl = imagePreview.src;
        }

        // Blog yazýsý nesnesini oluþtur
        const blogPost = {
            id: Date.now(),
            title: title,
            category: category,
            summary: content.substring(0, 150) + '...',  // Ýlk 150 karakteri özet olarak al
            content: content,
            tags: tags,
            author: user.username || user.name || 'Anonim',
            author_id: user.id || Date.now().toString(),
            date: new Date().toLocaleDateString('tr-TR'),
            views: 0,
            image: imageUrl,
            status: 'pending',  // Onay bekliyor durumu
            createdDate: new Date().toLocaleDateString('tr-TR')
        };

        // Mevcut blog yazýlarýný al
        let blogPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

        // Eðer fazla post varsa, localStorage dolmasýný önlemek için
        // en eski postlarý sadeleþtir (içeriklerini kýsalt)
        if (blogPosts.length > 10) {
            console.log('Blog yazýlarý sýnýrý aþýldý, eski yazýlar optimize ediliyor...');

            // En eski yazýlarý bul ve optimize et (ilk 5 yazý)
            for (let i = 0; i < Math.min(5, blogPosts.length); i++) {
                if (blogPosts[i].content && blogPosts[i].content.length > 200) {
                    // Ýçeriði kýsalt ve optimize edildiðini belirt
                    blogPosts[i].content = blogPosts[i].content.substring(0, 200) + '...';
                    blogPosts[i].optimized = true;
                }
            }
        }

        // Yeni yazýyý ekle
        blogPosts.push(blogPost);

        // localStorage'a kaydet - kotayý aþarsa düzgün hata yönetimi saðla
        try {
            localStorage.setItem('snk_blog_posts', JSON.stringify(blogPosts));
        } catch (storageError) {
            console.warn('LocalStorage kotasý aþýldý, eski yazýlar temizleniyor...');

            // Kota aþýlýrsa, daha agresif bir temizlik yap
            // En eski 5 yazýyý tamamen kaldýr
            if (blogPosts.length > 5) {
                blogPosts = blogPosts.slice(5);
                blogPosts.push(blogPost); // Yeni yazýyý tekrar ekle
                localStorage.setItem('snk_blog_posts', JSON.stringify(blogPosts));
            } else {
                // Yazýlar çok büyük, tüm yazýlarý sil ve sadece yeni yazýyý kaydet
                localStorage.setItem('snk_blog_posts', JSON.stringify([blogPost]));
            }
        }

        // Kullanýcýnýn kendi blog yazýlarýný optimize et ve güncelle
        try {
            let userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${user.id}`) || '[]');

            // Eðer kullanýcýnýn çok yazýsý varsa, eski yazýlarý optimize et
            if (userPosts.length > 15) {
                for (let i = 0; i < Math.min(10, userPosts.length); i++) {
                    if (userPosts[i].content && userPosts[i].content.length > 200) {
                        userPosts[i].content = userPosts[i].content.substring(0, 200) + '...';
                        userPosts[i].optimized = true;
                    }
                }
            }

            userPosts.push(blogPost);
            localStorage.setItem(`snk_user_posts_${user.id}`, JSON.stringify(userPosts));
        } catch (userStorageError) {
            // Kullanýcý yazýlarý için kota aþýlýrsa, en eski yazýlarý sil
            console.warn('Kullanýcý yazýlarý için LocalStorage kotasý aþýldý, temizleniyor...');
            localStorage.setItem(`snk_user_posts_${user.id}`, JSON.stringify([blogPost]));
        }

        // Kullanýcý bilgilerini sakla
        const currentUser = {
            ...user,
            isLoggedIn: true
        };
        localStorage.setItem('snk_currentUser', JSON.stringify(currentUser));

        // Bildirim göster
        showNotification('Blog yazýnýz baþarýyla kaydedildi!', 'success');

        // 1 saniye sonra sayfayý yeniden yükle
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });

    // Görsel yükleme fonksiyonalitesi
    const imageInput = document.getElementById('post-image');
    const imagePreview = document.querySelector('.snk-image-preview');

    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.innerHTML = `
                    <div class="snk-preview-container">
                        <img src="${e.target.result}" alt="Seçilen görsel">
                        <button type="button" class="snk-remove-image">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;

                // Görseli kaldýrma butonu için event listener
                document.querySelector('.snk-remove-image').addEventListener('click', function () {
                    imagePreview.innerHTML = '';
                    imageInput.value = '';
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Etiket önizlemesi
    const tagsInput = document.getElementById('post-tags');
    const tagsPreview = document.querySelector('.snk-tags-preview');

    tagsInput.addEventListener('input', function () {
        const tags = this.value.split('#').filter(tag => tag.trim() !== '');

        if (tags.length > 0) {
            tagsPreview.innerHTML = tags.map(tag =>
                `<span class="snk-tag-item">#${tag.trim()}</span>`
            ).join('');
        } else {
            tagsPreview.innerHTML = '';
        }
    });
}

// Popup'ý kapat
function closePopup(popup) {
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.remove();
            document.body.style.overflow = ''; // Arka plan kaydýrmayý tekrar etkinleþtir
        }, 300);
    }
}

// Blog yazýsý oluþturma popup'ýný göster
function showLoginPopup() {
    console.log('showLoginPopup çaðrýldý');

    // Önce tüm popuplarý temizle
    clearAllPopups();

    // HTML içinde statik olarak tanýmlanmýþ bir login popup var mý kontrol et
    const existingLoginPopup = document.getElementById('snk_loginPopup');
    if (existingLoginPopup) {
        console.log('Statik login popup bulundu, onu kullanýyoruz');
        existingLoginPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa scrollunu devre dýþý býrak

        // Kapatma butonunu ayarla
        const closeBtn = document.getElementById('snk_loginCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                existingLoginPopup.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Submit butonuna olay dinleyicisi ekle
        setupLoginFormHandlers();

        return; // Statik popup bulundu, dinamik oluþturmaya gerek yok
    }

    // Statik popup yoksa, dinamik oluþtur (eski kod)
    console.log('Statik login popup bulunamadý, dinamik oluþturulacak');
    // Popup HTML yapýsýný oluþtur - Yeni tasarým
    const popupHTML = `
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
    </div>`;

    // Popup'ý body'ye ekle
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Popup'ý göster
    const popup = document.getElementById('snk_loginPopup');
    setTimeout(() => {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Arka planý kaydýrmayý engelle
    }, 10);

    // Kapat butonuna týklanýnca popup'ý kapat
    document.getElementById('snk_loginCloseBtn').addEventListener('click', function () {
        closePopup(popup);
    });

    // Popup dýþýna týklandýðýnda kapat
    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            closePopup(popup);
        }
    });

    // Þifre görme butonunu aktifleþtir
    const passwordToggleButton = document.getElementById('snk_login_toggle_password');
    const passwordInputField = document.getElementById('loginPassword');

    if (passwordToggleButton && passwordInputField) {
        passwordToggleButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Þifre tipini deðiþtir
            const type = passwordInputField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInputField.setAttribute('type', type);

            // Ýkonu deðiþtir
            const icon = passwordToggleButton.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // Form gönderildiðinde login iþlemini gerçekleþtir
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('snk_remember_me').checked;

        // Login iþlemleri burada gerçekleþecek
        // Örnek bir kontrol
        if (email && password) {
            // LocalStorage'dan kullanýcýlarý kontrol et
            const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
            const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');
            const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');

            // Kullanýcýyý ara ve kullanýcý durumunu kontrol et
            let user = users.find(u => u.email === email && u.password === password) ||
                verifiedUsers.find(u => u.email === email && u.password === password);

            // Onay bekleyen kullanýcý kontrolü
            const isPending = pendingUsers.find(u => u.email === email && u.password === password);

            if (isPending) {
                // Kullanýcý onay bekliyor
                showLoginMessage('Hesabýnýz henüz onaylanmamýþ. Lütfen admin onayýný bekleyin.', 'error');
                return;
            }

            if (user) {
                // Güvenlik kontrolü: Kullanýcýnýn isVerified veya isActive durumu kontrol et
                if (user.isVerified === false) {
                    showLoginMessage('Hesabýnýz henüz doðrulanmamýþ. Lütfen doðrulama iþlemini tamamlayýn.', 'error');
                    return;
                }

                // Giriþ baþarýlý
                showLoginMessage('Giriþ baþarýlý! Yönlendiriliyorsunuz...', 'success');

                // Kullanýcý bilgilerini sakla
                const currentUser = {
                    ...user,
                    isLoggedIn: true,
                    lastLoginAt: new Date().toISOString()
                };
                localStorage.setItem('snk_currentUser', JSON.stringify(currentUser));

                // 1 saniye sonra sayfayý yeniden yükle
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // Giriþ baþarýsýz
                showLoginMessage('E-posta veya þifre hatalý!', 'error');
            }
        } else {
            // Formda eksik bilgi var
            showLoginMessage('Lütfen tüm alanlarý doldurun!', 'error');
        }
    });
}

// Blog yazýsý silme iþlemi
function deleteBlogPost(postId) {
    console.log(`${postId} ID'li blog yazýsý için silme iþlemi baþlatýldý`);

    // Silme onay popup'ýný oluþtur
    const confirmPopupHTML = `
    <div class="snk-popup-overlay active" id="snk_confirmDeletePopup">
        <div class="snk-popup-container snk-confirm-popup">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">Blog Yazýsýný Sil</h2>
                <button class="snk-popup-close-btn" id="snk_confirmCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-popup-content">
                <p class="snk-confirm-message">Bu blog yazýsýný silmek istediðinize emin misiniz? Bu iþlem geri alýnamaz.</p>
                <div class="snk-confirm-buttons">
                    <button id="snk_cancelDeleteBtn" class="snk-cancel-btn">Ýptal</button>
                    <button id="snk_confirmDeleteBtn" class="snk-confirm-btn">Sil</button>
                </div>
            </div>
        </div>
    </div>`;

    // Önce tüm popuplarý temizle
    const existingPopups = document.querySelectorAll('.snk-popup-overlay');
    existingPopups.forEach(popup => popup.remove());

    // Popup'ý sayfaya ekle
    document.body.insertAdjacentHTML('beforeend', confirmPopupHTML);
    document.body.style.overflow = 'hidden';

    // Kapatma ve iptal butonlarýný ayarla
    const closeBtn = document.getElementById('snk_confirmCloseBtn');
    const cancelBtn = document.getElementById('snk_cancelDeleteBtn');
    const confirmBtn = document.getElementById('snk_confirmDeleteBtn');

    function closePopup() {
        const popup = document.getElementById('snk_confirmDeletePopup');
        if (popup) {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (cancelBtn) cancelBtn.addEventListener('click', closePopup);

    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            // Kullanýcý bilgilerini al
            const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || '{}');

            // Kullanýcýnýn yazýlarýný al ve güncelle
            let userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${currentUser.id}`) || '[]');
            const updatedUserPosts = userPosts.filter(post => post.id.toString() !== postId.toString());

            // Kullanýcýnýn güncellenmiþ yazýlarýný kaydet
            localStorage.setItem(`snk_user_posts_${currentUser.id}`, JSON.stringify(updatedUserPosts));

            // Genel blog yazýlarýný al ve güncelle
            const blogPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
            const updatedBlogPosts = blogPosts.filter(post => post.id.toString() !== postId.toString());

            // Güncellenmiþ blog yazýlarýný localStorage'a kaydet
            localStorage.setItem('snk_blog_posts', JSON.stringify(updatedBlogPosts));

            // Admin panelindeki onay bekleyen yazýlarý da güncelle
            const pendingPosts = JSON.parse(localStorage.getItem('snk_pending_posts') || '[]');
            const updatedPendingPosts = pendingPosts.filter(post => post.id.toString() !== postId.toString());
            localStorage.setItem('snk_pending_posts', JSON.stringify(updatedPendingPosts));

            // Admin panelindeki onaylanmýþ yazýlarý da güncelle
            const approvedPosts = JSON.parse(localStorage.getItem('snk_approved_posts') || '[]');
            const updatedApprovedPosts = approvedPosts.filter(post => post.id.toString() !== postId.toString());
            localStorage.setItem('snk_approved_posts', JSON.stringify(updatedApprovedPosts));

            // Sayfadaki tüm eþleþen yazýlarý DOM'dan kaldýr
            const postElements = document.querySelectorAll(`[data-post-id="${postId}"]`);
            console.log(`Silinen yazý için ${postElements.length} adet DOM elemaný bulundu`);

            postElements.forEach(element => {
                const postCard = element.closest('.snk-user-post-card, .snk-blog-card, .snk-post-card, .snk-admin-post-item');
                if (postCard) {
                    postCard.classList.add('removing');
                    setTimeout(() => {
                        postCard.remove();
                    }, 300);
                }
            });

            // Admin paneline bildirim gönder (eðer olay ileticisi varsa)
            if (window.dispatchEvent) {
                const deleteEvent = new CustomEvent('blogPostDeleted', {
                    detail: { postId: postId, userId: currentUser.id }
                });
                window.dispatchEvent(deleteEvent);
                console.log('Admin paneline silme bildirimi gönderildi:', postId);
            }

            // Kullanýcýya bildirim göster
            showNotification('Blog yazýsý baþarýyla silindi', 'success');

            // Son yazýlar gösterimini güncelle
            if (typeof updateRecentPostsDisplay === 'function') {
                updateRecentPostsDisplay();
            }

            // Profil sayfasýndaki yazýlar tabýný güncelle
            if (typeof updateUserPostsDisplay === 'function') {
                updateUserPostsDisplay();
            }

            // Popup'ý kapat
            closePopup();
        });
    }
}

// Son yazýlarýn gösterimini güncelle
function updateRecentPostsDisplay() {
    const recentPostsContainer = document.querySelector('.snk-recent-posts');
    if (!recentPostsContainer) return;

    // Blog yazýlarýný localStorage'dan al
    const blogPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

    // Son 6 yazýyý al
    const recentPosts = blogPosts.slice(-6).reverse();

    // HTML oluþtur
    const postsHTML = recentPosts.map(post => `
        <div class="snk-post-card" data-post-id="${post.id}">
            <div class="snk-post-image">
                <img src="${post.image || '../public/images/blog-placeholder.jpg'}" alt="${post.title}">
                <span class="snk-post-category">${post.category}</span>
            </div>
            <div class="snk-post-content">
                <h3 class="snk-post-title">${post.title}</h3>
                <p class="snk-post-summary">${post.summary}</p>
                <div class="snk-post-meta">
                    <span><i class="far fa-user"></i> ${post.author}</span>
                    <span><i class="far fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
                    <span><i class="far fa-eye"></i> ${post.views} görüntülenme</span>
                </div>
                <div class="snk-post-tags">
                    ${post.tags.map(tag => `<span class="snk-tag">${tag}</span>`).join('')}
                </div>
                <button class="snk-read-more-btn" data-post-id="${post.id}">Devamýný Oku</button>
            </div>
        </div>
    `).join('');

    // Ýçeriði güncelle
    recentPostsContainer.innerHTML = postsHTML;

    // "Devamýný Oku" butonlarýna týklama olayý ekle
    const readMoreButtons = document.querySelectorAll('.snk-read-more-btn');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const postId = this.getAttribute('data-post-id');
            openBlogPostPopup(postId);
        });
    });
}

// Blog yazýsýný popup'da açma
function openBlogPostPopup(postId) {
    // Blog yazýlarýný localStorage'dan al
    const blogPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

    // ID'ye göre blog yazýsýný bul
    const post = blogPosts.find(post => post.id == postId);
    if (!post) return;

    // Blog yazýsýnýn görüntülenme sayýsýný arttýr
    post.views += 1;
    localStorage.setItem('snk_blog_posts', JSON.stringify(blogPosts));

    // Popup içeriðini oluþtur
    const popupHTML = `
        <div class="snk-popup-container snk-blog-post-popup">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">${post.title}</h2>
                <button class="snk-popup-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-popup-content">
                <div class="snk-blog-post-image">
                    <img src="${post.image || '../public/images/blog-placeholder.jpg'}" alt="${post.title}">
                    <span class="snk-post-category">${post.category}</span>
                </div>
                <div class="snk-blog-post-meta">
                    <span><i class="far fa-user"></i> ${post.author}</span>
                    <span><i class="far fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
                    <span><i class="far fa-eye"></i> ${post.views} görüntülenme</span>
                </div>
                <div class="snk-blog-post-tags">
                    ${post.tags.map(tag => `<span class="snk-tag">${tag}</span>`).join('')}
                </div>
                <div class="snk-blog-post-content">
                    <p class="snk-post-summary">${post.summary}</p>
                    <div class="snk-post-full-content">${post.content}</div>
                </div>
            </div>
        </div>
    `;

    // Popup'ý ekle ve göster
    const popupElement = document.createElement('div');
    popupElement.innerHTML = popupHTML;
    document.body.appendChild(popupElement.firstElementChild);

    const popupContainer = document.querySelector('.snk-blog-post-popup');
    setTimeout(() => {
        popupContainer.classList.add('active');
    }, 50);

    // Popup'ý kapatma düðmesine olay ekle
    popupContainer.querySelector('.snk-popup-close-btn').addEventListener('click', () => {
        closePopup(popupContainer);
    });
}

// Mobil cihazlar için özel ayarlamalar
function setupMobileCompatibility() {
    // Ekran geniþliðini kontrol et
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Mobil cihazlar için ek ayarlar yapýlabilir
        console.log('Mobil cihaz tespit edildi, özel ayarlar yapýlýyor...');

        // Örnek: Mobil cihazlarda popup geniþliðini ayarla
        if (loginPopup) {
            const popupContainer = loginPopup.querySelector('.snk-popup-container');
            if (popupContainer) {
                popupContainer.style.width = '95%';
                popupContainer.style.maxWidth = '450px';
            }
        }
    }
}

// Ekran boyutu deðiþtiðinde mobil uyumluluðu kontrol et
window.addEventListener('resize', setupMobileCompatibility);

// Ýlk yüklemede mobil uyumluluðu kontrol et
setupMobileCompatibility();

// Bildirim gösterme fonksiyonu
function showNotification(message, type = 'info') {
    // Varsa eski bildirimi kaldýr
    const existingNotification = document.querySelector('.snk-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Yeni bildirim oluþtur
    const notification = document.createElement('div');
    notification.className = `snk-notification ${type}`;

    // Ýkon seç
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';

    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;

    // Sayfaya ekle
    document.body.appendChild(notification);

    // Animasyonu baþlat
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Otomatik kapat
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Blog yazýsýnýn onaya gönderildiðini bildiren onay popup'ý göster
function showApprovalPendingNotification() {
    // Önceki popup varsa kaldýr
    const existingNotification = document.getElementById('approval-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Notifikasyon HTML'i oluþtur
    const notificationHTML = `
    <div id="approval-notification" class="snk-notification-overlay">
        <div class="snk-notification-container">
            <div class="snk-notification-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Blog Yazýnýz Baþarýyla Oluþturuldu!</h3>
            <p>Blog yazýnýz baþarýyla kaydedildi ve þu anda yönetici onayý bekliyor.</p>
            <p>Yazýnýz onaylandýðýnda tüm kullanýcýlar tarafýndan görülebilecek.</p>
            <button id="understand-button" class="snk-notification-button">Anladým</button>
        </div>
    </div>`;

    // Notifikasyonu ekle
    document.body.insertAdjacentHTML('beforeend', notificationHTML);

    // Notifikasyonu göster
    const notification = document.getElementById('approval-notification');
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);

    // Anladým butonuna týklanýnca notifikasyonu kapat
    document.getElementById('understand-button').addEventListener('click', function () {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Kullanýcý blog yazýlarýný görüntüle
function updateUserPostsDisplay() {
    console.log("Kullanýcý yazýlarý görüntüleme fonksiyonu çaðrýldý");

    // Kullanýcý oturum durumunu kontrol et
    const user = JSON.parse(localStorage.getItem('snk_currentUser') || localStorage.getItem('snk_current_user') || 'null');
    if (!user) {
        console.log("Oturum açýk deðil, kullanýcý yazýlarý görüntülenemez");
        return;
    }

    // Kullanýcý yazýlarýný al
    const userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${user.id}`) || '[]');
    console.log(`${userPosts.length} adet kullanýcý yazýsý bulundu`);

    // Eðer kullanýcý yazýlarý boþsa, genel blog yazýlarýndan kullanýcýya ait olanlarý da kontrol et
    if (userPosts.length === 0) {
        const allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
        const userPostsFromAll = allPosts.filter(post => post.author_id === user.id);

        // Kullanýcýya ait yazýlar varsa bunlarý kullanýcý yazýlarýna da ekleyelim
        if (userPostsFromAll.length > 0) {
            localStorage.setItem(`snk_user_posts_${user.id}`, JSON.stringify(userPostsFromAll));
            console.log(`Genel blog yazýlarýndan ${userPostsFromAll.length} adet yazý kullanýcý yazýlarýna eklendi`);
            updateUserPostsDisplay(); // Güncellenmiþ listeyi göstermek için tekrar çaðýr
            return;
        }
    }

    // Yazýlarýn görüntüleneceði container'ý bul
    const postsContainer = document.querySelector('.snk-user-posts');
    if (!postsContainer) {
        console.error("Yazýlar container'ý bulunamadý");
        return;
    }

    // Yükleniyor mesajýný temizle
    postsContainer.innerHTML = '';

    // Eðer yazý yoksa, bilgi mesajý göster
    if (userPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="snk-no-posts">
                <i class="fas fa-pen-nib"></i>
                <p>Henüz bir blog yazýsý yazmadýnýz.</p>
                <button class="snk-action-btn">
                    <i class="fas fa-plus-circle"></i> Ýlk Yazýný Oluþtur
                </button>
            </div>
        `;

        // Ýlk yazý oluþtur butonuna týklama olayý ekle
        const createButton = postsContainer.querySelector('.snk-action-btn');
        if (createButton) {
            createButton.addEventListener('click', function () {
                if (window.showBlogCreatePopup) {
                    window.showBlogCreatePopup(user);
                }
            });
        }

        return;
    }

    // Yazýlarý tarihe göre sýrala (en yeniden en eskiye)
    userPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Her bir yazý için kart oluþtur ve ekle
    userPosts.forEach((post, index) => {
        // Gecikme efekti için index'i kullan
        const delay = index * 0.1;

        // Kart HTML'ini oluþtur
        const postCard = document.createElement('div');
        postCard.className = 'snk-user-post-card fade-in';
        postCard.style.animationDelay = `${delay}s`;

        // Kartýn içeriðini oluþtur
        postCard.innerHTML = `
            <div class="snk-user-post-image">
                <img src="${post.image || '../public/images/placeholder.jpg'}" alt="${post.title}">
                <span class="snk-user-post-category" data-category="${post.category}">${post.category}</span>
            </div>
            <div class="snk-user-post-content">
                <h3 class="snk-user-post-title">${post.title}</h3>
                <p class="snk-user-post-excerpt">${post.summary || post.content.substring(0, 150) + '...'}</p>
                <div class="snk-user-post-meta">
                    <span><i class="fas fa-calendar"></i> ${post.date}</span>
                    <span><i class="fas fa-eye"></i> ${post.views || 0} Okunma</span>
                </div>
            </div>
            <div class="snk-user-post-actions">
              <button class="snk-action-btn snk-like-button" data-post-id="1741484977975" style="background: #007bff; color: white; border-radius: 20px; padding: 6px 12px; border: none; cursor: pointer;">
                                <i class="far fa-thumbs-up" style="margin-right: 5px;"></i> Beðen
                                <span class="snk-like-count" style="font-weight: bold;">0</span>
                            </button>           <button class="snk-action-btn snk-comment-button" data-post-id="1741484977975" style="background: black; color: white; border-radius: 20px; padding: 6px 12px; border: none; cursor: pointer;">
                                <i class="far fa-comment" style="margin-right: 5px;"></i> Yorum Yap
                            </button>
               <button class="snk-action-btn snk-share-button" data-post-id="1741484977975" style="background: #007bff; color: white; border-radius: 20px; padding: 6px 12px; border: none; cursor: pointer;">
                                <i class="far fa-share-square" style="margin-right: 5px;"></i> Paylaþ
                            </button>
                <button class="snk-post-action-btn delete-btn" data-action="delete" data-post-id="${post.id}" style="background: #ff3852; color: white; border-radius: 20px; padding: 6px 12px; border: none; cursor: pointer;">
                    <i class="far fa-trash-alt" style="margin-right: 5px;"></i> Sil
                </button>
            </div>
        `;

        // Kartý container'a ekle
        postsContainer.appendChild(postCard);

        // Butonlar için olay dinleyicileri ekle
        const likeBtn = postCard.querySelector('[data-action="like"]');
        const commentBtn = postCard.querySelector('[data-action="comment"]');
        const shareBtn = postCard.querySelector('[data-action="share"]');
        const deleteBtn = postCard.querySelector('[data-action="delete"]');

        // Beðenme butonu
        if (likeBtn) {
            likeBtn.addEventListener('click', function () {
                const postId = this.getAttribute('data-post-id');
                likePost(postId, this);
            });
        }

        // Yorum butonu
        if (commentBtn) {
            commentBtn.addEventListener('click', function () {
                const postId = this.getAttribute('data-post-id');
                openCommentPopup(postId);
            });
        }

        // Paylaþ butonu
        if (shareBtn) {
            shareBtn.addEventListener('click', function () {
                const postId = this.getAttribute('data-post-id');
                openShareOptions(postId);
            });
        }

        // Silme butonu
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const postId = this.getAttribute('data-post-id');
                deleteBlogPost(postId);
            });
        }
    });
}

// Global eriþim için
window.showBlogCreatePopup = showBlogCreatePopup;
window.showApprovalPendingNotification = showApprovalPendingNotification;
window.updateUserPostsDisplay = updateUserPostsDisplay;
