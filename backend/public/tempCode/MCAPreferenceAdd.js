router.route("/srv").get(async () => {
    try {
    
        for (const preference of MCAPreferences) {
            const team = await Team.findOne({ teamNumber: preference.teamNumber });
        
            if (!team) {
                console.warn(`Team not found for teamNumber: ${preference.teamNumber}`);
                continue;
            }
        
            // Map the array of {$oid: "..."} to just the ObjectId value
            const newFacultyPreferences = preference.facultyPreferences.map(pref => pref.$oid);
        
            // Update the team's facultyPreferences
            team.facultyPreferences = newFacultyPreferences;
            await team.save();
        
            console.log(`Updated preferences for team: ${team.teamNumber}`);
        }
        
    } catch (error) {
        console.error('Error inserting faculty data:', error);
    }
    })