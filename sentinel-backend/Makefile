.PHONY: help install run worker migrate seed test docker-up docker-down clean

help:
	@echo "Sentinel AI CCTV Platform Makefile"
	@echo "  install     Install python dependencies"
	@echo "  run         Run FastAPI development server"
	@echo "  worker      Run Celery worker"
	@echo "  migrate     Run database migrations"
	@echo "  seed        Seed admin and demo dataset"
	@echo "  test        Run pytest test suite"
	@echo "  docker-up   Start Docker containers"
	@echo "  docker-down Stop Docker containers"
	@echo "  clean       Clean temporary cache files"

install:
	pip install -r requirements.txt

run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

worker:
	celery -A app.workers.celery_app worker --loglevel=info

migrate:
	alembic upgrade head

seed:
	python scripts/seed_admin.py
	python scripts/seed_demo_data.py

test:
	pytest

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down -v

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
