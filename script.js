document.addEventListener('DOMContentLoaded', () => {
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5Eq284lYu9LDWPjHLlEFTC-8Mq2iTKGLvRPbi-XYGZBGPFQ9dIG3fUdm1iMlxign7/exec';
    
    const dashboardContainer = document.getElementById('dashboard-container');
    const tabContainer = document.getElementById('tab-container');
    const modal = document.getElementById('room-modal');
    const closeButton = document.querySelector('.close-button');

    // --- DEFINISI DENAH BARU YANG SANGAT AKURAT UNTUK CANVAS ---
    const floorLayouts = {
        '1': {
            width: 520, // Lebar canvas
            height: 750, // Tinggi canvas
            elements: [
                // 'key' unik untuk setiap elemen, 'id' adalah nomor kamar untuk data
                // 'label' adalah teks yang akan ditampilkan
                
                // BARIS 1: Blok C
                { key: 'C120', id: 'C120', x: 10, y: 10, w: 75, h: 90 },
                { key: 'C121', id: 'C121', x: 90, y: 10, w: 75, h: 90 },
                { key: 'C122', id: 'C122', x: 170, y: 10, w: 75, h: 90 },
                { key: 'C123', id: 'C123', x: 250, y: 10, w: 75, h: 90 },
                { key: 'C125', id: 'C125', x: 330, y: 10, w: 75, h: 90 },
                { key: 'sampah', type: 'area', id: 'sampah', x: 420, y: 10, w: 90, h: 50, label: 'T.Sampah' },

                // KORIDOR 1
                { key: 'koridor1', type: 'area', id: 'koridor', x: 10, y: 105, w: 300, h: 20, label: 'Koridor' },

                // BARIS 2: Blok B (atas) - Nomor kamar sesuai denah PDF
                { key: 'B119', id: 'B119', x: 10, y: 130, w: 75, h: 90 },
                { key: 'B118', id: 'B118', x: 90, y: 130, w: 75, h: 90 },
                { key: 'B117_atas', id: 'B117', x: 170, y: 130, w: 75, h: 90 },
                { key: 'B116_atas', id: 'B116', x: 250, y: 130, w: 75, h: 90 },
                { key: 'dapur', type: 'area', id: 'dapur', x: 330, y: 130, w: 60, h: 70, label: 'Dapur' },

                // BARIS 3: Blok A
                { key: 'A110', id: 'A110', x: 10, y: 225, w: 75, h: 90 },
                { key: 'A111', id: 'A111', x: 90, y: 225, w: 75, h: 90 },
                { key: 'A112', id: 'A112', x: 170, y: 225, w: 75, h: 90 },
                { key: 'A115', id: 'A115', x: 250, y: 225, w: 75, h: 90 },

                // KORIDOR 2
                { key: 'koridor2', type: 'area', id: 'koridor', x: 10, y: 320, w: 300, h: 20, label: 'Koridor' },
                { key: 'tangga', type: 'area', id: 'tangga', x: 330, y: 345, w: 75, h: 90, label: 'Tangga' },

                // BARIS 4: Blok B (tengah)
                { key: 'B109_bawah', id: 'B109', x: 10, y: 345, w: 75, h: 90 },
                { key: 'B108_bawah', id: 'B108', x: 90, y: 345, w: 75, h: 90 },
                { key: 'B107_bawah', id: 'B107', x: 170, y: 345, w: 75, h: 90 },
                { key: 'B106_atas', id: 'B106', x: 250, y: 345, w: 75, h: 90 },

                // BARIS 5: Blok B (bawah)
                { key: 'B101', id: 'B101', x: 10, y: 440, w: 75, h: 90 },
                { key: 'B102', id: 'B102', x: 90, y: 440, w: 75, h: 90 },
                { key: 'B103', id: 'B103', x: 170, y: 440, w: 75, h: 90 },
                { key: 'B105_bawah', id: 'B105', x: 250, y: 440, w: 75, h: 90 },
                { key: 'parkir1', type: 'area', id: 'parkir', x: 420, y: 375, w: 90, h: 200, label: 'Parkir' },

                // AREA BAWAH
                { key: 'teras', type: 'area', id: 'teras', x: 10, y: 540, w: 400, h: 40, label: 'Teras' },
                { key: 'lift', type: 'area', id: 'lift', x: 10, y: 585, w: 95, h: 60, label: 'Lift' },
                { key: 'parkir2', type: 'area', id: 'parkir', x: 110, y: 585, w: 400, h: 60, label: 'Area Parkir Motor' },
            ]
        },
        // Denah lantai 2, 3, 5 akan menggunakan layout sederhana untuk sementara
        '2': { width: 500, height: 500, elements: [{key:'info2', type:'area', id:'info', x:10,y:10,w:480,h:480, label:'Denah Lantai 2 akan diperbarui'}] },
        '3': { width: 500, height: 500, elements: [{key:'info3', type:'area', id:'info', x:10,y:10,w:480,h:480, label:'Denah Lantai 3 akan diperbarui'}] },
        '5': { width: 500, height: 500, elements: [{key:'info5', type:'area', id:'info', x:10,y:10,w:480,h:480, label:'Denah Lantai 5 akan diperbarui'}] },
    };

    const colors = {
        available: '#d1fae5', booked: '#ffe4e6', paid: '#c7d2fe',
        area: '#e9ecef', border: '#a0a0a0', text: '#333',
        koridor: '#f8f9fa', dapur: '#fff3bf', tangga: '#d1d5db', 
        teras: '#e5e5e5', lift: '#a5b4fc', sampah: '#a3a3a3', parkir: '#e0e7ff',
        info: '#f1f3f5'
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
                    drawText(ctx, el.label, el.x + el.w / 2, el.y + el.h / 2, 11, '#555');
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
                    drawText(ctx, el.id, el.x + el.w / 2, el.y + el.h / 2 - 10, 14, '#000');
                    drawText(ctx, roomType, el.x + el.w / 2, el.y + el.h / 2 + 10, 10, '#333');
                }
            });
        });
    }
    
    function drawText(ctx, text, x, y, size = 12, color = '#333') {
        ctx.fillStyle = color;
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
                // Loop terbalik agar elemen yang di atas (digambar terakhir) terdeteksi duluan
                for (const el of [...layout.elements].reverse()) {
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
