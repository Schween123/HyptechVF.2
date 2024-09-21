import { Button, Input, Text, Img } from "../../../components";
import React, { useState } from "react";
import axios from "axios";

interface GcashPaymentModalProps {
  tenantId: string;
  amountPayable: number;
  selectedMonths: { month: string; year: number }[]; // Array of selected months with month name and year
  onClose: () => void;
  onPaymentSuccess: (monthsPaidFor: number[]) => void;
}

const GcashPaymentModalPage: React.FC<GcashPaymentModalProps> = ({
  tenantId,
  amountPayable,
  selectedMonths,
  onClose,
  onPaymentSuccess,
}) => {
  const [referenceNumber, setReferenceNumber] = useState("");

  const handleConfirmPayment = async () => {
    try {
      // Get current date and time
      const transactionDate = new Date().toLocaleDateString("en-GB"); // Format as dd/mm/yyyy
      const transactionTime = new Date().toLocaleTimeString("en-GB"); // Format as HH:MM:SS

      // Prepare list of objects for months and years (normalized structure)
      const monthsPaidFor = selectedMonths.map((monthInfo) => ({
        month_paid_for: monthNamesToNumbers[monthInfo.month], // Map month name to number
        year_paid_for: monthInfo.year, // Year
      }));

      // Create transaction data
      const transactionData = {
        tenant: tenantId,
        transaction_date: transactionDate,
        transaction_time: transactionTime,
        amount_paid: amountPayable, // Total amount paid
        payment_method: "GCash",
        months: monthsPaidFor, // List of month and year objects
        reference_number: referenceNumber, // Save reference number
        status: "pending", // Set the status as pending
      };

      // POST request to save the transaction
      await axios.post(
        "http://localhost:8000/api/gcashtransactions/",
        transactionData
      );

      console.log("Data saved:", transactionData);

      // Notify parent component about success
      onPaymentSuccess(monthsPaidFor.map((month) => month.month_paid_for));
      onClose();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  // Function to map month names to numbers
  const monthNamesToNumbers: { [key: string]: number } = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="relative w-full max-w-[900px] px-[20px] md:px-5">
        <div className="rounded-[10px] bg-white p-5 sm:p-4 w-full">
          <Button onClick={onClose} className=" absolute top-2 right-2">
            <img
              src="/images/Exit.png"
              alt="Exit"
              className="h-[15px] w-[15px]"
            />
          </Button>
          <div className="flex flex-col sm:flex-col md:flex-row items-start justify-between gap-5 md:gap-10">
            {/* Left Side (Amount Payable and Selected Months) */}
            <div className="w-full md:w-[40%]">
              <Img
                src="/images/GCash_logo_blue.png"
                alt="Gcashlogo"
                className="h-[30px] w-auto object-contain sm:w-full ml-[-50px]"
              />

              <Text
                as="p"
                className="!font-montserrat text-[25px] font-medium text-customdarkgray2 sm:text-[19px] md:text-[20px] lg:text-[25px] pt-[20px]"
              >
                Amount Payable:
              </Text>
              <Text
                as="p"
                className="!font-montserrat text-[25px] font-medium !text-blue-900 sm:text-[19px] md:text-[20px] lg:text-[25px] pt-[20px]"
              >
                ₱ {amountPayable.toFixed(2)}
              </Text>
              <Text
                as="p"
                className="!font-montserrat text-[25px] font-medium text-customdarkgray2 sm:text-[19px] md:text-[20px] lg:text-[25px] pt-[20px]"
              >
                Selected Months:
              </Text>
              {selectedMonths.map((monthInfo, index) => (
                <Text key={index} size="xs" as="p">
                  {monthInfo.month} {monthInfo.year}
                </Text>
              ))}
            </div>

            {/* Divider */}
            <div className="h-auto w-[2px] ml-[-120px] bg-blue-900 self-stretch" />

            {/* Right Side (Send to and Reference Input) */}
            <div className="flex-1">
              <Text
                as="p"
                className="!font-montserrat text-[25px] font-medium text-customdarkgray2 sm:text-[19px] md:text-[20px] lg:text-[25px]"
              >
                Send to:
              </Text>
              <Text
                as="p"
                className="ml-[45px] mt-3 !font-montserrat text-[28px] font-medium sm:text-[20px] md:text-[25px] lg:text-[28px] font-bold text-black-900"
              >
                Owner's First Name
              </Text>
              <Text
                as="p"
                className="ml-[45px] mt-3 !font-montserrat text-[28px] font-medium sm:text-[20px] md:text-[25px] lg:text-[28px] font-bold text-black-900"
              >
                Owner's Contact Number
              </Text>

              <div className="mt-8">
                <Text
                  as="p"
                  className="!font-montserrat font-medium text-[28px] font-medium sm:text-[20px] md:text-[25px] lg:text-[28px] !text-blue-900"
                >
                  Reference Number:
                </Text>
                <Input
                  variant="fill"
                  shape="round"
                  type="number"
                  name="reference_number"
                  value={referenceNumber} // Bind state to input field
                  onChange={(e) => setReferenceNumber(e.target.value)} // Update state when user inputs a value
                  placeholder="Please Input Reference Number"
                  className=" w-full rounded-[20px] px-[21px] py-[10px] !font-montserrat bg-gray-300 text-[25px]"
                />
              </div>
              <div className="mt-12">
                <Button
                  color="blue_900"
                  size="xs"
                  shape="round"
                  onClick={handleConfirmPayment}
                  className=" w-full rounded-[37px] px-[35px] py-[15px] !font-montserrat font-medium bg-blue-900 text-white text-[25px] sm:text-[20px] md:text-[23px] lg:text-[25px] "
                >
                  Confirm Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GcashPaymentModalPage;
