import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InstructorLogin() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!phone) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        "http://localhost:3000/api/auth/createAccessCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phone,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gửi OTP thất bại");
      }
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Vui lòng nhập OTP");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        "http://localhost:3000/api/auth/validateAccessCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phone,
            otp,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "OTP không đúng");
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.type === "Instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      {step === 1 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Số điện thoại
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="VD: 098xxxxxxx"
            />
          </div>
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Gửi OTP"}
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mã OTP
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập OTP"
            />
          </div>
          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Đang xác nhận..." : "Xác nhận"}
          </button>
        </>
      )}
    </div>
  );
}
