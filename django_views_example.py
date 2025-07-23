# Django Views for Athlink Platform API

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .models import Talent, Team, Event, Player, Game, Sponsor
from .serializers import (
    TalentSerializer,
    TalentListSerializer,
    TeamSerializer,
    TeamListSerializer,
    EventSerializer,
    EventListSerializer,
    PlayerSerializer,
    GameSerializer,
    SponsorSerializer,
)


class TalentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Talent management
    Supports CRUD operations, search, and filtering
    """

    queryset = Talent.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["sport", "location", "country", "category"]
    search_fields = ["name", "sport", "location", "achievements"]
    ordering_fields = ["rating", "created_at", "current_funding"]
    ordering = ["-rating"]

    def get_serializer_class(self):
        if self.action == "list":
            return TalentListSerializer
        return TalentSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"])
    def sponsors(self, request, pk=None):
        """Get sponsors for a talent"""
        talent = self.get_object()
        sponsors = talent.sponsors.all()
        serializer = SponsorSerializer(sponsors, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def add_sponsor(self, request, pk=None):
        """Add a sponsor to a talent"""
        talent = self.get_object()
        serializer = SponsorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(talent=talent)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeamViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Team management
    """

    queryset = Team.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["sport", "location", "country", "league", "category"]
    search_fields = ["name", "sport", "location", "achievements"]
    ordering_fields = ["rating", "created_at", "current_funding"]
    ordering = ["-rating"]

    def get_serializer_class(self):
        if self.action == "list":
            return TeamListSerializer
        return TeamSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"])
    def players(self, request, pk=None):
        """Get players for a team"""
        team = self.get_object()
        players = team.players.all()
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def add_player(self, request, pk=None):
        """Add a player to a team"""
        team = self.get_object()
        serializer = PlayerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(team=team)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def games(self, request, pk=None):
        """Get games for a team"""
        team = self.get_object()
        games = team.games.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def add_game(self, request, pk=None):
        """Add a game to a team"""
        team = self.get_object()
        serializer = GameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(team=team)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def upcoming_games(self, request, pk=None):
        """Get upcoming games for a team"""
        team = self.get_object()
        upcoming = team.games.filter(
            result__isnull=True, date__gte=timezone.now()
        ).order_by("date")
        serializer = GameSerializer(upcoming, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def recent_results(self, request, pk=None):
        """Get recent results for a team"""
        team = self.get_object()
        recent = team.games.filter(result__isnull=False).order_by("-date")[:10]
        serializer = GameSerializer(recent, many=True)
        return Response(serializer.data)


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Event management
    """

    queryset = Event.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["location", "country", "status", "category"]
    search_fields = ["name", "location", "bio"]
    ordering_fields = ["rating", "start_date", "created_at"]
    ordering = ["start_date"]

    def get_serializer_class(self):
        if self.action == "list":
            return EventListSerializer
        return EventSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def upcoming(self, request):
        """Get upcoming events"""
        upcoming_events = self.queryset.filter(
            start_date__gte=timezone.now(), status="upcoming"
        )
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def live(self, request):
        """Get live events"""
        live_events = self.queryset.filter(status="live")
        serializer = self.get_serializer(live_events, many=True)
        return Response(serializer.data)


# Search across all models
from rest_framework.views import APIView
from django.db.models import Q


class GlobalSearchView(APIView):
    """
    Global search across talents, teams, and events
    """

    def get(self, request):
        query = request.GET.get("q", "")
        search_type = request.GET.get("type", "all")  # all, talent, team, event

        results = {
            "talents": [],
            "teams": [],
            "events": [],
        }

        if query:
            if search_type in ["all", "talent"]:
                talents = Talent.objects.filter(
                    Q(name__icontains=query)
                    | Q(sport__icontains=query)
                    | Q(location__icontains=query)
                )[:5]
                results["talents"] = TalentListSerializer(talents, many=True).data

            if search_type in ["all", "team"]:
                teams = Team.objects.filter(
                    Q(name__icontains=query)
                    | Q(sport__icontains=query)
                    | Q(location__icontains=query)
                )[:5]
                results["teams"] = TeamListSerializer(teams, many=True).data

            if search_type in ["all", "event"]:
                events = Event.objects.filter(
                    Q(name__icontains=query)
                    | Q(location__icontains=query)
                    | Q(bio__icontains=query)
                )[:5]
                results["events"] = EventListSerializer(events, many=True).data

        return Response(results)
