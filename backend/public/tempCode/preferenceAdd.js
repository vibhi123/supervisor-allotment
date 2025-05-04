const OldStudentPreferences = [ /* your old preferences array here */ ];
const idMapping = { /* oldFacultyId: newFacultyId mapping here */ };

router.route("/srv").get(async () => {
    try {
        const idMapping = {};
    
        for (const oldF of oldFaculty) {
            const match = newFaculty.find(newF => newF.fullName === oldF.fullName);
            if (match) {
            idMapping[oldF._id.$oid] = match._id.$oid;
            }
        }
        
        // console.log(idMapping);
    
        for (const oldStudent of OldStudentPreferences) {
            const student = await Student.findOne({ registrationNumber: oldStudent.registrationNumber });
    
            if (!student) {
                console.warn(`Student not found for registrationNumber: ${oldStudent.registrationNumber}`);
                continue;
            }
    
            // Map old faculty preference IDs to new IDs
            const newFacultyPreferences = oldStudent.facultyPreferences.map(pref => {
                const oldId = pref.$oid;
                const newId = idMapping[oldId];
                if (!newId) {
                    console.warn(`No mapping found for old faculty ID: ${oldId}`);
                }
                return newId;
            }).filter(id => id !== undefined); // Remove any undefined if mapping was missing
    
            // Update the student's facultyPreferences
            student.facultyPreferences = newFacultyPreferences;
            await student.save();
    
            console.log(`Updated preferences for student: ${student.registrationNumber}`);
        }
    
        res.send("Student preferences updated successfully!");
    } catch (error) {
        console.error('Error inserting faculty data:', error);
    }
    })