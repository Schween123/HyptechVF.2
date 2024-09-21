import React from "react";
import { Button, Text } from "../../components";

interface PaymentMethodModalProps {
  onClose: () => void;
  onPaymentMethodSelect: (method: string) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  onClose,
  onPaymentMethodSelect,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <Text size="lg" as="p" className="font-open-sans mb-4">
          Select Payment Method
        </Text>
        <div className="flex justify-between">
          <Button
            onClick={() => onPaymentMethodSelect("GCASH")}
            className="mr-2"
          >
            GCash
          </Button>
          <Button
            onClick={() => onPaymentMethodSelect("CASH")}
            className="ml-2"
          >
            Cash
          </Button>
        </div>
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
