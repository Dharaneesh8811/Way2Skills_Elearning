"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  COURSE_CERTIFICATES,
  courseRequest,
  type CourseCertificate,
  type Course,
  type CourseCategory,
  type CoursePage,
  type CourseTheme,
  type CourseType,
} from "@/lib/coursesApi";
import CourseImage from "@/components/courses/CourseImage";

const PAGE_SIZE = 10;
const DELIVERY_MODES = ["Online", "Offline", "Flexible"] as const;
const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

type CourseDraft = {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  category: string;
  course_type: CourseType;
  duration: string;
  level: string;
  delivery_mode: string;
  image_url: string;
  price: string;
  benefits: string;
  certificates: CourseCertificate[];
  card_theme: CourseTheme | "";
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
};

type EditableCourseContent = Pick<
  CourseDraft,
  "short_description" | "benefits"
>;

const emptyDraft: CourseDraft = {
  title: "",
  slug: "",
  short_description: "",
  full_description: "",
  category: "",
  course_type: "course",
  duration: "",
  level: "Beginner",
  delivery_mode: "Online",
  image_url: "",
  price: "",
  benefits: "",
  certificates: [],
  card_theme: "sky",
  is_published: false,
  is_featured: false,
  display_order: 0,
};

const emptyEditableContent: EditableCourseContent = {
  short_description: "",
  benefits: "",
};

function countCharacters(value: string): number {
  return Array.from(value).length;
}

function countContentLines(value: string): number {
  return value.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
}

function slugFromTitle(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug.length >= 2 ? slug : "offering";
}

function fromCourse(course: Course): CourseDraft {
  return {
    title: course.title,
    slug: course.slug,
    short_description: course.short_description,
    full_description: course.full_description,
    category: course.category,
    course_type: course.course_type,
    duration: course.duration,
    level: course.level,
    delivery_mode: course.delivery_mode,
    image_url: course.image_url ?? "",
    price: course.price ?? "",
    benefits: course.benefits ?? "",
    certificates: course.certificates ?? [],
    card_theme: course.card_theme ?? "",
    is_published: course.is_published,
    is_featured: course.is_featured,
    display_order: course.display_order,
  };
}

function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : "The request could not be completed.";
}

function canonicalLevel(level: string): string {
  return COURSE_LEVELS.find(
    (option) => option.toLowerCase() === level.trim().toLowerCase()
  ) ?? "";
}

export default function CourseManagement({ token }: { token: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("");
  const [customCategory, setCustomCategory] = useState(false);
  const [draft, setDraft] = useState<CourseDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalLevel, setOriginalLevel] = useState("");
  const [originalCategory, setOriginalCategory] = useState("");
  const [originalEditableContent, setOriginalEditableContent] =
    useState<EditableCourseContent>(emptyEditableContent);
  const [levelChanged, setLevelChanged] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [manageCategoriesOpen, setManageCategoriesOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const previousBodyOverflow = useRef("");
  const categoryDeletePending = useRef(false);

  const loadCategories = useCallback(async (signal?: AbortSignal) => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const availableCategories = await courseRequest<CourseCategory[]>(
        "/api/admin/categories",
        token,
        { signal }
      );
      if (!signal?.aborted) setCategories(availableCategories);
    } catch (requestError) {
      if (!signal?.aborted) setCategoriesError(messageFrom(requestError));
    } finally {
      if (!signal?.aborted) setCategoriesLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const controller = new AbortController();
    void loadCategories(controller.signal);
    return () => controller.abort();
  }, [loadCategories]);

  const loadCourses = useCallback(async (
    requestedOffset = offset,
    signal?: AbortSignal
  ) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(requestedOffset),
    });
    if (search.trim()) params.set("search", search.trim());
    if (typeFilter) params.set("course_type", typeFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (publishedFilter) params.set("is_published", publishedFilter);
    try {
      const page = await courseRequest<CoursePage>(
        `/api/admin/courses?${params.toString()}`,
        token,
        { signal }
      );
      if (signal?.aborted) return;
      const lastPageOffset =
        Math.max(0, Math.ceil(page.total / PAGE_SIZE) - 1) * PAGE_SIZE;
      if (requestedOffset > lastPageOffset) {
        setTotal(page.total);
        setCourses([]);
        setOffset(lastPageOffset);
        return;
      }
      setCourses(page.items);
      setTotal(page.total);
    } catch (requestError) {
      if (!signal?.aborted) setError(messageFrom(requestError));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [categoryFilter, offset, publishedFilter, search, token, typeFilter]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(
      () => void loadCourses(offset, controller.signal),
      200
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [loadCourses, offset]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (editorOpen && dialog && !dialog.open) {
      dialog.showModal();
      previousBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      titleInputRef.current?.focus();
    } else if (!editorOpen && dialog?.open) {
      dialog.close();
    }

    return () => {
      if (editorOpen) {
        document.body.style.overflow = previousBodyOverflow.current;
      }
    };
  }, [editorOpen]);

  function resetEditor() {
    setEditingId(null);
    setOriginalLevel("");
    setOriginalCategory("");
    setOriginalEditableContent(emptyEditableContent);
    setLevelChanged(false);
    setDraft(emptyDraft);
    setCustomCategory(false);
    setFormError(null);
    setEditorOpen(false);
  }

  async function saveCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const wasEditing = editingId !== null;
    const shortDescriptionChanged =
      !wasEditing ||
      draft.short_description !== originalEditableContent.short_description;
    const benefitsChanged =
      !wasEditing || draft.benefits !== originalEditableContent.benefits;

    if (shortDescriptionChanged && countCharacters(draft.short_description) > 100) {
      setFormError("Short description must be no more than 100 characters.");
      return;
    }
    if (benefitsChanged && countContentLines(draft.benefits) > 5) {
      setFormError("Benefits must contain no more than 5 non-empty lines.");
      return;
    }

    setSaving(true);
    setError(null);
    setFormError(null);
    setNotice(null);
    const payload = {
      ...draft,
      slug: editingId ? draft.slug : slugFromTitle(draft.title),
      ...(editingId && !levelChanged ? { level: undefined } : {}),
      ...(editingId && draft.category === originalCategory
        ? { category: undefined }
        : {}),
      ...(editingId && !shortDescriptionChanged
        ? { short_description: undefined }
        : {}),
      ...(editingId && !benefitsChanged ? { benefits: undefined } : {}),
      image_url: draft.image_url.trim() || null,
      price: draft.price.trim() ? Number(draft.price) : null,
      ...(editingId && !benefitsChanged
        ? { benefits: undefined }
        : { benefits: draft.benefits.trim() ? draft.benefits : null }),
      card_theme: draft.card_theme || null,
    };
    try {
      await courseRequest<Course>(
        editingId
          ? `/api/admin/courses/${editingId}`
          : "/api/admin/courses",
        token,
        {
          method: editingId ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        }
      );
      setNotice(wasEditing ? "Course updated." : "Course created.");
      resetEditor();
      const nextOffset = wasEditing ? offset : 0;
      if (!wasEditing) setOffset(0);
      await loadCourses(nextOffset);
      await loadCategories();
    } catch (requestError) {
      setFormError(messageFrom(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function togglePublication(course: Course) {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await courseRequest<Course>(`/api/admin/courses/${course.id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ is_published: !course.is_published }),
      });
      setNotice(course.is_published ? "Course unpublished." : "Course published.");
      await loadCourses();
    } catch (requestError) {
      setError(messageFrom(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteCourse(course: Course) {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await courseRequest<void>(`/api/admin/courses/${course.id}`, token, {
        method: "DELETE",
      });
      setNotice("Course deleted.");
      if (editingId === course.id) resetEditor();
      await loadCourses();
      await loadCategories();
    } catch (requestError) {
      setError(messageFrom(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(category: CourseCategory) {
    if (categoryDeletePending.current) return;
    const courseLabel = `${category.course_count} ${
      category.course_count === 1 ? "course" : "courses"
    }`;
    if (
      !window.confirm(
        `Delete "${category.name}"? ${courseLabel} will be retained with all saved details. The category will no longer be available for new assignments.`
      )
    ) {
      return;
    }

    categoryDeletePending.current = true;
    setDeletingCategory(category.name);
    setError(null);
    setNotice(null);
    try {
      await courseRequest<void>(
        `/api/admin/categories?name=${encodeURIComponent(category.name)}`,
        token,
        { method: "DELETE" }
      );
      setNotice(
        `Category "${category.name}" deleted. ${courseLabel} and their details were retained.`
      );
      await loadCategories();
      if (categoryFilter === category.name) {
        setCategoryFilter("");
        setOffset(0);
      } else {
        await loadCourses(0);
      }
    } catch (requestError) {
      setError(messageFrom(requestError));
    } finally {
      categoryDeletePending.current = false;
      setDeletingCategory(null);
    }
  }

  function editCourse(course: Course) {
    setEditingId(course.id);
    setOriginalLevel(course.level);
    setOriginalCategory(course.category);
    const courseDraft = fromCourse(course);
    setOriginalEditableContent({
      short_description: courseDraft.short_description,
      benefits: courseDraft.benefits,
    });
    setLevelChanged(false);
    setEditorOpen(true);
    setDraft({ ...courseDraft, level: canonicalLevel(course.level) });
    setCustomCategory(false);
    setNotice(null);
    setError(null);
    setFormError(null);
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100";
  const labelClass = "block text-sm font-medium text-slate-700";
  const categoryNames = categories.map((category) => category.name);
  const legacyCategory =
    editingId !== null &&
    Boolean(draft.category) &&
    !categoryNames.includes(draft.category);
  const shortDescriptionCharacters = countCharacters(draft.short_description);
  const benefitLines = countContentLines(draft.benefits);
  const shortDescriptionOverLimit = shortDescriptionCharacters > 100;
  const benefitsOverLimit = benefitLines > 5;
  const shortDescriptionLegacy =
    editingId !== null &&
    shortDescriptionOverLimit &&
    draft.short_description === originalEditableContent.short_description;
  const benefitsLegacy =
    editingId !== null &&
    benefitsOverLimit &&
    draft.benefits === originalEditableContent.benefits;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const firstPageNumber = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
  const pageNumbers = Array.from(
    { length: Math.min(pageCount, 5) },
    (_, index) => firstPageNumber + index
  );
  const rangeStart = total === 0 ? 0 : offset + 1;
  const rangeEnd = Math.min(offset + courses.length, total);

  return (
    <section className="mx-auto mt-5 max-w-7xl" aria-labelledby="courses-heading">
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="courses-heading" className="text-2xl font-semibold tracking-tight text-slate-950">
            Course Management
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage your courses, modes, and course information.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            onClick={() => setManageCategoriesOpen((open) => !open)}
            type="button"
          >
            <FolderOpen aria-hidden="true" size={17} />
            Manage Categories
          </button>
          <span className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700">
            {total} {total === 1 ? "course" : "courses"}
          </span>
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={saving}
            onClick={() => {
              setEditingId(null);
              setOriginalLevel("");
              setOriginalCategory("");
              setLevelChanged(false);
              setDraft(emptyDraft);
              setCustomCategory(false);
              setFormError(null);
              setNotice(null);
              setError(null);
              setEditorOpen(true);
            }}
            type="button"
          >
            <Plus aria-hidden="true" size={17} />
            Add Course
          </button>
        </div>
      </header>

      {manageCategoriesOpen && (
        <section
          aria-labelledby="manage-categories-heading"
          className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <header className="border-b border-slate-200 px-4 py-4 sm:px-5">
            <h3
              className="font-semibold text-slate-950"
              id="manage-categories-heading"
            >
              Manage Categories
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Deleting a category keeps every course and its saved details.
            </p>
          </header>
          {categoriesError ? (
            <p className="p-5 text-sm text-red-700" role="alert">
              Could not load categories: {categoriesError}
            </p>
          ) : categoriesLoading ? (
            <p className="p-5 text-sm text-slate-600" role="status">
              Loading categories…
            </p>
          ) : categories.length === 0 ? (
            <p className="p-5 text-sm text-slate-600">
              No available categories.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {categories.map((category) => (
                <li
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                  key={category.name}
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-slate-900">
                      {category.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {category.course_count}{" "}
                      {category.course_count === 1 ? "course" : "courses"}{" "}
                      assigned
                    </p>
                  </div>
                  <button
                    className="inline-flex min-h-9 items-center justify-center gap-2 self-start rounded-lg border border-red-200 px-3.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                    disabled={deletingCategory !== null}
                    onClick={() => void deleteCategory(category)}
                    type="button"
                  >
                    <Trash2 aria-hidden="true" size={15} />
                    {deletingCategory === category.name
                      ? "Deleting…"
                      : "Delete"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(240px,1.5fr)_repeat(3,minmax(150px,1fr))]">
            <label className={`${labelClass} relative`}>
              <span className="sr-only">Search courses</span>
              <Search
                aria-hidden="true"
                className="absolute left-3 top-[calc(50%+4px)] -translate-y-1/2 text-slate-400"
                size={17}
              />
              <input
                className={`${inputClass} pl-9`}
                onChange={(event) => {
                  setOffset(0);
                  setSearch(event.target.value);
                }}
                placeholder="Search title, slug, or category"
                type="search"
                value={search}
              />
            </label>
            <label className={labelClass}>
              <span className="sr-only">Filter by course type</span>
              <select
                className={inputClass}
                onChange={(event) => {
                  setOffset(0);
                  setTypeFilter(event.target.value);
                }}
                value={typeFilter}
              >
                <option value="">All types</option>
                <option value="course">Course</option>
                <option value="internship">Internship</option>
                <option value="programme">Programme</option>
              </select>
            </label>
            <label className={labelClass}>
              <span className="sr-only">Filter by category</span>
              <select
                className={inputClass}
                onChange={(event) => {
                  setOffset(0);
                  setCategoryFilter(event.target.value);
                }}
                value={categoryFilter}
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              <span className="sr-only">Filter by publication status</span>
              <select
                className={inputClass}
                onChange={(event) => {
                  setOffset(0);
                  setPublishedFilter(event.target.value);
                }}
                value={publishedFilter}
              >
                <option value="">All publication states</option>
                <option value="true">Published</option>
                <option value="false">Unpublished</option>
              </select>
            </label>
          </div>
          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800" role="status">
              {notice}
            </p>
          )}
        </div>

        {loading ? (
          <p className="p-6 text-sm text-slate-600" role="status">
            Loading courses…
          </p>
        ) : courses.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen aria-hidden="true" className="mx-auto text-slate-400" size={28} />
            <h3 className="mt-3 font-semibold text-slate-900">
              {total === 0 ? "No courses found" : "No courses on this page"}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {total === 0
                ? "Add a course or adjust your search and filters."
                : "Try another page or update your search and filters."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {courses.map((course) => (
              <li
                className="flex flex-col gap-4 px-4 py-4 sm:px-5 md:flex-row md:items-center md:justify-between"
                key={course.id}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="break-words font-semibold text-slate-950">
                      {course.title}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                      {course.course_type}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        course.is_published
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {course.is_published ? "Published" : "Unpublished"}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">
                    {course.short_description}
                  </p>
                  <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>{course.category}</span>
                    <span>{course.duration}</span>
                    <span>{course.level}</span>
                    <span className="font-medium text-sky-800">
                      {course.delivery_mode}
                    </span>
                    {course.price !== null && <span>₹{course.price}</span>}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:shrink-0">
                  <button
                    className="min-h-9 rounded-lg border border-slate-300 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:opacity-50"
                    disabled={saving}
                    onClick={() => editCourse(course)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="min-h-9 rounded-lg border border-sky-200 px-3.5 py-1.5 text-sm font-medium text-sky-800 transition-colors hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 disabled:opacity-50"
                    disabled={saving}
                    onClick={() => void togglePublication(course)}
                    type="button"
                  >
                    {course.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    className="min-h-9 rounded-lg border border-red-200 px-3.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:opacity-50"
                    disabled={saving}
                    onClick={() => void deleteCourse(course)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <footer className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-slate-600" aria-live="polite">
            Showing {rangeStart}–{rangeEnd} of {total} courses
          </p>
          <nav aria-label="Course pagination" className="flex flex-wrap items-center gap-1.5">
            <button
              aria-label="Previous page"
              className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-300 px-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={offset === 0 || loading}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={16} />
              Previous
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                aria-current={pageNumber === currentPage ? "page" : undefined}
                aria-label={`Page ${pageNumber}`}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors ${
                  pageNumber === currentPage
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
                key={pageNumber}
                onClick={() => setOffset((pageNumber - 1) * PAGE_SIZE)}
                type="button"
              >
                {pageNumber}
              </button>
            ))}
            <button
              aria-label="Next page"
              className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-300 px-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              disabled={offset + courses.length >= total || loading}
              onClick={() => setOffset(offset + PAGE_SIZE)}
              type="button"
            >
              Next
              <ChevronRight aria-hidden="true" size={16} />
            </button>
          </nav>
        </footer>
      </div>

      {editorOpen && (
        <dialog
          aria-labelledby="course-editor-title"
          aria-describedby="course-editor-description"
          className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
          onCancel={(event) => {
            if (saving) event.preventDefault();
            else resetEditor();
          }}
          ref={dialogRef}
        >
          <form className="p-5 sm:p-7" onSubmit={saveCourse}>
            <header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                  Course details
                </p>
                <h2 id="course-editor-title" className="mt-1 text-xl font-semibold tracking-tight">
                  {editingId ? "Edit Course" : "Add Course"}
                </h2>
                <p id="course-editor-description" className="mt-1 text-sm text-slate-600">
                  Update the course information and delivery options.
                </p>
              </div>
              <button
                aria-label="Close course editor"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 disabled:opacity-50"
                disabled={saving}
                onClick={resetEditor}
                type="button"
              >
                <X aria-hidden="true" size={19} />
              </button>
            </header>

            {formError && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800" role="alert">
                {formError}
              </p>
            )}

            <div className="mt-5 grid gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className={labelClass}>
                Course title
                <input
                  className={inputClass}
                  maxLength={160}
                  minLength={2}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  ref={titleInputRef}
                  required
                  value={draft.title}
                />
              </label>
              <label className={labelClass}>
                Offering type
                <select
                  className={inputClass}
                  onChange={(event) =>
                    setDraft({ ...draft, course_type: event.target.value as CourseType })
                  }
                  value={draft.course_type}
                >
                  <option value="course">Course</option>
                  <option value="internship">Internship</option>
                  <option value="programme">Programme</option>
                </select>
                {draft.course_type === "internship" && (
                  <span className="text-xs font-normal leading-5 text-slate-500">
                    Published internship offerings appear in the public Internship
                    Opportunities section.
                  </span>
                )}
              </label>
              <label className={labelClass}>
                Category
                <select
                  className={inputClass}
                  onChange={(event) => {
                    if (event.target.value === "__new__") {
                      setCustomCategory(true);
                      setDraft({ ...draft, category: "" });
                    } else {
                      setCustomCategory(false);
                      setDraft({ ...draft, category: event.target.value });
                    }
                  }}
                  required={!customCategory}
                  value={customCategory ? "__new__" : draft.category}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                  {legacyCategory && (
                    <option value={draft.category}>
                      Saved category (legacy): {draft.category}
                    </option>
                  )}
                  <option value="__new__">Add a new category…</option>
                </select>
                {customCategory && (
                  <input
                    aria-label="New category"
                    className={inputClass}
                    maxLength={80}
                    onChange={(event) =>
                      setDraft({ ...draft, category: event.target.value })
                    }
                    placeholder="Enter a category"
                    required
                    value={draft.category}
                  />
                )}
              </label>
              <label className={labelClass}>
                Duration
                <input
                  className={inputClass}
                  maxLength={80}
                  onChange={(event) => setDraft({ ...draft, duration: event.target.value })}
                  required
                  value={draft.duration}
                />
              </label>
              <label className={labelClass}>
                Level
                <select
                  className={inputClass}
                  onChange={(event) => {
                    setLevelChanged(true);
                    setDraft({ ...draft, level: event.target.value });
                  }}
                  required={editingId === null || levelChanged}
                  value={draft.level}
                >
                  {editingId !== null && !canonicalLevel(originalLevel) ? (
                    <option value="">
                      Keep existing level ({originalLevel})
                    </option>
                  ) : (
                    <option value="" disabled>
                      Select a level
                    </option>
                  )}
                  {COURSE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Mode
                <select
                  className={inputClass}
                  onChange={(event) =>
                    setDraft({ ...draft, delivery_mode: event.target.value })
                  }
                  required
                  value={draft.delivery_mode}
                >
                  {!DELIVERY_MODES.some((mode) => mode === draft.delivery_mode) &&
                    draft.delivery_mode && (
                    <option value={draft.delivery_mode}>{draft.delivery_mode}</option>
                  )}
                  {DELIVERY_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Price (optional)
                <input
                  className={inputClass}
                  min="0"
                  max="99999999.99"
                  onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                  step="0.01"
                  type="number"
                  value={draft.price}
                />
              </label>
              <label className={labelClass}>
                Image URL (optional)
                <input
                  className={inputClass}
                  maxLength={2048}
                  onChange={(event) => setDraft({ ...draft, image_url: event.target.value })}
                  type="url"
                  value={draft.image_url}
                />
                {draft.image_url.trim() && (
                  <CourseImage
                    alt={`${draft.title || "Course"} image preview`}
                    className="mt-2 aspect-video w-full rounded-lg border border-slate-200 object-cover"
                    fallback={
                      <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                        Image preview unavailable. Check the URL.
                      </p>
                    }
                    src={draft.image_url.trim()}
                  />
                )}
              </label>
              <label className={labelClass}>
                Card theme
                <select
                  className={inputClass}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      card_theme: event.target.value as CourseTheme | "",
                    })
                  }
                  value={draft.card_theme}
                >
                  <option value="">Automatic rotation</option>
                  <option value="sky">Sky blue</option>
                  <option value="mint">Mint green</option>
                  <option value="amber">Warm amber</option>
                  <option value="violet">Soft violet</option>
                </select>
              </label>
              <label className={`${labelClass} sm:col-span-2 lg:col-span-3`}>
                Short description
                <textarea
                  className={inputClass}
                  aria-describedby="short-description-counter short-description-validation"
                  aria-invalid={shortDescriptionOverLimit && !shortDescriptionLegacy}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      short_description: Array.from(event.target.value)
                        .slice(0, 100)
                        .join(""),
                    })
                  }
                  required
                  rows={3}
                  value={draft.short_description}
                />
                <span
                  className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500"
                  id="short-description-counter"
                  aria-live="polite"
                >
                  <span>{shortDescriptionCharacters} / 100 characters</span>
                  {shortDescriptionLegacy && (
                    <span className="text-amber-700">
                      Saved description exceeds the new limit; shorten it to
                      update this field.
                    </span>
                  )}
                </span>
                <span
                  className={
                    shortDescriptionOverLimit && !shortDescriptionLegacy
                      ? "mt-1 block text-xs text-red-700"
                      : "sr-only"
                  }
                  id="short-description-validation"
                  role={
                    shortDescriptionOverLimit && !shortDescriptionLegacy
                      ? "alert"
                      : undefined
                  }
                >
                  Short description must be no more than 100 characters.
                </span>
              </label>
              <label className={`${labelClass} sm:col-span-2 lg:col-span-3`}>
                Full description
                <textarea
                  className={inputClass}
                  maxLength={10000}
                  onChange={(event) =>
                    setDraft({ ...draft, full_description: event.target.value })
                  }
                  required
                  rows={4}
                  value={draft.full_description}
                />
              </label>
              <details
                className="rounded-xl border border-slate-200 bg-slate-50 sm:col-span-2 lg:col-span-3"
                open={benefitsOverLimit || undefined}
              >
                <summary className="cursor-pointer px-4 py-3.5 text-sm font-semibold text-slate-800">
                  Course / Internship / Program Benefits
                </summary>
                <div className="border-t border-slate-200 p-4">
                  <label className={labelClass}>
                    Benefits (one per line)
                    <textarea
                      className={inputClass}
                      aria-describedby="benefits-counter benefits-validation"
                      aria-invalid={benefitsOverLimit && !benefitsLegacy}
                      maxLength={10000}
                      onChange={(event) =>
                        setDraft({ ...draft, benefits: event.target.value })
                      }
                      rows={6}
                      value={draft.benefits}
                    />
                    <span
                      className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500"
                      id="benefits-counter"
                      aria-live="polite"
                    >
                      <span>{benefitLines} / 5 lines</span>
                      {benefitsLegacy && (
                        <span className="text-amber-700">
                          Saved benefits exceed the new limit. Reduce them to
                          5 lines before changing this field.
                        </span>
                      )}
                    </span>
                    <span
                      className={
                        benefitsOverLimit && !benefitsLegacy
                          ? "mt-1 block text-xs text-red-700"
                          : "sr-only"
                      }
                      id="benefits-validation"
                      role={
                        benefitsOverLimit && !benefitsLegacy
                          ? "alert"
                          : undefined
                      }
                    >
                      Benefits must contain no more than 5 non-empty lines.
                    </span>
                  </label>
                </div>
              </details>
              <details className="rounded-xl border border-slate-200 bg-slate-50 sm:col-span-2 lg:col-span-3">
                <summary className="cursor-pointer px-4 py-3.5 text-sm font-semibold text-slate-800">
                  Certificates
                </summary>
                <div className="grid gap-3 border-t border-slate-200 p-4 sm:grid-cols-2">
                  {COURSE_CERTIFICATES.map((certificate) => (
                    <label
                      className="inline-flex items-start gap-2 text-sm text-slate-700"
                      key={certificate}
                    >
                      <input
                        checked={draft.certificates.includes(certificate)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            certificates: event.target.checked
                              ? [...draft.certificates, certificate]
                              : draft.certificates.filter(
                                  (item) => item !== certificate
                                ),
                          })
                        }
                        type="checkbox"
                      />
                      {certificate}
                    </label>
                  ))}
                </div>
              </details>
              <label className={labelClass}>
                Display order
                <input
                  className={inputClass}
                  max="100000"
                  min="0"
                  onChange={(event) =>
                    setDraft({ ...draft, display_order: Number(event.target.value) })
                  }
                  type="number"
                  value={draft.display_order}
                />
              </label>
              <div className="flex flex-wrap items-end gap-5 pb-2">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    checked={draft.is_published}
                    className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                    onChange={(event) =>
                      setDraft({ ...draft, is_published: event.target.checked })
                    }
                    type="checkbox"
                  />
                  Published
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    checked={draft.is_featured}
                    className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                    onChange={(event) =>
                      setDraft({ ...draft, is_featured: event.target.checked })
                    }
                    type="checkbox"
                  />
                  Featured
                </label>
              </div>
            </div>

            <footer className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <button
                className="min-h-10 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                disabled={saving}
                onClick={resetEditor}
                type="button"
              >
                Cancel
              </button>
              <button
                className="min-h-10 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? "Saving…" : editingId ? "Save Changes" : "Create Course"}
              </button>
            </footer>
          </form>
        </dialog>
      )}
    </section>
  );
}
