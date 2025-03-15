/**
 * E-posta Do�rulama Mod�l� - Senirkent Blog
 * E-posta do�rulama i�lemleri burada yap�l�r
 */

// �zel kimlikler i�in yard�mc� fonksiyon
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// E-posta do�rulama token'� olu�tur
function generateVerificationToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

// E-posta do�rulama sistemi i�in gerekli fonksiyonlar
// Local storage anahtar adlar�
const SNK_USERS_KEY = 'snk_users';
const SNK_PENDING_USERS_KEY = 'snk_pending_users';
const SNK_CURRENT_USER_KEY = 'snk_current_user';

// API endpointleri
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * E-posta do�rulama token'� olu�tur
 * @returns {string} Olu�turulan token
 */
function snk_verification_generateToken() {
    // Basit bir token olu�tur
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

/**
 * �sparta Meslek Y�ksekokulu e-posta kontrol�
 * Sadece ol ile ba�layan ve @isparta.edu.tr uzant�l� e-postalar kabul edilir 
 * @param {string} email - Kontrol edilecek e-posta adresi
 * @returns {boolean} E-posta ge�erli mi?
 */
function snk_verification_isValidEmail(email) {
    // ol2413615008@isparta.edu.tr benzeri e-postalar
    const regex = /^ol\d{10}@isparta\.edu\.tr$/;
    return regex.test(email);
}

/**
 * E-posta format�n� do�rular
 * @param {string} email - Kontrol edilecek e-posta
 * @returns {boolean} - E-posta format� ge�erli mi
 */
function snk_verification_isValidEmailFormat(email) {
    // isparta.edu.tr format�nda e-posta kontrol� (�rn: ol2413615008@isparta.edu.tr)
    const regex = /^ol\d{10}@isparta\.edu\.tr$/;
    return regex.test(email);
}

/**
 * Do�rulama e-postas� g�nder
 * @param {Object} userData - Kullan�c� bilgileri
 * @returns {Object} ��lem sonucu
 */
function snk_verification_sendVerificationEmail(userData) {
    if (!userData || !userData.email) {
        console.error('Ge�ersiz kullan�c� verisi');
        return { success: false, message: 'Ge�ersiz kullan�c� verisi.' };
    }

    // E-posta format�n� kontrol et
    if (!snk_verification_isValidEmailFormat(userData.email)) {
        return { success: false, message: 'Ge�ersiz e-posta format�. Sadece isparta.edu.tr uzant�l� e-postalar kabul edilmektedir.' };
    }

    try {
        // Token olu�tur
        const verificationToken = snk_verification_generateToken();

        // API'ye g�nderilecek veri
        const payload = {
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            verificationToken: verificationToken
        };

        // Bekleyen kullan�c�lar� al
        let pendingUsers = JSON.parse(localStorage.getItem(SNK_PENDING_USERS_KEY) || '[]');

        // Kullan�c� daha �nce eklenmi� mi kontrol et
        const existingUserIndex = pendingUsers.findIndex(user => user.email === userData.email);

        if (existingUserIndex !== -1) {
            // Kullan�c�y� g�ncelle
            pendingUsers[existingUserIndex] = {
                ...userData,
                verificationToken
            };
        } else {
            // Yeni kullan�c� ekle
            pendingUsers.push({
                ...userData,
                verificationToken
            });
        }

        // Bekleyen kullan�c�lar� kaydet
        localStorage.setItem(SNK_PENDING_USERS_KEY, JSON.stringify(pendingUsers));

        // API'yi �a��r
        fetch(`${API_BASE_URL}/send-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Do�rulama e-postas� g�nderildi:', data.message);

                    // E-posta g�nderildi�inde kullan�c�ya bilgi ver
                    const messageElement = document.querySelector('.message-info');
                    if (messageElement) {
                        messageElement.innerHTML += `<p class="mail-success-info">E-posta g�nderildi: <strong>${data.emailSentTo}</strong> adresine do�rulama ba�lant�s� g�nderildi. L�tfen e-posta kutunuzu kontrol edin.</p>`;
                    }
                } else {
                    console.error('E-posta g�nderme hatas�:', data.message);
                }
            })
            .catch(error => {
                console.error('API hatas�:', error);
            });

        return {
            success: true,
            message: 'Do�rulama e-postas� g�nderildi. L�tfen e-postan�z� kontrol edin.'
        };

    } catch (error) {
        console.error('E-posta g�nderme hatas�:', error);
        return { success: false, message: 'Bir hata olu�tu. L�tfen tekrar deneyin.' };
    }
}

/**
 * E-posta do�rulama e-postas� g�nderir
 * Bu fonksiyon ger�ek bir e-posta g�ndermek yerine, do�rulama s�recini sim�le eder
 * 
 * @param {Object} userData - Kullan�c� verileri 
 * @returns {Object} - ��lem sonucu
 */
function snk_verification_sendVerificationEmailSimulation(userData) {
    console.log('Do�rulama e-postas� g�nderme iste�i:', userData.email);

    // E-posta format kontrol�
    if (!snk_verification_isValidEmailFormat(userData.email)) {
        return {
            success: false,
            message: 'Ge�ersiz e-posta format�. Sadece isparta.edu.tr uzant�l� e-postalar kabul edilmektedir.'
        };
    }

    // Do�rulama token'� olu�tur
    const verificationToken = generateVerificationToken();
    const userId = generateUniqueId();

    // Kullan�c� verilerini haz�rla
    const pendingUser = {
        id: userId,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        password: userData.password, // Ger�ekte �ifrelenmi� olmal�
        verificationToken: verificationToken,
        isVerified: false,
        createdAt: new Date().toISOString()
    };

    // Bekleyen kullan�c�lar� localStorage'dan al
    let pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');

    // Kullan�c� zaten beklemede mi kontrol et
    const existingUserIndex = pendingUsers.findIndex(user => user.email === userData.email);

    if (existingUserIndex !== -1) {
        // Kullan�c�y� g�ncelle
        pendingUsers[existingUserIndex] = {
            ...pendingUsers[existingUserIndex],
            ...pendingUser
        };
    } else {
        // Yeni kullan�c� ekle
        pendingUsers.push(pendingUser);
    }

    // G�ncellenmi� listeyi kaydet
    localStorage.setItem('snk_pendingUsers', JSON.stringify(pendingUsers));

    // Do�rulama URL'i olu�tur (ger�ekte backend taraf�ndan i�lenecek)
    const verificationUrl = `verify.html?token=${verificationToken}&email=${encodeURIComponent(userData.email)}`;

    // Do�rulama detaylar�n� konsola yaz (ger�ek uygulamada e-posta g�nderilir)
    console.log('Admin e-posta adresi:', 'mustafadmrsy125@gmail.com');
    console.log('Do�rulama URL:', verificationUrl);
    console.log('Do�rulama token:', verificationToken);

    // E-postan�n g�nderildi�ini sim�le et
    return {
        success: true,
        message: 'Do�rulama e-postas� g�nderildi. L�tfen e-postan�z� kontrol edin.',
        // Ger�ek uygulamada bu bilgiler kullan�c�ya sunulmaz, sadece geli�tirme ama�l�d�r
        debug: {
            token: verificationToken,
            url: verificationUrl
        }
    };
}

/**
 * E-posta do�rulama i�lemini ger�ekle�tirir
 * 
 * @param {string} token - Do�rulama token'�
 * @param {string} email - Kullan�c� e-postas�
 * @returns {Object} - ��lem sonucu
 */
function snk_verification_verifyEmail(token, email) {
    console.log('E-posta do�rulama iste�i:', email, token);

    // Bekleyen kullan�c�lar� al
    const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');

    // Token ve e-posta ile e�le�en kullan�c�y� bul
    const userIndex = pendingUsers.findIndex(
        user => user.email === email && user.verificationToken === token
    );

    if (userIndex === -1) {
        return {
            success: false,
            message: 'Ge�ersiz do�rulama bilgileri veya s�re dolmu�.'
        };
    }

    // Kullan�c�y� al ve do�rulanm�� kullan�c�lar listesine ekle
    const verifiedUser = { ...pendingUsers[userIndex] };
    delete verifiedUser.verificationToken; // Token'� kald�r
    verifiedUser.isVerified = true;
    verifiedUser.verifiedAt = new Date().toISOString();

    // Do�rulanm�� kullan�c�lar listesini al
    let users = JSON.parse(localStorage.getItem('snk_users') || '[]');

    // Kullan�c� zaten var m� kontrol et
    const existingUserIndex = users.findIndex(user => user.email === email);

    if (existingUserIndex !== -1) {
        // Mevcut kullan�c�y� g�ncelle
        users[existingUserIndex] = {
            ...users[existingUserIndex],
            ...verifiedUser
        };
    } else {
        // Yeni kullan�c� ekle
        users.push(verifiedUser);
    }

    // Do�rulanm�� kullan�c�lar� kaydet
    localStorage.setItem('snk_users', JSON.stringify(users));

    // Bekleyen kullan�c�dan kald�r
    pendingUsers.splice(userIndex, 1);
    localStorage.setItem('snk_pendingUsers', JSON.stringify(pendingUsers));

    return {
        success: true,
        message: 'E-posta ba�ar�yla do�ruland�!',
        user: {
            name: verifiedUser.name,
            email: verifiedUser.email
        }
    };
}

/**
 * E-posta do�rulama i�lemi
 * @param {string} token - Do�rulama token'�
 * @param {string} email - Do�rulanacak e-posta
 * @returns {Object} ��lem sonucu ve kullan�c� bilgisi
 */
function snk_verification_verifyEmail(token, email) {
    if (!token || !email) {
        return { success: false, message: 'Ge�ersiz do�rulama bilgileri.' };
    }

    try {
        // Bekleyen kullan�c�lar� al
        let pendingUsers = JSON.parse(localStorage.getItem(SNK_PENDING_USERS_KEY) || '[]');

        // Kullan�c�y� bul
        const userIndex = pendingUsers.findIndex(user =>
            user.email === email && user.verificationToken === token
        );

        if (userIndex === -1) {
            return { success: false, message: 'Ge�ersiz do�rulama bilgileri veya ba�lant� s�resi dolmu�.' };
        }

        // Kullan�c�y� bekleyen listesinden al
        const verifiedUser = pendingUsers[userIndex];

        // Token bilgisini sil
        delete verifiedUser.verificationToken;

        // Do�rulama tarihini ekle
        verifiedUser.verifiedAt = new Date().toISOString();

        // Kay�tl� kullan�c�lar� al
        let users = JSON.parse(localStorage.getItem(SNK_USERS_KEY) || '[]');

        // Kullan�c�y� ekle
        users.push(verifiedUser);

        // Kullan�c�lar� kaydet
        localStorage.setItem(SNK_USERS_KEY, JSON.stringify(users));

        // Bekleyen kullan�c�dan kald�r
        pendingUsers.splice(userIndex, 1);
        localStorage.setItem(SNK_PENDING_USERS_KEY, JSON.stringify(pendingUsers));

        return {
            success: true,
            message: 'E-posta ba�ar�yla do�ruland�. Art�k giri� yapabilirsiniz.',
            user: verifiedUser
        };

    } catch (error) {
        console.error('Do�rulama hatas�:', error);
        return { success: false, message: 'Do�rulama s�ras�nda bir hata olu�tu.' };
    }
}

/**
 * Kullan�c� do�rulanm�� m� kontrol et
 * @param {string} email - Kontrol edilecek e-posta
 * @returns {boolean} Kullan�c� do�rulanm�� m�?
 */
function snk_verification_isUserVerified(email) {
    if (!email) return false;

    try {
        // Kay�tl� kullan�c�lar� al
        const users = JSON.parse(localStorage.getItem(SNK_USERS_KEY) || '[]');

        // Kullan�c�y� bul
        return users.some(user => user.email === email);

    } catch (error) {
        console.error('Kullan�c� do�rulama kontrol� hatas�:', error);
        return false;
    }
}

/**
 * Kullan�c� kay�t bekliyor mu kontrol et
 * @param {string} email - Kontrol edilecek e-posta
 * @returns {boolean} Kullan�c� kay�t bekliyor mu?
 */
function snk_verification_isPendingVerification(email) {
    if (!email) return false;

    try {
        // Bekleyen kullan�c�lar� al
        const pendingUsers = JSON.parse(localStorage.getItem(SNK_PENDING_USERS_KEY) || '[]');

        // Kullan�c�y� bul
        return pendingUsers.some(user => user.email === email);

    } catch (error) {
        console.error('Bekleyen kullan�c� kontrol� hatas�:', error);
        return false;
    }
}

// Mod�l d��a aktarma
window.snk_verification_isValidEmail = snk_verification_isValidEmail;
window.snk_verification_sendVerificationEmail = snk_verification_sendVerificationEmail;
window.snk_verification_sendVerificationEmailSimulation = snk_verification_sendVerificationEmailSimulation;
window.snk_verification_verifyEmail = snk_verification_verifyEmail;
window.snk_verification_isUserVerified = snk_verification_isUserVerified;
window.snk_verification_isPendingVerification = snk_verification_isPendingVerification;
