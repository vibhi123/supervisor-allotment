// FacultyPreferenceSelector.js
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

const FacultyPreferenceSelector = ({ faculties, onSubmit }) => {
  // console.log(faculties);

  const [facultyList, setFacultyList] = useState(faculties.data);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedList = Array.from(facultyList);
    const [movedItem] = updatedList.splice(result.source.index, 1);
    updatedList.splice(result.destination.index, 0, movedItem);

    setFacultyList(updatedList);
  };

  const handleSubmit = () => {
    const preferenceIds = facultyList.map((f) => f._id);
    onSubmit(preferenceIds);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Reorder Faculty Preferences
      </Typography>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="facultyList">
          {(provided) => (
            <Stack
              spacing={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {facultyList.map((faculty, index) => (
                <Draggable
                  key={faculty._id}
                  draggableId={faculty._id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      variant="outlined"
                    >
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Preference {index + 1}
                        </Typography>
                        <Typography variant="subtitle1">
                          {faculty.fullName}
                        </Typography>
                        <Typography variant="body2">
                          {faculty.designation}
                        </Typography>
                        <Typography variant="body2">
                          Interest: {faculty.interest}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Preferences
      </Button>
    </div>
  );
};

export default FacultyPreferenceSelector;
