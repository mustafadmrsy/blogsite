/**
 * Main JavaScript - Senirkent Blog
 * Her fonksiyon öneki: snk_main_ (kod çakýþmalarýný önlemek için)
 */

// DOM elemanlarýný tanýmla
const snk_main_postsContainer = document.getElementById('snk_postsContainer');
const snk_main_filterNewest = document.getElementById('snk_filterNewest');
const snk_main_filterPopular = document.getElementById('snk_filterPopular');

// Blog yazýlarýnýn tutulacaðý dizi
let snk_main_blogPosts = [];

/**
 * Sayfa yüklendiðinde çalýþacak fonksiyonlar
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log("Main.js yüklendi");

    // DOM elemanlarýný tekrar tanýmla (lazy loading için güvenlik)
    const postsContainer = document.getElementById('snk_postsContainer');
    const filterNewest = document.getElementById('snk_filterNewest');
    const filterPopular = document.getElementById('snk_filterPopular');
    const sidebarPopular = document.getElementById('snk_sidebarPopular');

    console.log("Main elemanlarý:", { postsContainer, filterNewest, filterPopular, sidebarPopular });

    // Blog yazýlarýný yükle
    snk_main_loadBlogPosts();

    // Filtreleme butonlarý için olay dinleyicileri ekle
    snk_main_setupFilterButtons();

    // Sidebar'daki popüler linki için olay dinleyicisi
    if (sidebarPopular) {
        sidebarPopular.addEventListener('click', (e) => {
            e.preventDefault(); // Sayfanýn yenilenmesini engelle

            // Popüler filtreyi aktifleþtir
            if (filterPopular) {
                filterPopular.click(); // Popüler filtresine týklamayý simüle et
            } else {
                // Popüler filtresi bulunamazsa manuel olarak uygula
                // UI güncelleme
                document.querySelectorAll('.snk-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.id === 'snk_filterPopular') {
                        btn.classList.add('active');
                    }
                });

                // Blog yazýlarýný filtrele ve göster
                snk_main_filterPosts();
            }

            // Sidebar link'lerinin aktif durumunu güncelle
            document.querySelectorAll('.snk-sidebar-item').forEach(item => {
                item.classList.remove('active');
            });
            sidebarPopular.classList.add('active');
        });
    }

    // Þifre görünürlük butonunu ayarla
    snk_main_setupPasswordToggle();

    // Giriþ/Kayýt form geçiþlerini ayarla
    snk_main_setupAuthFormToggles();

    // Login popup kapatma butonunu ayarla
    snk_main_setupLoginPopupClose();
});

/**
 * Blog yazýlarýný JSON dosyasýndan yükler
 */
function snk_main_loadBlogPosts() {
    console.log('Blog yazýlarý yükleniyor...');

    // Yükleniyor mesajýný göster
    const container = document.getElementById('snk_postsContainer');
    if (!container) {
        console.error('Blog yazýlarý konteyneri bulunamadý');
        return;
    }

    container.innerHTML = `
        <div class="snk-loading">
            <i class="fas fa-spinner fa-spin"></i> Blog yazýlarý yükleniyor...
        </div>
    `;

    // Önce localStorage'dan kullanýcý yazýlarýný al
    const localPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
    console.log('LocalStorage\'dan yüklenen yazý sayýsý:', localPosts.length);

    // Daha sonra JSON dosyasýndan varsayýlan yazýlarý yükle
    fetch('../utils/blogPosts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Blog yazýlarý yüklenemedi');
            }
            return response.json();
        })
        .then(data => {
            console.log("Blog verileri yüklendi:", data.posts.length);

            // Blog yazýlarýný sakla
            snk_main_blogPosts = [...localPosts, ...data.posts];

            // Yazýlarý ekrana göster
            snk_main_onBlogPostsLoaded(snk_main_blogPosts);
        })
        .catch(error => {
            console.error('Blog yazýlarý yükleme hatasý:', error);
            if (snk_main_postsContainer) {
                snk_main_postsContainer.innerHTML = `
                    <div class="snk-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Blog yazýlarý yüklenirken bir hata oluþtu. Lütfen daha sonra tekrar deneyin.</p>
                    </div>
                `;
            }
        });
}

/**
 * Blog yazýlarýnýn yüklenmesi tamamlandýðýnda çaðrýlacak iþlev
 * @param {Array} posts - Yüklenen blog yazýlarý dizisi
 */
function snk_main_onBlogPostsLoaded(posts) {
    // Sadece onaylanmýþ postlarý filtrele
    const approvedPosts = posts.filter(post => post.status === 'approved' || !post.status);

    console.log('Onaylanmýþ yazý sayýsý:', approvedPosts.length);
    console.log('Toplam yazý sayýsý:', posts.length);

    // Tüm gönderileri göster
    snk_main_displayBlogPosts(approvedPosts);
}

/**
 * Filtreleme butonlarýný ayarla
 */
function snk_main_setupFilterButtons() {
    const newestBtn = document.getElementById('snk_filterNewest');
    const popularBtn = document.getElementById('snk_filterPopular');

    if (newestBtn && popularBtn) {
        console.log('Filtreleme butonlarý bulundu, ancak iþlevleri kaldýrýldý.');
    }
}

/**
 * Blog kartlarý oluþturma fonksiyonu
 * @param {Array} posts - Blog gönderileri dizisi
 * @param {HTMLElement} container - Blog kartlarýnýn ekleneceði konteyner
 */
function snk_main_createBlogCards(posts, container) {
    if (!container) {
        console.error("Blog kartlarý için konteyner bulunamadý");
        return;
    }

    // Konteyner içeriðini temizle
    container.innerHTML = '';

    // Her bir gönderi için kart oluþtur
    posts.forEach(post => {
        // Blog kartý öðesi oluþtur
        const cardElement = document.createElement('div');
        cardElement.className = 'snk-blog-card';
        cardElement.dataset.postId = post.id;

        // Kart içeriði HTML'i
        cardElement.innerHTML = `
            <div class="snk-blog-card-image">
                <img src="${post.imageSrc || '../assets/post-img-default.jpg'}" alt="${post.title}">
            </div>
            <div class="snk-blog-card-content">
                <div class="snk-blog-card-categories">
                    ${post.categories.map(cat => `<span class="snk-blog-category">${cat}</span>`).join('')}
                </div>
                <h3 class="snk-blog-card-title">${post.title}</h3>
                <p class="snk-blog-card-summary">${post.summary}</p>
                <div class="snk-blog-card-meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${post.date}</span>
                    <span><i class="fas fa-eye"></i> ${post.views} Okunma</span>
                </div>
                <div class="snk-post-actions">
                    <button class="snk-action-button snk-like-button" data-post-id="${post.id}">
                        <i class="far fa-heart"></i> <span class="snk-like-count">0</span> Beðen
                    </button>
                    <button class="snk-action-button snk-comment-button" data-post-id="${post.id}">
                        <i class="far fa-comment"></i> Yorum Yap
                    </button>
                    <button class="snk-action-button snk-share-button" data-post-id="${post.id}">
                        <i class="far fa-share-square"></i> Paylaþ
                    </button>
                </div>
                <div class="snk-blog-card-read-more">
                    <button class="snk-blog-read-more-btn" data-post-id="${post.id}">
                        Devamýný Oku <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        // Kartý konteyner'a ekle
        container.appendChild(cardElement);

        // Kart etkileþimlerini ayarla
        snk_main_setupPostInteractions(cardElement, post);
    });
}

/**
 * Blog kartlarý için etkileþimleri ayarlayan fonksiyon
 * @param {HTMLElement} postElement - Post elementi
 * @param {Object} postData - Post verisi
 */
function snk_main_setupPostInteractions(postElement, postData) {
    // Devamýný Oku butonu
    const readMoreBtn = postElement.querySelector('.snk-blog-read-more-btn');
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const postId = parseInt(this.dataset.postId);
            window.location.href = `./blogs.html?id=${postId}`;
        });
    }

    // Beðeni butonu
    const likeButton = postElement.querySelector('.snk-like-button');
    if (likeButton) {
        likeButton.addEventListener('click', function (event) {
            event.preventDefault();
            SNK_CommentSystem.toggleLike(this);
        });
    }

    // Yorum butonu
    const commentButton = postElement.querySelector('.snk-comment-button');
    if (commentButton) {
        commentButton.addEventListener('click', function (event) {
            event.preventDefault();
            const postId = this.getAttribute('data-post-id');
            SNK_CommentSystem.openCommentModal(postId);
        });
    }

    // Paylaþ butonu
    const shareButton = postElement.querySelector('.snk-share-button');
    if (shareButton) {
        shareButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); // Týklama olayýnýn yayýlmasýný önle
            const postId = this.getAttribute('data-post-id');
            console.log("Paylaþ butonuna týklandý. Post ID:", postId);

            const post = snk_main_blogPosts.find(p => p.id === postId);

            if (post) {
                // Paylaþ fonksiyonunu çaðýr
                SNK_CommentSystem.sharePost(postId, event);
            }
        });
    }
}

/**
 * Blog gönderilerini görüntüleme fonksiyonu (Reddit tarzý yeni tasarým için)
 * @param {Array} posts - Görüntülenecek blog gönderileri dizisi
 */
function snk_main_displayBlogPosts(posts) {
    console.log("Blog gönderileri görüntüleniyor:", posts);

    // HTML içeriðini hazýrla
    let postsHTML = '';

    if (posts.length === 0) {
        postsHTML = `
            <div class="snk-empty-state">
                <i class="fas fa-search"></i>
                <p>Gösterilecek blog yazýsý bulunamadý.</p>
            </div>
        `;
    } else {
        posts.forEach(post => {
            // Gönderi açýklamasýný 150 karakterle sýnýrla
            const shortDescription = post.summary.length > 150
                ? post.summary.substring(0, 150) + '...'
                : post.summary;

            postsHTML += `
                <div class="snk-blog-card" data-post-id="${post.id}">
                    <div class="snk-blog-image">
                        <img src="${post.image || 'assets/images/default-post.jpg'}" alt="${post.title}">
                    </div>
                    <div class="snk-blog-content">
                        <div class="snk-blog-header">
                            <div class="snk-blog-meta">
                                <span class="snk-blog-category">${post.category}</span>
                                <span class="snk-blog-author"><i class="fas fa-user"></i> ${post.author || 'Anonim'}</span>
                                <span class="snk-blog-date"><i class="fas fa-calendar-alt"></i> ${post.date || 'Tarih bilgisi yok'}</span>
                            </div>
                            <h2 class="snk-blog-title">${post.title}</h2>
                        </div>
                        <p class="snk-blog-description">${shortDescription}</p>
                        <div class="snk-blog-actions">
                            <button class="snk-action-btn snk-like-button" data-post-id="${post.id}">
                                <i class="far fa-thumbs-up"></i> Beðen
                                <span class="snk-like-count">${post.likes || 0}</span>
                            </button>
                            <button class="snk-action-btn snk-comment-button" data-post-id="${post.id}">
                                <i class="far fa-comment"></i> Yorum Yap
                            </button>
                            <button class="snk-action-btn snk-share-button" data-post-id="${post.id}">
                                <i class="far fa-share-square"></i> Paylaþ
                            </button>
                            <button class="snk-read-more-btn snk-read-more" data-post-id="${post.id}">
                                Devamýný Oku <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Ýçeriði DOM'a ekle
    if (snk_main_postsContainer) {
        snk_main_postsContainer.innerHTML = postsHTML;

        // Etkileþimleri kur
        snk_main_setupPostInteractions(snk_main_postsContainer);
    }
}

/**
 * Yazý etkileþimlerini kuran fonksiyon (yeni Reddit tarzý tasarým için)
 * @param {HTMLElement} container - Ýçinde etkileþimli elemanlarýn olduðu konteyner
 */
function snk_main_setupPostInteractions(container) {
    // Devamýný Oku butonlarý
    const readMoreButtons = container.querySelectorAll('.snk-read-more');
    readMoreButtons.forEach(button => {
        // Önceki event listenerlarý temizle (bu önemli, aksi halde çift çalýþabilir)
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); // Event yayýlmasýný önle

            const postId = parseInt(this.dataset.postId);
            console.log(`"Devamýný Oku" butonuna týklandý. Post ID: ${postId}`);

            window.location.href = `./blogs.html?id=${postId}`;
        });
    });

    // Beðen butonlarý
    const likeButtons = container.querySelectorAll('.snk-like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            SNK_CommentSystem.toggleLike(this);
        });
    });

    // Yorum butonlarý
    const commentButtons = container.querySelectorAll('.snk-comment-button');
    commentButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const postId = parseInt(this.dataset.postId);
            console.log("Yorum butonuna týklandý. Post ID:", postId);

            // Popup içinde yorum bölümüne odaklanma
            SNK_CommentSystem.openCommentModal(postId);
        });
    });

    // Paylaþ butonlarý
    const shareButtons = container.querySelectorAll('.snk-share-button');
    shareButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); // Týklama olayýnýn yayýlmasýný önle
            const postId = parseInt(this.dataset.postId);
            console.log("Paylaþ butonuna týklandý. Post ID:", postId);

            const post = snk_main_blogPosts.find(p => p.id === postId);
            if (post) {
                // Paylaþ fonksiyonunu çaðýr
                SNK_CommentSystem.sharePost(postId, event);
            }
        });
    });
}

/**
 * Blog popup'ýný gösterme fonksiyonu
 * @param {number} postId - Gösterilecek yazýnýn ID'si
 */
function snk_main_showBlogPopup(postId) {
    console.log("Blog popup gösteriliyor. Post ID:", postId);

    try {
        // Blog yazýlarýný localStorage'dan al
        const allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
        console.log("Tüm yazýlar:", allPosts);

        // ID'ye göre yazýyý bul
        const post = allPosts.find(p => parseInt(p.id) === parseInt(postId));

        if (!post) {
            console.error(`ID: ${postId} olan yazý bulunamadý`);
            alert("Bu blog yazýsý bulunamadý.");
            return;
        }

        console.log("Gösterilecek yazý:", post);

        // Var olan popuplarý temizle
        const existingPopups = document.querySelectorAll('.snk-popup-overlay');
        existingPopups.forEach(popup => popup.remove());

        // Yeni popup oluþtur
        const popupEl = document.createElement('div');
        popupEl.className = 'snk-popup-overlay';

        // Ýçerik HTML'ini oluþtur
        popupEl.innerHTML = `
            <div class="snk-popup-content">
                <button class="snk-popup-close">&times;</button>
                <article class="snk-popup-article">
                    <header class="snk-popup-header">
                        <div class="snk-popup-meta">
                            <span class="snk-popup-category">${post.category || 'Genel'}</span>
                            <span class="snk-popup-author">Yazar: ${post.author || 'Anonim'}</span>
                            <span class="snk-popup-date">${post.date || 'Tarih bilgisi yok'}</span>
                        </div>
                        <h1 class="snk-popup-title">${post.title || 'Baþlýksýz Yazý'}</h1>
                    </header>
                    
                    ${post.image ? `
                    <div class="snk-popup-featured-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    ` : ''}
                    
                    <div class="snk-popup-content-body">
                        ${post.content || post.summary || 'Ýçerik bulunamadý.'}
                    </div>
                </article>
            </div>
        `;

        // Popup'ý sayfaya ekle
        document.body.appendChild(popupEl);

        // Dark mode kontrolü
        const isDarkMode = document.body.classList.contains('eren-dark-theme');
        if (isDarkMode) {
            popupEl.querySelector('.snk-popup-content').classList.add('eren-dark-theme');
        }

        // Popup'ý görünür yap
        setTimeout(() => popupEl.classList.add('active'), 10);

        // Kapatma butonu iþlevselliði
        const closeBtn = popupEl.querySelector('.snk-popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            });
        }

        // Popup dýþýna týklayýnca kapat
        popupEl.addEventListener('click', (e) => {
            if (e.target === popupEl) {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            }
        });

        // Dark mode deðiþikliklerini dinle
        document.addEventListener('darkModeChanged', (e) => {
            if (e.detail.darkMode) {
                popupEl.querySelector('.snk-popup-content').classList.add('eren-dark-theme');
            } else {
                popupEl.querySelector('.snk-popup-content').classList.remove('eren-dark-theme');
            }
        });

    } catch (error) {
        console.error("Blog popup gösterme hatasý:", error);
        alert("Blog yazýsý gösterilirken bir hata oluþtu.");
    }
}

/**
 * Yazý etkileþimlerini kuran fonksiyon
 * @param {HTMLElement} container - Ýçinde etkileþimli elemanlarýn olduðu konteyner
 */
function snk_main_setupPostInteractions(container) {
    if (!container) {
        console.error("Post etkileþimleri kurulamadý: Konteyner bulunamadý");
        return;
    }

    console.log("Post etkileþimleri kuruluyor...");

    // Devamýný Oku butonlarý
    const readMoreButtons = container.querySelectorAll('.snk-read-more');
    console.log(`${readMoreButtons.length} adet "Devamýný Oku" butonu bulundu`);

    if (readMoreButtons.length === 0) {
        console.log("Devamýný Oku butonlarý bulunamadý, tüm kart butonlarýna event listener ekleniyor...");

        // Tüm blog kartlarýný bul ve direkt kartlara týklama olayý ekle (devamýný oku butonlarý yoksa)
        const blogCards = container.querySelectorAll('.snk-blog-card');
        blogCards.forEach(card => {
            const postId = card.dataset.postId;
            if (postId) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    // Eðer týklanan yer bir buton deðilse popup'ý aç
                    if (!e.target.closest('button')) {
                        e.preventDefault();
                        console.log(`Blog kartýna týklandý. Post ID: ${postId}`);
                        window.location.href = `./blogs.html?id=${postId}`;
                    }
                });
            }
        });
    }

    // Her "Devamýný Oku" butonuna olay dinleyicisi ekle
    readMoreButtons.forEach(btn => {
        // Önceki dinleyicileri temizle
        const newBtn = btn.cloneNode(true);
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }

        // Yeni dinleyici ekle
        newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const postId = this.dataset.postId;
            if (postId) {
                console.log(`"Devamýný Oku" butonuna týklandý. Post ID: ${postId}`);
                window.location.href = `./blogs.html?id=${postId}`;
            } else {
                console.error("Post ID bulunamadý");
            }
        });
    });

    // Diðer butonlar için etkileþimler burada korundu
}

/**
 * Blog yazýlarýný aktif filtreye göre filtreler
 */
function snk_main_filterPosts(posts) {
    console.log(`Yazýlar filtreleniyor`);

    // Sadece onaylanmýþ yazýlarý filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmiþ yazýlarý göster
    snk_main_displayBlogPosts(filteredPosts);
}

/**
 * En çok okunan yazýlarý sað sütunda göster
 * @param {Array} posts - Blog yazýlarý dizisi
 * @param {string} filterType - Filtreleme türü (newest/popular)
 */
function snk_main_displayPopularPosts(posts, filterType = 'newest') {
    // Bu fonksiyon kaldýrýldý
}

/**
 * Tek bir blog yazýsý oluþturup ekranda gösterir
 * @param {Object} post - Gösterilecek blog yazýsý verisi
 * @param {HTMLElement} container - Yazýnýn ekleneceði container
 */
function snk_main_createAndDisplaySinglePost(post, container) {
    // Ýlk önce container içeriðini temizle
    container.innerHTML = '';

    // Yazý HTML'ini oluþtur
    const postHTML = `
        <div class="snk-post expanded" data-post-id="${post.id}">
            <div class="snk-post-content-wrapper">
                <div class="snk-post-main">
                    <div class="snk-post-header">
                        <div class="snk-post-info">
                            <span class="snk-post-category">r/${post.category}</span>
                            <span class="snk-post-author">Posted by u/${post.author}</span>
                            <span class="snk-post-date">${new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <h3 class="snk-post-title">${post.title}</h3>
                    </div>
                    ${post.image ? `<div class="snk-post-image"><img src="${post.image}" alt="${post.title}"></div>` : ''}
                    <div class="snk-post-summary">
                        <div class="snk-post-full-content">
                            ${post.content}
                            ${post.tags && post.tags.length ? `
                                <div class="snk-post-tags">
                                    ${post.tags.map(tag => `<span class="snk-tag">#${tag}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="snk-post-footer">
                        <button class="snk-post-action snk-read-more" data-post-id="${post.id}" data-expanded="true">
                            <i class="fas fa-angle-up"></i> Daralt
                        </button>
                        <button class="snk-post-action">
                            <i class="fas fa-comment-alt"></i> Yorumlar
                        </button>
                        <button class="snk-post-action">
                            <i class="fas fa-share"></i> Paylaþ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Yazýyý container'a ekle
    container.insertAdjacentHTML('afterbegin', postHTML);

    // Kategori filtresini kontrol et
    if (typeof updateCategoryVisibility === 'function') {
        updateCategoryVisibility();
    }

    // Etkileþim fonksiyonlarýný ayarla - ZORUNLU
    snk_main_setupPostInteractions(container, post);

    // Baþarý mesajý göster
    alert('Blog yazýnýz baþarýyla oluþturuldu!');
}

/**
 * Blog yazýlarýnda yorum bölümünü gösterir
 * @param {number} postId - Yorum yapýlacak yazýnýn ID'si
 */
function snk_main_toggleComments(postId) {
    const post = snk_main_blogPosts.find(p => p.id === postId);
    if (!post) return;

    // Mevcut yorum bölümünü bul
    const postElement = document.querySelector(`.snk-post[data-post-id="${postId}"]`);
    if (!postElement) return;

    // Varsa mevcut yorum bölümünü kontrol et
    let commentsSection = postElement.querySelector('.snk-post-comments');

    // Yorum bölümü varsa kapat, yoksa aç
    if (commentsSection) {
        if (commentsSection.classList.contains('active')) {
            commentsSection.classList.remove('active');
            setTimeout(() => commentsSection.remove(), 300);
        } else {
            commentsSection.classList.add('active');
        }
        return;
    }

    // Örnek yorumlar (gerçek uygulamada API'den gelecek)
    const comments = [
        {
            id: 1,
            author: 'mustafadmrsy',
            date: '2025-03-02',
            content: 'Harika bir yazý olmuþ! Özellikle teknik detaylarý açýklamanýz çok faydalý oldu.',
            likes: 5
        },
        {
            id: 2,
            author: 'senirkentli',
            date: '2025-03-03',
            content: 'Konuyu çok güzel özetlemiþsiniz. Acaba kaynaklarýnýzý da paylaþabilir misiniz?',
            likes: 3
        },
        {
            id: 3,
            author: 'tekyazilimci',
            date: '2025-03-05',
            content: 'Ben de benzer bir proje üzerinde çalýþýyorum. Bazý noktalarda zorlandým, bu yazý tam ihtiyacým olandý!',
            likes: 8
        }
    ];

    // Yorum bölümü oluþtur
    commentsSection = document.createElement('div');
    commentsSection.className = 'snk-post-comments active';
    commentsSection.id = `snk_comment_section_${postId}`;

    // Yorumlar baþlýðý
    const headerHTML = `
        <div class="snk-comments-header" id="snk_comment_header_${postId}">
            <h3 class="snk-comments-title">
                <i class="fas fa-comment-alt"></i> Yorumlar
                <span class="snk-comments-count">${comments.length}</span>
            </h3>
            <button class="snk-comments-close" id="snk_comment_close_${postId}">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Yorum listesi
    let commentsHTML = `<div class="snk-comments-list" id="snk_comment_list_${postId}">`;

    comments.forEach(comment => {
        commentsHTML += `
            <div class="snk-comment" data-comment-id="${comment.id}" id="snk_comment_item_${postId}_${comment.id}">
                <div class="snk-comment-header">
                    <span class="snk-comment-author">
                        <i class="fas fa-user-circle"></i> ${comment.author}
                    </span>
                    <span class="snk-comment-date">${new Date(comment.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div class="snk-comment-content">
                    ${comment.content}
                </div>
                <div class="snk-comment-actions">
                    <button class="snk-comment-action snk-comment-like" id="snk_comment_like_${postId}_${comment.id}">
                        <i class="fas fa-thumbs-up"></i> Beðen (${comment.likes})
                    </button>
                    <button class="snk-comment-action snk-comment-reply" id="snk_comment_reply_${postId}_${comment.id}">
                        <i class="fas fa-reply"></i> Yanýtla
                    </button>
                </div>
            </div>
        `;
    });

    commentsHTML += '</div>';

    // Yeni yorum formu
    const formHTML = `
        <div class="snk-new-comment" id="snk_comment_form_container_${postId}">
            <form class="snk-comment-form" id="snk_comment_form_${postId}">
                <textarea placeholder="Yorumunuzu buraya yazýn..." class="snk-comment-textarea" id="snk_comment_textarea_${postId}"></textarea>
                <div class="snk-comment-form-actions">
                    <button type="button" class="snk-comment-btn snk-comment-cancel" id="snk_comment_cancel_${postId}">
                        Ýptal
                    </button>
                    <button type="submit" class="snk-comment-btn snk-comment-submit" id="snk_comment_submit_${postId}">
                        Yorum Yap
                    </button>
                </div>
            </form>
        </div>
    `;

    // Tüm HTML'i bir araya getir
    commentsSection.innerHTML = headerHTML + commentsHTML + formHTML;

    // Yorum bölümünü blog yazýsýnýn sonuna ekle
    postElement.appendChild(commentsSection);

    // Kapatma butonuna týklama
    const closeBtn = document.getElementById(`snk_comment_close_${postId}`);
    closeBtn.addEventListener('click', () => {
        commentsSection.classList.remove('active');
        setTimeout(() => commentsSection.remove(), 300);
    });

    // Ýptal butonuna týklama
    const cancelBtn = document.getElementById(`snk_comment_cancel_${postId}`);
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const textarea = document.getElementById(`snk_comment_textarea_${postId}`);
            if (textarea) {
                textarea.value = '';
            }
        });
    }

    // Form gönderme olayý
    const commentForm = document.getElementById(`snk_comment_form_${postId}`);
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const textarea = document.getElementById(`snk_comment_textarea_${postId}`);
            if (textarea && textarea.value.trim()) {
                // Yeni yorum oluþtur (gerçek uygulamada API'ye gönderilecek)
                alert('Yorumunuz baþarýyla gönderildi!');
                textarea.value = '';
            }
        });
    }

    // Yorum beðenme butonlarýna týklama
    const likeButtons = commentsSection.querySelectorAll('.snk-comment-like');
    likeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const commentId = parseInt(this.closest('.snk-comment').getAttribute('data-comment-id'));
            snk_main_likeComment(commentId, this);
        });
    });

    // Yorum yanýtlama butonlarýna týklama
    const replyButtons = commentsSection.querySelectorAll('.snk-comment-reply');
    replyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const commentId = parseInt(this.closest('.snk-comment').getAttribute('data-comment-id'));
            snk_main_replyToComment(commentId, this);
        });
    });
}

/**
 * Blog yazýlarýnda bir yorumu beðenmek için kullanýlýr
 * @param {number} commentId - Beðenilecek yorumun ID'si
 * @param {HTMLElement} button - Týklanan beðeni butonu
 */
function snk_main_likeComment(commentId, button) {
    const commentElement = document.querySelector(`.snk-comment[data-comment-id="${commentId}"]`);
    if (!commentElement) return;

    // Butondaki beðeni sayýsýný al
    const likeText = button.textContent;
    const likeCount = parseInt(likeText.match(/\d+/)[0]);

    // Eðer buton zaten beðenilmiþse, beðeniyi kaldýr
    if (button.classList.contains('active')) {
        button.classList.remove('active');
        button.innerHTML = `<i class="fas fa-thumbs-up"></i> Beðen (${likeCount - 1})`;
    } else {
        // Beðeni ekle
        button.classList.add('active');
        button.innerHTML = `<i class="fas fa-thumbs-up"></i> Beðen (${likeCount + 1})`;
    }

    // Animasyon efekti
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);

    // Gerçek uygulamada burada API çaðrýsý yapýlýrdý
    console.log(`Yorum ID: ${commentId} beðeni durumu deðiþtirildi.`);
}

/**
 * Blog yazýlarýnda bir yoruma yanýt verme formunu gösterir
 * @param {number} commentId - Yanýtlanacak yorumun ID'si
 * @param {HTMLElement} button - Týklanan yanýtla butonu
 */
function snk_main_replyToComment(commentId, button) {
    const commentElement = document.querySelector(`.snk-comment[data-comment-id="${commentId}"]`);
    if (!commentElement) return;

    // Varsa mevcut yanýt formunu kontrol et
    let replyForm = commentElement.querySelector('.snk-reply-form-container');

    // Form varsa kaldýr (toggle iþlevi)
    if (replyForm) {
        replyForm.remove();
        return;
    }

    // Yanýt formunu oluþtur
    replyForm = document.createElement('div');
    replyForm.className = 'snk-reply-form-container';
    replyForm.id = `snk_reply_form_container_${commentId}`;

    // Formun HTML içeriðini oluþtur
    replyForm.innerHTML = `
        <form class="snk-reply-form" id="snk_reply_form_${commentId}">
            <textarea placeholder="Yanýtýnýzý buraya yazýn..." class="snk-reply-textarea" id="snk_reply_textarea_${commentId}"></textarea>
            <div class="snk-reply-form-actions">
                <button type="button" class="snk-reply-btn snk-reply-cancel" id="snk_reply_cancel_${commentId}">
                    Ýptal
                </button>
                <button type="submit" class="snk-reply-btn snk-reply-submit" id="snk_reply_submit_${commentId}">
                    Yanýtla
                </button>
            </div>
        </form>
    `;

    // Yanýt formunu yoruma ekle
    commentElement.appendChild(replyForm);

    // Form animasyonu
    setTimeout(() => {
        replyForm.style.maxHeight = '200px';
        replyForm.style.opacity = '1';
    }, 10);

    // Textarea'ya otomatik odaklanma
    const textarea = document.getElementById(`snk_reply_textarea_${commentId}`);
    textarea.focus();

    // Ýptal butonuna týklama
    const cancelBtn = document.getElementById(`snk_reply_cancel_${commentId}`);
    cancelBtn.addEventListener('click', () => {
        replyForm.style.maxHeight = '0';
        replyForm.style.opacity = '0';
        setTimeout(() => replyForm.remove(), 300);
    });

    // Yanýt formunun gönderilmesi
    const form = document.getElementById(`snk_reply_form_${commentId}`);
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const replyText = textarea.value.trim();
        if (replyText) {
            // Yeni yanýt yorumunu oluþtur
            const newReply = document.createElement('div');
            newReply.className = 'snk-comment snk-reply';

            // Rastgele bir ID oluþtur (gerçek uygulamada API'den gelir)
            const replyId = Math.floor(Math.random() * 1000) + commentId + 100;
            newReply.id = `snk_comment_reply_item_${replyId}`;
            newReply.dataset.commentId = replyId;

            // Yanýt içeriðini oluþtur
            newReply.innerHTML = `
                <div class="snk-comment-header">
                    <span class="snk-comment-author">
                        <i class="fas fa-user-circle"></i> Ziyaretçi
                    </span>
                    <span class="snk-comment-date">${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div class="snk-comment-content">
                    ${replyText}
                </div>
                <div class="snk-comment-actions">
                    <button class="snk-comment-action snk-comment-like" id="snk_comment_like_${replyId}">
                        <i class="fas fa-thumbs-up"></i> Beðen (0)
                    </button>
                </div>
            `;

            // Yanýtý yorumdan hemen sonra ekle
            commentElement.after(newReply);

            // Yeni yanýta beðenme fonksiyonu ekle
            const newLikeButton = document.getElementById(`snk_comment_like_${replyId}`);
            newLikeButton.addEventListener('click', function () {
                snk_main_likeComment(replyId, this);
            });

            // Formu kapat
            replyForm.remove();

            // Gerçek uygulamada burada API çaðrýsý yapýlýrdý
            console.log(`Yorum ID: ${commentId}'ye yanýt gönderildi: ${replyText}`);
        }
    });
}

/**
 * Blog popuplarý için style ekle
 */
(function () {
    // Eðer style elementimiz daha önce eklendiyse, tekrar ekleme
    if (document.getElementById('snk-blog-popup-styles')) return;

    // Popup için CSS ekle
    const style = document.createElement('style');
    style.id = 'snk-blog-popup-styles';
    style.innerHTML = `
        .snk-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .snk-popup-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .snk-popup-content {
            background-color: #fff;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            border-radius: 8px;
            padding: 25px;
            position: relative;
            transform: translateY(20px);
            transition: transform 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .snk-popup-overlay.active .snk-popup-content {
            transform: translateY(0);
        }
        
        .snk-popup-close {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 24px;
            background: none;
            border: none;
            cursor: pointer;
            color: #333;
            transition: color 0.2s;
        }
        
        .snk-popup-close:hover {
            color: #f44336;
        }
        
        .snk-popup-header {
            margin-bottom: 20px;
        }
        
        .snk-popup-title {
            font-size: 24px;
            margin: 10px 0;
        }
        
        .snk-popup-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 14px;
            color: #666;
        }
        
        .snk-popup-category {
            background-color: #e0f7fa;
            padding: 3px 8px;
            border-radius: 4px;
            color: #0097a7;
        }
        
        .snk-popup-featured-image {
            margin-bottom: 20px;
        }
        
        .snk-popup-featured-image img {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
            border-radius: 8px;
        }
        
        .snk-popup-content-body {
            line-height: 1.6;
        }
        
        /* Dark mode için uyumlu renkler */
        .eren-dark-theme .snk-popup-content {
            background-color: #333;
            color: #fff;
        }
        
        .eren-dark-theme .snk-popup-close {
            color: #eee;
        }
        
        .eren-dark-theme .snk-popup-meta {
            color: #ccc;
        }
        
        .eren-dark-theme .snk-popup-category {
            background-color: #263238;
            color: #4fc3f7;
        }
    `;

    document.head.appendChild(style);
})();

/**
 * Blog popup'ýný gösterme fonksiyonu
 * @param {number} postId - Gösterilecek yazýnýn ID'si
 */
function snk_main_showBlogPopup(postId) {
    console.log("Blog popup gösteriliyor. Post ID:", postId);

    try {
        // localStorage'dan yazýlarý al - hem 'snk_blog_posts' hem de 'posts' anahtarlarýný kontrol et
        let allPosts = [];
        try {
            // Ana depolama 'snk_blog_posts' anahtarýný kontrol et
            const storedPosts = localStorage.getItem('snk_blog_posts');
            if (storedPosts) {
                allPosts = JSON.parse(storedPosts);
                console.log("Yazýlar 'snk_blog_posts' anahtarýndan alýndý:", allPosts.length);
            } else {
                console.log("'snk_blog_posts' anahtarýnda veri bulunamadý");
            }
        } catch (e) {
            console.warn("'snk_blog_posts' okuma hatasý:", e);
        }

        // Eðer allPosts bir array deðilse veya boþsa baþka kaynaklarý kontrol et
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            try {
                const blogPostsJson = localStorage.getItem('posts');
                if (blogPostsJson) {
                    const parsed = JSON.parse(blogPostsJson);
                    // posts anahtarý içinde bir array varsa onu kullan
                    if (parsed && Array.isArray(parsed.posts)) {
                        allPosts = parsed.posts;
                        console.log("Yazýlar 'posts' anahtarýndan alýndý:", allPosts.length);
                    } else if (parsed && Array.isArray(parsed)) {
                        allPosts = parsed;
                        console.log("Yazýlar 'posts' anahtarýndan array olarak alýndý:", allPosts.length);
                    }
                }
            } catch (e) {
                console.warn("'posts' okuma hatasý:", e);
            }
        }

        console.log("Tüm yazýlar:", allPosts);

        // Eðer hala post bulunamazsa hata göster
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            console.error("Hiç blog yazýsý bulunamadý");
            alert("Blog yazýlarý yüklenemedi. Lütfen sayfayý yenileyip tekrar deneyin.");
            return;
        }

        // ID'ye göre yazýyý bul
        const post = allPosts.find(p => {
            const postIdInt = parseInt(p.id);
            const targetIdInt = parseInt(postId);
            const match = postIdInt === targetIdInt;
            if (match) {
                console.log(`Eþleþme bulundu: Post ID ${postIdInt} = Hedef ID ${targetIdInt}`);
            }
            return match;
        });

        if (!post) {
            console.error(`ID: ${postId} olan yazý bulunamadý`);
            console.log("Mevcut ID'ler:", allPosts.map(p => p.id));
            alert("Bu blog yazýsý bulunamadý.");
            return;
        }

        console.log("Gösterilecek yazý:", post);

        // Var olan popuplarý temizle
        const existingPopups = document.querySelectorAll('.snk-popup-overlay');
        existingPopups.forEach(popup => popup.remove());

        // Yeni popup oluþtur
        const popupEl = document.createElement('div');
        popupEl.className = 'snk-popup-overlay';

        // Ýçerik HTML'ini oluþtur
        popupEl.innerHTML = `
            <div class="snk-popup-content">
                <button class="snk-popup-close">&times;</button>
                <article class="snk-popup-article">
                    <header class="snk-popup-header">
                        <div class="snk-popup-meta">
                            <span class="snk-popup-category">${post.category || 'Genel'}</span>
                            <span class="snk-popup-author">Yazar: ${post.author || 'Anonim'}</span>
                            <span class="snk-popup-date">${post.date || 'Tarih bilgisi yok'}</span>
                        </div>
                        <h1 class="snk-popup-title">${post.title || 'Baþlýksýz Yazý'}</h1>
                    </header>
                    
                    ${post.image ? `
                    <div class="snk-popup-featured-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    ` : ''}
                    
                    <div class="snk-popup-content-body">
                        ${post.content || post.summary || 'Ýçerik bulunamadý.'}
                    </div>
                </article>
            </div>
        `;

        // Popup'ý sayfaya ekle
        document.body.appendChild(popupEl);

        // Dark mode kontrolü
        const isDarkMode = document.body.classList.contains('eren-dark-theme');
        if (isDarkMode) {
            popupEl.querySelector('.snk-popup-content').classList.add('eren-dark-theme');
        }

        // Popup'ý görünür yap
        setTimeout(() => popupEl.classList.add('active'), 10);

        // Kapatma butonu iþlevselliði
        const closeBtn = popupEl.querySelector('.snk-popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            });
        }

        // Popup dýþýna týklayýnca kapat
        popupEl.addEventListener('click', (e) => {
            if (e.target === popupEl) {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            }
        });

        // ESC tuþuna basýnca kapat
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                popupEl.classList.remove('active');
                setTimeout(() => {
                    popupEl.remove();
                    document.removeEventListener('keydown', escHandler);
                }, 300);
            }
        };
        document.addEventListener('keydown', escHandler);

    } catch (error) {
        console.error("Blog popup gösterme hatasý:", error);
        alert("Blog yazýsý gösterilirken bir hata oluþtu.");
    }
}

/**
 * Yazý etkileþimlerini kuran fonksiyon
 * @param {HTMLElement} container - Ýçinde etkileþimli elemanlarýn olduðu konteyner
 */
function snk_main_setupPostInteractions(container) {
    if (!container) {
        console.error("Post etkileþimleri kurulamadý: Konteyner bulunamadý");
        return;
    }

    console.log("Post etkileþimleri kuruluyor...");

    // Devamýný Oku butonlarý
    const readMoreButtons = container.querySelectorAll('.snk-read-more');
    console.log(`${readMoreButtons.length} adet "Devamýný Oku" butonu bulundu`);

    if (readMoreButtons.length === 0) {
        console.log("Devamýný Oku butonlarý bulunamadý, tüm kart butonlarýna event listener ekleniyor...");

        // Tüm blog kartlarýný bul ve direkt kartlara týklama olayý ekle (devamýný oku butonlarý yoksa)
        const blogCards = container.querySelectorAll('.snk-blog-card');
        blogCards.forEach(card => {
            const postId = card.dataset.postId;
            if (postId) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    // Eðer týklanan yer bir buton deðilse popup'ý aç
                    if (!e.target.closest('button')) {
                        e.preventDefault();
                        console.log(`Blog kartýna týklandý. Post ID: ${postId}`);
                        window.location.href = `./blogs.html?id=${postId}`;
                    }
                });
            }
        });
    }

    // Her "Devamýný Oku" butonuna olay dinleyicisi ekle
    readMoreButtons.forEach(btn => {
        // Önceki dinleyicileri temizle
        const newBtn = btn.cloneNode(true);
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }

        // Yeni dinleyici ekle
        newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const postId = this.dataset.postId;
            if (postId) {
                console.log(`"Devamýný Oku" butonuna týklandý. Post ID: ${postId}`);
                window.location.href = `./blogs.html?id=${postId}`;
            } else {
                console.error("Post ID bulunamadý");
            }
        });
    });

    // Diðer butonlar için etkileþimler burada korundu
}

/**
 * Blog yazýlarýný aktif filtreye göre filtreler
 */
function snk_main_filterPosts(posts) {
    console.log(`Yazýlar filtreleniyor`);

    // Sadece onaylanmýþ yazýlarý filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmiþ yazýlarý göster
    snk_main_displayBlogPosts(filteredPosts);
}

/**
 * En çok okunan yazýlarý sað sütunda göster
 * @param {Array} posts - Blog yazýlarý dizisi
 * @param {string} filterType - Filtreleme türü (newest/popular)
 */
function snk_main_displayPopularPosts() {
    // Bu fonksiyon kaldýrýldý
    console.log('Popüler yazýlar gösterme özelliði kaldýrýldý');

    // Sað sütundaki popüler yazýlar alanýný temizle
    const popularPostsContainer = document.getElementById('snk_popularPosts');
    if (popularPostsContainer) {
        popularPostsContainer.innerHTML = '<div class="snk-no-posts">Bu özellik kaldýrýldý.</div>';
    }
}

/**
 * Blog yazýlarýný JSON dosyasýndan yükler
 */
function snk_main_loadBlogPosts() {
    fetch('../utils/blogPosts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Blog yazýlarý yüklenemedi');
            }
            return response.json();
        })
        .then(data => {
            // localStorage'dan kullanýcý gönderilerini al ve birleþtir
            const localPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
            let allPosts = [...data.posts, ...localPosts];

            // Tekrarlý gönderileri önle (ID'ye göre kontrol)
            const uniquePosts = [];
            const postIds = new Set();

            allPosts.forEach(post => {
                if (!postIds.has(post.id)) {
                    postIds.add(post.id);
                    uniquePosts.push(post);
                }
            });

            // Yüklenen gönderileri global deðiþkene kaydet ve iþle
            snk_main_blogPosts = uniquePosts;

            console.log('Blog yazýlarý yüklendi, toplam:', snk_main_blogPosts.length);
            snk_main_onBlogPostsLoaded(snk_main_blogPosts);
        })
        .catch(error => {
            console.error('Blog yazýlarý yüklenirken hata oluþtu:', error);
            document.getElementById('snk_postsContainer').innerHTML = `
                <div class="snk-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Blog yazýlarý yüklenirken bir hata oluþtu. Lütfen daha sonra tekrar deneyin.</p>
                </div>
            `;
        });
}

/**
 * Blog yazýlarýnýn yüklenmesi tamamlandýðýnda çaðrýlacak iþlev
 * @param {Array} posts - Yüklenen blog yazýlarý dizisi
 */
function snk_main_onBlogPostsLoaded(posts) {
    // Sadece onaylanmýþ postlarý filtrele
    const approvedPosts = posts.filter(post => post.status === 'approved' || !post.status);

    console.log('Onaylanmýþ yazý sayýsý:', approvedPosts.length);
    console.log('Toplam yazý sayýsý:', posts.length);

    // Tüm gönderileri göster
    snk_main_displayBlogPosts(approvedPosts);

    // Sað sütun temizlendi
}

// Filtreleme butonlarý kaldýrýldý
function snk_main_setupFilterButtons() {
    console.log('Filtreleme butonlarý kaldýrýldý');
}

/**
 * Blog yazýlarýný filtreler ve gösterir
 * @param {Array} posts - Tüm blog yazýlarý
 */
function snk_main_filterPosts(posts) {
    console.log(`Yazýlar filtreleniyor`);

    // Sadece onaylanmýþ yazýlarý filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmiþ yazýlarý göster
    snk_main_displayBlogPosts(filteredPosts);
}

// Global eriþim için
window.snk_main_filterPosts = snk_main_filterPosts;

/**
 * Belirli bir kategoriye göre yazýlarý filtreler (kategori sayfasý için)
 * @param {string} category - Filtrelenecek kategori adý
 */
function snk_main_filterByCategory(category) {
    console.log("Kategori filtreleniyor:", category);

    // Tüm yazýlar yüklü deðilse önce yükle
    if (snk_main_blogPosts.length === 0) {
        fetch('../utils/blogPosts.json')
            .then(response => response.json())
            .then(data => {
                snk_main_blogPosts = data.posts;
                // Kategori filtrelemesini yap
                const filteredPosts = snk_main_blogPosts.filter(post =>
                    post.category.toLowerCase() === category.toLowerCase()
                );
                snk_main_displayBlogPosts(filteredPosts);
            })
            .catch(error => {
                console.error('Kategori filtreleme hatasý:', error);
                if (snk_main_postsContainer) {
                    snk_main_postsContainer.innerHTML = `
                        <div class="snk-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Blog yazýlarý yüklenirken bir hata oluþtu. Lütfen daha sonra tekrar deneyin.</p>
                        </div>
                    `;
                }
            });
    } else {
        // Veri zaten yüklü ise doðrudan filtrele
        const filteredPosts = snk_main_blogPosts.filter(post =>
            post.category.toLowerCase() === category.toLowerCase()
        );
        snk_main_displayBlogPosts(filteredPosts);
    }
}

// Global eriþim için
window.snk_main_filterByCategory = snk_main_filterByCategory;

/**
 * Blog yazýlarýný JSON dosyasýndan yükler
 */
function snk_main_loadBlogPosts() {
    fetch('../utils/blogPosts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Blog yazýlarý yüklenemedi');
            }
            return response.json();
        })
        .then(data => {
            // localStorage'dan kullanýcý gönderilerini al ve birleþtir
            const localPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
            let allPosts = [...data.posts, ...localPosts];

            // Tekrarlý gönderileri önle (ID'ye göre kontrol)
            const uniquePosts = [];
            const postIds = new Set();

            allPosts.forEach(post => {
                if (!postIds.has(post.id)) {
                    postIds.add(post.id);
                    uniquePosts.push(post);
                }
            });

            // Yüklenen gönderileri global deðiþkene kaydet ve iþle
            snk_main_blogPosts = uniquePosts;

            console.log('Blog yazýlarý yüklendi, toplam:', snk_main_blogPosts.length);
            snk_main_onBlogPostsLoaded(snk_main_blogPosts);
        })
        .catch(error => {
            console.error('Blog yazýlarý yüklenirken hata oluþtu:', error);
            document.getElementById('snk_postsContainer').innerHTML = `
                <div class="snk-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Blog yazýlarý yüklenirken bir hata oluþtu. Lütfen daha sonra tekrar deneyin.</p>
                </div>
            `;
        });
}

/**
 * Blog yazýlarýnýn yüklenmesi tamamlandýðýnda çaðrýlacak iþlev
 * @param {Array} posts - Yüklenen blog yazýlarý dizisi
 */
function snk_main_onBlogPostsLoaded(posts) {
    // Sadece onaylanmýþ postlarý filtrele
    const approvedPosts = posts.filter(post => post.status === 'approved' || !post.status);

    console.log('Onaylanmýþ yazý sayýsý:', approvedPosts.length);
    console.log('Toplam yazý sayýsý:', posts.length);

    // Tüm gönderileri göster
    snk_main_displayBlogPosts(approvedPosts);

    // Sað sütun temizlendi
}

// Filtreleme butonlarý kaldýrýldý
function snk_main_setupFilterButtons() {
    console.log('Filtreleme butonlarý kaldýrýldý');
}

/**
 * Blog yazýlarýný filtreler ve gösterir
 * @param {Array} posts - Tüm blog yazýlarý
 */
function snk_main_filterPosts(posts) {
    console.log(`Yazýlar filtreleniyor`);

    // Sadece onaylanmýþ yazýlarý filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmiþ yazýlarý göster
    snk_main_displayBlogPosts(filteredPosts);
}

// En popüler yazýlarý gösterme fonksiyonu kaldýrýldý
function snk_main_displayPopularPosts() {
    // Bu fonksiyon kaldýrýldý
    console.log('Popüler yazýlar gösterme özelliði kaldýrýldý');

    // Sað sütundaki popüler yazýlar alanýný temizle
    const popularPostsContainer = document.getElementById('snk_popularPosts');
    if (popularPostsContainer) {
        popularPostsContainer.innerHTML = '<div class="snk-no-posts">Bu özellik kaldýrýldý.</div>';
    }
}

/**
 * Blog popup'ýný gösterme fonksiyonu
 * @param {number} postId - Gösterilecek yazýnýn ID'si
 */
function snk_main_showBlogPopup(postId) {
    console.log("Blog popup gösteriliyor. Post ID:", postId);

    try {
        // localStorage'dan yazýlarý al - hem 'snk_blog_posts' hem de 'posts' anahtarlarýný kontrol et
        let allPosts = [];
        try {
            // Ana depolama 'snk_blog_posts' anahtarýný kontrol et
            const storedPosts = localStorage.getItem('snk_blog_posts');
            if (storedPosts) {
                allPosts = JSON.parse(storedPosts);
                console.log("Yazýlar 'snk_blog_posts' anahtarýndan alýndý:", allPosts.length);
            } else {
                console.log("'snk_blog_posts' anahtarýnda veri bulunamadý");
            }
        } catch (e) {
            console.warn("'snk_blog_posts' okuma hatasý:", e);
        }

        // Eðer allPosts bir array deðilse veya boþsa baþka kaynaklarý kontrol et
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            try {
                const blogPostsJson = localStorage.getItem('posts');
                if (blogPostsJson) {
                    const parsed = JSON.parse(blogPostsJson);
                    // posts anahtarý içinde bir array varsa onu kullan
                    if (parsed && Array.isArray(parsed.posts)) {
                        allPosts = parsed.posts;
                        console.log("Yazýlar 'posts' anahtarýndan alýndý:", allPosts.length);
                    } else if (parsed && Array.isArray(parsed)) {
                        allPosts = parsed;
                        console.log("Yazýlar 'posts' anahtarýndan array olarak alýndý:", allPosts.length);
                    }
                }
            } catch (e) {
                console.warn("'posts' okuma hatasý:", e);
            }
        }

        console.log("Tüm yazýlar:", allPosts);

        // Eðer hala post bulunamazsa hata göster
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            console.error("Hiç blog yazýsý bulunamadý");
            alert("Blog yazýlarý yüklenemedi. Lütfen sayfayý yenileyip tekrar deneyin.");
            return;
        }

        // ID'ye göre yazýyý bul
        const post = allPosts.find(p => {
            const postIdInt = parseInt(p.id);
            const targetIdInt = parseInt(postId);
            const match = postIdInt === targetIdInt;
            if (match) {
                console.log(`Eþleþme bulundu: Post ID ${postIdInt} = Hedef ID ${targetIdInt}`);
            }
            return match;
        });

        if (!post) {
            console.error(`ID: ${postId} olan yazý bulunamadý`);
            console.log("Mevcut ID'ler:", allPosts.map(p => p.id));
            alert("Bu blog yazýsý bulunamadý.");
            return;
        }

        console.log("Gösterilecek yazý:", post);

        // Var olan popuplarý temizle
        const existingPopups = document.querySelectorAll('.snk-popup-overlay');
        existingPopups.forEach(popup => popup.remove());

        // Yeni popup oluþtur
        const popupEl = document.createElement('div');
        popupEl.className = 'snk-popup-overlay';

        // Ýçerik HTML'ini oluþtur
        popupEl.innerHTML = `
            <div class="snk-popup-content">
                <button class="snk-popup-close">&times;</button>
                <article class="snk-popup-article">
                    <header class="snk-popup-header">
                        <div class="snk-popup-meta">
                            <span class="snk-popup-category">${post.category || 'Genel'}</span>
                            <span class="snk-popup-author">Yazar: ${post.author || 'Anonim'}</span>
                            <span class="snk-popup-date">${post.date || 'Tarih bilgisi yok'}</span>
                        </div>
                        <h1 class="snk-popup-title">${post.title || 'Baþlýksýz Yazý'}</h1>
                    </header>
                    
                    ${post.image ? `
                    <div class="snk-popup-featured-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    ` : ''}
                    
                    <div class="snk-popup-content-body">
                        ${post.content || post.summary || 'Ýçerik bulunamadý.'}
                    </div>
                </article>
            </div>
        `;

        // Popup'ý sayfaya ekle
        document.body.appendChild(popupEl);

        // Dark mode kontrolü
        const isDarkMode = document.body.classList.contains('eren-dark-theme');
        if (isDarkMode) {
            popupEl.querySelector('.snk-popup-content').classList.add('eren-dark-theme');
        }

        // Popup'ý görünür yap
        setTimeout(() => popupEl.classList.add('active'), 10);

        // Kapatma butonu iþlevselliði
        const closeBtn = popupEl.querySelector('.snk-popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            });
        }

        // Popup dýþýna týklayýnca kapat
        popupEl.addEventListener('click', (e) => {
            if (e.target === popupEl) {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            }
        });

        // ESC tuþuna basýnca kapat
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                popupEl.classList.remove('active');
                setTimeout(() => {
                    popupEl.remove();
                    document.removeEventListener('keydown', escHandler);
                }, 300);
            }
        };
        document.addEventListener('keydown', escHandler);

    } catch (error) {
        console.error("Blog popup gösterme hatasý:", error);
        alert("Blog yazýsý gösterilirken bir hata oluþtu.");
    }
}

/**
 * Yazý etkileþimlerini kuran fonksiyon
 * @param {HTMLElement} container - Ýçinde etkileþimli elemanlarýn olduðu konteyner
 */
function snk_main_setupPostInteractions(container) {
    if (!container) {
        console.error("Post etkileþimleri kurulamadý: Konteyner bulunamadý");
        return;
    }

    console.log("Post etkileþimleri kuruluyor...");

    // Devamýný Oku butonlarý
    const readMoreButtons = container.querySelectorAll('.snk-read-more');
    console.log(`${readMoreButtons.length} adet "Devamýný Oku" butonu bulundu`);

    if (readMoreButtons.length === 0) {
        console.log("Devamýný Oku butonlarý bulunamadý, tüm kart butonlarýna event listener ekleniyor...");

        // Tüm blog kartlarýný bul ve direkt kartlara týklama olayý ekle (devamýný oku butonlarý yoksa)
        const blogCards = container.querySelectorAll('.snk-blog-card');
        blogCards.forEach(card => {
            const postId = card.dataset.postId;
            if (postId) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    // Eðer týklanan yer bir buton deðilse popup'ý aç
                    if (!e.target.closest('button')) {
                        e.preventDefault();
                        console.log(`Blog kartýna týklandý. Post ID: ${postId}`);
                        window.location.href = `./blogs.html?id=${postId}`;
                    }
                });
            }
        });
    }

    // Her "Devamýný Oku" butonuna olay dinleyicisi ekle
    readMoreButtons.forEach(btn => {
        // Önceki dinleyicileri temizle
        const newBtn = btn.cloneNode(true);
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }

        // Yeni dinleyici ekle
        newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const postId = this.dataset.postId;
            if (postId) {
                console.log(`"Devamýný Oku" butonuna týklandý. Post ID: ${postId}`);
                window.location.href = `./blogs.html?id=${postId}`;
            } else {
                console.error("Post ID bulunamadý");
            }
        });
    });

    // Diðer butonlar için etkileþimler burada korundu
}

/**
 * Blog yazýlarýný aktif filtreye göre filtreler
 */
function snk_main_filterPosts(posts) {
    console.log(`Yazýlar filtreleniyor`);

    // Sadece onaylanmýþ yazýlarý filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmiþ yazýlarý göster
    snk_main_displayBlogPosts(filteredPosts);
}

/**
 * Kategori adýný döndürür
 * @param {string} categoryKey - Kategori anahtarý
 * @returns {string} Kategori adý
 */
function getCategoryName(categoryKey) {
    const categories = {
        'teknoloji': 'Teknoloji',
        'egitim': 'Eðitim',
        'yasam': 'Yaþam',
        'kultursanat': 'Kültür & Sanat',
        'bilim': 'Bilim'
    };

    return categories[categoryKey] || categoryKey;
}

/**
 * Metni belirtilen uzunluða kýsaltýr
 * @param {string} text - Kýsaltýlacak metin
 * @param {number} maxLength - Maksimum uzunluk
 * @returns {string} Kýsaltýlmýþ metin
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

/**
 * Tarihi formatlar
 * @param {string} dateString - ISO tarih formatý
 * @returns {string} Formatlanmýþ tarih
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
}

/**
 * Kategori filtresi deðiþtiðinde blog yazýlarýný günceller
 */
function updateCategoryVisibility() {
    const activeCategoryBtn = document.querySelector('.snk-category-btn.active');
    if (!activeCategoryBtn) return; // Aktif kategori butonu yoksa çýk

    const selectedCategory = activeCategoryBtn.dataset.category;
    const allPosts = document.querySelectorAll('.snk-post');

    allPosts.forEach(post => {
        if (selectedCategory === 'all' || post.dataset.category === selectedCategory) {
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });
}

/**
 * Kategori butonuna týklandýðýnda çalýþýr
 * @param {Event} event - Týklama olayý
 * @param {string} category - Kategori deðeri
 */
function snk_main_filterByCategory(event, category) {
    // Eski aktif butonu kaldýr
    const currentActive = document.querySelector('.snk-category-btn.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }

    // Yeni butonu aktif yap
    event.currentTarget.classList.add('active');

    // Blog yazýlarýný filtrele
    const allPosts = document.querySelectorAll('.snk-post');

    allPosts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });
}

// Kategori butonlarýný iþlevsel hale getir
document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.snk-category-btn');

    categoryButtons.forEach(button => {
        const category = button.dataset.category;
        button.addEventListener('click', function (event) {
            snk_main_filterByCategory(event, category);
        });
    });

    // "Oluþtur" butonu
    const createButton = document.querySelector('.snk-create-btn');
    if (createButton) {
        createButton.addEventListener('click', snk_main_openCreatePostPopup);
    }
});

// Global eriþim için
window.snk_main_openCreatePostPopup = snk_main_openCreatePostPopup;

// Giriþ formunda þifre görünürlüðünü ayarlamak için
function snk_main_setupPasswordToggle() {
    console.log("Þifre toggle butonu ayarlanýyor");

    // Bu fonksiyon document.ready'den sonra çaðrýldýðýnda DOM hazýr olacak
    // Ancak 300ms sonra tekrar çaðýrmak en güvenli yol
    setTimeout(() => {
        const passwordToggleBtn = document.getElementById('snk_login_toggle_password');

        if (passwordToggleBtn) {
            console.log("Þifre toggle butonu bulundu");

            // Mevcut event listener'larý temizle (olasý duplikasyonu önlemek için)
            passwordToggleBtn.removeEventListener('click', togglePasswordVisibility);

            // Yeni event listener ekle
            passwordToggleBtn.addEventListener('click', togglePasswordVisibility);
        } else {
            console.log("Þifre toggle butonu bulunamadý (henüz yüklenmemiþ olabilir)");
        }
    }, 300);
}

// Þifre görünürlüðünü deðiþtiren yardýmcý fonksiyon
function togglePasswordVisibility(e) {
    console.log("Þifre toggle butonuna týklandý");
    // Tarayýcýnýn varsayýlan davranýþýný engelle
    e.preventDefault();
    e.stopPropagation();

    // Þifre input alanýný bul
    const passwordInput = document.getElementById('loginPassword');
    if (passwordInput) {
        // Þifre görünürlüðünü deðiþtir
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Ýkonu deðiþtir
        const icon = this.querySelector('i');
        if (icon) {
            if (type === 'text') {
                // Þifre gösteriliyor, ikonu göz kapalý yap
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                // Þifre gizli, ikonu göz açýk yap
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    } else {
        console.error("Þifre input alaný bulunamadý");
    }
}

// Login popup kapatma butonunu ayarla
function snk_main_setupLoginPopupClose() {
    console.log("Login popup kapatma butonu ayarlanýyor");

    // Bir süre bekleyerek DOM'un tam olarak yüklenmesini saðla
    setTimeout(() => {
        const loginCloseBtn = document.getElementById('snk_loginCloseBtn');
        const loginPopup = document.getElementById('snk_loginPopup');

        if (loginCloseBtn && loginPopup) {
            console.log("Login popup kapatma butonu bulundu");

            // Mevcut event listener'larý temizle (olasý duplikasyonu önlemek için)
            loginCloseBtn.removeEventListener('click', closeLoginPopup);

            // Yeni event listener ekle
            loginCloseBtn.addEventListener('click', closeLoginPopup);
        } else {
            console.error("Login popup kapatma butonu veya popup bulunamadý:",
                { closeBtn: !!loginCloseBtn, popup: !!loginPopup });
        }
    }, 300);
}

// Popup kapatma yardýmcý fonksiyonu
function closeLoginPopup(e) {
    console.log("Login kapatma butonuna týklandý");
    e.preventDefault();

    const loginPopup = document.getElementById('snk_loginPopup');
    if (loginPopup) {
        loginPopup.classList.remove('active');
        document.body.style.overflow = ''; // Sayfa scroll'u tekrar etkinleþtir
    }
}

// Login popup'ýný açma fonksiyonu
function snk_main_openLoginPopup() {
    console.log("Login popup açýlýyor");

    const loginPopup = document.getElementById('snk_loginPopup');

    if (loginPopup) {
        loginPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa scroll'u devre dýþý býrak

        // Popup açýldýktan sonra þifre görünürlük butonunu tekrar ayarla
        snk_main_setupPasswordToggle();
        // Kapatma butonunu tekrar ayarla
        snk_main_setupLoginPopupClose();
    } else {
        console.error("Login popup bulunamadý");
    }
}

// Login popup'ýný kapatma fonksiyonu
function snk_main_closeLoginPopup() {
    closeLoginPopup({ preventDefault: () => { } });
}

// Giriþ yapma/kayýt olma formu geçiþlerini ayarlamak için
function snk_main_setupAuthFormToggles() {
    const showRegisterLink = document.getElementById('showRegisterPopup');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function (e) {
            e.preventDefault();
            // Login popup'ý kapat, register popup'ý aç
            const loginPopup = document.getElementById('snk_loginPopup');
            if (loginPopup) {
                loginPopup.classList.remove('active');
            }

            // Register popup kodunu buraya ekleyebiliriz
            // Ya da popup-handler.js'deki fonksiyonu çaðýrabiliriz
            if (typeof snk_popupHandler_showRegisterForm === 'function') {
                snk_popupHandler_showRegisterForm();
            }
        });
    }
}

// Sayfa yüklendiðinde çalýþacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function () {
    console.log("Main.js yüklendi");

    // DOM elemanlarýný tekrar tanýmla (lazy loading için güvenlik)
    const postsContainer = document.getElementById('snk_postsContainer');
    const filterNewest = document.getElementById('snk_filterNewest');
    const filterPopular = document.getElementById('snk_filterPopular');
    const sidebarPopular = document.getElementById('snk_sidebarPopular');

    console.log("Main elemanlarý:", { postsContainer, filterNewest, filterPopular, sidebarPopular });

    // Blog yazýlarýný yükle
    snk_main_loadBlogPosts();

    // Filtreleme butonlarý için olay dinleyicileri ekle
    snk_main_setupFilterButtons();

    // Sidebar'daki popüler linki için olay dinleyicisi
    if (sidebarPopular) {
        sidebarPopular.addEventListener('click', (e) => {
            e.preventDefault(); // Sayfanýn yenilenmesini engelle

            // Popüler filtreyi aktifleþtir
            if (filterPopular) {
                filterPopular.click(); // Popüler filtresine týklamayý simüle et
            } else {
                // Popüler filtresi bulunamazsa manuel olarak uygula
                // UI güncelleme
                document.querySelectorAll('.snk-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.id === 'snk_filterPopular') {
                        btn.classList.add('active');
                    }
                });

                // Blog yazýlarýný filtrele ve göster
                snk_main_filterPosts();
            }

            // Sidebar link'lerinin aktif durumunu güncelle
            document.querySelectorAll('.snk-sidebar-item').forEach(item => {
                item.classList.remove('active');
            });
            sidebarPopular.classList.add('active');
        });
    }

    // Þifre görünürlük butonunu ayarla
    snk_main_setupPasswordToggle();

    // Giriþ/Kayýt form geçiþlerini ayarla
    snk_main_setupAuthFormToggles();

    // Login popup kapatma butonunu ayarla
    snk_main_setupLoginPopupClose();

    // Giriþ yapma butonunu ayarla
    const loginButton = document.getElementById('snk_login_btn');
    if (loginButton) {
        loginButton.addEventListener('click', function (e) {
            e.preventDefault();
            snk_main_openLoginPopup();
        });
    }
});

/**
 * Belirli bir kategoriye göre yazýlarý filtreler (kategori sayfasý için)
 * @param {string} category - Filtrelenecek kategori adý
 */
function snk_main_filterByCategory(category) {
    console.log("Kategori filtreleniyor:", category);

    // Tüm yazýlar yüklü deðilse önce yükle
    if (snk_main_blogPosts.length === 0) {
        fetch('../utils/blogPosts.json')
            .then(response => response.json())
            .then(data => {
                snk_main_blogPosts = data.posts;
                // Kategori filtrelemesini yap
                const filteredPosts = snk_main_blogPosts.filter(post =>
                    post.category.toLowerCase() === category.toLowerCase()
                );
                snk_main_displayBlogPosts(filteredPosts);
            })
            .catch(error => {
                console.error('Kategori filtreleme hatasý:', error);
                if (snk_main_postsContainer) {
                    snk_main_postsContainer.innerHTML = `
                        <div class="snk-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Blog yazýlarý yüklenirken bir hata oluþtu. Lütfen daha sonra tekrar deneyin.</p>
                        </div>
                    `;
                }
            });
    } else {
        // Veri zaten yüklü ise doðrudan filtrele
        const filteredPosts = snk_main_blogPosts.filter(post =>
            post.category.toLowerCase() === category.toLowerCase()
        );
        snk_main_displayBlogPosts(filteredPosts);
    }
}

// Global eriþim için
window.snk_main_filterByCategory = snk_main_filterByCategory;

/**
 * Blog yazýlarýný JSON dosyasýndan yükler
 */
function snk_main_loadBlogPosts() {
    fetch('../utils/blogPosts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Blog yazýlarý yüklenemedi');
            }
            return response.json();
        })
        .then(data => {
            // localStorage'dan kullanýcý gönderilerini al ve birleþtir
            const localPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
            let allPosts = [...data.posts, ...localPosts];

            // Tekrarlý gönderileri önle (ID'ye göre kontrol)
            const uniquePosts = [];
            const postIds = new Set();

            allPosts.forEach(post => {
                if (!postIds.has(post.id)) {
                    postIds.add(post.id);
                    uniquePosts.push(post);
                }
            });

            // Yüklenen gönderileri global deðiþkene kaydet ve iþle
            snk_main_blogPosts = uniquePosts;

            console.log('Blog yazýlarý yüklendi, toplam:', snk_main_blogPosts.length);
            snk_main_onBlogPostsLoaded(snk_main_blogPosts);
        })
        .catch(error => {
            console.error('Blog yazýlarý yüklenirken hata oluþtu:', error);
            document.getElementById('snk_postsContainer').innerHTML = `
                <div class="snk-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Blog yazýlarý yüklenirken bir hata oluþtu. Lütfen daha sonra tekrar deneyin.</p>
                </div>
            `;
        });
}

/**
 * Blog yazýlarýnýn yüklenmesi tamamlandýðýnda çaðrýlacak iþlev
 * @param {Array} posts - Yüklenen blog yazýlarý dizisi
 */
function snk_main_onBlogPostsLoaded(posts) {
    // Sadece onaylanmýþ postlarý filtrele
    const approvedPosts = posts.filter(post => post.status === 'approved' || !post.status);

    console.log('Onaylanmýþ yazý sayýsý:', approvedPosts.length);
    console.log('Toplam yazý sayýsý:', posts.length);

    // Tüm gönderileri göster
    snk_main_displayBlogPosts(approvedPosts);

    // Sað sütun temizlendi
}

// Filtreleme butonlarý kaldýrýldý
function snk_main_setupFilterButtons() {
    console.log('Filtreleme butonlarý kaldýrýldý');
}

/**
 * Blog yazýlarýný filtreler ve gösterir
 * @param {Array} posts - Tüm blog yazýlarý
 */
function snk_main_filterPosts(posts) {
    console.log(`Yazýlar filtreleniyor`);

    // Sadece onaylanmýþ yazýlarý filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmiþ yazýlarý göster
    snk_main_displayBlogPosts(filteredPosts);
}

// En popüler yazýlarý gösterme fonksiyonu kaldýrýldý
function snk_main_displayPopularPosts() {
    // Bu fonksiyon kaldýrýldý
    console.log('Popüler yazýlar gösterme özelliði kaldýrýldý');

    // Sað sütundaki popüler yazýlar alanýný temizle
    const popularPostsContainer = document.getElementById('snk_popularPosts');
    if (popularPostsContainer) {
        popularPostsContainer.innerHTML = '<div class="snk-no-posts">Bu özellik kaldýrýldý.</div>';
    }
}

/**
 * Blog popup'ýný gösterme fonksiyonu
 * @param {number} postId - Gösterilecek yazýnýn ID'si
 */
function snk_main_showBlogPopup(postId) {
    console.log("Blog popup gösteriliyor. Post ID:", postId);

    try {
        // localStorage'dan yazýlarý al - hem 'snk_blog_posts' hem de 'posts' anahtarlarýný kontrol et
        let allPosts = [];
        try {
            // Ana depolama 'snk_blog_posts' anahtarýný kontrol et
            const storedPosts = localStorage.getItem('snk_blog_posts');
            if (storedPosts) {
                allPosts = JSON.parse(storedPosts);
                console.log("Yazýlar 'snk_blog_posts' anahtarýndan alýndý:", allPosts.length);
            } else {
                console.log("'snk_blog_posts' anahtarýnda veri bulunamadý");
            }
        } catch (e) {
            console.warn("'snk_blog_posts' okuma hatasý:", e);
        }

        // Eðer allPosts bir array deðilse veya boþsa baþka kaynaklarý kontrol et
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            try {
                const blogPostsJson = localStorage.getItem('posts');
                if (blogPostsJson) {
                    const parsed = JSON.parse(blogPostsJson);
                    // posts anahtarý içinde bir array varsa onu kullan
                    if (parsed && Array.isArray(parsed.posts)) {
                        allPosts = parsed.posts;
                        console.log("Yazýlar 'posts' anahtarýndan alýndý:", allPosts.length);
                    } else if (parsed && Array.isArray(parsed)) {
                        allPosts = parsed;
                        console.log("Yazýlar 'posts' anahtarýndan array olarak alýndý:", allPosts.length);
                    }
                }
            } catch (e) {
                console.warn("'posts' okuma hatasý:", e);
            }
        }

        console.log("Tüm yazýlar:", allPosts);

        // Eðer hala post bulunamazsa hata göster
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            console.error("Hiç blog yazýsý bulunamadý");
            alert("Blog yazýlarý yüklenemedi. Lütfen sayfayý yenileyip tekrar deneyin.");
            return;
        }

        // ID'ye göre yazýyý bul
        const post = allPosts.find(p => {
            const postIdInt = parseInt(p.id);
            const targetIdInt = parseInt(postId);
            const match = postIdInt === targetIdInt;
            if (match) {
                console.log(`Eþleþme bulundu: Post ID ${postIdInt} = Hedef ID ${targetIdInt}`);
            }
            return match;
        });

        if (!post) {
            console.error(`ID: ${postId} olan yazý bulunamadý`);
            console.log("Mevcut ID'ler:", allPosts.map(p => p.id));
            alert("Bu blog yazýsý bulunamadý.");
            return;
        }

        console.log("Gösterilecek yazý:", post);

        // Var olan popuplarý temizle
        const existingPopups = document.querySelectorAll('.snk-popup-overlay');
        existingPopups.forEach(popup => popup.remove());

        // Yeni popup oluþtur
        const popupEl = document.createElement('div');
        popupEl.className = 'snk-popup-overlay';

        // Ýçerik HTML'ini oluþtur
        popupEl.innerHTML = `
            <div class="snk-popup-content">
                <button class="snk-popup-close">&times;</button>
                <article class="snk-popup-article">
                    <header class="snk-popup-header">
                        <div class="snk-popup-meta">
                            <span class="snk-popup-category">${post.category || 'Genel'}</span>
                            <span class="snk-popup-author">Yazar: ${post.author || 'Anonim'}</span>
                            <span class="snk-popup-date">${post.date || 'Tarih bilgisi yok'}</span>
                        </div>
                        <h1 class="snk-popup-title">${post.title || 'Baþlýksýz Yazý'}</h1>
                    </header>
                    
                    ${post.image ? `
                    <div class="snk-popup-featured-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    ` : ''}
                    
                    <div class="snk-popup-content-body">
                        ${post.content || post.summary || 'Ýçerik bulunamadý.'}
                    </div>
                </article>
            </div>
        `;

        // Popup'ý sayfaya ekle
        document.body.appendChild(popupEl);

        // Dark mode kontrolü
        const isDarkMode = document.body.classList.contains('eren-dark-theme');
        if (isDarkMode) {
            popupEl.querySelector('.snk-popup-content').classList.add('eren-dark-theme');
        }

        // Popup'ý görünür yap
        setTimeout(() => popupEl.classList.add('active'), 10);

        // Kapatma butonu iþlevselliði
        const closeBtn = popupEl.querySelector('.snk-popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            });
        }

        // Popup dýþýna týklayýnca kapat
        popupEl.addEventListener('click', (e) => {
            if (e.target === popupEl) {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            }
        });

        // ESC tuþuna basýnca kapat
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                popupEl.classList.remove('active');
                setTimeout(() => {
                    popupEl.remove();
                    document.removeEventListener('keydown', escHandler);
                }, 300);
            }
        };
        document.addEventListener('keydown', escHandler);

    } catch (error) {
        console.error("Blog popup gösterme hatasý:", error);
        alert("Blog yazýsý gösterilirken bir hata oluþtu.");
    }
}

/**
 * Yazý etkileþimlerini kuran fonksiyon
 * @param {HTMLElement} container - Ýçinde etkileþimli elemanlarýn olduðu konteyner
 */
function snk_main_setupPostInteractions(container) {
    if (!container) {
        console.error("Post etkileþimleri kurulamadý: Konteyner bulunamadý");
        return;
    }

    console.log("Post etkileþimleri kuruluyor...");

    // Devamýný Oku butonlarý
    const readMoreButtons = container.querySelectorAll('.snk-read-more');
    console.log(`${readMoreButtons.length} adet "Devamýný Oku" butonu bulundu`);

    if (readMoreButtons.length === 0) {
        console.log("Devamýný Oku butonlarý bulunamadý, tüm kart butonlarýna event listener ekleniyor...");

        // Tüm blog kartlarýný bul ve direkt kartlara týklama olayý ekle (devamýný oku butonlarý yoksa)
        const blogCards = container.querySelectorAll('.snk-blog-card');
        blogCards.forEach(card => {
            const postId = card.dataset.postId;
            if (postId) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    // Eðer týklanan yer bir buton deðilse popup'ý aç
                    if (!e.target.closest('button')) {
                        e.preventDefault();
                        console.log(`Blog kartýna týklandý. Post ID: ${postId}`);
                        window.location.href = `./blogs.html?id=${postId}`;
                    }
                });
            }
        });
    }

    // Her "Devamýný Oku" butonuna olay dinleyicisi ekle
    readMoreButtons.forEach(btn => {
        // Önceki dinleyicileri temizle
        const newBtn = btn.cloneNode(true);
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }

        // Yeni dinleyici ekle
        newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const postId = this.dataset.postId;
            if (postId) {
                console.log(`"Devamýný Oku" butonuna týklandý. Post ID: ${postId}`);
                window.location.href = `./blogs.html?id=${postId}`;
            } else {
                console.error("Post ID bulunamadý");
            }
        });
    });

    // Diðer butonlar için etkileþimler burada korundu
}

/**
 * Blog yazýlarýný aktif filtreye göre filtreler
 */
function snk_main_filterPosts(posts) {
    console.log(`Yazýlar filtreleniyor`);

    // Sadece onaylanmýþ yazýlarý filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmiþ yazýlarý göster
    snk_main_displayBlogPosts(filteredPosts);
}

/**
 * Kategori adýný döndürür
 * @param {string} categoryKey - Kategori anahtarý
 * @returns {string} Kategori adý
 */
function getCategoryName(categoryKey) {
    const categories = {
        'teknoloji': 'Teknoloji',
        'egitim': 'Eðitim',
        'yasam': 'Yaþam',
        'kultursanat': 'Kültür & Sanat',
        'bilim': 'Bilim'
    };

    return categories[categoryKey] || categoryKey;
}

/**
 * Metni belirtilen uzunluða kýsaltýr
 * @param {string} text - Kýsaltýlacak metin
 * @param {number} maxLength - Maksimum uzunluk
 * @returns {string} Kýsaltýlmýþ metin
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

/**
 * Tarihi formatlar
 * @param {string} dateString - ISO tarih formatý
 * @returns {string} Formatlanmýþ tarih
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
}

/**
 * Kategori filtresi deðiþtiðinde blog yazýlarýný günceller
 */
function updateCategoryVisibility() {
    const activeCategoryBtn = document.querySelector('.snk-category-btn.active');
    if (!activeCategoryBtn) return; // Aktif kategori butonu yoksa çýk

    const selectedCategory = activeCategoryBtn.dataset.category;
    const allPosts = document.querySelectorAll('.snk-post');

    allPosts.forEach(post => {
        if (selectedCategory === 'all' || post.dataset.category === selectedCategory) {
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });
}

/**
 * Kategori butonuna týklandýðýnda çalýþýr
 * @param {Event} event - Týklama olayý
 * @param {string} category - Kategori deðeri
 */
function snk_main_filterByCategory(event, category) {
    // Eski aktif butonu kaldýr
    const currentActive = document.querySelector('.snk-category-btn.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }

    // Yeni butonu aktif yap
    event.currentTarget.classList.add('active');

    // Blog yazýlarýný filtrele
    const allPosts = document.querySelectorAll('.snk-post');

    allPosts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });
}

// Kategori butonlarýný iþlevsel hale getir
document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.snk-category-btn');

    categoryButtons.forEach(button => {
        const category = button.dataset.category;
        button.addEventListener('click', function (event) {
            snk_main_filterByCategory(event, category);
        });
    });

    // "Oluþtur" butonu
    const createButton = document.querySelector('.snk-create-btn');
    if (createButton) {
        createButton.addEventListener('click', snk_main_openCreatePostPopup);
    }
});

// Global eriþim için
window.snk_main_openCreatePostPopup = snk_main_openCreatePostPopup;

// Giriþ formunda þifre görünürlüðünü ayarlamak için
function snk_main_setupPasswordToggle() {
    console.log("Þifre toggle butonu ayarlanýyor");

    // Bu fonksiyon document.ready'den sonra çaðrýldýðýnda DOM hazýr olacak
    // Ancak 300ms sonra tekrar çaðýrmak en güvenli yol
    setTimeout(() => {
        const passwordToggleBtn = document.getElementById('snk_login_toggle_password');

        if (passwordToggleBtn) {
            console.log("Þifre toggle butonu bulundu");

            // Mevcut event listener'larý temizle (olasý duplikasyonu önlemek için)
            passwordToggleBtn.removeEventListener('click', togglePasswordVisibility);

            // Yeni event listener ekle
            passwordToggleBtn.addEventListener('click', togglePasswordVisibility);
        } else {
            console.log("Þifre toggle butonu bulunamadý (henüz yüklenmemiþ olabilir)");
        }
    }, 300);
}

// Þifre görünürlüðünü deðiþtiren yardýmcý fonksiyon
function togglePasswordVisibility(e) {
    console.log("Þifre toggle butonuna týklandý");
    // Tarayýcýnýn varsayýlan davranýþýný engelle
    e.preventDefault();
    e.stopPropagation();

    // Þifre input alanýný bul
    const passwordInput = document.getElementById('loginPassword');
    if (passwordInput) {
        // Þifre görünürlüðünü deðiþtir
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Ýkonu deðiþtir
        const icon = this.querySelector('i');
        if (icon) {
            if (type === 'text') {
                // Þifre gösteriliyor, ikonu göz kapalý yap
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                // Þifre gizli, ikonu göz açýk yap
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    } else {
        console.error("Þifre input alaný bulunamadý");
    }
}

// Login popup kapatma butonunu ayarla
function snk_main_setupLoginPopupClose() {
    console.log("Login popup kapatma butonu ayarlanýyor");

    // Bir süre bekleyerek DOM'un tam olarak yüklenmesini saðla
    setTimeout(() => {
        const loginCloseBtn = document.getElementById('snk_loginCloseBtn');
        const loginPopup = document.getElementById('snk_loginPopup');

        if (loginCloseBtn && loginPopup) {
            console.log("Login popup kapatma butonu bulundu");

            // Mevcut event listener'larý temizle (olasý duplikasyonu önlemek için)
            loginCloseBtn.removeEventListener('click', closeLoginPopup);

            // Yeni event listener ekle
            loginCloseBtn.addEventListener('click', closeLoginPopup);
        } else {
            console.error("Login popup kapatma butonu veya popup bulunamadý:",
                { closeBtn: !!loginCloseBtn, popup: !!loginPopup });
        }
    }, 300);
}

// Popup kapatma yardýmcý fonksiyonu
function closeLoginPopup(e) {
    console.log("Login kapatma butonuna týklandý");
    e.preventDefault();

    const loginPopup = document.getElementById('snk_loginPopup');
    if (loginPopup) {
        loginPopup.classList.remove('active');
        document.body.style.overflow = ''; // Sayfa scroll'u tekrar etkinleþtir
    }
}

// Login popup'ýný açma fonksiyonu
function snk_main_openLoginPopup() {
    console.log("Login popup açýlýyor");

    const loginPopup = document.getElementById('snk_loginPopup');

    if (loginPopup) {
        loginPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa scroll'u devre dýþý býrak

        // Popup açýldýktan sonra þifre görünürlük butonunu tekrar ayarla
        snk_main_setupPasswordToggle();
        // Kapatma butonunu tekrar ayarla
        snk_main_setupLoginPopupClose();
    } else {
        console.error("Login popup bulunamadý");
    }
}

// Login popup'ýný kapatma fonksiyonu
function snk_main_closeLoginPopup() {
    closeLoginPopup({ preventDefault: () => { } });
}

// Giriþ yapma/kayýt olma formu geçiþlerini ayarlamak için
function snk_main_setupAuthFormToggles() {
    const showRegisterLink = document.getElementById('showRegisterPopup');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function (e) {
            e.preventDefault();
            // Login popup'ý kapat, register popup'ý aç
            const loginPopup = document.getElementById('snk_loginPopup');
            if (loginPopup) {
                loginPopup.classList.remove('active');
            }

            // Register popup kodunu buraya ekleyebiliriz
            // Ya da popup-handler.js'deki fonksiyonu çaðýrabiliriz
            if (typeof snk_popupHandler_showRegisterForm === 'function') {
                snk_popupHandler_showRegisterForm();
            }
        });
    }
}

// Sayfa yüklendiðinde çalýþacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function () {
    console.log("Main.js yüklendi");

    // DOM elemanlarýný tekrar tanýmla (lazy loading için güvenlik)
    const postsContainer = document.getElementById('snk_postsContainer');
    const filterNewest = document.getElementById('snk_filterNewest');
    const filterPopular = document.getElementById('snk_filterPopular');
    const sidebarPopular = document.getElementById('snk_sidebarPopular');

    console.log("Main elemanlarý:", { postsContainer, filterNewest, filterPopular, sidebarPopular });

    // Blog yazýlarýný yükle
    snk_main_loadBlogPosts();

    // Filtreleme butonlarý için olay dinleyicileri ekle
    snk_main_setupFilterButtons();

    // Sidebar'daki popüler linki için olay dinleyicisi
    if (sidebarPopular) {
        sidebarPopular.addEventListener('click', (e) => {
            e.preventDefault(); // Sayfanýn yenilenmesini engelle

            // Popüler filtreyi aktifleþtir
            if (filterPopular) {
                filterPopular.click(); // Popüler filtresine týklamayý simüle et
            } else {
                // Popüler filtresi bulunamazsa manuel olarak uygula
                // UI güncelleme
                document.querySelectorAll('.snk-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.id === 'snk_filterPopular') {
                        btn.classList.add('active');
                    }
                });

                // Blog yazýlarýný filtrele ve göster
                snk_main_filterPosts();
            }

            // Sidebar link'lerinin aktif durumunu güncelle
            document.querySelectorAll('.snk-sidebar-item').forEach(item => {
                item.classList.remove('active');
            });
            sidebarPopular.classList.add('active');
        });
    }

    // Þifre görünürlük butonunu ayarla
    snk_main_setupPasswordToggle();

    // Giriþ/Kayýt form geçiþlerini ayarla
    snk_main_setupAuthFormToggles();

    // Login popup kapatma butonunu ayarla
    snk_main_setupLoginPopupClose();

    // Giriþ yapma butonunu ayarla
    const loginButton = document.getElementById('snk_login_btn');
    if (loginButton) {
        loginButton.addEventListener('click', function (e) {
            e.preventDefault();
            snk_main_openLoginPopup();
        });
    }
});
