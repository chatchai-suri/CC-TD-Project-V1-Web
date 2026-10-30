// src/components/AdminUserModal.tsx
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
  const changeUserRole = useGolfStore((state: any) => state.changeUserRole);
  const resetUserPassword = useGolfStore((state: any) => state.resetUserPassword);

  const [isAddMode, setIsModalAddMode] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

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
      setSearchTerm('');
    }
  }, [isOpen, fetchUserList]);

  if (!isOpen) return null;

  // กรองรายชื่อนักกอล์ฟแบบเรียลไทม์ตามคำค้นหา
  const filteredUsers = (userList || []).filter((u: any) => {
    const term = searchTerm.toLowerCase();
    const fullname = (u.fullname || '').toLowerCase();
    const nickname = (u.nickname || '').toLowerCase();
    const username = (u.username || '').toLowerCase();
    return fullname.includes(term) || nickname.includes(term) || username.includes(term);
  });

  const handleOpenAdd = () => {
    setFormData({ username: '', fullname: '', nickname: '', age: '', password: 'password123', confirmPassword: 'password123' });
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

  const handleRoleChange = async (userId: number, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      await changeUserRole(userId, newRole);
    } finally {
      setUpdatingUserId(null);
    }
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
          Swal.fire('ข้อผิดพลาด', err?.response?.data?.message || err?.message || 'ลบไม่สำเร็จ', 'error');
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isAddMode) {
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
      Swal.fire('เกิดข้อผิดพลาด', err?.response?.data?.message || err?.message || 'ทำรายการไม่สำเร็จ', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b mb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              👥 จัดการประชากรนักกอล์ฟ (TD Control)
            </h3>
            <p className="text-[10px] text-slate-500">จัดการสิทธิ์ เปลี่ยนบทบาท และรีเซ็ตรหัสผ่านในสนาม ({filteredUsers.length} ท่าน)</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer p-1">✕</button>
        </div>

        {/* Content Body */}
        {isAddMode || editingUser ? (
          /* Sub-Form Mode: Add / Edit */
          <form onSubmit={handleSubmit} className="space-y-2 text-left overflow-y-auto pr-1">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-[10px] font-black text-purple-700 uppercase">
                {isAddMode ? "➕ เพิ่มนักกอล์ฟใหม่ (Register Onsite)" : `✏️ แก้ไขโปรไฟล์ (ID: ${editingUser?.user_id})`}
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-700">Username:</label>
              <input
                type="text" required value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-700">Full Name (ชื่อ-นามสกุลจริง):</label>
              <input
                type="text" required value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 focus:bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black text-slate-700">Nickname (ชื่อเล่น):</label>
                <input
                  type="text" value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 focus:bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-700">Age (อายุ):</label>
                <input
                  type="number" value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 focus:bg-white font-medium"
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
                    className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 focus:bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-700">Confirm Password:</label>
                  <input
                    type="password" required value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-slate-50 focus:bg-white font-medium"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-3">
              <button
                type="button" onClick={() => { setIsModalAddMode(false); setEditingUser(null); }}
                className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                💾 บันทึกข้อมูล
              </button>
            </div>
          </form>
        ) : (
          /* Main User List Mode */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Toolbar: Search + Add Button */}
            <div className="space-y-2 mb-2">
              <button
                onClick={handleOpenAdd}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>➕</span>
                <span>เพิ่มนักกอล์ฟใหม่ (Register Onsite)</span>
              </button>

              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 ค้นหาชื่อจริง, ชื่อเล่น หรือ username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* User List Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 scrollbar-thin">
              {filteredUsers.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  ไม่พบข้อมูลนักกอล์ฟที่ตรงกับคำค้นหา
                </div>
              ) : (
                filteredUsers.map((u: any) => (
                  <div key={u.user_id} className="p-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white flex items-center justify-between text-left transition-colors">
                    
                    {/* User Info */}
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-slate-800 truncate">
                          {u.fullname || u.username}
                        </p>
                        {u.nickname && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded font-bold">
                            {u.nickname}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        @{u.username} {u.age ? `| อายุ: ${u.age}` : ''}
                      </p>
                    </div>

                    {/* Actions: Role Selector + Reset PW + Edit + Delete */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      
                      {/* Role Dropdown */}
                      <select
                        value={u.global_role}
                        disabled={updatingUserId === u.user_id}
                        onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                        className={`text-[10px] font-bold px-1.5 py-1 rounded-md border cursor-pointer focus:outline-none ${
                          u.global_role === 'TD'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : u.global_role === 'SCORER'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : u.global_role === 'ADMIN'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="GOLFER">GOLFER</option>
                        <option value="SCORER">SCORER</option>
                        <option value="TD">TD</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>

                      {/* Reset Password Button */}
                      <button
                        onClick={() => resetUserPassword(u.user_id, u.fullname || u.username)}
                        title="รีเซ็ตรหัสผ่านเป็น 123456"
                        className="p-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md text-[10px] font-bold cursor-pointer"
                      >
                        🔑
                      </button>

                      {/* Edit Profile Button */}
                      <button
                        onClick={() => handleOpenEdit(u)}
                        title="แก้ไขโปรไฟล์"
                        className="p-1 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-md text-[10px] font-bold cursor-pointer"
                      >
                        ✏️
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(u)}
                        title="ลบนักกอล์ฟ"
                        className="p-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-[10px] font-bold cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}