// Dashboard Kost Floor Plan - Main Application JavaScript

class KostFloorPlanDashboard {
    constructor() {
        // URL Web App dari Google Apps Script Anda.
        // Ganti dengan URL yang Anda dapatkan setelah mendeploy skrip Google.
        this.scriptUrl = 'https://script.google.com/macros/s/AKfycbw5Eq284lYu9LDWPjHLlEFTC-8Mq2iTKGLvRPbi-XYGZBGPFQ9dIG3fUdm1iMlxign7/exec';
        
        this.roomData = [];
        this.filteredRooms = [];
        this.currentFloor = '1';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadRoomData(); // Memuat data saat inisialisasi
    }

    async loadRoomData() {
        this.showLoadingState();
        
        try {
            // Mengambil data dari Google Apps Script
            const response = await fetch(this.scriptUrl);
            
            if (!response.ok) {
                // Jika response dari server tidak OK (misal: error 500)
                const errorText = await response.text();
                throw new Error(`Gagal mengambil data dari server: ${response.status} ${response.statusText}. Pesan: ${errorText}`);
            }
            
            const data = await response.json();

            // Cek jika skrip Google mengembalikan pesan error yang sudah diformat
            if (data.error) {
                throw new Error(`Error dari Google Script: ${data.message}`);
            }
            
            // Memastikan data yang diterima adalah array
            if (!Array.isArray(data)) {
                throw new Error("Format data yang diterima dari server tidak valid. Seharusnya berupa array.");
            }

            // Data dari Google Sheet berhasil didapatkan
            this.roomData = data;
            this.filteredRooms = [...this.roomData];
            
            // Setelah data dimuat, lakukan pemrosesan dan render
            this.organizeRoomsByFloor();
            this.updateStats();
            this.renderAllFloors(); // Render semua lantai sekali
            this.switchFloor(this.currentFloor); // Tampilkan lantai yang aktif
            this.updateLastUpdated();
            this.hideLoadingState();
            
        } catch (error) {
            console.error('Terjadi kesalahan saat memuat data kamar:', error);
            this.showErrorState(error.message);
        }
    }

    organizeRoomsByFloor() {
        // Mengelompokkan kamar berdasarkan lantainya
        const floorRooms = { '1': [], '2': [], '3': [], '5': [] };

        this.roomData.forEach(room => {
            const roomNumber = room['No Kamar'] || '';
            const floor = roomNumber.charAt(1); // Mengambil karakter kedua sebagai nomor lantai
            
            if (floorRooms[floor]) {
                floorRooms[floor].push(room);
            }
        });

        // Mengurutkan kamar di setiap lantai
        Object.keys(floorRooms).forEach(floor => {
            floorRooms[floor].sort((a, b) => {
                const aNum = parseInt((a['No Kamar'] || '0').slice(2), 10);
                const bNum = parseInt((b['No Kamar'] || '0').slice(2), 10);
                return aNum - bNum;
            });
        });
        
        this.floorRooms = floorRooms;
    }

    setupEventListeners() {
        // Event listener untuk navigasi lantai
        document.querySelector('.floor-nav').addEventListener('click', (e) => {
            if (e.target.classList.contains('floor-tab')) {
                this.switchFloor(e.target.dataset.floor);
            }
        });

        // Event listener untuk filter
        document.getElementById('searchInput').addEventListener('input', () => this.applyFilters());
        document.getElementById('roomTypeFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());

        // Event listener untuk modal
        const modal = document.getElementById('roomModal');
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'modalClose' || e.target.id === 'modalCloseBtn' || e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });

        // Event listener untuk tombol refresh dan retry
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshData());
        document.getElementById('retryBtn').addEventListener('click', () => this.loadRoomData());
        
        // Event delegation untuk klik pada kartu kamar
        document.getElementById('floorPlansContainer').addEventListener('click', (e) => {
            const roomCard = e.target.closest('.room-card');
            if (roomCard) {
                try {
                    const roomData = JSON.parse(roomCard.dataset.room);
                    this.showRoomModal(roomData);
                } catch (error) {
                    console.error('Gagal mem-parsing data kamar dari elemen:', error);
                }
            }
        });
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        const roomType = document.getElementById('roomTypeFilter').value;
        const status = document.getElementById('statusFilter').value;

        this.filteredRooms = this.roomData.filter(room => {
            const isAvailable = (room['Penghuni'] || '-').trim() === '-';
            const matchesSearch = !searchTerm ||
                (room['No Kamar'] || '').toLowerCase().includes(searchTerm) ||
                (room['Penghuni'] || '').toLowerCase().includes(searchTerm);
            const matchesType = !roomType || (room['Tiper Kamar'] || '') === roomType;
            const matchesStatus = !status || (status === 'available' && isAvailable) || (status === 'waiting' && !isAvailable);
            
            return matchesSearch && matchesType && matchesStatus;
        });

        this.organizeRoomsByFloor(); // Re-organize filtered rooms
        this.renderAllFloors(); // Re-render all floors with filtered data
        this.updateStats();
    }

    renderAllFloors() {
        this.renderRegularFloor('1');
        this.renderRegularFloor('2');
        this.renderRegularFloor('3');
        this.renderFloor5();
    }

    switchFloor(floor) {
        this.currentFloor = floor;

        document.querySelectorAll('.floor-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`.floor-tab[data-floor="${floor}"]`).classList.add('active');

        document.querySelectorAll('.floor-plan').forEach(plan => plan.classList.remove('active'));
        document.querySelector(`.floor-plan[data-floor="${floor}"]`).classList.add('active');
    }

    renderRegularFloor(floor) {
        const rooms = this.floorRooms[floor];
        const layouts = {
            '1': { top: [17, 18, 19, 20, 21], middle: [14, 15, 16], lowerMiddle: [9, 10, 11, 12, 13], bottom: [1, 2, 3, 4, 5, 6, 7, 8] },
            '2': { top: [18, 19, 20, 21, 22, 23, 24], middle: [14, 15, 16, 17], lowerMiddle: [9, 10, 11, 12, 13], bottom: [1, 2, 3, 4, 5, 6, 7, 8] },
            '3': { top: [16, 17, 18, 19, 20, 21], middle: [12, 13, 14, 15], lowerMiddle: [8, 9, 10, 11], bottom: [1, 2, 3, 4, 5, 6, 7] }
        };
        const layout = layouts[floor];
        if (!layout) return;

        Object.keys(layout).forEach(section => {
            const containerId = `floor${floor}-${section.replace('lowerMiddle', 'lower-middle')}-row`;
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = ''; // Clear previous content
            const roomNumbersInSection = layout[section];
            const roomsInSection = rooms.filter(room => roomNumbersInSection.includes(parseInt((room['No Kamar'] || '0').slice(2), 10)));
            
            roomsInSection.forEach(room => container.appendChild(this.createRoomElement(room)));
        });
        this.updateFloorStats(floor, rooms);
    }
    
    renderFloor5() {
        const rooms = this.floorRooms['5'];
        const leftWing = document.getElementById('floor5-left-wing');
        const rightWing = document.getElementById('floor5-right-wing');
        
        leftWing.innerHTML = '';
        rightWing.innerHTML = '';

        rooms.forEach(room => {
            const roomNum = parseInt((room['No Kamar'] || '0').slice(2), 10);
            const element = this.createRoomElement(room);
            if (roomNum <= 10) {
                leftWing.appendChild(element);
            } else {
                rightWing.appendChild(element);
            }
        });
        this.updateFloorStats('5', rooms);
    }

    createRoomElement(room) {
        const isAvailable = (room['Penghuni'] || '-').trim() === '-';
        const statusClass = isAvailable ? 'available' : 'waiting';
        const statusText = isAvailable ? 'Tersedia' : 'Waiting List';

        const roomDiv = document.createElement('div');
        roomDiv.className = `room-card ${statusClass}`;
        roomDiv.dataset.room = JSON.stringify(room);
        
        roomDiv.innerHTML = `
            <div class="room-number">${room['No Kamar'] || 'N/A'}</div>
            <div class="room-type">${room['Tiper Kamar'] || 'N/A'}</div>
            <div class="room-status ${statusClass}">${statusText}</div>
        `;
        return roomDiv;
    }
    
    updateStats() {
        const totalRooms = this.roomData.length;
        const availableRooms = this.roomData.filter(r => (r['Penghuni'] || '-').trim() === '-').length;
        document.getElementById('totalRooms').textContent = totalRooms;
        document.getElementById('availableRooms').textContent = availableRooms;
        document.getElementById('waitingRooms').textContent = totalRooms - availableRooms;
    }

    updateFloorStats(floor, rooms) {
        const availableCount = rooms.filter(r => (r['Penghuni'] || '-').trim() === '-').length;
        document.getElementById(`floor${floor}Total`).textContent = rooms.length;
        document.getElementById(`floor${floor}Available`).textContent = availableCount;
    }
    
    showRoomModal(room) {
        const isAvailable = (room['Penghuni'] || '-').trim() === '-';
        document.getElementById('modalTitle').textContent = `Detail Kamar ${room['No Kamar']}`;
        document.getElementById('modalRoomNumber').textContent = room['No Kamar'] || '-';
        document.getElementById('modalRoomType').textContent = room['Tiper Kamar'] || '-';
        const statusEl = document.getElementById('modalStatus');
        statusEl.textContent = isAvailable ? 'Tersedia' : 'Waiting List';
        statusEl.className = `status ${isAvailable ? 'status--success' : 'status--warning'}`;
        document.getElementById('modalOccupant').textContent = isAvailable ? 'Tidak ada' : room['Penghuni'];
        document.getElementById('modalDP').textContent = room['DP'] == 'TRUE' ? 'Sudah Bayar' : 'Belum';
        document.getElementById('modalDPDate').textContent = room['Tanggal DP'] || '-';
        document.getElementById('modalPayment').textContent = room['Pelunasan'] == 'TRUE' ? 'Lunas' : 'Belum';

        document.getElementById('roomModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('roomModal').classList.add('hidden');
        document.body.style.overflow = '';
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('lastUpdated').textContent = now.toLocaleString('id-ID', {
            dateStyle: 'long',
            timeStyle: 'short'
        });
    }

    showLoadingState() {
        document.getElementById('loadingState').classList.remove('hidden');
        document.getElementById('errorState').classList.add('hidden');
        document.getElementById('floorPlansContainer').style.display = 'none';
    }

    hideLoadingState() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('floorPlansContainer').style.display = 'block';
    }

    showErrorState(message) {
        document.getElementById('loadingState').classList.add('hidden');
        const errorState = document.getElementById('errorState');
        errorState.classList.remove('hidden');
        errorState.querySelector('p').textContent = message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi.';
        document.getElementById('floorPlansContainer').style.display = 'none';
    }

    async refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        refreshBtn.innerHTML = '🔄 Memuat...';
        refreshBtn.disabled = true;
        await this.loadRoomData();
        refreshBtn.innerHTML = '🔄 Refresh';
        refreshBtn.disabled = false;
    }
}

// Inisialisasi dasbor saat DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
    window.kostDashboard = new KostFloorPlanDashboard();
});
