from rest_framework import serializers
from .models import User, Board, Category, Card


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('id', 'title', 'description',
                  'color', 'category', 'position')

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.color = validated_data.get('color', instance.color)
        instance.category = validated_data.get('category', instance.category)
        instance.position = validated_data.get('position', instance.position)
        instance.save()
        return instance

class CategorySerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True)

    class Meta:
        model = Category
        fields = ('id', 'name', 'board', 'position', 'cards')

    def create(self, validated_data):
        cards = validated_data.pop('cards')
        category = Category.objects.create(**validated_data)
        for card in cards:
            Card.objects.create(category=category, **card)
        return category

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.board = validated_data.get('board', instance.board)
        instance.position = validated_data.get('position', instance.position)
        instance.cards.set(validated_data.get(
            'cards', instance.cards))
        instance.save()
        return instance


class BoardSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)

    class Meta:
        model = Board
        fields = ('id', 'name', 'owner', 'position', 'star', 'categories')

    def create(self, validated_data):
        categories = validated_data.pop('categories')
        board = Board.objects.create(**validated_data)
        for category in categories:
            Category.objects.create(board=board, **category)
        return board

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.owner = validated_data.get('owner', instance.owner)
        instance.position = validated_data.get('position', instance.position)
        instance.star = validated_data.get('star', instance.star)
        instance.categories.set(validated_data.get(
            'categories', instance.categories))
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    boards = BoardSerializer(many=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'boards')

    def create(self, validated_data):
        boards = validated_data.pop('boards')
        user = User.objects.create(**validated_data)
        for board in boards:
            Board.objects.create(user=user, **board)
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.password = validated_data.get('password', instance.password)
        instance.boards.set(validated_data.get('boards', instance.boards))
        instance.save()
        return instance
