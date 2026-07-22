// import { useState } from "react";

// const connectedMetaPage = {
//     pageName: "Vertical Living Official",
//     pageId: "109845763829001",
//     status: "Connected",
//     lastSync: "2 minutes ago",
// };


// const dummyLeads = [
//     {
//         id: 1,
//         name: "Rahul Sharma",
//         email: "rahul@gmail.com",
//         phone: "+91 9876543210",
//         campaign: "Modular Kitchen Campaign",
//         date: "26 June 2026",
//     },
//     {
//         id: 2,
//         name: "Priya Kumar",
//         email: "priya@gmail.com",
//         phone: "+91 9876543211",
//         campaign: "Bedroom Interior Campaign",
//         date: "26 June 2026",
//     },
//     {
//         id: 3,
//         name: "Arun Raj",
//         email: "arun@gmail.com",
//         phone: "+91 9876543212",
//         campaign: "Living Room Campaign",
//         date: "25 June 2026",
//     },
// ];


// const dummyCampaigns = [
//     {
//         campaign: "Modular Kitchen Campaign",
//         spend: "₹500",
//         impressions: "10,500",
//         clicks: "820",
//         leads: 120,
//         cpl: "₹4.16",
//     },
//     {
//         campaign: "Bedroom Interior Campaign",
//         spend: "₹350",
//         impressions: "8,200",
//         clicks: "600",
//         leads: 80,
//         cpl: "₹4.37",
//     },
// ];


// export default function MetaReviewDemoDashboard() {

//     const [activeTab, setActiveTab] = useState<
//         "leads" | "insights"
//     >("leads");


//     const [_lastUpdated, setLastUpdated] = useState(
//         "Just now"
//     );


//     const handleRefresh = () => {
//         setLastUpdated("Updated just now");
//     };


//     return (
//         <div className="min-h-screen bg-gray-100 p-8">

//             {/* Header */}

//             <div className="mb-6">

//                 <h1 className="text-3xl font-bold">
//                     Vertical Living
//                 </h1>

//                 <p className="text-gray-500">
//                     Meta Ads Lead Intelligence Dashboard
//                 </p>

//             </div>



//             {/* Connected Meta Page */}

//             <div className="bg-white rounded-xl shadow p-6 mb-6">

//                 <div className="flex justify-between">

//                     <div>

//                         <h2 className="text-lg font-semibold">
//                             Connected Meta Asset
//                         </h2>

//                         <p className="mt-3">
//                             Facebook Page:
//                             <span className="font-semibold ml-2">
//                                 {connectedMetaPage.pageName}
//                             </span>
//                         </p>


//                         <p>
//                             Page ID:
//                             <span className="ml-2">
//                                 {connectedMetaPage.pageId}
//                             </span>
//                         </p>

//                     </div>


//                     <div className="text-right">

//                         <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
//                             {connectedMetaPage.status}
//                         </span>

//                         <p className="text-sm text-gray-500 mt-3">
//                             Last Sync:
//                             {connectedMetaPage.lastSync}
//                         </p>

//                     </div>

//                 </div>

//             </div>




//             {/* Tabs */}

//             <div className="flex gap-4 mb-6">


//                 <button
//                     onClick={() => setActiveTab("leads")}
//                     className={`px-5 py-2 rounded-lg ${activeTab === "leads"
//                             ? "bg-black text-white"
//                             : "bg-white"
//                         }`}
//                 >
//                     Leads
//                 </button>


//                 <button
//                     onClick={() => setActiveTab("insights")}
//                     className={`px-5 py-2 rounded-lg ${activeTab === "insights"
//                             ? "bg-black text-white"
//                             : "bg-white"
//                         }`}
//                 >
//                     Ads Insights
//                 </button>


//             </div>




//             {/* Leads */}

//             {
//                 activeTab === "leads" && (

//                     <div className="bg-white rounded-xl shadow p-6">

//                         <div className="flex justify-between mb-5">

//                             <h2 className="text-xl font-semibold">
//                                 Meta Lead Ads
//                             </h2>


//                             <button
//                                 onClick={handleRefresh}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//                             >
//                                 Refresh Leads
//                             </button>

//                         </div>


//                         <p className="text-sm text-gray-500 mb-4">
//                             leads_retrieval permission demonstration
//                         </p>



//                         <table className="w-full">

//                             <thead>

//                                 <tr className="border-b">

//                                     <th className="text-left p-3">
//                                         Name
//                                     </th>

//                                     <th className="text-left p-3">
//                                         Phone
//                                     </th>

//                                     <th className="text-left p-3">
//                                         Campaign
//                                     </th>

//                                     <th className="text-left p-3">
//                                         Date
//                                     </th>


//                                 </tr>

//                             </thead>


//                             <tbody>

//                                 {
//                                     dummyLeads.map(
//                                         lead => (

//                                             <tr
//                                                 key={lead.id}
//                                                 className="border-b"
//                                             >

//                                                 <td className="p-3">
//                                                     {lead.name}
//                                                 </td>

//                                                 <td className="p-3">
//                                                     {lead.phone}
//                                                 </td>

//                                                 <td className="p-3">
//                                                     {lead.campaign}
//                                                 </td>


//                                                 <td className="p-3">
//                                                     {lead.date}
//                                                 </td>


//                                             </tr>

//                                         )
//                                     )
//                                 }


//                             </tbody>


//                         </table>


//                     </div>

//                 )
//             }




//             {/* Insights */}

//             {
//                 activeTab === "insights" && (

//                     <div className="space-y-6">


//                         <div className="grid grid-cols-4 gap-5">


//                             {
//                                 [
//                                     ["Spend", "$850"],
//                                     ["Impressions", "18,700"],
//                                     ["Clicks", "1,420"],
//                                     ["Leads", "200"]

//                                 ].map(
//                                     item => (

//                                         <div
//                                             className="bg-white rounded-xl shadow p-5"
//                                             key={item[0]}
//                                         >

//                                             <p className="text-gray-500">
//                                                 {item[0]}
//                                             </p>

//                                             <h2 className="text-2xl font-bold">
//                                                 {item[1]}
//                                             </h2>

//                                         </div>

//                                     )
//                                 )
//                             }


//                         </div>



//                         <div className="bg-white rounded-xl shadow p-6">


//                             <h2 className="text-xl font-semibold mb-5">
//                                 Campaign Performance
//                             </h2>


//                             <table className="w-full">

//                                 <thead>

//                                     <tr className="border-b">

//                                         <th className="p-3 text-left">
//                                             Campaign
//                                         </th>

//                                         <th className="p-3">
//                                             Spend
//                                         </th>

//                                         <th className="p-3">
//                                             Leads
//                                         </th>

//                                         <th className="p-3">
//                                             CPL
//                                         </th>

//                                     </tr>

//                                 </thead>


//                                 <tbody>

//                                     {
//                                         dummyCampaigns.map(
//                                             c => (

//                                                 <tr
//                                                     className="border-b"
//                                                     key={c.campaign}
//                                                 >

//                                                     <td className="p-3 ">
//                                                         {c.campaign}
//                                                     </td>

//                                                     <td className="p-3 text-center">
//                                                         {c.spend}
//                                                     </td>

//                                                     <td className="p-3 text-center">
//                                                         {c.leads}
//                                                     </td>

//                                                     <td className="p-3 text-center">
//                                                         {c.cpl}
//                                                     </td>

//                                                 </tr>

//                                             )
//                                         )
//                                     }

//                                 </tbody>

//                             </table>


//                         </div>


//                     </div>

//                 )
//             }


//         </div>
//     );
// }




import { useState } from "react";

const connectedMetaPage = {
    pageName: "Vertical Living Official",
    pageId: "109845763829001",
    status: "Connected",
    lastSync: "2 minutes ago",
};

const initialLeads = [
    {
        id: 1,
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        phone: "+91 9876543210",
        campaign: "Modular Kitchen Campaign",
        date: "26 June 2026",
    },
    {
        id: 2,
        name: "Priya Kumar",
        email: "priya@gmail.com",
        phone: "+91 9876543211",
        campaign: "Bedroom Interior Campaign",
        date: "26 June 2026",
    },
    {
        id: 3,
        name: "Arun Raj",
        email: "arun@gmail.com",
        phone: "+91 9876543212",
        campaign: "Living Room Campaign",
        date: "25 June 2026",
    },
];

const newLead = {
    id: 4,
    name: "Vikram Singh",
    email: "vikram@gmail.com",
    phone: "+91 9876543213",
    campaign: "Wardrobe Campaign",
    date: "Just now",
};

const dummyCampaigns = [
    {
        campaign: "Modular Kitchen Campaign",
        spend: "₹500",
        impressions: "10,500",
        clicks: "820",
        leads: 120,
        cpl: "₹4.16",
    },
    {
        campaign: "Bedroom Interior Campaign",
        spend: "₹350",
        impressions: "8,200",
        clicks: "600",
        leads: 80,
        cpl: "₹4.37",
    },
];

export default function MetaReviewDemoDashboard() {
    const [activeTab, setActiveTab] = useState<
        "overview" | "leads" | "insights"
    >("overview");

    const [leads, setLeads] = useState(initialLeads);
    const [syncing, setSyncing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState("2 minutes ago");

    const handleRefresh = () => {
        setSyncing(true);

        setTimeout(() => {
            setLeads((prev) => {
                const alreadyExists = prev.some(
                    (lead) => lead.id === newLead.id
                );

                if (alreadyExists) return prev;

                return [...prev, newLead];
            });

            setLastUpdated("Just now");
            setSyncing(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-2">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Vertical Living
                </h1>

                <p className="text-gray-500">
                    Meta Ads Lead Intelligence Dashboard
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Connected Meta Asset
                        </h2>

                        <p className="mt-3">
                            Facebook Page:
                            <span className="font-semibold ml-2">
                                {connectedMetaPage.pageName}
                            </span>
                        </p>

                        <p>
                            Page ID:
                            <span className="ml-2">
                                {connectedMetaPage.pageId}
                            </span>
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            {connectedMetaPage.status}
                        </span>

                        <p className="text-sm text-gray-500 mt-3">
                            Last Sync: {lastUpdated}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                {[
                    ["overview", "Overview"],
                    ["leads", "Leads"],
                    ["insights", "Ads Insights"],
                ].map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() =>
                            setActiveTab(
                                key as
                                    | "overview"
                                    | "leads"
                                    | "insights"
                            )
                        }
                        className={`px-5 py-2 rounded-lg ${
                            activeTab === key
                                ? "bg-black text-white"
                                : "bg-white"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {activeTab === "overview" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-5">
                        {[
                            ["Total Spend", "₹850"],
                            ["Total Leads", leads.length],
                            ["Impressions", "18,700"],
                            ["Status", "Active"],
                        ].map((item) => (
                            <div
                                key={item[0]}
                                className="bg-white rounded-xl shadow p-5"
                            >
                                <p className="text-gray-500">
                                    {item[0]}
                                </p>

                                <h2 className="text-2xl font-bold mt-2">
                                    {item[1]}
                                </h2>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold">
                            Meta Integration Overview
                        </h2>

                        <p className="mt-3">
                            Connected Page:
                            <b className="ml-2">
                                Vertical Living Official
                            </b>
                        </p>

                        <p>
                            Lead Retrieval:
                            <b className="ml-2">
                                Enabled
                            </b>
                        </p>

                        <p>
                            Ads Insights:
                            <b className="ml-2">
                                Enabled
                            </b>
                        </p>
                    </div>
                </div>
            )}

            {activeTab === "leads" && (
    <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-5">
            <div>
                <h2 className="text-xl font-semibold">
                    Meta Lead Ads
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    leads_retrieval permission demonstration
                </p>
            </div>

            <button
                onClick={handleRefresh}
                disabled={syncing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
                {syncing ? "Syncing..." : "Refresh Leads"}
            </button>
        </div>

        <div className="mb-4 text-sm text-gray-500">
            Last Updated: {lastUpdated}
        </div>

        <table className="w-full">
            <thead>
                <tr className="border-b">
                    <th className="text-left p-3">
                        Name
                    </th>

                    <th className="text-left p-3">
                        Phone
                    </th>

                    <th className="text-left p-3">
                        Campaign
                    </th>

                    <th className="text-left p-3">
                        Date
                    </th>
                </tr>
            </thead>

            <tbody>
                {leads.map((lead) => (
                    <tr
                        key={lead.id}
                        className={`border-b ${
                            lead.date === "Just now"
                                ? "bg-green-50"
                                : ""
                        }`}
                    >
                        <td className="p-3">
                            {lead.name}
                            {lead.date === "Just now" && (
                                <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                    NEW
                                </span>
                            )}
                        </td>

                        <td className="p-3">
                            {lead.phone}
                        </td>

                        <td className="p-3">
                            {lead.campaign}
                        </td>

                        <td className="p-3">
                            {lead.date}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}

{activeTab === "insights" && (
    <div className="space-y-6">

        <div className="grid grid-cols-4 gap-5">
            {[
                ["Spend", "₹850"],
                ["Impressions", "18,700"],
                ["Clicks", "1,420"],
                ["Leads", leads.length],
            ].map((item) => (
                <div
                    key={item[0]}
                    className="bg-white rounded-xl shadow p-5"
                >
                    <p className="text-gray-500">
                        {item[0]}
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {item[1]}
                    </h2>
                </div>
            ))}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-5">
                Campaign Performance
            </h2>

            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-3">
                            Campaign
                        </th>

                        <th className="text-center p-3">
                            Spend
                        </th>

                        <th className="text-center p-3">
                            Leads
                        </th>

                        <th className="text-center p-3">
                            CPL
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {dummyCampaigns.map((campaign) => (
                        <tr
                            key={campaign.campaign}
                            className="border-b"
                        >
                            <td className="p-3">
                                {campaign.campaign}
                            </td>

                            <td className="text-center p-3">
                                {campaign.spend}
                            </td>

                            <td className="text-center p-3">
                                {campaign.leads}
                            </td>

                            <td className="text-center p-3">
                                {campaign.cpl}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="text-sm text-gray-500 mt-4">
                ads_read permission demonstration
            </p>
        </div>

    </div>
)}

</div>
);
}