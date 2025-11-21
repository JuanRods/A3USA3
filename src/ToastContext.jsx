// src/ToastContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider />");
  }
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = "info", duration = 3000) {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, leaving: false };
    setToasts((prev) => [...prev, toast]);

    // inicia auto-close
    setTimeout(() => startClose(id), duration);
  }

  function startClose(id) {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250); // tempo da animação ts-toast-exit
  }

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={startClose} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onClose }) {
  // carrega o CSS dos toasts sempre
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/toast.css";
    document.head.appendChild(link);
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  function iconFor(type) {
    if (type === "success") return <i className="fa-solid fa-check-circle" />;
    if (type === "error") return <i className="fa-solid fa-circle-xmark" />;
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
            aria-label="Fechar notificação"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      ))}
    </div>
  );
}
