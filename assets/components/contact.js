// Ýletiþim Formu Ýþlevselliði

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            // Form e-posta olarak gönderilecek, bu yüzden e.preventDefault() kullanmýyoruz

            // Form deðerlerini al
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const subject = document.getElementById("subject").value;
            const message = document.getElementById("message").value;

            // E-posta gönderme iþlemi action="mailto:..." ile otomatik gerçekleþtiriliyor
            console.log("Form gönderildi:", { name, email, subject, message });

            // Baþarý mesajý göster - e-posta istemcisi açýlacaðý için burada göstermiyoruz
            // Verileri kontrol et
            if (!name || !email || !subject || !message) {
                e.preventDefault(); // Eðer form eksikse, gönderimi engelle
                showNotification("Lütfen tüm alanlarý doldurun!", "error");
                return false;
            }

            // Form baþarýyla gönderildi
            showNotification("E-posta istemciniz açýlýyor...", "info");

            // Form baþarýyla gönderildiðinde kullanýcýya bilgi ver
            // Not: Gerçek e-posta gönderimi tarayýcýnýn mailto: protokolü ile gerçekleþecek
            return true;
        });
    }

    // Bildirim fonksiyonu
    function showNotification(message, type = "info") {
        // Bildirim container'ý kontrol et, yoksa oluþtur
        let notificationContainer = document.querySelector(".snk-notification-container");

        if (!notificationContainer) {
            notificationContainer = document.createElement("div");
            notificationContainer.className = "snk-notification-container";
            document.body.appendChild(notificationContainer);
        }

        // Yeni bildirim oluþtur
        const notification = document.createElement("div");
        notification.className = `snk-notification ${type}`;

        // Ýkon seç
        let icon = "fa-info-circle";
        if (type === "success") icon = "fa-check-circle";
        if (type === "error") icon = "fa-exclamation-circle";
        if (type === "warning") icon = "fa-exclamation-triangle";

        // Bildirim içeriði
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <div class="snk-notification-content">${message}</div>
            <button class="snk-notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Ekle ve göster
        notificationContainer.appendChild(notification);

        // Kapanma düðmesi olayýný ekle
        const closeButton = notification.querySelector(".snk-notification-close");
        closeButton.addEventListener("click", function () {
            notification.classList.add("closing");
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Otomatik kapanma
        setTimeout(() => {
            notification.classList.add("closing");
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
});
