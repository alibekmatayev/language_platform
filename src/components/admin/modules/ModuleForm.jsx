import React, { useState, useEffect } from "react";
import { createModule, updateModule } from "../../../api/modules.api";

const defaultModule = {
  code: "",
  title: "",
  description: "",
  goal: "",
  difficulty: "",
  unlock_requirements: {
    previous_module: "",
    min_xp: "",
  },
  reward: {
    xp: "",
    badge: "",
  },
  lessons: [],
};

const ModuleForm = ({ existingModule, onSuccess }) => {
  const [formData, setFormData] = useState(defaultModule);
  const isEdit = !!existingModule;
  const [selectedLessonCode, setSelectedLessonCode] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);

  useEffect(() => {
    if (isEdit) {
      console.log("Loaded module:", existingModule);
      setFormData(existingModule);
    }
  }, [existingModule]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("unlock_requirements.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        unlock_requirements: {
          ...prev.unlock_requirements,
          [field]: field === "min_xp" ? parseFloat(value) : value,
        },
      }));
    } else if (name.startsWith("reward.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        reward: {
          ...prev.reward,
          [field]: field === "xp" ? parseFloat(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        const { code, ...rest } = formData;
        await updateModule(code, rest);
        alert("Модуль обновлён");
      } else {
        await createModule(formData);
        alert("Модуль создан");
      }
      onSuccess?.();
    } catch (err) {
      alert("Ошибка при сохранении");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isEdit && (
        <input
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Код"
          required
        />
      )}
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Название"
        required
      />
      <input
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Описание"
      />
      <input
        name="goal"
        value={formData.goal}
        onChange={handleChange}
        placeholder="Цель"
      />
      <select
        name="difficulty"
        value={formData.difficulty}
        onChange={handleChange}
        className="module-select"
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <input
        name="unlock_requirements.previous_module"
        value={formData.unlock_requirements.previous_module}
        onChange={handleChange}
        placeholder="Код предыдущего модуля"
      />
      <input
        name="unlock_requirements.min_xp"
        value={formData.unlock_requirements.min_xp}
        onChange={handleChange}
        placeholder="Мин. XP"
      />
      <input
        name="reward.xp"
        value={formData.reward.xp}
        onChange={handleChange}
        placeholder="Награда XP"
      />
      <input
        name="reward.badge"
        value={formData.reward.badge}
        onChange={handleChange}
        placeholder="Значок"
      />
      <button className="button-add" type="submit">
        {isEdit ? "Обновить" : "Создать"}
      </button>
    </form>
  );
};

export default ModuleForm;
