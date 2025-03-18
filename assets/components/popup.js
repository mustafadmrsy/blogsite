/**
 * Popup JavaScript - Senirkent Blog
 * Her fonksiyon �neki: snk_popup_ (kod �ak��malar�n� �nlemek i�in)
 */

// DOM elemanlar�n� tan�mla
const snk_popup_overlay = document.getElementById('snk_popupOverlay');
const snk_popup_container = document.querySelector('.snk-popup-container');
const snk_popup_closeBtn = document.getElementById('snk_popupCloseBtn');
const snk_popup_title = document.getElementById('snk_popupTitle');
const snk_popup_content = document.getElementById('snk_popupContent');

/**
 * Popup'� a�ar ve i�eri�ini doldurur
 * @param {Object} postData - G�sterilecek blog yaz�s�n�n verileri
 */
function snk_popup_openPopup(postData) {
    console.log("Popup a��l�yor:", postData.title);

    // Popup ba�l���n� ayarla
    if (snk_popup_title) {
        snk_popup_title.textContent = postData.title;
    }

    // Popup i�eri�ini olu�tur
    let contentHTML = `
        <div class="snk-article-metadata">
            <div class="snk-article-author">
                <i class="fas fa-user"></i> ${postData.author}
            </div>
            <div class="snk-article-date">
                <i class="fas fa-calendar"></i> ${postData.date}
            </div>
            <div class="snk-article-views">
                <i class="fas fa-eye"></i> ${postData.views || '0'} g�r�nt�lenme
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

    // ��eri�i popup'a ekle
    if (snk_popup_content) {
        snk_popup_content.innerHTML = contentHTML;
    }

    // Popup'� g�r�n�r yap
    if (snk_popup_overlay) {
        snk_popup_overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa kayd�rmay� devre d��� b�rak
    }

    // �statistik g�ncelleme (g�r�nt�lenme say�s�n� art�rma)
    snk_popup_updateStats(postData.id);
}

/**
 * Popup'� kapat�r
 */
function snk_popup_closePopup() {
    console.log("Popup kapat�l�yor");

    if (snk_popup_overlay) {
        snk_popup_overlay.classList.remove('active');
        document.body.style.overflow = ''; // Sayfa kayd�rmay� tekrar etkinle�tir
    }

    // ��eri�i temizle (haf�zay� serbest b�rakmak i�in)
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
 * Post istatistiklerini g�nceller (g�r�nt�lenme say�s� vb.)
 * @param {number|string} postId - G�ncellenecek yaz�n�n ID'si
 */
function snk_popup_updateStats(postId) {
    // Burada ger�ek bir uygulamada AJAX �a�r�s� yap�labilir
    console.log(`Post #${postId} g�r�nt�lendi`);

    // Kullan�m �rne�i: localStorage'da g�r�nt�lenme say�s�n� takip etme
    const viewedPosts = JSON.parse(localStorage.getItem('snk_viewed_posts') || '{}');
    viewedPosts[postId] = (viewedPosts[postId] || 0) + 1;
    localStorage.setItem('snk_viewed_posts', JSON.stringify(viewedPosts));
}

/**
 * ESC tu�una bas�ld���nda popup'� kapat�r
 * @param {KeyboardEvent} e - Klavye olay�
 */
function snk_popup_handleKeyPress(e) {
    if (e.key === 'Escape' && snk_popup_overlay && snk_popup_overlay.classList.contains('active')) {
        snk_popup_closePopup();
    }
}

/**
 * Popup d���na t�kland���nda kapat�r
 * @param {MouseEvent} e - Fare t�klama olay�
 */
function snk_popup_handleClickOutside(e) {
    if (snk_popup_overlay && e.target === snk_popup_overlay) {
        snk_popup_closePopup();
    }
}

/**
 * Belirli bir yaz�n�n verilerini getirir
 * @param {number|string} postId - Getirilecek yaz�n�n ID'si
 */
function snk_popup_fetchPostData(postId) {
    console.log("Post verisi getiriliyor:", postId);

    // Ger�ek bir uygulamada buras� AJAX ile sunucudan veri �eker

    // Y�kleniyor mesaj� g�ster
    if (snk_popup_content) {
        snk_popup_content.innerHTML = `
            <div class="snk-loading">
                <i class="fas fa-spinner fa-spin"></i> Yaz� y�kleniyor...
            </div>
        `;
    }

    if (snk_popup_title) {
        snk_popup_title.textContent = 'Y�kleniyor...';
    }

    if (snk_popup_overlay) {
        snk_popup_overlay.classList.add('active');
    }

    // T�m olas� localStorage anahtarlar�n� kontrol et
    const storageKeys = ['snk_blog_posts', 'snk_blogPosts', 'blog_posts'];
    let foundPost = null;
    let allPosts = [];

    // Her bir anahtar i�in kontrol et
    for (const key of storageKeys) {
        const posts = JSON.parse(localStorage.getItem(key) || '[]');

        // Bu anahtardan gelen yaz�lar� allPosts'a ekle
        allPosts = [...allPosts, ...posts];

        // PostId ile e�le�en yaz�y� bul
        const post = posts.find(post =>
            post.id === parseInt(postId) ||
            post.id === postId ||
            post.id === postId.toString()
        );

        if (post) {
            foundPost = post;
            console.log(`Yaz� ${key} i�inde bulundu:`, post.title);
            break;
        }
    }

    // Yaz� bulunduysa g�ster
    if (foundPost) {
        // E�er yaz� bulunduysa durumunu approved olarak ayarla
        foundPost.status = foundPost.status || 'approved';

        // Yaz�y� g�ster
        snk_popup_openPopup(foundPost);

        // Yaz�y� t�m localStorage anahtarlar�na kaydet (veri tutarl�l��� i�in)
        // Bu, yaz�n�n ana sayfada ve admin sayfas�nda g�r�nmesini sa�lar
        for (const key of storageKeys) {
            let posts = JSON.parse(localStorage.getItem(key) || '[]');

            // Yaz� bu anahtarda varsa, g�ncelle
            const existingIndex = posts.findIndex(post =>
                post.id === parseInt(postId) ||
                post.id === postId ||
                post.id === postId.toString()
            );

            if (existingIndex !== -1) {
                posts[existingIndex] = foundPost;
            } else {
                // Yaz� bu anahtarda yoksa, ekle
                posts.push(foundPost);
            }

            // G�ncellenmi� yaz�lar� localStorage'a kaydet
            localStorage.setItem(key, JSON.stringify(posts));
            console.log(`Yaz� ${key} i�ine kaydedildi`);
        }

        return;
    }

    // Kullan�c� g�nderilerinde bulunamad�ysa, blogPosts.json'dan veri �ek
    setTimeout(() => {
        fetch('../utils/blogPosts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Veri y�klenemedi');
                }
                return response.json();
            })
            .then(data => {
                const post = data.posts.find(post => post.id === parseInt(postId) || post.id === postId);

                if (post) {
                    // Yaz� durumunu approved olarak ayarla
                    post.status = post.status || 'approved';

                    // Popup'� a�arak yaz�y� g�ster
                    snk_popup_openPopup(post);

                    // Bu yaz�y� localStorage'a da ekle
                    for (const key of storageKeys) {
                        let posts = JSON.parse(localStorage.getItem(key) || '[]');

                        // Yaz� zaten mevcutsa ekleme
                        if (!posts.some(p => p.id === post.id)) {
                            posts.push(post);
                            localStorage.setItem(key, JSON.stringify(posts));
                            console.log(`Yaz� ${key} i�ine kaydedildi`);
                        }
                    }
                } else {
                    throw new Error('Yaz� bulunamad�');
                }
            })
            .catch(error => {
                console.error('Veri �ekme hatas�:', error);
                if (snk_popup_content) {
                    snk_popup_content.innerHTML = `
                        <div class="snk-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Yaz� y�klenirken bir hata olu�tu. L�tfen daha sonra tekrar deneyin.</p>
                        </div>
                    `;
                }

                if (snk_popup_title) {
                    snk_popup_title.textContent = 'Hata';
                }
            });
    }, 500);
}

// Sayfa y�klendi�inde haz�rl�k
document.addEventListener('DOMContentLoaded', () => {
    console.log("Popup.js y�klendi");

    // DOM elemanlar�n� tekrar se� (lazy loading i�in)
    const popupOverlay = document.getElementById('snk_popupOverlay');
    const popupCloseBtn = document.getElementById('snk_popupCloseBtn');

    console.log("Popup elemanlar�:", { popupOverlay, popupCloseBtn });

    // Olay dinleyicilerini ekle
    if (popupCloseBtn) {
        console.log("Popup kapatma butonu olay� ekleniyor");
        popupCloseBtn.addEventListener('click', snk_popup_closePopup);
    } else {
        console.error("Popup kapatma butonu bulunamad�!");
    }

    if (popupOverlay) {
        console.log("Popup d��� t�klama olay� ekleniyor");
        popupOverlay.addEventListener('click', snk_popup_handleClickOutside);
    } else {
        console.error("Popup overlay bulunamad�!");
    }

    document.addEventListener('keydown', snk_popup_handleKeyPress);

    // 'Devam�n� Oku' butonlar� i�in olay dinleyicileri ekle
    const readMoreButtons = document.querySelectorAll('.snk-read-more-btn');
    if (readMoreButtons.length > 0) {
        console.log("Devam�n� Oku butonlar� bulundu:", readMoreButtons.length);
        readMoreButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Sayfa yenilenmesini �nle
                const postId = button.getAttribute('data-post-id');
                console.log("Devam�n� Oku butonuna t�kland�, Post ID:", postId);

                // �lgili yaz�y� getir ve popup'ta g�ster
                snk_popup_fetchPostData(postId);
            });
        });
    } else {
        console.warn("Hi� 'Devam�n� Oku' butonu bulunamad�");
    }
});

// Global olarak bu fonksiyonlara eri�im sa�la
window.snk_popup_fetchPostData = snk_popup_fetchPostData;
window.snk_popup_openPopup = snk_popup_openPopup;
window.snk_popup_closePopup = snk_popup_closePopup;
