document.addEventListener('DOMContentLoaded', function() {
    // DOM elementlerini seç
    const categoryItems = document.querySelectorAll('.category-item');
    const blogPostsGrid = document.querySelector('.posts-grid');
    const categoryInfo = document.querySelector('.section-header .category-info');
    const popupOverlay = document.querySelector('.blog-popup-overlay');
    const popupContent = document.querySelector('.blog-popup-content');
    const popupCloseBtn = document.querySelector('.blog-popup-close');

    // Blog yazılarını yükle ve göster
    async function loadBlogPosts(category = null) {
        try {
            const response = await fetch('senirkenblog/blogPosts.json');
            const data = await response.json();
            
            // Kategori sayılarını güncelle
            updatePostCounts(data);
            
            // Seçili kategoriye göre yazıları filtrele
            const filteredPosts = category 
                ? data.blogPosts.filter(post => post.tags.includes(category))
                : data.blogPosts;
                
            // Yazıları göster
            displayPosts(filteredPosts, category);
        } catch (error) {
            console.error('Blog yazıları yüklenirken hata:', error);
            if (blogPostsGrid) {
                blogPostsGrid.innerHTML = '<p>Blog yazıları yüklenirken bir hata oluştu.</p>';
            }
        }
    }

    // Kategori başına düşen yazı sayısını güncelle
    function updatePostCounts(data) {
        const categories = {};
        data.blogPosts.forEach(post => {
            post.tags.forEach(tag => {
                categories[tag] = (categories[tag] || 0) + 1;
            });
        });

        categoryItems.forEach(item => {
            const category = item.dataset.category;
            const count = categories[category] || 0;
            const countElement = item.querySelector('.post-count');
            if (countElement) {
                countElement.textContent = `${count} Yazı`;
            }
        });
    }

    // Blog yazılarını görüntüle
    function displayPosts(posts, category) {
        if (!blogPostsGrid) return;

        // Kategori başlığını güncelle
        if (categoryInfo) {
            categoryInfo.textContent = category || 'Tüm Kategoriler';
        }
        
        // Blog grid'ini temizle
        blogPostsGrid.innerHTML = '';

        // Eğer yazı yoksa mesaj göster
        if (posts.length === 0) {
            blogPostsGrid.innerHTML = `
                <div class="no-posts">
                    <i class="fas fa-inbox"></i>
                    <p>Bu kategoride henüz blog yazısı bulunmuyor.</p>
                </div>
            `;
            return;
        }

        // Her yazı için kart oluştur
        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'blog-post-card';
            postElement.innerHTML = `
                <div class="post-meta">
                    <span class="post-date"><i class="far fa-calendar-alt"></i> ${post.date}</span>
                    <span class="post-author"><i class="far fa-user"></i> ${post.author}</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-preview">${post.preview}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button class="blog-open-btn" data-post-id="${post.id}">
                    <i class="fas fa-book-open"></i> Yazıyı Oku
                </button>
            `;

            // Yazıyı oku butonuna tıklama olayı ekle
            const openBtn = postElement.querySelector('.blog-open-btn');
            if (openBtn) {
                openBtn.addEventListener('click', () => showBlogPopup(post.id));
            }

            blogPostsGrid.appendChild(postElement);
        });
    }

    // Blog popup'ını göster
    async function showBlogPopup(postId) {
        if (!popupOverlay || !popupContent) return;

        try {
            const response = await fetch('senirkenblog/blogPosts.json');
            const data = await response.json();
            
            // ID'ye göre yazıyı bul
            const post = data.blogPosts.find(p => p.id === postId);
            
            if (post) {
                // Popup içeriğini oluştur
                popupContent.innerHTML = `
                    <article class="blog-post-full">
                        <h2>${post.title}</h2>
                        <div class="post-meta">
                            <span class="post-date">
                                <i class="far fa-calendar-alt"></i> ${post.date}
                            </span>
                            <span class="post-author">
                                <i class="far fa-user"></i> ${post.author}
                            </span>
                        </div>
                        <div class="post-content">${post.content}</div>
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </article>
                `;
                
                // Popup'ı göster
                popupOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } catch (error) {
            console.error('Blog yazısı yüklenirken hata:', error);
            alert('Blog yazısı yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }

    // Popup'ı kapat
    function closePopup() {
        if (popupOverlay) {
            popupOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Kategori tıklama olaylarını ekle
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.dataset.category;
            categoryItems.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            loadBlogPosts(category);

            // Mobil görünümde yazılara kaydır
            if (window.innerWidth <= 768) {
                const blogPostsSection = document.querySelector('.blog-posts-section');
                if (blogPostsSection) {
                    blogPostsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Popup kapatma olaylarını ekle
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', closePopup);
    }
    
    if (popupOverlay) {
        popupOverlay.addEventListener('click', e => {
            if (e.target === popupOverlay) closePopup();
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && popupOverlay && popupOverlay.classList.contains('active')) {
            closePopup();
        }
    });

    // Sayfa yüklendiğinde tüm yazıları göster
    loadBlogPosts();

    // Sendeyaz sayfası için fonksiyonlar
    function initSendeyazPage() {
        const formContainer = document.getElementById("form-container");
        const submitBtn = document.getElementById("submit-btn");
        const futuristicInputs = document.querySelectorAll('.futuristic-input');
        
        if (formContainer) {
            // Sayfa yüklendiğinde form containerını göster
            setTimeout(() => {
                formContainer.classList.add("show");
            }, 300);
        }
        
        if (submitBtn) {
            // Gönder butonuna tıklandığında animasyon efekti
            submitBtn.addEventListener("click", function (e) {
                e.preventDefault();
                
                // Form doğrulama
                const inputs = formContainer.querySelectorAll('.futuristic-input');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.boxShadow = 'inset 0 0 0 1px #ef4444, 0 0 10px rgba(239, 68, 68, 0.3)';
                        setTimeout(() => {
                            input.style.boxShadow = '';
                        }, 2000);
                    }
                });
                
                if (!isValid) {
                    showFormMessage('Lütfen tüm alanları doldurun', 'error');
                    return;
                }
                
                // Buton animasyonu
                this.classList.add('clicked');
                
                // Gönderme efekti
                const buttonIcon = this.querySelector('.button-icon i');
                buttonIcon.className = 'fas fa-circle-notch fa-spin';
                
                setTimeout(() => {
                    buttonIcon.className = 'fas fa-check';
                    this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    
                    setTimeout(() => {
                        // Form gönderme işlemi burada yapılabilir
                        // Örnek: formVerileriniGonder();
                        
                        // Formu sıfırla
                        inputs.forEach(input => {
                            input.value = '';
                        });
                        
                        buttonIcon.className = 'fas fa-paper-plane';
                        this.style.background = '';
                        this.classList.remove('clicked');
                        
                        // Başarı mesajı gösterme
                        showFormMessage('Yazınız başarıyla gönderildi!', 'success');
                    }, 1500);
                }, 1500);
            });
        }
        
        // Input focus efektleri
        if (futuristicInputs) {
            futuristicInputs.forEach(input => {
                // Focus olduğunda
                input.addEventListener('focus', function() {
                    const container = this.closest('.input-container');
                    const icon = container.querySelector('i');
                    const border = container.querySelector('.focus-border');
                    
                    icon.style.color = 'var(--primary-color)';
                    border.style.transform = 'scaleX(1)';
                });
                
                // Focus kaybedildiğinde
                input.addEventListener('blur', function() {
                    const container = this.closest('.input-container');
                    const icon = container.querySelector('i');
                    const border = container.querySelector('.focus-border');
                    
                    if (!this.value) {
                        icon.style.color = 'rgba(255, 255, 255, 0.5)';
                    }
                    border.style.transform = 'scaleX(0)';
                });
            });
        }
    }

    // Form mesajı gösterme fonksiyonu
    function showFormMessage(message, type = 'info') {
        // Eğer zaten bir mesaj varsa kaldır
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Yeni mesaj oluştur
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Mesajı forma ekle
        document.body.appendChild(messageElement);
        
        // Mesajı göster
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        // Belirli bir süre sonra mesajı kaldır
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 5000);
    }

    initSendeyazPage();
});
