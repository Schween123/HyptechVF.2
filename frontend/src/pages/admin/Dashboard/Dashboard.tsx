import { Helmet } from "react-helmet";
import { Text } from "../../../components";
import Header from "../../../components/Header/Header.tsx";
import { useState, useEffect } from 'react';

// Define TypeScript interfaces for your API data
interface Tenant {
    id: number;
    assigned_room: number;
    due_date: string;  // Assume this represents the registration date
}

interface Transaction {
    tenant: number;
    month_paid_for: number;
    year_paid_for: number;
}

interface BoardingHouse {
    bhname: string;
}

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

const DashboardPage = () => {
    const [totalTenants, setTotalTenants] = useState(0);
    const [paidTenants, setPaidTenants] = useState(0);
    const [unpaidTenants, setUnpaidTenants] = useState(0);
    const [bhname, setBhname] = useState<string>("");

    useEffect(() => {
        fetchData();
        fetchBoardingHouseName();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch tenants
            const tenantsResponse = await fetch('http://localhost:8000/api/tenant/');
            const tenantsData: Tenant[] = await tenantsResponse.json();
    
            const totalTenantsCount = tenantsData.length || 0;
            setTotalTenants(totalTenantsCount);

            // Get current month and year
            const today = new Date();
            const currentMonth = today.getMonth() + 1; // Months are 0-based in JS
            const currentYear = today.getFullYear();

            // Filter out tenants registered this month
            const filteredTenants = tenantsData.filter(tenant => {
                const dueDate = new Date(tenant.due_date);
                const dueMonth = dueDate.getMonth() + 1;
                const dueYear = dueDate.getFullYear();

                // Exclude tenants whose due date is the current month
                return !(dueMonth === currentMonth && dueYear === currentYear);
            });

            // Fetch transactions
            const transactionsResponse = await fetch('http://localhost:8000/api/transactions/');
            const transactionsData: Transaction[] = await transactionsResponse.json();

            // Filter transactions for the current month
            const transactionsForCurrentMonth = transactionsData.filter((transaction) => 
                transaction.month_paid_for === currentMonth && transaction.year_paid_for === currentYear
            );

            // Get unique tenant IDs who paid
            const paidTenantIds = new Set(transactionsForCurrentMonth.map((transaction) => transaction.tenant));
            const paidTenantsCount = paidTenantIds.size;

            setPaidTenants(paidTenantsCount);

            // Calculate unpaid tenants excluding those registered this month
            const unpaidTenantsCount = filteredTenants.length - paidTenantsCount;
            setUnpaidTenants(unpaidTenantsCount);

        } catch (error) {
            console.error('Failed to fetch data:', error);
            // Set fallback values in case of an error
            setTotalTenants(0);
            setPaidTenants(0);
            setUnpaidTenants(0);
        }
    };

    const fetchBoardingHouseName = async () => {
        try {
            // Fetch rooms and then get boarding house details
            const tenantsResponse = await fetch('http://localhost:8000/api/tenant/');
            const tenantsData: Tenant[] = await tenantsResponse.json();
            if (tenantsData.length > 0) {
                const firstTenantRoomId = tenantsData[0].assigned_room;
    
                const roomResponse = await fetch(`http://localhost:8000/api/rooms/${firstTenantRoomId}/`);
                if (!roomResponse.ok) {
                    throw new Error(`Room not found: ${roomResponse.status}`);
                }
                const roomData = await roomResponse.json();
                const boardingHouseId = roomData.boarding_house;
    
                const boardingHouseResponse = await fetch(`http://localhost:8000/api/boardinghouse/${boardingHouseId}/`);
                if (!boardingHouseResponse.ok) {
                    throw new Error(`Boarding house not found: ${boardingHouseResponse.status}`);
                }
                const boardingHouseData: BoardingHouse = await boardingHouseResponse.json();
                setBhname(boardingHouseData.bhname || "");
            }
        } catch (error) {
            console.error('Failed to fetch boarding house name:', error);
        }
    };
    
    return (
        <>
            <Helmet>
                <title>HypTech</title>
                <meta name="description" content="Web site created using create-react-app" />
                <style>{globalStyles}</style>
            </Helmet>
            <div className="w-full ">
                <Header />
                    <div className="w-full max-w-[1306px] flex flex-col items-center">
                        <div className="self-stretch pl-10 mt-[30px]">
                            <Text size="4xl" as="p" className="!font-opensans text-3xl md:text-4xl lg:text-5xl">
                                 {bhname || "Loading"}
                            </Text>
                            <Text as="p" className="!font-opensans !text-blue_gray-700 text-lg md:text-xl lg:text-2xl">
                                DASHBOARD
                            </Text>
                        </div>
                        <div className="flex w-full justify-center mt-6">
                        <div className="flex justify-center gap-4 md:gap-10 lg:gap-20">
                            <div  className="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-customdarkgray3 p-4 md:p-3 lg:p-3 w-[90px] sm:w-[120px] md:w-[180px] lg:w-[287px] h-[90px] sm:h-[120px] md:h-[180px] lg:h-[270px]">
                            <Text
                                as="p"
                                size="3xl"
                                className="!font-open-sans text-white text-center text-md md:text-lg lg:text-3xl">
                                    BOARDERS
                                </Text>
                                <Text size="5xl" as="p" className="!font-open-sans !text-white">
                                    {totalTenants}
                                </Text>
                            </div>
                            <div  className="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-customdarkgray3 p-4 md:p-3 lg:p-3 w-[90px] sm:w-[120px] md:w-[180px] lg:w-[287px] h-[90px] sm:h-[120px] md:h-[180px] lg:h-[270px]">
                            <Text
                                as="p"
                                size="3xl"
                                className="!font-open-sans text-white text-center text-md md:text-lg lg:text-3xl">
                                    PAID FOR THE MONTH
                                </Text>
                                <Text size="5xl" as="p" className="!font-open-sans !text-white">
                                    {paidTenants} 
                                </Text>
                            </div>
                            <div  className="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-customdarkgray3 p-4 md:p-3 lg:p-3 w-[90px] sm:w-[120px] md:w-[180px] lg:w-[287px] h-[90px] sm:h-[120px] md:h-[180px] lg:h-[270px]">
                            <Text
                                as="p"
                                size="3xl"
                                className="!font-open-sans text-white text-center text-md md:text-lg lg:text-3xl">
                                    NOT YET PAID FOR THE MONTH
                                </Text>
                                <Text size="5xl" as="p" className="!font-open-sans !text-white">
                                    {unpaidTenants}
                                </Text>
                            </div>
                        </div>
                    
                        </div>
                    </div>
                </div>
            
        </>
    );
}

export default DashboardPage;
