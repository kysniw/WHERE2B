# WHERE2B BACKEND

## Uruchomienie backendu w dockerze

### Zbudowanie projektu

Przejść do folderu z ```Dockerfile``` i ```docker-compose.yml``` i uruchomić

```shell
docker-compose build
```

### Uruchomienie i wyłączenie

```
docker-compose up -d  //uruchomienie
docker-compose down  //wyłączenie
```

Za pierwszym razem trzeba będzie uruchomić migracje z Django do bazy postgres:

```shell
docker exec -ti where2b_core /bin/sh -c "python3 manage.py migrate"
```

### Terminal w kontenerze


``` shell
docker exec -ti where2b_core /bin/sh
```

Wyjście:
Ctrl + d

### Utworzenie superużytkownika w Django

```shell
docker exec -ti where2b_core /bin/sh -c "python3 manage.py createsuperuser"
```

### Strona startowa i panel admina

0.0.0.0:8000 \
0.0.0.0:8000/admin

### Wczytanie kategorii

```shell
docker exec -ti where2b_core /bin/sh -c "python3 manage.py loaddata restaurants/fixtures/restaurant_categories.json"
```