import os
import tempfile

TEST_DB_PATH = os.path.join(tempfile.gettempdir(), "dfcont_test.db")
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH}"
os.environ["DEBUG"] = "False"

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session", autouse=True)
def _cleanup_test_db():
    yield
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)


@pytest.fixture(autouse=True)
def _reset_rate_limit():
    from app.core.ratelimit import _hits

    _hits.clear()
    yield


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client
