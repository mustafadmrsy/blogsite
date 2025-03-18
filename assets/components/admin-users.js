/**
 * Admin Users Management - Senirkent Blog
 * Bu dosya admin panelindeki kullanýcý yönetimi iþlemlerini yönetir.
 */

// DOM Elements - Kullanýcý container'larý
const pendingUsersContainer = document.getElementById('pending-users');
const verifiedUsersContainer = document.getElementById('verified-users');
const registeredUsersContainer = document.getElementById('registered-users');

// Loader Elements
const pendingLoader = document.getElementById('pending-loader');
const verifiedLoader = document.getElementById('verified-loader');
const registeredLoader = document.getElementById('registered-loader');

// Modal Elements
const confirmModal = document.getElementById('confirm-modal');
const confirmCancel = document.getElementById('confirm-cancel');
const confirmProceed = document.getElementById('confirm-proceed');
const pendingApprovalModal = document.getElementById('pending-approval-modal');
const pendingApprovalOk = document.getElementById('pending-approval-ok');
const alertBox = document.getElementById('alert-box');

// Geçici veri tutacaðýmýz deðiþken
let userToReject = null;

// Sayfa yüklendiðinde
document.addEventListener('DOMContentLoaded', function () {
    console.log('Admin kullanýcý yönetimi baþlatýldý');
    initUserManagement();
});

// Kullanýcý yönetimi baþlat
function initUserManagement() {
    // DOM elementleri kontrol et
    if (!pendingUsersContainer) console.error('pendingUsersContainer bulunamadý');
    if (!verifiedUsersContainer) console.error('verifiedUsersContainer bulunamadý');
    if (!registeredUsersContainer) console.error('registeredUsersContainer bulunamadý');

    // Event listeners
    document.getElementById('refresh-button').addEventListener('click', loadUsers);

    // Yerel kullanýcýlarý görüntüleme butonu
    const viewLocalUsersButton = document.getElementById('view-local-users-button');
    if (viewLocalUsersButton) {
        viewLocalUsersButton.addEventListener('click', showLocalUsers);
    } else {
        console.error('view-local-users-button bulunamadý');
    }

    confirmCancel.addEventListener('click', () => {
        confirmModal.style.display = 'none';
        userToReject = null;
    });

    confirmProceed.addEventListener('click', () => {
        if (userToReject) {
            rejectUser(userToReject);
            confirmModal.style.display = 'none';
            userToReject = null;
        }
    });

    // Kullanýcýlarý yükle
    loadUsers();
}

// Kullanýcýlarý yükle - Sadece yerel depo kullanarak
function loadUsers() {
    showLoaders(true);

    try {
        console.log('Kullanýcý yükleme iþlemi baþlatýldý');

        // Bekleyen kullanýcýlarý al
        const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
        console.log('Bekleyen kullanýcý verileri:', pendingUsers);

        // Onaylanmýþ kullanýcýlarý al
        const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');
        console.log('Onaylanmýþ kullanýcý verileri:', verifiedUsers);

        // Bekleyen kullanýcýlar (onay bekleyenler)
        if (pendingUsersContainer) {
            if (pendingUsers && pendingUsers.length > 0) {
                displayUsers('pending-users', pendingUsers, true);
            } else {
                pendingUsersContainer.innerHTML = '<div class="no-users">Bekleyen kullanýcý bulunmamaktadýr.</div>';
            }
        }

        // Onaylanmýþ kullanýcýlar
        if (verifiedUsersContainer) {
            if (verifiedUsers && verifiedUsers.length > 0) {
                displayUsers('verified-users', verifiedUsers, false);
            } else {
                verifiedUsersContainer.innerHTML = '<div class="no-users">Onaylanmýþ kullanýcý bulunmamaktadýr.</div>';
            }
        }

        // Kayýtlý kullanýcýlar (onaylanmýþ kullanýcýlarla ayný)
        if (registeredUsersContainer) {
            if (verifiedUsers && verifiedUsers.length > 0) {
                displayUsers('registered-users', verifiedUsers, false, true);
            } else {
                registeredUsersContainer.innerHTML = '<div class="no-users">Kayýtlý kullanýcý bulunmamaktadýr.</div>';
            }
        }

    } catch (error) {
        console.error('Kullanýcýlar yüklenirken hata:', error);
        if (pendingUsersContainer) pendingUsersContainer.innerHTML = '<div class="no-users">Kullanýcýlarý yüklerken bir hata oluþtu.</div>';
        if (verifiedUsersContainer) verifiedUsersContainer.innerHTML = '<div class="no-users">Kullanýcýlarý yüklerken bir hata oluþtu.</div>';
        if (registeredUsersContainer) registeredUsersContainer.innerHTML = '<div class="no-users">Kullanýcýlarý yüklerken bir hata oluþtu.</div>';
    } finally {
        showLoaders(false);
    }
}

// Kullanýcýlarý görüntüle
function displayUsers(containerId, users, isPending, isRegistered = false) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container bulunamadý: #${containerId}`);
        return;
    }

    if (!users || users.length === 0) {
        container.innerHTML = '<div class="no-users">Kullanýcý bulunamadý.</div>';
        return;
    }

    let html = '';

    users.forEach(user => {
        // Tarih bilgisi kontrol
        let dateDisplay = '';
        if (user.registrationDate) {
            dateDisplay = formatDate(user.registrationDate);
        } else if (user.createdAt) {
            dateDisplay = formatDate(user.createdAt);
        } else {
            dateDisplay = 'Tarih bilgisi yok';
        }

        // Durum gösterimi
        let statusDisplay = '';
        if (user.pendingApproval === true) {
            statusDisplay = '<div class="status-badge pending">Onay Bekliyor</div>';
        } else if (user.isVerified === true) {
            statusDisplay = '<div class="status-badge verified">Onaylanmýþ</div>';
        } else if (isRegistered) {
            statusDisplay = '<div class="status-badge active">Kayýtlý Kullanýcý</div>';
        }

        html += `
        <div class="user-card">
            <div class="user-info">
                <div class="user-name">${user.name || ''} ${user.surname || ''}</div>
                <div class="user-email">${user.email || 'Email yok'}</div>
                <div class="user-password">Þifre: ${user.password || 'Belirtilmemiþ'}</div>
                <div class="user-date">Kayýt: ${dateDisplay}</div>
                ${statusDisplay}
            </div>
            <div class="action-buttons">
                ${isPending ? `
                    <button class="action-button approve-btn" onclick="approveUser('${user.email}')">Onayla</button>
                    <button class="action-button reject-btn" onclick="showRejectConfirm('${user.email}')">Reddet</button>
                ` : `
                    <button class="action-button reject-btn" onclick="removeLocalUser('${user.email}')">Sil</button>
                `}
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
    console.log(`${containerId} paneline ${users.length} kullanýcý yüklendi`);
}

// Yükleyicileri göster/gizle
function showLoaders(show) {
    if (pendingLoader) pendingLoader.style.display = show ? 'block' : 'none';
    if (verifiedLoader) verifiedLoader.style.display = show ? 'block' : 'none';
    if (registeredLoader) registeredLoader.style.display = show ? 'block' : 'none';
}

// Yardýmcý fonksiyonlar
// Tarih formatýný okunaklý hale getir
function formatDate(dateString) {
    if (!dateString) return 'Belirtilmemiþ';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Geçersiz Tarih';

        return date.toLocaleString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.error('Tarih formatý hatasý:', e);
        return 'Hatalý Tarih';
    }
}

// Onay bekleme ekranýný göster
function showPendingApproval() {
    if (pendingApprovalModal) {
        pendingApprovalModal.style.display = 'flex';
    }
}

// Reddetme onayýný göster
function showRejectConfirm(email) {
    userToReject = email;
    if (confirmModal) {
        confirmModal.style.display = 'flex';
    }
}

// Kullanýcýyý reddet - Yerel depodan silme iþlemi
async function rejectUser(email) {
    try {
        console.log('Kullanýcý reddediliyor:', email);

        // Yerel depodan kullanýcýyý sil
        const users = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
        const userIndex = users.findIndex(user => user.email === email);

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            localStorage.setItem('snk_pendingUsers', JSON.stringify(users));

            showAlert('Baþarýlý', 'Kullanýcý baþarýyla reddedildi.', 'success');
            loadUsers(); // Kullanýcý listesini yenile
        } else {
            showAlert('Hata', 'Kullanýcý bulunamadý.', 'error');
        }
    } catch (error) {
        console.error('Kullanýcý reddedilirken hata:', error);
        showAlert('Hata', 'Kullanýcý reddedilirken bir hata oluþtu: ' + error.message, 'error');
    }
}

// Kullanýcýyý onayla
async function approveUser(email) {
    try {
        console.log('Kullanýcý onaylanýyor:', email);

        // Onay bekleyen kullanýcýlarý al
        const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
        const userIndex = pendingUsers.findIndex(user => user.email === email);

        if (userIndex === -1) {
            showAlert('Hata', 'Onaylanacak kullanýcý bulunamadý.', 'error');
            return;
        }

        // Kullanýcýyý bulundu, onaylanmýþ kullanýcýlar listesine ekle
        const user = pendingUsers[userIndex];
        user.isVerified = true;
        user.pendingApproval = false;
        user.approvedAt = new Date().toISOString();

        // Onaylanmýþ kullanýcýlar listesini al ve güncelle
        const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');

        // E-posta kontrolü yap, varsa güncelle, yoksa ekle
        const existingIndex = verifiedUsers.findIndex(u => u.email === email);
        if (existingIndex !== -1) {
            verifiedUsers[existingIndex] = user;
        } else {
            verifiedUsers.push(user);
        }

        // Onaylanmýþ kullanýcýlarý kaydet
        localStorage.setItem('snk_verifiedUsers', JSON.stringify(verifiedUsers));

        // Ayrýca snk_users listesine de ekle - oturum açma iþlemi için
        const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
        const userInUsersIndex = users.findIndex(u => u.email === email);
        if (userInUsersIndex !== -1) {
            users[userInUsersIndex] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem('snk_users', JSON.stringify(users));

        // Kullanýcýyý bekleyenler listesinden çýkar
        pendingUsers.splice(userIndex, 1);
        localStorage.setItem('snk_pendingUsers', JSON.stringify(pendingUsers));

        // UI güncelle
        showAlert('Baþarýlý', 'Kullanýcý baþarýyla onaylandý.', 'success');

        // Kullanýcý listesini yenile
        loadUsers();

    } catch (error) {
        console.error('Kullanýcý onaylanýrken hata:', error);
        showAlert('Hata', 'Kullanýcý onaylanýrken bir hata oluþtu: ' + error.message, 'error');
    }
}

// Bildirim göster
function showAlert(title, message, type) {
    if (!alertBox) {
        console.error('Alert box bulunamadý');
        alert(`${title}: ${message}`);
        return;
    }

    alertBox.querySelector('.alert-title').textContent = title;
    alertBox.querySelector('.alert-message').textContent = message;

    alertBox.className = `alert-box ${type}`;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}

// Yerel kullanýcýyý sil
function removeLocalUser(email) {
    try {
        // Onaylanmýþ kullanýcýlarý al
        const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');
        const userIndex = verifiedUsers.findIndex(user => user.email === email);

        if (userIndex !== -1) {
            const removedUser = verifiedUsers[userIndex];
            verifiedUsers.splice(userIndex, 1);
            localStorage.setItem('snk_verifiedUsers', JSON.stringify(verifiedUsers));

            // Ayný zamanda snk_users listesinden de çýkar
            const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
            const userUsersIndex = users.findIndex(user => user.email === email);

            if (userUsersIndex !== -1) {
                users.splice(userUsersIndex, 1);
                localStorage.setItem('snk_users', JSON.stringify(users));
            }

            // Eðer silinen kullanýcý þu anda oturum açmýþsa oturumu kapat
            const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || '{}');
            if (currentUser && currentUser.email === email) {
                localStorage.removeItem('snk_currentUser');
                console.log('Silinen kullanýcý aktif oturumu olduðu için, oturum bilgileri temizlendi');
            }

            showAlert('Baþarýlý', 'Kullanýcý baþarýyla silindi.', 'success');
            loadUsers(); // Kullanýcý listesini yenile
        } else {
            showAlert('Hata', 'Silinecek kullanýcý bulunamadý.', 'error');
        }
    } catch (error) {
        console.error('Kullanýcý silinirken hata:', error);
        showAlert('Hata', 'Kullanýcý silinirken bir hata oluþtu: ' + error.message, 'error');
    }
}

// Yerel kayýtlý kullanýcýlarý göster
function showLocalUsers() {
    console.log('Yerel kullanýcýlar görüntüleniyor...');

    const localUsersModal = document.getElementById('local-users-modal');
    const localUsersContainer = document.getElementById('local-users-container');

    if (!localUsersModal || !localUsersContainer) {
        console.error('local-users-modal veya local-users-container bulunamadý');
        showAlert('Hata', 'Yerel kullanýcýlar görüntülenemiyor: UI elementleri bulunamadý', 'error');
        return;
    }

    // Tüm localStorage'dan kullanýcýlarý al
    const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
    const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');
    const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');

    // Tüm kullanýcýlarý birleþtir
    const allUsers = [
        ...users.map(user => ({ ...user, source: 'snk_users' })),
        ...verifiedUsers.map(user => ({ ...user, source: 'snk_verifiedUsers' })),
        ...pendingUsers.map(user => ({ ...user, source: 'snk_pendingUsers' }))
    ];

    // E-posta adresine göre benzersiz kullanýcýlarý filtrele
    const uniqueEmails = new Set();
    const uniqueUsers = allUsers.filter(user => {
        if (!user.email || uniqueEmails.has(user.email)) return false;
        uniqueEmails.add(user.email);
        return true;
    });

    let html = '';

    if (uniqueUsers.length === 0) {
        html = '<div class="no-users">Yerel kayýtlý kullanýcý bulunmamaktadýr.</div>';
    } else {
        html = '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
        html += '<thead><tr style="background-color: #f2f2f2; text-align: left;">';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Ad</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Soyad</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">E-posta</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Þifre</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Durum</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Kayýt Tarihi</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Kaynak</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Ýþlemler</th>';
        html += '</tr></thead><tbody>';

        uniqueUsers.forEach((user) => {
            // Durum belirleme
            let statusText = 'Belirsiz';
            let statusColor = '#888';

            if (user.pendingApproval) {
                statusText = 'Onay Bekliyor';
                statusColor = '#f39c12';
            } else if (user.isVerified) {
                statusText = 'Onaylanmýþ';
                statusColor = '#27ae60';
            } else if (user.source === 'snk_users') {
                statusText = 'Kayýtlý';
                statusColor = '#3498db';
            }

            // Tarih formatý
            const dateDisplay = user.createdAt ? formatDate(user.createdAt) :
                (user.registrationDate ? formatDate(user.registrationDate) : 'Belirtilmemiþ');

            html += `<tr style="border-bottom: 1px solid #ddd;">`;
            html += `<td style="padding: 10px; border: 1px solid #ddd;">${user.name || '-'}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #ddd;">${user.surname || '-'}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #ddd;">${user.email || '-'}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #ddd;">${user.password || '-'}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #ddd;"><span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></td>`;
            html += `<td style="padding: 10px; border: 1px solid #ddd;">${dateDisplay}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #ddd;">${user.source}</td>`;
            html += `<td style="padding: 10px; border: 1px solid #ddd;">
                <button class="delete-user-button" data-email="${user.email}" data-source="${user.source}" style="background-color: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                    <i class="fas fa-trash"></i> Sil
                </button>
            </td>`;
            html += `</tr>`;
        });

        html += '</tbody></table>';
    }

    localUsersContainer.innerHTML = html;
    localUsersModal.style.display = 'flex';

    // Her kullanýcý için silme butonlarýna olay dinleyicileri ekle
    document.querySelectorAll('.delete-user-button').forEach(button => {
        button.addEventListener('click', function () {
            const email = this.getAttribute('data-email');
            const source = this.getAttribute('data-source');

            if (confirm(`${email} adresli kullanýcýyý silmek istediðinize emin misiniz?`)) {
                deleteUserByEmail(email, source);
                // Modalý yeniden yükle
                showLocalUsers();
            }
        });
    });

    // Modal kapatma butonu
    document.getElementById('local-users-close').addEventListener('click', () => {
        localUsersModal.style.display = 'none';
    });

    // LocalStorage temizleme butonu
    document.getElementById('local-users-clear').addEventListener('click', () => {
        if (confirm('Tüm yerel kullanýcý kayýtlarýný silmek istediðinize emin misiniz? Bu iþlem geri alýnamaz.')) {
            localStorage.removeItem('snk_users');
            localStorage.removeItem('snk_verifiedUsers');
            localStorage.removeItem('snk_pendingUsers');
            localStorage.removeItem('snk_currentUser');

            showAlert('Baþarýlý', 'Tüm yerel kullanýcý kayýtlarý temizlendi.', 'success');
            localUsersModal.style.display = 'none';

            // Kullanýcý listesini yenile
            loadUsers();
        }
    });
}

// E-posta ve kaynaða göre kullanýcýyý sil
function deleteUserByEmail(email, source) {
    try {
        console.log(`Kullanýcý siliniyor: ${email} (Kaynak: ${source})`);

        // Ýlgili kaynaktaki veriyi al
        const sourceKey = source || 'snk_users'; // Varsayýlan olarak snk_users
        const users = JSON.parse(localStorage.getItem(sourceKey) || '[]');

        // Kullanýcýyý bul ve sil
        const userIndex = users.findIndex(user => user.email === email);

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            localStorage.setItem(sourceKey, JSON.stringify(users));

            // Diðer kaynaklarda da ayný e-postaya sahip kullanýcýyý sil
            const otherSources = ['snk_users', 'snk_verifiedUsers', 'snk_pendingUsers'].filter(key => key !== sourceKey);

            otherSources.forEach(key => {
                const otherUsers = JSON.parse(localStorage.getItem(key) || '[]');
                const otherIndex = otherUsers.findIndex(user => user.email === email);

                if (otherIndex !== -1) {
                    otherUsers.splice(otherIndex, 1);
                    localStorage.setItem(key, JSON.stringify(otherUsers));
                    console.log(`Kullanýcý bu kaynaktan da silindi: ${key}`);
                }
            });

            // Eðer þu anda oturum açan kullanýcý siliniyorsa, oturumu kapat
            const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || '{}');
            if (currentUser && currentUser.email === email) {
                localStorage.removeItem('snk_currentUser');
                console.log('Silinen kullanýcý aktif oturumu olduðu için, oturum bilgileri temizlendi');
            }

            showAlert('Baþarýlý', 'Kullanýcý baþarýyla silindi.', 'success');

            // Kullanýcý listesini yenile
            loadUsers();
            return true;
        } else {
            showAlert('Hata', 'Kullanýcý bulunamadý.', 'error');
            return false;
        }
    } catch (error) {
        console.error('Kullanýcý silinirken hata:', error);
        showAlert('Hata', 'Kullanýcý silinirken bir hata oluþtu: ' + error.message, 'error');
        return false;
    }
}
