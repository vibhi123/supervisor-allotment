import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const FacultyPreferenceForm = ({ facultyName }) => {
    const [designation, setDesignation] = useState("Professor");
    const [studentsToSupervise, setStudentsToSupervise] = useState(1);
    const [preference, setPreference] = useState("Any");
    const [areasOfResearch, setAreasOfResearch] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const payload = {
                designation,
                studentsToSupervise,
                preference,
                areasOfResearch: preference === "Research" ? areasOfResearch : null,
            };
            await axios.post("http://localhost:8000/api/faculty/profile", payload, {
                headers: { Authorization: `${token}` },
            });
            toast.success("Profile submitted successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit profile");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">Welcome, {facultyName}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium">Designation</label>
                        <select
                            className="w-full p-2 border rounded-lg"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        >
                            <option value="Professor">Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Number of Students to Supervise</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full p-2 border rounded-lg"
                            value={studentsToSupervise}
                            onChange={(e) => setStudentsToSupervise(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Preference</label>
                        <select
                            className="w-full p-2 border rounded-lg"
                            value={preference}
                            onChange={(e) => setPreference(e.target.value)}
                        >
                            <option value="Internship">Internship</option>
                            <option value="Research">Research</option>
                            <option value="Any">Any</option>
                        </select>
                    </div>

                    {preference === "Research" && (
                        <div>
                            <label className="block mb-2 font-medium">Preferred Areas of Research</label>
                            <textarea
                                className="w-full p-2 border rounded-lg"
                                rows="4"
                                value={areasOfResearch}
                                onChange={(e) => setAreasOfResearch(e.target.value)}
                                placeholder="Enter preferred areas of research..."
                            ></textarea>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FacultyPreferenceForm;
