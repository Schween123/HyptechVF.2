import { Helmet } from "react-helmet";
import { Text, Heading, Input, Button } from "../../../components";
import { useState, ChangeEvent, FormEvent } from "react";
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

export default function Login() {
  const [passcode, setPasscode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantId } = location.state as { tenantId: number };

  const handlePasscodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasscode(e.target.value);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/tenant/verify-passcode/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tenantId, passcode }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        navigate(`/boarderprofile/${data.tenantId}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid passcode");
      }
    } catch (error) {
      setError("An error occurred while trying to log in.");
    }
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
      <div className="w-full border border-solid border-white-A700 pb-[195px] md:pb-5">
        <div className="flex flex-col items-center">
          <div className="flex h-[630px] items-start self-stretch bg-[url(/images/BoarderProfilebg.svg)] bg-cover bg-no-repeat p-[50px] md:h-auto">
            <div className="mb-[243px] ml-[15px] flex w-[63%] flex-col items-start gap-[54px] md:ml-0 md:w-full sm:gap-[27px]">
              <div className="flex w-[44%] flex-col items-center self-end md:w-full">
                <div className="flex flex-wrap items-center justify-center gap-5 self-stretch">
                  <Heading
                    size="lg"
                    as="h2"
                    className="!font-semibold tracking-[5.00px] !text-white"
                  >
                    Hello, Good Day!
                  </Heading>
                </div>
                <Text
                  size="xl"
                  as="p"
                  className="!font-montserrat tracking-[3.50px] !text-gray-300"
                >
                  Login to your Profile
                </Text>
              </div>
            </div>
          </div>
          <div className="container relative mt-[-197px] px-[187px] md:p-5 md:px-5 max-w-[900px] h-[396px] mx-auto">
            <div className="flex flex-col items-center gap-[53px] border-[5px] border-solid border-gray-400 bg-gray-300 p-[39px] shadow-lg sm:gap-[26px] sm:p-5">
              <form onSubmit={handleLogin} className="self-stretch pt-4">
                <div className="flex flex-col gap-[21px]">
                  <div className="flex items-start justify-between gap-5 md:flex-col">
                    <div className="flex w-[55%] flex-col gap-[38px] md:w-full">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex w-full items-center gap-1">
                          <Input
                            variant="fill"
                            shape="round"
                            type="number"
                            name="passcode"
                            value={passcode}
                            onChange={handlePasscodeChange}
                            placeholder="Please enter passcode"
                            className="w-full rounded-[20px] px-[21px] py-[10px] !font-montserrat bg-customdarkgray4 text-[25px]"
                          />
                        </div>
                      </div>
                      {error && <p className="text-red-500">{error}</p>}
                      <Button
                        type="submit"
                        className="mt-4 w-full py-2 bg-customcyan text-white rounded-[20px] !font-montserrat"
                      >
                        Login
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
