from django.urls import path
from .views import SentimentAnalysisView, home
from . import views

urlpatterns = [
    path('', home, name='home'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('analyze/', SentimentAnalysisView.as_view(), name='sentiment-analysis'),
]
