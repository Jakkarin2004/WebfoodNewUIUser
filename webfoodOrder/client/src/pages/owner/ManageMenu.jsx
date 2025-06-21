import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Upload, Star } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/owner/menu"; // เปลี่ยนเป็น URL จริงของ API
const API_URL_MENU_TYPE = "http://localhost:3000/api/owner/menu/menu_type"; // เปลี่ยนเป็น URL จริงของ API

const ManageMenu = () => {
  const [menus, setMenus] = useState([]);
  const [menusType, setMenusType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  useEffect(() => {
    fetchMenu();
    fetchMenuType();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(API_URL);
      // console.log(response.data); // เช็คข้อมูลที่ได้
      setMenus(response.data.menus || response.data || []); // ปรับตามโครงสร้าง API จริง
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดหมวดหมู่:", error);
    }
  };

  const fetchMenuType = async () => {
    try {
      const response = await axios.get(API_URL_MENU_TYPE);
      // console.log(response.data); // เช็คข้อมูลที่ได้
      setMenusType(response.data.menus || response.data || []); // ปรับตามโครงสร้าง API จริง
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดหมวดหมู่:", error);
    }
  };

  const [formData, setFormData] = useState({
    menu_name: "",
    menu_image: "",
    price: "",
    special: false,
    detail_menu: "",
    menu_type_id: "", // ตั้งค่าเริ่มต้นเป็นค่าว่างไปก่อน
  });

  const resetForm = () => {
    setFormData({
      menu_name: "",
      menu_image: "",
      price: "",
      special: false,
      detail_menu: "",
      menu_type_id: 1,
    });
    setEditingMenu(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formData.menu_name || !formData.price) {
      alert("กรุณากรอกชื่อเมนูและราคา");
      return;
    }

    if (editingMenu) {
      // Update existing menu
      setMenus(
        menus.map((menu) =>
          menu.menu_id === editingMenu.menu_id
            ? {
                ...menu,
                ...formData,
                price: parseFloat(formData.price),
                special: formData.special ? 1 : 0,
                updated_at: new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " "),
              }
            : menu
        )
      );
    } else {
      // Add new menu
      const newMenu = {
        menu_id: Math.max(...menus.map((m) => m.menu_id)) + 1,
        ...formData,
        price: parseFloat(formData.price),
        special: formData.special ? 1 : 0,
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      };
      setMenus([...menus, newMenu]);
    }

    resetForm();
  };

  const handleEdit = (menu) => {
    setFormData({
      menu_name: menu.menu_name,
      menu_image: menu.menu_image,
      price: menu.price.toString(),
      special: menu.special === 1,
      detail_menu: menu.detail_menu,
      menu_type_id: menu.menu_type_id,
    });
    setEditingMenu(menu);
    setShowForm(true);
  };

  const handleDelete = (menuId) => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบเมนูนี้?")) {
      setMenus(menus.filter((menu) => menu.menu_id !== menuId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                จัดการเมนูอาหาร
              </h1>
              <p className="text-gray-600">เพิ่ม แก้ไข และลบเมนูอาหารในร้าน</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              เพิ่มเมนูใหม่
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {/* {editingMenu ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"} */}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ชื่อเมนู *
                    </label>
                    <input
                      type="text"
                      value={formData.menu_name}
                      onChange={(e) =>
                        setFormData({ ...formData, menu_name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="กรอกชื่อเมนู"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ราคา (บาท) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ประเภทเมนู
                  </label>
                  <select
                    value={formData.menu_type_id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        menu_type_id: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    {menusType.map((type) => (
                      <option key={type.menu_type_id} value={type.menu_type_id}>
                        {type.type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    รูปภาพเมนู
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="bg-orange-100 hover:bg-orange-200 text-orange-600 px-4 py-3 rounded-xl transition-colors flex items-center gap-2 cursor-pointer">
                      <Upload size={18} />
                      อัพโหลด
                      <input
                        type="file"
                        className="" // ซ่อน input จริง
                        onChange={(e) => console.log(e.target.files)} // ตัวอย่างการ handle onChange
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    รายละเอียดเมนู
                  </label>
                  <textarea
                    value={formData.detail_menu}
                    onChange={(e) =>
                      setFormData({ ...formData, detail_menu: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    placeholder="รายละเอียดของเมนู เช่น วัตถุดิบ รสชาติ..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="special"
                      checked={formData.special}
                      onChange={(e) =>
                        setFormData({ ...formData, special: e.target.checked })
                      }
                      className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label
                      htmlFor="special"
                      className="ml-2 text-sm font-semibold text-gray-700"
                    >
                      เมนูพิเศษ
                    </label>
                  </div>
                  <Star size={18} className="text-orange-400" />
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingMenu ? "บันทึกการแก้ไข" : "เพิ่มเมนู"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600">
            <h2 className="text-xl font-bold text-white">
              รายการเมนูทั้งหมด ({menus.length} เมนู)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    ชื่อเมนู
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    ประเภท
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    ราคา
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    สถานะ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    รายละเอียด
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {menus.map((menu, index) => (
                  <tr
                    key={menu.menu_id}
                    className={`hover:bg-orange-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-300 rounded-xl flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-lg">
                            {menu.menu_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {menu.menu_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID: {menu.menu_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {menu.menu_type_id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-orange-600">
                        {typeof menu.price === "number"
                          ? menu.price.toFixed(2)
                          : !isNaN(parseFloat(menu.price))
                          ? parseFloat(menu.price).toFixed(2)
                          : "0.00"}{" "}
                        ฿
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {menu.special === 1 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200">
                          <Star size={14} className="fill-current" />
                          เมนูพิเศษ
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          เมนูทั่วไป
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="text-sm text-gray-600 max-w-xs truncate"
                        title={menu.detail_menu}
                      >
                        {menu.detail_menu || "ไม่มีรายละเอียด"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(menu)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors shadow-md transform hover:scale-105"
                          title="แก้ไข"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(menu.menu_id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-md transform hover:scale-105"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {menus.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-500 text-lg">ยังไม่มีเมนูในระบบ</p>
              <p className="text-gray-400">เริ่มต้นโดยการเพิ่มเมนูแรกของคุณ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMenu;
