from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('VR-tour/', views.VR_tour, name='VR_tour'),
    path('event/', views.event, name='event'),
    path('directions/', views.directions_view, name='directions'),
    path('contacts/', views.contacts, name='contacts'),
    path('api/contacts/social/', views.contacts_social_partial, name='contacts_social_partial'),
]
