// �leti�im Formu ��levselli�i

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            // Form e-posta olarak g�nderilecek, bu y�zden e.preventDefault() kullanm�yoruz

            // Form de�erlerini al
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const subject = document.getElementById("subject").value;
            const message = document.getElementById("message").value;

            // E-posta g�nderme i�lemi action="mailto:..." ile otomatik ger�ekle�tiriliyor
            console.log("Form g�nderildi:", { name, email, subject, message });

            // Ba�ar� mesaj� g�ster - e-posta istemcisi a��laca�� i�in burada g�stermiyoruz
            // Verileri kontrol et
            if (!name || !email || !subject || !message) {
                e.preventDefault(); // E�er form eksikse, g�nderimi engelle
                showNotification("L�tfen t�m alanlar� doldurun!", "error");
                return false;
            }

            // Form ba�ar�yla g�nderildi
            showNotification("E-posta istemciniz a��l�yor...", "info");

            // Form ba�ar�yla g�nderildi�inde kullan�c�ya bilgi ver
            // Not: Ger�ek e-posta g�nderimi taray�c�n�n mailto: protokol� ile ger�ekle�ecek
            return true;
        });
    }

    // Bildirim fonksiyonu
    function showNotification(message, type = "info") {
        // Bildirim container'� kontrol et, yoksa olu�tur
        let notificationContainer = document.querySelector(".snk-notification-container");

        if (!notificationContainer) {
            notificationContainer = document.createElement("div");
            notificationContainer.className = "snk-notification-container";
            document.body.appendChild(notificationContainer);
        }

        // Yeni bildirim olu�tur
        const notification = document.createElement("div");
        notification.className = `snk-notification ${type}`;

        // �kon se�
        let icon = "fa-info-circle";
        if (type === "success") icon = "fa-check-circle";
        if (type === "error") icon = "fa-exclamation-circle";
        if (type === "warning") icon = "fa-exclamation-triangle";

        // Bildirim i�eri�i
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <div class="snk-notification-content">${message}</div>
            <button class="snk-notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Ekle ve g�ster
        notificationContainer.appendChild(notification);

        // Kapanma d��mesi olay�n� ekle
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
