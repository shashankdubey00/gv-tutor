import { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      confirmBg: 'bg-red-600 hover:bg-red-700',
      confirmText: 'text-white'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-500',
      confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
      confirmText: 'text-white'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
      confirmBg: 'bg-blue-600 hover:bg-blue-700',
      confirmText: 'text-white'
    }
  };

  const currentStyle = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-xl shadow-2xl border ${currentStyle.border} max-w-md w-full transform transition-all duration-300 scale-100`}>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full ${currentStyle.bg} flex items-center justify-center`}>
              {type === 'danger' ? (
                <Trash2 className={`w-6 h-6 ${currentStyle.icon}`} />
              ) : (
                <AlertTriangle className={`w-6 h-6 ${currentStyle.icon}`} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${currentStyle.confirmBg} ${currentStyle.confirmText} rounded-lg transition-colors duration-200 font-medium flex items-center gap-2`}
            >
              {type === 'danger' && <Trash2 className="w-4 h-4" />}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
