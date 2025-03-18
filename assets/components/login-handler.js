/**
 * Login Popup Handler - Senirkent Blog
 * Bu dosya login popup'� ve form i�lemlerini y�netir.
 */

// Login popup ile ilgili global de�i�kenler
const loginPopup = document.getElementById('snk_loginPopup');
const loginCloseBtn = document.getElementById('snk_loginCloseBtn');
const passwordToggleBtn = document.getElementById('snk_login_toggle_password');
const passwordInput = document.getElementById('loginPassword');
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('snk_login_btn');
const createBtn = document.getElementById('snk_create_btn'); // Olu�tur butonu

// Sayfa y�klendi�inde son yaz�lar� g�ster
document.addEventListener('DOMContentLoaded', function () {
    console.log('Login Handler ba�lat�ld�!');
    initLoginPopup(); // Login popup'�n� ba�lat
    setupCreateButton(); // Olu�tur butonunu ayarla
    updateRecentPostsDisplay(); // Son yaz�lar� g�ster
});

// Login popup ve butonlar�n� ba�lat
function initLoginPopup() {
    console.log('Login popup ba�lat�l�yor...');

    // Login butonuna t�kland���nda popup'� a�
    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openLoginPopup();
        });
        console.log('Login butonu tan�mland�');
    } else {
        console.error('Login butonu bulunamad�!');
    }

    // Popup d���na t�kland���nda kapat (opsiyonel)
    if (loginPopup) {
        loginPopup.addEventListener('click', function (e) {
            // Popup d���na t�klan�rsa kapat
            if (e.target === loginPopup) {
                closeLoginPopup();
            }
        });
        console.log('Login popup tan�mland�');
    } else {
        console.error('Login popup bulunamad�!');
    }

    // Kapatma butonuna t�kland���nda popup'� kapat
    if (loginCloseBtn) {
        loginCloseBtn.addEventListener('click', closeLoginPopup);
        console.log('Kapatma butonu tan�mland�');
    } else {
        console.error('Kapatma butonu bulunamad�!');
    }

    // �ifre g�ster/gizle butonu
    if (passwordToggleBtn && passwordInput) {
        passwordToggleBtn.addEventListener('click', togglePassword);
        console.log('�ifre toggle butonu tan�mland�');
    } else {
        console.error('�ifre toggle butonu veya password input bulunamad�!', {
            toggleBtn: !!passwordToggleBtn,
            passwordInput: !!passwordInput
        });
    }

    // Login formunu y�net
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login formu tan�mland�');
    } else {
        console.error('Login formu bulunamad�!');
    }

    // �ifremi unuttum linklerini kontrol et ve event listener ekle
    setupForgotPasswordLinks();
}

// �ifremi unuttum linklerini ayarla
function setupForgotPasswordLinks() {
    document.addEventListener('click', function (e) {
        // �ifremi unuttum linkine t�kland�ysa
        if (e.target && (e.target.classList.contains('snk-forgot-password') || e.target.closest('.snk-forgot-password'))) {
            e.preventDefault();

            // T�m popuplar� kapat
            clearAllPopups();

            // localStorage'a bildirim mesaj� ekle
            localStorage.setItem('snk_notification', '�ifrenizi mi unuttunuz? L�tfen ileti�im formundan bizimle ileti�ime ge�in.');

            // �leti�im sayfas�na y�nlendir
            window.location.href = 'communication.html';
        }
    });
}

// Login popup'� a�
function openLoginPopup() {
    console.log('Login popup a��l�yor...');

    // �nce di�er t�m popuplar� temizle
    clearAllPopups();

    // E�er statik login popup varsa onu kullan, yoksa dinamik olu�tur
    const existingLoginPopup = document.getElementById('snk_loginPopup');
    if (existingLoginPopup) {
        existingLoginPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa scrollunu devre d��� b�rak
    } else {
        // Statik popup bulunamad�, dinamik olu�tur
        showLoginPopup();
    }
}

// Login popup'� kapat
function closeLoginPopup(e) {
    if (e) e.preventDefault();
    console.log('Login popup kapat�l�yor...');

    if (loginPopup) {
        loginPopup.classList.remove('active');
        document.body.style.overflow = ''; // Sayfa scrollunu tekrar aktifle�tir
    } else {
        console.error('Login popup kapat�lamad�!');
    }
}

// �ifre g�ster/gizle
function togglePassword(e) {
    e.preventDefault();
    console.log('�ifre g�r�n�rl��� de�i�tiriliyor...');

    if (passwordInput) {
        // �ifre tipini de�i�tir
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // �konu de�i�tir
        const icon = passwordToggleBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    } else {
        console.error('�ifre g�r�n�rl��� de�i�tirilemedi!');
    }
}

// Login formunu i�le
function handleLogin(e) {
    e.preventDefault();
    console.log('Login formu g�nderiliyor...');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('snk_remember_me').checked;

    // Login i�lemleri burada ger�ekle�ecek
    // �rnek bir kontrol
    if (email && password) {
        // LocalStorage'dan kullan�c�lar� kontrol et
        const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
        const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');
        const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');

        // Kullan�c�y� ara ve kullan�c� durumunu kontrol et
        let user = users.find(u => u.email === email && u.password === password) ||
            verifiedUsers.find(u => u.email === email && u.password === password);

        // Onay bekleyen kullan�c� kontrol�
        const isPending = pendingUsers.find(u => u.email === email && u.password === password);

        if (isPending) {
            // Kullan�c� onay bekliyor
            showLoginMessage('Hesab�n�z hen�z onaylanmam��. L�tfen admin onay�n� bekleyin.', 'error');
            return;
        }

        if (user) {
            // G�venlik kontrol�: Kullan�c�n�n isVerified veya isActive durumu kontrol et
            if (user.isVerified === false) {
                showLoginMessage('Hesab�n�z hen�z do�rulanmam��. L�tfen do�rulama i�lemini tamamlay�n.', 'error');
                return;
            }

            // Giri� ba�ar�l�
            showLoginMessage('Giri� ba�ar�l�! Y�nlendiriliyorsunuz...', 'success');

            // Kullan�c� bilgilerini sakla
            const currentUser = {
                ...user,
                isLoggedIn: true,
                lastLoginAt: new Date().toISOString()
            };
            localStorage.setItem('snk_currentUser', JSON.stringify(currentUser));

            // 1 saniye sonra sayfay� yeniden y�kle
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            // Giri� ba�ar�s�z
            showLoginMessage('E-posta veya �ifre hatal�!', 'error');
        }
    } else {
        // Formda eksik bilgi var
        showLoginMessage('L�tfen t�m alanlar� doldurun!', 'error');
    }
}

// Login mesaj�n� g�ster
function showLoginMessage(message, type) {
    const alertBox = document.getElementById('loginAlertBox');

    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = 'snk-form-message';
        alertBox.classList.add(`snk-${type}-message`);
        alertBox.style.display = 'block';

        // 5 saniye sonra mesaj� gizle
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    }
}

// Olu�tur butonunu ayarla
function setupCreateButton() {
    console.log('Olu�tur butonu ayarlan�yor...');

    const createButton = document.querySelector('.snk-create-btn');
    if (createButton) {
        createButton.addEventListener('click', function (e) {
            console.log("Olu�tur butonuna t�kland�");
            const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || localStorage.getItem('snk_current_user') || '{}');

            if (currentUser && (currentUser.username || currentUser.isLoggedIn)) {
                console.log("Kullan�c� giri� yapm��, blog olu�turma g�steriliyor");
                showBlogCreatePopup(currentUser);
            } else {
                console.log("Kullan�c� giri� yapmam��, login popup g�steriliyor");

                // �nce olas� a��k popup'lar� temizle
                clearAllPopups();

                // Login popup'�n� g�ster
                const loginPopup = document.getElementById('snk_loginPopup');
                if (loginPopup) {
                    loginPopup.classList.add('active');
                } else {
                    showLoginPopup(); // Alternatif y�ntem
                }
            }
        });
        console.log("Olu�tur butonu olay� tan�mland�");
    } else {
        console.error("Olu�tur butonu bulunamad�!");
    }
}

// T�m popup'lar� temizleyen yard�mc� fonksiyon
function clearAllPopups() {
    const existingPopups = document.querySelectorAll('.snk-popup-overlay, .snk-create-post-popup, #blogCreatePopup');
    existingPopups.forEach(popup => {
        popup.classList.remove('active');
        if (popup.id !== 'snk_loginPopup') {
            popup.remove();
        }
    });
}

// Blog yaz�s� olu�turma popup'�n� g�ster
function showBlogCreatePopup(user) {
    console.log("showBlogCreatePopup �a�r�ld�, t�m popuplar temizleniyor");

    // Mevcut a��k popup'lar� temizle (KAPAT)
    const existingPopups = document.querySelectorAll('.snk-popup-overlay, .snk-create-post-popup');
    if (existingPopups.length > 0) {
        console.log(`${existingPopups.length} adet popup temizleniyor`);
        existingPopups.forEach(popup => {
            popup.classList.remove('active');
            popup.remove(); // Hemen kald�r, timeout kullanma
        });
    }

    // Popup HTML yap�s�n� olu�tur
    const popupHTML = `
    <div class="snk-popup-overlay" id="blogCreatePopup">
        <div class="snk-popup-container">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">Yeni Blog Yaz�s�</h2>
                <button class="snk-popup-close-btn" id="blogCreateCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-popup-content">
                <form class="snk-create-post-form">
                    <div class="snk-form-group">
                        <label for="post-title">Ba�l�k</label>
                        <input type="text" id="post-title" class="snk-form-control" placeholder="Blog yaz�n�z�n ba�l���n� girin" required>
                    </div>
                    
                    <div class="snk-form-group">
                        <label for="post-category">Kategori</label>
                        <select id="post-category" class="snk-form-control" required>
                            <option value="" disabled selected>Kategori se�in</option>
                            <option value="akademik-destek">Akademik Destek</option>
                            <option value="kariyer-staj">Kariyer ve Staj</option>
                            <option value="sosyal-hayat">Sosyal Hayat</option>
                            <option value="psikolojik-destek">Psikolojik Destek</option>
                            <option value="burs-firsatlar">Burs ve F�rsatlar</option>
                            <option value="random">Random</option>
                        </select>
                    </div>
                    
                    <div class="snk-form-group">
                        <label for="post-content">��erik</label>
                        <textarea id="post-content" class="snk-form-control" placeholder="Blog yaz�n�z�n i�eri�ini girin" rows="8" required></textarea>
                    </div>
                    
                    <div class="snk-form-group">
                        <label for="post-tags">Etiketler (# ile ay�r�n)</label>
                        <input type="text" id="post-tags" class="snk-form-control" placeholder="�rn: #teknoloji #yaz�l�m #web">
                        <div class="snk-tags-preview"></div>
                    </div>
                    
                    <div class="snk-form-group">
                        <label for="post-image">Kapak G�rseli</label>
                        <div class="snk-image-upload">
                            <input type="file" id="post-image" class="snk-image-input" accept="image/*">
                            <label for="post-image" class="snk-image-label">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span>G�rsel Se�in veya S�r�kleyin</span>
                            </label>
                            <div class="snk-image-preview"></div>
                        </div>
                    </div>
                    
                    <div class="snk-form-actions">
                        <button type="button" class="snk-form-button snk-cancel-button" id="blogCancelBtn">�ptal</button>
                        <button type="submit" class="snk-form-button snk-submit-button">Yaz�y� Yay�nla</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;

    // Popup'� body'ye ekle
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Popup'� g�ster
    const popup = document.getElementById('blogCreatePopup');
    setTimeout(() => {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Arka plan� kayd�rmay� engelle
    }, 10);

    // Kapat butonuna t�klan�nca popup'� kapat
    document.getElementById('blogCreateCloseBtn').addEventListener('click', function () {
        closePopup(popup);
    });

    // �ptal butonuna t�klan�nca popup'� kapat
    document.getElementById('blogCancelBtn').addEventListener('click', function () {
        closePopup(popup);
    });

    // Popup d���na t�kland���nda kapat
    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            closePopup(popup);
        }
    });

    // Form g�nderildi�inde blog yaz�s�n� kaydet
    const form = document.querySelector('.snk-create-post-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;
        const tagsInput = document.getElementById('post-tags').value;
        const tags = tagsInput ? tagsInput.split('#').filter(tag => tag.trim() !== '').map(tag => tag.trim()) : [];

        // G�rsel i�in base64 veri URL'sini al
        let imageUrl = '../public/images/blog-placeholder.jpg';
        const imagePreview = document.querySelector('.snk-image-preview img');
        if (imagePreview && imagePreview.src) {
            imageUrl = imagePreview.src;
        }

        // Blog yaz�s� nesnesini olu�tur
        const blogPost = {
            id: Date.now(),
            title: title,
            category: category,
            summary: content.substring(0, 150) + '...',  // �lk 150 karakteri �zet olarak al
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

        // Mevcut blog yaz�lar�n� al
        let blogPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

        // E�er fazla post varsa, localStorage dolmas�n� �nlemek i�in
        // en eski postlar� sadele�tir (i�eriklerini k�salt)
        if (blogPosts.length > 10) {
            console.log('Blog yaz�lar� s�n�r� a��ld�, eski yaz�lar optimize ediliyor...');

            // En eski yaz�lar� bul ve optimize et (ilk 5 yaz�)
            for (let i = 0; i < Math.min(5, blogPosts.length); i++) {
                if (blogPosts[i].content && blogPosts[i].content.length > 200) {
                    // ��eri�i k�salt ve optimize edildi�ini belirt
                    blogPosts[i].content = blogPosts[i].content.substring(0, 200) + '...';
                    blogPosts[i].optimized = true;
                }
            }
        }

        // Yeni yaz�y� ekle
        blogPosts.push(blogPost);

        // localStorage'a kaydet - kotay� a�arsa d�zg�n hata y�netimi sa�la
        try {
            localStorage.setItem('snk_blog_posts', JSON.stringify(blogPosts));
        } catch (storageError) {
            console.warn('LocalStorage kotas� a��ld�, eski yaz�lar temizleniyor...');

            // Kota a��l�rsa, daha agresif bir temizlik yap
            // En eski 5 yaz�y� tamamen kald�r
            if (blogPosts.length > 5) {
                blogPosts = blogPosts.slice(5);
                blogPosts.push(blogPost); // Yeni yaz�y� tekrar ekle
                localStorage.setItem('snk_blog_posts', JSON.stringify(blogPosts));
            } else {
                // Yaz�lar �ok b�y�k, t�m yaz�lar� sil ve sadece yeni yaz�y� kaydet
                localStorage.setItem('snk_blog_posts', JSON.stringify([blogPost]));
            }
        }

        // Kullan�c�n�n kendi blog yaz�lar�n� optimize et ve g�ncelle
        try {
            let userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${user.id}`) || '[]');

            // E�er kullan�c�n�n �ok yaz�s� varsa, eski yaz�lar� optimize et
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
            // Kullan�c� yaz�lar� i�in kota a��l�rsa, en eski yaz�lar� sil
            console.warn('Kullan�c� yaz�lar� i�in LocalStorage kotas� a��ld�, temizleniyor...');
            localStorage.setItem(`snk_user_posts_${user.id}`, JSON.stringify([blogPost]));
        }

        // Kullan�c� bilgilerini sakla
        const currentUser = {
            ...user,
            isLoggedIn: true
        };
        localStorage.setItem('snk_currentUser', JSON.stringify(currentUser));

        // Bildirim g�ster
        showNotification('Blog yaz�n�z ba�ar�yla kaydedildi!', 'success');

        // 1 saniye sonra sayfay� yeniden y�kle
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });

    // G�rsel y�kleme fonksiyonalitesi
    const imageInput = document.getElementById('post-image');
    const imagePreview = document.querySelector('.snk-image-preview');

    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.innerHTML = `
                    <div class="snk-preview-container">
                        <img src="${e.target.result}" alt="Se�ilen g�rsel">
                        <button type="button" class="snk-remove-image">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;

                // G�rseli kald�rma butonu i�in event listener
                document.querySelector('.snk-remove-image').addEventListener('click', function () {
                    imagePreview.innerHTML = '';
                    imageInput.value = '';
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Etiket �nizlemesi
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

// Popup'� kapat
function closePopup(popup) {
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.remove();
            document.body.style.overflow = ''; // Arka plan kayd�rmay� tekrar etkinle�tir
        }, 300);
    }
}

// Blog yaz�s� olu�turma popup'�n� g�ster
function showLoginPopup() {
    console.log('showLoginPopup �a�r�ld�');

    // �nce t�m popuplar� temizle
    clearAllPopups();

    // HTML i�inde statik olarak tan�mlanm�� bir login popup var m� kontrol et
    const existingLoginPopup = document.getElementById('snk_loginPopup');
    if (existingLoginPopup) {
        console.log('Statik login popup bulundu, onu kullan�yoruz');
        existingLoginPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa scrollunu devre d��� b�rak

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

        return; // Statik popup bulundu, dinamik olu�turmaya gerek yok
    }

    // Statik popup yoksa, dinamik olu�tur (eski kod)
    console.log('Statik login popup bulunamad�, dinamik olu�turulacak');
    // Popup HTML yap�s�n� olu�tur - Yeni tasar�m
    const popupHTML = `
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
    </div>`;

    // Popup'� body'ye ekle
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Popup'� g�ster
    const popup = document.getElementById('snk_loginPopup');
    setTimeout(() => {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Arka plan� kayd�rmay� engelle
    }, 10);

    // Kapat butonuna t�klan�nca popup'� kapat
    document.getElementById('snk_loginCloseBtn').addEventListener('click', function () {
        closePopup(popup);
    });

    // Popup d���na t�kland���nda kapat
    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            closePopup(popup);
        }
    });

    // �ifre g�rme butonunu aktifle�tir
    const passwordToggleButton = document.getElementById('snk_login_toggle_password');
    const passwordInputField = document.getElementById('loginPassword');

    if (passwordToggleButton && passwordInputField) {
        passwordToggleButton.addEventListener('click', function (e) {
            e.preventDefault();
            // �ifre tipini de�i�tir
            const type = passwordInputField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInputField.setAttribute('type', type);

            // �konu de�i�tir
            const icon = passwordToggleButton.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // Form g�nderildi�inde login i�lemini ger�ekle�tir
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('snk_remember_me').checked;

        // Login i�lemleri burada ger�ekle�ecek
        // �rnek bir kontrol
        if (email && password) {
            // LocalStorage'dan kullan�c�lar� kontrol et
            const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
            const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');
            const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');

            // Kullan�c�y� ara ve kullan�c� durumunu kontrol et
            let user = users.find(u => u.email === email && u.password === password) ||
                verifiedUsers.find(u => u.email === email && u.password === password);

            // Onay bekleyen kullan�c� kontrol�
            const isPending = pendingUsers.find(u => u.email === email && u.password === password);

            if (isPending) {
                // Kullan�c� onay bekliyor
                showLoginMessage('Hesab�n�z hen�z onaylanmam��. L�tfen admin onay�n� bekleyin.', 'error');
                return;
            }

            if (user) {
                // G�venlik kontrol�: Kullan�c�n�n isVerified veya isActive durumu kontrol et
                if (user.isVerified === false) {
                    showLoginMessage('Hesab�n�z hen�z do�rulanmam��. L�tfen do�rulama i�lemini tamamlay�n.', 'error');
                    return;
                }

                // Giri� ba�ar�l�
                showLoginMessage('Giri� ba�ar�l�! Y�nlendiriliyorsunuz...', 'success');

                // Kullan�c� bilgilerini sakla
                const currentUser = {
                    ...user,
                    isLoggedIn: true,
                    lastLoginAt: new Date().toISOString()
                };
                localStorage.setItem('snk_currentUser', JSON.stringify(currentUser));

                // 1 saniye sonra sayfay� yeniden y�kle
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // Giri� ba�ar�s�z
                showLoginMessage('E-posta veya �ifre hatal�!', 'error');
            }
        } else {
            // Formda eksik bilgi var
            showLoginMessage('L�tfen t�m alanlar� doldurun!', 'error');
        }
    });
}

// Blog yaz�s� silme i�lemi
function deleteBlogPost(postId) {
    console.log(`${postId} ID'li blog yaz�s� i�in silme i�lemi ba�lat�ld�`);

    // Silme onay popup'�n� olu�tur
    const confirmPopupHTML = `
    <div class="snk-popup-overlay active" id="snk_confirmDeletePopup">
        <div class="snk-popup-container snk-confirm-popup">
            <div class="snk-popup-header">
                <h2 class="snk-popup-title">Blog Yaz�s�n� Sil</h2>
                <button class="snk-popup-close-btn" id="snk_confirmCloseBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-popup-content">
                <p class="snk-confirm-message">Bu blog yaz�s�n� silmek istedi�inize emin misiniz? Bu i�lem geri al�namaz.</p>
                <div class="snk-confirm-buttons">
                    <button id="snk_cancelDeleteBtn" class="snk-cancel-btn">�ptal</button>
                    <button id="snk_confirmDeleteBtn" class="snk-confirm-btn">Sil</button>
                </div>
            </div>
        </div>
    </div>`;

    // �nce t�m popuplar� temizle
    const existingPopups = document.querySelectorAll('.snk-popup-overlay');
    existingPopups.forEach(popup => popup.remove());

    // Popup'� sayfaya ekle
    document.body.insertAdjacentHTML('beforeend', confirmPopupHTML);
    document.body.style.overflow = 'hidden';

    // Kapatma ve iptal butonlar�n� ayarla
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
            // Kullan�c� bilgilerini al
            const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || '{}');

            // Kullan�c�n�n yaz�lar�n� al ve g�ncelle
            let userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${currentUser.id}`) || '[]');
            const updatedUserPosts = userPosts.filter(post => post.id.toString() !== postId.toString());

            // Kullan�c�n�n g�ncellenmi� yaz�lar�n� kaydet
            localStorage.setItem(`snk_user_posts_${currentUser.id}`, JSON.stringify(updatedUserPosts));

            // Genel blog yaz�lar�n� al ve g�ncelle
            const blogPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
            const updatedBlogPosts = blogPosts.filter(post => post.id.toString() !== postId.toString());

            // G�ncellenmi� blog yaz�lar�n� localStorage'a kaydet
            localStorage.setItem('snk_blog_posts', JSON.stringify(updatedBlogPosts));

            // Admin panelindeki onay bekleyen yaz�lar� da g�ncelle
            const pendingPosts = JSON.parse(localStorage.getItem('snk_pending_posts') || '[]');
            const updatedPendingPosts = pendingPosts.filter(post => post.id.toString() !== postId.toString());
            localStorage.setItem('snk_pending_posts', JSON.stringify(updatedPendingPosts));

            // Admin panelindeki onaylanm�� yaz�lar� da g�ncelle
            const approvedPosts = JSON.parse(localStorage.getItem('snk_approved_posts') || '[]');
            const updatedApprovedPosts = approvedPosts.filter(post => post.id.toString() !== postId.toString());
            localStorage.setItem('snk_approved_posts', JSON.stringify(updatedApprovedPosts));

            // Sayfadaki t�m e�le�en yaz�lar� DOM'dan kald�r
            const postElements = document.querySelectorAll(`[data-post-id="${postId}"]`);
            console.log(`Silinen yaz� i�in ${postElements.length} adet DOM eleman� bulundu`);

            postElements.forEach(element => {
                const postCard = element.closest('.snk-user-post-card, .snk-blog-card, .snk-post-card, .snk-admin-post-item');
                if (postCard) {
                    postCard.classList.add('removing');
                    setTimeout(() => {
                        postCard.remove();
                    }, 300);
                }
            });

            // Admin paneline bildirim g�nder (e�er olay ileticisi varsa)
            if (window.dispatchEvent) {
                const deleteEvent = new CustomEvent('blogPostDeleted', {
                    detail: { postId: postId, userId: currentUser.id }
                });
                window.dispatchEvent(deleteEvent);
                console.log('Admin paneline silme bildirimi g�nderildi:', postId);
            }

            // Kullan�c�ya bildirim g�ster
            showNotification('Blog yaz�s� ba�ar�yla silindi', 'success');

            // Son yaz�lar g�sterimini g�ncelle
            if (typeof updateRecentPostsDisplay === 'function') {
                updateRecentPostsDisplay();
            }

            // Profil sayfas�ndaki yaz�lar tab�n� g�ncelle
            if (typeof updateUserPostsDisplay === 'function') {
                updateUserPostsDisplay();
            }

            // Popup'� kapat
            closePopup();
        });
    }
}

// Son yaz�lar�n g�sterimini g�ncelle
function updateRecentPostsDisplay() {
    const recentPostsContainer = document.querySelector('.snk-recent-posts');
    if (!recentPostsContainer) return;

    // Blog yaz�lar�n� localStorage'dan al
    const blogPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

    // Son 6 yaz�y� al
    const recentPosts = blogPosts.slice(-6).reverse();

    // HTML olu�tur
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
                    <span><i class="far fa-eye"></i> ${post.views} g�r�nt�lenme</span>
                </div>
                <div class="snk-post-tags">
                    ${post.tags.map(tag => `<span class="snk-tag">${tag}</span>`).join('')}
                </div>
                <button class="snk-read-more-btn" data-post-id="${post.id}">Devam�n� Oku</button>
            </div>
        </div>
    `).join('');

    // ��eri�i g�ncelle
    recentPostsContainer.innerHTML = postsHTML;

    // "Devam�n� Oku" butonlar�na t�klama olay� ekle
    const readMoreButtons = document.querySelectorAll('.snk-read-more-btn');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const postId = this.getAttribute('data-post-id');
            openBlogPostPopup(postId);
        });
    });
}

// Blog yaz�s�n� popup'da a�ma
function openBlogPostPopup(postId) {
    // Blog yaz�lar�n� localStorage'dan al
    const blogPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

    // ID'ye g�re blog yaz�s�n� bul
    const post = blogPosts.find(post => post.id == postId);
    if (!post) return;

    // Blog yaz�s�n�n g�r�nt�lenme say�s�n� artt�r
    post.views += 1;
    localStorage.setItem('snk_blog_posts', JSON.stringify(blogPosts));

    // Popup i�eri�ini olu�tur
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
                    <span><i class="far fa-eye"></i> ${post.views} g�r�nt�lenme</span>
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

    // Popup'� ekle ve g�ster
    const popupElement = document.createElement('div');
    popupElement.innerHTML = popupHTML;
    document.body.appendChild(popupElement.firstElementChild);

    const popupContainer = document.querySelector('.snk-blog-post-popup');
    setTimeout(() => {
        popupContainer.classList.add('active');
    }, 50);

    // Popup'� kapatma d��mesine olay ekle
    popupContainer.querySelector('.snk-popup-close-btn').addEventListener('click', () => {
        closePopup(popupContainer);
    });
}

// Mobil cihazlar i�in �zel ayarlamalar
function setupMobileCompatibility() {
    // Ekran geni�li�ini kontrol et
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Mobil cihazlar i�in ek ayarlar yap�labilir
        console.log('Mobil cihaz tespit edildi, �zel ayarlar yap�l�yor...');

        // �rnek: Mobil cihazlarda popup geni�li�ini ayarla
        if (loginPopup) {
            const popupContainer = loginPopup.querySelector('.snk-popup-container');
            if (popupContainer) {
                popupContainer.style.width = '95%';
                popupContainer.style.maxWidth = '450px';
            }
        }
    }
}

// Ekran boyutu de�i�ti�inde mobil uyumlulu�u kontrol et
window.addEventListener('resize', setupMobileCompatibility);

// �lk y�klemede mobil uyumlulu�u kontrol et
setupMobileCompatibility();

// Bildirim g�sterme fonksiyonu
function showNotification(message, type = 'info') {
    // Varsa eski bildirimi kald�r
    const existingNotification = document.querySelector('.snk-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Yeni bildirim olu�tur
    const notification = document.createElement('div');
    notification.className = `snk-notification ${type}`;

    // �kon se�
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

    // Animasyonu ba�lat
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

// Blog yaz�s�n�n onaya g�nderildi�ini bildiren onay popup'� g�ster
function showApprovalPendingNotification() {
    // �nceki popup varsa kald�r
    const existingNotification = document.getElementById('approval-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Notifikasyon HTML'i olu�tur
    const notificationHTML = `
    <div id="approval-notification" class="snk-notification-overlay">
        <div class="snk-notification-container">
            <div class="snk-notification-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Blog Yaz�n�z Ba�ar�yla Olu�turuldu!</h3>
            <p>Blog yaz�n�z ba�ar�yla kaydedildi ve �u anda y�netici onay� bekliyor.</p>
            <p>Yaz�n�z onayland���nda t�m kullan�c�lar taraf�ndan g�r�lebilecek.</p>
            <button id="understand-button" class="snk-notification-button">Anlad�m</button>
        </div>
    </div>`;

    // Notifikasyonu ekle
    document.body.insertAdjacentHTML('beforeend', notificationHTML);

    // Notifikasyonu g�ster
    const notification = document.getElementById('approval-notification');
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);

    // Anlad�m butonuna t�klan�nca notifikasyonu kapat
    document.getElementById('understand-button').addEventListener('click', function () {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Kullan�c� blog yaz�lar�n� g�r�nt�le
function updateUserPostsDisplay() {
    console.log("Kullan�c� yaz�lar� g�r�nt�leme fonksiyonu �a�r�ld�");

    // Kullan�c� oturum durumunu kontrol et
    const user = JSON.parse(localStorage.getItem('snk_currentUser') || localStorage.getItem('snk_current_user') || 'null');
    if (!user) {
        console.log("Oturum a��k de�il, kullan�c� yaz�lar� g�r�nt�lenemez");
        return;
    }

    // Kullan�c� yaz�lar�n� al
    const userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${user.id}`) || '[]');
    console.log(`${userPosts.length} adet kullan�c� yaz�s� bulundu`);

    // E�er kullan�c� yaz�lar� bo�sa, genel blog yaz�lar�ndan kullan�c�ya ait olanlar� da kontrol et
    if (userPosts.length === 0) {
        const allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
        const userPostsFromAll = allPosts.filter(post => post.author_id === user.id);

        // Kullan�c�ya ait yaz�lar varsa bunlar� kullan�c� yaz�lar�na da ekleyelim
        if (userPostsFromAll.length > 0) {
            localStorage.setItem(`snk_user_posts_${user.id}`, JSON.stringify(userPostsFromAll));
            console.log(`Genel blog yaz�lar�ndan ${userPostsFromAll.length} adet yaz� kullan�c� yaz�lar�na eklendi`);
            updateUserPostsDisplay(); // G�ncellenmi� listeyi g�stermek i�in tekrar �a��r
            return;
        }
    }

    // Yaz�lar�n g�r�nt�lenece�i container'� bul
    const postsContainer = document.querySelector('.snk-user-posts');
    if (!postsContainer) {
        console.error("Yaz�lar container'� bulunamad�");
        return;
    }

    // Y�kleniyor mesaj�n� temizle
    postsContainer.innerHTML = '';

    // E�er yaz� yoksa, bilgi mesaj� g�ster
    if (userPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="snk-no-posts">
                <i class="fas fa-pen-nib"></i>
                <p>Hen�z bir blog yaz�s� yazmad�n�z.</p>
                <button class="snk-action-btn">
                    <i class="fas fa-plus-circle"></i> �lk Yaz�n� Olu�tur
                </button>
            </div>
        `;

        // �lk yaz� olu�tur butonuna t�klama olay� ekle
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

    // Yaz�lar� tarihe g�re s�rala (en yeniden en eskiye)
    userPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Her bir yaz� i�in kart olu�tur ve ekle
    userPosts.forEach((post, index) => {
        // Gecikme efekti i�in index'i kullan
        const delay = index * 0.1;

        // Kart HTML'ini olu�tur
        const postCard = document.createElement('div');
        postCard.className = 'snk-user-post-card fade-in';
        postCard.style.animationDelay = `${delay}s`;

        // Kart�n i�eri�ini olu�tur
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
                                <i class="far fa-thumbs-up" style="margin-right: 5px;"></i> Be�en
                                <span class="snk-like-count" style="font-weight: bold;">0</span>
                            </button>           <button class="snk-action-btn snk-comment-button" data-post-id="1741484977975" style="background: black; color: white; border-radius: 20px; padding: 6px 12px; border: none; cursor: pointer;">
                                <i class="far fa-comment" style="margin-right: 5px;"></i> Yorum Yap
                            </button>
               <button class="snk-action-btn snk-share-button" data-post-id="1741484977975" style="background: #007bff; color: white; border-radius: 20px; padding: 6px 12px; border: none; cursor: pointer;">
                                <i class="far fa-share-square" style="margin-right: 5px;"></i> Payla�
                            </button>
                <button class="snk-post-action-btn delete-btn" data-action="delete" data-post-id="${post.id}" style="background: #ff3852; color: white; border-radius: 20px; padding: 6px 12px; border: none; cursor: pointer;">
                    <i class="far fa-trash-alt" style="margin-right: 5px;"></i> Sil
                </button>
            </div>
        `;

        // Kart� container'a ekle
        postsContainer.appendChild(postCard);

        // Butonlar i�in olay dinleyicileri ekle
        const likeBtn = postCard.querySelector('[data-action="like"]');
        const commentBtn = postCard.querySelector('[data-action="comment"]');
        const shareBtn = postCard.querySelector('[data-action="share"]');
        const deleteBtn = postCard.querySelector('[data-action="delete"]');

        // Be�enme butonu
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

        // Payla� butonu
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

// Global eri�im i�in
window.showBlogCreatePopup = showBlogCreatePopup;
window.showApprovalPendingNotification = showApprovalPendingNotification;
window.updateUserPostsDisplay = updateUserPostsDisplay;
