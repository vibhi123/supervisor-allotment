import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const FacultyForm = ({ initialData = {} }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
        designation: "Professor",
        filledPreferences: false,
        numberOfStudent: 1,
        interest: "Any",
        areaOfResearch: [],
    });

    useEffect(() => {
        if (initialData && initialData._id) {
            setFormData({
                email: initialData.email || "",
                password: "",
                fullName: initialData.fullName || "",
                designation: initialData.designation || "Professor",
                filledPreferences: initialData.filledPreferences || false,
                numberOfStudent: initialData.numberOfStudent || 1,
                interest: initialData.interest || "Any",
                areaOfResearch: initialData.areaOfResearch?.length ? initialData.areaOfResearch : [],
            });
        }
    }, [initialData?._id]);
    

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleAreaOfResearchChange = (index, value) => {
        const newAreas = [...formData.areaOfResearch];
        newAreas[index] = value;
        setFormData(prev => ({ ...prev, areaOfResearch: newAreas }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/api/faculty/update`, formData);
            toast.success("Faculty details updated!");
        } catch (error) {
            console.error("Failed to update faculty:", error);
            toast.error("Something went wrong.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-4">
            <h2 className="text-xl font-semibold">Faculty Form</h2>


            <label className="block">
            Full Name:  
            <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
            </label>

            <label className="block">
                Designation:
                <select name="designation" value={formData.designation} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="Professor">Professor</option>
                    <option value="Assosiate Professor">Assosiate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                </select>
            </label>

            <label className="block">
                Email:
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
                />
                </label>

            <label className="block">
                Password:
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />
            </label>

            <input
                type="number"
                name="numberOfStudent"
                placeholder="Number of Students"
                value={formData.numberOfStudent}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min={1}
            />

            <label className="block">
                Interest:
                <select name="interest" value={formData.interest} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="Research">Research</option>
                    <option value="Internship">Internship</option>
                    <option value="Any">Any</option>
                </select>
            </label>

            {formData.interest === "Research" && (
                <div className="space-y-2">
                    <label className="block">Area of Research:</label>
                    {formData.areaOfResearch.map((area, index) => (
                        <input
                            key={index}
                            type="text"
                            value={area}
                            onChange={(e) => handleAreaChange(index, e.target.value)}
                            placeholder={`Research Area ${index + 1}`}
                            className="w-full p-2 border rounded"
                        />
                    ))}
                    <button type="button" onClick={addAreaField} className="text-blue-500 underline">
                        + Add another
                    </button>
                </div>
            )}

            <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Submit
            </button>
        </form>
    );
};

export default FacultyForm;
