const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const path = require("path");
const fs = require("fs");

// GET /menus - ดึงข้อมูลเมนูทั้งหมด พร้อมประเภท
router.get("/", (req, res) => {
  const sql = `SELECT menu.*, menu_type.type_name AS menu_type_id 
FROM menu 
INNER JOIN menu_type ON menu.menu_id  = menu_type.menu_type_id `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err);
      return res
        .status(500)
        .json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู" });
    }
    res.json(results);
  });
});

router.get("/menu_type", (req, res) => {
  const sql = `SELECT * FROM menu_type`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err);
      return res
        .status(500)
        .json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู" });
    }
    res.json(results);
  });
});

// GET /menus/:id - ดึงข้อมูลเมนูตาม ID
// router.get('/:id', (req, res) => {
//   const { id } = req.params;
//   const sql = `
//     SELECT menu.*, COALESCE(menu_type.type_name, 'ไม่ระบุประเภท') AS type_name
//     FROM menu
//     LEFT JOIN menu_type ON menu.menu_type_id = menu_type.menu_type_id
//     WHERE menu.menu_id = ?
//   `;
//   db.query(sql, [id], (err, results) => {
//     if (err) {
//       console.error('❌ Query Error:', err);
//       return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเมนู' });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ error: 'ไม่พบเมนูที่ต้องการ' });
//     }
//     res.json(results[0]);
//   });
// });

// POST /menus - สร้างเมนูใหม่
// router.post('/', (req, res) => {
//   const { menu_name, price, special, detail_menu, menu_type_id, menu_image } = req.body;

//   if (!menu_type_id) {
//     return res.status(400).json({ error: 'กรุณาเลือกหมวดหมู่' });
//   }

//   const sql = `
//     INSERT INTO menu (menu_name, price, special, detail_menu, menu_type_id, menu_image)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;

//   db.query(sql, [menu_name, price, special, detail_menu, menu_type_id, menu_image], (err, result) => {
//     if (err) {
//       console.error('❌ Insert Error:', err);
//       return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มเมนู' });
//     }
//     res.status(201).json({ message: 'เพิ่มเมนูสำเร็จ', id: result.insertId });
//   });
// });

// PUT /menus/:id - อัปเดตเมนูตาม ID
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { menu_name, price, special, detail_menu, menu_type_id, menu_image } = req.body;

//   if (!menu_type_id) {
//     return res.status(400).json({ error: 'กรุณาเลือกหมวดหมู่' });
//   }

//   try {
//     // ดึงข้อมูลรูปเก่า
//     db.query("SELECT menu_image FROM menu WHERE menu_id = ?", [id], (err, rows) => {
//       if (err) {
//         console.error('❌ Query Error:', err);
//         return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเมนูเก่า' });
//       }
//       if (rows.length === 0) {
//         return res.status(404).json({ error: 'ไม่พบเมนูที่ต้องการอัปเดต' });
//       }

//       let newImage = rows[0].menu_image;

//       if (menu_image && menu_image !== newImage) {
//         // ลบรูปเก่า
//         const oldImagePath = path.join(__dirname, "../public/uploads/food", newImage);
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//           console.log("✅ ลบรูปเก่าแล้ว:", newImage);
//         }
//         newImage = menu_image;
//       }

//       // อัปเดตข้อมูล
//       const sql = `
//         UPDATE menu
//         SET menu_name = ?, price = ?, special = ?, detail_menu = ?, menu_type_id = ?, menu_image = ?
//         WHERE menu_id = ?
//       `;

//       db.query(sql, [menu_name, price, special, detail_menu, menu_type_id, newImage, id], (err2, result) => {
//         if (err2) {
//           console.error('❌ Update Error:', err2);
//           return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตเมนู' });
//         }
//         res.json({ message: 'อัปเดตเมนูสำเร็จ' });
//       });
//     });
//   } catch (error) {
//     console.error('❌ Error:', error);
//     res.status(500).json({ error: 'เกิดข้อผิดพลาดในการประมวลผล' });
//   }
// });

// DELETE /menus/:id - ลบเมนูตาม ID พร้อมลบรูปภาพ
// router.delete('/:id', (req, res) => {
//   const { id } = req.params;

//   // ดึงชื่อไฟล์รูปภาพก่อนลบ
//   db.query("SELECT menu_image FROM menu WHERE menu_id = ?", [id], (err, rows) => {
//     if (err) {
//       console.error('❌ Query Error:', err);
//       return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเมนู' });
//     }
//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'ไม่พบเมนูที่ต้องการลบ' });
//     }

//     const imageFile = rows[0].menu_image;
//     if (imageFile) {
//       const imagePath = path.join(__dirname, "../public/uploads/food", imageFile);
//       if (fs.existsSync(imagePath)) {
//         fs.unlink(imagePath, (unlinkErr) => {
//           if (unlinkErr) {
//             console.warn('⚠️ ลบรูปภาพไม่สำเร็จ:', unlinkErr.message);
//           } else {
//             console.log("✅ ลบรูปภาพแล้ว:", imageFile);
//           }
//         });
//       }
//     }

//     // ลบข้อมูลเมนู
//     db.query("DELETE FROM menu WHERE menu_id = ?", [id], (err2, result) => {
//       if (err2) {
//         console.error('❌ Delete Error:', err2);
//         return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบเมนู' });
//       }
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: 'ไม่พบเมนูที่ต้องการลบ' });
//       }
//       res.json({ message: 'ลบเมนูสำเร็จ' });
//     });
//   });
// });

module.exports = router;
