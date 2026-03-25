import logging

from sqlalchemy.orm import Session

from app.db.base import Base, engine
from app.models import *  # noqa: F401,F403 - import all models so they register with Base

logger = logging.getLogger(__name__)


def init_db() -> None:
    """Create all tables in the database."""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully.")


def drop_db() -> None:
    """Drop all tables - USE WITH CAUTION."""
    logger.warning("Dropping all database tables!")
    Base.metadata.drop_all(bind=engine)
    logger.info("All tables dropped.")
