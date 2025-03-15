/**
 * Admin Users Management - Senirkent Blog
 * Bu dosya admin panelindeki kullan�c� y�netimi i�lemlerini y�netir.
 */

// DOM Elements - Kullan�c� container'lar�
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

// Ge�ici veri tutaca��m�z de�i�ken
let userToReject = null;

// Sayfa y�klendi�inde
document.addEventListener('DOMContentLoaded', function () {
    console.log('Admin kullan�c� y�netimi ba�lat�ld�');
    initUserManagement();
});

// Kullan�c� y�netimi ba�lat
function initUserManagement() {
    // DOM elementleri kontrol et
    if (!pendingUsersContainer) console.error('pendingUsersContainer bulunamad�');
    if (!verifiedUsersContainer) console.error('verifiedUsersContainer bulunamad�');
    if (!registeredUsersContainer) console.error('registeredUsersContainer bulunamad�');

    // Event listeners
    document.getElementById('refresh-button').addEventListener('click', loadUsers);

    // Yerel kullan�c�lar� g�r�nt�leme butonu
    const viewLocalUsersButton = document.getElementById('view-local-users-button');
    if (viewLocalUsersButton) {
        viewLocalUsersButton.addEventListener('click', showLocalUsers);
    } else {
        console.error('view-local-users-button bulunamad�');
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

    // Kullan�c�lar� y�kle
    loadUsers();
}

// Kullan�c�lar� y�kle - Sadece yerel depo kullanarak
function loadUsers() {
    showLoaders(true);

    try {
        console.log('Kullan�c� y�kleme i�lemi ba�lat�ld�');

        // Bekleyen kullan�c�lar� al
        const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
        console.log('Bekleyen kullan�c� verileri:', pendingUsers);

        // Onaylanm�� kullan�c�lar� al
        const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');
        console.log('Onaylanm�� kullan�c� verileri:', verifiedUsers);

        // Bekleyen kullan�c�lar (onay bekleyenler)
        if (pendingUsersContainer) {
            if (pendingUsers && pendingUsers.length > 0) {
                displayUsers('pending-users', pendingUsers, true);
            } else {
                pendingUsersContainer.innerHTML = '<div class="no-users">Bekleyen kullan�c� bulunmamaktad�r.</div>';
            }
        }

        // Onaylanm�� kullan�c�lar
        if (verifiedUsersContainer) {
            if (verifiedUsers && verifiedUsers.length > 0) {
                displayUsers('verified-users', verifiedUsers, false);
            } else {
                verifiedUsersContainer.innerHTML = '<div class="no-users">Onaylanm�� kullan�c� bulunmamaktad�r.</div>';
            }
        }

        // Kay�tl� kullan�c�lar (onaylanm�� kullan�c�larla ayn�)
        if (registeredUsersContainer) {
            if (verifiedUsers && verifiedUsers.length > 0) {
                displayUsers('registered-users', verifiedUsers, false, true);
            } else {
                registeredUsersContainer.innerHTML = '<div class="no-users">Kay�tl� kullan�c� bulunmamaktad�r.</div>';
            }
        }

    } catch (error) {
        console.error('Kullan�c�lar y�klenirken hata:', error);
        if (pendingUsersContainer) pendingUsersContainer.innerHTML = '<div class="no-users">Kullan�c�lar� y�klerken bir hata olu�tu.</div>';
        if (verifiedUsersContainer) verifiedUsersContainer.innerHTML = '<div class="no-users">Kullan�c�lar� y�klerken bir hata olu�tu.</div>';
        if (registeredUsersContainer) registeredUsersContainer.innerHTML = '<div class="no-users">Kullan�c�lar� y�klerken bir hata olu�tu.</div>';
    } finally {
        showLoaders(false);
    }
}

// Kullan�c�lar� g�r�nt�le
function displayUsers(containerId, users, isPending, isRegistered = false) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container bulunamad�: #${containerId}`);
        return;
    }

    if (!users || users.length === 0) {
        container.innerHTML = '<div class="no-users">Kullan�c� bulunamad�.</div>';
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

        // Durum g�sterimi
        let statusDisplay = '';
        if (user.pendingApproval === true) {
            statusDisplay = '<div class="status-badge pending">Onay Bekliyor</div>';
        } else if (user.isVerified === true) {
            statusDisplay = '<div class="status-badge verified">Onaylanm��</div>';
        } else if (isRegistered) {
            statusDisplay = '<div class="status-badge active">Kay�tl� Kullan�c�</div>';
        }

        html += `
        <div class="user-card">
            <div class="user-info">
                <div class="user-name">${user.name || ''} ${user.surname || ''}</div>
                <div class="user-email">${user.email || 'Email yok'}</div>
                <div class="user-password">�ifre: ${user.password || 'Belirtilmemi�'}</div>
                <div class="user-date">Kay�t: ${dateDisplay}</div>
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
    console.log(`${containerId} paneline ${users.length} kullan�c� y�klendi`);
}

// Y�kleyicileri g�ster/gizle
function showLoaders(show) {
    if (pendingLoader) pendingLoader.style.display = show ? 'block' : 'none';
    if (verifiedLoader) verifiedLoader.style.display = show ? 'block' : 'none';
    if (registeredLoader) registeredLoader.style.display = show ? 'block' : 'none';
}

// Yard�mc� fonksiyonlar
// Tarih format�n� okunakl� hale getir
function formatDate(dateString) {
    if (!dateString) return 'Belirtilmemi�';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Ge�ersiz Tarih';

        return date.toLocaleString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.error('Tarih format� hatas�:', e);
        return 'Hatal� Tarih';
    }
}

// Onay bekleme ekran�n� g�ster
function showPendingApproval() {
    if (pendingApprovalModal) {
        pendingApprovalModal.style.display = 'flex';
    }
}

// Reddetme onay�n� g�ster
function showRejectConfirm(email) {
    userToReject = email;
    if (confirmModal) {
        confirmModal.style.display = 'flex';
    }
}

// Kullan�c�y� reddet - Yerel depodan silme i�lemi
async function rejectUser(email) {
    try {
        console.log('Kullan�c� reddediliyor:', email);

        // Yerel depodan kullan�c�y� sil
        const users = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
        const userIndex = users.findIndex(user => user.email === email);

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            localStorage.setItem('snk_pendingUsers', JSON.stringify(users));

            showAlert('Ba�ar�l�', 'Kullan�c� ba�ar�yla reddedildi.', 'success');
            loadUsers(); // Kullan�c� listesini yenile
        } else {
            showAlert('Hata', 'Kullan�c� bulunamad�.', 'error');
        }
    } catch (error) {
        console.error('Kullan�c� reddedilirken hata:', error);
        showAlert('Hata', 'Kullan�c� reddedilirken bir hata olu�tu: ' + error.message, 'error');
    }
}

// Kullan�c�y� onayla
async function approveUser(email) {
    try {
        console.log('Kullan�c� onaylan�yor:', email);

        // Onay bekleyen kullan�c�lar� al
        const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');
        const userIndex = pendingUsers.findIndex(user => user.email === email);

        if (userIndex === -1) {
            showAlert('Hata', 'Onaylanacak kullan�c� bulunamad�.', 'error');
            return;
        }

        // Kullan�c�y� bulundu, onaylanm�� kullan�c�lar listesine ekle
        const user = pendingUsers[userIndex];
        user.isVerified = true;
        user.pendingApproval = false;
        user.approvedAt = new Date().toISOString();

        // Onaylanm�� kullan�c�lar listesini al ve g�ncelle
        const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');

        // E-posta kontrol� yap, varsa g�ncelle, yoksa ekle
        const existingIndex = verifiedUsers.findIndex(u => u.email === email);
        if (existingIndex !== -1) {
            verifiedUsers[existingIndex] = user;
        } else {
            verifiedUsers.push(user);
        }

        // Onaylanm�� kullan�c�lar� kaydet
        localStorage.setItem('snk_verifiedUsers', JSON.stringify(verifiedUsers));

        // Ayr�ca snk_users listesine de ekle - oturum a�ma i�lemi i�in
        const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
        const userInUsersIndex = users.findIndex(u => u.email === email);
        if (userInUsersIndex !== -1) {
            users[userInUsersIndex] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem('snk_users', JSON.stringify(users));

        // Kullan�c�y� bekleyenler listesinden ��kar
        pendingUsers.splice(userIndex, 1);
        localStorage.setItem('snk_pendingUsers', JSON.stringify(pendingUsers));

        // UI g�ncelle
        showAlert('Ba�ar�l�', 'Kullan�c� ba�ar�yla onayland�.', 'success');

        // Kullan�c� listesini yenile
        loadUsers();

    } catch (error) {
        console.error('Kullan�c� onaylan�rken hata:', error);
        showAlert('Hata', 'Kullan�c� onaylan�rken bir hata olu�tu: ' + error.message, 'error');
    }
}

// Bildirim g�ster
function showAlert(title, message, type) {
    if (!alertBox) {
        console.error('Alert box bulunamad�');
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

// Yerel kullan�c�y� sil
function removeLocalUser(email) {
    try {
        // Onaylanm�� kullan�c�lar� al
        const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');
        const userIndex = verifiedUsers.findIndex(user => user.email === email);

        if (userIndex !== -1) {
            const removedUser = verifiedUsers[userIndex];
            verifiedUsers.splice(userIndex, 1);
            localStorage.setItem('snk_verifiedUsers', JSON.stringify(verifiedUsers));

            // Ayn� zamanda snk_users listesinden de ��kar
            const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
            const userUsersIndex = users.findIndex(user => user.email === email);

            if (userUsersIndex !== -1) {
                users.splice(userUsersIndex, 1);
                localStorage.setItem('snk_users', JSON.stringify(users));
            }

            // E�er silinen kullan�c� �u anda oturum a�m��sa oturumu kapat
            const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || '{}');
            if (currentUser && currentUser.email === email) {
                localStorage.removeItem('snk_currentUser');
                console.log('Silinen kullan�c� aktif oturumu oldu�u i�in, oturum bilgileri temizlendi');
            }

            showAlert('Ba�ar�l�', 'Kullan�c� ba�ar�yla silindi.', 'success');
            loadUsers(); // Kullan�c� listesini yenile
        } else {
            showAlert('Hata', 'Silinecek kullan�c� bulunamad�.', 'error');
        }
    } catch (error) {
        console.error('Kullan�c� silinirken hata:', error);
        showAlert('Hata', 'Kullan�c� silinirken bir hata olu�tu: ' + error.message, 'error');
    }
}

// Yerel kay�tl� kullan�c�lar� g�ster
function showLocalUsers() {
    console.log('Yerel kullan�c�lar g�r�nt�leniyor...');

    const localUsersModal = document.getElementById('local-users-modal');
    const localUsersContainer = document.getElementById('local-users-container');

    if (!localUsersModal || !localUsersContainer) {
        console.error('local-users-modal veya local-users-container bulunamad�');
        showAlert('Hata', 'Yerel kullan�c�lar g�r�nt�lenemiyor: UI elementleri bulunamad�', 'error');
        return;
    }

    // T�m localStorage'dan kullan�c�lar� al
    const users = JSON.parse(localStorage.getItem('snk_users') || '[]');
    const verifiedUsers = JSON.parse(localStorage.getItem('snk_verifiedUsers') || '[]');
    const pendingUsers = JSON.parse(localStorage.getItem('snk_pendingUsers') || '[]');

    // T�m kullan�c�lar� birle�tir
    const allUsers = [
        ...users.map(user => ({ ...user, source: 'snk_users' })),
        ...verifiedUsers.map(user => ({ ...user, source: 'snk_verifiedUsers' })),
        ...pendingUsers.map(user => ({ ...user, source: 'snk_pendingUsers' }))
    ];

    // E-posta adresine g�re benzersiz kullan�c�lar� filtrele
    const uniqueEmails = new Set();
    const uniqueUsers = allUsers.filter(user => {
        if (!user.email || uniqueEmails.has(user.email)) return false;
        uniqueEmails.add(user.email);
        return true;
    });

    let html = '';

    if (uniqueUsers.length === 0) {
        html = '<div class="no-users">Yerel kay�tl� kullan�c� bulunmamaktad�r.</div>';
    } else {
        html = '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
        html += '<thead><tr style="background-color: #f2f2f2; text-align: left;">';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Ad</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Soyad</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">E-posta</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">�ifre</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Durum</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Kay�t Tarihi</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">Kaynak</th>';
        html += '<th style="padding: 10px; border: 1px solid #ddd;">��lemler</th>';
        html += '</tr></thead><tbody>';

        uniqueUsers.forEach((user) => {
            // Durum belirleme
            let statusText = 'Belirsiz';
            let statusColor = '#888';

            if (user.pendingApproval) {
                statusText = 'Onay Bekliyor';
                statusColor = '#f39c12';
            } else if (user.isVerified) {
                statusText = 'Onaylanm��';
                statusColor = '#27ae60';
            } else if (user.source === 'snk_users') {
                statusText = 'Kay�tl�';
                statusColor = '#3498db';
            }

            // Tarih format�
            const dateDisplay = user.createdAt ? formatDate(user.createdAt) :
                (user.registrationDate ? formatDate(user.registrationDate) : 'Belirtilmemi�');

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

    // Her kullan�c� i�in silme butonlar�na olay dinleyicileri ekle
    document.querySelectorAll('.delete-user-button').forEach(button => {
        button.addEventListener('click', function () {
            const email = this.getAttribute('data-email');
            const source = this.getAttribute('data-source');

            if (confirm(`${email} adresli kullan�c�y� silmek istedi�inize emin misiniz?`)) {
                deleteUserByEmail(email, source);
                // Modal� yeniden y�kle
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
        if (confirm('T�m yerel kullan�c� kay�tlar�n� silmek istedi�inize emin misiniz? Bu i�lem geri al�namaz.')) {
            localStorage.removeItem('snk_users');
            localStorage.removeItem('snk_verifiedUsers');
            localStorage.removeItem('snk_pendingUsers');
            localStorage.removeItem('snk_currentUser');

            showAlert('Ba�ar�l�', 'T�m yerel kullan�c� kay�tlar� temizlendi.', 'success');
            localUsersModal.style.display = 'none';

            // Kullan�c� listesini yenile
            loadUsers();
        }
    });
}

// E-posta ve kayna�a g�re kullan�c�y� sil
function deleteUserByEmail(email, source) {
    try {
        console.log(`Kullan�c� siliniyor: ${email} (Kaynak: ${source})`);

        // �lgili kaynaktaki veriyi al
        const sourceKey = source || 'snk_users'; // Varsay�lan olarak snk_users
        const users = JSON.parse(localStorage.getItem(sourceKey) || '[]');

        // Kullan�c�y� bul ve sil
        const userIndex = users.findIndex(user => user.email === email);

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            localStorage.setItem(sourceKey, JSON.stringify(users));

            // Di�er kaynaklarda da ayn� e-postaya sahip kullan�c�y� sil
            const otherSources = ['snk_users', 'snk_verifiedUsers', 'snk_pendingUsers'].filter(key => key !== sourceKey);

            otherSources.forEach(key => {
                const otherUsers = JSON.parse(localStorage.getItem(key) || '[]');
                const otherIndex = otherUsers.findIndex(user => user.email === email);

                if (otherIndex !== -1) {
                    otherUsers.splice(otherIndex, 1);
                    localStorage.setItem(key, JSON.stringify(otherUsers));
                    console.log(`Kullan�c� bu kaynaktan da silindi: ${key}`);
                }
            });

            // E�er �u anda oturum a�an kullan�c� siliniyorsa, oturumu kapat
            const currentUser = JSON.parse(localStorage.getItem('snk_currentUser') || '{}');
            if (currentUser && currentUser.email === email) {
                localStorage.removeItem('snk_currentUser');
                console.log('Silinen kullan�c� aktif oturumu oldu�u i�in, oturum bilgileri temizlendi');
            }

            showAlert('Ba�ar�l�', 'Kullan�c� ba�ar�yla silindi.', 'success');

            // Kullan�c� listesini yenile
            loadUsers();
            return true;
        } else {
            showAlert('Hata', 'Kullan�c� bulunamad�.', 'error');
            return false;
        }
    } catch (error) {
        console.error('Kullan�c� silinirken hata:', error);
        showAlert('Hata', 'Kullan�c� silinirken bir hata olu�tu: ' + error.message, 'error');
        return false;
    }
}
