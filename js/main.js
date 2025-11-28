/* ==========================================================
   CẤU HÌNH CHUNG
   ========================================================== */
// THAY ĐỔI MSSV CỦA BẠN TẠI ĐÂY ĐỂ TEST LOGIC MÀU SẮC
const MY_MSSV = "20241234"; 

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       LOGIC BÀI 01: BOOKING SYSTEM
       ========================================================== */
    const seatContainer = document.getElementById('seatContainer');
    
    // Kiểm tra xem có đang ở trang Bài 1 không
    if (seatContainer) {
        const countSpan = document.getElementById('count');
        const totalSpan = document.getElementById('total');
        const modal = document.getElementById('paymentModal');
        const btnCheckout = document.getElementById('btnCheckout');
        const ticketDetails = document.getElementById('ticketDetails');
        const closeModal = document.querySelector('.close-modal');

        const rows = 5;
        const cols = 8;
        let selectedSeats = [];
        const PRICES = { standard: 50000, vip: 80000, couple: 150000 };

        // 1. Render ghế
        function initSeats() {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const seat = document.createElement('div');
                    seat.classList.add('seat');
                    seat.dataset.row = r + 1;
                    seat.dataset.col = c + 1;

                    // Phân loại ghế
                    if (r < 2) {
                        seat.classList.add('standard');
                        seat.dataset.price = PRICES.standard;
                        seat.dataset.type = 'Thường';
                    } else if (r < 4) {
                        seat.classList.add('vip');
                        seat.dataset.price = PRICES.vip;
                        seat.dataset.type = 'VIP';
                    } else {
                        seat.classList.add('couple');
                        seat.dataset.price = PRICES.couple;
                        seat.dataset.type = 'Đôi';
                    }

                    // Giả lập ghế đã bán (Random 15%)
                    if (Math.random() < 0.15) {
                        seat.classList.add('booked');
                    }

                    seatContainer.appendChild(seat);
                }
            }
        }

        // 2. Xử lý Click ghế (Event Delegation)
        seatContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('seat') && !e.target.classList.contains('booked')) {
                const seat = e.target;

                if (seat.classList.contains('selected')) {
                    // Bỏ chọn
                    seat.classList.remove('selected');
                    selectedSeats = selectedSeats.filter(s => s !== seat);
                } else {
                    // Chọn mới (Validate max 5)
                    if (selectedSeats.length >= 5) {
                        alert('Bạn chỉ được chọn tối đa 5 ghế!');
                        return;
                    }
                    seat.classList.add('selected');
                    selectedSeats.push(seat);
                }
                updateTotal();
            }
        });

        // 3. Tính tiền
        function updateTotal() {
            countSpan.innerText = selectedSeats.length;
            const total = selectedSeats.reduce((acc, s) => acc + parseInt(s.dataset.price), 0);
            totalSpan.innerText = total.toLocaleString();
        }

        // 4. Modal thanh toán
        btnCheckout.addEventListener('click', () => {
            if (selectedSeats.length === 0) {
                alert('Vui lòng chọn ghế!');
                return;
            }
            let html = '<ul style="list-style:none; padding:0;">';
            let total = 0;
            selectedSeats.forEach(s => {
                const price = parseInt(s.dataset.price);
                html += `<li>- Hàng ${s.dataset.row} / Ghế ${s.dataset.col} (${s.dataset.type}): <b>${price.toLocaleString()}đ</b></li>`;
                total += price;
            });
            html += `</ul><h3 style="margin-top:10px; text-align:right">Tổng: ${total.toLocaleString()} VNĐ</h3>`;
            ticketDetails.innerHTML = html;
            modal.style.display = "block";
        });

        closeModal.onclick = () => modal.style.display = "none";
        window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

        // Chạy khởi tạo
        initSeats();
    }


    /* ==========================================================
       LOGIC BÀI 02: TODO MATRIX
       ========================================================== */
    const taskInput = document.getElementById('taskInput');
    
    // Kiểm tra xem có đang ở trang Bài 2 không
    if (taskInput) {
        const priorityInput = document.getElementById('priorityInput');
        const btnAdd = document.getElementById('btnAdd');
        const mssvSpan = document.getElementById('displayMssv');
        
        // Hiển thị MSSV
        if(mssvSpan) mssvSpan.innerText = MY_MSSV;

        const STORAGE_KEY = `tasks_${MY_MSSV}`;
        
        // Logic Anti-AI: Check số cuối MSSV
        const lastDigit = parseInt(MY_MSSV.slice(-1));
        const isEven = lastDigit % 2 === 0; // True nếu chẵn, False nếu lẻ

        // Load dữ liệu
        let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        renderTasks();

        // 1. Hàm Thêm
        btnAdd.addEventListener('click', () => {
            const text = taskInput.value.trim();
            const priority = priorityInput.value;

            if (!text) return alert("Vui lòng nhập công việc");

            const newTask = {
                id: Date.now(),
                name: text,
                priority: priority
            };
            
            tasks.push(newTask);
            saveAndRender();
            taskInput.value = '';
        });

        // 2. Hàm Lưu & Render
        function saveAndRender() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            renderTasks();
        }

        function renderTasks() {
            // Xóa cũ
            [1, 2, 3, 4].forEach(i => document.getElementById(`list-${i}`).innerHTML = '');

            tasks.forEach(task => {
                const div = document.createElement('div');
                div.className = 'task-item';
                
                // Logic Màu sắc
                if (task.name.length > 10) {
                    if (isEven) {
                        div.style.color = 'red'; // Số cuối chẵn -> Đỏ
                    } else {
                        div.style.color = 'blue'; // Số cuối lẻ -> Xanh Dương
                    }
                    div.style.fontWeight = 'bold';
                }

                div.innerHTML = `
                    <span>${task.name}</span>
                    <span class="btn-del" data-id="${task.id}">&times;</span>
                `;

                // Tìm ô tương ứng
                const targetBox = document.getElementById(`list-${task.priority}`);
                if (targetBox) targetBox.appendChild(div);
            });
        }

        // 3. Hàm Xóa (Event Delegation)
        document.querySelector('.matrix-grid').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-del')) {
                const id = parseInt(e.target.dataset.id);
                if (confirm('Xóa công việc này?')) {
                    tasks = tasks.filter(t => t.id !== id);
                    saveAndRender();
                }
            }
        });
    }
});
