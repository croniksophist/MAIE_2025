from src.models.models import Project
from sqlalchemy.orm import Session

class ProjectsService:
    def __init__(self, session: Session):
        """Initialize with a database session."""
        self.session = session

    def create_project(self, name: str, description: str):
        """Create a new project and save it to the database."""
        new_project = Project(name=name, description=description) 
        self.session.add(new_project)
        self.session.commit()  # Commit the transaction to save the project
        self.session.refresh(new_project)  # Refresh to get the latest data (e.g., id)
        
        return {
            "id": new_project.id,
            "name": new_project.name,
            "description": new_project.description
        }

    def get_projects(self):
        """Retrieve all projects from the database."""
        projects = self.session.query(Project).all()
        return [{"id": project.id, "name": project.name, "description": project.description} for project in projects]
