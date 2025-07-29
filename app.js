// Dashboard Kost Floor Plan - Main Application JavaScript

class KostFloorPlanDashboard {
    constructor() {
        this.scriptUrl = 'https://script.google.com/macros/s/AKfycbw5Eq284lYu9LDWPjHLlEFTC-8Mq2iTKGLvRPbi-XYGZBGPFQ9dIG3fUdm1iMlxign7/exec';
        this.roomData = [];
        this.filteredRooms = [];
        this.currentFloor = '1';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadRoomData();
    }

    async loadRoomData() {
        this.showLoadingState();
        try {
            const response = await fetch(this.scriptUrl);
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            if (data.error) throw new Error(data.message);
            if (!Array.isArray(data)) throw new Error("Invalid data format.");

            this.roomData = data;
            this.applyFilters(); // Apply initial filters (or no filters)
            this.updateLastUpdated();
            this.hideLoadingState();
        } catch (error) {
            console.error('Error loading room data:', error);
            this.showErrorState(error.message);
        }
    }

    organizeRoomsByFloor() {
        const floorRooms = { '1': [], '2': [], '3': [], '5': [] };
        this.filteredRooms.forEach(room => {
            const roomNumber = room['No Kamar'] || '';
            const floor = roomNumber.charAt(1);
            if (floorRooms[floor]) {
                floorRooms[floor].push(room);
            }
        });
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
        document.querySelector('.floor-nav').addEventListener('click', (e) => {
            if (e.target.classList.contains('floor-tab')) this.switchFloor(e.target.dataset.floor);
        });
        ['searchInput', 'roomTypeFilter', 'statusFilter'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.applyFilters());
        });
        const modal = document.getElementById('roomModal');
        modal.addEventListener('click', (e) => {
            if (e.target.matches('.modal-overlay, .modal-close, .btn--secondary')) this.closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) this.closeModal();
        });
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshData());
        document.getElementById('retryBtn').addEventListener('click', () => this.loadRoomData());
        document.getElementById('floorPlansContainer').addEventListener('click', (e) => {
            const roomCard = e.target.closest('.room-card');
            if (roomCard) {
                try {
                    this.showRoomModal(JSON.parse(roomCard.dataset.room));
                } catch (err) {
                    console.error('Failed to parse room data', err);
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
            const matchesSearch = !searchTerm || (room['No Kamar'] || '').toLowerCase().includes(searchTerm) || (room['Penghuni'] || '').toLowerCase().includes(searchTerm);
            const matchesType = !roomType || (room['Tiper Kamar'] || '') === roomType;
            const matchesStatus = !status || (status === 'available' && isAvailable) || (status === 'waiting' && !isAvailable);
            return matchesSearch && matchesType && matchesStatus;
        });
        this.organizeRoomsByFloor();
        this.renderAllFloors();
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
        if (floor === '1') {
            const rooms = this.floorRooms['1'] || [];
            const roomIds = [
                'C120', 'C121', 'C122', 'C123', 'C125', 'B119', 'B118', 'B117', 'B116',
                'A110', 'A111', 'A112', 'A115', 'B109', 'B108', 'B107', 'B106',
                'B101', 'B102', 'B103', 'B105'
            ];
            roomIds.forEach(id => {
                const container = document.getElementById(`room-${id}`);
                if (container) container.innerHTML = '';
            });
            rooms.forEach(room => {
                const container = document.getElementById(`room-${room['No Kamar']}`);
                if (container) container.appendChild(this.createRoomElement(room));
            });
            this.updateFloorStats('1', rooms);
            return;
        }
        
        if (floor === '2') {
            const rooms = this.floorRooms['2'] || [];
            const roomIds = [
                'C222', 'C223', 'C225', 'C226', 'C227', 'C228', 'B221', 'B220', 'B219',
                'B218', 'B217', 'A210', 'A211', 'A212', 'A215', 'B216', 'B209',
                'B208', 'B207', 'B206', 'B201', 'B202', 'B203', 'B205'
            ];
            roomIds.forEach(id => {
                const container = document.getElementById(`room-${id}`);
                if (container) container.innerHTML = '';
            });
            rooms.forEach(room => {
                const container = document.getElementById(`room-${room['No Kamar']}`);
                if (container) container.appendChild(this.createRoomElement(room));
            });
            this.updateFloorStats('2', rooms);
            return;
        }

        if (floor === '3') {
            const rooms = this.floorRooms['3'] || [];
            const roomIds = [
                'C319', 'C320', 'C321', 'C322', 'C323', 'C325', 'D318', 'D317',
                'D316', 'D315', 'B309', 'B310', 'B311', 'B312', 'D308', 'D307',
                'D306', 'D301', 'D302', 'D303', 'D305'
            ];
            roomIds.forEach(id => {
                const container = document.getElementById(`room-${id}`);
                if (container) container.innerHTML = '';
            });
            rooms.forEach(room => {
                const container = document.getElementById(`room-${room['No Kamar']}`);
                if (container) container.appendChild(this.createRoomElement(room));
            });
            this.updateFloorStats('3', rooms);
            return;
        }
    }
    
    renderFloor5() {
        const rooms = this.floorRooms['5'] || [];
        const leftWing = document.getElementById('floor5-left-wing');
        const rightWing = document.getElementById('floor5-right-wing');
        if (leftWing) leftWing.innerHTML = '';
        if (rightWing) rightWing.innerHTML = '';
        rooms.forEach(room => {
            const roomNum = parseInt((room['No Kamar'] || '0').slice(2), 10);
            const element = this.createRoomElement(room);
            if (roomNum <= 10) leftWing.appendChild(element);
            else rightWing.appendChild(element);
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
        roomDiv.style.width = '100%';
        roomDiv.style.height = '100%';
        roomDiv.innerHTML = `<div class="room-number">${room['No Kamar'] || 'N/A'}</div><div class="room-type">${room['Tiper Kamar'] || 'N/A'}</div><div class="room-status ${statusClass}">${statusText}</div>`;
        return roomDiv;
    }
    
    updateStats() {
        document.getElementById('totalRooms').textContent = this.roomData.length;
        const availableCount = this.roomData.filter(r => (r['Penghuni'] || '-').trim() === '-').length;
        document.getElementById('availableRooms').textContent = availableCount;
        document.getElementById('waitingRooms').textContent = this.roomData.length - availableCount;
    }

    updateFloorStats(floor, rooms) {
        document.getElementById(`floor${floor}Total`).textContent = rooms.length;
        document.getElementById(`floor${floor}Available`).textContent = rooms.filter(r => (r['Penghuni'] || '-').trim() === '-').length;
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
        document.getElementById('modalDP').textContent = String(room['DP']).toUpperCase() === 'TRUE' ? 'Sudah Bayar' : 'Belum';
        document.getElementById('modalDPDate').textContent = room['Tanggal DP'] || '-';
        document.getElementById('modalPayment').textContent = String(room['Pelunasan']).toUpperCase() === 'TRUE' ? 'Lunas' : 'Belum';
        document.getElementById('roomModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('roomModal').classList.add('hidden');
        document.body.style.overflow = '';
    }

    updateLastUpdated() {
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
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
        errorState.querySelector('p').textContent = message || 'Terjadi kesalahan saat memuat data.';
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

document.addEventListener('DOMContentLoaded', () => {
    window.kostDashboard = new KostFloorPlanDashboard();
});
