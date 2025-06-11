import React, { useEffect, useState } from "react";
import { fetchModulesUsers } from "../../api/modules.api";
import ModuleCard from "./ModuleCard";

const ModulesList = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const data = await fetchModulesUsers();
        if (data && Array.isArray(data.modules)) {
          setModules(data.modules);
        } else {
          throw new Error("Неверная структура данных");
        }
      } catch (error) {
        console.error("Ошибка при загрузке модулей:", error);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  if (loading) {
    return <p className="modules-page__loading">Загрузка...</p>;
  }

  if (modules.length === 0) {
    return <p className="modules-page__empty">Модули не найдены.</p>;
  }

  return (
    <div className="modules-page">
      <h2 className="modules-page__title">Список модулей</h2>
      <div className="modules-page__list">
        {modules.map((module) => (
          <ModuleCard key={module.code} module={module} />
        ))}
      </div>
    </div>
  );
};

export default ModulesList;
