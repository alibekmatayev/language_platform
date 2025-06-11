import React from "react";

const ModuleCard = ({ module }) => {
  return (
    <div className="modules-page__card">
      <h3 className="modules-page__card-title">{module.title}</h3>
      <p className="modules-page__card-description">{module.description}</p>
      <p className="modules-page__card-info">
        <strong>Сложность:</strong> {module.difficulty}
      </p>
      <p className="modules-page__card-info">
        <strong>Цель:</strong> {module.goal}
      </p>
      <div className="modules-page__card-footer">
        <button className="change-button">Подробнее</button>
      </div>
    </div>
  );
};

export default ModuleCard;
