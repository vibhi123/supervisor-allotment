import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

const DefaultLimitDialog = ({ open, onClose, limits, setLimits, onSave }) => {
  const handleLimitChange = (designation, value) => {
    setLimits((prev) => ({ ...prev, [designation]: parseInt(value, 10) || 0 }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Set Default Student Limits</DialogTitle>
      <DialogContent>
        {Object.entries(limits).map(([designation, value]) => (
          <TextField
            key={designation}
            label={designation}
            type="number"
            value={value}
            onChange={(e) => handleLimitChange(designation, e.target.value)}
            fullWidth
            margin="normal"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DefaultLimitDialog;