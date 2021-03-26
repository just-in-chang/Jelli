from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('users', views.UserView, 'users')
router.register('boards', views.BoardView, 'boards')
router.register('categories', views.CategoryView, 'categories')
router.register('cards', views.CardView, 'cards')


urlpatterns = [
    path('', include(router.urls))
]
