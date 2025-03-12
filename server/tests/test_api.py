"""API endpoint tests."""

import requests

def test_sample_api():
    response = requests.get("http://localhost/api/sample")
    assert response.status_code == 200