import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Text, Heading, Img } from "../../../components";
import { useNavigate } from 'react-router-dom';
import Keyboard from '../../../components/Keyboard/Keyboard'; // Import the keyboard component

const globalStyles = `
  body, html {
    background-color: #C5C3C6;
    height: 100%;
    margin: 0;
  }
  #root, .app {
    height: 100%;
  }
`;

export default function OwnerRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerfirstname: '',
    ownerlastname: '',
    owneraddress: '',
    ownercontact: '',
  });

  const [errors, setErrors] = useState({
    ownerfirstname: false,
    ownerlastname: false,
    ownercontact: false
  });

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const inputRefs = useRef<any>({});

  // Auto capitalize first letter
  const capitalizeEachWord = (str: string) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const validateLastName = (name: string) => {
  const validSuffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const regex = /^[A-Za-z\s.]+$/; // Allow letters, spaces, and a period

  if (!regex.test(name)) {
    return 'Invalid Input! Only letters, periods, and spaces are allowed.';
  }
  // Check for multiple periods in the string
  if ((name.match(/\./g) || []).length > 1) {
    return 'Invalid Input! Only one period is allowed.';
  }
  // Ensure the last part is a valid suffix with a period, if a period is present
  const parts = name.split(' ');
  const lastPart = parts[parts.length - 1];

  if (lastPart.includes('.') && !validSuffixes.includes(lastPart)) {
    return 'Invalid suffix! Only Jr., Sr., or similar suffixes are allowed.';
  }

  return '';
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    switch (name) {
      case 'ownerfirstname':
        // Remove non-letter characters, numbers, allow only letters and space
        sanitizedValue = value.replace(/[^A-Za-z\s]/g, '');

        // Auto capitalize first letter
        const firstName = sanitizedValue
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        const firstNameError = sanitizedValue !== value; // Check if there was any invalid character entered
        setErrors(prev => ({ ...prev, ownerfirstname: firstNameError }));
        setFormData(prev => ({
          ...prev,
          [name]: firstName
        }));
        break;

      case 'ownerlastname':
        sanitizedValue = value.replace(/[^A-Za-z\sIVXLCDM\.]/g, '');

        sanitizedValue = sanitizedValue.replace(/\.{2,}/g, '.'); // Replace multiple periods with one

        const suffixes = ['Jr', 'Sr', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        const words = sanitizedValue.split(' ');

        const lastNameWithSuffix = words
          .map((word, index) => {
            // Auto capitalize suffix
            if (suffixes.includes(word.toUpperCase())) {
              return word.toUpperCase();
            }
            // If Jr or Sr capitalize the first letter and lowercase the rest
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(' ');

        const lastNameError = lastNameWithSuffix !== value || /\.\s?\./.test(lastNameWithSuffix); // Detect multiple periods
        setErrors(prev => ({ ...prev, ownerlastname: lastNameError }));
        setFormData(prev => ({
          ...prev,
          [name]: lastNameWithSuffix
        }));
        break;

      case 'owneraddress':
        // Capitalize the first letter of each word in the address
        sanitizedValue = capitalizeEachWord(value);
        setFormData(prev => ({
          ...prev,
          [name]: sanitizedValue
        }));
        break;

      case 'ownercontact':
        // Ensure number is exactly 11 digits and starts with 09
        const contactValue = value.replace(/\D/g, ''); // Remove non-digit characters
        const contactError = contactValue.length !== 11 || !contactValue.startsWith('09');
        setErrors(prev => ({ ...prev, ownercontact: contactError }));
        setFormData(prev => ({ ...prev, ownercontact: contactValue }));
        break;

      default:
        setFormData(prev => ({ ...prev, [name]: value }));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if there are errors
    const formErrors = {
      ownerfirstname: !/^[A-Za-z\s]+$/.test(formData.ownerfirstname),
      ownerlastname: validateLastName(formData.ownerlastname) !== '',
      ownercontact: formData.ownercontact.length !== 11 || !formData.ownercontact.startsWith('09')
    };

    setErrors(formErrors);

    // Prevent submission if there are errors
    if (Object.values(formErrors).includes(true)) {
      alert('Please fix the errors before submitting.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/owner/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ownerfirstname: formData.ownerfirstname,
          ownerlastname: formData.ownerlastname,
          owneraddress: formData.owneraddress,
          ownercontact: formData.ownercontact,
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        navigate('/bhregistration', { state: { ownerId: responseData.id } });
      } else {
        console.error('Failed to register owner');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputClick = (fieldName: string) => {
    setCurrentField(fieldName);
    setKeyboardVisible(true);
  };

   const handleInputFocus = (field: string) => {
    setCurrentField(field);
    setShowKeyboard(true);
    setTimeout(() => {
      inputRefs.current[field]?.focus();
    }, 0);
  };

  const handleKeyPress = (key: string) => {
  if (currentField) {
    setFormData(prev => {
      let newValue = prev[currentField];

      if (key === 'Backspace') {
        newValue = newValue.slice(0, -1);
      } else if (key === 'Enter') {
        // Move to the next input field or submit the form
        const inputFields = ['ownerfirstname', 'ownerlastname', 'owneraddress', 'ownercontact'];
        const currentIndex = inputFields.indexOf(currentField);

        if (currentIndex !== -1) {
          if (currentIndex < inputFields.length - 1) {
            // Move to the next input field
            const nextField = inputFields[currentIndex + 1];
            setCurrentField(nextField);
            const nextInput = inputRefs.current[nextField] as HTMLInputElement;
            if (nextInput) {
              nextInput.focus(); // Set focus on the next input field
            }
          } else {
            // Submit the form if it's the last field
            handleSubmit(new Event('submit') as React.FormEvent<HTMLFormElement>);
          }
        }
      } else {
        newValue += key;
      }

      // Call handleChange to apply validation and formatting
      const event = { target: { name: currentField, value: newValue } };
      handleChange(event as React.ChangeEvent<HTMLInputElement>);

      return {
        ...prev,
        [currentField]: newValue
      };
    });
  }
};

  const closeKeyboard = () => {
    setKeyboardVisible(false);
  };

  return (
    <>
      <Helmet>
        <title>HypTech</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <form onSubmit={handleSubmit}>
        <div className="w-full border border-solid border-cyan-800">
          <div className="flex h-[1024px] items-center justify-center bg-[url(/images/bg.png)] bg-cover bg-no-repeat py-[82px] md:h-auto md:py-5">
            <div className="container-xs mb-20 mt-[52px] flex justify-center px-[281px] md:p-5 md:px-5">
              <div className="flex w-[363px] md:w-[90%] flex-col items-center gap-[50px] rounded-[15px] bg-customgraybg-50 shadow-lg p-[30px] md:w-full sm:p-8">
                <div className="flex flex-col items-center gap-[46px] rounded-[15px] bg-gray-800_7f p-7 sm:p-5">
                  <Heading as="h1" className="text-shadow-ts mt-[10px] tracking-[9.00px] !text-white">
                    Owner's profile
                  </Heading>

                  <div className="flex md:flex-row flex-col items-start md:justify-between">
                    {/* Left section */}
                    <div className="mt-[33px] flex w-[33%] flex-col items-center gap-8 md:w-auto md:mr-36">
                      <Img
                        src="/images/face_holder.png"
                        alt="faceholder"
                        className=""
                      />
                      <div className="flex justify-center bg-blue_gray-100 p-4 w-[79%] md:w-auto">
                        <Img
                          src="/images/fingerprint_holder.png"
                          alt="fingerprint"
                          className=""
                        />
                      </div>
                    </div>

                    {/* Right section */}
                    <div className="flex flex-col items-end">
                      <div className="flex flex-col items-start self-stretch">
                        <Text size="md" as="p" className="!font-open-sans tracking-[2.50px] !text-white">
                          First Name
                        </Text>
                        <input
                          name="ownerfirstname"
                          value={formData.ownerfirstname}
                          onChange={handleChange}
                          onClick={() => handleInputClick('ownerfirstname')}
                          ref={(el) => inputRefs.current['ownerfirstname'] = el}
                          className={`!text-white w-[400px] border-b-2 border-customColor1 !text-xl pb-[-25px] pt-[25px] mt-[-17px] ${errors.ownerfirstname ? 'border-red-500' : ''}`}
                        />
                      </div>

                      <div className="mt-[58px] flex flex-col items-start self-stretch">
                        <Text size="md" as="p" className="!font-open-sans tracking-[2.50px] !text-white">
                          Last Name
                        </Text>
                        <input
                          name="ownerlastname"
                          value={formData.ownerlastname}
                          onChange={handleChange}
                          onClick={() => handleInputClick('ownerlastname')}
                          ref={(el) => inputRefs.current['ownerlastname'] = el}
                          className={`!text-white w-[400px] border-b-2 border-customColor1 !text-xl pb-[-25px] pt-[25px] mt-[-17px] ${errors.ownerlastname ? 'border-red-500' : ''}`}
                        />
                      </div>

                      <div className="mt-[58px] flex flex-col items-start self-stretch">
                        <Text size="md" as="p" className="!font-open-sans tracking-[2.50px] !text-white">
                          Address
                        </Text>
                        <input
                          name="owneraddress"
                          value={formData.owneraddress}
                          onChange={handleChange}
                          onClick={() => handleInputClick('owneraddress')}
                          ref={(el) => inputRefs.current['owneraddress'] = el}
                          className="!text-white w-[400px] border-b-2 border-customColor1 !text-xl pb-[-25px] pt-[25px] mt-[-17px]"
                        />
                      </div>

                      <div className="mt-[58px] flex flex-col items-start self-stretch">
                        <Text size="md" as="p" className="!font-open-sans tracking-[2.50px] !text-white">
                          Contact Number
                        </Text>
                        <input
                          name="ownercontact"
                          value={formData.ownercontact}
                          onChange={handleChange}
                          onClick={() => handleInputClick('ownercontact')}
                          ref={(el) => inputRefs.current['ownercontact'] = el}
                          className={`!text-white w-[400px] border-b-2 border-customColor1 !text-xl pb-[-25px] pt-[25px] mt-[-17px] ${errors.ownercontact ? 'border-red-500' : ''}`}
                          maxLength={11}
                          placeholder="09XXXXXXXXX"
                        />
                      </div>
                      <div className="mt-[30px] flex justify-end w-[54%] md:mr-0">
                        <button type="submit" className="bg-transparent border-none cursor-pointer">
                          <img src="/images/NxtBtn.png" alt="arrowleft" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {keyboardVisible && (
  <div className="keyboard-container">
    <Keyboard onKeyPress={handleKeyPress} onClose={closeKeyboard} />
  </div>
)}
    </>
  );
}


