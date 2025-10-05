"use client";
import { HTMLAttributes, ReactNode, useEffect, useRef } from "react";
import ModalPortal from "./ModalPortal";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isOpen: boolean;
  title?: string;
  icon?: ReactNode;
  onClose?: (e?: React.MouseEvent) => void;
  hideCloseIcon?: boolean;
  customClass?: string;
}

const Modal = ({
  children,
  isOpen,
  title,
  icon,
  onClose,
  hideCloseIcon = false,
  customClass = "",
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div
          ref={modalRef}
          className={`bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 ${customClass}`}
        >
          {/* Header */}
          {(title || icon || !hideCloseIcon) && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {title && <h3 className="text-lg font-semibold">{title}</h3>}
              </div>
              {!hideCloseIcon && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  &times;
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div>{children}</div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default Modal;
