document.addEventListener("DOMContentLoaded", () => {
    // Toggle menu mobile
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active"); // Mengganti kelas 'active' untuk menampilkan/menyembunyikan menu
        });
    }

    // Smooth scrolling untuk tautan navigasi dan penyorotan tautan aktif
    const navLinksElements = document.querySelectorAll(".nav-link");
    const header = document.querySelector(".header");

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

    // Efek scroll header (mengubah latar belakang dan bayangan header)
    window.addEventListener("scroll", () => {
        if (header) { // Periksa apakah elemen header ada
            if (window.scrollY > 50) { // Jika digulir lebih dari 50px
                header.style.background = "rgba(255, 255, 255, 0.98)"; // Latar belakang lebih solid
                header.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"; // Tambahkan bayangan
            } else {
                header.style.background = "rgba(255, 255, 255, 0.95)"; // Latar belakang sedikit transparan
                header.style.boxShadow = "none"; // Hapus bayangan
            }
        }
    });

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
        if (!carousel) return; // Keluar jika elemen carousel tidak ditemukan

        const track = carousel.querySelector(".carousel-track");
        const slides = Array.from(track.children);
        let indicatorsContainer = carousel.querySelector(".carousel-indicators");

        // Buat atau bersihkan container indikator
        if (!indicatorsContainer) {
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.classList.add('carousel-indicators');
            carousel.appendChild(indicatorsContainer);
        } else {
            indicatorsContainer.innerHTML = ''; // Bersihkan indikator lama jika ada
        }

        let currentSlide = 0;
        let autoSlideInterval;

        // Buat indikator untuk setiap slide
        slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active'); // Aktifkan indikator pertama
            indicator.addEventListener("click", () => {
                showSlide(index);
                stopAutoSlide(); // Hentikan auto-slide saat navigasi manual
                startAutoSlide(); // Mulai kembali auto-slide setelah pilihan manual
            });
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = Array.from(indicatorsContainer.children); // Ambil ulang indikator setelah dibuat

        /**
         * Menampilkan slide tertentu berdasarkan indeks.
         * @param {number} index - Indeks slide yang akan ditampilkan.
         */
        function showSlide(index) {
            // Pastikan indeks berputar untuk efek tak terbatas
            if (index >= slides.length) {
                index = 0;
            } else if (index < 0) {
                index = slides.length - 1;
            }

            // Hitung transformasi X untuk menggeser track carousel
            const offset = -index * 100;
            track.style.transform = `translateX(${offset}%)`;

            // Hapus kelas 'active' dari semua indikator
            indicators.forEach((indicator) => indicator.classList.remove("active"));
            // Tambahkan kelas 'active' ke indikator saat ini
            indicators[index].classList.add("active");

            currentSlide = index;
        }

        /** Menggeser ke slide berikutnya. */
        function nextSlide() {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        /** Memulai interval auto-slide. */
        function startAutoSlide() {
            stopAutoSlide(); // Pastikan tidak ada interval ganda
            autoSlideInterval = setInterval(nextSlide, 4000); // Ganti slide setiap 4 detik
        }

        /** Menghentikan interval auto-slide. */
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Jeda/Lanjutkan auto-slide saat di-hover
        carousel.addEventListener("mouseenter", stopAutoSlide);
        carousel.addEventListener("mouseleave", startAutoSlide);

        // Inisialisasi: tampilkan slide pertama dan mulai auto-slide
        showSlide(0);
        startAutoSlide();
    }

    // Inisialisasi SEMUA carousel yang ada di halaman (PENTING untuk multiple carousels)
    const allCarousels = document.querySelectorAll(".carousel");
    allCarousels.forEach(carouselElement => {
        initCarousel(carouselElement);
    });

    // === Fungsionalitas Form Kontak & Output Box ===

    const contactForm = document.querySelector(".contact-form form");
    const resultBox = document.querySelector(".output-box");

    if (contactForm && resultBox) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Hindari reload halaman

            // Ambil nilai input dari form
            const nama = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const tanggallahir = document.getElementById('tanggallahir').value.trim();
            const pesan = document.getElementById('message').value.trim();

            // Validasi dasar: Pastikan semua kolom wajib terisi
            if (!nama || !email || !tanggallahir || !pesan) {
                alert("Harap isi semua kolom wajib (Nama, Email, Tanggal Lahir, Pesan).");
                return;
            }

            // Validasi format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Harap masukkan alamat email yang valid.");
                return;
            }

            // Waktu saat ini (sesuai zona waktu Jakarta untuk "WIB")
            const now = new Date();
            const options = {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                timeZoneName: 'short', timeZone: 'Asia/Jakarta'
            };
            const currentTime = now.toLocaleString('id-ID', options);

            // Format tampilan hasil
            const hasil = `
                <p><strong>Current time</strong>: ${currentTime}</p><br>
                <p><strong>Nama</strong>: ${nama}</p>
                <p><strong>Email</strong>: ${email}</p>
                <p><strong>Tanggal Lahir</strong>: ${tanggallahir}</p>
                <p><strong>Pesan</strong>: ${pesan}</p>
            `;

            // Tampilkan ke resultBox
            resultBox.innerHTML = hasil;

            // Simulasikan pengiriman formulir dan reset form
            const submitBtn = this.querySelector(".submit-btn");
            const originalText = submitBtn ? submitBtn.textContent : 'Kirim Pesan'; // Teks default tombol

            if (submitBtn) {
                submitBtn.textContent = "Mengirim...";
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert("Pesan Anda telah ditampilkan di kotak hasil!");
                    this.reset(); // Reset formulir
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                this.reset();
                alert("Pesan Anda telah ditampilkan di kotak hasil!");
            }
        });
    }
});