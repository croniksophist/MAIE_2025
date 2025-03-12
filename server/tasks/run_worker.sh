#!/bin/bash
celery -A tasks.celery_app worker --loglevel=info
