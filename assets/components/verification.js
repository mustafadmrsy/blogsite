/**
 * E-posta Doðrulama Modülü - Senirkent Blog
 * E-posta doðrulama iþlemleri burada yapýlýr
 */

// Özel kimlikler için yardýmcý fonksiyon
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// E-posta doðrulama token'ý oluþtur
function generateVerificationToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

// E-posta doðrulama sistemi için gerekli fonksiyonlar
// Local storage anahtar adlarý
const SNK_USERS_KEY = 'snk_users';
const SNK_PENDING_USERS_KEY = 'snk_pending_users';
const SNK_CURRENT_USER_KEY = 'snk_current_user';

// API endpointleri
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * E-posta doðrulama token'ý oluþtur
 * @returns {string} Oluþturulan token
 */
function snk_verification_generateToken() {
    // Basit bir token oluþtur
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

/**
 * Ýsparta Meslek Yüksekokulu e-posta kontrolü
 * Sadece ol ile baþlayan ve @isparta.edu.tr uzantýlý e-postalar kabul edilir 
 * @param {string} email - Kontrol edilecek e-posta adresi
 * @returns {boolean} E-posta geçerli mi?
 */
function snk_verification_isValidEmail(email) {
    // ol2413615008@isparta.edu.tr benzeri e-postalar
    const regex = /^ol\d{10}@isparta\.edu\.tr$/;
    return regex.test(email);
}

/**
 * E-posta formatýný doðrular
 * @param {string} email - Kontrol edilecek e-posta
 * @returns {boolean} - E-posta formatý geçerli mi
 */
function snk_verification_isValidEmailFormat(email) {
    // isparta.edu.tr formatýnda e-posta kontrolü (örn: ol2413615008@isparta.edu.tr)
    const regex = /^ol\d{10}@isparta\.edu\.tr$/;
    return regex.test(email);
}

/**
 * Doðrulama e-postasý gönder
 * @param {Object} userData - Kullanýcý bilgileri
 * @returns {Object} Ýþlem sonucu
 */
function snk_verification_sendVerificationEmail(userData) {
    if (!userData || !userData.email) {
        console.error('Geçersiz kullanýcý verisi');
        return { success: false, message: 'Geçersiz kullanýcý verisi.' };
    }

    // E-posta formatýný kontrol et
    if (!snk_verification_isValidEmailFormat(userData.email)) {
        return { success: false, message: 'Geçersiz e-posta formatý. Sadece isparta.edu.tr uzantýlý e-postalar kabul edilmektedir.' };
    }

    try {
        // Token oluþtur
        const verificationToken = snk_verification_generateToken();

        // API'ye gönderilecek veri
        const payload = {
            name: userData.name,
            surname: userData.surname,
            email: userData.email,
            verificationToken: verificationToken
        };

        // Bekleyen kullanýcýlarý al
        let pendingUsers = JSON.parse(localStorage.getItem(SNK_PENDING_USERS_KEY) || '[]');

        // Kullanýcý daha önce eklenmiþ mi kontrol et
        const existingUserIndex = pendingUsers.findIndex(user => user.email === userData.email);

        if (existingUserIndex !== -1) {
            // Kullanýcýyý güncelle
            pendingUsers[existingUserIndex] = {
                ...userData,
                verificationToken
            };
        } else {
            // Yeni kullanýcý ekle
            pendingUsers.push({
                ...userData,
                verificationToken
            });
        }

        // Bekleyen kullanýcýlarý kaydet
        localStorage.setItem(SNK_PENDING_USERS_KEY, JSON.stringify(pendingUsers));

        // API'yi çaðýr
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
                    console.log('Doðrulama e-postasý gönderildi:', data.message);

                    // E-posta gönderildiðinde kullanýcýya bilgi ver
                    const messageElement = document.querySelector('.message-info');
                    if (messageElement) {
                        messageElement.innerHTML += `<p class="mail-success-info">E-posta gönderildi: <strong>${data.emailSentTo}</strong> adresine doðrulama baðlantýsý gönderildi. Lütfen e-posta kutunuzu kontrol edin.</p>`;
                    }
                } else {
                    console.error('E-posta gönderme hatasý:', data.message);
                }
            })
            .catch(error => {
                console.error('API hatasý:', error);
            });

        return {
            success: true,
            message: 'Doðrulama e-postasý gönderildi. Lütfen e-postanýzý kontrol edin.'
        };

    } catch (error) {
        console.error('E-posta gönderme hatasý:', error);
        return { success: false, message: 'Bir hata oluþtu. Lütfen tekrar deneyin.' };
    }
}

/**
 * E-posta doðrulama e-postasý gönderir
 * Bu fonksiyon gerçek bir e-posta göndermek yerine, doðrulama sürecini simüle eder
 * 
 * @param {Object} userData - Kullanýcý verileri 
 * @returns {Object} - Ýþlem sonucu
 */
function snk_verification_sendVerificationEmailSimulation(userData) {
    console.log('Doðrulama e-postasý gönderme isteði:', userData.email);

    // E-posta format kontrolü
    if (!snk_verification_isValidEmailFormat(userData.email)) {
        return {
            success: false,
            message: 'Geçersiz e-posta formatý. Sadece isparta.edu.tr uzantýlý e-postalar kabul edilmektedir.'
        };
    }

    // Doðrulama token'ý oluþtur
    const verificationToken = generateVerificationToken();
    const userId = generateUniqueId();

    // Kullanýcý verilerini hazýrla
    const pendingUser = {
        id: userId,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        password: userData.password, // Gerçekte þifrelenmiþ olmalý
        verificationToken: verificationToken,
        isVerified: false,
        createdAt: new Date().toISOString()
    };

    // Bekleyen kullanýcýlarý localStorage'dan al
    let pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');

    // Kullanýcý zaten beklemede mi kontrol et
    const existingUserIndex = pendingUsers.findIndex(user => user.email === userData.email);

    if (existingUserIndex !== -1) {
        // Kullanýcýyý güncelle
        pendingUsers[existingUserIndex] = {
            ...pendingUsers[existingUserIndex],
            ...pendingUser
        };
    } else {
        // Yeni kullanýcý ekle
        pendingUsers.push(pendingUser);
    }

    // Güncellenmiþ listeyi kaydet
    localStorage.setItem('snk_pendingUsers', JSON.stringify(pendingUsers));

    // Doðrulama URL'i oluþtur (gerçekte backend tarafýndan iþlenecek)
    const verificationUrl = `verify.html?token=${verificationToken}&email=${encodeURIComponent(userData.email)}`;

    // Doðrulama detaylarýný konsola yaz (gerçek uygulamada e-posta gönderilir)
    console.log('Admin e-posta adresi:', 'mustafadmrsy125@gmail.com');
    console.log('Doðrulama URL:', verificationUrl);
    console.log('Doðrulama token:', verificationToken);

    // E-postanýn gönderildiðini simüle et
    return {
        success: true,
        message: 'Doðrulama e-postasý gönderildi. Lütfen e-postanýzý kontrol edin.',
        // Gerçek uygulamada bu bilgiler kullanýcýya sunulmaz, sadece geliþtirme amaçlýdýr
        debug: {
            token: verificationToken,
            url: verificationUrl
        }
    };
}

/**
 * E-posta doðrulama iþlemini gerçekleþtirir
 * 
 * @param {string} token - Doðrulama token'ý
 * @param {string} email - Kullanýcý e-postasý
 * @returns {Object} - Ýþlem sonucu
 */
function snk_verification_verifyEmail(token, email) {
    console.log('E-posta doðrulama isteði:', email, token);

    // Bekleyen kullanýcýlarý al
    const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');

    // Token ve e-posta ile eþleþen kullanýcýyý bul
    const userIndex = pendingUsers.findIndex(
        user => user.email === email && user.verificationToken === token
    );

    if (userIndex === -1) {
        return {
            success: false,
            message: 'Geçersiz doðrulama bilgileri veya süre dolmuþ.'
        };
    }

    // Kullanýcýyý al ve doðrulanmýþ kullanýcýlar listesine ekle
    const verifiedUser = { ...pendingUsers[userIndex] };
    delete verifiedUser.verificationToken; // Token'ý kaldýr
    verifiedUser.isVerified = true;
    verifiedUser.verifiedAt = new Date().toISOString();

    // Doðrulanmýþ kullanýcýlar listesini al
    let users = JSON.parse(localStorage.getItem('snk_users') || '[]');

    // Kullanýcý zaten var mý kontrol et
    const existingUserIndex = users.findIndex(user => user.email === email);

    if (existingUserIndex !== -1) {
        // Mevcut kullanýcýyý güncelle
        users[existingUserIndex] = {
            ...users[existingUserIndex],
            ...verifiedUser
        };
    } else {
        // Yeni kullanýcý ekle
        users.push(verifiedUser);
    }

    // Doðrulanmýþ kullanýcýlarý kaydet
    localStorage.setItem('snk_users', JSON.stringify(users));

    // Bekleyen kullanýcýdan kaldýr
    pendingUsers.splice(userIndex, 1);
    localStorage.setItem('snk_pendingUsers', JSON.stringify(pendingUsers));

    return {
        success: true,
        message: 'E-posta baþarýyla doðrulandý!',
        user: {
            name: verifiedUser.name,
            email: verifiedUser.email
        }
    };
}

/**
 * E-posta doðrulama iþlemi
 * @param {string} token - Doðrulama token'ý
 * @param {string} email - Doðrulanacak e-posta
 * @returns {Object} Ýþlem sonucu ve kullanýcý bilgisi
 */
function snk_verification_verifyEmail(token, email) {
    if (!token || !email) {
        return { success: false, message: 'Geçersiz doðrulama bilgileri.' };
    }

    try {
        // Bekleyen kullanýcýlarý al
        let pendingUsers = JSON.parse(localStorage.getItem(SNK_PENDING_USERS_KEY) || '[]');

        // Kullanýcýyý bul
        const userIndex = pendingUsers.findIndex(user =>
            user.email === email && user.verificationToken === token
        );

        if (userIndex === -1) {
            return { success: false, message: 'Geçersiz doðrulama bilgileri veya baðlantý süresi dolmuþ.' };
        }

        // Kullanýcýyý bekleyen listesinden al
        const verifiedUser = pendingUsers[userIndex];

        // Token bilgisini sil
        delete verifiedUser.verificationToken;

        // Doðrulama tarihini ekle
        verifiedUser.verifiedAt = new Date().toISOString();

        // Kayýtlý kullanýcýlarý al
        let users = JSON.parse(localStorage.getItem(SNK_USERS_KEY) || '[]');

        // Kullanýcýyý ekle
        users.push(verifiedUser);

        // Kullanýcýlarý kaydet
        localStorage.setItem(SNK_USERS_KEY, JSON.stringify(users));

        // Bekleyen kullanýcýdan kaldýr
        pendingUsers.splice(userIndex, 1);
        localStorage.setItem(SNK_PENDING_USERS_KEY, JSON.stringify(pendingUsers));

        return {
            success: true,
            message: 'E-posta baþarýyla doðrulandý. Artýk giriþ yapabilirsiniz.',
            user: verifiedUser
        };

    } catch (error) {
        console.error('Doðrulama hatasý:', error);
        return { success: false, message: 'Doðrulama sýrasýnda bir hata oluþtu.' };
    }
}

/**
 * Kullanýcý doðrulanmýþ mý kontrol et
 * @param {string} email - Kontrol edilecek e-posta
 * @returns {boolean} Kullanýcý doðrulanmýþ mý?
 */
function snk_verification_isUserVerified(email) {
    if (!email) return false;

    try {
        // Kayýtlý kullanýcýlarý al
        const users = JSON.parse(localStorage.getItem(SNK_USERS_KEY) || '[]');

        // Kullanýcýyý bul
        return users.some(user => user.email === email);

    } catch (error) {
        console.error('Kullanýcý doðrulama kontrolü hatasý:', error);
        return false;
    }
}

/**
 * Kullanýcý kayýt bekliyor mu kontrol et
 * @param {string} email - Kontrol edilecek e-posta
 * @returns {boolean} Kullanýcý kayýt bekliyor mu?
 */
function snk_verification_isPendingVerification(email) {
    if (!email) return false;

    try {
        // Bekleyen kullanýcýlarý al
        const pendingUsers = JSON.parse(localStorage.getItem(SNK_PENDING_USERS_KEY) || '[]');

        // Kullanýcýyý bul
        return pendingUsers.some(user => user.email === email);

    } catch (error) {
        console.error('Bekleyen kullanýcý kontrolü hatasý:', error);
        return false;
    }
}

// Modül dýþa aktarma
window.snk_verification_isValidEmail = snk_verification_isValidEmail;
window.snk_verification_sendVerificationEmail = snk_verification_sendVerificationEmail;
window.snk_verification_sendVerificationEmailSimulation = snk_verification_sendVerificationEmailSimulation;
window.snk_verification_verifyEmail = snk_verification_verifyEmail;
window.snk_verification_isUserVerified = snk_verification_isUserVerified;
window.snk_verification_isPendingVerification = snk_verification_isPendingVerification;
