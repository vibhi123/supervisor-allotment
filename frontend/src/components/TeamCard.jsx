import { Box, Paper, Typography, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const TeamCard = ({ team }) => {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        minHeight: '350px',
        borderRadius: 6,
        boxShadow: 4,
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h7" gutterBottom>
        Faculty : {team.supervisor.fullName}
      </Typography>
      <Typography variant="h8" gutterBottom>
        Team Members
      </Typography>
      <List sx={{ mt: 2 }}>
        {team.members.map((member) => (
          <ListItem
            key={member._id}
            disablePadding
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              mb: 2,
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'primary.light',
                transform: 'scale(1.02)',
                transition: '0.3s',
              },
            }}
          >
            <ListItemButton component={Link} to={`/student/${member.registrationNumber}`}> 
              <ListItemText
                primary={member.fullName}
                secondary={`Reg No: ${member.registrationNumber}`}
                primaryTypographyProps={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'text.primary',
                }}
                secondaryTypographyProps={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TeamCard;