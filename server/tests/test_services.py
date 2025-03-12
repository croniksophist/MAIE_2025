"""Unit tests for business logic."""

import pytest
from services import BusinessLogic

def test_business_logic():
    result = BusinessLogic.process("input")
    assert result == "expected_output"