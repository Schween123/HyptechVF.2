import { Helmet } from "react-helmet";
import { useNavigate, useLocation } from "react-router-dom";

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

export default function BoarderFaceRegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantId } = location.state || {};

  if (!tenantId) {
    return <div>Error: Tenant ID is missing.</div>; // Handle the case where tenantId is not available
  }

  const handleButtonClick = () => {
    navigate("/boarderregistrationsuccessful", { state: { tenantId } }); // Navigate to success page
  };
  return (
    <>
      <Helmet>
        <title>HypTech</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <style>{globalStyles}</style>
      </Helmet>
      <div className="flex w-full justify-center border border-solid border-white-A700  py-[77px] md:py-5">
        <div className="container-xs mt-[778px] flex justify-end px-[7px] md:p-5">
          <div className="self-end p-[50px]">
            <button
              onClick={handleButtonClick}
              className="bg-transparent border-none cursor-pointer"
            >
              <img src="public/images/nxtbtn2.png" alt="arrowleft" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
