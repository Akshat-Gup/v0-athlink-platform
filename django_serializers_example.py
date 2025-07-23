# Django REST Framework Serializers for Athlink Platform

from rest_framework import serializers
from .models import Talent, Team, Event, Player, Game, Sponsor, TalentStat, Competition


class TalentStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = TalentStat
        fields = ["label", "value", "icon"]


class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = ["id", "tournament", "date", "location", "result", "image", "type"]


class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = ["id", "name", "logo", "tier", "amount"]


class TalentSerializer(serializers.ModelSerializer):
    stats = TalentStatSerializer(many=True, read_only=True)
    competitions = CompetitionSerializer(many=True, read_only=True)
    sponsors = SponsorSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Talent
        fields = [
            "id",
            "name",
            "sport",
            "location",
            "country",
            "team",
            "rating",
            "current_funding",
            "goal_funding",
            "image",
            "cover_image",
            "achievements",
            "bio",
            "category",
            "stats",
            "competitions",
            "sponsors",
            "user",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ["id", "name", "position", "number", "image", "ppg", "apg", "rpg"]


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ["id", "opponent", "date", "location", "time", "result", "image"]


class TeamSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    games = GameSerializer(many=True, read_only=True)
    sponsors = SponsorSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    # Computed fields
    upcoming_games = serializers.SerializerMethodField()
    recent_results = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "sport",
            "location",
            "country",
            "league",
            "rating",
            "current_funding",
            "goal_funding",
            "image",
            "cover_image",
            "achievements",
            "bio",
            "category",
            "players",
            "games",
            "sponsors",
            "user",
            "upcoming_games",
            "recent_results",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def get_upcoming_games(self, obj):
        upcoming = obj.games.filter(result__isnull=True, date__gte=timezone.now())[:5]
        return GameSerializer(upcoming, many=True).data

    def get_recent_results(self, obj):
        recent = obj.games.filter(result__isnull=False).order_by("-date")[:5]
        return GameSerializer(recent, many=True).data


class EventParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventParticipant
        fields = ["id", "name", "image", "description"]


class EventSerializer(serializers.ModelSerializer):
    participants = EventParticipantSerializer(many=True, read_only=True)
    sponsors = SponsorSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "location",
            "country",
            "rating",
            "status",
            "image",
            "cover_image",
            "bio",
            "category",
            "start_date",
            "end_date",
            "ticket_price",
            "max_attendees",
            "participants",
            "sponsors",
            "user",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


# List serializers (lighter versions for list views)
class TalentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Talent
        fields = [
            "id",
            "name",
            "sport",
            "location",
            "country",
            "rating",
            "current_funding",
            "goal_funding",
            "image",
            "achievements",
        ]


class TeamListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "sport",
            "location",
            "country",
            "league",
            "rating",
            "current_funding",
            "goal_funding",
            "image",
            "achievements",
        ]


class EventListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "location",
            "country",
            "rating",
            "status",
            "image",
            "start_date",
            "end_date",
        ]
