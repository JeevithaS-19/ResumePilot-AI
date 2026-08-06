from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base
from app import models


# =========================================================
# USER MODEL
# =========================================================

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password = Column(
        String,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    # One user can have many resume analyses
    analyses = relationship(
        "Analysis",
        back_populates="user",
        cascade="all, delete-orphan",
    )


# =========================================================
# RESUME ANALYSIS MODEL
# =========================================================

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # Connect analysis to user
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # Resume filename
    filename = Column(
        String,
        nullable=False,
    )

    # Scores
    ats_score = Column(
        Integer,
        default=0,
    )

    completeness_score = Column(
        Integer,
        default=0,
    )

    # JSON-like information will temporarily
    # be stored as text in SQLite.
    skills = Column(
        Text,
        nullable=True,
    )

    suggestions = Column(
        Text,
        nullable=True,
    )

    # Date analysis was performed
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    # Relationship back to user
    user = relationship(
        "User",
        back_populates="analyses",
    )