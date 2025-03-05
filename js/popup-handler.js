document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup handler loaded');
    
    // Debug: blogData nesnesini kontrol et
    console.log('blogData mevcut mu?', window.blogData ? 'Evet' : 'Hayır');
    if (window.blogData) {
        console.log('blogData örnek:', window.blogData.blogPosts[0]);
    }
    
    // Popup elementlerini oluştur veya mevcut olanı güncelle
    let blogPopupOverlay = document.querySelector('.blog-popup-overlay');
    
    // Eğer popup overlay yoksa oluştur
    if (!blogPopupOverlay) {
        const popupHTML = `
            <div class="blog-popup-overlay">
                <div class="blog-popup-content">
                    <span class="blog-popup-close">&times;</span>
                    <div class="blog-popup-body">
                        <h2 class="blog-popup-title"></h2>
                        <div class="blog-popup-meta">
                            <span class="blog-popup-author"></span>
                            <span class="blog-popup-date"></span>
                        </div>
                        <div class="blog-popup-tags"></div>
                        <div class="blog-popup-content-text"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        blogPopupOverlay = document.querySelector('.blog-popup-overlay');
    } 
    // Eğer popup overlay varsa ama eski yapıdaysa, yeni yapıya güncelle
    else if (!blogPopupOverlay.querySelector('.blog-popup-title')) {
        // Eski popup içeriğini temizle
        blogPopupOverlay.innerHTML = `
            <div class="blog-popup-content">
                <span class="blog-popup-close">&times;</span>
                <div class="blog-popup-body">
                    <h2 class="blog-popup-title"></h2>
                    <div class="blog-popup-meta">
                        <span class="blog-popup-author"></span>
                        <span class="blog-popup-date"></span>
                    </div>
                    <div class="blog-popup-tags"></div>
                    <div class="blog-popup-content-text"></div>
                </div>
            </div>
        `;
    }

    // Popup elementlerini seç
    const blogPopupTitle = document.querySelector('.blog-popup-title');
    const blogPopupAuthor = document.querySelector('.blog-popup-author');
    const blogPopupDate = document.querySelector('.blog-popup-date');
    const blogPopupTags = document.querySelector('.blog-popup-tags');
    const blogPopupContentText = document.querySelector('.blog-popup-content-text');
    const blogPopupClose = document.querySelector('.blog-popup-close');
    
    // DOM elementlerinin varlığını kontrol et
    if (!blogPopupTitle || !blogPopupAuthor || !blogPopupDate || !blogPopupTags || !blogPopupContentText) {
        console.error('Popup elementleri bulunamadı!', {
            title: blogPopupTitle,
            author: blogPopupAuthor,
            date: blogPopupDate,
            tags: blogPopupTags,
            content: blogPopupContentText
        });
        return; // Elementler bulunamazsa işlemi sonlandır
    }

    // Devamını oku butonlarına tıklama olayı ekle
    const readMoreButtons = document.querySelectorAll('.btn-daha');
    
    if (readMoreButtons.length > 0) {
        console.log('Devamını oku butonları bulundu:', readMoreButtons.length);
        
        readMoreButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault(); // Sayfa yenilenmesini önle
                
                console.log('Devamını oku butonuna tıklandı');
                
                // Post ID'sini al
                const postId = this.getAttribute('data-post-id');
                console.log('Post ID:', postId);
                
                let post = null;
                
                // Önce global blogData'dan post'u bulmaya çalış
                if (window.blogData && window.blogData.blogPosts) {
                    post = window.blogData.blogPosts.find(p => p.id === postId || p.id === parseInt(postId));
                    console.log('Global blogData\'dan post bulundu mu?', post ? 'Evet' : 'Hayır');
                }
                
                // Eğer global blogData'da bulunamadıysa, sayfadaki veri özniteliklerinden al
                if (!post) {
                    const postElement = this.closest('.post-card') || this.closest('.entry-item');
                    if (postElement) {
                        const title = postElement.querySelector('.post-title, .entry-title')?.textContent;
                        const author = postElement.querySelector('.post-author, .meta-item:has(.fa-user)')?.textContent;
                        const date = postElement.querySelector('.post-date, .meta-item:has(.fa-calendar-alt)')?.textContent;
                        const content = postElement.getAttribute('data-content') || 
                                       postElement.querySelector('.entry-content, .entry-summary')?.innerHTML;
                        const tagsStr = postElement.getAttribute('data-tags');
                        const tags = tagsStr ? tagsStr.split(',').map(tag => tag.trim()) : [];
                        
                        post = {
                            title: title,
                            author: author,
                            date: date,
                            content: content,
                            tags: tags
                        };
                        
                        console.log('DOM özniteliklerinden post oluşturuldu');
                    }
                }
                
                // Post bulundu mu kontrol et
                if (post) {
                    try {
                        // Popup içeriğini doldur
                        blogPopupTitle.textContent = post.title || 'Blog Yazısı';
                        blogPopupAuthor.textContent = post.author ? `Yazar: ${post.author}` : '';
                        blogPopupDate.textContent = post.date ? `Tarih: ${post.date}` : '';
                        
                        // Etiketleri ekle
                        if (post.tags && post.tags.length > 0) {
                            blogPopupTags.innerHTML = '';
                            post.tags.forEach(tag => {
                                const tagElement = document.createElement('span');
                                tagElement.classList.add('blog-tag');
                                tagElement.textContent = tag;
                                blogPopupTags.appendChild(tagElement);
                            });
                            blogPopupTags.style.display = 'block';
                        } else {
                            blogPopupTags.style.display = 'none';
                        }
                        
                        // İçeriği ekle
                        if (post.content) {
                            blogPopupContentText.innerHTML = post.content;
                        } else {
                            blogPopupContentText.innerHTML = '<p>İçerik bulunamadı.</p>';
                        }
                        
                        // Popup'ı göster
                        blogPopupOverlay.classList.add('active');
                        document.body.style.overflow = 'hidden'; // Scroll'u devre dışı bırak
                        
                        console.log('Popup gösterildi');
                    } catch (error) {
                        console.error('Popup içeriği doldurulurken hata oluştu:', error);
                    }
                } else {
                    console.error('Post bulunamadı, ID:', postId);
                }
            });
        });
    } else {
        console.warn('Devamını oku butonları bulunamadı');
    }

    // Popup'ı kapatma işlevi
    if (blogPopupClose) {
        blogPopupClose.addEventListener('click', function() {
            closePopup();
        });
    }
    
    // Overlay'e tıklama ile kapatma
    if (blogPopupOverlay) {
        blogPopupOverlay.addEventListener('click', function(event) {
            // Sadece overlay'e tıklandığında kapat (içeriğe tıklandığında değil)
            if (event.target === blogPopupOverlay) {
                closePopup();
            }
        });
    }
    
    // ESC tuşu ile kapatma
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && blogPopupOverlay && blogPopupOverlay.classList.contains('active')) {
            closePopup();
        }
    });
    
    // Popup'ı kapatma fonksiyonu
    function closePopup() {
        if (blogPopupOverlay) {
            blogPopupOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Scroll'u tekrar etkinleştir
            console.log('Popup kapatıldı');
        }
    }
});
