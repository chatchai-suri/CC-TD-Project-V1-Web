// src/pages/admin/AdminHome.tsx

/**
 * 🎯 หน้าจอหลักผู้ดูแลระบบสูงสุด (Admin Homepage / Account Directory)
 */
export default function AdminHome() {
  // 🧠 Mock Data รายชื่อบัญชีผู้ใช้จำลองตามแผนระเบียบเอกสารของป๋าปู
  const mockAccounts = [
    { id: 1, username: "chatchai-src", nickname: "ป๋าปู (Director)", role: "TD", status: "Active" },
    { id: 2, username: "caddy-01", nickname: "Gian Scorer", role: "SCORER", status: "Active" },
    { id: 3, username: "golfer-nobita", nickname: "Nobita Player", role: "GOLFER", status: "Active" }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold text-red-800 flex items-center gap-2">🛡️ User Account Control Panel</h1>
        <p className="text-xs text-gray-500 mt-1">สถานีผู้ดูแลระบบสูงสุด: ตรวจสอบระดับสิทธิ์ ออกใบอนุญาต และคุมความปลอดภัยบัญชี</p>
      </div>

      <div className="overflow-x-auto border border-red-100 rounded-xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-semibold">
              <th className="p-3">Username</th>
              <th className="p-3">Nickname</th>
              <th className="p-3 text-center">Global Role</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockAccounts.map((acc: any) => (
              <tr key={acc.id} className="hover:bg-red-50/20 font-medium">
                <td className="p-3 text-slate-600 font-mono">{acc.username}</td>
                <td className="p-3 font-bold text-slate-800">{acc.nickname}</td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold border border-gray-300">
                    {acc.role}
                  </span>
                </td>
                <td className="p-3 text-center text-emerald-600 font-bold">🟢 {acc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}