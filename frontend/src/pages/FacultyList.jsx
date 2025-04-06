import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FacultyList = () => {
    const [facultyList, setFacultyList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/faculty/showAll");
                setFacultyList(response.data);
            } catch (error) {
                console.error("Failed to fetch faculty:", error);
            }
        };
        fetchFaculty();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Faculty List</h1>
            <div className="space-y-4">
                {facultyList.map(faculty => (
                    <div key={faculty._id} className="p-4 border rounded shadow-sm bg-white flex justify-between items-start">
                        <div>
                            <p><strong>Name:</strong> {faculty.fullName}</p>
                            <p><strong>Designation:</strong> {faculty.designation}</p>
                            <p><strong>No. of Students:</strong> {faculty.numberOfStudent}</p>
                            <p><strong>Interest:</strong> {faculty.interest}</p>
                            {faculty.interest === "Research" && (
                                <p><strong>Areas of Research:</strong> {faculty.areaOfResearch.join(", ")}</p>
                            )}
                        </div>
                        <button
                            onClick={() => navigate(`/admin/edit-faculty/${faculty._id}`)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FacultyList;
