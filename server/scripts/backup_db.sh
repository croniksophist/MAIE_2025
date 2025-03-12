#!/bin/bash
# Automated database backup script

echo "Starting database backup..."
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
DB_BACKUP="backup_$DATE.sql"

# Modify for your database system (PostgreSQL example)
PGUSER="your_user"
PGDATABASE="your_database"

pg_dump -U $PGUSER -h localhost $PGDATABASE > $DB_BACKUP

echo "Backup completed: $DB_BACKUP"
