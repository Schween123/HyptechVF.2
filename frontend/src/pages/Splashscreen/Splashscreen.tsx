import { Helmet } from "react-helmet";
import { Text, Img } from "../../components"; 
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashscreenPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/ownerregistration'); // Adjust this path if needed
    }, 2000); // 2 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigate]);
return (
    <>
    <Helmet>
        <title>HypTech</title>
        <meta name="description" content="Web site created using create-react-app" /> 
    </Helmet>
    <div className="flex h-[1024px] w-full items-center justify-center bg-white-A700 bg-[url(/public/images/bg.png)] bg-cover bg-no-repeat py-[82px] md:h-auto md:py-5">
        <div className="container-xs mb-[197px] mt-[163px] flex justify-center px-[319px] md:p-5 md:px-5">
            <div className="relative h-[500px] w-full">
    <Img
        src="images/logo.png"
        alt="logoone"
        className="absolute bottom-0 left-0 right-0 top-0 m-auto h-[500px] w-[500px] object-cover"
    />
    <Text
        size="2xl"
        as="p"
        className="!text-with-shadow absolute bottom-[12.00px] left-0 right-0 m-auto w-max !font-bakbak-one tracking-[12.40px] !text-customgray ">
        Boarding House Name
    </Text>
    </div>
    </div>
    </div>
    </>
);
}

export default SplashscreenPage