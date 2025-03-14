/**
 * İletişim Sayfası JavaScript Dosyası
 */
document.addEventListener('DOMContentLoaded', function() {
    // Form gönderildiğinde başarı mesajına otomatik kaydırma
    const successPanel = document.querySelector('.alert-success');
    if (successPanel && successPanel.style.display !== 'none') {
        successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Form alanları için animasyon
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
        // Form alanlarına focus sınıfı ekleme
        control.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Form alanlarından focus sınıfını kaldırma
        control.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Sayfa yüklendiğinde dolu alanlar için sınıf ekleme
        if (control.value !== '') {
            control.parentElement.classList.add('focused');
        }
    });

    // Sosyal medya ikonları için hover efekti
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Harita yükleme optimizasyonu
    const mapContainer = document.querySelector('.map-container');
    const mapIframe = mapContainer ? mapContainer.querySelector('iframe') : null;
    
    if (mapIframe) {
        // Sayfa tamamen yüklendiğinde haritayı yükle
        window.addEventListener('load', function() {
            mapIframe.setAttribute('src', mapIframe.getAttribute('data-src'));
        });
    }
});
