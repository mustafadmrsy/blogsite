/**
 * Þifre Göster/Gizle Fonksiyonu
 * Bu script, þifre alanlarýnýn görünürlüðünü deðiþtirmek için kullanýlýr.
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log('Þifre gösterme/gizleme fonksiyonu yükleniyor...');

    // Sayfa yüklendiðinde ve her DOM deðiþikliðinde þifre butonlarýný kontrol et
    setupPasswordToggleButtons();

    // MutationObserver ile DOM deðiþikliklerini izle (popup açýldýðýnda vb.)
    const observer = new MutationObserver(function (mutations) {
        setupPasswordToggleButtons();
    });

    // Tüm document'ý izle
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Þifre gösterme/gizleme butonlarýný ayarla
function setupPasswordToggleButtons() {
    // Tüm þifre toggle butonlarýný seç
    const passwordToggles = document.querySelectorAll('.snk-password-toggle, #snk_login_toggle_password');

    passwordToggles.forEach(function (toggleBtn) {
        // Eðer bu butona daha önce event listener eklenmemiþse
        if (!toggleBtn.dataset.initialized) {
            // Butonun yanýndaki þifre input'unu bul
            const passwordInput = toggleBtn.closest('.snk-password-container').querySelector('input[type="password"], input[type="text"]');

            if (passwordInput) {
                // Event listener ekle
                toggleBtn.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Input tipini deðiþtir
                    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordInput.setAttribute('type', type);

                    // Button ikonunu deðiþtir
                    const icon = toggleBtn.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-eye');
                        icon.classList.toggle('fa-eye-slash');
                    }

                    console.log('Þifre görünürlüðü deðiþtirildi:', type);
                });

                // Bu butona event listener eklendi olarak iþaretle
                toggleBtn.dataset.initialized = 'true';
                console.log('Þifre toggle butonu baþarýyla ayarlandý');
            }
        }
    });
}
