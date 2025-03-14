/**
 * Yorum Sistemi JavaScript Dosyası
 */
document.addEventListener('DOMContentLoaded', function() {
    // Yorum bölümüne git butonu
    const openCommentBtn = document.getElementById('openCommentBtn');
    const commentSection = document.querySelector('.blog-comments-section');
    
    if (openCommentBtn && commentSection) {
        openCommentBtn.addEventListener('click', function() {
            commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Yorum alanını vurgula
            if (document.getElementById('txtCommentText')) {
                setTimeout(() => {
                    document.getElementById('txtCommentText').focus();
                }, 800);
            }
        });
    }
    
    // Yorum beğenme işlemi
    const commentLikeButtons = document.querySelectorAll('.like-comment');
    
    commentLikeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Beğeni butonunun görsel durumunu değiştir
            this.classList.toggle('active');
            
            // Beğeni sayısını client-side olarak güncelleme
            // Bu sadece görsel bir değişiklik, asıl değer postback sırasında server-side güncellenecek
            const likeCountElement = this.querySelector('span');
            
            if (likeCountElement) {
                let currentCount = parseInt(likeCountElement.innerText);
                
                if (this.classList.contains('active')) {
                    likeCountElement.innerText = currentCount + 1;
                } else {
                    if (currentCount > 0) {
                        likeCountElement.innerText = currentCount - 1;
                    }
                }
            }
        });
    });
    
    // Yorum cevaplama formları
    setupReplyForms();
    
    // Yorum silme işlemi
    setupDeleteComments();
});

/**
 * Yorum cevaplama formlarını ayarlar
 */
function setupReplyForms() {
    // Cevapla butonları
    const replyButtons = document.querySelectorAll('.reply-comment');
    const existingForms = document.querySelectorAll('.reply-form');
    
    // Varolan formları temizle
    existingForms.forEach(form => form.remove());
    
    replyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Aktif cevap formunu kapat
            const activeForm = document.querySelector('.reply-form');
            if (activeForm) {
                activeForm.remove();
            }
            
            // Yeni cevap formu oluştur
            const commentItem = this.closest('.comment-item');
            const commentId = this.getAttribute('data-comment-id') || this.getAttribute('commandargument');
            
            // Form zaten açıksa kapat
            if (commentItem.querySelector('.reply-form')) {
                commentItem.querySelector('.reply-form').remove();
                return;
            }
            
            // Cevap formunu oluştur
            const replyForm = document.createElement('div');
            replyForm.className = 'reply-form';
            replyForm.innerHTML = `
                <textarea class="reply-input" placeholder="Yorumunuzu yazın..."></textarea>
                <div class="reply-form-actions">
                    <button type="button" class="cancel-reply-btn">İptal</button>
                    <button type="button" class="reply-btn" data-parent-id="${commentId}">Cevapla</button>
                </div>
            `;
            
            // Cevap formunu ekle
            commentItem.appendChild(replyForm);
            
            // Textarea'ya focus
            replyForm.querySelector('.reply-input').focus();
            
            // Cevaplama fonksiyonları
            const cancelBtn = replyForm.querySelector('.cancel-reply-btn');
            const submitBtn = replyForm.querySelector('.reply-btn');
            
            cancelBtn.addEventListener('click', function() {
                replyForm.remove();
            });
            
            submitBtn.addEventListener('click', function() {
                const replyText = replyForm.querySelector('.reply-input').value.trim();
                const parentId = this.getAttribute('data-parent-id');
                
                if (replyText) {
                    // Burada normalde ASP.NET postback işlemi olacak
                    // Şimdilik client-side görsel bir yanıt ekliyoruz
                    
                    // Kullanıcı login değilse login sayfasına yönlendir
                    if (!isUserLoggedIn()) {
                        window.location.href = 'Login.aspx';
                        return;
                    }
                    
                    // Yeni yorum oluştur
                    createTemporaryReply(commentItem, replyText);
                    
                    // Formu kapat
                    replyForm.remove();
                }
            });
        });
    });
}

/**
 * Geçici bir cevap yorumu oluşturur (sadece görsel)
 */
function createTemporaryReply(parentComment, replyText) {
    // Cevap için geçici bir DOM yapısı oluştur
    const tempReply = document.createElement('div');
    tempReply.className = 'nested-comments';
    tempReply.innerHTML = `
        <div class="comment-item nested-comment-item">
            <div class="comment-avatar">
                <img src="Images/avatars/default.jpg" alt="Kullanıcı Avatarı">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <h4 class="comment-author">Siz</h4>
                    <span class="comment-date">Şimdi</span>
                </div>
                <p class="comment-text">${replyText}</p>
                <div class="comment-actions">
                    <a href="#" class="comment-action like-comment">
                        <i class="far fa-heart"></i> <span>0</span>
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Yoruma ekle
    parentComment.appendChild(tempReply);
    
    // Yeni yoruma kaydır
    tempReply.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Yorum sayacını güncelle
    updateCommentCounter(1);
}

/**
 * Yorum silme işlemlerini ayarlar
 */
function setupDeleteComments() {
    const deleteButtons = document.querySelectorAll('.delete-comment');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
                e.preventDefault();
            }
        });
    });
}

/**
 * Yorum sayısını günceller
 */
function updateCommentCounter(change) {
    const commentCounter = document.getElementById('commentCount');
    
    if (commentCounter) {
        let currentCount = parseInt(commentCounter.innerText);
        commentCounter.innerText = currentCount + change;
    }
}

/**
 * Kullanıcının giriş yapmış olup olmadığını kontrol eder
 */
function isUserLoggedIn() {
    // Bu sadece bir test fonksiyonu, gerçek uygulamada bu bilgi server-side'dan gelecek
    // Login paneli görünüyor mu kontrol et
    return !document.getElementById('pnlLoginToComment') || 
           document.getElementById('pnlLoginToComment').style.display === 'none';
}
