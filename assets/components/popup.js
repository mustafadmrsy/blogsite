/**
 * Popup JavaScript - Senirkent Blog
 * Her fonksiyon öneki: snk_popup_ (kod çakýþmalarýný önlemek için)
 */

// DOM elemanlarýný tanýmla
const snk_popup_overlay = document.getElementById('snk_popupOverlay');
const snk_popup_container = document.querySelector('.snk-popup-container');
const snk_popup_closeBtn = document.getElementById('snk_popupCloseBtn');
const snk_popup_title = document.getElementById('snk_popupTitle');
const snk_popup_content = document.getElementById('snk_popupContent');

/**
 * Popup'ý açar ve içeriðini doldurur
 * @param {Object} postData - Gösterilecek blog yazýsýnýn verileri
 */
function snk_popup_openPopup(postData) {
    console.log("Popup açýlýyor:", postData.title);

    // Popup baþlýðýný ayarla
    if (snk_popup_title) {
        snk_popup_title.textContent = postData.title;
    }

    // Popup içeriðini oluþtur
    let contentHTML = `
        <div class="snk-article-metadata">
            <div class="snk-article-author">
                <i class="fas fa-user"></i> ${postData.author}
            </div>
            <div class="snk-article-date">
                <i class="fas fa-calendar"></i> ${postData.date}
            </div>
            <div class="snk-article-views">
                <i class="fas fa-eye"></i> ${postData.views || '0'} görüntülenme
            </div>
        </div>
        
        <img src="${postData.image}" alt="${postData.title}" class="snk-article-image">
        
        <div class="snk-article-content">
            ${postData.content}
        </div>
        
        <div class="snk-article-tags">
    `;

    // Etiketleri ekle
    if (postData.tags && postData.tags.length > 0) {
        postData.tags.forEach(tag => {
            contentHTML += `<span class="snk-article-tag">${tag}</span>`;
        });
    }

    contentHTML += `</div>`;

    // Ýçeriði popup'a ekle
    if (snk_popup_content) {
        snk_popup_content.innerHTML = contentHTML;
    }

    // Popup'ý görünür yap
    if (snk_popup_overlay) {
        snk_popup_overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa kaydýrmayý devre dýþý býrak
    }

    // Ýstatistik güncelleme (görüntülenme sayýsýný artýrma)
    snk_popup_updateStats(postData.id);
}

/**
 * Popup'ý kapatýr
 */
function snk_popup_closePopup() {
    console.log("Popup kapatýlýyor");

    if (snk_popup_overlay) {
        snk_popup_overlay.classList.remove('active');
        document.body.style.overflow = ''; // Sayfa kaydýrmayý tekrar etkinleþtir
    }

    // Ýçeriði temizle (hafýzayý serbest býrakmak için)
    setTimeout(() => {
        if (snk_popup_content) {
            snk_popup_content.innerHTML = '';
        }
        if (snk_popup_title) {
            snk_popup_title.textContent = '';
        }
    }, 300);
}

/**
 * Post istatistiklerini günceller (görüntülenme sayýsý vb.)
 * @param {number|string} postId - Güncellenecek yazýnýn ID'si
 */
function snk_popup_updateStats(postId) {
    // Burada gerçek bir uygulamada AJAX çaðrýsý yapýlabilir
    console.log(`Post #${postId} görüntülendi`);

    // Kullaným örneði: localStorage'da görüntülenme sayýsýný takip etme
    const viewedPosts = JSON.parse(localStorage.getItem('snk_viewed_posts') || '{}');
    viewedPosts[postId] = (viewedPosts[postId] || 0) + 1;
    localStorage.setItem('snk_viewed_posts', JSON.stringify(viewedPosts));
}

/**
 * ESC tuþuna basýldýðýnda popup'ý kapatýr
 * @param {KeyboardEvent} e - Klavye olayý
 */
function snk_popup_handleKeyPress(e) {
    if (e.key === 'Escape' && snk_popup_overlay && snk_popup_overlay.classList.contains('active')) {
        snk_popup_closePopup();
    }
}

/**
 * Popup dýþýna týklandýðýnda kapatýr
 * @param {MouseEvent} e - Fare týklama olayý
 */
function snk_popup_handleClickOutside(e) {
    if (snk_popup_overlay && e.target === snk_popup_overlay) {
        snk_popup_closePopup();
    }
}

/**
 * Belirli bir yazýnýn verilerini getirir
 * @param {number|string} postId - Getirilecek yazýnýn ID'si
 */
function snk_popup_fetchPostData(postId) {
    console.log("Post verisi getiriliyor:", postId);

    // Gerçek bir uygulamada burasý AJAX ile sunucudan veri çeker

    // Yükleniyor mesajý göster
    if (snk_popup_content) {
        snk_popup_content.innerHTML = `
            <div class="snk-loading">
                <i class="fas fa-spinner fa-spin"></i> Yazý yükleniyor...
            </div>
        `;
    }

    if (snk_popup_title) {
        snk_popup_title.textContent = 'Yükleniyor...';
    }

    if (snk_popup_overlay) {
        snk_popup_overlay.classList.add('active');
    }

    // Tüm olasý localStorage anahtarlarýný kontrol et
    const storageKeys = ['snk_blog_posts', 'snk_blogPosts', 'blog_posts'];
    let foundPost = null;
    let allPosts = [];

    // Her bir anahtar için kontrol et
    for (const key of storageKeys) {
        const posts = JSON.parse(localStorage.getItem(key) || '[]');

        // Bu anahtardan gelen yazýlarý allPosts'a ekle
        allPosts = [...allPosts, ...posts];

        // PostId ile eþleþen yazýyý bul
        const post = posts.find(post =>
            post.id === parseInt(postId) ||
            post.id === postId ||
            post.id === postId.toString()
        );

        if (post) {
            foundPost = post;
            console.log(`Yazý ${key} içinde bulundu:`, post.title);
            break;
        }
    }

    // Yazý bulunduysa göster
    if (foundPost) {
        // Eðer yazý bulunduysa durumunu approved olarak ayarla
        foundPost.status = foundPost.status || 'approved';

        // Yazýyý göster
        snk_popup_openPopup(foundPost);

        // Yazýyý tüm localStorage anahtarlarýna kaydet (veri tutarlýlýðý için)
        // Bu, yazýnýn ana sayfada ve admin sayfasýnda görünmesini saðlar
        for (const key of storageKeys) {
            let posts = JSON.parse(localStorage.getItem(key) || '[]');

            // Yazý bu anahtarda varsa, güncelle
            const existingIndex = posts.findIndex(post =>
                post.id === parseInt(postId) ||
                post.id === postId ||
                post.id === postId.toString()
            );

            if (existingIndex !== -1) {
                posts[existingIndex] = foundPost;
            } else {
                // Yazý bu anahtarda yoksa, ekle
                posts.push(foundPost);
            }

            // Güncellenmiþ yazýlarý localStorage'a kaydet
            localStorage.setItem(key, JSON.stringify(posts));
            console.log(`Yazý ${key} içine kaydedildi`);
        }

        return;
    }

    // Kullanýcý gönderilerinde bulunamadýysa, blogPosts.json'dan veri çek
    setTimeout(() => {
        fetch('../utils/blogPosts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Veri yüklenemedi');
                }
                return response.json();
            })
            .then(data => {
                const post = data.posts.find(post => post.id === parseInt(postId) || post.id === postId);

                if (post) {
                    // Yazý durumunu approved olarak ayarla
                    post.status = post.status || 'approved';

                    // Popup'ý açarak yazýyý göster
                    snk_popup_openPopup(post);

                    // Bu yazýyý localStorage'a da ekle
                    for (const key of storageKeys) {
                        let posts = JSON.parse(localStorage.getItem(key) || '[]');

                        // Yazý zaten mevcutsa ekleme
                        if (!posts.some(p => p.id === post.id)) {
                            posts.push(post);
                            localStorage.setItem(key, JSON.stringify(posts));
                            console.log(`Yazý ${key} içine kaydedildi`);
                        }
                    }
                } else {
                    throw new Error('Yazý bulunamadý');
                }
            })
            .catch(error => {
                console.error('Veri çekme hatasý:', error);
                if (snk_popup_content) {
                    snk_popup_content.innerHTML = `
                        <div class="snk-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Yazý yüklenirken bir hata oluþtu. Lütfen daha sonra tekrar deneyin.</p>
                        </div>
                    `;
                }

                if (snk_popup_title) {
                    snk_popup_title.textContent = 'Hata';
                }
            });
    }, 500);
}

// Sayfa yüklendiðinde hazýrlýk
document.addEventListener('DOMContentLoaded', () => {
    console.log("Popup.js yüklendi");

    // DOM elemanlarýný tekrar seç (lazy loading için)
    const popupOverlay = document.getElementById('snk_popupOverlay');
    const popupCloseBtn = document.getElementById('snk_popupCloseBtn');

    console.log("Popup elemanlarý:", { popupOverlay, popupCloseBtn });

    // Olay dinleyicilerini ekle
    if (popupCloseBtn) {
        console.log("Popup kapatma butonu olayý ekleniyor");
        popupCloseBtn.addEventListener('click', snk_popup_closePopup);
    } else {
        console.error("Popup kapatma butonu bulunamadý!");
    }

    if (popupOverlay) {
        console.log("Popup dýþý týklama olayý ekleniyor");
        popupOverlay.addEventListener('click', snk_popup_handleClickOutside);
    } else {
        console.error("Popup overlay bulunamadý!");
    }

    document.addEventListener('keydown', snk_popup_handleKeyPress);

    // 'Devamýný Oku' butonlarý için olay dinleyicileri ekle
    const readMoreButtons = document.querySelectorAll('.snk-read-more-btn');
    if (readMoreButtons.length > 0) {
        console.log("Devamýný Oku butonlarý bulundu:", readMoreButtons.length);
        readMoreButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Sayfa yenilenmesini önle
                const postId = button.getAttribute('data-post-id');
                console.log("Devamýný Oku butonuna týklandý, Post ID:", postId);

                // Ýlgili yazýyý getir ve popup'ta göster
                snk_popup_fetchPostData(postId);
            });
        });
    } else {
        console.warn("Hiç 'Devamýný Oku' butonu bulunamadý");
    }
});

// Global olarak bu fonksiyonlara eriþim saðla
window.snk_popup_fetchPostData = snk_popup_fetchPostData;
window.snk_popup_openPopup = snk_popup_openPopup;
window.snk_popup_closePopup = snk_popup_closePopup;
