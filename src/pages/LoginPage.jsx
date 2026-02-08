
import InstructorLogin from "./InstructorLogin";
import StudentLogin from "./StudentLogin";
import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState("instructor");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Quản lý lớp học
          </h1>
          <p className="text-lg opacity-90">
            Nền tảng quản lý trực tuyến dành cho giảng viên và sinh viên
          </p>
        </div>
        <div className="p-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Đăng nhập
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Chọn vai trò để tiếp tục
          </p>
          <div className="flex mb-8 border-b">
            <button
              onClick={() => setRole("instructor")}
              className={`flex-1 pb-3 text-sm font-medium transition ${
                role === "instructor"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Giảng viên
            </button>

            <button
              onClick={() => setRole("student")}
              className={`flex-1 pb-3 text-sm font-medium transition ${
                role === "student"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Sinh viên
            </button>
          </div>
          <div>
            {role === "instructor" ? <InstructorLogin /> : <StudentLogin />}
          </div>
        </div>
      </div>
    </div>
  );
}
