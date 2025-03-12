from __future__ import with_statement
import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Add the parent directory (server) to sys.path explicitly
server_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'server'))
sys.path.append(server_path)

# Correct import of Base from user.py
from server.models.user import Base  # Ensure that 'server' is recognized properly

# Import the engine from the correct location
from server.database import engine  # Ensure this points to the correct SQLAlchemy engine

# Alembic Config object, which provides access to the .ini file in use
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

# Determine whether to run migrations offline or online based on the config
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
