/**
 * Giriş/Kayıt Sayfaları JavaScript Dosyası
 */
document.addEventListener('DOMContentLoaded', function() {
    // Şifre görünürlük kontrolü
    setupPasswordToggle();
    
    // Form validasyonu
    setupFormValidation();
    
    // Sosyal medya butonları
    setupSocialLogin();
});

/**
 * Şifre görünürlük kontrolü
 */
function setupPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordField = document.getElementById('txtPassword');
    
    if (passwordToggle && passwordField) {
        passwordToggle.addEventListener('click', function() {
            // Şifre görünürlüğünü değiştir
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // İkon değiştir
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Kayıt sayfasındaki şifre doğrulama alanı için de ekle
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const confirmPasswordField = document.getElementById('txtConfirmPassword');
    
    if (confirmPasswordToggle && confirmPasswordField) {
        confirmPasswordToggle.addEventListener('click', function() {
            // Şifre görünürlüğünü değiştir
            const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordField.setAttribute('type', type);
            
            // İkon değiştir
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
}

/**
 * Form validasyonu
 */
function setupFormValidation() {
    // Login formu
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const emailField = document.getElementById('txtEmail');
            const passwordField = document.getElementById('txtPassword');
            
            // Client-side validasyon
            // (ASP.NET validation kullanıldığı için basit validasyon yeterli)
            if (!validateEmail(emailField.value)) {
                showFieldError(emailField, 'Lütfen geçerli bir e-posta adresi girin');
                e.preventDefault();
            } else {
                removeFieldError(emailField);
            }
            
            if (passwordField.value.length < 6) {
                showFieldError(passwordField, 'Şifre en az 6 karakter olmalıdır');
                e.preventDefault();
            } else {
                removeFieldError(passwordField);
            }
        });
    }
    
    // Kayıt formu
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const nameField = document.getElementById('txtName');
            const emailField = document.getElementById('txtEmail');
            const passwordField = document.getElementById('txtPassword');
            const confirmPasswordField = document.getElementById('txtConfirmPassword');
            const termsCheckbox = document.getElementById('chkTerms');
            
            // İsim validasyonu
            if (nameField.value.trim().length < 3) {
                showFieldError(nameField, 'İsim en az 3 karakter olmalıdır');
                e.preventDefault();
            } else {
                removeFieldError(nameField);
            }
            
            // E-posta validasyonu
            if (!validateEmail(emailField.value)) {
                showFieldError(emailField, 'Lütfen geçerli bir e-posta adresi girin');
                e.preventDefault();
            } else {
                removeFieldError(emailField);
            }
            
            // Şifre validasyonu
            if (passwordField.value.length < 6) {
                showFieldError(passwordField, 'Şifre en az 6 karakter olmalıdır');
                e.preventDefault();
            } else {
                removeFieldError(passwordField);
            }
            
            // Şifre eşleşme kontrolü
            if (passwordField.value !== confirmPasswordField.value) {
                showFieldError(confirmPasswordField, 'Şifreler eşleşmiyor');
                e.preventDefault();
            } else {
                removeFieldError(confirmPasswordField);
            }
            
            // Şartlar ve koşullar onayı
            if (termsCheckbox && !termsCheckbox.checked) {
                const termsContainer = termsCheckbox.closest('.terms-condition-container');
                if (termsContainer) {
                    termsContainer.classList.add('terms-error');
                    e.preventDefault();
                }
            } else if (termsCheckbox) {
                const termsContainer = termsCheckbox.closest('.terms-condition-container');
                if (termsContainer) {
                    termsContainer.classList.remove('terms-error');
                }
            }
        });
    }
}

/**
 * Sosyal medya giriş butonları
 */
function setupSocialLogin() {
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            // Google ile giriş - Gerçek uygulamada OAuth entegrasyonu yapılacak
            alert('Google ile giriş henüz aktif değil. Geliştirme aşamasındadır.');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            // Facebook ile giriş - Gerçek uygulamada OAuth entegrasyonu yapılacak
            alert('Facebook ile giriş henüz aktif değil. Geliştirme aşamasındadır.');
        });
    }
}

/**
 * E-posta doğrulama
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Form alan hatası göster
 */
function showFieldError(field, message) {
    // Hata mesajı elementi
    let errorElement = field.nextElementSibling;
    
    // Eğer validator mesajı varsa, ondan sonraki element
    if (errorElement && errorElement.classList.contains('validator-message')) {
        errorElement = errorElement.nextElementSibling;
    }
    
    // Eğer hata mesajı elementi yoksa oluştur
    if (!errorElement || !errorElement.classList.contains('field-error')) {
        errorElement = document.createElement('div');
        errorElement.classList.add('field-error');
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    errorElement.textContent = message;
    field.classList.add('input-error');
}

/**
 * Form alan hatasını kaldır
 */
function removeFieldError(field) {
    // Hata mesajı elementini bul ve kaldır
    const errorElement = field.nextElementSibling;
    
    if (errorElement && errorElement.classList.contains('field-error')) {
        errorElement.parentNode.removeChild(errorElement);
    }
    
    field.classList.remove('input-error');
}
