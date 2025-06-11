document.addEventListener("DOMContentLoaded", () => {
    // === Bagian Navigasi Mobile & Scroll Header ===

    // Toggle menu mobile
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const header = document.querySelector(".header"); // Pastikan ini dideklarasikan di scope yang benar

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active"); // Mengganti kelas 'active' untuk menampilkan/menyembunyikan menu
        });
    }

    // Smooth scrolling untuk tautan navigasi dan penyorotan tautan aktif
    const navLinksElements = document.querySelectorAll(".nav-link");

    navLinksElements.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // Mencegah perilaku default tautan (loncat langsung)

            // Hapus kelas 'active' dari semua tautan
            navLinksElements.forEach((l) => l.classList.remove("active"));

            // Tambahkan kelas 'active' ke tautan yang diklik
            this.classList.add("active");

            // Dapatkan bagian target
            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Dapatkan tinggi header jika elemen header ada
                const headerHeight = header ? header.offsetHeight : 0;
                // Hitung posisi target dengan mengimbangi tinggi header
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth", // Gulir dengan mulus
                });
            }

            // Tutup menu mobile jika terbuka setelah mengklik tautan
            if (navLinks && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        });
    });

    // Fungsi untuk memperbarui gaya header berdasarkan posisi scroll saat ini
    function updateHeaderOnScrollState() {
        if (header) {
            // Ambil computed style dari body untuk mendapatkan nilai variabel CSS yang aktif
            const computedStyle = getComputedStyle(document.body);

            // Dapatkan nilai warna header dan bayangan berdasarkan tema yang aktif
            const headerBg = computedStyle.getPropertyValue('--header-bg');
            const sectionShadow = computedStyle.getPropertyValue('--section-shadow');

            if (window.scrollY > 50) {
                // Terapkan warna dan bayangan yang sesuai dengan tema aktif
                header.style.background = headerBg;
                header.style.boxShadow = sectionShadow;
            } else {
                // Kembali ke warna header default dari tema aktif
                header.style.background = headerBg;
                header.style.boxShadow = "none";
            }
        }
    }

    // Efek scroll header (mengubah latar belakang dan bayangan header)
    window.addEventListener("scroll", updateHeaderOnScrollState);

    // Perbarui tautan navigasi aktif berdasarkan posisi gulir halaman
    window.addEventListener("scroll", () => {
        const sections = document.querySelectorAll(".section");
        const headerHeight = header ? header.offsetHeight : 0;

        let currentSectionId = "";

        sections.forEach((section) => {
            // Sesuaikan offset untuk memicu status aktif sedikit sebelum bagian sepenuhnya terlihat
            const sectionTop = section.offsetTop - headerHeight - 150; // Offset disesuaikan
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        // Perbarui kelas 'active' pada tautan navigasi
        navLinksElements.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    // === Fungsionalitas Carousel ===

    /**
     * Menginisialisasi fungsionalitas carousel untuk elemen carousel tertentu.
     * @param {HTMLElement} carouselElement - Elemen DOM dari carousel yang akan diinisialisasi.
     */
    function initCarousel(carouselElement) {
        const carousel = carouselElement;
        if (!carousel) return;

        const track = carousel.querySelector(".carousel-track");
        const slides = Array.from(track.children);
        let indicatorsContainer = carousel.querySelector(".carousel-indicators");

        if (!indicatorsContainer) {
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.classList.add('carousel-indicators');
            carousel.appendChild(indicatorsContainer);
        } else {
            indicatorsContainer.innerHTML = '';
        }

        let currentSlide = 0;
        let autoSlideInterval;

        slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener("click", () => {
                showSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = Array.from(indicatorsContainer.children);

        function showSlide(index) {
            if (index >= slides.length) {
                index = 0;
            } else if (index < 0) {
                index = slides.length - 1;
            }

            const offset = -index * 100;
            track.style.transform = `translateX(${offset}%)`;

            indicators.forEach((indicator) => indicator.classList.remove("active"));
            indicators[index].classList.add("active");
            currentSlide = index;
        }

        function nextSlide() {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        carousel.addEventListener("mouseenter", stopAutoSlide);
        carousel.addEventListener("mouseleave", startAutoSlide);

        showSlide(0);
        startAutoSlide();
    }

    const allCarousels = document.querySelectorAll(".carousel");
    allCarousels.forEach(carouselElement => {
        initCarousel(carouselElement);
    });

    // === Fungsionalitas Form Kontak & Output Box ===

    const contactForm = document.querySelector(".contact-form form");
    const resultBox = document.querySelector(".output-box");

    if (contactForm && resultBox) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const nama = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const tanggallahir = document.getElementById('tanggallahir').value.trim();
            const pesan = document.getElementById('message').value.trim();

            if (!nama || !email || !tanggallahir || !pesan) {
                alert("Harap isi semua kolom wajib (Nama, Email, Tanggal Lahir, Pesan).");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Harap masukkan alamat email yang valid.");
                return;
            }

            const now = new Date();
            const options = {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                timeZoneName: 'short', timeZone: 'Asia/Jakarta'
            };
            const currentTime = now.toLocaleString('id-ID', options);

            const hasil = `
                <p><strong>Current time</strong>: ${currentTime}</p><br>
                <p><strong>Nama</strong>: ${nama}</p>
                <p><strong>Email</strong>: ${email}</p>
                <p><strong>Tanggal Lahir</strong>: ${tanggallahir}</p>
                <p><strong>Pesan</strong>: ${pesan}</p>
            `;

            resultBox.innerHTML = hasil;

            const submitBtn = this.querySelector(".submit-btn");
            const originalText = submitBtn ? submitBtn.textContent : 'Kirim Pesan';

            if (submitBtn) {
                submitBtn.textContent = "Mengirim...";
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert("Pesan Anda telah ditampilkan di kotak hasil!");
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                this.reset();
                alert("Pesan Anda telah ditampilkan di kotak hasil!");
            }
        });
    }

    // === Fungsionalitas Dark Mode ===

    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;

    // Fungsi untuk menerapkan tema
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = false;
        }
        // Panggil fungsi ini untuk memperbarui gaya header setelah tema berubah
        // Ini memastikan gaya header di-refresh jika sedang dalam kondisi scroll
        updateHeaderOnScrollState();
    }

    // Periksa preferensi pengguna dari localStorage atau sistem operasi
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    // Atur tema awal
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDarkMode) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // Tambahkan event listener untuk toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener("change", () => {
            if (darkModeToggle.checked) {
                applyTheme('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                applyTheme('light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Panggil sekali saat DOM siap untuk memastikan header diatur dengan benar saat halaman dimuat
    updateHeaderOnScrollState();
});