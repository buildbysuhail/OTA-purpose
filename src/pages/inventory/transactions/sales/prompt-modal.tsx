import React from 'react';

interface ModalProps {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
}

export const PromptModal: React.FC<ModalProps> = ({
  title,
  description,
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="mb-6">{description}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);