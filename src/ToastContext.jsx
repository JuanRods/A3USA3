// src/ToastContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider />");
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const [confirmConfig, setConfirmConfig] = useState({
    open: false,
    message: "",
    type: "warning",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    onConfirm: null,
  });

  function showToast(message, type = "info", duration = 3000) {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, leaving: false };
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => startClose(id), duration);
  }

  function startClose(id) {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }

  function showConfirmToast(message, onConfirm, options = {}) {
    setConfirmConfig({
      open: true,
      message,
      onConfirm,
      type: options.type || "warning",
      confirmText: options.confirmText || "Confirmar",
      cancelText: options.cancelText || "Cancelar",
    });
  }

  function handleConfirm() {
    confirmConfig.onConfirm?.();
    setConfirmConfig((prev) => ({ ...prev, open: false, onConfirm: null }));
  }

  function handleCancel() {
    setConfirmConfig((prev) => ({ ...prev, open: false, onConfirm: null }));
  }

  const value = { showToast, showConfirmToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={startClose} />
      <ConfirmToast
        config={confirmConfig}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ToastContext.Provider>
  );
}

/* ============================================
   TOAST NORMAL
============================================ */
function ToastContainer({ toasts, onClose }) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/toast.css";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  function iconFor(type) {
    if (type === "success") return <i className="fa-solid fa-check-circle" />;
    if (type === "error") return <i className="fa-solid fa-circle-xmark" />;
    if (type === "warning") return <i className="fa-solid fa-triangle-exclamation" />;
    return <i className="fa-solid fa-circle-info" />;
  }

  return (
    <div className="ts-toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`ts-toast ${t.type} ${t.leaving ? "leaving" : ""}`}
        >
          <div className="ts-toast-icon">{iconFor(t.type)}</div>
          <div className="ts-toast-message">{t.message}</div>

          <button
            className="ts-toast-close"
            onClick={() => onClose(t.id)}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ============================================
   CONFIRM MODAL
============================================ */
function ConfirmToast({ config, onConfirm, onCancel }) {
  if (!config.open) return null;

  function iconFor(type) {
    if (type === "success") return <i className="fa-solid fa-check-circle" />;
    if (type === "error") return <i className="fa-solid fa-circle-xmark" />;
    if (type === "warning") return <i className="fa-solid fa-triangle-exclamation" />;
    return <i className="fa-solid fa-circle-info" />;
  }

  return (
    <div className="ts-confirm-overlay">
      <div className="ts-confirm-modal">

        {/* ÍCONE CENTRALIZADO AQUI */}
        <div className="ts-confirm-icon">
          {iconFor(config.type)}
        </div>

        <p
          className="ts-confirm-message"
          dangerouslySetInnerHTML={{ __html: config.message }}
        />

        <div className="ts-confirm-actions">
          <button
            type="button"
            className="ts-confirm-btn ts-confirm-btn-cancel"
            onClick={onCancel}
          >
            {config.cancelText}
          </button>

          <button
            type="button"
            className="ts-confirm-btn ts-confirm-btn-confirm"
            onClick={onConfirm}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
