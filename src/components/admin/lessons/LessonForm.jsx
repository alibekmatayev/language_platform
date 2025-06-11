import React, { useEffect, useState } from "react";
import {
  getAllLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  addLessonToModule,
  deleteLessonFromModule,
} from "../../../api/lessons.api";

const LessonManager = () => {
  const [lessons, setLessons] = useState([]);
  const [form, setForm] = useState({ code: "", title: "", description: "" });
  const [editCode, setEditCode] = useState(null);
  const [moduleCode, setModuleCode] = useState("");
  const [lessonToAdd, setLessonToAdd] = useState("");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await getAllLessons();
      setLessons(res.data);
    } catch (err) {
      console.error("Ошибка загрузки уроков:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCode) {
        await updateLesson(editCode, form);
      } else {
        await createLesson(form);
      }
      setForm({ code: "", title: "", description: "" });
      setEditCode(null);
      fetchLessons();
    } catch (err) {
      console.error("Ошибка при сохранении урока:", err);
    }
  };

  const handleEdit = (lesson) => {
    setForm({
      code: lesson.code,
      title: lesson.title,
      description: lesson.description,
    });
    setEditCode(lesson.code);
  };

  const handleDelete = async (code) => {
    if (window.confirm("Удалить урок?")) {
      await deleteLesson(code);
      fetchLessons();
    }
  };

  const handleAddToModule = async () => {
    if (moduleCode && lessonToAdd) {
      try {
        await addLessonToModule(moduleCode, lessonToAdd);
        alert("Урок добавлен в модуль");
      } catch (err) {
        console.error("Ошибка при добавлении урока в модуль:", err);
      }
    }
  };

  const handleRemoveFromModule = async () => {
    if (moduleCode && lessonToAdd) {
      try {
        await deleteLessonFromModule(moduleCode, lessonToAdd);
        alert("Урок удалён из модуля");
      } catch (err) {
        console.error("Ошибка при удалении урока из модуля:", err);
      }
    }
  };

  return (
    <div className="lesson-manager-container">
      <h2>Управление уроками</h2>

      <form onSubmit={handleSubmit} className="lesson-form">
        <input
          type="text"
          placeholder="Код"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
          className="lesson-input"
          disabled={!!editCode}
          title={editCode ? "Код нельзя менять при редактировании" : ""}
        />
        <input
          type="text"
          placeholder="Название"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="lesson-input"
        />
        <input
          placeholder="Описание"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          className="lesson-input"
        />
        <button type="submit" className="button-add">
          {editCode ? "Сохранить изменения" : "Создать урок"}
        </button>
      </form>

      <h3>Список уроков</h3>
      <ul className="lessons-list">
        {lessons.map((lesson) => (
          <li key={lesson.code} className="lesson-item">
            <div>
              <strong>
                {lesson.code} {lesson.title}
              </strong>{" "}
              — {lesson.description}
            </div>
            <div className="lesson-actions">
              <button
                onClick={() => handleEdit(lesson)}
                className="button-check"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(lesson.code)}
                className="button-remove"
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>

      <hr className="divider" />

      <h3>Добавить / удалить урок в/из модуля</h3>
      <div className="module-lesson-actions">
        <input
          type="text"
          placeholder="Код модуля"
          value={moduleCode}
          onChange={(e) => setModuleCode(e.target.value)}
          className="lesson-input"
        />
        <input
          type="text"
          placeholder="Код урока"
          value={lessonToAdd}
          onChange={(e) => setLessonToAdd(e.target.value)}
          className="lesson-input"
        />
        <div className="module-buttons">
          <button onClick={handleAddToModule} className="button-add">
            Добавить
          </button>
          <button onClick={handleRemoveFromModule} className="button-remove">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonManager;
