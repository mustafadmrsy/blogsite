/**
 * Admin Posts Handler - Senirkent Blog
 * Bu dosya admin panelinde blog yazýlarýný yönetme iþlemlerini saðlar.
 */

// DOM Elements
const pendingPostsContainer = document.getElementById('pending-posts');
const publishedPostsContainer = document.getElementById('published-posts');
const pendingPostsLoader = document.getElementById('pending-posts-loader');
const publishedPostsLoader = document.getElementById('published-posts-loader');

// Sayfa yüklendiðinde postlarý yükle
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin Posts Handler baþlatýldý');
    loadPendingPosts();
    loadPublishedPosts();

    // Yenileme butonuna týklama olayýný ekle
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', function () {
            loadPendingPosts();
            loadPublishedPosts();
        });
    }
});

/**
 * Tüm postlarý yükler
 * @returns {Promise<Array>} Yüklenen postlar dizisi
 */
async function loadAllPosts() {
    // Loader'larý göster
    if (pendingPostsLoader) {
        pendingPostsLoader.style.display = 'block';
    }
    if (publishedPostsLoader) {
        publishedPostsLoader.style.display = 'block';
    }

    // localStorage'dan postlarý yükle - Ýki farklý anahtar kontrolü yapýlýyor
    let allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

    // Eðer snk_blog_posts boþ ama eski anahtar snk_blogPosts doluysa, onun içeriðini kullan
    if (allPosts.length === 0) {
        allPosts = JSON.parse(localStorage.getItem('snk_blogPosts') || '[]');

        // Eðer eski anahtardan veri yüklendiyse, yeni anahtara da kaydet
        if (allPosts.length > 0) {
            localStorage.setItem('snk_blog_posts', JSON.stringify(allPosts));
            console.log('Blog yazýlarý yeni anahtara taþýndý: snk_blog_posts');
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
 * Onay bekleyen postlarý yükler ve gösterir
 */
async function loadPendingPosts() {
    try {
        const allPosts = await loadAllPosts();

        // Onay bekleyen yazýlarý filtrele
        const pendingPosts = allPosts.filter(post => post.status === 'pending');

        // Yükleme animasyonunu gizle
        if (pendingPostsLoader) {
            pendingPostsLoader.style.display = 'none';
        }

        // Container'ý temizle
        pendingPostsContainer.innerHTML = '';

        // Eðer onay bekleyen yazý yoksa bilgi mesajý göster
        if (pendingPosts.length === 0) {
            pendingPostsContainer.innerHTML = '<div class="no-data-message">Onay bekleyen yazý bulunmamaktadýr.</div>';
            return;
        }

        // Her bir onay bekleyen yazý için HTML oluþtur
        pendingPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'admin-post-item';
            postElement.setAttribute('data-post-id', post.id);

            // Ýçerik uzunluðunu kontrol et ve düzgün görüntülenecek þekilde ayarla
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
                    <button class="admin-view-full-post">Tüm Ýçeriði Görüntüle</button>
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

        // Ýçerik görüntüleme butonlarýný etkinleþtir
        setupViewContentButtons(pendingPostsContainer);

        // Post onaylama ve reddetme iþlemlerini etkinleþtir
        setupPostApprovalActions();
    } catch (error) {
        console.error('Onay bekleyen yazýlarý yüklerken hata:', error);
        if (pendingPostsContainer) {
            pendingPostsContainer.innerHTML = '<div class="no-data-message">Yazýlarý yüklerken bir hata oluþtu.</div>';
        }
        if (pendingPostsLoader) {
            pendingPostsLoader.style.display = 'none';
        }
    }
}

/**
 * Yayýnda olan postlarý yükler ve gösterir
 */
async function loadPublishedPosts() {
    try {
        const allPosts = await loadAllPosts();

        // Yayýnda olan yazýlarý filtrele (onaylanmýþ olanlar)
        const publishedPosts = allPosts.filter(post => post.status === 'approved' || !post.status);

        // Yükleme animasyonunu gizle
        if (publishedPostsLoader) {
            publishedPostsLoader.style.display = 'none';
        }

        // Container'ý temizle
        publishedPostsContainer.innerHTML = '';

        // Eðer yayýnda olan yazý yoksa bilgi mesajý göster
        if (publishedPosts.length === 0) {
            publishedPostsContainer.innerHTML = '<div class="no-data-message">Yayýnda olan yazý bulunmamaktadýr.</div>';
            return;
        }

        // Her bir yayýnda olan yazý için HTML oluþtur
        publishedPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'admin-post-item';
            postElement.setAttribute('data-post-id', post.id);

            // Ýçerik uzunluðunu kontrol et ve düzgün görüntülenecek þekilde ayarla
            const displayContent = post.content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            postElement.innerHTML = `
                <div class="admin-post-header">
                    <h3 class="admin-post-title">${post.title}</h3>
                    <span class="admin-post-category">Kategori: ${post.category}</span>
                </div>
                <div class="admin-post-meta">
                    <span class="admin-post-author">Yazar: ${post.author}</span>
                    <span class="admin-post-date">Tarih: ${post.date}</span>
                    <span class="admin-post-status">Durum: ${post.status === 'approved' ? 'Onaylanmýþ' : 'Yayýnda'}</span>
                </div>
                ${post.image ? `
                <div class="admin-post-image">
                    <img src="${post.image}" alt="${post.title}" />
                </div>
                ` : ''}
                <div class="admin-post-summary">
                    <p>${post.summary}</p>
                    <button class="admin-view-full-post">Tüm Ýçeriði Görüntüle</button>
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

        // Ýçerik görüntüleme butonlarýný etkinleþtir
        setupViewContentButtons(publishedPostsContainer);

        // Post silme iþlemlerini etkinleþtir
        setupPostDeleteActions();
    } catch (error) {
        console.error('Yayýnda olan yazýlarý yüklerken hata:', error);
        if (publishedPostsContainer) {
            publishedPostsContainer.innerHTML = '<div class="no-data-message">Yazýlarý yüklerken bir hata oluþtu.</div>';
        }
        if (publishedPostsLoader) {
            publishedPostsLoader.style.display = 'none';
        }
    }
}

/**
 * Belirtilen ID'ye sahip yazýyý onaylar
 * @param {string} postId - Onaylanacak yazýnýn ID'si
 */
function approvePost(postId) {
    console.log(`Yazý onaylanýyor: ${postId}`);

    // Onay iþlemi için onay kutusu göster
    if (confirm('Bu yazýyý onaylamak istediðinize emin misiniz?')) {
        // LocalStorage'dan tüm yazýlarý al
        const allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

        // Onaylanacak yazýyý bul
        const postIndex = allPosts.findIndex(post => post.id.toString() === postId.toString());

        if (postIndex !== -1) {
            // Yazýnýn durumunu "approved" olarak güncelle
            allPosts[postIndex].status = 'approved';
            allPosts[postIndex].approvedDate = new Date().toLocaleDateString('tr-TR');

            // LocalStorage'a kaydet
            localStorage.setItem('snk_blog_posts', JSON.stringify(allPosts));

            // Yazýnýn yazarýnýn ID'sini al
            const authorId = allPosts[postIndex].author_id;

            // Yazarýn yazýlarýný da güncelle
            if (authorId) {
                const userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${authorId}`) || '[]');
                const userPostIndex = userPosts.findIndex(post => post.id.toString() === postId.toString());

                if (userPostIndex !== -1) {
                    userPosts[userPostIndex].status = 'approved';
                    userPosts[userPostIndex].approvedDate = allPosts[postIndex].approvedDate;
                    localStorage.setItem(`snk_user_posts_${authorId}`, JSON.stringify(userPosts));
                }
            }

            // Sayfayý yenile
            loadPendingPosts();
            loadPublishedPosts();

            // Baþarý mesajý göster
            alert('Yazý baþarýyla onaylandý!');
        } else {
            alert('Yazý bulunamadý!');
        }
    }
}

/**
 * Belirtilen ID'ye sahip yazýyý reddeder
 * @param {string} postId - Reddedilecek yazýnýn ID'si
 */
function rejectPost(postId) {
    console.log(`Yazý reddediliyor: ${postId}`);

    // Red iþlemi için onay kutusu göster
    if (confirm('Bu yazýyý reddetmek istediðinize emin misiniz?')) {
        // LocalStorage'dan tüm yazýlarý al
        const allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

        // Reddedilecek yazýyý bul
        const postIndex = allPosts.findIndex(post => post.id.toString() === postId.toString());

        if (postIndex !== -1) {
            // Yazýnýn durumunu "rejected" olarak güncelle
            allPosts[postIndex].status = 'rejected';
            allPosts[postIndex].rejectedDate = new Date().toLocaleDateString('tr-TR');

            // LocalStorage'a kaydet
            localStorage.setItem('snk_blog_posts', JSON.stringify(allPosts));

            // Yazýnýn yazarýnýn ID'sini al
            const authorId = allPosts[postIndex].author_id;

            // Yazarýn yazýlarýný da güncelle
            if (authorId) {
                const userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${authorId}`) || '[]');
                const userPostIndex = userPosts.findIndex(post => post.id.toString() === postId.toString());

                if (userPostIndex !== -1) {
                    userPosts[userPostIndex].status = 'rejected';
                    userPosts[userPostIndex].rejectedDate = allPosts[postIndex].rejectedDate;
                    localStorage.setItem(`snk_user_posts_${authorId}`, JSON.stringify(userPosts));
                }
            }

            // Sayfayý yenile
            loadPendingPosts();

            // Bilgi mesajý göster
            alert('Yazý reddedildi!');
        } else {
            alert('Yazý bulunamadý!');
        }
    }
}

/**
 * Belirtilen ID'ye sahip yazýyý siler
 * @param {string} postId - Silinecek yazýnýn ID'si
 */
function deletePost(postId) {
    console.log(`Yazý siliniyor: ${postId}`);

    // Silme iþlemi için onay kutusu göster
    if (confirm('Bu yazýyý silmek istediðinize emin misiniz?')) {
        // LocalStorage'dan tüm yazýlarý al
        const allPosts = JSON.parse(localStorage.getItem('snk_blog_posts') || '[]');

        // Silinecek yazýyý bul
        const postIndex = allPosts.findIndex(post => post.id.toString() === postId.toString());

        if (postIndex !== -1) {
            // Yazýyý listeden kaldýr
            allPosts.splice(postIndex, 1);

            // LocalStorage'a kaydet
            localStorage.setItem('snk_blog_posts', JSON.stringify(allPosts));

            // Yazýnýn yazarýnýn ID'sini al
            const authorId = allPosts[postIndex].author_id;

            // Yazarýn yazýlarýný da güncelle
            if (authorId) {
                const userPosts = JSON.parse(localStorage.getItem(`snk_user_posts_${authorId}`) || '[]');
                const userPostIndex = userPosts.findIndex(post => post.id.toString() === postId.toString());

                if (userPostIndex !== -1) {
                    userPosts.splice(userPostIndex, 1);
                    localStorage.setItem(`snk_user_posts_${authorId}`, JSON.stringify(userPosts));
                }
            }

            // Sayfayý yenile
            loadPublishedPosts();

            // Bilgi mesajý göster
            alert('Yazý silindi!');
        } else {
            alert('Yazý bulunamadý!');
        }
    }
}

// Ýçerik görüntüleme butonlarýný etkinleþtir
function setupViewContentButtons(container) {
    const viewFullButtons = container.querySelectorAll('.admin-view-full-post');

    viewFullButtons.forEach(button => {
        button.addEventListener('click', function () {
            const contentDiv = this.parentNode.nextElementSibling;
            const isVisible = contentDiv.style.display !== 'none';
            contentDiv.style.display = isVisible ? 'none' : 'block';
            this.textContent = isVisible ? 'Tüm Ýçeriði Görüntüle' : 'Ýçeriði Gizle';
        });
    });
}

// Post onaylama ve reddetme iþlemlerini etkinleþtir
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

// Post silme iþlemlerini etkinleþtir
function setupPostDeleteActions() {
    const deleteButtons = document.querySelectorAll('.admin-delete-post');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const postId = this.getAttribute('data-post-id');
            deletePost(postId);
        });
    });
}

// Global eriþim için
window.loadPendingPosts = loadPendingPosts;
window.loadPublishedPosts = loadPublishedPosts;
window.approvePost = approvePost;
window.rejectPost = rejectPost;
window.deletePost = deletePost;
