import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FacultyForm from "./FacultyForm";

const EditFaculty = () => {
    const { id } = useParams();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/faculty/${id}`);
                setInitialData(response.data);
            } catch (error) {
                console.error("Error fetching faculty details:", error);
            }
        };
        fetchFaculty();
    }, [id]);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-xl font-semibold mb-4">Edit Faculty</h1>
            {initialData ? (
                <FacultyForm initialData={initialData} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditFaculty;
