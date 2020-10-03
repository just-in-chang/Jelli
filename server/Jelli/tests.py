import json

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Board, Card, Category, User
from .serializers import (BoardSerializer, CardSerializer, CategorySerializer,
                          UserSerializer)


class Tests(APITestCase):
    def testUsers(self):
        data = {
            "username": "root",
            "password": "toor",
            "boards": []
        }
        response = self.client.post("/users/", data, format="json")
        userId = str(json.loads(response.content.decode("utf-8"))["id"])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response2 = self.client.get("/users/"+userId+"/")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

        data["username"] = "put"
        response3 = self.client.get(
            "/users/"+userId+"/", data, format="json")
        self.assertEqual(response3.status_code, status.HTTP_200_OK)

        response4 = self.client.delete("/users/"+userId+"/")
        self.assertEqual(response4.status_code, status.HTTP_204_NO_CONTENT)

    def testBoards(self):
        userData = {
            "username": "root",
            "password": "toor",
            "boards": []
        }

        data = {
            "name": "board",
            "owner": -1,
            "position": 0,
            "star": False,
            "categories": []
        }

        userResponse = self.client.post("/users/", userData, format="json")
        data["owner"] = json.loads(userResponse.content.decode("utf-8"))["id"]

        response = self.client.post("/boards/", data, format="json")
        boardId = json.loads(response.content.decode("utf-8"))["id"]
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response2 = self.client.get("/boards/"+str(boardId)+"/")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

        data["name"] = "put"
        response3 = self.client.get(
            "/boards/"+str(boardId)+"/", data, format="json")
        self.assertEqual(response3.status_code, status.HTTP_200_OK)

        response4 = self.client.delete("/boards/"+str(boardId)+"/")
        self.assertEqual(response4.status_code, status.HTTP_204_NO_CONTENT)
