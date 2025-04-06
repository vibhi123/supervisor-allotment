import React from "react";
import { useNavigate } from "react-router-dom";
import AddStudent from "./AddStudent";
import ViewAllStudents from "../components/ViewAllStudents";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Admin Dashboard
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/admin/add-faculty")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              ADD FACULTY
            </button>
            <button
              onClick={() => navigate("/admin/view-all-faculty")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              VIEW AND EDIT FACULTY DETAILS
            </button>
            <button
              onClick={() => navigate("/admin/view-students")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
            >
              VIEW ALL STUDENTS
            </button>
            <button
              onClick={() => navigate("/ranklist")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
            >
              VIEW RANKLIST
            </button>
            <button
              onClick={() => navigate("/admin/allot")}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            >
              START ALLOTMENT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
