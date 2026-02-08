import { useEffect, useState } from "react";
import ChatBox from "../components/ChatBox";

const API_BASE = "http://localhost:3000/api/student";

export default function StudentDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const instructorPhone = "0889506570";

    const fetchLessons = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${API_BASE}/my-lessons?phone=${profile.phone}`
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setLessons(data.lessons || []);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        try {
            const res = await fetch(`${API_BASE}/edit-profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setMessage("Cập nhật hồ sơ thành công");
        } catch (err) {
            alert(err.message);
        }
    };

    const markLessonDone = async (lessonId) => {
        try {
            const res = await fetch(`${API_BASE}/mark-lesson-done`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: profile.phone,
                    lessonId,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            fetchLessons();
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        if (profile.phone) {
            fetchLessons();
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-3xl font-bold mb-6">
                Dashboard Sinh viên
            </h1>

            <div className="bg-white p-6 rounded-xl shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    Thông tin cá nhân
                </h2>

                {message && (
                    <p className="text-green-600 text-sm mb-3">
                        {message}
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="w-full px-4 py-2 border rounded-lg text-sm"
                        placeholder="Họ tên"
                        value={profile.name}
                        onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                        }
                    />

                    <input
                        className="w-full px-4 py-2 border rounded-lg text-sm"
                        placeholder="Email"
                        value={profile.email}
                        onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                        }
                    />
                </div>

                <button
                    onClick={updateProfile}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Cập nhật hồ sơ
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">
                    Bài học của tôi
                </h2>

                {loading ? (
                    <p>Đang tải...</p>
                ) : lessons.length === 0 ? (
                    <p className="text-gray-500">
                        Chưa có bài học nào
                    </p>
                ) : (
                    <table className="w-full border text-sm">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-2 border">Tiêu đề</th>
                                <th className="p-2 border">Mô tả</th>
                                <th className="p-2 border">Trạng thái</th>
                                <th className="p-2 border">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.map((l) => (
                                <tr key={l.id}>
                                    <td className="p-2 border">{l.title}</td>
                                    <td className="p-2 border">{l.description}</td>
                                    <td className="p-2 border">{l.status}</td>
                                    <td className="p-2 border">
                                        {l.status === "done" ? (
                                            <span className="text-green-600">
                                                Đã hoàn thành
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => markLessonDone(l.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Đánh dấu hoàn thành
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow mb-8">
                <ChatBox
                    user={{
                        phone: profile.phone,
                        role: "student",
                    }}
                    target={{
                        phone: instructorPhone,
                        role: "instructor",
                    }}
                />
            </div>
        </div>
    );
}