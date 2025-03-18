/**
 * Admin Posts Handler - Senirkent Blog
 * Bu dosya admin panelinde blog yaz�lar�n� y�netme i�lemlerini sa�lar.
 */

// DOM Elements
const pendingPostsContainer = document.getElementById('pending-posts');
const publishedPostsContainer = document.getElementById('published-posts');
const pendingPostsLoader = document.getElementById('pending-posts-loader');
const publishedPostsLoader = document.getElementById('published-posts-loader');

// Sayfa y�klendi�inde postlar� y�kle
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin Posts Handler ba�lat�ld�');
    loadPendingPosts();
    loadPublishedPosts();

    // Yenileme butonuna t�klama olay�n� ekle
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', function () {
            loadPendingPosts();
            loadPublishedPosts();
        });
    }
});

/**
 * T�m postlar� y�kler
 * @returns {Promise<Array>} Y�klenen postlar dizisi
 */
async function loadAllPosts() {
    // Loader'lar� g�ster
    if (pendingPostsLoader) {
        pendingPostsLoader.style.display = 'block';
    }
    if (publishedPostsLoader) {
        publishedPostsLoader.style.display = 'block';
    }

    // localStorage'dan postlar� y�kle - �ki farkl� anahtar kontrol� yap�l�yor
    let allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

    // E�er snk_blog_posts bo� ama eski anahtar snk_blogPosts doluysa, onun i�eri�ini kullan
    if (allPosts.length === 0) {
        allPosts = JSON.parse(localStorage.getItem('snk_blogPosts') || '[]');

        // E�er eski anahtardan veri y�klendiyse, yeni anahtara da kaydet
        if (allPosts.length > 0) {
            localStorage.setItem('snk_blog_posts', JSON.stringify(allPosts));
            console.log('Blog yaz�lar� yeni anahtara ta��nd�: snk_blog_posts');
        }
    }

    // Post ID'lerini kontrol et ve gerekirse ekle
    allPosts = allPosts.map(post => {
        if (!post.id) {
            post.id = 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return post;
    });

    return allPosts;
}

/**
 * Onay bekleyen postlar� y�kler ve g�sterir
 */
async function loadPendingPosts() {
    try {
        const allPosts = await loadAllPosts();

        // Onay bekleyen yaz�lar� filtrele
        const pendingPosts = allPosts.filter(post => post.status === 'pending');

        // Y�kleme animasyonunu gizle
        if (pendingPostsLoader) {
            pendingPostsLoader.style.display = 'none';
        }

        // Container'� temizle
        pendingPostsContainer.innerHTML = '';

        // E�er onay bekleyen yaz� yoksa bilgi mesaj� g�ster
        if (pendingPosts.length === 0) {
            pendingPostsContainer.innerHTML = '<div class="no-data-message">Onay bekleyen yaz� bulunmamaktad�r.</div>';
            return;
        }

        // Her bir onay bekleyen yaz� i�in HTML olu�tur
        pendingPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'admin-post-item';
            postElement.setAttribute('data-post-id', post.id);

            // ��erik uzunlu�unu kontrol et ve d�zg�n g�r�nt�lenecek �ekilde ayarla
            const displayContent = post.content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            postElement.innerHTML = `
                <div class="admin-post-header">
                    <h3 class="admin-post-title">${post.title}</h3>
                    <span class="admin-post-category">Kategori: ${post.category}</span>
                </div>
                <div class="admin-post-meta">
                    <span class="admin-post-author">Yazar: ${post.author}</span>
                    <span class="admin-post-date">Tarih: ${post.date}</span>
                </div>
                ${post.image ? `
                <div class="admin-post-image">
                    <img src="${post.image}" alt="${post.title}" />
                </div>
                ` : ''}
                <div class="admin-post-summary">
                    <p>${post.summary}</p>
                    <button class="admin-view-full-post">T�m ��eri�i G�r�nt�le</button>
                </div>
                <div class="admin-post-content" style="display: none;">
                    <div class="content-wrapper">${displayContent}</div>
                    ${post.tags && post.tags.length ? `
                        <div class="admin-post-tags">
                            ${post.tags.map(tag => `<span class="admin-tag">#${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="admin-post-actions">
                    <button class="admin-approve-post" data-post-id="${post.id}">Onayla</button>
                    <button class="admin-reject-post" data-post-id="${post.id}">Reddet</button>
                </div>
            `;

            pendingPostsContainer.appendChild(postElement);
        });

        // ��erik g�r�nt�leme butonlar�n� etkinle�tir
        setupViewContentButtons(pendingPostsContainer);

        // Post onaylama ve reddetme i�lemlerini etkinle�tir
        setupPostApprovalActions();
    } catch (error) {
        console.error('Onay bekleyen yaz�lar� y�klerken hata:', error);
        if (pendingPostsContainer) {
            pendingPostsContainer.innerHTML = '<div class="no-data-message">Yaz�lar� y�klerken bir hata olu�tu.</div>';
        }
        if (pendingPostsLoader) {
            pendingPostsLoader.style.display = 'none';
        }
    }
}

/**
 * Yay�nda olan postlar� y�kler ve g�sterir
 */
async function loadPublishedPosts() {
    try {
        const allPosts = await loadAllPosts();

        // Yay�nda olan yaz�lar� filtrele (onaylanm�� olanlar)
        const publishedPosts = allPosts.filter(post => post.status === 'approved' || !post.status);

        // Y�kleme animasyonunu gizle
        if (publishedPostsLoader) {
            publishedPostsLoader.style.display = 'none';
        }

        // Container'� temizle
        publishedPostsContainer.innerHTML = '';

        // E�er yay�nda olan yaz� yoksa bilgi mesaj� g�ster
        if (publishedPosts.length === 0) {
            publishedPostsContainer.innerHTML = '<div class="no-data-message">Yay�nda olan yaz� bulunmamaktad�r.</div>';
            return;
        }

        // Her bir yay�nda olan yaz� i�in HTML olu�tur
        publishedPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'admin-post-item';
            postElement.setAttribute('data-post-id', post.id);

            // ��erik uzunlu�unu kontrol et ve d�zg�n g�r�nt�lenecek �ekilde ayarla
            const displayContent = post.content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            postElement.innerHTML = `
                <div class="admin-post-header">
                    <h3 class="admin-post-title">${post.title}</h3>
                    <span class="admin-post-category">Kategori: ${post.category}</span>
                </div>
                <div class="admin-post-meta">
                    <span class="admin-post-author">Yazar: ${post.author}</span>
                    <span class="admin-post-date">Tarih: ${post.date}</span>
                    <span class="admin-post-status">Durum: ${post.status === 'approved' ? 'Onaylanm��' : 'Yay�nda'}</span>
                </div>
                ${post.image ? `
                <div class="admin-post-image">
                    <img src="${post.image}" alt="${post.title}" />
                </div>
                ` : ''}
                <div class="admin-post-summary">
                    <p>${post.summary}</p>
                    <button class="admin-view-full-post">T�m ��eri�i G�r�nt�le</button>
                </div>
                <div class="admin-post-content" style="display: none;">
                    <div class="content-wrapper">${displayContent}</div>
                    ${post.tags && post.tags.length ? `
                        <div class="admin-post-tags">
                            ${post.tags.map(tag => `<span class="admin-tag">#${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="admin-post-actions">
                    <button class="admin-delete-post" data-post-id="${post.id}">Sil</button>
                </div>
            `;

            publishedPostsContainer.appendChild(postElement);
        });

        // ��erik g�r�nt�leme butonlar�n� etkinle�tir
        setupViewContentButtons(publishedPostsContainer);

        // Post silme i�lemlerini etkinle�tir
        setupPostDeleteActions();
    } catch (error) {
        console.error('Yay�nda olan yaz�lar� y�klerken hata:', error);
        if (publishedPostsContainer) {
            publishedPostsContainer.innerHTML = '<div class="no-data-message">Yaz�lar� y�klerken bir hata olu�tu.</div>';
        }
        if (publishedPostsLoader) {
            publishedPostsLoader.style.display = 'none';
        }
    }
}

/**
 * Belirtilen ID'ye sahip yaz�y� onaylar
 * @param {string} postId - Onaylanacak yaz�n�n ID'si
 */
function approvePost(postId) {
    console.log(`Yaz� onaylan�yor: ${postId}`);

    // Onay i�lemi i�in onay kutusu g�ster
    if (confirm('Bu yaz�y� onaylamak istedi�inize emin misiniz?')) {
        // LocalStorage'dan t�m yaz�lar� al
        const allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

        // Onaylanacak yaz�y� bul
        const postIndex = allPosts.findIndex(post => post.id.toString() === postId.toString());

        if (postIndex !== -1) {
            // Yaz�n�n durumunu "approved" olarak g�ncelle
            allPosts[postIndex].status = 'approved';
            allPosts[postIndex].approvedDate = new Date().toLocaleDateString('tr-TR');

            // LocalStorage'a kaydet
            localStorage.setItem('snk_blog_posts', JSON.stringify(allPosts));

            // Yaz�n�n yazar�n�n ID'sini al
            const authorId = allPosts[postIndex].author_id;

            // Yazar�n yaz�lar�n� da g�ncelle
            if (authorId) {
                const userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${authorId}`) || '[]');
                const userPostIndex = userPosts.findIndex(post => post.id.toString() === postId.toString());

                if (userPostIndex !== -1) {
                    userPosts[userPostIndex].status = 'approved';
                    userPosts[userPostIndex].approvedDate = allPosts[postIndex].approvedDate;
                    localStorage.setItem(`snk_user_posts_${authorId}`, JSON.stringify(userPosts));
                }
            }

            // Sayfay� yenile
            loadPendingPosts();
            loadPublishedPosts();

            // Ba�ar� mesaj� g�ster
            alert('Yaz� ba�ar�yla onayland�!');
        } else {
            alert('Yaz� bulunamad�!');
        }
    }
}

/**
 * Belirtilen ID'ye sahip yaz�y� reddeder
 * @param {string} postId - Reddedilecek yaz�n�n ID'si
 */
function rejectPost(postId) {
    console.log(`Yaz� reddediliyor: ${postId}`);

    // Red i�lemi i�in onay kutusu g�ster
    if (confirm('Bu yaz�y� reddetmek istedi�inize emin misiniz?')) {
        // LocalStorage'dan t�m yaz�lar� al
        const allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

        // Reddedilecek yaz�y� bul
        const postIndex = allPosts.findIndex(post => post.id.toString() === postId.toString());

        if (postIndex !== -1) {
            // Yaz�n�n durumunu "rejected" olarak g�ncelle
            allPosts[postIndex].status = 'rejected';
            allPosts[postIndex].rejectedDate = new Date().toLocaleDateString('tr-TR');

            // LocalStorage'a kaydet
            localStorage.setItem('snk_blog_posts', JSON.stringify(allPosts));

            // Yaz�n�n yazar�n�n ID'sini al
            const authorId = allPosts[postIndex].author_id;

            // Yazar�n yaz�lar�n� da g�ncelle
            if (authorId) {
                const userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${authorId}`) || '[]');
                const userPostIndex = userPosts.findIndex(post => post.id.toString() === postId.toString());

                if (userPostIndex !== -1) {
                    userPosts[userPostIndex].status = 'rejected';
                    userPosts[userPostIndex].rejectedDate = allPosts[postIndex].rejectedDate;
                    localStorage.setItem(`snk_user_posts_${authorId}`, JSON.stringify(userPosts));
                }
            }

            // Sayfay� yenile
            loadPendingPosts();

            // Bilgi mesaj� g�ster
            alert('Yaz� reddedildi!');
        } else {
            alert('Yaz� bulunamad�!');
        }
    }
}

/**
 * Belirtilen ID'ye sahip yaz�y� siler
 * @param {string} postId - Silinecek yaz�n�n ID'si
 */
function deletePost(postId) {
    console.log(`Yaz� siliniyor: ${postId}`);

    // Silme i�lemi i�in onay kutusu g�ster
    if (confirm('Bu yaz�y� silmek istedi�inize emin misiniz?')) {
        // LocalStorage'dan t�m yaz�lar� al
        const allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

        // Silinecek yaz�y� bul
        const postIndex = allPosts.findIndex(post => post.id.toString() === postId.toString());

        if (postIndex !== -1) {
            // Yaz�y� listeden kald�r
            allPosts.splice(postIndex, 1);

            // LocalStorage'a kaydet
            localStorage.setItem('snk_blog_posts', JSON.stringify(allPosts));

            // Yaz�n�n yazar�n�n ID'sini al
            const authorId = allPosts[postIndex].author_id;

            // Yazar�n yaz�lar�n� da g�ncelle
            if (authorId) {
                const userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${authorId}`) || '[]');
                const userPostIndex = userPosts.findIndex(post => post.id.toString() === postId.toString());

                if (userPostIndex !== -1) {
                    userPosts.splice(userPostIndex, 1);
                    localStorage.setItem(`snk_user_posts_${authorId}`, JSON.stringify(userPosts));
                }
            }

            // Sayfay� yenile
            loadPublishedPosts();

            // Bilgi mesaj� g�ster
            alert('Yaz� silindi!');
        } else {
            alert('Yaz� bulunamad�!');
        }
    }
}

// ��erik g�r�nt�leme butonlar�n� etkinle�tir
function setupViewContentButtons(container) {
    const viewFullButtons = container.querySelectorAll('.admin-view-full-post');

    viewFullButtons.forEach(button => {
        button.addEventListener('click', function () {
            const contentDiv = this.parentNode.nextElementSibling;
            const isVisible = contentDiv.style.display !== 'none';
            contentDiv.style.display = isVisible ? 'none' : 'block';
            this.textContent = isVisible ? 'T�m ��eri�i G�r�nt�le' : '��eri�i Gizle';
        });
    });
}

// Post onaylama ve reddetme i�lemlerini etkinle�tir
function setupPostApprovalActions() {
    const approveButtons = document.querySelectorAll('.admin-approve-post');
    const rejectButtons = document.querySelectorAll('.admin-reject-post');

    approveButtons.forEach(button => {
        button.addEventListener('click', function () {
            const postId = this.getAttribute('data-post-id');
            approvePost(postId);
        });
    });

    rejectButtons.forEach(button => {
        button.addEventListener('click', function () {
            const postId = this.getAttribute('data-post-id');
            rejectPost(postId);
        });
    });
}

// Post silme i�lemlerini etkinle�tir
function setupPostDeleteActions() {
    const deleteButtons = document.querySelectorAll('.admin-delete-post');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const postId = this.getAttribute('data-post-id');
            deletePost(postId);
        });
    });
}

// Global eri�im i�in
window.loadPendingPosts = loadPendingPosts;
window.loadPublishedPosts = loadPublishedPosts;
window.approvePost = approvePost;
window.rejectPost = rejectPost;
window.deletePost = deletePost;
