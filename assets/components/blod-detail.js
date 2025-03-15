// Blog Detail JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Get blog ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (!blogId) {
        showErrorMessage('Blog ID bulunamadý.');
        return;
    }

    // Fetch blog details
    fetchBlogDetails(blogId);
    fetchBlogComments(blogId);

    // Set up comment form
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitComment(blogId);
        });
    }
});

/**
 * Fetch blog details from the server
 * @param {string} blogId - The ID of the blog post
 */
function fetchBlogDetails(blogId) {
    console.log("Blog detaylarý getiriliyor. ID:", blogId);

    // URL'i konsola yazdýr (hata ayýklama için)
    console.log("Mevcut sayfa URL'i:", window.location.href);

    try {
        // localStorage'dan blog yazýlarýný al
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

        // Test amaçlý tüm blog verilerini konsola yazdýr
        console.log("Tüm blog verileri:", allPosts);

        // ID'ye göre yazýyý bul
        const post = allPosts.find(p => {
            const postIdInt = parseInt(p.id);
            const targetIdInt = parseInt(blogId);
            return postIdInt === targetIdInt;
        });

        if (post) {
            console.log("Blog yazýsý bulundu:", post);

            // Ýçeriði temizle ve resim yollarýný düzelt
            let content = post.content || post.fullContent || post.summary || 'Ýçerik bulunamadý';

            // Varsayýlan görsel yolu
            let defaultImagePath = '../images/default-blog.jpg';

            // Ana gösterim resmi
            let featuredImage = `
                <div class="blog-featured-image">
                    <img src="${defaultImagePath}" alt="${post.title || 'Blog Görseli'}" class="img-fluid">
                </div>
            `;

            // Tüm görsel bilgilerini konsola yazdýr (debug için)
            console.log("Post veri yapýsýndaki image:", typeof post.image, post.image);

            // Bu kýsým þimdilik yorum satýrý olarak kalacak, görüntü sorununu çözdükten sonra aktif edebiliriz
            /*
            if (post.image && post.image !== 'undefined' && post.image !== 'null' && post.image.trim() !== '') {
                // Resim yolunu logla
                console.log("Orijinal resim yolu:", post.image);
                
                // Görüntü yolunu kontrol et ve düzelt
                let imagePath = post.image;
                
                // Tam URL kontrolü
                if (imagePath.startsWith('http')) {
                    // HTTP URL'i deðiþtirme (zaten tam URL)
                } else if (imagePath.indexOf('://') !== -1) {
                    // Diðer protokoller de deðiþtirilmemeli
                } else {
                    // Dosya yollarýný düzelt
                    if (imagePath.startsWith('./')) {
                        // ./images/foo.jpg -> ../images/foo.jpg
                        imagePath = imagePath.replace('./', '../');
                    } else if (imagePath.startsWith('/')) {
                        // /images/foo.jpg -> ../images/foo.jpg
                        imagePath = '..' + imagePath;
                    } else if (!imagePath.startsWith('../')) {
                        // images/foo.jpg -> ../images/foo.jpg
                        imagePath = '../' + imagePath;
                    }
                }
                
                // Düzeltilmiþ resim yolunu logla
                console.log("Düzeltilen resim yolu:", imagePath);
                
                featuredImage = `
                    <div class="blog-featured-image">
                        <img src="${imagePath}" alt="${post.title}" class="img-fluid" 
                            onerror="this.onerror=null; this.src='${defaultImagePath}'; console.log('Resim yüklenemedi, varsayýlan resim kullanýlýyor');">
                    </div>
                `;
            }
            */

            // Metindeki tüm img etiketlerini bul ve düzelt
            const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
            let match;
            let newContent = content;

            // Ýçerikteki her resim etiketini bul
            while (match = imgRegex.exec(content)) {
                const originalSrc = match[1];
                let newSrc = originalSrc;

                // Resim yollarýný düzelt
                if (newSrc.startsWith('http')) {
                    // HTTP URL'ini deðiþtirme
                } else if (newSrc.startsWith('./')) {
                    newSrc = newSrc.replace('./', '../');
                } else if (newSrc.startsWith('/')) {
                    newSrc = '..' + newSrc;
                } else if (!newSrc.startsWith('../')) {
                    newSrc = '../' + newSrc;
                }

                // Orijinal img etiketini ve düzeltilmiþ etiketle deðiþtir
                if (originalSrc !== newSrc) {
                    console.log(`Resim yolu düzeltildi: ${originalSrc} -> ${newSrc}`);
                    const originalImgTag = match[0];
                    const newImgTag = originalImgTag.replace(`src="${originalSrc}"`, `src="${newSrc}"`);
                    newContent = newContent.replace(originalImgTag, newImgTag);
                }
            }

            // Düzeltilmiþ içeriði kullan
            content = newContent;

            displayBlogDetails({
                title: post.title,
                author: post.author || 'Anonim',
                date: formatDate(post.date) || 'Belirtilmemiþ',
                category: getCategoryName(post.category) || 'Genel',
                content: content,
                featuredImage: featuredImage
            });
            document.title = `${post.title} - Senirkent Blog`;
        } else {
            console.error(`ID: ${blogId} olan yazý bulunamadý`);
            displayErrorMessage("Bu blog yazýsý bulunamadý.");
        }
    } catch (err) {
        console.error("Blog detaylarý getirilirken hata oluþtu:", err);
        displayErrorMessage("Blog yazýsý yüklenirken bir hata oluþtu. Lütfen sayfayý yenileyip tekrar deneyin.");
    }
}

/**
 * Format a date string
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Geçersiz tarih ise orijinal string'i döndür

        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (e) {
        console.warn("Tarih formatlanýrken hata oluþtu:", e);
        return dateString;
    }
}

/**
 * Get category name from category key
 * @param {string} categoryKey - The category key
 * @returns {string} Category name
 */
function getCategoryName(categoryKey) {
    const categories = {
        'technology': 'Teknoloji',
        'science': 'Bilim',
        'health': 'Saðlýk',
        'education': 'Eðitim',
        'sport': 'Spor',
        'culture': 'Kültür',
        'art': 'Sanat',
        'travel': 'Seyahat',
        'food': 'Yemek',
        'literature': 'Edebiyat'
    };

    return categories[categoryKey] || categoryKey || 'Genel';
}

/**
 * Display error message in the blog content area
 * @param {string} message - The error message to display
 */
function displayErrorMessage(message) {
    const blogContentEl = document.getElementById('blog-content');
    if (blogContentEl) {
        blogContentEl.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <a href="../index.html" class="back-button">Ana Sayfaya Dön</a>
            </div>
        `;
    }

    // Hide comments section
    const commentsSection = document.querySelector('.blog-comments-section');
    if (commentsSection) {
        commentsSection.style.display = 'none';
    }

    // Update title
    document.getElementById('blog-title').textContent = 'Hata';
    document.getElementById('blog-author').textContent = '-';
    document.getElementById('blog-date').textContent = '-';
    document.getElementById('blog-category').textContent = '-';
}

/**
 * Display blog details in the DOM
 * @param {Object} blogData - The blog data to display
 */
function displayBlogDetails(blogData) {
    document.getElementById('blog-title').textContent = blogData.title;
    document.getElementById('blog-author').textContent = blogData.author;
    document.getElementById('blog-date').textContent = blogData.date;
    document.getElementById('blog-category').textContent = blogData.category;

    // Önce ana görseli ekle, sonra içeriði
    const contentElement = document.getElementById('blog-content');
    if (contentElement) {
        // Mevcut içeriði temizle
        contentElement.innerHTML = '';

        // Ana görsel varsa ekle, yoksa varsayýlan görseli ekle
        if (blogData.featuredImage) {
            contentElement.innerHTML += blogData.featuredImage;
        } else {
            // Varsayýlan görsel ekle
            contentElement.innerHTML += `
                <div class="blog-featured-image">
                    <img src="../public/img/logo.png" alt="Varsayýlan Görsel" class="img-fluid">
                </div>
            `;
        }

        // Ýçeriði ekle
        contentElement.innerHTML += blogData.content;

        // Dark mode uyumluluðunu kontrol et
        setTimeout(() => {
            if (document.body.classList.contains('dark-mode')) {
                console.log("Dark mode aktif, blog içeriði için ek dark mode stilleri uygulanýyor");
                // Ek dark mode ayarlamalarý burada yapýlabilir
            }
        }, 100);
    }
}

/**
 * Fetch comments for the blog
 * @param {string} blogId - The ID of the blog post
 */
function fetchBlogComments(blogId) {
    // This would normally be an API call, simplified for this example
    // Example: fetch(`/api/blogs/${blogId}/comments`)

    // Simulate data for now
    setTimeout(() => {
        const commentsData = [
            {
                author: 'Ahmet Yýlmaz',
                date: '09.03.2025',
                text: 'Harika bir yazý olmuþ, tebrikler!'
            },
            {
                author: 'Ayþe Demir',
                date: '08.03.2025',
                text: 'Bu konuyla ilgili daha fazla içerik paylaþmanýzý rica ediyorum. Çok faydalý oldu.'
            },
            {
                author: 'Mehmet Kaya',
                date: '07.03.2025',
                text: 'Katýlýyorum, özellikle son paragrafta bahsettiðiniz nokta çok önemli.'
            }
        ];

        displayComments(commentsData);
    }, 500);
}

/**
 * Display comments in the DOM
 * @param {Array} commentsData - The comments data to display
 */
function displayComments(commentsData) {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';

    if (commentsData.length === 0) {
        commentsContainer.innerHTML = '<p class="no-comments">Henüz yorum yapýlmamýþ. Ýlk yorumu sen yap!</p>';
        return;
    }

    commentsData.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

/**
 * Submit a new comment
 * @param {string} blogId - The ID of the blog post
 */
function submitComment(blogId) {
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text) {
        showErrorMessage('Lütfen tüm alanlarý doldurun.');
        return;
    }

    // This would normally be an API call, simplified for this example
    // Example: fetch(`/api/blogs/${blogId}/comments`, { method: 'POST', body: ... })

    // Simulate successful comment submission
    setTimeout(() => {
        // Add new comment to the comments container
        const commentsContainer = document.getElementById('comments-container');
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item new-comment';

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;

        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${name}</span>
                <span class="comment-date">${formattedDate}</span>
            </div>
            <div class="comment-text">${text}</div>
        `;

        commentsContainer.prepend(commentElement);

        // Clear form inputs
        nameInput.value = '';
        textInput.value = '';

        showSuccessMessage('Yorumunuz baþarýyla gönderildi!');
    }, 300);
}

/**
 * Show an error message
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
    // Implementation depends on the site's notification system
    // This is a simplified version
    alert(message);
}

/**
 * Show a success message
 * @param {string} message - The success message to display
 */
function showSuccessMessage(message) {
    // Implementation depends on the site's notification system
    // This is a simplified version
    alert(message);

    // If the site has a notification system, use that instead
    // Example:
    // const notificationElement = document.createElement('div');
    // notificationElement.className = 'snk-notification success';
    // notificationElement.textContent = message;
    // document.body.appendChild(notificationElement);
    // setTimeout(() => notificationElement.remove(), 3000);
}
