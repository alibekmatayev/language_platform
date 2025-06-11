import React from "react";

export default function ExitModal({ isOpen, onCancel, onExit }) {
  return (
    <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <p className="modal-text">
          Если вы хотите выйти сейчас, то прогресс не сохранится.
        </p>
        <div className="center">
          <button
            style={{ marginBottom: "0.5rem" }}
            className="button-add"
            onClick={onCancel}
          >
            Продолжить урок
          </button>
          <button className="button-remove" onClick={onExit}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
