from django.shortcuts import render
from rest_framework import viewsets
from .models import User, Board, Category, Card
from .serializers import UserSerializer, BoardSerializer, CategorySerializer, CardSerializer


class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def put(self, request):
        instance = User.objects.get(username=request.username, password=request.password)
        serializer = UserSerializer(instance, data=request.data, partial=True)
        print('hi')
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errorss, status=status.HTTP_400_BAD_REQUEST)


class BoardView(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer


class CategoryView(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CardView(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
