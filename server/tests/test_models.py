"""Unit tests for data models."""

import pytest
from models import SampleModel

def test_sample_model():
    model = SampleModel(name="Test")
    assert model.name == "Test"