
import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.main import app
from app.db.base import Base
from app.db.session import get_db

# Use an in-memory SQLite database for testing, or a separate test DB
# For simplicity and speed, in-memory SQLite is often good, 
# but since the app uses PostgreSQL specific features (Enum), 
# we might need to be careful or use a test postgres DB.
# However, for this task, we can try to use standard SQL classes if possible, 
# or just mock the DB session interactions if we want to avoid DB setup.
# But integration tests are better.

# Let's try to use a local sqlite db for testing if possible, 
# but models use Postgres specific types (e.g. ARRAY or specific ENUMs might behave differently).
# Given the environment, let's try to use the same logic as production but maybe with a test flag.

# Actually, the simplest way to test "logic" without spinning up a real Postgres 
# is to mock the verification functions and check the API response.
# For DB integration, we can use a temporary SQLite db, 
# but we need to ensure models are compatible. 
# The models use `sqlalchemy.Enum`, which is generic. 
# `psycopg` is the driver.

# Let's use a standard TestClient with a dependency override for the DB 
# if we want to isolate, OR just use the existing dev DB if the user allows, 
# but that's risky (data pollution).

# BEST APPROACH: Use SQLite for tests.
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def db_engine():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield engine
    # Drop tables
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db(db_engine) -> Generator[Session, None, None]:
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
def override_get_db(db: Session):
    def _get_db():
        yield db
    app.dependency_overrides[get_db] = _get_db
    yield
    app.dependency_overrides.pop(get_db)
