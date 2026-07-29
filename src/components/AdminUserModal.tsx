// src/components/td/AdminUserModal.tsx
import React, { useState, useEffect } from 'react';
import { useGolfStore } from '../store/useGolfStore';
import { apiService } from '../utils/apiService';
import Swal from 'sweetalert2';

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminUserModal({ isOpen, onClose }: AdminUserModalProps) {
  const userList = useGolfStore((state: any) => state.userList || []);
  const fetchUserList = useGolfStore((state: any) => state.fetchUserList);

  const [isAddMode, setIsModalAddMode] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    nickname: '',
    age: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (isOpen && fetchUserList) {
      fetchUserList();
    }
  }, [isOpen, fetchUserList]);

  if (!isOpen) return null;

  const handleOpenAdd = () => {
    setFormData({ username: '', fullname: '', nickname: '', age: '', password: '123', confirmPassword: '123' });
    setEditingUser(null);
    setIsModalAddMode(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      fullname: user.fullname || '',
      nickname: user.nickname || '',
      age: user.age ? String(user.age) : '',
      password: '',
      confirmPassword: ''
    });
    setIsModalAddMode(false);
  };

  const handleDelete = (user: any) => {
    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: `ต้องการลบคุณ "${user.fullname || user.username}" ออกจากระบบจริงไหมครับป๋า?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ใช่, ลบทิ้ง!',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiService.delete(`/admin/user/delete/${user.user_id}`);
          Swal.fire('สำเร็จ', 'ลบยูสเซอร์เรียบร้อยแล้วครับ!', 'success');
          if (fetchUserList) fetchUserList();
        } catch (err: any) {
          Swal.fire('ข้อผิดพลาด', err?.response?.data?.message || 'ลบไม่สำเร็จ', 'error');
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isAddMode) {
        // Mode 1: เพิ่มยูสเซอร์ใหม่ผ่าน Admin
        if (formData.password !== formData.confirmPassword) {
          return Swal.fire('รหัสผ่านไม่ตรงกัน', 'กรุณาเช็ครหัสผ่านอีกครั้งครับ', 'warning');
        }
        await apiService.post('/admin/user/addGolfer', {
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          fullname: formData.fullname,
          nickname: formData.nickname,
          age: formData.age
        });
        Swal.fire('สำเร็จ 💾', `เพิ่มนักกอล์ฟ "${formData.fullname || formData.username}" แล้ว!`, 'success');
      } else if (editingUser) {
        // Mode 2: แก้ไขโปรไฟล์
        await apiService.put(`/admin/user/update/${editingUser.user_id}`, {
          username: formData.username,
          fullname: formData.fullname,
          nickname: formData.nickname,
          age: formData.age
        });
        Swal.fire('อัปเดตสำเร็จ 💾', `แก้ไขข้อมูลโปรไฟล์เรียบร้อยแล้วครับ!`, 'success');
      }

      setIsModalAddMode(false);
      setEditingUser(null);
      if (fetchUserList) fetchUserList();
    } catch (err: any) {
      Swal.fire('เกิดข้อผิดพลาด', err?.response?.data?.message || 'ทำรายการไม่สำเร็จ', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-3 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b mb-3">
          <h3 className="text-xs font-black text-slate-900 flex items-center gap-1">
            👥 จัดการประชากรนักกอล์ฟ (TD Control)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer">✕</button>
        </div>

        {/* Content Body */}
        {isAddMode || editingUser ? (
          /* Sub-Form Mode: Add / Edit */
          <form onSubmit={handleSubmit} className="space-y-2 text-left overflow-y-auto pr-1">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] font-black text-purple-700 uppercase">
                {isAddMode ? "➕ เพิ่มนักกอล์ฟใหม่" : `✏️ แก้ไขโปรไฟล์ (ID: ${editingUser?.user_id})`}
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-700">Username:</label>
              <input
                type="text" required value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-2 py-1 text-[11px] border rounded-lg bg-slate-50 focus:bg-white font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-700">Full Name (ชื่อ-นามสกุลจริง):</label>
              <input
                type="text" required value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className="w-full px-2 py-1 text-[11px] border rounded-lg bg-slate-50 focus:bg-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black text-slate-700">Nickname (ชื่อเล่น):</label>
                <input
                  type="text" value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-2 py-1 text-[11px] border rounded-lg bg-slate-50 focus:bg-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-700">Age (อายุ):</label>
                <input
                  type="number" value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-2 py-1 text-[11px] border rounded-lg bg-slate-50 focus:bg-white font-bold"
                />
              </div>
            </div>

            {isAddMode && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] font-black text-slate-700">Password:</label>
                  <input
                    type="password" required value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-2 py-1 text-[11px] border rounded-lg bg-slate-50 focus:bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-700">Confirm Password:</label>
                  <input
                    type="password" required value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-2 py-1 text-[11px] border rounded-lg bg-slate-50 focus:bg-white font-bold"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button" onClick={() => { setIsModalAddMode(false); setEditingUser(null); }}
                className="flex-1 py-1.5 bg-slate-200 text-slate-700 font-black rounded-xl text-[10px]"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-emerald-600 text-white font-black rounded-xl text-[10px] shadow-sm"
              >
                💾 บันทึกข้อมูล
              </button>
            </div>
          </form>
        ) : (
          /* Main User List Mode */
          <div className="flex-1 flex flex-col overflow-hidden">
            <button
              onClick={handleOpenAdd}
              className="w-full py-2 mb-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-sm cursor-pointer"
            >
              ➕ เพิ่มนักกอล์ฟใหม่ (Register Onsite)
            </button>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin">
              {userList.map((u: any) => (
                <div key={u.user_id} className="p-2 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between text-left">
                  <div>
                    <p className="text-[11px] font-black text-slate-800 leading-tight">
                      🏌️‍♂️ {u.fullname || u.username}
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono">
                      User: {u.username} | Role: {u.global_role} {u.age ? `| Age: ${u.age}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1 bg-amber-100 text-amber-800 rounded-md text-[9px] font-black hover:bg-amber-200"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="p-1 bg-red-100 text-red-700 rounded-md text-[9px] font-black hover:bg-red-200"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}