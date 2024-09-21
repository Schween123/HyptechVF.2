import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Text, Heading } from "../../../components";
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

export default function BoarderRegistration1Page() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    boarderfirstname: '',
    boardermiddlename: '',
    boarderlastname: '',
    boardergender: '',
    boarderage: '',
    boarderaddress: '',
    boardercontactnumber: '',
    boardercourse_profession: '',
    boarderinstitution: '',
    boarding_house: 1
  });

  const [errors, setErrors] = useState({});
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const inputRefs = useRef<any>({});

  // Handle virtual keyboard keypress
  const handleKeyPress = (key: string) => {
  if (key === 'Enter') {
    handleEnterKey();
  } else if (key === 'Backspace') {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [currentField]: prevFormData[currentField].slice(0, -1)
    }));
  } else {
    let updatedValue = formData[currentField] + key;

    // Apply capitalization for 'boarderaddress' field
    if (currentField === 'boarderaddress') {
      updatedValue = capitalize(updatedValue);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [currentField]: updatedValue
    }));
  }
};

// Function to capitalize the first letter of each word
const capitalize = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};


  // Function to open the keyboard for the specific input field
  const handleInputFocus = (field: string) => {
    setCurrentField(field);
    setShowKeyboard(true);
    setTimeout(() => {
      inputRefs.current[field]?.focus();
    }, 0); // Ensure the focus is applied after setting current field
  };

  // Function to close the virtual keyboard
  const handleCloseKeyboard = () => {
    setShowKeyboard(false);
  };


const validateForm = () => {
  let formErrors: any = {};


  const textOnlyPattern = /^[a-zA-Z\s]*$/;
  const nameWithSuffixPattern = /^[a-zA-Z\s.]+$/;
  const phonePattern = /^09\d{9}$/;


  if (!formData.boarderfirstname.trim() || !textOnlyPattern.test(formData.boarderfirstname)) {
    formErrors.boarderfirstname = true;
  }

  // Middle Initial Validation: Should allow only a single letter followed by an optional period (like "A." or "B")
  const middleInitial = formData.boardermiddlename.trim();
  if (middleInitial) {
    // Ensure it's either a single letter or a single letter followed by a period (e.g., "A" or "A.")
    const validMiddleInitialPattern = /^[a-zA-Z]\.?$/;

    if (!validMiddleInitialPattern.test(middleInitial)) {
      formErrors.boardermiddlename = true;
    }
  }
  if (!formData.boarderlastname.trim() || !nameWithSuffixPattern.test(formData.boarderlastname)) {
    formErrors.boarderlastname = true;
  }
  if (!formData.boardergender.trim() || !textOnlyPattern.test(formData.boardergender)) {
    formErrors.boardergender = true;
  }
  if (!formData.boarderage.trim() || isNaN(Number(formData.boarderage))) {
    formErrors.boarderage = true;
  }
  if (!formData.boarderaddress.trim()) {
    formErrors.boarderaddress = true;
  }
  if (!formData.boardercontactnumber.trim() || !phonePattern.test(formData.boardercontactnumber)) {
    formErrors.boardercontactnumber = true;
  }
  if (!formData.boardercourse_profession.trim() || !textOnlyPattern.test(formData.boardercourse_profession)) {
    formErrors.boardercourse_profession = true;
  }
  if (!formData.boarderinstitution.trim() || !textOnlyPattern.test(formData.boarderinstitution)) {
    formErrors.boarderinstitution = true;
  }

  setErrors(formErrors);

  // Return true if there are no errors
  return Object.keys(formErrors).length === 0;
};

const handleInputChange = (field: string, value: string) => {
  const capitalize = (str: string) => {
    // Capitalize the first letter of each word
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (field === 'boardermiddlename') {
    const middleInitialPattern = /^[A-Z]\.?$/;

    if (middleInitialPattern.test(value) || value === '') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: value.toUpperCase(), // Ensure uppercase
      }));
    }
    return;
  }
  if (field === 'boarderaddress') {
    value = capitalize(value);
  }
  setFormData((prevFormData) => ({
    ...prevFormData,
    [field]: value,
  }));
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Validate form before submission
  if (!validateForm()) return;  // Stop submission if validation fails

  // Create a new object with capitalized fields before submission
  const capitalizedFormData = {
    ...formData,
    boarderfirstname: capitalize(formData.boarderfirstname),
    boardermiddlename: formData.boardermiddlename.toUpperCase(), // Middle initial is always uppercase
    boarderlastname: capitalize(formData.boarderlastname),
    boardergender: capitalize(formData.boardergender),
    boarderaddress: capitalize(formData.boarderaddress),
    boardercourse_profession: capitalize(formData.boardercourse_profession),
    boarderinstitution: capitalize(formData.boarderinstitution),
  };

  try {
    const response = await fetch('http://127.0.0.1:8000/api/tenant/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(capitalizedFormData) // Send capitalized form data
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Tenant data saved successfully:', responseData);
      navigate('/guardianregistration', { state: { tenantId: responseData.id } });
    } else {
      const errorData = await response.json();
      console.error('Failed to save tenant data:', errorData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


  // Handle Enter key to navigate between inputs
  const handleEnterKey = () => {
    const fields = [
      'boarderfirstname',
      'boardermiddlename',
      'boarderlastname',
      'boardergender',
      'boarderage',
      'boarderaddress',
      'boardercontactnumber',
      'boardercourse_profession',
      'boarderinstitution'
    ];

    const currentIndex = fields.indexOf(currentField);
    if (currentIndex < fields.length - 1) {
      handleInputFocus(fields[currentIndex + 1]);
    } else {
      // If it's the last field, submit the form
      handleSubmit(new Event('submit') as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <>
      <Helmet>
        <title>HypTech</title>
        <meta name="description" content="Web site created using create-react-app" />
        <style>{globalStyles}</style>
      </Helmet>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full justify-center border border-solid border-white-A700 py-[50px] md:py-2">
          <div className="container-xs mb-[23px] flex justify-center md:p-5">
            <div className="flex w-full flex-col gap-[142px] md:gap-[106px] sm:gap-[71px]">
              <div className="flex flex-col items-center gap-2 px-[30px] sm:px-5">
                <Heading as="h1" className="!font-montserrat tracking-[9.00px] ! text-black-900">
                  WELCOME TO BOARDING HOUSE NAME
                </Heading>
                <div className="h-px self-stretch bg-cyan-800" />
              </div>
              <div className="flex w-full justify-between gap-[120px] mt-[-50px]">
                <div className="flex w-[48%] flex-col items-start">
                  <div className="ml-[33px] flex w-full flex-col items-start md:ml-0">
                    <Text size="md" as="p" className="relative z-[1] !font-open-sans tracking-[2.50px]">
                      Name
                    </Text>
                    <div className="relative mt-[-2px] flex gap-[17px] self-stretch">
                      <input
                        name="boarderfirstname"
                        value={formData.boarderfirstname}
                        onClick={() => handleInputFocus('boarderfirstname')}  // Open keyboard
                        ref={(el) => inputRefs.current['boarderfirstname'] = el} // Set ref for focus
                        className={`w-[220px] border-b-2 ${errors.boarderfirstname ? 'border-red-500' : 'border-customColor1'} pb-[-30px] pt-[30px] !text-xl mt-[-10px] capitalize`} // Auto capitalize
                      />
                      <input
                        name="boardermiddlename"
                        value={formData.boardermiddlename}
                        onClick={() => handleInputFocus('boardermiddlename')}
                        onChange={(e) => handleInputChange('boardermiddlename', e.target.value)}
                        ref={(el) => inputRefs.current['boardermiddlename'] = el}
                        className={`w-[50px] border-b-2 ${errors.boardermiddlename ? 'border-red-500' : 'border-customColor1'} pb-[-30px] pt-[30px] !text-xl mt-[-10px] uppercase`} // Restrict to uppercase format like "P."
                      />
                      <input
                        name="boarderlastname"
                        value={formData.boarderlastname}
                        onClick={() => handleInputFocus('boarderlastname')}
                        onChange={(e) => handleInputChange('boarderlastname', e.target.value)}
                        ref={(el) => inputRefs.current['boarderlastname'] = el}
                        className={`w-[220px] border-b-2 ${errors.boarderlastname ? 'border-red-500' : 'border-customColor1'} pb-[-30px] pt-[30px] !text-xl mt-[-10px] capitalize`} // Auto capitalize and allow suffix like "Jr." or "III"
                      />
                    </div>
                  </div>

                  {/* Gender and Age Section */}
                  <div className="mt-5 flex flex-col md:flex-row items-start justify-between gap-[30px]">
                    {/* Gender Section */}
                    <div className="flex flex-col items-start">
                      <Text size="md" as="p" className="!font-open-sans tracking-[2.50px] mb-1">
                        Gender
                      </Text>
                      <div className="flex items-center gap-2">
                        <input
                          name="boardergender"
                          value={formData.boardergender}
                          onClick={() => handleInputFocus('boardergender')}  // Open keyboard
                          ref={(el) => inputRefs.current['boardergender'] = el}
                          className={`relative w-[220px] border-b-2 ${errors.boardergender ? 'border-red-500' : 'border-customColor1'} pb-[-30px] pt-[30px] !text-xl mt-[-10px] capitalize`} // Auto capitalize
                        />
                      </div>
                    </div>
                    {/* Age Section */}
                    <div className="flex flex-col items-start">
                      <Text size="md" as="p" className="!font-open-sans tracking-[2.50px] mb-1">
                        Age
                      </Text>
                      <div className="flex items-center gap-2">
                        <input
                          name="boarderage"
                          value={formData.boarderage}
                          onClick={() => handleInputFocus('boarderage')}  // Open keyboard
                          ref={(el) => inputRefs.current['boarderage'] = el}
                          className={`relative w-[220px] border-b-2 ${errors.boarderage ? 'border-red-500' : 'border-customColor1'} pb-[-30px] pt-[30px] !text-xl mt-[-10px]`}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Address Section */}
                  <div className="mt-5">
                    <Text size="md" as="p" className="!font-open-sans tracking-[2.50px]">
                      Address
                    </Text>
                    <input
                      name="boarderaddress"
                      value={formData.boarderaddress}
                      onClick={() => handleInputFocus('boarderaddress')}  // Open keyboard
                      onChange={(e) => handleInputChange('boarderaddress', e.target.value)}
                      ref={(el) => inputRefs.current['boarderaddress'] = el} // Set ref for focus
                      className={`w-[546px] border-b-2 ${errors.boarderaddress ? 'border-red-500' : 'border-customColor1'} pb-[-30px] pt-[30px] !text-xl mt-[-10px]`}
                    />
                  </div>
                </div>
                {/* Right Side */}
                <div className="mr-[33px] flex w-[48%] flex-col items-start md:mr-0 md:w-full mt-[-2px]">
                  <Text size="md" as="p" className="!font-open-sans tracking-[2.50px]">
                    Contact Number
                  </Text>
                  <input
                    name="boardercontactnumber"
                    value={formData.boardercontactnumber}
                    onClick={() => handleInputFocus('boardercontactnumber')}  // Open keyboard
                    placeholder="09XXXXXXXXX"
                    onChange={(e) => handleInputChange('boardercontactnumber', e.target.value)}
                    ref={(el) => inputRefs.current['boardercontactnumber'] = el}
                    className={`w-[546px] border-b-2 ${errors.boardercontactnumber ? 'border-red-500' : 'border-customColor1'} pb-[-30px] pt-[30px] !text-xl mt-[-10px]`}
                  />
                  <Text size="md" as="p" className="mt-5 !font-open-sans tracking-[2.50px]">
                    Course/Profession
                  </Text>
                  <input
                    name="boardercourse_profession"
                    value={formData.boardercourse_profession}
                    onClick={() => handleInputFocus('boardercourse_profession')}  // Open keyboard
                    ref={(el) => inputRefs.current['boardercourse_profession'] = el}
                    className={`w-[546px] border-b-2 ${errors.boardercourse_profession ? 'border-red-500' : 'border-customColor1'} pb-[-30px] pt-[30px] !text-xl mt-[-10px] capitalize`} // Auto capitalize
                  />
                  <Text size="md" as="p" className="mt-5 !font-open-sans tracking-[2.50px]">
                    School/Institution
                  </Text>
                  <input
                    name="boarderinstitution"
                    value={formData.boarderinstitution}
                    onClick={() => handleInputFocus('boarderinstitution')}  // Open keyboard
                    ref={(el) => inputRefs.current['boarderinstitution'] = el}
                    className={`w-[546px] border-b-2 ${errors.boarderinstitution ? 'border-red-500' : 'border-customColor1'} pb-[-30px] pt-[30px] !text-xl mt-[-10px] capitalize`} // Auto capitalize
                  />
                  <div className="self-end p-[50px]">
                    <button type="submit" className="bg-transparent border-none cursor-pointer">
                      <img src="/images/nxtbtn2.png" alt="arrowleft" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {showKeyboard && (
        <Keyboard
          onKeyPress={handleKeyPress}
          onClose={handleCloseKeyboard}
        />
      )}
    </>
  );
}
