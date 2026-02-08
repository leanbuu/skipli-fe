import { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox"; 

const API_BASE = "http://localhost:3000/api/instructor";

export default function InstructorDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentLessons, setStudentLessons] = useState([]);
    const [chatStudent, setChatStudent] = useState(null);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const [lesson, setLesson] = useState({
        title: "",
        description: "",
        studentPhone: "",
    });

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/students`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setStudents(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addStudent = async () => {
        try {
            const res = await fetch(`${API_BASE}/add-student`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setForm({ name: "", phone: "", email: "" });
            fetchStudents();
        } catch (err) {
            alert(err.message);
        }
    };

    const deleteStudent = async (phone) => {
        if (!window.confirm("Xóa sinh viên này?")) return;
        try {
            const res = await fetch(`${API_BASE}/student/${phone}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            fetchStudents();
        } catch (err) {
            alert(err.message);
        }
    };

    const assignLesson = async () => {
        try {
            const res = await fetch(`${API_BASE}/assign-lesson`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lesson),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            alert("Giao bài học thành công");
            setLesson({ title: "", description: "", studentPhone: "" });
        } catch (err) {
            alert(err.message);
        }
    };

    const viewLessons = async (phone) => {
        try {
            const res = await fetch(`${API_BASE}/student/${phone}`);
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            const student = result.data;
            setSelectedStudent(student);
            setStudentLessons(student.lessons || []);
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-3xl font-bold mb-2">
                Dashboard Giảng viên
            </h1>
            <p className="text-gray-600 mb-6">
                SĐT: {user?.phone}
            </p>

            <div className="bg-white p-6 rounded-xl shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Thêm sinh viên
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Tên"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    <input
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="SĐT"
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                    />

                    <input
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                </div>

                <button
                    onClick={addStudent}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Thêm sinh viên
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Danh sách sinh viên
                </h2>

                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <table className="w-full border border-slate-200 text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-2 border">Tên</th>
                                <th className="p-2 border">SĐT</th>
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s.phone}>
                                    <td className="p-2 border">{s.name}</td>
                                    <td className="p-2 border">{s.phone}</td>
                                    <td className="p-2 border">{s.email}</td>
                                    <td className="p-2 border space-x-3">
                                        <button
                                            onClick={() => deleteStudent(s.phone)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Xóa
                                        </button>

                                        <button
                                            onClick={() => viewLessons(s.phone)}
                                            className="text-indigo-600 hover:underline"
                                        >
                                            Xem bài
                                        </button>

                                        <button
                                            onClick={() => {
                                                setChatStudent(s);
                                                setSelectedStudent(null); 
                                            }}
                                            className="text-green-600 hover:underline"
                                        >
                                            Chat
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedStudent && (
                <div className="bg-white p-6 rounded-xl shadow mb-8">
                    <h2 className="text-lg font-semibold mb-4">
                        Bài học của {selectedStudent.name}
                    </h2>

                    {studentLessons.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            Sinh viên chưa được giao bài học
                        </p>
                    ) : (
                        <table className="w-full text-sm border border-slate-200">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-2 border">Tiêu đề</th>
                                    <th className="p-2 border">Mô tả</th>
                                    <th className="p-2 border">Trạng thái</th>
                                    <th className="p-2 border">Ngày tạo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentLessons.map((l) => (
                                    <tr key={l.id}>
                                        <td className="p-2 border font-medium">
                                            {l.title}
                                        </td>
                                        <td className="p-2 border">
                                            {l.description}
                                        </td>
                                        <td className="p-2 border">
                                            {l.status}
                                        </td>
                                        <td className="p-2 border text-gray-500">
                                            {new Date(
                                                l.createdAt._seconds * 1000
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {chatStudent && (
                <div className="bg-white p-6 rounded-xl shadow mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Chat với {chatStudent.name}
                        </h2>

                        <button
                            onClick={() => setChatStudent(null)}
                            className="text-sm text-red-500 hover:underline"
                        >
                            Đóng
                        </button>
                    </div>

                    <ChatBox
                        user={{
                            phone: user.phone,
                            role: "instructor",
                        }}
                        target={{
                            phone: chatStudent.phone,
                            role: "student",
                        }}
                    />
                </div>
            )}
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">
                    Giao bài học
                </h2>

                <input
                    className="w-full px-4 py-2 mb-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Tiêu đề"
                    value={lesson.title}
                    onChange={(e) =>
                        setLesson({ ...lesson, title: e.target.value })
                    }
                />

                <textarea
                    className="w-full px-4 py-2 mb-3 min-h-[100px] border border-slate-300 rounded-lg text-sm outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Mô tả"
                    value={lesson.description}
                    onChange={(e) =>
                        setLesson({
                            ...lesson,
                            description: e.target.value,
                        })
                    }
                />

                <input
                    className="w-full px-4 py-2 mb-4 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="SĐT sinh viên"
                    value={lesson.studentPhone}
                    onChange={(e) =>
                        setLesson({
                            ...lesson,
                            studentPhone: e.target.value,
                        })
                    }
                />

                <button
                    onClick={assignLesson}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Giao bài
                </button>
            </div>
        </div>
    );
}
