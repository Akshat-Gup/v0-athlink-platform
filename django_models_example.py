# Django Models for Athlink Platform

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    """Extended User model"""

    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.username


class Talent(models.Model):
    """Talent/Athlete model"""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="talents")
    name = models.CharField(max_length=100)
    sport = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    country = models.CharField(max_length=50)
    team = models.CharField(max_length=100, null=True, blank=True)
    rating = models.FloatField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    current_funding = models.PositiveIntegerField(default=0)
    goal_funding = models.PositiveIntegerField()
    image = models.ImageField(upload_to="talents/profiles/", null=True, blank=True)
    cover_image = models.ImageField(upload_to="talents/covers/", null=True, blank=True)
    achievements = models.TextField(null=True, blank=True)
    bio = models.TextField()
    category = models.CharField(max_length=20, default="talent")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-rating", "-created_at"]

    def __str__(self):
        return f"{self.name} - {self.sport}"


class Team(models.Model):
    """Team model"""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="teams")
    name = models.CharField(max_length=100)
    sport = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    country = models.CharField(max_length=50)
    league = models.CharField(max_length=100, null=True, blank=True)
    rating = models.FloatField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    current_funding = models.PositiveIntegerField(default=0)
    goal_funding = models.PositiveIntegerField()
    image = models.ImageField(upload_to="teams/profiles/", null=True, blank=True)
    cover_image = models.ImageField(upload_to="teams/covers/", null=True, blank=True)
    achievements = models.TextField(null=True, blank=True)
    bio = models.TextField()
    category = models.CharField(max_length=20, default="team")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-rating", "-created_at"]

    def __str__(self):
        return f"{self.name} - {self.sport}"


class Event(models.Model):
    """Event model"""

    STATUS_CHOICES = [
        ("upcoming", "Upcoming"),
        ("live", "Live"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    country = models.CharField(max_length=50)
    rating = models.FloatField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="upcoming")
    image = models.ImageField(upload_to="events/profiles/", null=True, blank=True)
    cover_image = models.ImageField(upload_to="events/covers/", null=True, blank=True)
    bio = models.TextField()
    category = models.CharField(max_length=20, default="event")

    # Event specific fields
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    ticket_price = models.PositiveIntegerField(null=True, blank=True)
    max_attendees = models.PositiveIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date"]

    def __str__(self):
        return f"{self.name} - {self.start_date.strftime('%Y-%m-%d')}"


class Player(models.Model):
    """Team player model"""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="players")
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=50)
    number = models.PositiveIntegerField()
    image = models.ImageField(upload_to="players/", null=True, blank=True)

    # Stats
    ppg = models.FloatField(default=0)  # Points per game
    apg = models.FloatField(default=0)  # Assists per game
    rpg = models.FloatField(default=0)  # Rebounds per game

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["team", "number"]
        ordering = ["number"]

    def __str__(self):
        return f"{self.name} #{self.number} - {self.team.name}"


class Game(models.Model):
    """Team game model"""

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="games")
    opponent = models.CharField(max_length=100)
    date = models.DateTimeField()
    location = models.CharField(max_length=100)
    time = models.CharField(max_length=20)
    result = models.CharField(
        max_length=20, null=True, blank=True
    )  # "W 95-87", "L 78-82"
    image = models.ImageField(upload_to="games/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return f"{self.team.name} vs {self.opponent} - {self.date.strftime('%Y-%m-%d')}"


class Sponsor(models.Model):
    """Sponsor model (polymorphic - can sponsor talents, teams, or events)"""

    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to="sponsors/", null=True, blank=True)
    tier = models.CharField(max_length=50, null=True, blank=True)
    amount = models.PositiveIntegerField()

    # Polymorphic relations
    talent = models.ForeignKey(
        Talent, on_delete=models.CASCADE, related_name="sponsors", null=True, blank=True
    )
    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name="sponsors", null=True, blank=True
    )
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="sponsors", null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.tier}"


class TalentStat(models.Model):
    """Talent statistics"""

    talent = models.ForeignKey(Talent, on_delete=models.CASCADE, related_name="stats")
    label = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    icon = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"{self.talent.name} - {self.label}: {self.value}"


class Competition(models.Model):
    """Talent competition model"""

    TYPE_CHOICES = [
        ("upcoming", "Upcoming"),
        ("past", "Past"),
    ]

    talent = models.ForeignKey(
        Talent, on_delete=models.CASCADE, related_name="competitions"
    )
    tournament = models.CharField(max_length=100)
    date = models.DateTimeField()
    location = models.CharField(max_length=100)
    result = models.CharField(max_length=50, null=True, blank=True)
    image = models.ImageField(upload_to="competitions/", null=True, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="upcoming")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return f"{self.talent.name} - {self.tournament}"


class EventParticipant(models.Model):
    """Event participant model"""

    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="participants"
    )
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="participants/", null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.event.name}"


class Media(models.Model):
    """Media model (photos/videos for profiles)"""

    MEDIA_TYPES = [
        ("photo", "Photo"),
        ("video", "Video"),
        ("youtube", "YouTube"),
        ("instagram", "Instagram"),
    ]

    url = models.URLField()
    title = models.CharField(max_length=100, null=True, blank=True)
    type = models.CharField(max_length=20, choices=MEDIA_TYPES)
    category = models.CharField(max_length=50, null=True, blank=True)

    # Polymorphic relations
    talent = models.ForeignKey(
        Talent, on_delete=models.CASCADE, related_name="media", null=True, blank=True
    )
    team = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name="media", null=True, blank=True
    )
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="media", null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.type}"
