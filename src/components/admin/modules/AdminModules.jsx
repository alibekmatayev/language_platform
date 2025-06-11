import React, { useEffect, useState } from "react";
import { fetchModules, deleteModule } from "../../../api/modules.api";
import ModuleForm from "./ModuleForm";

const AdminModules = () => {
  const [modules, setModules] = useState([]);
  const [editingModule, setEditingModule] = useState(null);

  const loadModules = async () => {
    try {
      const data = await fetchModules();
      setModules(data);
    } catch (err) {
      console.error("Ошибка при загрузке модулей");
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleDelete = async (code) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот модуль?")) {
      return;
    }
    try {
      await deleteModule(code);
      // Обновляем список модулей после удаления
      loadModules();
      // Если сейчас редактируем удалённый модуль, сбросим его
      if (editingModule?.code === code) {
        setEditingModule(null);
      }
    } catch (error) {
      console.error("Ошибка при удалении модуля:", error);
      alert("Не удалось удалить модуль. Попробуйте позже.");
    }
  };

  return (
    <div className="admin-modules-container">
      <h1>Управление модулями</h1>

      <div className="module-form-section">
        <h2>
          {editingModule ? "Редактировать модуль" : "Создать новый модуль"}
        </h2>
        <ModuleForm
          key={editingModule?.code || "new"}
          existingModule={editingModule}
          onSuccess={() => {
            setEditingModule(null);
            loadModules();
          }}
        />
      </div>

      <div className="modules-list-section">
        <h2>Список модулей</h2>
        <div>
          {modules.map((mod) => (
            <div className="module-card" key={mod.code}>
              <div className="module-info">
                <h3>{mod.title}</h3>
                <p>
                  <strong>Код:</strong> {mod.code}
                </p>
                <p>{mod.description}</p>
              </div>
              <button
                className="button-check"
                onClick={() => setEditingModule(mod)}
              >
                Редактировать
              </button>
              <button
                className="button-remove"
                onClick={() => handleDelete(mod.code)}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminModules;
