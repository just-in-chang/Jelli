import json

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Board, Card, Category, User


class TestUsers(APITestCase):
    def testUsersPost(self):
        data = {
            "username": "test",
            "password": "test",
            "boards": []
        }
        response = self.client.post("/users/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def testUsersGet(self):
        response = self.client.get("/users/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def testUsersPut(self):
        self.user = User.objects.create(username="test", password="test")

        data = {
            "username": "put",
            "password": "test",
            "boards": []
        }

        url = "/users/"+str(self.user.id)+"/"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def testUsersDelete(self):
        self.user = User.objects.create(username="test", password="test")

        url = "/users/"+str(self.user.id)+"/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TestBoards(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="test", password="test")

    def testBoardsPost(self):
        userId = self.user.id

        data = {
            "name": "board",
            "owner": userId,
            "position": 0,
            "star": False,
            "categories": []
        }

        response = self.client.post("/boards/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def testBoardsGet(self):
        response = self.client.get("/boards/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def testBoardsPut(self):
        self.board = Board.objects.create(
            name="test", owner=self.user, position=0, star=False)

        data = {
            "name": "put",
            "owner": self.user.id,
            "position": self.board.position,
            "star": self.board.star,
            "categories": []
        }

        url = "/boards/"+str(self.board.id)+"/"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def testBoardsDelete(self):
        self.board = Board.objects.create(
            name="test", owner=self.user, position=0, star=False)

        url = "/boards/"+str(self.board.id)+"/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TestCategories(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="test", password="test")
        self.board = Board.objects.create(
            name="test", owner=self.user, position=0, star=False)

    def testCategoryPost(self):
        boardId = self.board.id

        data = {
            "name": "test",
            "board": boardId,
            "position": 0,
            "cards": []
        }

        response = self.client.post("/categories/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def testCategoryGet(self):
        response = self.client.get("/categories/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def testCategoryPut(self):
        self.category = Category.objects.create(
            name="test", board=self.board, position=0)

        data = {
            "name": "put",
            "board": self.board.id,
            "position": 0,
            "cards": []
        }

        url = "/categories/"+str(self.category.id)+"/"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def testCategoryDelete(self):
        self.category = Category.objects.create(
            name="test", board=self.board, position=0)

        url = "/categories/"+str(self.category.id)+"/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TestCards(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="test", password="test")
        self.board = Board.objects.create(
            name="test", owner=self.user, position=0, star=False)
        self.category = Category.objects.create(
            name="test", board=self.board, position=0)

    def testCardPost(self):
        categoryId = self.category.id

        data = {
            "title": "test",
            "description": "test",
            "color": "r",
            "category": categoryId,
            "position": 0
        }

        response = self.client.post("/cards/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def testCardGet(self):
        response = self.client.get("/cards/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def testCardPut(self):
        self.card = Card.objects.create(
            title="test", description="test", color="r", category=self.category, position=0)

        data = {
            "title": "put",
            "description": "test",
            "color": "r",
            "category": self.category.id,
            "position": 0
        }

        url = "/cards/"+str(self.card.id)+"/"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def testCardDelete(self):
        self.card = Card.objects.create(
            title="test", description="test", color="r", category=self.category, position=0)

        url = "/cards/"+str(self.card.id)+"/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
