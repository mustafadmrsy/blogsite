/**
 * Main JavaScript - Senirkent Blog
 * Her fonksiyon �neki: snk_main_ (kod �ak��malar�n� �nlemek i�in)
 */

// DOM elemanlar�n� tan�mla
const snk_main_postsContainer = document.getElementById('snk_postsContainer');
const snk_main_filterNewest = document.getElementById('snk_filterNewest');
const snk_main_filterPopular = document.getElementById('snk_filterPopular');

// Blog yaz�lar�n�n tutulaca�� dizi
let snk_main_blogPosts = [];

/**
 * Sayfa y�klendi�inde �al��acak fonksiyonlar
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log("Main.js y�klendi");

    // DOM elemanlar�n� tekrar tan�mla (lazy loading i�in g�venlik)
    const postsContainer = document.getElementById('snk_postsContainer');
    const filterNewest = document.getElementById('snk_filterNewest');
    const filterPopular = document.getElementById('snk_filterPopular');
    const sidebarPopular = document.getElementById('snk_sidebarPopular');

    console.log("Main elemanlar�:", { postsContainer, filterNewest, filterPopular, sidebarPopular });

    // Blog yaz�lar�n� y�kle
    snk_main_loadBlogPosts();

    // Filtreleme butonlar� i�in olay dinleyicileri ekle
    snk_main_setupFilterButtons();

    // Sidebar'daki pop�ler linki i�in olay dinleyicisi
    if (sidebarPopular) {
        sidebarPopular.addEventListener('click', (e) => {
            e.preventDefault(); // Sayfan�n yenilenmesini engelle

            // Pop�ler filtreyi aktifle�tir
            if (filterPopular) {
                filterPopular.click(); // Pop�ler filtresine t�klamay� sim�le et
            } else {
                // Pop�ler filtresi bulunamazsa manuel olarak uygula
                // UI g�ncelleme
                document.querySelectorAll('.snk-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.id === 'snk_filterPopular') {
                        btn.classList.add('active');
                    }
                });

                // Blog yaz�lar�n� filtrele ve g�ster
                snk_main_filterPosts();
            }

            // Sidebar link'lerinin aktif durumunu g�ncelle
            document.querySelectorAll('.snk-sidebar-item').forEach(item => {
                item.classList.remove('active');
            });
            sidebarPopular.classList.add('active');
        });
    }

    // �ifre g�r�n�rl�k butonunu ayarla
    snk_main_setupPasswordToggle();

    // Giri�/Kay�t form ge�i�lerini ayarla
    snk_main_setupAuthFormToggles();

    // Login popup kapatma butonunu ayarla
    snk_main_setupLoginPopupClose();
});

/**
 * Blog yaz�lar�n� JSON dosyas�ndan y�kler
 */
function snk_main_loadBlogPosts() {
    console.log('Blog yaz�lar� y�kleniyor...');

    // Y�kleniyor mesaj�n� g�ster
    const container = document.getElementById('snk_postsContainer');
    if (!container) {
        console.error('Blog yaz�lar� konteyneri bulunamad�');
        return;
    }

    container.innerHTML = `
        <div class="snk-loading">
            <i class="fas fa-spinner fa-spin"></i> Blog yaz�lar� y�kleniyor...
        </div>
    `;

    // �nce localStorage'dan kullan�c� yaz�lar�n� al
    const localPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
    console.log('LocalStorage\'dan y�klenen yaz� say�s�:', localPosts.length);

    // Daha sonra JSON dosyas�ndan varsay�lan yaz�lar� y�kle
    fetch('../utils/blogPosts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Blog yaz�lar� y�klenemedi');
            }
            return response.json();
        })
        .then(data => {
            console.log("Blog verileri y�klendi:", data.posts.length);

            // Blog yaz�lar�n� sakla
            snk_main_blogPosts = [...localPosts, ...data.posts];

            // Yaz�lar� ekrana g�ster
            snk_main_onBlogPostsLoaded(snk_main_blogPosts);
        })
        .catch(error => {
            console.error('Blog yaz�lar� y�kleme hatas�:', error);
            if (snk_main_postsContainer) {
                snk_main_postsContainer.innerHTML = `
                    <div class="snk-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Blog yaz�lar� y�klenirken bir hata olu�tu. L�tfen daha sonra tekrar deneyin.</p>
                    </div>
                `;
            }
        });
}

/**
 * Blog yaz�lar�n�n y�klenmesi tamamland���nda �a�r�lacak i�lev
 * @param {Array} posts - Y�klenen blog yaz�lar� dizisi
 */
function snk_main_onBlogPostsLoaded(posts) {
    // Sadece onaylanm�� postlar� filtrele
    const approvedPosts = posts.filter(post => post.status === 'approved' || !post.status);

    console.log('Onaylanm�� yaz� say�s�:', approvedPosts.length);
    console.log('Toplam yaz� say�s�:', posts.length);

    // T�m g�nderileri g�ster
    snk_main_displayBlogPosts(approvedPosts);
}

/**
 * Filtreleme butonlar�n� ayarla
 */
function snk_main_setupFilterButtons() {
    const newestBtn = document.getElementById('snk_filterNewest');
    const popularBtn = document.getElementById('snk_filterPopular');

    if (newestBtn && popularBtn) {
        console.log('Filtreleme butonlar� bulundu, ancak i�levleri kald�r�ld�.');
    }
}

/**
 * Blog kartlar� olu�turma fonksiyonu
 * @param {Array} posts - Blog g�nderileri dizisi
 * @param {HTMLElement} container - Blog kartlar�n�n eklenece�i konteyner
 */
function snk_main_createBlogCards(posts, container) {
    if (!container) {
        console.error("Blog kartlar� i�in konteyner bulunamad�");
        return;
    }

    // Konteyner i�eri�ini temizle
    container.innerHTML = '';

    // Her bir g�nderi i�in kart olu�tur
    posts.forEach(post => {
        // Blog kart� ��esi olu�tur
        const cardElement = document.createElement('div');
        cardElement.className = 'snk-blog-card';
        cardElement.dataset.postId = post.id;

        // Kart i�eri�i HTML'i
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
                        <i class="far fa-heart"></i> <span class="snk-like-count">0</span> Be�en
                    </button>
                    <button class="snk-action-button snk-comment-button" data-post-id="${post.id}">
                        <i class="far fa-comment"></i> Yorum Yap
                    </button>
                    <button class="snk-action-button snk-share-button" data-post-id="${post.id}">
                        <i class="far fa-share-square"></i> Payla�
                    </button>
                </div>
                <div class="snk-blog-card-read-more">
                    <button class="snk-blog-read-more-btn" data-post-id="${post.id}">
                        Devam�n� Oku <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        // Kart� konteyner'a ekle
        container.appendChild(cardElement);

        // Kart etkile�imlerini ayarla
        snk_main_setupPostInteractions(cardElement, post);
    });
}

/**
 * Blog kartlar� i�in etkile�imleri ayarlayan fonksiyon
 * @param {HTMLElement} postElement - Post elementi
 * @param {Object} postData - Post verisi
 */
function snk_main_setupPostInteractions(postElement, postData) {
    // Devam�n� Oku butonu
    const readMoreBtn = postElement.querySelector('.snk-blog-read-more-btn');
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const postId = parseInt(this.dataset.postId);
            window.location.href = `./blogs.html?id=${postId}`;
        });
    }

    // Be�eni butonu
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

    // Payla� butonu
    const shareButton = postElement.querySelector('.snk-share-button');
    if (shareButton) {
        shareButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); // T�klama olay�n�n yay�lmas�n� �nle
            const postId = this.getAttribute('data-post-id');
            console.log("Payla� butonuna t�kland�. Post ID:", postId);

            const post = snk_main_blogPosts.find(p => p.id === postId);

            if (post) {
                // Payla� fonksiyonunu �a��r
                SNK_CommentSystem.sharePost(postId, event);
            }
        });
    }
}

/**
 * Blog g�nderilerini g�r�nt�leme fonksiyonu (Reddit tarz� yeni tasar�m i�in)
 * @param {Array} posts - G�r�nt�lenecek blog g�nderileri dizisi
 */
function snk_main_displayBlogPosts(posts) {
    console.log("Blog g�nderileri g�r�nt�leniyor:", posts);

    // HTML i�eri�ini haz�rla
    let postsHTML = '';

    if (posts.length === 0) {
        postsHTML = `
            <div class="snk-empty-state">
                <i class="fas fa-search"></i>
                <p>G�sterilecek blog yaz�s� bulunamad�.</p>
            </div>
        `;
    } else {
        posts.forEach(post => {
            // G�nderi a��klamas�n� 150 karakterle s�n�rla
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
                                <i class="far fa-thumbs-up"></i> Be�en
                                <span class="snk-like-count">${post.likes || 0}</span>
                            </button>
                            <button class="snk-action-btn snk-comment-button" data-post-id="${post.id}">
                                <i class="far fa-comment"></i> Yorum Yap
                            </button>
                            <button class="snk-action-btn snk-share-button" data-post-id="${post.id}">
                                <i class="far fa-share-square"></i> Payla�
                            </button>
                            <button class="snk-read-more-btn snk-read-more" data-post-id="${post.id}">
                                Devam�n� Oku <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // ��eri�i DOM'a ekle
    if (snk_main_postsContainer) {
        snk_main_postsContainer.innerHTML = postsHTML;

        // Etkile�imleri kur
        snk_main_setupPostInteractions(snk_main_postsContainer);
    }
}

/**
 * Yaz� etkile�imlerini kuran fonksiyon (yeni Reddit tarz� tasar�m i�in)
 * @param {HTMLElement} container - ��inde etkile�imli elemanlar�n oldu�u konteyner
 */
function snk_main_setupPostInteractions(container) {
    // Devam�n� Oku butonlar�
    const readMoreButtons = container.querySelectorAll('.snk-read-more');
    readMoreButtons.forEach(button => {
        // �nceki event listenerlar� temizle (bu �nemli, aksi halde �ift �al��abilir)
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); // Event yay�lmas�n� �nle

            const postId = parseInt(this.dataset.postId);
            console.log(`"Devam�n� Oku" butonuna t�kland�. Post ID: ${postId}`);

            window.location.href = `./blogs.html?id=${postId}`;
        });
    });

    // Be�en butonlar�
    const likeButtons = container.querySelectorAll('.snk-like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            SNK_CommentSystem.toggleLike(this);
        });
    });

    // Yorum butonlar�
    const commentButtons = container.querySelectorAll('.snk-comment-button');
    commentButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const postId = parseInt(this.dataset.postId);
            console.log("Yorum butonuna t�kland�. Post ID:", postId);

            // Popup i�inde yorum b�l�m�ne odaklanma
            SNK_CommentSystem.openCommentModal(postId);
        });
    });

    // Payla� butonlar�
    const shareButtons = container.querySelectorAll('.snk-share-button');
    shareButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); // T�klama olay�n�n yay�lmas�n� �nle
            const postId = parseInt(this.dataset.postId);
            console.log("Payla� butonuna t�kland�. Post ID:", postId);

            const post = snk_main_blogPosts.find(p => p.id === postId);
            if (post) {
                // Payla� fonksiyonunu �a��r
                SNK_CommentSystem.sharePost(postId, event);
            }
        });
    });
}

/**
 * Blog popup'�n� g�sterme fonksiyonu
 * @param {number} postId - G�sterilecek yaz�n�n ID'si
 */
function snk_main_showBlogPopup(postId) {
    console.log("Blog popup g�steriliyor. Post ID:", postId);

    try {
        // Blog yaz�lar�n� localStorage'dan al
        const allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
        console.log("T�m yaz�lar:", allPosts);

        // ID'ye g�re yaz�y� bul
        const post = allPosts.find(p => parseInt(p.id) === parseInt(postId));

        if (!post) {
            console.error(`ID: ${postId} olan yaz� bulunamad�`);
            alert("Bu blog yaz�s� bulunamad�.");
            return;
        }

        console.log("G�sterilecek yaz�:", post);

        // Var olan popuplar� temizle
        const existingPopups = document.querySelectorAll('.snk-popup-overlay');
        existingPopups.forEach(popup => popup.remove());

        // Yeni popup olu�tur
        const popupEl = document.createElement('div');
        popupEl.className = 'snk-popup-overlay';

        // ��erik HTML'ini olu�tur
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
                        <h1 class="snk-popup-title">${post.title || 'Ba�l�ks�z Yaz�'}</h1>
                    </header>
                    
                    ${post.image ? `
                    <div class="snk-popup-featured-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    ` : ''}
                    
                    <div class="snk-popup-content-body">
                        ${post.content || post.summary || '��erik bulunamad�.'}
                    </div>
                </article>
            </div>
        `;

        // Popup'� sayfaya ekle
        document.body.appendChild(popupEl);

        // Dark mode kontrol�
        const isDarkMode = document.body.classList.contains('eren-dark-theme');
        if (isDarkMode) {
            popupEl.querySelector('.snk-popup-content').classList.add('eren-dark-theme');
        }

        // Popup'� g�r�n�r yap
        setTimeout(() => popupEl.classList.add('active'), 10);

        // Kapatma butonu i�levselli�i
        const closeBtn = popupEl.querySelector('.snk-popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            });
        }

        // Popup d���na t�klay�nca kapat
        popupEl.addEventListener('click', (e) => {
            if (e.target === popupEl) {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            }
        });

        // Dark mode de�i�ikliklerini dinle
        document.addEventListener('darkModeChanged', (e) => {
            if (e.detail.darkMode) {
                popupEl.querySelector('.snk-popup-content').classList.add('eren-dark-theme');
            } else {
                popupEl.querySelector('.snk-popup-content').classList.remove('eren-dark-theme');
            }
        });

    } catch (error) {
        console.error("Blog popup g�sterme hatas�:", error);
        alert("Blog yaz�s� g�sterilirken bir hata olu�tu.");
    }
}

/**
 * Yaz� etkile�imlerini kuran fonksiyon
 * @param {HTMLElement} container - ��inde etkile�imli elemanlar�n oldu�u konteyner
 */
function snk_main_setupPostInteractions(container) {
    if (!container) {
        console.error("Post etkile�imleri kurulamad�: Konteyner bulunamad�");
        return;
    }

    console.log("Post etkile�imleri kuruluyor...");

    // Devam�n� Oku butonlar�
    const readMoreButtons = container.querySelectorAll('.snk-read-more');
    console.log(`${readMoreButtons.length} adet "Devam�n� Oku" butonu bulundu`);

    if (readMoreButtons.length === 0) {
        console.log("Devam�n� Oku butonlar� bulunamad�, t�m kart butonlar�na event listener ekleniyor...");

        // T�m blog kartlar�n� bul ve direkt kartlara t�klama olay� ekle (devam�n� oku butonlar� yoksa)
        const blogCards = container.querySelectorAll('.snk-blog-card');
        blogCards.forEach(card => {
            const postId = card.dataset.postId;
            if (postId) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    // E�er t�klanan yer bir buton de�ilse popup'� a�
                    if (!e.target.closest('button')) {
                        e.preventDefault();
                        console.log(`Blog kart�na t�kland�. Post ID: ${postId}`);
                        window.location.href = `./blogs.html?id=${postId}`;
                    }
                });
            }
        });
    }

    // Her "Devam�n� Oku" butonuna olay dinleyicisi ekle
    readMoreButtons.forEach(btn => {
        // �nceki dinleyicileri temizle
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
                console.log(`"Devam�n� Oku" butonuna t�kland�. Post ID: ${postId}`);
                window.location.href = `./blogs.html?id=${postId}`;
            } else {
                console.error("Post ID bulunamad�");
            }
        });
    });

    // Di�er butonlar i�in etkile�imler burada korundu
}

/**
 * Blog yaz�lar�n� aktif filtreye g�re filtreler
 */
function snk_main_filterPosts(posts) {
    console.log(`Yaz�lar filtreleniyor`);

    // Sadece onaylanm�� yaz�lar� filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmi� yaz�lar� g�ster
    snk_main_displayBlogPosts(filteredPosts);
}

/**
 * En �ok okunan yaz�lar� sa� s�tunda g�ster
 * @param {Array} posts - Blog yaz�lar� dizisi
 * @param {string} filterType - Filtreleme t�r� (newest/popular)
 */
function snk_main_displayPopularPosts(posts, filterType = 'newest') {
    // Bu fonksiyon kald�r�ld�
}

/**
 * Tek bir blog yaz�s� olu�turup ekranda g�sterir
 * @param {Object} post - G�sterilecek blog yaz�s� verisi
 * @param {HTMLElement} container - Yaz�n�n eklenece�i container
 */
function snk_main_createAndDisplaySinglePost(post, container) {
    // �lk �nce container i�eri�ini temizle
    container.innerHTML = '';

    // Yaz� HTML'ini olu�tur
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
                            <i class="fas fa-share"></i> Payla�
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Yaz�y� container'a ekle
    container.insertAdjacentHTML('afterbegin', postHTML);

    // Kategori filtresini kontrol et
    if (typeof updateCategoryVisibility === 'function') {
        updateCategoryVisibility();
    }

    // Etkile�im fonksiyonlar�n� ayarla - ZORUNLU
    snk_main_setupPostInteractions(container, post);

    // Ba�ar� mesaj� g�ster
    alert('Blog yaz�n�z ba�ar�yla olu�turuldu!');
}

/**
 * Blog yaz�lar�nda yorum b�l�m�n� g�sterir
 * @param {number} postId - Yorum yap�lacak yaz�n�n ID'si
 */
function snk_main_toggleComments(postId) {
    const post = snk_main_blogPosts.find(p => p.id === postId);
    if (!post) return;

    // Mevcut yorum b�l�m�n� bul
    const postElement = document.querySelector(`.snk-post[data-post-id="${postId}"]`);
    if (!postElement) return;

    // Varsa mevcut yorum b�l�m�n� kontrol et
    let commentsSection = postElement.querySelector('.snk-post-comments');

    // Yorum b�l�m� varsa kapat, yoksa a�
    if (commentsSection) {
        if (commentsSection.classList.contains('active')) {
            commentsSection.classList.remove('active');
            setTimeout(() => commentsSection.remove(), 300);
        } else {
            commentsSection.classList.add('active');
        }
        return;
    }

    // �rnek yorumlar (ger�ek uygulamada API'den gelecek)
    const comments = [
        {
            id: 1,
            author: 'mustafadmrsy',
            date: '2025-03-02',
            content: 'Harika bir yaz� olmu�! �zellikle teknik detaylar� a��klaman�z �ok faydal� oldu.',
            likes: 5
        },
        {
            id: 2,
            author: 'senirkentli',
            date: '2025-03-03',
            content: 'Konuyu �ok g�zel �zetlemi�siniz. Acaba kaynaklar�n�z� da payla�abilir misiniz?',
            likes: 3
        },
        {
            id: 3,
            author: 'tekyazilimci',
            date: '2025-03-05',
            content: 'Ben de benzer bir proje �zerinde �al���yorum. Baz� noktalarda zorland�m, bu yaz� tam ihtiyac�m oland�!',
            likes: 8
        }
    ];

    // Yorum b�l�m� olu�tur
    commentsSection = document.createElement('div');
    commentsSection.className = 'snk-post-comments active';
    commentsSection.id = `snk_comment_section_${postId}`;

    // Yorumlar ba�l���
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
                        <i class="fas fa-thumbs-up"></i> Be�en (${comment.likes})
                    </button>
                    <button class="snk-comment-action snk-comment-reply" id="snk_comment_reply_${postId}_${comment.id}">
                        <i class="fas fa-reply"></i> Yan�tla
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
                <textarea placeholder="Yorumunuzu buraya yaz�n..." class="snk-comment-textarea" id="snk_comment_textarea_${postId}"></textarea>
                <div class="snk-comment-form-actions">
                    <button type="button" class="snk-comment-btn snk-comment-cancel" id="snk_comment_cancel_${postId}">
                        �ptal
                    </button>
                    <button type="submit" class="snk-comment-btn snk-comment-submit" id="snk_comment_submit_${postId}">
                        Yorum Yap
                    </button>
                </div>
            </form>
        </div>
    `;

    // T�m HTML'i bir araya getir
    commentsSection.innerHTML = headerHTML + commentsHTML + formHTML;

    // Yorum b�l�m�n� blog yaz�s�n�n sonuna ekle
    postElement.appendChild(commentsSection);

    // Kapatma butonuna t�klama
    const closeBtn = document.getElementById(`snk_comment_close_${postId}`);
    closeBtn.addEventListener('click', () => {
        commentsSection.classList.remove('active');
        setTimeout(() => commentsSection.remove(), 300);
    });

    // �ptal butonuna t�klama
    const cancelBtn = document.getElementById(`snk_comment_cancel_${postId}`);
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            const textarea = document.getElementById(`snk_comment_textarea_${postId}`);
            if (textarea) {
                textarea.value = '';
            }
        });
    }

    // Form g�nderme olay�
    const commentForm = document.getElementById(`snk_comment_form_${postId}`);
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const textarea = document.getElementById(`snk_comment_textarea_${postId}`);
            if (textarea && textarea.value.trim()) {
                // Yeni yorum olu�tur (ger�ek uygulamada API'ye g�nderilecek)
                alert('Yorumunuz ba�ar�yla g�nderildi!');
                textarea.value = '';
            }
        });
    }

    // Yorum be�enme butonlar�na t�klama
    const likeButtons = commentsSection.querySelectorAll('.snk-comment-like');
    likeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const commentId = parseInt(this.closest('.snk-comment').getAttribute('data-comment-id'));
            snk_main_likeComment(commentId, this);
        });
    });

    // Yorum yan�tlama butonlar�na t�klama
    const replyButtons = commentsSection.querySelectorAll('.snk-comment-reply');
    replyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const commentId = parseInt(this.closest('.snk-comment').getAttribute('data-comment-id'));
            snk_main_replyToComment(commentId, this);
        });
    });
}

/**
 * Blog yaz�lar�nda bir yorumu be�enmek i�in kullan�l�r
 * @param {number} commentId - Be�enilecek yorumun ID'si
 * @param {HTMLElement} button - T�klanan be�eni butonu
 */
function snk_main_likeComment(commentId, button) {
    const commentElement = document.querySelector(`.snk-comment[data-comment-id="${commentId}"]`);
    if (!commentElement) return;

    // Butondaki be�eni say�s�n� al
    const likeText = button.textContent;
    const likeCount = parseInt(likeText.match(/\d+/)[0]);

    // E�er buton zaten be�enilmi�se, be�eniyi kald�r
    if (button.classList.contains('active')) {
        button.classList.remove('active');
        button.innerHTML = `<i class="fas fa-thumbs-up"></i> Be�en (${likeCount - 1})`;
    } else {
        // Be�eni ekle
        button.classList.add('active');
        button.innerHTML = `<i class="fas fa-thumbs-up"></i> Be�en (${likeCount + 1})`;
    }

    // Animasyon efekti
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);

    // Ger�ek uygulamada burada API �a�r�s� yap�l�rd�
    console.log(`Yorum ID: ${commentId} be�eni durumu de�i�tirildi.`);
}

/**
 * Blog yaz�lar�nda bir yoruma yan�t verme formunu g�sterir
 * @param {number} commentId - Yan�tlanacak yorumun ID'si
 * @param {HTMLElement} button - T�klanan yan�tla butonu
 */
function snk_main_replyToComment(commentId, button) {
    const commentElement = document.querySelector(`.snk-comment[data-comment-id="${commentId}"]`);
    if (!commentElement) return;

    // Varsa mevcut yan�t formunu kontrol et
    let replyForm = commentElement.querySelector('.snk-reply-form-container');

    // Form varsa kald�r (toggle i�levi)
    if (replyForm) {
        replyForm.remove();
        return;
    }

    // Yan�t formunu olu�tur
    replyForm = document.createElement('div');
    replyForm.className = 'snk-reply-form-container';
    replyForm.id = `snk_reply_form_container_${commentId}`;

    // Formun HTML i�eri�ini olu�tur
    replyForm.innerHTML = `
        <form class="snk-reply-form" id="snk_reply_form_${commentId}">
            <textarea placeholder="Yan�t�n�z� buraya yaz�n..." class="snk-reply-textarea" id="snk_reply_textarea_${commentId}"></textarea>
            <div class="snk-reply-form-actions">
                <button type="button" class="snk-reply-btn snk-reply-cancel" id="snk_reply_cancel_${commentId}">
                    �ptal
                </button>
                <button type="submit" class="snk-reply-btn snk-reply-submit" id="snk_reply_submit_${commentId}">
                    Yan�tla
                </button>
            </div>
        </form>
    `;

    // Yan�t formunu yoruma ekle
    commentElement.appendChild(replyForm);

    // Form animasyonu
    setTimeout(() => {
        replyForm.style.maxHeight = '200px';
        replyForm.style.opacity = '1';
    }, 10);

    // Textarea'ya otomatik odaklanma
    const textarea = document.getElementById(`snk_reply_textarea_${commentId}`);
    textarea.focus();

    // �ptal butonuna t�klama
    const cancelBtn = document.getElementById(`snk_reply_cancel_${commentId}`);
    cancelBtn.addEventListener('click', () => {
        replyForm.style.maxHeight = '0';
        replyForm.style.opacity = '0';
        setTimeout(() => replyForm.remove(), 300);
    });

    // Yan�t formunun g�nderilmesi
    const form = document.getElementById(`snk_reply_form_${commentId}`);
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const replyText = textarea.value.trim();
        if (replyText) {
            // Yeni yan�t yorumunu olu�tur
            const newReply = document.createElement('div');
            newReply.className = 'snk-comment snk-reply';

            // Rastgele bir ID olu�tur (ger�ek uygulamada API'den gelir)
            const replyId = Math.floor(Math.random() * 1000) + commentId + 100;
            newReply.id = `snk_comment_reply_item_${replyId}`;
            newReply.dataset.commentId = replyId;

            // Yan�t i�eri�ini olu�tur
            newReply.innerHTML = `
                <div class="snk-comment-header">
                    <span class="snk-comment-author">
                        <i class="fas fa-user-circle"></i> Ziyaret�i
                    </span>
                    <span class="snk-comment-date">${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div class="snk-comment-content">
                    ${replyText}
                </div>
                <div class="snk-comment-actions">
                    <button class="snk-comment-action snk-comment-like" id="snk_comment_like_${replyId}">
                        <i class="fas fa-thumbs-up"></i> Be�en (0)
                    </button>
                </div>
            `;

            // Yan�t� yorumdan hemen sonra ekle
            commentElement.after(newReply);

            // Yeni yan�ta be�enme fonksiyonu ekle
            const newLikeButton = document.getElementById(`snk_comment_like_${replyId}`);
            newLikeButton.addEventListener('click', function () {
                snk_main_likeComment(replyId, this);
            });

            // Formu kapat
            replyForm.remove();

            // Ger�ek uygulamada burada API �a�r�s� yap�l�rd�
            console.log(`Yorum ID: ${commentId}'ye yan�t g�nderildi: ${replyText}`);
        }
    });
}

/**
 * Blog popuplar� i�in style ekle
 */
(function () {
    // E�er style elementimiz daha �nce eklendiyse, tekrar ekleme
    if (document.getElementById('snk-blog-popup-styles')) return;

    // Popup i�in CSS ekle
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
        
        /* Dark mode i�in uyumlu renkler */
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
 * Blog popup'�n� g�sterme fonksiyonu
 * @param {number} postId - G�sterilecek yaz�n�n ID'si
 */
function snk_main_showBlogPopup(postId) {
    console.log("Blog popup g�steriliyor. Post ID:", postId);

    try {
        // localStorage'dan yaz�lar� al - hem 'snk_blog_posts' hem de 'posts' anahtarlar�n� kontrol et
        let allPosts = [];
        try {
            // Ana depolama 'snk_blog_posts' anahtar�n� kontrol et
            const storedPosts = localStorage.getItem('snk_blog_posts');
            if (storedPosts) {
                allPosts = JSON.parse(storedPosts);
                console.log("Yaz�lar 'snk_blog_posts' anahtar�ndan al�nd�:", allPosts.length);
            } else {
                console.log("'snk_blog_posts' anahtar�nda veri bulunamad�");
            }
        } catch (e) {
            console.warn("'snk_blog_posts' okuma hatas�:", e);
        }

        // E�er allPosts bir array de�ilse veya bo�sa ba�ka kaynaklar� kontrol et
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            try {
                const blogPostsJson = localStorage.getItem('posts');
                if (blogPostsJson) {
                    const parsed = JSON.parse(blogPostsJson);
                    // posts anahtar� i�inde bir array varsa onu kullan
                    if (parsed && Array.isArray(parsed.posts)) {
                        allPosts = parsed.posts;
                        console.log("Yaz�lar 'posts' anahtar�ndan al�nd�:", allPosts.length);
                    } else if (parsed && Array.isArray(parsed)) {
                        allPosts = parsed;
                        console.log("Yaz�lar 'posts' anahtar�ndan array olarak al�nd�:", allPosts.length);
                    }
                }
            } catch (e) {
                console.warn("'posts' okuma hatas�:", e);
            }
        }

        console.log("T�m yaz�lar:", allPosts);

        // E�er hala post bulunamazsa hata g�ster
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            console.error("Hi� blog yaz�s� bulunamad�");
            alert("Blog yaz�lar� y�klenemedi. L�tfen sayfay� yenileyip tekrar deneyin.");
            return;
        }

        // ID'ye g�re yaz�y� bul
        const post = allPosts.find(p => {
            const postIdInt = parseInt(p.id);
            const targetIdInt = parseInt(postId);
            const match = postIdInt === targetIdInt;
            if (match) {
                console.log(`E�le�me bulundu: Post ID ${postIdInt} = Hedef ID ${targetIdInt}`);
            }
            return match;
        });

        if (!post) {
            console.error(`ID: ${postId} olan yaz� bulunamad�`);
            console.log("Mevcut ID'ler:", allPosts.map(p => p.id));
            alert("Bu blog yaz�s� bulunamad�.");
            return;
        }

        console.log("G�sterilecek yaz�:", post);

        // Var olan popuplar� temizle
        const existingPopups = document.querySelectorAll('.snk-popup-overlay');
        existingPopups.forEach(popup => popup.remove());

        // Yeni popup olu�tur
        const popupEl = document.createElement('div');
        popupEl.className = 'snk-popup-overlay';

        // ��erik HTML'ini olu�tur
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
                        <h1 class="snk-popup-title">${post.title || 'Ba�l�ks�z Yaz�'}</h1>
                    </header>
                    
                    ${post.image ? `
                    <div class="snk-popup-featured-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    ` : ''}
                    
                    <div class="snk-popup-content-body">
                        ${post.content || post.summary || '��erik bulunamad�.'}
                    </div>
                </article>
            </div>
        `;

        // Popup'� sayfaya ekle
        document.body.appendChild(popupEl);

        // Dark mode kontrol�
        const isDarkMode = document.body.classList.contains('eren-dark-theme');
        if (isDarkMode) {
            popupEl.querySelector('.snk-popup-content').classList.add('eren-dark-theme');
        }

        // Popup'� g�r�n�r yap
        setTimeout(() => popupEl.classList.add('active'), 10);

        // Kapatma butonu i�levselli�i
        const closeBtn = popupEl.querySelector('.snk-popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            });
        }

        // Popup d���na t�klay�nca kapat
        popupEl.addEventListener('click', (e) => {
            if (e.target === popupEl) {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            }
        });

        // ESC tu�una bas�nca kapat
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
        console.error("Blog popup g�sterme hatas�:", error);
        alert("Blog yaz�s� g�sterilirken bir hata olu�tu.");
    }
}

/**
 * Yaz� etkile�imlerini kuran fonksiyon
 * @param {HTMLElement} container - ��inde etkile�imli elemanlar�n oldu�u konteyner
 */
function snk_main_setupPostInteractions(container) {
    if (!container) {
        console.error("Post etkile�imleri kurulamad�: Konteyner bulunamad�");
        return;
    }

    console.log("Post etkile�imleri kuruluyor...");

    // Devam�n� Oku butonlar�
    const readMoreButtons = container.querySelectorAll('.snk-read-more');
    console.log(`${readMoreButtons.length} adet "Devam�n� Oku" butonu bulundu`);

    if (readMoreButtons.length === 0) {
        console.log("Devam�n� Oku butonlar� bulunamad�, t�m kart butonlar�na event listener ekleniyor...");

        // T�m blog kartlar�n� bul ve direkt kartlara t�klama olay� ekle (devam�n� oku butonlar� yoksa)
        const blogCards = container.querySelectorAll('.snk-blog-card');
        blogCards.forEach(card => {
            const postId = card.dataset.postId;
            if (postId) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    // E�er t�klanan yer bir buton de�ilse popup'� a�
                    if (!e.target.closest('button')) {
                        e.preventDefault();
                        console.log(`Blog kart�na t�kland�. Post ID: ${postId}`);
                        window.location.href = `./blogs.html?id=${postId}`;
                    }
                });
            }
        });
    }

    // Her "Devam�n� Oku" butonuna olay dinleyicisi ekle
    readMoreButtons.forEach(btn => {
        // �nceki dinleyicileri temizle
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
                console.log(`"Devam�n� Oku" butonuna t�kland�. Post ID: ${postId}`);
                window.location.href = `./blogs.html?id=${postId}`;
            } else {
                console.error("Post ID bulunamad�");
            }
        });
    });

    // Di�er butonlar i�in etkile�imler burada korundu
}

/**
 * Blog yaz�lar�n� aktif filtreye g�re filtreler
 */
function snk_main_filterPosts(posts) {
    console.log(`Yaz�lar filtreleniyor`);

    // Sadece onaylanm�� yaz�lar� filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmi� yaz�lar� g�ster
    snk_main_displayBlogPosts(filteredPosts);
}

/**
 * En �ok okunan yaz�lar� sa� s�tunda g�ster
 * @param {Array} posts - Blog yaz�lar� dizisi
 * @param {string} filterType - Filtreleme t�r� (newest/popular)
 */
function snk_main_displayPopularPosts() {
    // Bu fonksiyon kald�r�ld�
    console.log('Pop�ler yaz�lar g�sterme �zelli�i kald�r�ld�');

    // Sa� s�tundaki pop�ler yaz�lar alan�n� temizle
    const popularPostsContainer = document.getElementById('snk_popularPosts');
    if (popularPostsContainer) {
        popularPostsContainer.innerHTML = '<div class="snk-no-posts">Bu �zellik kald�r�ld�.</div>';
    }
}

/**
 * Blog yaz�lar�n� JSON dosyas�ndan y�kler
 */
function snk_main_loadBlogPosts() {
    fetch('../utils/blogPosts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Blog yaz�lar� y�klenemedi');
            }
            return response.json();
        })
        .then(data => {
            // localStorage'dan kullan�c� g�nderilerini al ve birle�tir
            const localPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
            let allPosts = [...data.posts, ...localPosts];

            // Tekrarl� g�nderileri �nle (ID'ye g�re kontrol)
            const uniquePosts = [];
            const postIds = new Set();

            allPosts.forEach(post => {
                if (!postIds.has(post.id)) {
                    postIds.add(post.id);
                    uniquePosts.push(post);
                }
            });

            // Y�klenen g�nderileri global de�i�kene kaydet ve i�le
            snk_main_blogPosts = uniquePosts;

            console.log('Blog yaz�lar� y�klendi, toplam:', snk_main_blogPosts.length);
            snk_main_onBlogPostsLoaded(snk_main_blogPosts);
        })
        .catch(error => {
            console.error('Blog yaz�lar� y�klenirken hata olu�tu:', error);
            document.getElementById('snk_postsContainer').innerHTML = `
                <div class="snk-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Blog yaz�lar� y�klenirken bir hata olu�tu. L�tfen daha sonra tekrar deneyin.</p>
                </div>
            `;
        });
}

/**
 * Blog yaz�lar�n�n y�klenmesi tamamland���nda �a�r�lacak i�lev
 * @param {Array} posts - Y�klenen blog yaz�lar� dizisi
 */
function snk_main_onBlogPostsLoaded(posts) {
    // Sadece onaylanm�� postlar� filtrele
    const approvedPosts = posts.filter(post => post.status === 'approved' || !post.status);

    console.log('Onaylanm�� yaz� say�s�:', approvedPosts.length);
    console.log('Toplam yaz� say�s�:', posts.length);

    // T�m g�nderileri g�ster
    snk_main_displayBlogPosts(approvedPosts);

    // Sa� s�tun temizlendi
}

// Filtreleme butonlar� kald�r�ld�
function snk_main_setupFilterButtons() {
    console.log('Filtreleme butonlar� kald�r�ld�');
}

/**
 * Blog yaz�lar�n� filtreler ve g�sterir
 * @param {Array} posts - T�m blog yaz�lar�
 */
function snk_main_filterPosts(posts) {
    console.log(`Yaz�lar filtreleniyor`);

    // Sadece onaylanm�� yaz�lar� filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmi� yaz�lar� g�ster
    snk_main_displayBlogPosts(filteredPosts);
}

// Global eri�im i�in
window.snk_main_filterPosts = snk_main_filterPosts;

/**
 * Belirli bir kategoriye g�re yaz�lar� filtreler (kategori sayfas� i�in)
 * @param {string} category - Filtrelenecek kategori ad�
 */
function snk_main_filterByCategory(category) {
    console.log("Kategori filtreleniyor:", category);

    // T�m yaz�lar y�kl� de�ilse �nce y�kle
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
                console.error('Kategori filtreleme hatas�:', error);
                if (snk_main_postsContainer) {
                    snk_main_postsContainer.innerHTML = `
                        <div class="snk-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Blog yaz�lar� y�klenirken bir hata olu�tu. L�tfen daha sonra tekrar deneyin.</p>
                        </div>
                    `;
                }
            });
    } else {
        // Veri zaten y�kl� ise do�rudan filtrele
        const filteredPosts = snk_main_blogPosts.filter(post =>
            post.category.toLowerCase() === category.toLowerCase()
        );
        snk_main_displayBlogPosts(filteredPosts);
    }
}

// Global eri�im i�in
window.snk_main_filterByCategory = snk_main_filterByCategory;

/**
 * Blog yaz�lar�n� JSON dosyas�ndan y�kler
 */
function snk_main_loadBlogPosts() {
    fetch('../utils/blogPosts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Blog yaz�lar� y�klenemedi');
            }
            return response.json();
        })
        .then(data => {
            // localStorage'dan kullan�c� g�nderilerini al ve birle�tir
            const localPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
            let allPosts = [...data.posts, ...localPosts];

            // Tekrarl� g�nderileri �nle (ID'ye g�re kontrol)
            const uniquePosts = [];
            const postIds = new Set();

            allPosts.forEach(post => {
                if (!postIds.has(post.id)) {
                    postIds.add(post.id);
                    uniquePosts.push(post);
                }
            });

            // Y�klenen g�nderileri global de�i�kene kaydet ve i�le
            snk_main_blogPosts = uniquePosts;

            console.log('Blog yaz�lar� y�klendi, toplam:', snk_main_blogPosts.length);
            snk_main_onBlogPostsLoaded(snk_main_blogPosts);
        })
        .catch(error => {
            console.error('Blog yaz�lar� y�klenirken hata olu�tu:', error);
            document.getElementById('snk_postsContainer').innerHTML = `
                <div class="snk-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Blog yaz�lar� y�klenirken bir hata olu�tu. L�tfen daha sonra tekrar deneyin.</p>
                </div>
            `;
        });
}

/**
 * Blog yaz�lar�n�n y�klenmesi tamamland���nda �a�r�lacak i�lev
 * @param {Array} posts - Y�klenen blog yaz�lar� dizisi
 */
function snk_main_onBlogPostsLoaded(posts) {
    // Sadece onaylanm�� postlar� filtrele
    const approvedPosts = posts.filter(post => post.status === 'approved' || !post.status);

    console.log('Onaylanm�� yaz� say�s�:', approvedPosts.length);
    console.log('Toplam yaz� say�s�:', posts.length);

    // T�m g�nderileri g�ster
    snk_main_displayBlogPosts(approvedPosts);

    // Sa� s�tun temizlendi
}

// Filtreleme butonlar� kald�r�ld�
function snk_main_setupFilterButtons() {
    console.log('Filtreleme butonlar� kald�r�ld�');
}

/**
 * Blog yaz�lar�n� filtreler ve g�sterir
 * @param {Array} posts - T�m blog yaz�lar�
 */
function snk_main_filterPosts(posts) {
    console.log(`Yaz�lar filtreleniyor`);

    // Sadece onaylanm�� yaz�lar� filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmi� yaz�lar� g�ster
    snk_main_displayBlogPosts(filteredPosts);
}

// En pop�ler yaz�lar� g�sterme fonksiyonu kald�r�ld�
function snk_main_displayPopularPosts() {
    // Bu fonksiyon kald�r�ld�
    console.log('Pop�ler yaz�lar g�sterme �zelli�i kald�r�ld�');

    // Sa� s�tundaki pop�ler yaz�lar alan�n� temizle
    const popularPostsContainer = document.getElementById('snk_popularPosts');
    if (popularPostsContainer) {
        popularPostsContainer.innerHTML = '<div class="snk-no-posts">Bu �zellik kald�r�ld�.</div>';
    }
}

/**
 * Blog popup'�n� g�sterme fonksiyonu
 * @param {number} postId - G�sterilecek yaz�n�n ID'si
 */
function snk_main_showBlogPopup(postId) {
    console.log("Blog popup g�steriliyor. Post ID:", postId);

    try {
        // localStorage'dan yaz�lar� al - hem 'snk_blog_posts' hem de 'posts' anahtarlar�n� kontrol et
        let allPosts = [];
        try {
            // Ana depolama 'snk_blog_posts' anahtar�n� kontrol et
            const storedPosts = localStorage.getItem('snk_blog_posts');
            if (storedPosts) {
                allPosts = JSON.parse(storedPosts);
                console.log("Yaz�lar 'snk_blog_posts' anahtar�ndan al�nd�:", allPosts.length);
            } else {
                console.log("'snk_blog_posts' anahtar�nda veri bulunamad�");
            }
        } catch (e) {
            console.warn("'snk_blog_posts' okuma hatas�:", e);
        }

        // E�er allPosts bir array de�ilse veya bo�sa ba�ka kaynaklar� kontrol et
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            try {
                const blogPostsJson = localStorage.getItem('posts');
                if (blogPostsJson) {
                    const parsed = JSON.parse(blogPostsJson);
                    // posts anahtar� i�inde bir array varsa onu kullan
                    if (parsed && Array.isArray(parsed.posts)) {
                        allPosts = parsed.posts;
                        console.log("Yaz�lar 'posts' anahtar�ndan al�nd�:", allPosts.length);
                    } else if (parsed && Array.isArray(parsed)) {
                        allPosts = parsed;
                        console.log("Yaz�lar 'posts' anahtar�ndan array olarak al�nd�:", allPosts.length);
                    }
                }
            } catch (e) {
                console.warn("'posts' okuma hatas�:", e);
            }
        }

        console.log("T�m yaz�lar:", allPosts);

        // E�er hala post bulunamazsa hata g�ster
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            console.error("Hi� blog yaz�s� bulunamad�");
            alert("Blog yaz�lar� y�klenemedi. L�tfen sayfay� yenileyip tekrar deneyin.");
            return;
        }

        // ID'ye g�re yaz�y� bul
        const post = allPosts.find(p => {
            const postIdInt = parseInt(p.id);
            const targetIdInt = parseInt(postId);
            const match = postIdInt === targetIdInt;
            if (match) {
                console.log(`E�le�me bulundu: Post ID ${postIdInt} = Hedef ID ${targetIdInt}`);
            }
            return match;
        });

        if (!post) {
            console.error(`ID: ${postId} olan yaz� bulunamad�`);
            console.log("Mevcut ID'ler:", allPosts.map(p => p.id));
            alert("Bu blog yaz�s� bulunamad�.");
            return;
        }

        console.log("G�sterilecek yaz�:", post);

        // Var olan popuplar� temizle
        const existingPopups = document.querySelectorAll('.snk-popup-overlay');
        existingPopups.forEach(popup => popup.remove());

        // Yeni popup olu�tur
        const popupEl = document.createElement('div');
        popupEl.className = 'snk-popup-overlay';

        // ��erik HTML'ini olu�tur
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
                        <h1 class="snk-popup-title">${post.title || 'Ba�l�ks�z Yaz�'}</h1>
                    </header>
                    
                    ${post.image ? `
                    <div class="snk-popup-featured-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    ` : ''}
                    
                    <div class="snk-popup-content-body">
                        ${post.content || post.summary || '��erik bulunamad�.'}
                    </div>
                </article>
            </div>
        `;

        // Popup'� sayfaya ekle
        document.body.appendChild(popupEl);

        // Dark mode kontrol�
        const isDarkMode = document.body.classList.contains('eren-dark-theme');
        if (isDarkMode) {
            popupEl.querySelector('.snk-popup-content').classList.add('eren-dark-theme');
        }

        // Popup'� g�r�n�r yap
        setTimeout(() => popupEl.classList.add('active'), 10);

        // Kapatma butonu i�levselli�i
        const closeBtn = popupEl.querySelector('.snk-popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            });
        }

        // Popup d���na t�klay�nca kapat
        popupEl.addEventListener('click', (e) => {
            if (e.target === popupEl) {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            }
        });

        // ESC tu�una bas�nca kapat
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
        console.error("Blog popup g�sterme hatas�:", error);
        alert("Blog yaz�s� g�sterilirken bir hata olu�tu.");
    }
}

/**
 * Yaz� etkile�imlerini kuran fonksiyon
 * @param {HTMLElement} container - ��inde etkile�imli elemanlar�n oldu�u konteyner
 */
function snk_main_setupPostInteractions(container) {
    if (!container) {
        console.error("Post etkile�imleri kurulamad�: Konteyner bulunamad�");
        return;
    }

    console.log("Post etkile�imleri kuruluyor...");

    // Devam�n� Oku butonlar�
    const readMoreButtons = container.querySelectorAll('.snk-read-more');
    console.log(`${readMoreButtons.length} adet "Devam�n� Oku" butonu bulundu`);

    if (readMoreButtons.length === 0) {
        console.log("Devam�n� Oku butonlar� bulunamad�, t�m kart butonlar�na event listener ekleniyor...");

        // T�m blog kartlar�n� bul ve direkt kartlara t�klama olay� ekle (devam�n� oku butonlar� yoksa)
        const blogCards = container.querySelectorAll('.snk-blog-card');
        blogCards.forEach(card => {
            const postId = card.dataset.postId;
            if (postId) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    // E�er t�klanan yer bir buton de�ilse popup'� a�
                    if (!e.target.closest('button')) {
                        e.preventDefault();
                        console.log(`Blog kart�na t�kland�. Post ID: ${postId}`);
                        window.location.href = `./blogs.html?id=${postId}`;
                    }
                });
            }
        });
    }

    // Her "Devam�n� Oku" butonuna olay dinleyicisi ekle
    readMoreButtons.forEach(btn => {
        // �nceki dinleyicileri temizle
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
                console.log(`"Devam�n� Oku" butonuna t�kland�. Post ID: ${postId}`);
                window.location.href = `./blogs.html?id=${postId}`;
            } else {
                console.error("Post ID bulunamad�");
            }
        });
    });

    // Di�er butonlar i�in etkile�imler burada korundu
}

/**
 * Blog yaz�lar�n� aktif filtreye g�re filtreler
 */
function snk_main_filterPosts(posts) {
    console.log(`Yaz�lar filtreleniyor`);

    // Sadece onaylanm�� yaz�lar� filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmi� yaz�lar� g�ster
    snk_main_displayBlogPosts(filteredPosts);
}

/**
 * Kategori ad�n� d�nd�r�r
 * @param {string} categoryKey - Kategori anahtar�
 * @returns {string} Kategori ad�
 */
function getCategoryName(categoryKey) {
    const categories = {
        'teknoloji': 'Teknoloji',
        'egitim': 'E�itim',
        'yasam': 'Ya�am',
        'kultursanat': 'K�lt�r & Sanat',
        'bilim': 'Bilim'
    };

    return categories[categoryKey] || categoryKey;
}

/**
 * Metni belirtilen uzunlu�a k�salt�r
 * @param {string} text - K�salt�lacak metin
 * @param {number} maxLength - Maksimum uzunluk
 * @returns {string} K�salt�lm�� metin
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

/**
 * Tarihi formatlar
 * @param {string} dateString - ISO tarih format�
 * @returns {string} Formatlanm�� tarih
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
}

/**
 * Kategori filtresi de�i�ti�inde blog yaz�lar�n� g�nceller
 */
function updateCategoryVisibility() {
    const activeCategoryBtn = document.querySelector('.snk-category-btn.active');
    if (!activeCategoryBtn) return; // Aktif kategori butonu yoksa ��k

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
 * Kategori butonuna t�kland���nda �al���r
 * @param {Event} event - T�klama olay�
 * @param {string} category - Kategori de�eri
 */
function snk_main_filterByCategory(event, category) {
    // Eski aktif butonu kald�r
    const currentActive = document.querySelector('.snk-category-btn.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }

    // Yeni butonu aktif yap
    event.currentTarget.classList.add('active');

    // Blog yaz�lar�n� filtrele
    const allPosts = document.querySelectorAll('.snk-post');

    allPosts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });
}

// Kategori butonlar�n� i�levsel hale getir
document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.snk-category-btn');

    categoryButtons.forEach(button => {
        const category = button.dataset.category;
        button.addEventListener('click', function (event) {
            snk_main_filterByCategory(event, category);
        });
    });

    // "Olu�tur" butonu
    const createButton = document.querySelector('.snk-create-btn');
    if (createButton) {
        createButton.addEventListener('click', snk_main_openCreatePostPopup);
    }
});

// Global eri�im i�in
window.snk_main_openCreatePostPopup = snk_main_openCreatePostPopup;

// Giri� formunda �ifre g�r�n�rl���n� ayarlamak i�in
function snk_main_setupPasswordToggle() {
    console.log("�ifre toggle butonu ayarlan�yor");

    // Bu fonksiyon document.ready'den sonra �a�r�ld���nda DOM haz�r olacak
    // Ancak 300ms sonra tekrar �a��rmak en g�venli yol
    setTimeout(() => {
        const passwordToggleBtn = document.getElementById('snk_login_toggle_password');

        if (passwordToggleBtn) {
            console.log("�ifre toggle butonu bulundu");

            // Mevcut event listener'lar� temizle (olas� duplikasyonu �nlemek i�in)
            passwordToggleBtn.removeEventListener('click', togglePasswordVisibility);

            // Yeni event listener ekle
            passwordToggleBtn.addEventListener('click', togglePasswordVisibility);
        } else {
            console.log("�ifre toggle butonu bulunamad� (hen�z y�klenmemi� olabilir)");
        }
    }, 300);
}

// �ifre g�r�n�rl���n� de�i�tiren yard�mc� fonksiyon
function togglePasswordVisibility(e) {
    console.log("�ifre toggle butonuna t�kland�");
    // Taray�c�n�n varsay�lan davran���n� engelle
    e.preventDefault();
    e.stopPropagation();

    // �ifre input alan�n� bul
    const passwordInput = document.getElementById('loginPassword');
    if (passwordInput) {
        // �ifre g�r�n�rl���n� de�i�tir
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // �konu de�i�tir
        const icon = this.querySelector('i');
        if (icon) {
            if (type === 'text') {
                // �ifre g�steriliyor, ikonu g�z kapal� yap
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                // �ifre gizli, ikonu g�z a��k yap
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    } else {
        console.error("�ifre input alan� bulunamad�");
    }
}

// Login popup kapatma butonunu ayarla
function snk_main_setupLoginPopupClose() {
    console.log("Login popup kapatma butonu ayarlan�yor");

    // Bir s�re bekleyerek DOM'un tam olarak y�klenmesini sa�la
    setTimeout(() => {
        const loginCloseBtn = document.getElementById('snk_loginCloseBtn');
        const loginPopup = document.getElementById('snk_loginPopup');

        if (loginCloseBtn && loginPopup) {
            console.log("Login popup kapatma butonu bulundu");

            // Mevcut event listener'lar� temizle (olas� duplikasyonu �nlemek i�in)
            loginCloseBtn.removeEventListener('click', closeLoginPopup);

            // Yeni event listener ekle
            loginCloseBtn.addEventListener('click', closeLoginPopup);
        } else {
            console.error("Login popup kapatma butonu veya popup bulunamad�:",
                { closeBtn: !!loginCloseBtn, popup: !!loginPopup });
        }
    }, 300);
}

// Popup kapatma yard�mc� fonksiyonu
function closeLoginPopup(e) {
    console.log("Login kapatma butonuna t�kland�");
    e.preventDefault();

    const loginPopup = document.getElementById('snk_loginPopup');
    if (loginPopup) {
        loginPopup.classList.remove('active');
        document.body.style.overflow = ''; // Sayfa scroll'u tekrar etkinle�tir
    }
}

// Login popup'�n� a�ma fonksiyonu
function snk_main_openLoginPopup() {
    console.log("Login popup a��l�yor");

    const loginPopup = document.getElementById('snk_loginPopup');

    if (loginPopup) {
        loginPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa scroll'u devre d��� b�rak

        // Popup a��ld�ktan sonra �ifre g�r�n�rl�k butonunu tekrar ayarla
        snk_main_setupPasswordToggle();
        // Kapatma butonunu tekrar ayarla
        snk_main_setupLoginPopupClose();
    } else {
        console.error("Login popup bulunamad�");
    }
}

// Login popup'�n� kapatma fonksiyonu
function snk_main_closeLoginPopup() {
    closeLoginPopup({ preventDefault: () => { } });
}

// Giri� yapma/kay�t olma formu ge�i�lerini ayarlamak i�in
function snk_main_setupAuthFormToggles() {
    const showRegisterLink = document.getElementById('showRegisterPopup');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function (e) {
            e.preventDefault();
            // Login popup'� kapat, register popup'� a�
            const loginPopup = document.getElementById('snk_loginPopup');
            if (loginPopup) {
                loginPopup.classList.remove('active');
            }

            // Register popup kodunu buraya ekleyebiliriz
            // Ya da popup-handler.js'deki fonksiyonu �a��rabiliriz
            if (typeof snk_popupHandler_showRegisterForm === 'function') {
                snk_popupHandler_showRegisterForm();
            }
        });
    }
}

// Sayfa y�klendi�inde �al��acak fonksiyonlar
document.addEventListener('DOMContentLoaded', function () {
    console.log("Main.js y�klendi");

    // DOM elemanlar�n� tekrar tan�mla (lazy loading i�in g�venlik)
    const postsContainer = document.getElementById('snk_postsContainer');
    const filterNewest = document.getElementById('snk_filterNewest');
    const filterPopular = document.getElementById('snk_filterPopular');
    const sidebarPopular = document.getElementById('snk_sidebarPopular');

    console.log("Main elemanlar�:", { postsContainer, filterNewest, filterPopular, sidebarPopular });

    // Blog yaz�lar�n� y�kle
    snk_main_loadBlogPosts();

    // Filtreleme butonlar� i�in olay dinleyicileri ekle
    snk_main_setupFilterButtons();

    // Sidebar'daki pop�ler linki i�in olay dinleyicisi
    if (sidebarPopular) {
        sidebarPopular.addEventListener('click', (e) => {
            e.preventDefault(); // Sayfan�n yenilenmesini engelle

            // Pop�ler filtreyi aktifle�tir
            if (filterPopular) {
                filterPopular.click(); // Pop�ler filtresine t�klamay� sim�le et
            } else {
                // Pop�ler filtresi bulunamazsa manuel olarak uygula
                // UI g�ncelleme
                document.querySelectorAll('.snk-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.id === 'snk_filterPopular') {
                        btn.classList.add('active');
                    }
                });

                // Blog yaz�lar�n� filtrele ve g�ster
                snk_main_filterPosts();
            }

            // Sidebar link'lerinin aktif durumunu g�ncelle
            document.querySelectorAll('.snk-sidebar-item').forEach(item => {
                item.classList.remove('active');
            });
            sidebarPopular.classList.add('active');
        });
    }

    // �ifre g�r�n�rl�k butonunu ayarla
    snk_main_setupPasswordToggle();

    // Giri�/Kay�t form ge�i�lerini ayarla
    snk_main_setupAuthFormToggles();

    // Login popup kapatma butonunu ayarla
    snk_main_setupLoginPopupClose();

    // Giri� yapma butonunu ayarla
    const loginButton = document.getElementById('snk_login_btn');
    if (loginButton) {
        loginButton.addEventListener('click', function (e) {
            e.preventDefault();
            snk_main_openLoginPopup();
        });
    }
});

/**
 * Belirli bir kategoriye g�re yaz�lar� filtreler (kategori sayfas� i�in)
 * @param {string} category - Filtrelenecek kategori ad�
 */
function snk_main_filterByCategory(category) {
    console.log("Kategori filtreleniyor:", category);

    // T�m yaz�lar y�kl� de�ilse �nce y�kle
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
                console.error('Kategori filtreleme hatas�:', error);
                if (snk_main_postsContainer) {
                    snk_main_postsContainer.innerHTML = `
                        <div class="snk-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>Blog yaz�lar� y�klenirken bir hata olu�tu. L�tfen daha sonra tekrar deneyin.</p>
                        </div>
                    `;
                }
            });
    } else {
        // Veri zaten y�kl� ise do�rudan filtrele
        const filteredPosts = snk_main_blogPosts.filter(post =>
            post.category.toLowerCase() === category.toLowerCase()
        );
        snk_main_displayBlogPosts(filteredPosts);
    }
}

// Global eri�im i�in
window.snk_main_filterByCategory = snk_main_filterByCategory;

/**
 * Blog yaz�lar�n� JSON dosyas�ndan y�kler
 */
function snk_main_loadBlogPosts() {
    fetch('../utils/blogPosts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Blog yaz�lar� y�klenemedi');
            }
            return response.json();
        })
        .then(data => {
            // localStorage'dan kullan�c� g�nderilerini al ve birle�tir
            const localPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');
            let allPosts = [...data.posts, ...localPosts];

            // Tekrarl� g�nderileri �nle (ID'ye g�re kontrol)
            const uniquePosts = [];
            const postIds = new Set();

            allPosts.forEach(post => {
                if (!postIds.has(post.id)) {
                    postIds.add(post.id);
                    uniquePosts.push(post);
                }
            });

            // Y�klenen g�nderileri global de�i�kene kaydet ve i�le
            snk_main_blogPosts = uniquePosts;

            console.log('Blog yaz�lar� y�klendi, toplam:', snk_main_blogPosts.length);
            snk_main_onBlogPostsLoaded(snk_main_blogPosts);
        })
        .catch(error => {
            console.error('Blog yaz�lar� y�klenirken hata olu�tu:', error);
            document.getElementById('snk_postsContainer').innerHTML = `
                <div class="snk-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Blog yaz�lar� y�klenirken bir hata olu�tu. L�tfen daha sonra tekrar deneyin.</p>
                </div>
            `;
        });
}

/**
 * Blog yaz�lar�n�n y�klenmesi tamamland���nda �a�r�lacak i�lev
 * @param {Array} posts - Y�klenen blog yaz�lar� dizisi
 */
function snk_main_onBlogPostsLoaded(posts) {
    // Sadece onaylanm�� postlar� filtrele
    const approvedPosts = posts.filter(post => post.status === 'approved' || !post.status);

    console.log('Onaylanm�� yaz� say�s�:', approvedPosts.length);
    console.log('Toplam yaz� say�s�:', posts.length);

    // T�m g�nderileri g�ster
    snk_main_displayBlogPosts(approvedPosts);

    // Sa� s�tun temizlendi
}

// Filtreleme butonlar� kald�r�ld�
function snk_main_setupFilterButtons() {
    console.log('Filtreleme butonlar� kald�r�ld�');
}

/**
 * Blog yaz�lar�n� filtreler ve g�sterir
 * @param {Array} posts - T�m blog yaz�lar�
 */
function snk_main_filterPosts(posts) {
    console.log(`Yaz�lar filtreleniyor`);

    // Sadece onaylanm�� yaz�lar� filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmi� yaz�lar� g�ster
    snk_main_displayBlogPosts(filteredPosts);
}

// En pop�ler yaz�lar� g�sterme fonksiyonu kald�r�ld�
function snk_main_displayPopularPosts() {
    // Bu fonksiyon kald�r�ld�
    console.log('Pop�ler yaz�lar g�sterme �zelli�i kald�r�ld�');

    // Sa� s�tundaki pop�ler yaz�lar alan�n� temizle
    const popularPostsContainer = document.getElementById('snk_popularPosts');
    if (popularPostsContainer) {
        popularPostsContainer.innerHTML = '<div class="snk-no-posts">Bu �zellik kald�r�ld�.</div>';
    }
}

/**
 * Blog popup'�n� g�sterme fonksiyonu
 * @param {number} postId - G�sterilecek yaz�n�n ID'si
 */
function snk_main_showBlogPopup(postId) {
    console.log("Blog popup g�steriliyor. Post ID:", postId);

    try {
        // localStorage'dan yaz�lar� al - hem 'snk_blog_posts' hem de 'posts' anahtarlar�n� kontrol et
        let allPosts = [];
        try {
            // Ana depolama 'snk_blog_posts' anahtar�n� kontrol et
            const storedPosts = localStorage.getItem('snk_blog_posts');
            if (storedPosts) {
                allPosts = JSON.parse(storedPosts);
                console.log("Yaz�lar 'snk_blog_posts' anahtar�ndan al�nd�:", allPosts.length);
            } else {
                console.log("'snk_blog_posts' anahtar�nda veri bulunamad�");
            }
        } catch (e) {
            console.warn("'snk_blog_posts' okuma hatas�:", e);
        }

        // E�er allPosts bir array de�ilse veya bo�sa ba�ka kaynaklar� kontrol et
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            try {
                const blogPostsJson = localStorage.getItem('posts');
                if (blogPostsJson) {
                    const parsed = JSON.parse(blogPostsJson);
                    // posts anahtar� i�inde bir array varsa onu kullan
                    if (parsed && Array.isArray(parsed.posts)) {
                        allPosts = parsed.posts;
                        console.log("Yaz�lar 'posts' anahtar�ndan al�nd�:", allPosts.length);
                    } else if (parsed && Array.isArray(parsed)) {
                        allPosts = parsed;
                        console.log("Yaz�lar 'posts' anahtar�ndan array olarak al�nd�:", allPosts.length);
                    }
                }
            } catch (e) {
                console.warn("'posts' okuma hatas�:", e);
            }
        }

        console.log("T�m yaz�lar:", allPosts);

        // E�er hala post bulunamazsa hata g�ster
        if (!Array.isArray(allPosts) || allPosts.length === 0) {
            console.error("Hi� blog yaz�s� bulunamad�");
            alert("Blog yaz�lar� y�klenemedi. L�tfen sayfay� yenileyip tekrar deneyin.");
            return;
        }

        // ID'ye g�re yaz�y� bul
        const post = allPosts.find(p => {
            const postIdInt = parseInt(p.id);
            const targetIdInt = parseInt(postId);
            const match = postIdInt === targetIdInt;
            if (match) {
                console.log(`E�le�me bulundu: Post ID ${postIdInt} = Hedef ID ${targetIdInt}`);
            }
            return match;
        });

        if (!post) {
            console.error(`ID: ${postId} olan yaz� bulunamad�`);
            console.log("Mevcut ID'ler:", allPosts.map(p => p.id));
            alert("Bu blog yaz�s� bulunamad�.");
            return;
        }

        console.log("G�sterilecek yaz�:", post);

        // Var olan popuplar� temizle
        const existingPopups = document.querySelectorAll('.snk-popup-overlay');
        existingPopups.forEach(popup => popup.remove());

        // Yeni popup olu�tur
        const popupEl = document.createElement('div');
        popupEl.className = 'snk-popup-overlay';

        // ��erik HTML'ini olu�tur
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
                        <h1 class="snk-popup-title">${post.title || 'Ba�l�ks�z Yaz�'}</h1>
                    </header>
                    
                    ${post.image ? `
                    <div class="snk-popup-featured-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                    ` : ''}
                    
                    <div class="snk-popup-content-body">
                        ${post.content || post.summary || '��erik bulunamad�.'}
                    </div>
                </article>
            </div>
        `;

        // Popup'� sayfaya ekle
        document.body.appendChild(popupEl);

        // Dark mode kontrol�
        const isDarkMode = document.body.classList.contains('eren-dark-theme');
        if (isDarkMode) {
            popupEl.querySelector('.snk-popup-content').classList.add('eren-dark-theme');
        }

        // Popup'� g�r�n�r yap
        setTimeout(() => popupEl.classList.add('active'), 10);

        // Kapatma butonu i�levselli�i
        const closeBtn = popupEl.querySelector('.snk-popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            });
        }

        // Popup d���na t�klay�nca kapat
        popupEl.addEventListener('click', (e) => {
            if (e.target === popupEl) {
                popupEl.classList.remove('active');
                setTimeout(() => popupEl.remove(), 300);
            }
        });

        // ESC tu�una bas�nca kapat
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
        console.error("Blog popup g�sterme hatas�:", error);
        alert("Blog yaz�s� g�sterilirken bir hata olu�tu.");
    }
}

/**
 * Yaz� etkile�imlerini kuran fonksiyon
 * @param {HTMLElement} container - ��inde etkile�imli elemanlar�n oldu�u konteyner
 */
function snk_main_setupPostInteractions(container) {
    if (!container) {
        console.error("Post etkile�imleri kurulamad�: Konteyner bulunamad�");
        return;
    }

    console.log("Post etkile�imleri kuruluyor...");

    // Devam�n� Oku butonlar�
    const readMoreButtons = container.querySelectorAll('.snk-read-more');
    console.log(`${readMoreButtons.length} adet "Devam�n� Oku" butonu bulundu`);

    if (readMoreButtons.length === 0) {
        console.log("Devam�n� Oku butonlar� bulunamad�, t�m kart butonlar�na event listener ekleniyor...");

        // T�m blog kartlar�n� bul ve direkt kartlara t�klama olay� ekle (devam�n� oku butonlar� yoksa)
        const blogCards = container.querySelectorAll('.snk-blog-card');
        blogCards.forEach(card => {
            const postId = card.dataset.postId;
            if (postId) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    // E�er t�klanan yer bir buton de�ilse popup'� a�
                    if (!e.target.closest('button')) {
                        e.preventDefault();
                        console.log(`Blog kart�na t�kland�. Post ID: ${postId}`);
                        window.location.href = `./blogs.html?id=${postId}`;
                    }
                });
            }
        });
    }

    // Her "Devam�n� Oku" butonuna olay dinleyicisi ekle
    readMoreButtons.forEach(btn => {
        // �nceki dinleyicileri temizle
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
                console.log(`"Devam�n� Oku" butonuna t�kland�. Post ID: ${postId}`);
                window.location.href = `./blogs.html?id=${postId}`;
            } else {
                console.error("Post ID bulunamad�");
            }
        });
    });

    // Di�er butonlar i�in etkile�imler burada korundu
}

/**
 * Blog yaz�lar�n� aktif filtreye g�re filtreler
 */
function snk_main_filterPosts(posts) {
    console.log(`Yaz�lar filtreleniyor`);

    // Sadece onaylanm�� yaz�lar� filtrele
    let filteredPosts = posts.filter(post => post.status === 'approved' || !post.status);

    // Filtrelenmi� yaz�lar� g�ster
    snk_main_displayBlogPosts(filteredPosts);
}

/**
 * Kategori ad�n� d�nd�r�r
 * @param {string} categoryKey - Kategori anahtar�
 * @returns {string} Kategori ad�
 */
function getCategoryName(categoryKey) {
    const categories = {
        'teknoloji': 'Teknoloji',
        'egitim': 'E�itim',
        'yasam': 'Ya�am',
        'kultursanat': 'K�lt�r & Sanat',
        'bilim': 'Bilim'
    };

    return categories[categoryKey] || categoryKey;
}

/**
 * Metni belirtilen uzunlu�a k�salt�r
 * @param {string} text - K�salt�lacak metin
 * @param {number} maxLength - Maksimum uzunluk
 * @returns {string} K�salt�lm�� metin
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

/**
 * Tarihi formatlar
 * @param {string} dateString - ISO tarih format�
 * @returns {string} Formatlanm�� tarih
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
}

/**
 * Kategori filtresi de�i�ti�inde blog yaz�lar�n� g�nceller
 */
function updateCategoryVisibility() {
    const activeCategoryBtn = document.querySelector('.snk-category-btn.active');
    if (!activeCategoryBtn) return; // Aktif kategori butonu yoksa ��k

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
 * Kategori butonuna t�kland���nda �al���r
 * @param {Event} event - T�klama olay�
 * @param {string} category - Kategori de�eri
 */
function snk_main_filterByCategory(event, category) {
    // Eski aktif butonu kald�r
    const currentActive = document.querySelector('.snk-category-btn.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }

    // Yeni butonu aktif yap
    event.currentTarget.classList.add('active');

    // Blog yaz�lar�n� filtrele
    const allPosts = document.querySelectorAll('.snk-post');

    allPosts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });
}

// Kategori butonlar�n� i�levsel hale getir
document.addEventListener('DOMContentLoaded', function () {
    const categoryButtons = document.querySelectorAll('.snk-category-btn');

    categoryButtons.forEach(button => {
        const category = button.dataset.category;
        button.addEventListener('click', function (event) {
            snk_main_filterByCategory(event, category);
        });
    });

    // "Olu�tur" butonu
    const createButton = document.querySelector('.snk-create-btn');
    if (createButton) {
        createButton.addEventListener('click', snk_main_openCreatePostPopup);
    }
});

// Global eri�im i�in
window.snk_main_openCreatePostPopup = snk_main_openCreatePostPopup;

// Giri� formunda �ifre g�r�n�rl���n� ayarlamak i�in
function snk_main_setupPasswordToggle() {
    console.log("�ifre toggle butonu ayarlan�yor");

    // Bu fonksiyon document.ready'den sonra �a�r�ld���nda DOM haz�r olacak
    // Ancak 300ms sonra tekrar �a��rmak en g�venli yol
    setTimeout(() => {
        const passwordToggleBtn = document.getElementById('snk_login_toggle_password');

        if (passwordToggleBtn) {
            console.log("�ifre toggle butonu bulundu");

            // Mevcut event listener'lar� temizle (olas� duplikasyonu �nlemek i�in)
            passwordToggleBtn.removeEventListener('click', togglePasswordVisibility);

            // Yeni event listener ekle
            passwordToggleBtn.addEventListener('click', togglePasswordVisibility);
        } else {
            console.log("�ifre toggle butonu bulunamad� (hen�z y�klenmemi� olabilir)");
        }
    }, 300);
}

// �ifre g�r�n�rl���n� de�i�tiren yard�mc� fonksiyon
function togglePasswordVisibility(e) {
    console.log("�ifre toggle butonuna t�kland�");
    // Taray�c�n�n varsay�lan davran���n� engelle
    e.preventDefault();
    e.stopPropagation();

    // �ifre input alan�n� bul
    const passwordInput = document.getElementById('loginPassword');
    if (passwordInput) {
        // �ifre g�r�n�rl���n� de�i�tir
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // �konu de�i�tir
        const icon = this.querySelector('i');
        if (icon) {
            if (type === 'text') {
                // �ifre g�steriliyor, ikonu g�z kapal� yap
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                // �ifre gizli, ikonu g�z a��k yap
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    } else {
        console.error("�ifre input alan� bulunamad�");
    }
}

// Login popup kapatma butonunu ayarla
function snk_main_setupLoginPopupClose() {
    console.log("Login popup kapatma butonu ayarlan�yor");

    // Bir s�re bekleyerek DOM'un tam olarak y�klenmesini sa�la
    setTimeout(() => {
        const loginCloseBtn = document.getElementById('snk_loginCloseBtn');
        const loginPopup = document.getElementById('snk_loginPopup');

        if (loginCloseBtn && loginPopup) {
            console.log("Login popup kapatma butonu bulundu");

            // Mevcut event listener'lar� temizle (olas� duplikasyonu �nlemek i�in)
            loginCloseBtn.removeEventListener('click', closeLoginPopup);

            // Yeni event listener ekle
            loginCloseBtn.addEventListener('click', closeLoginPopup);
        } else {
            console.error("Login popup kapatma butonu veya popup bulunamad�:",
                { closeBtn: !!loginCloseBtn, popup: !!loginPopup });
        }
    }, 300);
}

// Popup kapatma yard�mc� fonksiyonu
function closeLoginPopup(e) {
    console.log("Login kapatma butonuna t�kland�");
    e.preventDefault();

    const loginPopup = document.getElementById('snk_loginPopup');
    if (loginPopup) {
        loginPopup.classList.remove('active');
        document.body.style.overflow = ''; // Sayfa scroll'u tekrar etkinle�tir
    }
}

// Login popup'�n� a�ma fonksiyonu
function snk_main_openLoginPopup() {
    console.log("Login popup a��l�yor");

    const loginPopup = document.getElementById('snk_loginPopup');

    if (loginPopup) {
        loginPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Sayfa scroll'u devre d��� b�rak

        // Popup a��ld�ktan sonra �ifre g�r�n�rl�k butonunu tekrar ayarla
        snk_main_setupPasswordToggle();
        // Kapatma butonunu tekrar ayarla
        snk_main_setupLoginPopupClose();
    } else {
        console.error("Login popup bulunamad�");
    }
}

// Login popup'�n� kapatma fonksiyonu
function snk_main_closeLoginPopup() {
    closeLoginPopup({ preventDefault: () => { } });
}

// Giri� yapma/kay�t olma formu ge�i�lerini ayarlamak i�in
function snk_main_setupAuthFormToggles() {
    const showRegisterLink = document.getElementById('showRegisterPopup');

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function (e) {
            e.preventDefault();
            // Login popup'� kapat, register popup'� a�
            const loginPopup = document.getElementById('snk_loginPopup');
            if (loginPopup) {
                loginPopup.classList.remove('active');
            }

            // Register popup kodunu buraya ekleyebiliriz
            // Ya da popup-handler.js'deki fonksiyonu �a��rabiliriz
            if (typeof snk_popupHandler_showRegisterForm === 'function') {
                snk_popupHandler_showRegisterForm();
            }
        });
    }
}

// Sayfa y�klendi�inde �al��acak fonksiyonlar
document.addEventListener('DOMContentLoaded', function () {
    console.log("Main.js y�klendi");

    // DOM elemanlar�n� tekrar tan�mla (lazy loading i�in g�venlik)
    const postsContainer = document.getElementById('snk_postsContainer');
    const filterNewest = document.getElementById('snk_filterNewest');
    const filterPopular = document.getElementById('snk_filterPopular');
    const sidebarPopular = document.getElementById('snk_sidebarPopular');

    console.log("Main elemanlar�:", { postsContainer, filterNewest, filterPopular, sidebarPopular });

    // Blog yaz�lar�n� y�kle
    snk_main_loadBlogPosts();

    // Filtreleme butonlar� i�in olay dinleyicileri ekle
    snk_main_setupFilterButtons();

    // Sidebar'daki pop�ler linki i�in olay dinleyicisi
    if (sidebarPopular) {
        sidebarPopular.addEventListener('click', (e) => {
            e.preventDefault(); // Sayfan�n yenilenmesini engelle

            // Pop�ler filtreyi aktifle�tir
            if (filterPopular) {
                filterPopular.click(); // Pop�ler filtresine t�klamay� sim�le et
            } else {
                // Pop�ler filtresi bulunamazsa manuel olarak uygula
                // UI g�ncelleme
                document.querySelectorAll('.snk-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.id === 'snk_filterPopular') {
                        btn.classList.add('active');
                    }
                });

                // Blog yaz�lar�n� filtrele ve g�ster
                snk_main_filterPosts();
            }

            // Sidebar link'lerinin aktif durumunu g�ncelle
            document.querySelectorAll('.snk-sidebar-item').forEach(item => {
                item.classList.remove('active');
            });
            sidebarPopular.classList.add('active');
        });
    }

    // �ifre g�r�n�rl�k butonunu ayarla
    snk_main_setupPasswordToggle();

    // Giri�/Kay�t form ge�i�lerini ayarla
    snk_main_setupAuthFormToggles();

    // Login popup kapatma butonunu ayarla
    snk_main_setupLoginPopupClose();

    // Giri� yapma butonunu ayarla
    const loginButton = document.getElementById('snk_login_btn');
    if (loginButton) {
        loginButton.addEventListener('click', function (e) {
            e.preventDefault();
            snk_main_openLoginPopup();
        });
    }
});
