/**
 * Yorum Sistemi JavaScript Dosyas� - Mod�ler Yap�da
 */

// Yorum sistemini kaps�lleme - Global alan� kirletmemek i�in
const SNK_CommentSystem = (function () {
    // �zel de�i�kenler
    const STORAGE_KEY = 'snk_comments_data';
    let activePostId = null;

    // DOM elementlerini se�me
    function getDOMElements() {
        return {
            commentModal: document.getElementById('commentModal'),
            commentsList: document.getElementById('commentsList'),
            commentText: document.getElementById('commentText'),
            noCommentsMessage: document.getElementById('noCommentsMessage'),
            submitButton: document.getElementById('submitComment'),
            cancelButton: document.getElementById('cancelComment'),
            closeButton: document.getElementById('closeCommentModal')
        };
    }

    // Modal HTML'ini olu�tur
    function createCommentModalHTML() {
        return `
        <div class="snk-comment-overlay" id="commentModal">
            <div class="snk-comment-container">
                <div class="snk-comment-header">
                    <div class="snk-comment-title">
                        <i class="fas fa-comments"></i> Yorumlar
                    </div>
                    <button class="snk-comment-close" id="closeCommentModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="snk-comment-form">
                    <div class="snk-comment-form-group">
                        <textarea class="snk-comment-textarea" id="commentText" placeholder="D���ncelerinizi payla��n..."></textarea>
                    </div>
                    <div class="snk-comment-button-group">
                        <button class="snk-comment-button snk-comment-cancel" id="cancelComment">�ptal</button>
                        <button class="snk-comment-button snk-comment-submit" id="submitComment">
                            <i class="fas fa-paper-plane"></i> Yorum G�nder
                        </button>
                    </div>
                </div>
                
                <div class="snk-comments-list" id="commentsList">
                    <!-- Yorumlar JavaScript ile buraya eklenecek -->
                    <div class="snk-comment-empty" id="noCommentsMessage">
                        <div class="snk-comment-empty-icon">
                            <i class="far fa-comment-dots"></i>
                        </div>
                        <div class="snk-comment-empty-text">
                            Hen�z yorum yok. �lk yorumu siz yap�n!
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // Yorum modal penceresini body'ye ekle
    function appendModalToBody() {
        // Modal HTML'i daha �nce eklenmi� mi kontrol et
        if (!document.getElementById('commentModal')) {
            document.body.insertAdjacentHTML('beforeend', createCommentModalHTML());
            setupModalEvents();
        }
    }

    // Modal olaylar�n� ayarla
    function setupModalEvents() {
        const elements = getDOMElements();

        // Kapatma butonu
        if (elements.closeButton) {
            elements.closeButton.addEventListener('click', closeModal);
        }

        // �ptal butonu
        if (elements.cancelButton) {
            elements.cancelButton.addEventListener('click', closeModal);
        }

        // G�nder butonu
        if (elements.submitButton) {
            elements.submitButton.addEventListener('click', submitNewComment);
        }

        // Modal d���na t�klama
        const modal = elements.commentModal;
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === this) {
                    closeModal();
                }
            });
        }
    }

    // Yorum sistemi butonlar�na olaylar� ekle
    function setupCommentButtons() {
        // Yorum butonlar�
        const commentButtons = document.querySelectorAll('.snk-comment-button');
        commentButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const postId = this.getAttribute('data-post-id');
                openModal(postId);
            });
        });

        // Be�en butonlar�
        const likeButtons = document.querySelectorAll('.snk-like-button');
        likeButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                toggleLike(this);
            });
        });

        // Payla� butonlar�
        const shareButtons = document.querySelectorAll('.snk-share-button');
        shareButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const postId = this.getAttribute('data-post-id');
                sharePost(postId, e);
            });
        });
    }

    // Modal penceresini a�
    function openModal(postId) {
        // Kullan�c� kontrol�
        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert('Yorum yapmak i�in giri� yapmal�s�n�z!');
            return;
        }

        // Aktif post ID'sini ayarla
        activePostId = postId;

        // Yorum alan�n� temizle
        const elements = getDOMElements();
        if (elements.commentText) {
            elements.commentText.value = '';
        }

        // Yorumlar� y�kle
        loadComments(postId);

        // Modal'� g�ster
        if (elements.commentModal) {
            elements.commentModal.classList.add('active');
        }
    }

    // Modal penceresini kapat
    function closeModal() {
        const modal = getDOMElements().commentModal;
        if (modal) {
            modal.classList.remove('active');
            // Aktif post ID'sini s�f�rla
            activePostId = null;
        }
    }

    // Yorum g�nderme
    function submitNewComment() {
        // Aktif post kontrol�
        if (!activePostId) {
            console.error('Aktif post ID bulunamad�');
            return;
        }

        // Kullan�c� kontrol�
        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert('Yorum yapmak i�in giri� yapmal�s�n�z!');
            return;
        }

        // Yorum metni kontrol�
        const elements = getDOMElements();
        const commentText = elements.commentText;

        if (!commentText || !commentText.value.trim()) {
            alert('L�tfen bir yorum yaz�n');
            return;
        }

        // Yorum objesi
        const comment = {
            id: 'comment_' + Date.now(),
            postId: activePostId,
            text: commentText.value.trim(),
            userId: currentUser.id || currentUser.username || 'anonymous',
            userName: currentUser.name || currentUser.username || 'Kullan�c�',
            date: new Date().toISOString()
        };

        // Yan�t verme kontrol�
        if (commentText.dataset.replyTo) {
            comment.replyTo = commentText.dataset.replyTo;
            comment.replyToUserName = commentText.dataset.replyToUsername;
        }

        // Yorumu kaydet
        saveComment(comment);

        // Alan� temizle
        commentText.value = '';

        // Yan�t verme bilgilerini temizle
        cancelReply();

        // Yorumlar� yeniden y�kle
        loadComments(activePostId);

        // Ba�ar�l� bildirim g�ster
        showNotification('Yorumunuz ba�ar�yla eklendi!');
    }

    // Bildirim g�sterme
    function showNotification(message) {
        // Mevcut bildirim varsa kald�r
        const existingNotification = document.querySelector('.snk-comment-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Yeni bildirim olu�tur
        const notification = document.createElement('div');
        notification.className = 'snk-comment-notification';
        notification.innerHTML = `
            <div class="snk-comment-notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;

        // Bildirimi body'ye ekle
        document.body.appendChild(notification);

        // Animasyon i�in s�n�f ekle
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // 3 saniye sonra bildirimi kald�r
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Yorumlar� y�kleme
    function loadComments(postId) {
        if (!postId) {
            console.error("loadComments: Post ID bulunamad�!", postId);
            return;
        }

        console.log("Yorumlar y�kleniyor. Post ID:", postId);

        // T�m yorumlar� al
        const allComments = getAllComments();
        console.log("Sistemdeki t�m yorumlar:", allComments);

        // �lgili post yorumlar�n� filtrele
        const comments = allComments.filter(comment => comment.postId === postId);
        console.log("Bu blog yaz�s�n�n yorumlar�:", comments);

        // Yorumlar� g�ster
        displayComments(comments);
    }

    // Yorumlar� g�r�nt�leme
    function displayComments(comments) {
        const elements = getDOMElements();
        const commentsList = elements.commentsList;
        const noCommentsMessage = elements.noCommentsMessage;

        if (!commentsList) return;

        // Mevcut yorumlar� temizle
        const existingComments = commentsList.querySelectorAll('.snk-comment-item');
        existingComments.forEach(comment => comment.remove());

        // Yorum yoksa mesaj� g�ster
        if (comments.length === 0) {
            if (noCommentsMessage) {
                noCommentsMessage.style.display = 'flex';
            }
            return;
        }

        // Yorum varsa mesaj� gizle
        if (noCommentsMessage) {
            noCommentsMessage.style.display = 'none';
        }

        // Yorumlar� tarihe g�re s�rala (en yeni �stte)
        comments.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Yorumlar� ekle
        const currentUser = getCurrentUser();
        const currentUserId = currentUser ? (currentUser.id || currentUser.username) : null;

        comments.forEach(comment => {
            // Avatar i�in ilk harf
            const firstLetter = comment.userName.charAt(0).toUpperCase();

            // Tarihi formatla
            const dateObj = new Date(comment.date);
            const formattedDate = `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()} ${dateObj.getHours()}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

            // Yan�t i�eri�i
            const replyContent = comment.replyTo ? `
                <div class="snk-comment-reply-to">
                    <i class="fas fa-reply"></i> 
                    <span>${comment.replyToUserName || 'Kullan�c�'}</span>'a yan�t:
                </div>` : '';

            // Yorum HTML
            const commentHTML = `
            <div class="snk-comment-item" data-comment-id="${comment.id}">
                <div class="snk-comment-user">
                    <div class="snk-comment-avatar">${firstLetter}</div>
                    <span class="snk-comment-username">${comment.userName}</span>
                    <span class="snk-comment-date">${formattedDate}</span>
                </div>
                ${replyContent}
                <div class="snk-comment-text">${comment.text}</div>
                <div class="snk-comment-actions">
                    <button class="snk-comment-action-btn snk-comment-like">
                        <i class="far fa-heart"></i> Be�en
                    </button>
                    <button class="snk-comment-action-btn snk-comment-reply" data-comment-id="${comment.id}" data-username="${comment.userName}">
                        <i class="far fa-comment"></i> Yan�tla
                    </button>
                    ${(currentUserId && currentUserId === comment.userId) ?
                    `<button class="snk-comment-action-btn snk-comment-delete" data-comment-id="${comment.id}">
                        <i class="far fa-trash-alt"></i> Sil
                    </button>` : ''}
                </div>
            </div>
            `;

            // Yorumu listeye ekle
            commentsList.insertAdjacentHTML('beforeend', commentHTML);
        });

        // Yorum silme butonlar�na olay ekle
        const deleteButtons = commentsList.querySelectorAll('.snk-comment-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function () {
                const commentId = this.getAttribute('data-comment-id');
                deleteComment(commentId);
            });
        });

        // Be�eni butonlar�na olay ekle
        const likeButtons = commentsList.querySelectorAll('.snk-comment-like');
        likeButtons.forEach(button => {
            button.addEventListener('click', function () {
                this.classList.toggle('liked');

                // �kon de�i�tir
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('far');
                    icon.classList.toggle('fas');
                }

                // Saya� g�ncelle
                const counter = button.querySelector('.snk-like-count');
                if (counter) {
                    let count = parseInt(counter.textContent);
                    count = button.classList.contains('liked') ? count + 1 : Math.max(0, count - 1);
                    counter.textContent = count;
                }
            });
        });

        // Yan�tla butonlar�na olay ekle
        const replyButtons = commentsList.querySelectorAll('.snk-comment-reply');
        replyButtons.forEach(button => {
            button.addEventListener('click', function () {
                const commentId = this.getAttribute('data-comment-id');
                const username = this.getAttribute('data-username');
                prepareReply(commentId, username);
            });
        });
    }

    // Yan�t vermeye haz�rla
    function prepareReply(commentId, username) {
        const elements = getDOMElements();
        const commentText = elements.commentText;

        if (commentText) {
            // Textarea i�ine yan�t �nekini ekle
            commentText.value = `@${username} `;
            commentText.focus();

            // Yan�t edilecek yorum bilgisini saklama
            commentText.dataset.replyTo = commentId;
            commentText.dataset.replyToUsername = username;

            // Yan�t g�stergesini ekle/g�ster
            let replyIndicator = document.getElementById('replyIndicator');
            if (!replyIndicator) {
                const indicatorHTML = `
                <div class="snk-reply-indicator" id="replyIndicator">
                    <span>Yan�tlan�yor: <strong>${username}</strong></span>
                    <button id="cancelReply"><i class="fas fa-times"></i></button>
                </div>`;
                elements.commentText.parentNode.insertBefore(document.createRange().createContextualFragment(indicatorHTML), elements.commentText);

                // �ptal butonuna olay ekle
                document.getElementById('cancelReply').addEventListener('click', cancelReply);
            } else {
                replyIndicator.querySelector('strong').textContent = username;
                replyIndicator.style.display = 'flex';
            }
        }
    }

    // Yan�t iptal
    function cancelReply() {
        const elements = getDOMElements();
        const commentText = elements.commentText;

        if (commentText) {
            // Yan�t verme bilgilerini temizle
            delete commentText.dataset.replyTo;
            delete commentText.dataset.replyToUsername;

            // Textarea i�eri�ini temizle
            if (commentText.value.startsWith('@')) {
                commentText.value = '';
            }

            // Yan�t g�stergesini gizle
            const replyIndicator = document.getElementById('replyIndicator');
            if (replyIndicator) {
                replyIndicator.style.display = 'none';
            }
        }
    }

    // Yorumu sil
    function deleteComment(commentId) {
        if (confirm('Bu yorumu silmek istedi�inizden emin misiniz?')) {
            // T�m yorumlar� al
            const allComments = getAllComments();

            // Silinecek yorumu filtrele
            const newComments = allComments.filter(comment => comment.id !== commentId);

            // Kaydet
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newComments));

            // Yeniden y�kle
            if (activePostId) {
                loadComments(activePostId);
            }
        }
    }

    // T�m yorumlar� al
    function getAllComments() {
        const commentsStr = localStorage.getItem(STORAGE_KEY);
        if (commentsStr) {
            try {
                return JSON.parse(commentsStr);
            } catch (e) {
                console.error('Yorumlar ��z�mlenemedi:', e);
            }
        }
        return [];
    }

    // Yorum kaydet
    function saveComment(comment) {
        const allComments = getAllComments();
        allComments.push(comment);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
    }

    // Be�eni de�i�tir
    function toggleLike(button) {
        button.classList.toggle('liked');

        // �kon de�i�tir
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        }

        // Saya� g�ncelle
        const counter = button.querySelector('.snk-like-count');
        if (counter) {
            let count = parseInt(counter.textContent);
            count = button.classList.contains('liked') ? count + 1 : Math.max(0, count - 1);
            counter.textContent = count;
        }
    }

    // Payla�
    function sharePost(postId, event) {
        // T�klama olay�n�n yay�lmas�n� �nle
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const shareUrl = window.location.origin + window.location.pathname + '?post=' + postId;

        // Mevcut payla��m paneli varsa kald�r
        const existingPanel = document.querySelector('.snk-share-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // Payla��m se�enekleri
        const shareOptions = [
            { name: 'Twitter', icon: 'fab fa-twitter', action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank') },
            { name: 'Facebook', icon: 'fab fa-facebook', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank') },
            { name: 'WhatsApp', icon: 'fab fa-whatsapp', action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`, '_blank') },
            { name: 'LinkedIn', icon: 'fab fa-linkedin', action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank') },
            {
                name: 'Kopyala', icon: 'far fa-copy', action: () => {
                    navigator.clipboard.writeText(shareUrl)
                        .then(() => {
                            const copyBtn = document.querySelector('.snk-share-option[data-option="Kopyala"]');
                            if (copyBtn) {
                                const originalText = copyBtn.querySelector('.snk-share-option-text').textContent;
                                copyBtn.classList.add('copied');
                                copyBtn.querySelector('.snk-share-option-text').textContent = 'Kopyaland�!';

                                setTimeout(() => {
                                    copyBtn.classList.remove('copied');
                                    copyBtn.querySelector('.snk-share-option-text').textContent = originalText;
                                }, 2000);
                            }
                        })
                        .catch(err => {
                            console.error('Panoya kopyalama hatas�:', err);
                            alert('Ba�lant� kopyalanamad�: ' + err);
                        });
                }
            }
        ];

        // Payla��m paneli HTML
        const panelHTML = `
        <div class="snk-share-panel" onclick="event.stopPropagation();">
            <div class="snk-share-panel-header">
                <h3>��eri�i Payla�</h3>
                <button class="snk-share-panel-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="snk-share-url">
                <input type="text" value="${shareUrl}" readonly>
                <button class="snk-share-url-copy">
                    <i class="far fa-copy"></i>
                </button>
            </div>
            <div class="snk-share-options">
                ${shareOptions.map(option => `
                    <div class="snk-share-option" data-option="${option.name}">
                        <div class="snk-share-option-icon">
                            <i class="${option.icon}"></i>
                        </div>
                        <div class="snk-share-option-text">${option.name}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;

        // Paneli body'ye ekle
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        const panel = document.querySelector('.snk-share-panel');

        // Hemen document click olay�n� devre d��� b�rakal�m 
        // Bunu yapmak i�in bir overlay ekleyece�iz
        const overlay = document.createElement('div');
        overlay.className = 'snk-share-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999; background: rgba(0,0,0,0.5);';
        document.body.appendChild(overlay);

        // Overlay'a t�klama olay�
        overlay.addEventListener('click', function () {
            panel.classList.add('closing');
            overlay.classList.add('closing');
            setTimeout(() => {
                panel.remove();
                overlay.remove();
            }, 300);
        });

        // Panel a��ld���nda t�klama olay�n�n d��ar� yay�lmas�n� �nle
        panel.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        // G�rsel efekt i�in s�n�f ekle (animasyon i�in)
        setTimeout(() => {
            panel.classList.add('active');
            overlay.classList.add('active');
        }, 10);

        // Kapatma butonuna t�kland���nda kapat
        const closeButton = panel.querySelector('.snk-share-panel-close');
        if (closeButton) {
            closeButton.addEventListener('click', function (e) {
                e.stopPropagation(); // T�klama olay�n�n yay�lmas�n� �nle
                panel.classList.add('closing');
                overlay.classList.add('closing');
                setTimeout(() => {
                    panel.remove();
                    overlay.remove();
                }, 300);
            });
        }

        // URL kopyalama butonuna t�kland���nda kopyala
        const urlCopyButton = panel.querySelector('.snk-share-url-copy');
        if (urlCopyButton) {
            urlCopyButton.addEventListener('click', function (e) {
                e.stopPropagation(); // T�klama olay�n�n yay�lmas�n� �nle
                const input = panel.querySelector('.snk-share-url input');
                if (input) {
                    navigator.clipboard.writeText(input.value)
                        .then(() => {
                            urlCopyButton.classList.add('copied');
                            urlCopyButton.innerHTML = '<i class="fas fa-check"></i>';

                            setTimeout(() => {
                                urlCopyButton.classList.remove('copied');
                                urlCopyButton.innerHTML = '<i class="far fa-copy"></i>';
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Panoya kopyalama hatas�:', err);
                        });
                }
            });
        }

        // Payla��m se�eneklerine t�klama olaylar� ekle
        const options = panel.querySelectorAll('.snk-share-option');
        options.forEach((option, index) => {
            option.addEventListener('click', function (e) {
                e.stopPropagation(); // T�klama olay�n�n yay�lmas�n� �nle
                shareOptions[index].action();
            });
        });
    }

    // Mevcut kullan�c�y� al
    function getCurrentUser() {
        // Ana sisteme uygun �ekilde kullan�c� bilgisini al
        // �lk olarak snk_currentUser'� kontrol et
        let user = JSON.parse(localStorage.getItem('snk_currentUser') || '{}');

        // E�er kullan�c� bulunduysa ve giri� yapm��sa
        if (user && user.isLoggedIn) {
            return user;
        }

        // Alternatif olarak blogUser'� kontrol et
        user = JSON.parse(localStorage.getItem('blogUser') || '{}');
        if (user && (user.username || user.name)) {
            return user;
        }

        return null;
    }

    // �lklendirme
    function init() {
        // Modal'� body'ye ekle
        appendModalToBody();

        // Butonlar� ayarla - sayfa tamamen y�klendi�inde
        document.addEventListener('DOMContentLoaded', function () {
            setupCommentButtons();
        });

        // Sayfa y�klendiyse ve DOMContentLoaded olay� tetiklendiyse
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setupCommentButtons();
        }
    }

    // D��a a��lan API
    return {
        init: init,
        openCommentModal: openModal,
        toggleLike: toggleLike,
        sharePost: sharePost
    };
})();

// Yorum sistemini otomatik ba�lat
SNK_CommentSystem.init();

// Sayfa y�klendi�inde yorum sistemi butonlar�n� tekrar ayarla
window.addEventListener('load', function () {
    // 500ms bekledikten sonra butonlar� tekrar ayarla (dinamik i�erik i�in)
    setTimeout(function () {
        SNK_CommentSystem.init();
    }, 500);
});
