import React from "react";
import AddStudent from "./AddStudent";
import ViewAllStudents from "../components/ViewAllStudents";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Admin Dashboard</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">All Students</h3>
          <ViewAllStudents />
        </div>

        <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6 self-start">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Add New Student</h3>
          <AddStudent />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
