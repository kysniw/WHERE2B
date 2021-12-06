FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /usr/src/app
COPY where2b_core/requirements.txt ./
RUN pip install -r requirements.txt
CMD ["/bin/sh", "-c", "echo 'IT'S ECHOED"]
