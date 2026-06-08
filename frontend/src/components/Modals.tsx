'use client';

import React, { useEffect, useState } from 'react';
import { useToastContext, Toast, ToastType } from '@/context/ToastContext';

const icons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
};

const styles: Record<ToastType, { bar: string; icon: string; bg: string; border: string; title: string; text: string }> = {
  success: {
    bg: 'bg-white',
    border: 'border-l-[#22c55e]',
    bar: 'bg-[#22c55e]',
    icon: 'text-[#22c55e]',
    title: 'text-[#15803d]',
    text: 'text-gray-600',
  },
  error: {
    bg: 'bg-white',
    border: 'border-l-[#ef4444]',
    bar: 'bg-[#ef4444]',
    icon: 'text-[#ef4444]',
    title: 'text-[#b91c1c]',
    text: 'text-gray-600',
  },
  warning: {
    bg: 'bg-white',
    border: 'border-l-[#f59e0b]',
    bar: 'bg-[#f59e0b]',
    icon: 'text-[#f59e0b]',
    title: 'text-[#92400e]',
    text: 'text-gray-600',
  },
  info: {
    bg: 'bg-white',
    border: 'border-l-[#3b82f6]',
    bar: 'bg-[#3b82f6]',
    icon: 'text-[#3b82f6]',
    title: 'text-[#1e40af]',
    text: 'text-gray-600',
  },
};

const defaultTitles: Record<ToastType, string> = {
  success: 'Success',
  error: 'Something went wrong',
  warning: 'Heads up',
  info: 'Info',
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const s = styles[toast.type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / toast.duration) * 100));
    }, 50);
    return () => clearInterval(interval);
  }, [toast.duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(calc(100% + 24px))',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
      }}
      className={`relative w-[340px] max-w-[calc(100vw-32px)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 border-l-4 overflow-hidden ${s.bg} ${s.border}`}
    >
      {/* Progress bar */}
      <div
        className={`absolute top-0 left-0 h-0.5 ${s.bar} transition-all ease-linear`}
        style={{ width: `${progress}%`, transitionDuration: '50ms' }}
      />

      <div className="flex items-start gap-3 px-4 py-3.5 pr-10">
        <span className={`mt-0.5 ${s.icon}`}>{icons[toast.type]}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold font-outfit ${s.title}`}>
            {toast.title || defaultTitles[toast.type]}
          </p>
          <p className={`text-sm font-outfit mt-0.5 leading-snug ${s.text}`}>{toast.message}</p>
        </div>
      </div>

      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, remove } = useToastContext();
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={remove} />
        </div>
      ))}
    </div>
  );
};

// Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className={`bg-white rounded-lg shadow-xl ${sizeStyles[size]} w-full mx-4`}>
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && <div className="border-t border-gray-200 p-6">{footer}</div>}
      </div>
    </div>
  );
};

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push('...');
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        ← Previous
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-2 rounded-lg ${
              currentPage === page
                ? 'bg-primary text-white'
                : 'border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Next →
      </button>
    </div>
  );
};
