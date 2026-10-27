import re
from datetime import datetime
from decimal import Decimal
from typing import Annotated
from urllib.parse import urlsplit
from uuid import UUID

from pydantic import Field, model_validator

from app.models.enums import CourseCertificate, CourseLevel, CourseTheme, CourseType
from app.schemas.common import APIModel, ORMModel

Slug = Annotated[str, Field(min_length=2, max_length=180, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")]


def _validate_course_fields(data: dict[str, object]) -> dict[str, object]:
    slug = data.get("slug")
    if isinstance(slug, str) and not re.fullmatch(
        r"[a-z0-9]+(?:-[a-z0-9]+)*", slug
    ):
        raise ValueError("Slug must use lowercase letters, numbers, and hyphens")
    image_url = data.get("image_url")
    if image_url is not None:
        parsed = urlsplit(str(image_url))
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("Image URL must be an absolute HTTP or HTTPS URL")
    syllabus = data.get("syllabus")
    if isinstance(syllabus, list):
        normalized = [item.strip() for item in syllabus if isinstance(item, str)]
        if len(normalized) != len(syllabus) or any(not item for item in normalized):
            raise ValueError("Syllabus entries must be non-empty strings")
        data["syllabus"] = normalized
    return data


class CourseCreate(APIModel):
    title: str = Field(min_length=2, max_length=160)
    slug: Slug
    short_description: str = Field(min_length=1, max_length=300)
    full_description: str = Field(min_length=1, max_length=10000)
    category: str = Field(min_length=1, max_length=80)
    course_type: CourseType
    duration: str = Field(min_length=1, max_length=80)
    level: CourseLevel
    delivery_mode: str = Field(min_length=1, max_length=40)
    image_url: str | None = Field(default=None, max_length=2048)
    price: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    curriculum: str | None = Field(default=None, max_length=10000)
    benefits: str | None = Field(default=None, max_length=10000)
    certificates: list[CourseCertificate] = Field(default_factory=list, max_length=3)
    syllabus: list[str] = Field(default_factory=list, max_length=50)
    card_theme: CourseTheme | None = None
    is_published: bool = False
    is_featured: bool = False
    display_order: int = Field(default=0, ge=0, le=100000)

    @model_validator(mode="after")
    def validate_fields(self) -> "CourseCreate":
        _validate_course_fields(self.model_dump())
        if not self.title.strip() or not self.short_description.strip():
            raise ValueError("Title and short description cannot be blank")
        if not self.full_description.strip() or not self.category.strip():
            raise ValueError("Description and category cannot be blank")
        if not self.duration.strip() or not self.delivery_mode.strip():
            raise ValueError("Duration and delivery mode cannot be blank")
        if len(set(self.certificates)) != len(self.certificates):
            raise ValueError("Certificates cannot contain duplicates")
        return self


class CourseUpdate(APIModel):
    title: str | None = Field(default=None, min_length=2, max_length=160)
    slug: Slug | None = None
    short_description: str | None = Field(default=None, min_length=1, max_length=300)
    full_description: str | None = Field(default=None, min_length=1, max_length=10000)
    category: str | None = Field(default=None, min_length=1, max_length=80)
    course_type: CourseType | None = None
    duration: str | None = Field(default=None, min_length=1, max_length=80)
    level: CourseLevel | None = None
    delivery_mode: str | None = Field(default=None, min_length=1, max_length=40)
    image_url: str | None = Field(default=None, max_length=2048)
    price: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    curriculum: str | None = Field(default=None, max_length=10000)
    benefits: str | None = Field(default=None, max_length=10000)
    certificates: list[CourseCertificate] | None = Field(default=None, max_length=3)
    syllabus: list[str] | None = Field(default=None, max_length=50)
    card_theme: CourseTheme | None = None
    is_published: bool | None = None
    is_featured: bool | None = None
    display_order: int | None = Field(default=None, ge=0, le=100000)

    @model_validator(mode="after")
    def validate_fields(self) -> "CourseUpdate":
        provided = self.model_fields_set
        if not provided:
            raise ValueError("At least one field must be provided")
        data = self.model_dump(exclude_unset=True)
        _validate_course_fields(data)
        for key in (
            "title",
            "short_description",
            "full_description",
            "category",
            "duration",
            "delivery_mode",
        ):
            if key in provided and (data[key] is None or not str(data[key]).strip()):
                raise ValueError(f"{key.replace('_', ' ').capitalize()} cannot be blank")
        if "level" in provided and data["level"] is None:
            raise ValueError("Level cannot be blank")
        if "certificates" in provided:
            certificates = data["certificates"]
            if certificates is None:
                raise ValueError("Certificates cannot be null; use an empty list to clear them")
            if len(set(certificates)) != len(certificates):
                raise ValueError("Certificates cannot contain duplicates")
        if "syllabus" in provided and data["syllabus"] is None:
            raise ValueError("Syllabus cannot be null; use an empty list to clear it")
        return self


class CourseRead(ORMModel):
    id: UUID
    title: str
    slug: str
    short_description: str
    full_description: str
    category: str
    course_type: CourseType
    duration: str
    level: str
    delivery_mode: str
    image_url: str | None
    price: Decimal | None
    curriculum: str | None
    benefits: str | None
    certificates: list[CourseCertificate]
    syllabus: list[str]
    card_theme: CourseTheme | None
    is_published: bool
    is_featured: bool
    display_order: int
    created_at: datetime
    updated_at: datetime
