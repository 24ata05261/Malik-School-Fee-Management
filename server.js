// School Fee Payment Management System
// Developed By: PINJARI ABDUL MALIK

const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// ===============================
// STUDENT MANAGEMENT
// ===============================

// Get All Students
app.get("/students", (req, res) => {

    const sql = "SELECT * FROM students";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});


// Add Student
app.post("/students", (req, res) => {

    const { name, className, roll_no, phone, email } = req.body;

    const sql = `
        INSERT INTO students
        (name, class, roll_no, phone, email)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, className, roll_no, phone, email],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Student Added Successfully!",
                student_id: result.insertId
            });

        }
    );

});


// ===============================
// FEE MANAGEMENT
// ===============================

// Get All Fees
app.get("/fees", (req, res) => {

    const sql = "SELECT * FROM fee_details";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});


// Assign Fee
app.post("/fees", (req, res) => {

    const {
        student_id,
        academic_year,
        fee_type,
        total_amount,
        due_date
    } = req.body;

    const sql = `
        INSERT INTO fee_details
        (student_id, academic_year, fee_type, total_amount, due_date)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [student_id, academic_year, fee_type, total_amount, due_date],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Fee Assigned Successfully!",
                fee_id: result.insertId
            });

        }
    );

});


// ===============================
// PAYMENT MANAGEMENT
// ===============================

// Get All Payments
app.get("/payments", (req, res) => {

    const sql = "SELECT * FROM payments";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});


// Record Payment
app.post("/payments", (req, res) => {

    const {
        fee_id,
        amount_paid,
        payment_date,
        payment_method,
        receipt_no
    } = req.body;

    const amount = Number(amount_paid);

    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            message: "Enter a valid payment amount."
        });
    }

    // Check Fee and Remaining Balance
    const checkSql = `
        SELECT
            f.total_amount,
            COALESCE(SUM(p.amount_paid), 0) AS paid_amount
        FROM fee_details f
        LEFT JOIN payments p ON f.fee_id = p.fee_id
        WHERE f.fee_id = ?
        GROUP BY f.fee_id
    `;

    db.query(checkSql, [fee_id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Fee record not found."
            });
        }

        const totalAmount = Number(result[0].total_amount);
        const paidAmount = Number(result[0].paid_amount);
        const balance = totalAmount - paidAmount;

        if (amount > balance) {
            return res.status(400).json({
                message: `Payment exceeds pending balance of ₹${balance}.`
            });
        }

        const insertSql = `
            INSERT INTO payments
            (fee_id, amount_paid, payment_date, payment_method, receipt_no)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            insertSql,
            [fee_id, amount, payment_date, payment_method, receipt_no],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    message: "Payment Recorded Successfully!",
                    payment_id: result.insertId
                });

            }
        );

    });

});


// ===============================
// PENDING FEES
// ===============================

app.get("/pending", (req, res) => {

    const sql = `
        SELECT
            s.student_id,
            s.name,
            SUM(f.total_amount) AS total_fee,
            SUM(COALESCE(p.paid_amount, 0)) AS paid_amount,
            SUM(f.total_amount - COALESCE(p.paid_amount, 0))
                AS pending_amount

        FROM students s

        JOIN fee_details f
            ON s.student_id = f.student_id

        LEFT JOIN (
            SELECT
                fee_id,
                SUM(amount_paid) AS paid_amount
            FROM payments
            GROUP BY fee_id
        ) p
            ON f.fee_id = p.fee_id

        GROUP BY s.student_id, s.name

        HAVING pending_amount > 0
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});


// ===============================
// START SERVER
// ===============================

app.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});