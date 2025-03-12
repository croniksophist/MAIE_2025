"""Standardized logging setup for all services."""

import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("MAIE")
logger.info("Logging is set up.")