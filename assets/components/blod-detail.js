// Blog Detail JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Get blog ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (!blogId) {
        showErrorMessage('Blog ID bulunamad�.');
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
    console.log("Blog detaylar� getiriliyor. ID:", blogId);

    // URL'i konsola yazd�r (hata ay�klama i�in)
    console.log("Mevcut sayfa URL'i:", window.location.href);

    try {
        // localStorage'dan blog yaz�lar�n� al
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

        // Test ama�l� t�m blog verilerini konsola yazd�r
        console.log("T�m blog verileri:", allPosts);

        // ID'ye g�re yaz�y� bul
        const post = allPosts.find(p => {
            const postIdInt = parseInt(p.id);
            const targetIdInt = parseInt(blogId);
            return postIdInt === targetIdInt;
        });

        if (post) {
            console.log("Blog yaz�s� bulundu:", post);

            // ��eri�i temizle ve resim yollar�n� d�zelt
            let content = post.content || post.fullContent || post.summary || '��erik bulunamad�';

            // Varsay�lan g�rsel yolu
            let defaultImagePath = '../images/default-blog.jpg';

            // Ana g�sterim resmi
            let featuredImage = `
                <div class="blog-featured-image">
                    <img src="${defaultImagePath}" alt="${post.title || 'Blog G�rseli'}" class="img-fluid">
                </div>
            `;

            // T�m g�rsel bilgilerini konsola yazd�r (debug i�in)
            console.log("Post veri yap�s�ndaki image:", typeof post.image, post.image);

            // Bu k�s�m �imdilik yorum sat�r� olarak kalacak, g�r�nt� sorununu ��zd�kten sonra aktif edebiliriz
            /*
            if (post.image && post.image !== 'undefined' && post.image !== 'null' && post.image.trim() !== '') {
                // Resim yolunu logla
                console.log("Orijinal resim yolu:", post.image);
                
                // G�r�nt� yolunu kontrol et ve d�zelt
                let imagePath = post.image;
                
                // Tam URL kontrol�
                if (imagePath.startsWith('http')) {
                    // HTTP URL'i de�i�tirme (zaten tam URL)
                } else if (imagePath.indexOf('://') !== -1) {
                    // Di�er protokoller de de�i�tirilmemeli
                } else {
                    // Dosya yollar�n� d�zelt
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
                
                // D�zeltilmi� resim yolunu logla
                console.log("D�zeltilen resim yolu:", imagePath);
                
                featuredImage = `
                    <div class="blog-featured-image">
                        <img src="${imagePath}" alt="${post.title}" class="img-fluid" 
                            onerror="this.onerror=null; this.src='${defaultImagePath}'; console.log('Resim y�klenemedi, varsay�lan resim kullan�l�yor');">
                    </div>
                `;
            }
            */

            // Metindeki t�m img etiketlerini bul ve d�zelt
            const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
            let match;
            let newContent = content;

            // ��erikteki her resim etiketini bul
            while (match = imgRegex.exec(content)) {
                const originalSrc = match[1];
                let newSrc = originalSrc;

                // Resim yollar�n� d�zelt
                if (newSrc.startsWith('http')) {
                    // HTTP URL'ini de�i�tirme
                } else if (newSrc.startsWith('./')) {
                    newSrc = newSrc.replace('./', '../');
                } else if (newSrc.startsWith('/')) {
                    newSrc = '..' + newSrc;
                } else if (!newSrc.startsWith('../')) {
                    newSrc = '../' + newSrc;
                }

                // Orijinal img etiketini ve d�zeltilmi� etiketle de�i�tir
                if (originalSrc !== newSrc) {
                    console.log(`Resim yolu d�zeltildi: ${originalSrc} -> ${newSrc}`);
                    const originalImgTag = match[0];
                    const newImgTag = originalImgTag.replace(`src="${originalSrc}"`, `src="${newSrc}"`);
                    newContent = newContent.replace(originalImgTag, newImgTag);
                }
            }

            // D�zeltilmi� i�eri�i kullan
            content = newContent;

            displayBlogDetails({
                title: post.title,
                author: post.author || 'Anonim',
                date: formatDate(post.date) || 'Belirtilmemi�',
                category: getCategoryName(post.category) || 'Genel',
                content: content,
                featuredImage: featuredImage
            });
            document.title = `${post.title} - Senirkent Blog`;
        } else {
            console.error(`ID: ${blogId} olan yaz� bulunamad�`);
            displayErrorMessage("Bu blog yaz�s� bulunamad�.");
        }
    } catch (err) {
        console.error("Blog detaylar� getirilirken hata olu�tu:", err);
        displayErrorMessage("Blog yaz�s� y�klenirken bir hata olu�tu. L�tfen sayfay� yenileyip tekrar deneyin.");
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
        if (isNaN(date.getTime())) return dateString; // Ge�ersiz tarih ise orijinal string'i d�nd�r

        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (e) {
        console.warn("Tarih formatlan�rken hata olu�tu:", e);
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
        'health': 'Sa�l�k',
        'education': 'E�itim',
        'sport': 'Spor',
        'culture': 'K�lt�r',
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
                <a href="../index.html" class="back-button">Ana Sayfaya D�n</a>
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

    // �nce ana g�rseli ekle, sonra i�eri�i
    const contentElement = document.getElementById('blog-content');
    if (contentElement) {
        // Mevcut i�eri�i temizle
        contentElement.innerHTML = '';

        // Ana g�rsel varsa ekle, yoksa varsay�lan g�rseli ekle
        if (blogData.featuredImage) {
            contentElement.innerHTML += blogData.featuredImage;
        } else {
            // Varsay�lan g�rsel ekle
            contentElement.innerHTML += `
                <div class="blog-featured-image">
                    <img src="../public/img/logo.png" alt="Varsay�lan G�rsel" class="img-fluid">
                </div>
            `;
        }

        // ��eri�i ekle
        contentElement.innerHTML += blogData.content;

        // Dark mode uyumlulu�unu kontrol et
        setTimeout(() => {
            if (document.body.classList.contains('dark-mode')) {
                console.log("Dark mode aktif, blog i�eri�i i�in ek dark mode stilleri uygulan�yor");
                // Ek dark mode ayarlamalar� burada yap�labilir
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
                author: 'Ahmet Y�lmaz',
                date: '09.03.2025',
                text: 'Harika bir yaz� olmu�, tebrikler!'
            },
            {
                author: 'Ay�e Demir',
                date: '08.03.2025',
                text: 'Bu konuyla ilgili daha fazla i�erik payla�man�z� rica ediyorum. �ok faydal� oldu.'
            },
            {
                author: 'Mehmet Kaya',
                date: '07.03.2025',
                text: 'Kat�l�yorum, �zellikle son paragrafta bahsetti�iniz nokta �ok �nemli.'
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
        commentsContainer.innerHTML = '<p class="no-comments">Hen�z yorum yap�lmam��. �lk yorumu sen yap!</p>';
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
        showErrorMessage('L�tfen t�m alanlar� doldurun.');
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

        showSuccessMessage('Yorumunuz ba�ar�yla g�nderildi!');
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
