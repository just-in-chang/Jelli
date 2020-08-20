from django.db import models


class User(models.Model):
    username = models.CharField(max_length=16)
    password = models.CharField(max_length=30)

    def __str__(self):
        return self.username


class Board(models.Model):
    name = models.CharField(max_length=20)
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='boards')
    star = models.BooleanField(default=False)
    position = models.IntegerField(default=0)

    def __str__(self):
        return str(self.id)


class Category(models.Model):
    name = models.CharField(max_length=20)
    board = models.ForeignKey(
        Board,  on_delete=models.CASCADE, related_name='categories')
    position = models.IntegerField(default=0)

    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name_plural = "categories"


class Card(models.Model):
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=280)
    color = models.CharField(max_length=1)
    position = models.IntegerField(default=0)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='cards')

    def __str__(self):
        return str(self.id)
