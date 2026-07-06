import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models import User, LearningDNA, RevisionTask, UserActivity
from app.core.security import get_password_hash

db = SessionLocal()

# Check if admin exists
admin = db.query(User).filter(User.username == "admin").first()

if admin:
    print("Admin user already exists!")
    print(f"Username: admin")
else:
    # Create admin user
    admin_user = User(
        email="admin@alchemist.com",
        username="admin",
        hashed_password=get_password_hash("admin123"),
        full_name="Admin User",
        is_admin=True,
        is_active=True
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    # Create default Learning DNA
    learning_dna = LearningDNA(
        user_id=admin_user.id,
        math_level=0,
        python_level=0,
        sql_level=0,
        data_analysis_level=0,
        web_dev_level=0,
        ml_level=0
    )
    db.add(learning_dna)
    
    # Create initial tasks
    task = RevisionTask(
        user_id=admin_user.id,
        task="Review admin panel",
        due_date="Today",
        priority="High",
        progress=0
    )
    db.add(task)
    
    # Log activity
    activity = UserActivity(
        user_id=admin_user.id,
        activity_type="registration",
        description="Admin user created"
    )
    db.add(activity)
    
    db.commit()
    
    print("Admin user created successfully!")
    print(f"Username: admin")
    print(f"Password: admin123")
    print(f"Email: admin@alchemist.com")

db.close()
