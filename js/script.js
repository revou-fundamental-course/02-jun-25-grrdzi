document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Hindari reload halaman

    // Ambil nilai input
    const nama = document.getElementById('name').value;
    const tanggallahir = document.getElementById('tanggallahir').value;
    const jeniskelamin = document.querySelector('input[name="jeniskelamin"]:checked')?.value || '-';
    const pesan = document.getElementById('pesan').value;

    // Waktu saat ini
    const currentTime = new Date().toString();

    // Format tampilan hasil
    const hasil = `
      <p><strong>Current time</strong> : ${currentTime}</p><br>
      <p><strong>Nama</strong> : ${nama}</p>
      <p><strong>Tanggal Lahir</strong> : ${tanggallahir}</p>
      <p><strong>Jenis Kelamin</strong> : ${jeniskelamin}</p>
      <p><strong>Pesan</strong> : ${pesan}</p>
    `;

    // Tampilkan ke resultBox
    document.getElementById('resultBox').innerHTML = hasil;
  });