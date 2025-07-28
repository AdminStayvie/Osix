document.addEventListener('DOMContentLoaded', () => {
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5Eq284lYu9LDWPjHLlEFTC-8Mq2iTKGLvRPbi-XYGZBGPFQ9dIG3fUdm1iMlxign7/exec';
    
    const dashboardContainer = document.getElementById('dashboard-container');
    const tabContainer = document.getElementById('tab-container');
    const modal = document.getElementById('room-modal');
    const closeButton = document.querySelector('.close-button');

    // --- DEFINISI DENAH UNTUK CANVAS ---
    // Diperbarui dengan nomor kamar dari kotak oranye.
    // 'key' adalah unik untuk setiap elemen, 'id' adalah nomor kamar untuk data.
    const floorLayouts = {
        '1': {
            width: 500, // Lebar canvas
            height: 800, // Tinggi canvas
            elements: [
                // Kamar Blok C (atas)
                { key: 'C120', id: 'C120', x: 20, y: 20, w: 70, h: 100 },
                { key: 'C121', id: 'C121', x: 95, y: 20, w: 70, h: 100 },
                { key: 'C122', id: 'C122', x: 170, y: 20, w: 70, h: 100 },
                { key: 'C123', id: 'C123', x: 245, y: 20, w: 70, h: 100 },
                { key: 'C125', id: 'C125', x: 320, y: 20, w: 70, h: 100 },
                { key: 'sampah', type: 'area', id: 'sampah', x: 400, y: 20, w: 80, h: 50, label: 'Sampah' },
                
                // Kamar Blok B (atas)
                { key: 'B110', id: 'B110', x: 20, y: 150, w: 70, h: 100 },
                { key: 'B109_1', id: 'B109', x: 95, y: 150, w: 70, h: 100 },
                { key: 'B108_1', id: 'B108', x: 170, y: 150, w: 70, h: 100 },
                { key: 'B107_1', id: 'B107', x: 245, y: 150, w: 70, h: 100 },
                { key: 'B106_1', id: 'B106', x: 320, y: 150, w: 70, h: 100 },
                { key: 'dapur', type: 'area', id: 'dapur', x: 400, y: 150, w: 80, h: 70, label: 'Dapur' },

                // Kamar Blok A
                { key: 'A110', id: 'A110', x: 20, y: 280, w: 70, h: 100 },
                { key: 'A111', id: 'A111', x: 95, y: 280, w: 70, h: 100 },
                { key: 'A112', id: 'A112', x: 170, y: 280, w: 70, h: 100 },
                { key: 'A115', id: 'A115', x: 245, y: 280, w: 70, h: 100 },
                
                { key: 'tangga', type: 'area', id: 'tangga', x: 400, y: 320, w: 80, h: 100, label: 'Tangga' },

                // Kamar Blok B (bawah) - Menggunakan nomor dari denah
                { key: 'B108_2', id: 'B108', x: 20, y: 410, w: 70, h: 100 },
                { key: 'B107_2', id: 'B107', x: 95, y: 410, w: 70, h: 100 },
                { key: 'B106_2', id: 'B106', x: 170, y: 410, w: 70, h: 100 },
                { key: 'B105_1', id: 'B105', x: 245, y: 410, w: 70, h: 100 },
                
                // Kamar Blok B (paling bawah)
                { key: 'B101', id: 'B101', x: 20, y: 540, w: 70, h: 100 },
                { key: 'B102', id: 'B102', x: 95, y: 540, w: 70, h: 100 },
                { key: 'B103', id: 'B103', x: 170, y: 540, w: 70, h: 100 },
                { key: 'B105_2', id: 'B105', x: 245, y: 540, w: 70, h: 100 },
                
                { key: 'parkir1', type: 'area', id: 'parkir1', x: 400, y: 500, w: 80, h: 140, label: 'Parkir' },

                // Area Bawah
                { key: 'teras', type: 'area', id: 'teras', x: 20, y: 670, w: 365, h: 40, label: 'Teras' },
                { key: 'lift', type: 'area', id: 'lift', x: 20, y: 715, w: 100, h: 60, label: 'Lift' },
                { key: 'parkir2', type: 'area', id: 'parkir2', x: 125, y: 715, w: 355, h: 60, label: 'Area Parkir' },
            ]
        },
        // Definisikan denah lantai lain di sini dengan format yang sama
    };

    const colors = {
        available: '#d1fae5', booked: '#ffe4e6', paid: '#c7d2fe',
        area: '#e9ecef', border: '#a0a0a0', text: '#333',
        dapur: '#fff3bf', tangga: '#d1d5db', teras: '#e5e5e5', 
        lift: '#a5b4fc', sampah: '#a3a3a3', parkir: '#e0e7ff',
    };

    let roomDataMap = new Map();

    async function fetchData() {
        try {
            const response = await fetch(APPS_SCRIPT_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const roomDataArray = await response.json();
            roomDataMap = new Map(roomDataArray.map(room => [room.no_kamar, room]));
            
            dashboardContainer.innerHTML = ''; 
            tabContainer.innerHTML = '';

            renderTabsAndCanvases();
            drawAllFloors();
            setupCanvasClickHandlers();

        } catch (error) {
            console.error('Error fetching data:', error);
            dashboardContainer.innerHTML = `<p style="text-align:center; color: red;">Gagal memuat data. Periksa konsol untuk detail error.</p>`;
        }
    }

    function renderTabsAndCanvases() {
        Object.keys(floorLayouts).forEach((floorNumber, index) => {
            const tabButton = document.createElement('button');
            tabButton.className = 'tab-button';
            tabButton.textContent = `Lantai ${floorNumber}`;
            tabButton.dataset.floor = floorNumber;
            if (index === 0) tabButton.classList.add('active');
            tabButton.addEventListener('click', () => switchTab(floorNumber));
            tabContainer.appendChild(tabButton);

            const canvas = document.createElement('canvas');
            canvas.id = `canvas-floor-${floorNumber}`;
            canvas.className = 'floor-canvas';
            const layout = floorLayouts[floorNumber];
            canvas.width = layout.width;
            canvas.height = layout.height;
            if (index === 0) canvas.classList.add('active');
            dashboardContainer.appendChild(canvas);
        });
    }

    function switchTab(floorNumber) {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.floor-canvas').forEach(cnv => cnv.classList.remove('active'));
        document.querySelector(`.tab-button[data-floor='${floorNumber}']`).classList.add('active');
        document.getElementById(`canvas-floor-${floorNumber}`).classList.add('active');
    }

    function drawAllFloors() {
        Object.keys(floorLayouts).forEach(floorNumber => {
            const canvas = document.getElementById(`canvas-floor-${floorNumber}`);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const layout = floorLayouts[floorNumber];

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            layout.elements.forEach(el => {
                ctx.strokeStyle = colors.border;
                ctx.lineWidth = 1;

                if (el.type === 'area') {
                    ctx.fillStyle = colors[el.id] || colors.area;
                    ctx.fillRect(el.x, el.y, el.w, el.h);
                    ctx.strokeRect(el.x, el.y, el.w, el.h);
                    drawText(ctx, el.label, el.x + el.w / 2, el.y + el.h / 2);
                } else {
                    const roomData = roomDataMap.get(el.id);
                    let status = 'available';
                    if (roomData) {
                        if (roomData.pelunasan === true) status = 'paid';
                        else if (roomData.penghuni && roomData.penghuni.trim() !== '-') status = 'booked';
                    }
                    
                    ctx.fillStyle = colors[status];
                    ctx.fillRect(el.x, el.y, el.w, el.h);
                    ctx.strokeRect(el.x, el.y, el.w, el.h);
                    
                    const roomType = roomData ? roomData.tiper_kamar : '';
                    drawText(ctx, el.id, el.x + el.w / 2, el.y + el.h / 2 - 8);
                    drawText(ctx, roomType, el.x + el.w / 2, el.y + el.h / 2 + 8, 10);
                }
            });
        });
    }
    
    function drawText(ctx, text, x, y, size = 12) {
        ctx.fillStyle = colors.text;
        ctx.font = `bold ${size}px 'Segoe UI'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
    }

    function setupCanvasClickHandlers() {
        Object.keys(floorLayouts).forEach(floorNumber => {
            const canvas = document.getElementById(`canvas-floor-${floorNumber}`);
            if (!canvas) return;
            canvas.addEventListener('click', (event) => {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const layout = floorLayouts[floorNumber];
                for (const el of layout.elements) {
                    if (el.type !== 'area' && x >= el.x && x <= el.x + el.w && y >= el.y && y <= el.y + el.h) {
                        const roomData = roomDataMap.get(el.id);
                        if (roomData) displayModal(roomData);
                        break; 
                    }
                }
            });
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
