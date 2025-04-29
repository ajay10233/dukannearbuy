"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CircleDashed } from "lucide-react";
import Image from "next/image";

export default function Faq() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full pt-10 pb-4 px-4 md:px-0 gap-y-8">
            <h2 className="text-xl md:text-4xl font-extrabold text-center">Frequently Asked Questions</h2>
            <div className="w-full max-w-sm md:max-w-5xl bg-white shadow-none md:shadow-md rounded-md p-3 md:p-6">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="py-2 md:py-4 text-sm md:text-md font-semibold cursor-pointer hover:no-underline">
                            <div className="flex items-center gap-x-2">
                                <CircleDashed className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} color="#187DE6" />
                                <span>What is the inspiration behind this platform?</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xs md:text-sm w-full break-words whitespace-pre-line max-h-[90vh] overflow-y-auto transition-all duration-500 ease-out">
                                In 2020, <strong>Prime Minister Narendra Modi</strong> launched the motto <span className="font-semibold">"Vocal for Local"</span> under the <span className="font-semibold">Atmanirbhar Bharat Abhiyan</span> (Self-Reliant India Campaign). By promoting local industry, goods, and enterprises, this campaign seeks to decrease reliance on imports and elevate the domestic economy by inspiring Indian people to help and promote them.
                                <br />
                                <span className="font-semibold text-sm">Objective of "Vocal for Local"</span>  
                                <br />
                                The main goal is to create a self-sufficient India by strengthening local manufacturing, encouraging entrepreneurship, and increasing employment opportunities. By promoting <span className="font-semibold">Made in India</span> products, the initiative supports small businesses, artisans, and MSMEs (Micro, Small & Medium Enterprises).
                                <br />
                                <span className="font-semibold text-sm">Government Initiatives Supporting "Vocal for Local"</span>  
                                <ul className="list-disc list-inside gap-x-4">
                                    <li><span className="font-semibold">Atmanirbhar Bharat Abhiyan</span> - Focuses on self-reliance by promoting indigenous production.</li>
                                    <li><span className="font-semibold">Make in India</span> - Encourages global and domestic companies to manufacture in India.</li>
                                    <li><span className="font-semibold">Startup India</span> - Supports new entrepreneurs with funding and ease of business.</li>
                                    <li><span className="font-semibold">One District One Product (ODOP)</span> - Promotes unique local products at the district level.</li>
                                    <li><span className="font-semibold">MSME Schemes</span> - Various subsidies and financial support for small businesses.</li>
                                    </ul>
                                <br />
                            By choosing locally made products, Indian consumers contribute to national growth, making India a <span className="font-semibold">self-reliant global economic powerhouse.</span>
                            <br />
                            {/* <span className="font-semibold text-lg text-orange-600">Together we can compete against online platforms!</span> */}
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="py-2 md:py-4 text-sm md:text-md font-semibold cursor-pointer hover:no-underline">
                            <div className="flex items-center gap-x-2">
                                <CircleDashed className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} color="#187DE6" />
                                <span>What is the social impact of our partnership?</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xs md:text-sm overflow-hidden max-h-96 transition-all duration-500 ease-out">
                            The industry of 10-minute delivery is growing while local market growth is shrinking.
                            <br />
                            <span className="font-semibold">Negative Side of 10-minute Delivery</span>
                            <br />
                            The 10-minute delivery system has gained popularity, but it also comes with many drawbacks that affect businesses, consumers, and delivery personnel.
                            <br />
                            <span className="font-semibold">1. Safety Risks for Delivery Agents</span>
                            <ul className="list-disc list-inside pl-4">
                                <li>High-speed pressure leads to rash driving, increasing the risk of accidents and injuries.</li>
                                <li>Mental stress due to time-bound deliveries can result in burnout and exploitation of workers.</li>
                            </ul>
                            <br />
                            <span className="font-semibold">2. Poor Product Quality & Limited Selection</span>
                            <ul className="list-disc list-inside pl-4">
                                <li>Products having closeby use-by date are supplied.</li>
                                <li>Limited categories with limited brand presence.</li>
                            </ul>
                            <br />
                            <span className="font-semibold">3. Environmental Impact</span>
                            <ul className="list-disc list-inside pl-4">
                                <li>Increased traffic congestion and carbon emissions from frequent, short-distance deliveries.</li>
                                <li>More packaging waste due to excessive small orders.</li>
                            </ul>
                            <br />
                            <span className="font-semibold">4. Promotes Unnecessary Buying</span>
                            <ul className="list-disc list-inside pl-4">
                                <li>Instant availability of items can lead to impulse buying and wastage.</li>
                                <li>People may rely on quick deliveries instead of planning purchases, reducing mindful consumption.</li>
                            </ul>
                            <br />
                            <span className="font-semibold">5. Unfair Labor Practices</span>
                            <ul className="list-disc list-inside pl-4">
                                <li>Many delivery agents are underpaid and work in harsh conditions with no fixed salaries or job security.</li>
                                <li>Penalty deductions for late deliveries put additional financial strain on workers.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="py-2 md:py-4 text-sm md:text-md font-semibold cursor-pointer hover:no-underline">
                            <div className="flex items-center gap-x-2">
                                <CircleDashed className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} color="#187DE6" />
                                <span>What is the role of the local market in GDP?</span>
                            </div> 
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xs md:text-sm w-full break-words whitespace-pre-line max-h-[90vh] overflow-y-auto transition-all duration-500 ease-outffffffff">
                            The local market plays a significant role in influencing a country's Gross Domestic Product (GDP) by contributing to various economic activities such as consumption, investment, and production. Here's how the local market impacts GDP:
                            <br />
                            <span className="font-semibold">1. Consumption (C)</span>
                            <ul className="list-disc list-inside pl-4">
                                <li>When consumers purchase goods and services from local businesses, it boosts demand and encourages business growth.</li>
                            </ul>
                            <br />
                            <span className="font-semibold">2. Investment (I)</span>
                            <ul className="list-disc list-inside pl-4">
                                <li>Higher investment levels lead to job creation, innovation, and long-term economic growth.</li>
                            </ul>
                            <br />
                            <span className="font-semibold">3. Net Exports (X - M)</span>
                            <ul className="list-disc list-inside pl-4">
                                <li>If local businesses produce goods and services that are exported, they contribute positively to GDP.</li>
                            </ul>
                            <br />
                            <span className="font-semibold">Other Key Effects of Local Markets on GDP:</span>
                            <ul className="list-disc list-inside pl-4">
                                <li><strong>Job Creation:</strong> Thriving local markets provide employment, increasing household income and boosting spending power.</li>
                                <li><strong>Small Business Growth:</strong> Local entrepreneurship fosters innovation and competition, leading to increased productivity and economic diversification.</li>
                                <li><strong>Inflation & Purchasing Power:</strong> High demand in local markets can drive prices up, affecting inflation, which in turn influences GDP growth.</li>
                            </ul>
                            <br />
                            <span className="font-semibold">Conclusion:</span>
                            <br />
                            A strong local market stimulates economic activities across different sectors, enhancing national GDP growth. Policymakers often focus on <br />strengthening local economies through incentives, infrastructure development, and financial support to businesses to sustain overall economic expansion.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="py-2 md:py-4 text-sm md:text-md font-semibold cursor-pointer hover:no-underline">
                            <div className="flex items-center gap-x-2">
                                <CircleDashed className="w-4.5 h-4.5 md:w-6 md:h-6" strokeWidth={1.5} color="#187DE6" />
                                <span>Is this platform trustable?</span>
                            </div> 

                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 text-xs md:text-sm overflow-hidden max-h-96 transition-all duration-500 ease-out">
                            We offer chats that are completely encrypted from start to finish, along with a process for generating bills. Our commitment to establishing trust with everyone who uses our platform is strong, and we are focused on ensuring safety for everyone.
                            <br />
                            We have implemented all necessary steps to protect your information and maintain trust, and we will continuously seek improvements.
                            <br />
                            We greatly value your feedback and comments, so please share your thoughts with us.
                            <br />
                            <strong>Your Partner,</strong><br />
                            <span className="font-semibold">NearbuyDukaan</span>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>
            <div className="flex justify-center items-center w-full px-6">
                <div className="flex items-center relative w-14 h-14 md:w-16 md:h-16">
                    <Image src="/nearbuydukan-Logo/Logo.svg" alt="nearbuydukan" width={55} height={55} className="md:w-[65px] md:h-[65px]" priority /> 
                </div>
                <div className="text-right items-center text-gray-900">
                    <span className="font-semibold text-xs md:text-sm">Your Partner,</span><br />
                    <span className="font-bold text-sm md:text-md">NearBuyDukaan</span>
                </div>
            </div>
        </div>
    );
}
