import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import EditProjectModal from './modals/EditProjectModal';

function ProjectList({projectList})
{
    const [editForm, showEditForm] = useState(false);
    const [editProject, setEditProject] = useState(null);

    //const [deleteForm, showDeleteForm] = useState(false);
    //const [deleteProject, deleteProject] = useState(false);

    const handleOpenEditModal = (project) => 
    {
        showEditForm(true);
        setEditProject(project);
    };

    const handleCloseModals = () => 
    {
        showEditForm(false);
        //showDeleteForm(false);
    };
    
    return (
        <div>
        <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ textAlign: 'center', fontWeight: 'bold', marginTop: 2 }}
        >
            Project List:
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {projectList.map((project) => (
                <Card key={project._id} sx={{ width: '75%', marginBottom: '20px' }}>
                <CardContent>
                    <Typography variant="h3" component="div">
                    {project.name}
                    </Typography>
                    <br />
                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                    Technologies: {project.technologies.join(", ")}
                    </Typography>
                    <br />
                    <Typography variant="body2">
                    {project.description}
                    <br />
                    </Typography>
                    <br />  
                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                        Favorited by: {project.favoritedBy && project.favoritedBy.length > 0 
                            ? project.favoritedBy.map(user => user.firstName + " " + user.lastName).join(", ")
                            : "No one yet"}
                    </Typography>

                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                        Comments: {project.comments && project.comments.length > 0 
                            ? project.comments.map(comment => comment.user).join(", ")
                            : "No comments yet"}
                    </Typography>

                </CardContent>
                <CardActions>
                    <Button size="large">View Details</Button>
                </CardActions>
                <CardActions>
                    <Button size="large"
                        onClick={() => {
                            handleOpenEditModal({project});
                        }}
                        >Edit Project
                    </Button>
                    <Button size="large">Delete Project</Button>
                </CardActions>
                </Card>
            ))}

            {editForm && editProject && (
                    <EditProjectModal
                        isOpen={editForm}
                        project={editProject}
                        handleClose={handleCloseModals}
                    />)}
        </div>

    


        

        
        </div>
    )
}

export default ProjectList;