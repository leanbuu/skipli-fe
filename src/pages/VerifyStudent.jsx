import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyStudent = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Link xác minh không hợp lệ");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await fetch(
                "http://localhost:3000/api/student/validate-access-code",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        username: form.username,
                        password: form.password,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Có lỗi xảy ra");
            }

            alert("Tạo tài khoản thành công, vui lòng đăng nhập");
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded-xl shadow"
            >
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Tạo tài khoản sinh viên
                </h2>

                {error && (
                    <p className="text-red-600 text-sm mb-3">
                        {error}
                    </p>
                )}

                <input
                    className="w-full px-4 py-2 mb-3 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={form.username}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            username: e.target.value,
                        })
                    }
                />

                <input
                    className="w-full px-4 py-2 mb-4 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    type="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value,
                        })
                    }
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
                >
                    {loading ? "Đang xử lý..." : "Tạo tài khoản"}
                </button>
            </form>
        </div>
    );
};

export default VerifyStudent;
