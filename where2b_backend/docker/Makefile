build:
	docker-compose build
up:
	docker-compose up -d
down:
	docker-compose down
restart:
	docker-compose down
	docker-compose up -d
logs:
	docker-compose logs
w2b-core-shell:
	docker exec -ti where2b_core /bin/sh
w2b-recommendations-shell:
	docker exec -ti where2b_recommendations /bin/sh
w2b-core-migrations:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py makemigrations"
w2b-recommenations-migrations:
	docker exec -ti where2b_recommendations /bin/sh -c "python3 manage.py makemigrations"
w2b-core-migrate:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py migrate"
w2b-recommendations-migrate:
	docker exec -ti where2b_recommendations /bin/sh -c "python3 manage.py migrate"
w2b-core-showmigrations:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py showmigrations"
w2b-recommendations-showmigrations:
	docker exec -ti where2b_recommendations /bin/sh -c "python3 manage.py showmigrations"
w2b-core-superuser:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py createsuperuser"
w2b-recommendations-superuser:
	docker exec -ti where2b_recommendations /bin/sh -c "python3 manage.py createsuperuser"
w2b-core-django-shell:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py shell"
w2b-recommendations-django-shell:
	docker exec -ti where2b_recommendations /bin/sh -c "python3 manage.py shell"
w2b-core-test:
	docker exec -ti where2b_core /bin/sh -c "python3 manage.py test"
w2b-recommendations-test:
	docker exec -ti where2b_recommendations /bin/sh -c "python3 manage.py test"
recommender:
	docker exec -ti where2b_recommendations /bin/sh -c "python3 manage.py shell < recommender.py"