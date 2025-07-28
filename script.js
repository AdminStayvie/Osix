document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // !!! PENTING: GANTI URL DI BAWAH INI DENGAN URL WEB APP ANDA !!!
    // =========================================================================
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5Eq284lYu9LDWPjHLlEFTC-8Mq2iTKGLvRPbi-XYGZBGPFQ9dIG3fUdm1iMlxign7/exec';
    
    const dashboardContainer = document.getElementById('dashboard-container');
    const modal = document.getElementById('room-modal');
    const closeButton = document.querySelector('.close-button');

    // Denah layout berdasarkan file PDF. 'spacer' digunakan untuk area kosong.
    const floorLayouts = {
        '1': ['C120', 'C121', 'C122', 'C123', 'C125', 'spacer', 'B110', 'B109', 'B108', 'B107', 'B106', 'spacer', 'A110', 'A111', 'A112', 'A115', 'spacer', 'spacer', 'B101', 'B102', 'B103', 'B105', 'spacer', 'spacer'],
        '2': ['C222', 'C223', 'C225', 'C226', 'C227', 'C228', 'B221', 'B220', 'B219', 'B218', 'B217', 'B216', 'A210', 'A211', 'A212', 'A215', 'spacer', 'spacer', 'B201', 'B202', 'B203', 'B205', 'B206', 'B209', 'B208', 'B207'],
        '3': ['C319', 'C320', 'C321', 'C322', 'C323', 'C325', 'D318', 'D317', 'D316', 'D315', 'B312', 'spacer', 'B309', 'B310', 'B311', 'spacer', 'spacer', 'spacer', 'D301', 'D302', 'D303', 'D305', 'D306', 'D308', 'D307'],
        '5': ['D512', 'D511', 'spacer', 'spacer', 'spacer', 'spacer', 'B508', 'B509', 'B510', 'spacer', 'spacer', 'spacer', 'D507', 'D506', 'D505', 'spacer', 'spacer', 'spacer', 'D501', 'D502', 'D503', 'spacer', 'spacer', 'spacer'],
    };

    // Fungsi untuk mengambil dan menampilkan data
    async function fetchData() {
        if (APPS_SCRIPT_URL === 'URL_WEB_APP_ANDA_DISINI') {
            dashboardContainer.innerHTML = `<p style="text-align:center; color: red; font-weight: bold;">Harap masukkan URL Apps Script Anda di dalam file script.js.</p>`;
            return;
        }

        try {
            const response = await fetch(APPS_SCRIPT_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const roomDataArray = await response.json();
            
            // Ubah array menjadi objek untuk pencarian cepat
            const roomDataMap = new Map(roomDataArray.map(room => [room.no_kamar, room]));
            
            renderDashboard(roomDataMap);

        } catch (error) {
            console.error('Error fetching data:', error);
            dashboardContainer.innerHTML = `<p style="text-align:center; color: red;">Gagal memuat data. Periksa konsol untuk detail error.</p>`;
        }
    }

    // Fungsi untuk me-render seluruh dashboard
    function renderDashboard(roomDataMap) {
        dashboardContainer.innerHTML = ''; // Hapus loader

        for (const floorNumber in floorLayouts) {
            const floorDiv = document.createElement('div');
            floorDiv.className = 'floor';
            
            const title = document.createElement('h3');
            title.className = 'floor-title';
            title.textContent = `Lantai ${floorNumber}`;
            floorDiv.appendChild(title);

            const layoutDiv = document.createElement('div');
            layoutDiv.className = 'room-layout';

            // Render kamar sesuai urutan di layout
            floorLayouts[floorNumber].forEach(roomNumber => {
                if (roomNumber === 'spacer') {
                    const spacerDiv = document.createElement('div');
                    spacerDiv.className = 'room spacer';
                    layoutDiv.appendChild(spacerDiv);
                    return;
                }

                const roomData = roomDataMap.get(roomNumber);
                if (!roomData) {
                    console.warn(`Data untuk kamar ${roomNumber} tidak ditemukan.`);
                    return;
                }

                const roomDiv = document.createElement('div');
                roomDiv.className = 'room';
                
                // Tentukan status kamar
                if (!roomData.penghuni) {
                    roomDiv.classList.add('available');
                } else if (roomData.pelunasan === true) {
                    roomDiv.classList.add('paid');
                } else {
                    roomDiv.classList.add('booked');
                }
                
                roomDiv.innerHTML = `
                    <div class="room-number">${roomData.no_kamar}</div>
                    <div class="room-type">${roomData.tiper_kamar}</div>
                `;
                
                roomDiv.addEventListener('click', () => displayModal(roomData));
                layoutDiv.appendChild(roomDiv);
            });

            floorDiv.appendChild(layoutDiv);
            dashboardContainer.appendChild(floorDiv);
        }
    }
    
    // Fungsi untuk menampilkan modal
    function displayModal(roomData) {
        document.getElementById('modal-room-number').textContent = `Detail Kamar ${roomData.no_kamar}`;
        document.getElementById('modal-room-type').textContent = roomData.tiper_kamar;
        document.getElementById('modal-occupant').textContent = roomData.penghuni || '-';
        document.getElementById('modal-dp-status').textContent = roomData.dp === true ? 'Sudah DP' : 'Belum';
        document.getElementById('modal-dp-date').textContent = roomData.tanggal_dp ? new Date(roomData.tanggal_dp).toLocaleDateString('id-ID') : '-';
        document.getElementById('modal-payment-status').textContent = roomData.pelunasan === true ? 'Lunas' : 'Belum';
        modal.style.display = 'block';
    }

    // Event listener untuk menutup modal
    closeButton.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    
    // Mulai proses pengambilan data
    fetchData();
});
