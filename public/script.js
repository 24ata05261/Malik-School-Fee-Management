// School Fee Payment Management System
// Developed By: PINJARI ABDUL MALIK

const API = "http://localhost:3000";

// ===============================
// STUDENT MANAGEMENT
// ===============================

// Add Student
document.getElementById("studentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        className: document.getElementById("className").value,
        roll_no: document.getElementById("roll_no").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value
    };

    try {
        const response = await fetch(`${API}/students`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        if (response.ok) {
            alert("Student Added Successfully!");

            document.getElementById("studentForm").reset();

            loadStudents();
        } else {
            alert("Failed to Add Student");
        }
    } catch (error) {
        alert("Server Connection Failed!");
        console.error(error);
    }
});


// Display Students
async function loadStudents() {
    try {
        const response = await fetch(`${API}/students`);
        const students = await response.json();

        const table = document.getElementById("studentTable");

        table.innerHTML = "";

        students.forEach(student => {
            table.innerHTML += `
                <tr>
                    <td>${student.student_id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>${student.roll_no}</td>
                    <td>${student.phone}</td>
                    <td>${student.email}</td>
                    <td>Registered</td>
                </tr>
            `;
        });

        document.getElementById("totalStudents").innerText = students.length;

    } catch (error) {
        console.error("Error Loading Students:", error);
    }
}


// ===============================
// FEE MANAGEMENT
// ===============================

// Assign Fee
document.getElementById("feeForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const fee = {
        student_id: document.getElementById("feeStudentId").value,
        academic_year: document.getElementById("academicYear").value,
        fee_type: document.getElementById("feeType").value,
        total_amount: document.getElementById("totalAmount").value,
        due_date: document.getElementById("dueDate").value
    };

    try {
        const response = await fetch(`${API}/fees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fee)
        });

        if (response.ok) {
            alert("Fee Assigned Successfully!");

            document.getElementById("feeForm").reset();

            loadFees();
            loadDashboard();
        } else {
            alert("Failed to Assign Fee");
        }
    } catch (error) {
        alert("Server Connection Failed!");
        console.error(error);
    }
});


// Display Fees
async function loadFees() {
    try {
        const response = await fetch(`${API}/fees`);
        const fees = await response.json();

        const table = document.getElementById("feeTable");

        table.innerHTML = "";

        fees.forEach(fee => {
            table.innerHTML += `
                <tr>
                    <td>${fee.fee_id}</td>
                    <td>${fee.student_id}</td>
                    <td>${fee.academic_year}</td>
                    <td>${fee.fee_type}</td>
                    <td>₹${fee.total_amount}</td>
                    <td>${fee.due_date}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error Loading Fees:", error);
    }
}


// ===============================
// PAYMENT MANAGEMENT
// ===============================

// Record Payment
document.getElementById("paymentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const payment = {
        fee_id: document.getElementById("paymentFeeId").value,
        amount_paid: document.getElementById("amountPaid").value,
        payment_date: document.getElementById("paymentDate").value,
        payment_method: document.getElementById("paymentMethod").value,
        receipt_no: document.getElementById("receiptNo").value
    };

    try {
        const response = await fetch(`${API}/payments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payment)
        });

        if (response.ok) {
            alert("Payment Recorded Successfully!");

            document.getElementById("paymentForm").reset();

            loadPayments();
            loadPendingFees();
            loadDashboard();
        } else {
            alert("Failed to Record Payment");
        }
    } catch (error) {
        alert("Server Connection Failed!");
        console.error(error);
    }
});


// Display Payments
async function loadPayments() {
    try {
        const response = await fetch(`${API}/payments`);
        const payments = await response.json();

        const table = document.getElementById("paymentTable");

        table.innerHTML = "";

        payments.forEach(payment => {
            table.innerHTML += `
                <tr>
                    <td>${payment.payment_id}</td>
                    <td>${payment.fee_id}</td>
                    <td>₹${payment.amount_paid}</td>
                    <td>${payment.payment_date}</td>
                    <td>${payment.payment_method}</td>
                    <td>${payment.receipt_no}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error Loading Payments:", error);
    }
}


// ===============================
// PENDING FEES
// ===============================

async function loadPendingFees() {
    try {
        const response = await fetch(`${API}/pending`);
        const pending = await response.json();

        const table = document.getElementById("pendingTable");

        table.innerHTML = "";

        pending.forEach(item => {
            table.innerHTML += `
                <tr>
                    <td>${item.student_id}</td>
                    <td>${item.name}</td>
                    <td>₹${item.total_fee}</td>
                    <td>₹${item.paid_amount}</td>
                    <td>₹${item.pending_amount}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error Loading Pending Fees:", error);
    }
}


// ===============================
// DASHBOARD
// ===============================

async function loadDashboard() {
    try {
        const [feeResponse, paymentResponse] = await Promise.all([
            fetch(`${API}/fees`),
            fetch(`${API}/payments`)
        ]);

        const fees = await feeResponse.json();
        const payments = await paymentResponse.json();

        let totalFees = 0;
        let paidAmount = 0;

        fees.forEach(fee => {
            totalFees += Number(fee.total_amount);
        });

        payments.forEach(payment => {
            paidAmount += Number(payment.amount_paid);
        });

        let pendingAmount = totalFees - paidAmount;

        document.getElementById("totalFees").innerText =
            "₹" + totalFees.toLocaleString("en-IN");

        document.getElementById("paidAmount").innerText =
            "₹" + paidAmount.toLocaleString("en-IN");

        document.getElementById("pendingAmount").innerText =
            "₹" + pendingAmount.toLocaleString("en-IN");

    } catch (error) {
        console.error("Dashboard Error:", error);
    }
}


// ===============================
// LOAD ALL DATA
// ===============================

function loadAllData() {
    loadStudents();
    loadFees();
    loadPayments();
    loadPendingFees();
    loadDashboard();
}


// Load Data When Page Opens
window.onload = function () {
    loadAllData();
};