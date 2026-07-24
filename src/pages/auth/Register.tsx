// src/pages/auth/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGolfStore } from '../../store/useGolfStore';
import Swal from 'sweetalert2';

/**
 * 🎯 วัตถุประสงค์: หน้าจอสมัครสมาชิกนักกอล์ฟและผู้จัดการแข่งขัน (Register Page)[cite: 36]
 * @description ปรับปรุงระยะเว้นวรรคให้กระชับพอดีจอ iPhone SE และติดตั้งลิงก์ทางผ่านสับคืนสู่หน้าล็อกอิน[cite: 36]
 */
export default function Register() {
  const navigate = useNavigate();
  const registerGolfer = useGolfStore((state: any) => state.registerGolfer);
  const isLoading = useGolfStore((state: any) => state.isLoading);

  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    age: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    phone_number: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({ username: '', nickname: '', age: '', password: '', confirmPassword: '', fullname: '', phone_number: '' }); //[cite: 36]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'รหัสผ่านไม่ตรงกัน', //[cite: 36]
        text: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกันครับป๋า!', //[cite: 36]
        confirmButtonText: 'รับทราบ', //[cite: 36]
        confirmButtonColor: '#10b981' //[cite: 36]
      });
    }

    const payload = {
      username: formData.username,
      password: formData.password,
      nickname: formData.nickname,
      fullname: formData.fullname || formData.nickname, //[cite: 36]
      phone_number: formData.phone_number || '0800000000', //[cite: 36]
      age: Number(formData.age) || 0 //[cite: 36]
    };

    try {
      await registerGolfer(payload); //[cite: 36]
      Swal.fire({
        icon: 'success',
        title: 'Success', //[cite: 36]
        text: 'สลักชื่อนักกอล์ฟลงคลังสนามเรียบร้อยแล้วครับป๋า! ⛳', //[cite: 36]
        allowOutsideClick: false, //[cite: 36]
        showCancelButton: true, //[cite: 36]
        confirmButtonText: 'ไปหน้า Login', //[cite: 36]
        cancelButtonText: 'ปิด (กลับหน้าหลัก)', //[cite: 36]
        confirmButtonColor: '#059669', //[cite: 36]
        cancelButtonColor: '#64748b', //[cite: 36]
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login'); //[cite: 36]
        } else {
          navigate('/'); //[cite: 36]
        }
      });
    } catch (err: any) {
      const errorMsg = err?.message || ''; //[cite: 36]
      if (errorMsg.includes('คนใช้ในสนามแล้ว') || errorMsg.includes('used') || err?.statusCode === 400) { //[cite: 36]
        Swal.fire({
          icon: 'warning',
          title: 'Username has been used', //[cite: 36]
          text: `ชื่อยูสเซอร์ "${formData.username}" มีคนใช้ในสนามแล้วครับป๋า!`, //[cite: 36]
          allowOutsideClick: false, //[cite: 36]
          showCancelButton: true, //[cite: 36]
          confirmButtonText: 'Try Register Again', //[cite: 36]
          cancelButtonText: 'ปิด (กลับหน้าหลัก)', //[cite: 36]
          confirmButtonColor: '#d97706', //[cite: 36]
          cancelButtonColor: '#64748b', //[cite: 36]
        }).then((result) => {
          if (result.isConfirmed) {
            clearForm(); //[cite: 36]
          } else {
            navigate('/'); //[cite: 36]
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error', //[cite: 36]
          text: `ข้อมูลฟอร์มผิดพลาด: ${errorMsg || 'ฟีลด์ข้อมูลไม่ตรงเงื่อนไขสโมสร'}`, //[cite: 36]
          allowOutsideClick: false, //[cite: 36]
          showCancelButton: true, //[cite: 36]
          confirmButtonText: 'รับทราบ (ตรวจจุดผิด)', //[cite: 36]
          cancelButtonText: 'ปิด (กลับหน้าหลัก)', //[cite: 36]
          confirmButtonColor: '#dc2626', //[cite: 36]
          cancelButtonColor: '#64748b', //[cite: 36]
        }).then((result) => {
          if (!result.isConfirmed) {
            navigate('/'); //[cite: 36]
          }
        });
      }
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col justify-start sm:justify-center items-center bg-slate-50 px-4 py-2 sm:py-12"> {/*[cite: 36] */}
      <div className="max-w-md w-full space-y-4 bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-100 my-auto"> {/*[cite: 36] */}
        
        <div className="text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            public-homepage/register
          </span>
          <h2 className="mt-2 text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Register</h2> {/*[cite: 36] */}
          <p className="text-[11px] sm:text-sm text-slate-500">ลงทะเบียนนักกอล์ฟและผู้จัดการแข่งขันของสโมสร</p> {/*[cite: 36] */}
        </div>

        <form className="mt-2 space-y-3 sm:space-y-6" onSubmit={handleSubmit}> {/*[cite: 36] */}
          <div className="space-y-2.5 rounded-md shadow-sm"> {/*[cite: 36] */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-0.5">Username:</label>
              <input
                name="username" type="text" required value={formData.username} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-1.5 border border-slate-300 rounded-xl placeholder-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                placeholder="ภาษาอังกฤษสำหรับใช้ล็อกอิน" //[cite: 36]
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-0.5">Nickname:</label>
              <input
                name="nickname" type="text" required value={formData.nickname} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-1.5 border border-slate-300 rounded-xl placeholder-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                placeholder="ชื่อเล่นสำหรับแสดงบนบอร์ดคะแนนสด" //[cite: 36]
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-0.5">Age:</label>
              <input
                name="age" type="number" required value={formData.age} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-1.5 border border-slate-300 rounded-xl placeholder-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                placeholder="อายุ (ตัวเลข)" //[cite: 36]
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-0.5">Password:</label>
              <input
                name="password" type="password" required value={formData.password} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-1.5 border border-slate-300 rounded-xl placeholder-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                placeholder="รหัสผ่านความปลอดภัย" //[cite: 36]
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-0.5">ConfirmPassword:</label>
              <input
                name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-1.5 border border-slate-300 rounded-xl placeholder-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                placeholder="ยืนยันรหัสผ่านอีกครั้ง" //[cite: 36]
              />
            </div>
          </div>

          <div>
            <button
              type="submit" disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all duration-200 ${
                isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-md shadow-emerald-100'
              }`}
            >
              {isLoading ? 'กำลังแทงข้อมูลข้ามค่าย...' : '<Submit>'} {/*[cite: 36] */}
            </button>
          </div>

          {/* 💡 ทางเลือกสลับรางสำคัญ: ลิงก์ตรงพาข้ามค่ายย้ายกลับไปหน้าเข้าสู่ระบบ /login */}
          <div className="text-center mt-1 sm:mt-4">
            <p className="text-[11px] text-slate-500">
              เป็นสมาชิกสนามอยู่แล้ว?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 underline decoration-2">
                กลับไปหน้าล็อกอินที่นี่
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}