import { useContext, useEffect, useState } from "react";
import { Context } from "../MainContext";
import Pdf from "./Pdf";

export default function Body() {
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [pendingQuery, setPendingQuery] = useState(null);
    const { query } = useContext(Context);
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {
        if (!query) return;

        setPendingQuery(query);
        setLoading(true);

        const currentQuery = query;

        setTimeout(() => {
            const simulatedAPIResponse = {
                answer:
                    "Yes, under Section 166 of the Motor Vehicles Act, 1988, the claimants are entitled to an addition for future prospects even when the deceased was self-employed and aged 54–55 years at the time of the accident. In Dani Devi v. Pritam Singh, the Court held that 10% of the deceased's annual income should be added as future prospects.",
                citations: [
                    {
                        text:
                            "as the age of the deceased at the time of accident was held to be about 54–55 years by the learned Tribunal, being self-employed, as such, 10% of annual income should have been awarded on account of future prospects.",
                        source: "Dani_Devi_v_Pritam_Singh.pdf",
                        link: "/Dani.pdf",
                        page: 1,
                    },
                ],
            };

            setChatHistory(prev => [
                ...prev,
                {
                    query: currentQuery,
                    answer: simulatedAPIResponse.answer,
                    citations: simulatedAPIResponse.citations
                }
            ]);
            setPendingQuery(null);
            setLoading(false);
        }, 1500);
    }, [query]);

    return (
        <div className="flex-1 overflow-y-auto bg-[#212121] p-3 sm:p-4 text-white w-full max-w-[1250px] mx-auto space-y-4">
            
            {/* Show message when nothing has been asked yet */}
            {chatHistory.length === 0 && !pendingQuery && (
                <div className="text-center text-gray-400 mt-20 text-lg">Start Typing...</div>
            )}

            {chatHistory.map((chat, index) => (
                <div key={index}>
                    <div className="flex justify-end mb-2">
                        <div className="max-w-[700px] bg-[#303030] p-4 rounded-xl mb-10 break-words">
                            {chat.query}
                        </div>
                    </div>
                    <div className="flex flex-col justify-start">
                        <div className="">{chat.answer}</div>
                        {chat.citations && chat.citations.map((citation, i) => (
                            <div key={i} className="text-sm text-gray-400 mt-2">
                                {citation.text}
                                <button
                                    onClick={() => setPdfData({ url: citation.link, page: citation.page })}
                                    className="underline text-blue-400 ml-1 break-all"
                                >
                                    {citation.source}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {pdfData && <Pdf pdfData={pdfData} onClose={() => setPdfData(null)} />}

            {pendingQuery && (
                <>
                    <div className="flex justify-end mb-2 break-words">{pendingQuery}</div>
                    <div className="flex justify-start text-gray-400">...</div>
                </>
            )}
        </div>
    );
}
