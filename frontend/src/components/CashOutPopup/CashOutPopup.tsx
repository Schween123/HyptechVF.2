import React from 'react';

interface CashOutPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CashOutPopup: React.FC<CashOutPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-lg p-2">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Fingerprint Verification</h2>
        <p>Please place your finger on the scanner to proceed with the cash out.</p>
        <div className="mt-4">
          <img src="public/images/fingerprint_holder.png" alt="Fingerprint Scanner" className="mx-auto h-20 w-20"/>
        </div>
      </div>
    </div>
  );
};

export default CashOutPopup;
