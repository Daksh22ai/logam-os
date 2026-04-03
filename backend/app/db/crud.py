from sqlalchemy.orm import Session
from . import models

# Company
def get_company(db: Session, company_id: str):
    return db.query(models.Company).filter(models.Company.id == company_id).first()

def get_or_create_company(db: Session, company_id: str, name: str = "Demo Company"):
    company = get_company(db, company_id)
    if not company:
        company = models.Company(id=company_id, name=name)
        db.add(company)
        db.commit()
        db.refresh(company)
    return company

# Sessions
def get_sessions(db: Session, company_id: str):
    return db.query(models.ChatSession).filter(models.ChatSession.company_id == company_id).order_by(models.ChatSession.created_at.desc()).all()

def create_session(db: Session, company_id: str, title: str = "New Chat"):
    company = get_or_create_company(db, company_id)
    db_session = models.ChatSession(company_id=company.id, title=title)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def delete_session(db: Session, session_id: str):
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if session:
        db.delete(session)
        db.commit()
    return session

def update_session_title(db: Session, session_id: str, new_title: str):
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if session:
        session.title = new_title
        db.commit()
        db.refresh(session)
    return session

# Messages
def get_messages(db: Session, session_id: str):
    return db.query(models.Message).filter(models.Message.session_id == session_id).order_by(models.Message.timestamp.asc()).all()

def create_message(db: Session, session_id: str, role: str, content: str):
    msg = models.Message(session_id=session_id, role=role, content=content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
