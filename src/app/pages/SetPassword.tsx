import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:5000/api/auth/set-password/${token}`,
        { password }
      );

      alert("Password set successfully!");

      navigate("/login");

    } catch (err: any) {
      alert(err.response?.data?.message || "Error Setting Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4">Set Your Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-3 border rounded-xl mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-xl"
        >
          {loading ? "Setting..." : "Set Password"}
        </button>
      </form>
    </div>
  );
}