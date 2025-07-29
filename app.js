// Dashboard Kost Floor Plan - Main Application JavaScript

class KostFloorPlanDashboard {
    constructor() {
        this.roomData = [];
        this.filteredRooms = [];
        this.currentFloor = '1';
        this.floorRooms = {
            '1': [],
            '2': [],
            '3': [],
            '5': []
        };
        this.init();
    }

    async init() {
        await this.loadRoomData();
        this.organizeRoomsByFloor();
        this.setupEventListeners();
        this.updateStats();
        this.renderCurrentFloor();
        this.updateLastUpdated();
    }

    async loadRoomData() {
        this.showLoadingState();
        
        try {
            // Using the provided JSON data
            const jsonData = [
                {"No Kamar": "A110", "Tiper Kamar": "Compact", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "A111", "Tiper Kamar": "Compact", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "A112", "Tiper Kamar": "Compact", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "A115", "Tiper Kamar": "Compact", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "A210", "Tiper Kamar": "Compact", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "A211", "Tiper Kamar": "Compact", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "A212", "Tiper Kamar": "Compact", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "A215", "Tiper Kamar": "Compact", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B101", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B102", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B103", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B105", "Tiper Kamar": "Serenity", "Penghuni": "Muhammad Nauval Radithya Pratama", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B106", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B107", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B108", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B109", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B116", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B117", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B118", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B119", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B201", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B202", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B203", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B205", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B206", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B207", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B208", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B209", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B216", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B217", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B218", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B219", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B220", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B221", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B309", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B310", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B311", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B312", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B508", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B509", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "B510", "Tiper Kamar": "Serenity", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C120", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C121", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C122", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C123", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C125", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C222", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C223", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C225", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C226", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C227", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C228", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C319", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C320", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C321", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C322", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C323", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "C325", "Tiper Kamar": "Premium", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D301", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D302", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D303", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D305", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D306", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D307", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D308", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D315", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D316", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D317", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D318", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D501", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D502", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D503", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D505", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D506", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D507", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D511", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"},
                {"No Kamar": "D512", "Tiper Kamar": "Luxury", "Penghuni": "-", "DP": "FALSE", "Tanggal DP": "-", "Pelunasan": "FALSE"}
            ];

            this.roomData = jsonData;
            this.filteredRooms = [...this.roomData];
            this.hideLoadingState();
            
        } catch (error) {
            console.error('Error loading room data:', error);
            this.showErrorState();
        }
    }

    organizeRoomsByFloor() {
        // Reset floor rooms
        this.floorRooms = {
            '1': [],
            '2': [],
            '3': [],
            '5': []
        };

        this.roomData.forEach(room => {
            const roomNumber = room['No Kamar'];
            // Extract floor from room number (second character)
            const floor = roomNumber.charAt(1);
            
            if (this.floorRooms[floor]) {
                this.floorRooms[floor].push(room);
            }
        });

        // Sort rooms within each floor
        Object.keys(this.floorRooms).forEach(floor => {
            this.floorRooms[floor].sort((a, b) => {
                const aNum = parseInt(a['No Kamar'].slice(2));
                const bNum = parseInt(b['No Kamar'].slice(2));
                return aNum - bNum;
            });
        });
    }

    setupEventListeners() {
        // Floor navigation - use event delegation to handle dynamic content
        const floorNav = document.querySelector('.floor-nav');
        if (floorNav) {
            floorNav.addEventListener('click', (e) => {
                if (e.target.classList.contains('floor-tab')) {
                    e.preventDefault();
                    const floor = e.target.dataset.floor;
                    this.switchFloor(floor);
                }
            });
        }

        // Search functionality with proper debouncing
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            const handleSearch = () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterRooms();
                }, 300);
            };
            
            searchInput.addEventListener('input', handleSearch);
            searchInput.addEventListener('keyup', handleSearch);
            searchInput.addEventListener('change', handleSearch);
        }

        // Filter functionality with proper event handling
        const roomTypeFilter = document.getElementById('roomTypeFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (roomTypeFilter) {
            roomTypeFilter.addEventListener('change', () => {
                setTimeout(() => this.filterRooms(), 100);
            });
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                setTimeout(() => this.filterRooms(), 100);
            });
        }

        // Modal controls
        this.setupModalControls();

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Retry button
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadRoomData());
        }

        // Global click handler for room cards using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.room-card')) {
                e.preventDefault();
                const roomCard = e.target.closest('.room-card');
                try {
                    const roomData = JSON.parse(roomCard.dataset.room);
                    this.showRoomModal(roomData);
                } catch (error) {
                    console.error('Error parsing room data:', error);
                }
            }
        });
    }

    setupModalControls() {
        const modal = document.getElementById('roomModal');
        if (!modal) return;

        const modalClose = document.getElementById('modalClose');
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        const modalOverlay = modal.querySelector('.modal-overlay');

        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    switchFloor(floor) {
        console.log('Switching to floor:', floor);
        this.currentFloor = floor;

        // Update tab appearance
        document.querySelectorAll('.floor-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-floor="${floor}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Show/hide floor plans
        document.querySelectorAll('.floor-plan').forEach(plan => {
            plan.classList.remove('active');
        });
        
        const activePlan = document.querySelector(`.floor-plan[data-floor="${floor}"]`);
        if (activePlan) {
            activePlan.classList.add('active');
        }

        // Re-apply current filters to new floor
        this.filterRooms();
    }

    renderCurrentFloor() {
        const currentRooms = this.getFilteredRoomsForFloor(this.currentFloor);
        console.log(`Rendering floor ${this.currentFloor} with ${currentRooms.length} rooms`);
        
        if (this.currentFloor === '5') {
            this.renderFloor5(currentRooms);
        } else {
            this.renderRegularFloor(this.currentFloor, currentRooms);
        }

        this.updateFloorStats(this.currentFloor, currentRooms);
    }

    renderRegularFloor(floor, rooms) {
        // Define room layout for each floor based on floor plan
        const roomLayouts = {
            '1': {
                'top': [17, 18, 19, 20, 21],
                'middle': [14, 15, 16],
                'lowerMiddle': [9, 10, 11, 12, 13],
                'bottom': [1, 2, 3, 4, 5, 6, 7, 8]
            },
            '2': {
                'top': [18, 19, 20, 21, 22, 23, 24],
                'middle': [14, 15, 16, 17],
                'lowerMiddle': [9, 10, 11, 12, 13],
                'bottom': [1, 2, 3, 4, 5, 6, 7, 8]
            },
            '3': {
                'top': [16, 17, 18, 19, 20, 21],
                'middle': [12, 13, 14, 15],
                'lowerMiddle': [8, 9, 10, 11],
                'bottom': [1, 2, 3, 4, 5, 6, 7]
            }
        };

        const layout = roomLayouts[floor];
        if (!layout) return;

        // Clear existing rooms
        const sections = ['top', 'middle', 'lowerMiddle', 'bottom'];
        sections.forEach(section => {
            const sectionKey = section === 'lowerMiddle' ? 'lower-middle' : section;
            const container = document.getElementById(`floor${floor}-${sectionKey}-row`);
            if (container) {
                container.innerHTML = '';
            }
        });

        // Render rooms in their designated sections
        sections.forEach(section => {
            const sectionKey = section === 'lowerMiddle' ? 'lower-middle' : section;
            const container = document.getElementById(`floor${floor}-${sectionKey}-row`);
            if (!container) return;

            const sectionRooms = layout[section];
            sectionRooms.forEach(roomNum => {
                const roomStr = roomNum.toString().padStart(2, '0');
                const matchingRooms = rooms.filter(room => {
                    const roomNumber = room['No Kamar'];
                    return roomNumber.slice(2) === roomStr;
                });

                matchingRooms.forEach(room => {
                    const roomElement = this.createRoomElement(room);
                    container.appendChild(roomElement);
                });
            });
        });
    }

    renderFloor5(rooms) {
        // Clear existing rooms
        const leftWing = document.getElementById('floor5-left-wing');
        const rightWing = document.getElementById('floor5-right-wing');
        
        if (leftWing) leftWing.innerHTML = '';
        if (rightWing) rightWing.innerHTML = '';

        // Split rooms between left and right wings
        const leftRooms = rooms.filter(room => {
            const roomNum = parseInt(room['No Kamar'].slice(2));
            return roomNum <= 10; // Rooms 01-10 on left
        });

        const rightRooms = rooms.filter(room => {
            const roomNum = parseInt(room['No Kamar'].slice(2));
            return roomNum > 10; // Rooms 11+ on right
        });

        leftRooms.forEach(room => {
            if (leftWing) {
                const roomElement = this.createRoomElement(room);
                leftWing.appendChild(roomElement);
            }
        });

        rightRooms.forEach(room => {
            if (rightWing) {
                const roomElement = this.createRoomElement(room);
                rightWing.appendChild(roomElement);
            }
        });
    }

    createRoomElement(room) {
        const isAvailable = room['Penghuni'] === '-';
        const statusClass = isAvailable ? 'available' : 'waiting';
        const statusText = isAvailable ? 'Tersedia' : 'Waiting List';

        const roomDiv = document.createElement('div');
        roomDiv.className = `room-card ${statusClass}`;
        roomDiv.dataset.room = JSON.stringify(room);
        roomDiv.style.cursor = 'pointer';
        
        roomDiv.innerHTML = `
            <div class="room-number">${room['No Kamar']}</div>
            <div class="room-type">${room['Tiper Kamar']}</div>
            <div class="room-status ${statusClass}">${statusText}</div>
        `;

        return roomDiv;
    }

    getFilteredRoomsForFloor(floor) {
        return this.filteredRooms.filter(room => {
            const roomFloor = room['No Kamar'].charAt(1);
            return roomFloor === floor;
        });
    }

    filterRooms() {
        console.log('Filtering rooms...');
        
        const searchInput = document.getElementById('searchInput');
        const roomTypeFilter = document.getElementById('roomTypeFilter');
        const statusFilter = document.getElementById('statusFilter');

        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const roomTypeValue = roomTypeFilter ? roomTypeFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';

        console.log('Filter values:', { searchTerm, roomTypeValue, statusValue });

        this.filteredRooms = this.roomData.filter(room => {
            // Search filter
            const matchesSearch = !searchTerm || 
                room['No Kamar'].toLowerCase().includes(searchTerm) ||
                room['Penghuni'].toLowerCase().includes(searchTerm);

            // Room type filter
            const matchesType = !roomTypeValue || room['Tiper Kamar'] === roomTypeValue;

            // Status filter
            let matchesStatus = true;
            if (statusValue === 'available') {
                matchesStatus = room['Penghuni'] === '-';
            } else if (statusValue === 'waiting') {
                matchesStatus = room['Penghuni'] !== '-';
            }

            return matchesSearch && matchesType && matchesStatus;
        });

        console.log(`Filtered to ${this.filteredRooms.length} rooms`);
        
        this.renderCurrentFloor();
        this.updateStats();
    }

    updateStats() {
        const totalRooms = this.roomData.length;
        const availableRooms = this.roomData.filter(room => room['Penghuni'] === '-').length;
        const waitingRooms = totalRooms - availableRooms;

        const totalRoomsEl = document.getElementById('totalRooms');
        const availableRoomsEl = document.getElementById('availableRooms');
        const waitingRoomsEl = document.getElementById('waitingRooms');

        if (totalRoomsEl) totalRoomsEl.textContent = totalRooms;
        if (availableRoomsEl) availableRoomsEl.textContent = availableRooms;
        if (waitingRoomsEl) waitingRoomsEl.textContent = waitingRooms;
    }

    updateFloorStats(floor, rooms) {
        const totalRooms = rooms.length;
        const availableRooms = rooms.filter(room => room['Penghuni'] === '-').length;

        const floorTotalEl = document.getElementById(`floor${floor}Total`);
        const floorAvailableEl = document.getElementById(`floor${floor}Available`);

        if (floorTotalEl) floorTotalEl.textContent = totalRooms;
        if (floorAvailableEl) floorAvailableEl.textContent = availableRooms;
    }

    showRoomModal(room) {
        console.log('Opening modal for room:', room['No Kamar']);
        
        const modal = document.getElementById('roomModal');
        if (!modal) return;

        const isAvailable = room['Penghuni'] === '-';

        // Update modal content
        this.updateModalElement('modalTitle', `Detail Kamar ${room['No Kamar']}`);
        this.updateModalElement('modalRoomNumber', room['No Kamar']);
        this.updateModalElement('modalRoomType', room['Tiper Kamar']);
        
        const modalStatus = document.getElementById('modalStatus');
        if (modalStatus) {
            modalStatus.textContent = isAvailable ? 'Tersedia' : 'Waiting List';
            modalStatus.className = `status ${isAvailable ? 'status--success' : 'status--warning'}`;
        }
        
        this.updateModalElement('modalOccupant', isAvailable ? 'Tidak ada penghuni' : room['Penghuni']);
        this.updateModalElement('modalDP', room['DP'] === 'TRUE' ? 'Sudah bayar' : 'Belum bayar');
        this.updateModalElement('modalDPDate', room['Tanggal DP'] === '-' ? 'Tidak ada' : room['Tanggal DP']);
        this.updateModalElement('modalPayment', room['Pelunasan'] === 'TRUE' ? 'Lunas' : 'Belum lunas');

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    updateModalElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    closeModal() {
        const modal = document.getElementById('roomModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }
        console.log('Modal closed');
    }

    updateLastUpdated() {
        const lastUpdatedEl = document.getElementById('lastUpdated');
        if (lastUpdatedEl) {
            const now = new Date();
            const formattedDate = now.toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            lastUpdatedEl.textContent = formattedDate;
        }
    }

    showLoadingState() {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const container = document.getElementById('floorPlansContainer');
        
        if (loadingState) loadingState.classList.remove('hidden');
        if (errorState) errorState.classList.add('hidden');
        if (container) container.style.opacity = '0.5';
    }

    hideLoadingState() {
        const loadingState = document.getElementById('loadingState');
        const container = document.getElementById('floorPlansContainer');
        
        if (loadingState) loadingState.classList.add('hidden');
        if (container) container.style.opacity = '1';
    }

    showErrorState() {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const container = document.getElementById('floorPlansContainer');
        
        if (loadingState) loadingState.classList.add('hidden');
        if (errorState) errorState.classList.remove('hidden');
        if (container) container.style.opacity = '0.5';
    }

    async refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (!refreshBtn) return;
        
        const originalText = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '🔄 Memuat...';
        refreshBtn.disabled = true;
        
        await this.loadRoomData();
        this.organizeRoomsByFloor();
        this.updateStats();
        this.renderCurrentFloor();
        this.updateLastUpdated();
        
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
    }
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.kostDashboard = new KostFloorPlanDashboard();
});
