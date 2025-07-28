document.addEventListener('DOMContentLoaded', () => {
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5Eq284lYu9LDWPjHLlEFTC-8Mq2iTKGLvRPbi-XYGZBGPFQ9dIG3fUdm1iMlxign7/exec';
    
    const dashboardContainer = document.getElementById('dashboard-container');
    const tabContainer = document.getElementById('tab-container');
    const modal = document.getElementById('room-modal');
    const closeButton = document.querySelector('.close-button');

    // --- STRUKTUR LAYOUT BARU YANG AKURAT ---
    const floorLayouts = {
        '1': {
            columns: 7, // Jumlah kolom pada grid
            grid: [
                // Baris 1
                ['C120', 'C121', 'C122', 'C123', 'C125', 'sampah', 'sampah'],
                // Baris 2
                [null, null, null, null, null, null, null],
                // Baris 3
                ['B110', 'B109', 'B108', 'B107', 'B106', 'dapur', 'dapur'],
                // Baris 4
                [null, null, null, null, null, null, null],
                // Baris 5
                ['A110', 'A111', 'A112', 'A115', null, 'tangga', 'tangga'],
                 // Baris 6
                [null, null, null, null, null, 'tangga', 'tangga'],
                // Baris 7
                ['B108', 'B107', 'B106', 'B105', null, null, null],
                // Baris 8
                [null, null, null, null, null, null, null],
                // Baris 9
                ['B101', 'B102', 'B103', 'B105', null, 'parkir', 'parkir'],
                // Baris 10
                ['teras', 'teras', 'teras', 'teras', null, 'parkir', 'parkir'],
                 // Baris 11
                ['lift', 'lift', 'parkir', 'parkir', 'parkir', 'parkir', 'parkir'],
            ]
        },
        '2': { // Denah lantai lain masih sederhana, bisa diperbarui nanti
            columns: 6,
            grid: [
                ['C228', 'B221', 'A210', 'A212', 'B202', 'B201'], ['C227', 'B220', 'A211', null, 'B203', null],
                ['C226', 'B219', 'A215', 'B216', 'B205', null], ['C225', 'B218', null, null, 'B206', 'B209'],
                ['C223', 'B217', null, null, 'B207', null], ['C222', null, null, null, 'B208', null],
            ]
        },
        '3': {
            columns: 6,
            grid: [
                ['C325', 'D318', 'B309', 'B311', 'D307', 'D301'], ['C323', 'D317', 'B310', 'B312', 'D306', 'D302'],
                ['C322', 'D316', null, null, 'D305', 'D303'], ['C321', 'D315', null, null, null, null],
                ['C320', null, null, null, null, null], ['C319', null, null, null, null, null],
            ]
        },
        '5': {
            columns: 4,
            grid: [
                ['D512', 'B508', 'D507', 'D501'], ['D511', 'B509', 'D506', 'D502'], [null, 'B510', 'D505', 'D503'],
            ]
        }
    };

    async function fetchData() {
        try {
            const response = await fetch(APPS_SCRIPT_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const roomDataArray = await response.json();
            const roomDataMap = new Map(roomDataArray.map(room => [room.no_kamar, room]));
            
            dashboardContainer.innerHTML = ''; 
            tabContainer.innerHTML = '';

            renderTabs();
            renderAllFloors(roomDataMap);

        } catch (error) {
            console.error('Error fetching data:', error);
            dashboardContainer.innerHTML = `<p style="text-align:center; color: red;">Gagal memuat data. Periksa konsol untuk detail error.</p>`;
        }
    }

    function renderTabs() {
        Object.keys(floorLayouts).forEach((floorNumber, index) => {
            const tabButton = document.createElement('button');
            tabButton.className = 'tab-button';
            tabButton.textContent = `Lantai ${floorNumber}`;
            tabButton.dataset.floor = floorNumber;

            if (index === 0) tabButton.classList.add('active');

            tabButton.addEventListener('click', () => {
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.floor').forEach(flr => flr.classList.remove('active'));
                tabButton.classList.add('active');
                document.getElementById(`floor-${floorNumber}`).classList.add('active');
            });
            tabContainer.appendChild(tabButton);
        });
    }

    function renderAllFloors(roomDataMap) {
        const areaTypes = ['dapur', 'tangga', 'teras', 'lift', 'sampah', 'parkir'];

        Object.keys(floorLayouts).forEach((floorNumber, index) => {
            const floorData = floorLayouts[floorNumber];
            const floorDiv = document.createElement('div');
            floorDiv.className = 'floor';
            floorDiv.id = `floor-${floorNumber}`;

            if (index === 0) floorDiv.classList.add('active');

            const layoutDiv = document.createElement('div');
            layoutDiv.className = 'room-layout';
            layoutDiv.style.gridTemplateColumns = `repeat(${floorData.columns}, 1fr)`;

            floorData.grid.flat().forEach(cellId => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'grid-item';

                if (roomDataMap.has(cellId)) { // Jika ini adalah kamar
                    const roomData = roomDataMap.get(cellId);
                    cellDiv.classList.add('room');
                    
                    if (roomData.pelunasan === true) cellDiv.classList.add('paid');
                    else if (!roomData.penghuni || roomData.penghuni.trim() === '-') cellDiv.classList.add('available');
                    else cellDiv.classList.add('booked');
                    
                    cellDiv.innerHTML = `<div class="room-number">${roomData.no_kamar}</div><div class="room-type">${roomData.tiper_kamar}</div>`;
                    cellDiv.addEventListener('click', () => displayModal(roomData));
                } else if (areaTypes.includes(cellId)) { // Jika ini adalah area lain
                    cellDiv.classList.add('area-label', cellId);
                    cellDiv.textContent = cellId.charAt(0).toUpperCase() + cellId.slice(1);
                } else { // Jika ini adalah ruang kosong
                    cellDiv.classList.add('spacer');
                }
                layoutDiv.appendChild(cellDiv);
            });

            floorDiv.appendChild(layoutDiv);
            dashboardContainer.appendChild(floorDiv);
        });
    }
    
    function displayModal(roomData) {
        document.getElementById('modal-room-number').textContent = `Detail Kamar ${roomData.no_kamar}`;
        document.getElementById('modal-room-type').textContent = roomData.tiper_kamar;
        document.getElementById('modal-occupant').textContent = (roomData.penghuni && roomData.penghuni.trim() !== '-') ? roomData.penghuni : '-';
        document.getElementById('modal-dp-status').textContent = roomData.dp === true ? 'Sudah DP' : 'Belum';
        document.getElementById('modal-dp-date').textContent = roomData.tanggal_dp ? new Date(roomData.tanggal_dp).toLocaleDateString('id-ID') : '-';
        document.getElementById('modal-payment-status').textContent = roomData.pelunasan === true ? 'Lunas' : 'Belum';
        modal.style.display = 'block';
    }

    closeButton.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    };
    
    fetchData();
});
