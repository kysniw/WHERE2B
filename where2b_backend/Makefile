build:
	docker-compose build
up:
	docker-compose up -d
down:
	docker-compose down
where2b-shell:
	docker exec -ti where2b_core /bin/sh
migrations:
	docker exec -ti where2b_core /bin/sh -c "python3 where2b_core/manage.py makemigrations"
migrate:
	docker exec -ti where2b_core /bin/sh -c "python3 where2b_core/manage.py migrate"
logs:
	docker-compose logs
admin:
	docker exec -ti where2b_core /bin/sh -c "python3 where2b_core/manage.py createsuperuser"
django-shell:
	docker exec -ti where2b_core /bin/sh -c "python3 where2b_core/manage.py shell"