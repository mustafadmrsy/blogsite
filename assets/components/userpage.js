// Kullan�c� profil sayfas� JavaScript i�levselli�i
document.addEventListener('DOMContentLoaded', function () {
    console.log('Userpage JS loaded');

    // Sekme de�i�tirme i�levselli�i - Temel i�levsellik
    function initializeTabs() {
        const userTabs = document.querySelectorAll('.snk-user-tab');
        const userSections = document.querySelectorAll('.snk-user-section');

        console.log('Tabs found:', userTabs.length);
        console.log('Sections found:', userSections.length);

        if (userTabs.length > 0 && userSections.length > 0) {
            userTabs.forEach(tab => {
                tab.addEventListener('click', function () {
                    const tabTarget = this.getAttribute('data-tab');
                    console.log('Tab clicked:', tabTarget);

                    // Aktif sekme i�aretini de�i�tir
                    userTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');

                    // �lgili b�l�m� g�ster
                    userSections.forEach(section => {
                        section.classList.remove('active');
                        if (section.id === `user_${tabTarget}Section`) {
                            section.classList.add('active');

                            // Animasyonlar� ba�lat
                            if (tabTarget === 'badges') {
                                animateBadges();
                            } else if (tabTarget === 'posts') {
                                animatePosts();
                            }
                        }
                    });
                });
            });

            // �lk y�klemede animasyonlar� ba�lat
            animatePosts();
        }
    }

    // Takip et butonu i�levselli�i
    function initializeFollowButton() {
        const followBtn = document.getElementById('user_followBtn');
        if (followBtn) {
            followBtn.addEventListener('click', function () {
                if (this.classList.contains('following')) {
                    this.classList.remove('following');
                    this.innerHTML = '<i class="fas fa-user-plus"></i> Takip Et';
                } else {
                    this.classList.add('following');
                    this.innerHTML = '<i class="fas fa-check"></i> Takip Ediliyor';
                }
            });
        }
    }

    // Mesaj g�nder butonu i�levselli�i
    function initializeMessageButton() {
        const messageBtn = document.getElementById('user_messageBtn');
        if (messageBtn) {
            messageBtn.addEventListener('click', function () {
                alert('Mesaj �zelli�i yak�nda eklenecek!');
            });
        }
    }

    // Yaz� kartlar� i�in animasyonlar
    function animatePosts() {
        const posts = document.querySelectorAll('.snk-user-post-card');
        console.log('Animating posts:', posts.length);
        posts.forEach((post, index) => {
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';

            setTimeout(() => {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Rozet kartlar� i�in animasyonlar
    function animateBadges() {
        const badges = document.querySelectorAll('.snk-badge-card');
        console.log('Animating badges:', badges.length);
        badges.forEach((badge, index) => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                badge.style.opacity = '1';
                badge.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    // Dark Mode entegrasyonu
    function initializeDarkMode() {
        // Dark mode durumunu localStorage'dan kontrol et
        const currentTheme = localStorage.getItem('eren-theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('eren-dark-theme');
        }

        // Dark mode toggle i�levselli�i
        const darkModeToggle = document.querySelector('.eren-theme-switch');
        if (darkModeToggle) {
            const checkBox = darkModeToggle.querySelector('input[type="checkbox"]');
            if (checkBox) {
                // Mevcut duruma g�re checkbox'� ayarla
                checkBox.checked = currentTheme === 'dark';

                checkBox.addEventListener('change', function () {
                    if (this.checked) {
                        document.body.classList.add('eren-dark-theme');
                        localStorage.setItem('eren-theme', 'dark');
                    } else {
                        document.body.classList.remove('eren-dark-theme');
                        localStorage.setItem('eren-theme', 'light');
                    }
                });
            }
        }
    }

    // T�m i�levleri ba�lat
    initializeTabs();
    initializeFollowButton();
    initializeMessageButton();
    initializeDarkMode();
});
