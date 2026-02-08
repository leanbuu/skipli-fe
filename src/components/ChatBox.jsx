import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function ChatBox({ user, target }) {
    const socketRef = useRef(null);
    const roomId = 'key-co-dinh-de-test'

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        socketRef.current = io("http://localhost:3000");

        socketRef.current.emit("join_room", { roomId });

        socketRef.current.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => socketRef.current.disconnect();
    }, [roomId]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/chat/history?roomId=${roomId}`)
            .then(res => res.json())
            .then(data => setMessages(data.data || []));
    }, [roomId]);

    const sendMessage = () => {
        if (!text.trim()) return;

        const msg = {
            roomId,
            senderRole: user.role,
            senderPhone: user.phone,
            message: text,
            createdAt: new Date(),
        };

        socketRef.current.emit("send_message", msg);
        setText("");
    };

    return (
        <div className="border rounded-lg p-4 h-[400px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-2">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded max-w-[70%] ${
                            m.senderPhone === user.phone
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-gray-200"
                        }`}
                    >
                        {m.message}
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-3">
                <input
                    className="flex-1 border rounded px-3 py-2"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-4 rounded"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}
