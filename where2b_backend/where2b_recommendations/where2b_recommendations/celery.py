import os
from celery import Celery
 
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'where2b_recommendations.settings')
 
app = Celery('where2b_recommendations')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
