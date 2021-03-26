from django.contrib import admin
from .models import User, Card, Board, Category

admin.site.register(User)
admin.site.register(Card)
admin.site.register(Board)
admin.site.register(Category)