build:
	docker-compose build
up:
	docker-compose up -d
down:
	docker-compose down
restart:
	docker-compose down
	docker-compose up -d
shell:
	docker exec -ti where2b_core /bin/sh
migrations:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py makemigrations"
migrate:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py migrate"
showmigrations:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py showmigrations"
logs:
	docker-compose logs
superuser:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py createsuperuser"
django-shell:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py shell"
test:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py test"
recommender:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py shell < recommender.py"