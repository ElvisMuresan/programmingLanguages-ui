import { useNavigate } from "react-router-dom";

export const HomePage = () => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
      };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl">Welcome to the Home Page</h1>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}
