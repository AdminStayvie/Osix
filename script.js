document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // URL Web App dari Google Apps Script Anda.
    // =========================================================================
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5Eq284lYu9LDWPjHLlEFTC-8Mq2iTKGLvRPbi-XYGZBGPFQ9dIG3fUdm1iMlxign7/exec';
    
    const dashboardContainer = document.getElementById('dashboard-container');
    const modal = document.getElementById('room-modal');
    const closeButton = document.querySelector('.close-button');

    // --- STRUKTUR LAYOUT BARU ---
    // Mendefinisikan layout setiap lantai sebagai grid 2D.
    // 'null' akan menjadi area parkir/koridor.
    const floorLayouts = {
        '1': {
            columns: 14,
            grid: [
                ['C120', 'C121', 'C122', 'C123', 'C125', null, null, null, null, 'sampah', 'dapur', 'dapur', 'dapur', 'dapur'],
                ['B110', null, null, null, null, null, null, null, null, null, null, null, null, null],
                ['B109', null, null, null, null, null, null, null, null, null, null, null, null, null],
                ['B108', null, 'A110', 'A111', 'A112', 'A115', null, null, null, null, null, null, null, 'tangga'],
                ['B107', null, null, null, null, null, null, null, null, null, null, null, null, 'tangga'],
                ['B106', null, null, null, null, null, null, null, null, null, null, null, null, null],
                [null, null, 'B101', 'B102', 'B103', 'B105', null, null, null, null, null, null, null, null],
                ['lift', 'lift', 'teras', 'teras', 'teras', 'teras', 'teras', 'teras', 'teras', 'teras', 'teras', 'teras', 'teras', 'teras'],
            ]
        },
        '2': {
            columns: 14,
            grid: [
                ['C222', 'C223', 'C225', 'C226', 'C227', 'C228', null, null, null, null, 'dapur', 'dapur', 'dapur', 'dapur'],
                ['B221', null, null, null, null, null, null, null, null, null, null, null, null, null],
                ['B220', null, null, null, null, null, null, null, null, null, null, null, null, null],
                ['B219', null, 'A210', 'A211', 'A212', 'A215', null, 'B216', null, null, null, null, null, 'tangga'],
                ['B218', null, null, null, null, null, null, null, null, null, null, null, null, 'tangga'],
                ['B217', null, null, null, null, null, null, null, null, null, null, null, null, 'void'],
                [null, null, 'B201', 'B202', 'B203', 'B205', 'B206', 'B209', 'B208', 'B207', null, null, null, null],
                ['lift', 'lift', null, null, null, null, null, null, null, null, null, null, null, null],
            ]
        },
        '3': {
            columns: 14,
            grid: [
                ['C319', 'C320', 'C321', 'C322', 'C323', 'C325', null, null, null, null, null, null, null, null],
                ['D318', null, null, null, null, null, null, null, 'D315', null, null, 'dapur', 'dapur', 'dapur'],
                ['D317', null, null, null, null, null, null, null, 'D316', null, null, 'dapur', 'dapur', 'dapur'],
                ['B309', null, 'B310', 'B311', null, 'B312', null, null, null, null, null, null, null, 'tangga'],
                ['D308', null, null, null, null, null, null, null, null, null, null, null, null, 'tangga'],
                ['D307', null, null, null, null, null, null, null, null, null, null, null, null, 'void'],
                ['D301', 'D302', 'D303', 'D305', 'D306', null, null, null, null, null, null, null, null, null],
                ['lift', 'lift', null, null, null, null, null, null, null, null, null, null, null, null],
            ]
        },
        '5': {
            columns: 14,
            grid: [
                ['text-label:Jemuran', 'text-label:Jemuran', 'text-label:Jemuran', 'text-label:Jemuran', 'text-label:Jemuran', null, null, 'text-label:T.Setrika', 'text-label:T.Setrika', null, 'dapur', 'dapur', 'dapur', 'dapur'],
                ['D512', 'D511', null, null, null, null, null, null, null, null, null, null, null, null],
                ['B508', 'B509', 'B510', null, null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null, null, null, null, 'tangga'],
                ['D507', 'D506', 'D505', null, null, null, null, null, null, null, null, null, null, 'tangga'],
                ['D501', 'D502', 'D503', null, null, null, null, null, null, null, null, null, null, null],
                ['lift', 'lift', null, null, null, null, null, null, null, null, null, null, null, null],
            ]
        }
    };

    async function fetchData() {
        try {
            const response = await fetch(APPS_SCRIPT_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const roomDataArray = await response.json();
            const roomDataMap = new Map(roomDataArray.map(room => [room.no_kamar, room]));
            renderDashboard(roomDataMap);
        } catch (error) {
            console.error('Error fetching data:', error);
            dashboardContainer.innerHTML = `<p style="text-align:center; color: red;">Gagal memuat data. Periksa konsol untuk detail error.</p>`;
        }
    }

    function renderDashboard(roomDataMap) {
        dashboardContainer.innerHTML = ''; // Clear loader

        for (const floorNumber in floorLayouts) {
            const floorData = floorLayouts[floorNumber];
            const floorDiv = document.createElement('div');
            floorDiv.className = 'floor';
            
            const title = document.createElement('h3');
            title.className = 'floor-title';
            title.textContent = `Lantai ${floorNumber}`;
            floorDiv.appendChild(title);

            const layoutDiv = document.createElement('div');
            layoutDiv.className = 'room-layout';
            // Set grid columns dynamically
            layoutDiv.style.gridTemplateColumns = `repeat(${floorData.columns}, 1fr)`;

            floorData.grid.flat().forEach(cellId => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'grid-item';

                if (cellId && cellId.startsWith('text-label:')) {
                    cellDiv.classList.add('text-label');
                    cellDiv.textContent = cellId.split(':')[1];
                } else if (roomDataMap.has(cellId)) {
                    // It's a room
                    const roomData = roomDataMap.get(cellId);
                    cellDiv.classList.add('room');
                    
                    if (roomData.pelunasan === true) cellDiv.classList.add('paid');
                    else if (!roomData.penghuni || roomData.penghuni.trim() === '-') cellDiv.classList.add('available');
                    else cellDiv.classList.add('booked');
                    
                    cellDiv.innerHTML = `<div class="room-number">${roomData.no_kamar}</div><div class="room-type">${roomData.tiper_kamar}</div>`;
                    cellDiv.addEventListener('click', () => displayModal(roomData));
                } else if (cellId) {
                    // It's a special area like 'dapur', 'tangga', etc.
                    cellDiv.classList.add(cellId);
                } else {
                    // It's a null/spacer cell
                    cellDiv.classList.add('spacer');
                }
                layoutDiv.appendChild(cellDiv);
            });

            floorDiv.appendChild(layoutDiv);
            dashboardContainer.appendChild(floorDiv);
        }
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
