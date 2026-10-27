from uuid import UUID

from sqlalchemy import select

from app.models.admission import Admission
from app.models.course import Course
from app.models.enums import CourseCertificate

COURSE = {
    "title": "Web Foundations",
    "slug": "web-foundations",
    "short_description": "Learn the foundations of web development.",
    "full_description": "A practical introduction to building for the web.",
    "category": "Development",
    "course_type": "course",
    "duration": "8 weeks",
    "level": "Beginner",
    "delivery_mode": "Online",
    "syllabus": ["HTML", "CSS", "JavaScript"],
    "card_theme": "sky",
    "is_published": False,
    "is_featured": False,
    "display_order": 0,
}


def test_admin_course_routes_require_authentication(client):
    test_client, _ = client
    assert test_client.get("/api/admin/courses").status_code == 401
    assert test_client.post("/api/admin/courses", json=COURSE).status_code == 401


def test_course_create_update_publish_and_public_listing(client, auth_headers):
    test_client, testing_session = client
    response = test_client.post("/api/admin/courses", json=COURSE, headers=auth_headers)
    assert response.status_code == 201
    course_id = response.json()["id"]
    assert str(UUID(course_id)) == course_id
    assert test_client.get("/api/courses").json() == []
    assert test_client.get("/api/courses/web-foundations").status_code == 404

    updated = test_client.patch(
        f"/api/admin/courses/{course_id}",
        json={"is_published": True, "card_theme": "mint"},
        headers=auth_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["card_theme"] == "mint"
    assert test_client.get("/api/courses").json()[0]["slug"] == "web-foundations"
    assert test_client.get("/api/courses/web-foundations").json()["is_published"] is True

    unpublished = test_client.patch(
        f"/api/admin/courses/{course_id}",
        json={"is_published": False},
        headers=auth_headers,
    )
    assert unpublished.status_code == 200
    assert test_client.get("/api/courses").json() == []
    with testing_session() as session:
        assert session.scalar(select(Course).where(Course.slug == "web-foundations"))


def test_course_details_optional_price_image_and_certificates_persist(
    client, auth_headers
):
    test_client, testing_session = client
    certificates = [
        CourseCertificate.COURSE_COMPLETION.value,
        CourseCertificate.PROJECT_COMPLETION.value,
    ]
    payload = {
        **COURSE,
        "slug": "course-details",
        "is_published": True,
        "image_url": "https://images.example.org/course.jpg",
        "curriculum": "Module 1\nModule 2\n  Topic 2.1",
        "benefits": "Build practical skills\nGet mentor feedback",
        "certificates": certificates,
    }

    created = test_client.post(
        "/api/admin/courses", json=payload, headers=auth_headers
    )
    assert created.status_code == 201
    course_id = created.json()["id"]
    assert created.json()["price"] is None
    assert created.json()["image_url"] == payload["image_url"]
    assert created.json()["curriculum"] == payload["curriculum"]
    assert created.json()["benefits"] == payload["benefits"]
    assert created.json()["certificates"] == certificates
    assert test_client.get("/api/courses/course-details").json()["curriculum"] == payload[
        "curriculum"
    ]

    updated = test_client.patch(
        f"/api/admin/courses/{course_id}",
        json={
            "price": "1299.50",
            "curriculum": "Updated curriculum\nWith line breaks",
            "benefits": "First benefit\nSecond benefit",
            "certificates": [CourseCertificate.INTERNSHIP_COMPLETION.value],
        },
        headers=auth_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["price"] == "1299.50"
    assert updated.json()["curriculum"] == "Updated curriculum\nWith line breaks"
    assert updated.json()["benefits"] == "First benefit\nSecond benefit"
    assert updated.json()["certificates"] == [
        CourseCertificate.INTERNSHIP_COMPLETION.value
    ]

    with testing_session() as session:
        stored = session.scalar(select(Course).where(Course.id == UUID(course_id)))
        assert stored is not None
        assert stored.image_url == payload["image_url"]
        assert stored.curriculum == "Updated curriculum\nWith line breaks"
        assert stored.benefits == "First benefit\nSecond benefit"
        assert stored.certificates == [
            CourseCertificate.INTERNSHIP_COMPLETION.value
        ]


def test_course_price_can_be_cleared_and_level_and_certificates_are_validated(
    client, auth_headers
):
    test_client, _ = client
    created = test_client.post(
        "/api/admin/courses",
        json={**COURSE, "slug": "optional-price", "price": "50.25"},
        headers=auth_headers,
    )
    assert created.status_code == 201
    course_id = created.json()["id"]

    cleared = test_client.patch(
        f"/api/admin/courses/{course_id}",
        json={"price": None, "level": "Advanced"},
        headers=auth_headers,
    )
    assert cleared.status_code == 200
    assert cleared.json()["price"] is None
    assert cleared.json()["level"] == "Advanced"

    invalid_level = test_client.patch(
        f"/api/admin/courses/{course_id}",
        json={"level": "Expert"},
        headers=auth_headers,
    )
    invalid_certificates = test_client.patch(
        f"/api/admin/courses/{course_id}",
        json={"certificates": ["Unrecognized certificate"]},
        headers=auth_headers,
    )
    duplicate_certificates = test_client.patch(
        f"/api/admin/courses/{course_id}",
        json={
            "certificates": [
                CourseCertificate.COURSE_COMPLETION.value,
                CourseCertificate.COURSE_COMPLETION.value,
            ]
        },
        headers=auth_headers,
    )
    invalid_price = test_client.patch(
        f"/api/admin/courses/{course_id}",
        json={"price": -1},
        headers=auth_headers,
    )
    assert invalid_level.status_code == 422
    assert invalid_certificates.status_code == 422
    assert duplicate_certificates.status_code == 422
    assert invalid_price.status_code == 422


def test_updating_other_fields_preserves_legacy_level(client, auth_headers):
    test_client, testing_session = client
    created = test_client.post(
        "/api/admin/courses",
        json={**COURSE, "slug": "legacy-level"},
        headers=auth_headers,
    )
    course_id = created.json()["id"]
    with testing_session() as session:
        course = session.scalar(select(Course).where(Course.id == UUID(course_id)))
        assert course is not None
        course.level = "Expert Beginner"
        session.commit()

    updated = test_client.patch(
        f"/api/admin/courses/{course_id}",
        json={"short_description": "Updated without changing the level."},
        headers=auth_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["level"] == "Expert Beginner"


def test_public_internships_and_programmes_are_filtered_by_type(client, auth_headers):
    test_client, _ = client
    for title, slug, course_type in (
        ("Internship term", "internship-term", "internship"),
        ("Study programme", "study-programme", "programme"),
    ):
        payload = {
            **COURSE,
            "title": title,
            "slug": slug,
            "course_type": course_type,
            "is_published": True,
        }
        assert test_client.post(
            "/api/admin/courses", json=payload, headers=auth_headers
        ).status_code == 201
    assert [item["slug"] for item in test_client.get("/api/internships").json()] == [
        "internship-term"
    ]
    assert [item["slug"] for item in test_client.get("/api/programmes").json()] == [
        "study-programme"
    ]
    assert test_client.get("/api/courses").json() == []


def test_admin_course_search_filter_pagination_and_duplicate_slug(client, auth_headers):
    test_client, _ = client
    for position, slug in enumerate(
        ("development-foundations", "design-foundations", "backend-foundations")
    ):
        payload = {
            **COURSE,
            "slug": slug,
            "category": "Design" if position == 1 else "Development",
            "display_order": position,
        }
        assert test_client.post(
            "/api/admin/courses", json=payload, headers=auth_headers
        ).status_code == 201

    page = test_client.get(
        "/api/admin/courses?course_type=course&category=Development&limit=1",
        headers=auth_headers,
    )
    assert page.status_code == 200
    assert page.json()["total"] == 2
    assert len(page.json()["items"]) == 1

    search = test_client.get(
        "/api/admin/courses?search=design", headers=auth_headers
    )
    assert search.json()["total"] == 1
    duplicate = test_client.post(
        "/api/admin/courses",
        json=COURSE | {"slug": "development-foundations"},
        headers=auth_headers,
    )
    assert duplicate.status_code == 409


def test_course_delete_and_admission_reference_safeguard(client, auth_headers):
    test_client, testing_session = client
    payload = {**COURSE, "is_published": True}
    created = test_client.post(
        "/api/admin/courses", json=payload, headers=auth_headers
    )
    course_id = created.json()["id"]
    assert test_client.delete(
        f"/api/admin/courses/{course_id}", headers=auth_headers
    ).status_code == 204

    referenced = test_client.post(
        "/api/admin/courses",
        json={**payload, "slug": "referenced-course"},
        headers=auth_headers,
    )
    referenced_id = referenced.json()["id"]
    with testing_session() as session:
        session.add(
            Admission(
                name="Applicant",
                email="applicant@example.com",
                phone="1234567890",
                education="undergraduate",
                course="referenced-course",
            )
        )
        session.commit()
    response = test_client.delete(
        f"/api/admin/courses/{referenced_id}", headers=auth_headers
    )
    assert response.status_code == 409


def test_invalid_course_fields_and_unpublished_admission_course_are_rejected(
    client, auth_headers
):
    test_client, _ = client
    invalid = test_client.post(
        "/api/admin/courses",
        json={**COURSE, "slug": "Bad Slug", "price": -1},
        headers=auth_headers,
    )
    assert invalid.status_code == 422

    response = test_client.post(
        "/api/admissions",
        json={
            "name": "Applicant",
            "email": "applicant@example.com",
            "phone": "1234567890",
            "education": "undergraduate",
            "course": "unpublished-programme",
        },
    )
    assert response.status_code == 422
