/**
 * Blog Detay Sayfası JavaScript Dosyası
 */
document.addEventListener('DOMContentLoaded', function() {
    // Beğeni butonu işlemleri
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function(e) {
            // ASP.NET butonları için __doPostBack işlemini engellemiyoruz
            // Bu postback'i kullanarak Server-side kodumuz çalışacak
            // Client-side olarak sadece görsel geri bildirim ekliyoruz
            this.classList.toggle('active');
            
            // Beğeni sayısını client-side olarak güncelleme
            // Bu sadece görsel bir değişiklik, asıl değer postback sırasında server-side güncellenecek
            const likeCountElement = document.getElementById('likeCount');
            if (likeCountElement && !this.classList.contains('active')) {
                let currentCount = parseInt(likeCountElement.innerText);
                likeCountElement.innerText = currentCount - 1;
            }
        });
    }
    
    // Paylaşım modalını aç/kapa
    const shareBtn = document.getElementById('shareBtn');
    const shareModal = document.getElementById('shareModal');
    const closeBtn = document.querySelector('.share-modal-close');
    
    if (shareBtn && shareModal) {
        shareBtn.addEventListener('click', function() {
            shareModal.style.display = 'flex';
        });
        
        closeBtn.addEventListener('click', function() {
            shareModal.style.display = 'none';
        });
        
        // Modal dışına tıklayınca kapat
        window.addEventListener('click', function(e) {
            if (e.target === shareModal) {
                shareModal.style.display = 'none';
            }
        });
        
        // ESC tuşu ile kapatma (Sidebar/profil menü kapatma belleğiyle uyumlu)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && shareModal.style.display === 'flex') {
                shareModal.style.display = 'none';
            }
        });
    }
    
    // Bağlantı kopyalama
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const shareLink = document.getElementById('txtShareLink');
    
    if (copyLinkBtn && shareLink) {
        copyLinkBtn.addEventListener('click', function() {
            // Metin alanını seç
            shareLink.select();
            shareLink.setSelectionRange(0, 99999); // Mobil cihazlar için
            
            // Metni kopyala
            document.execCommand('copy');
            
            // Kopyalama sonrası feedback
            const originalText = this.innerText;
            this.innerText = 'Kopyalandı!';
            
            setTimeout(() => {
                this.innerText = originalText;
            }, 2000);
        });
    }
    
    // Sosyal medya paylaşım linkleri
    setupSocialSharing();
    
    // İçindekiler tablosu oluştur
    createTableOfContents();
});

/**
 * Sosyal medya paylaşım linklerini ayarlar
 */
function setupSocialSharing() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    // Facebook paylaşımı
    const facebookShare = document.getElementById('shareFacebook');
    if (facebookShare) {
        facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        facebookShare.target = '_blank';
    }
    
    // Twitter paylaşımı
    const twitterShare = document.getElementById('shareTwitter');
    if (twitterShare) {
        twitterShare.href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        twitterShare.target = '_blank';
    }
    
    // LinkedIn paylaşımı
    const linkedinShare = document.getElementById('shareLinkedin');
    if (linkedinShare) {
        linkedinShare.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        linkedinShare.target = '_blank';
    }
    
    // WhatsApp paylaşımı
    const whatsappShare = document.getElementById('shareWhatsapp');
    if (whatsappShare) {
        whatsappShare.href = `https://api.whatsapp.com/send?text=${title} ${url}`;
        whatsappShare.target = '_blank';
    }
}

/**
 * Blog içeriğindeki başlıklara göre içindekiler tablosu oluşturur
 */
function createTableOfContents() {
    const blogContent = document.getElementById('blogContent');
    
    if (!blogContent) return;
    
    // Blog içeriğindeki h2 ve h3 başlıklarını bul
    const headings = blogContent.querySelectorAll('h2, h3');
    
    if (headings.length > 1) {
        // İçindekiler tablosunu oluştur
        const tocContainer = document.createElement('div');
        tocContainer.className = 'table-of-contents';
        
        const tocTitle = document.createElement('h3');
        tocTitle.innerText = 'İçindekiler';
        tocContainer.appendChild(tocTitle);
        
        const tocList = document.createElement('ul');
        tocContainer.appendChild(tocList);
        
        // Her başlık için ID oluştur ve listeye ekle
        headings.forEach((heading, index) => {
            // Başlığa ID ekle
            const headingId = `heading-${index}`;
            heading.id = headingId;
            
            // İçindekiler listesine ekle
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${headingId}`;
            link.innerText = heading.innerText;
            
            // Başlık seviyesine göre sınıf ekle
            if (heading.tagName === 'H3') {
                listItem.className = 'toc-subitem';
            }
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        
        // İçindekiler tablosunu blog içeriğinin başına ekle
        const firstParagraph = blogContent.querySelector('p');
        if (firstParagraph) {
            blogContent.insertBefore(tocContainer, firstParagraph.nextSibling);
        } else {
            blogContent.insertBefore(tocContainer, blogContent.firstChild);
        }
        
        // İçindekiler tablosu stil ekle
        const style = document.createElement('style');
        style.textContent = `
            .table-of-contents {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 5px;
                margin: 20px 0 30px;
                border-left: 3px solid #007bff;
            }
            
            .table-of-contents h3 {
                margin-top: 0;
                margin-bottom: 15px;
                font-size: 18px;
                color: #444;
            }
            
            .table-of-contents ul {
                list-style-type: none;
                padding-left: 0;
                margin-bottom: 0;
            }
            
            .table-of-contents li {
                margin-bottom: 8px;
            }
            
            .table-of-contents a {
                color: #555;
                text-decoration: none;
                transition: color 0.3s;
            }
            
            .table-of-contents a:hover {
                color: #007bff;
            }
            
            .toc-subitem {
                padding-left: 20px;
            }
        `;
        document.head.appendChild(style);
    }
}
