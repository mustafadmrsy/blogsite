/**
 * �ifre G�ster/Gizle Fonksiyonu
 * Bu script, �ifre alanlar�n�n g�r�n�rl���n� de�i�tirmek i�in kullan�l�r.
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log('�ifre g�sterme/gizleme fonksiyonu y�kleniyor...');

    // Sayfa y�klendi�inde ve her DOM de�i�ikli�inde �ifre butonlar�n� kontrol et
    setupPasswordToggleButtons();

    // MutationObserver ile DOM de�i�ikliklerini izle (popup a��ld���nda vb.)
    const observer = new MutationObserver(function (mutations) {
        setupPasswordToggleButtons();
    });

    // T�m document'� izle
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// �ifre g�sterme/gizleme butonlar�n� ayarla
function setupPasswordToggleButtons() {
    // T�m �ifre toggle butonlar�n� se�
    const passwordToggles = document.querySelectorAll('.snk-password-toggle, #snk_login_toggle_password');

    passwordToggles.forEach(function (toggleBtn) {
        // E�er bu butona daha �nce event listener eklenmemi�se
        if (!toggleBtn.dataset.initialized) {
            // Butonun yan�ndaki �ifre input'unu bul
            const passwordInput = toggleBtn.closest('.snk-password-container').querySelector('input[type="password"], input[type="text"]');

            if (passwordInput) {
                // Event listener ekle
                toggleBtn.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Input tipini de�i�tir
                    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordInput.setAttribute('type', type);

                    // Button ikonunu de�i�tir
                    const icon = toggleBtn.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-eye');
                        icon.classList.toggle('fa-eye-slash');
                    }

                    console.log('�ifre g�r�n�rl��� de�i�tirildi:', type);
                });

                // Bu butona event listener eklendi olarak i�aretle
                toggleBtn.dataset.initialized = 'true';
                console.log('�ifre toggle butonu ba�ar�yla ayarland�');
            }
        }
    });
}
