"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CircleDashed } from "lucide-react";
import Image from "next/image";

export default function Faq() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full pt-10 pb-4 px-4 gap-y-8">
            <h2 className="text-xl md:text-4xl font-extrabold text-center">Frequently Asked Questions</h2>
            <div className="w-full max-w-sm md:max-w-5xl bg-white shadow-none md:shadow-md rounded-md p-3 md:p-6">
            <Accordion type="single" collapsible className="w-full">

                <AccordionItem value="item-1">
                    <AccordionTrigger className="py-2 md:py-4 text-sm md:text-md font-semibold cursor-pointer hover:no-underline">
                        <div className="flex items-center gap-x-2">
                        <CircleDashed className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} color="#187DE6" />
                        <span>What is the social impact of our partnership?</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-xs md:text-sm overflow-hidden transition-all duration-500 ease-out">
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

                    <AccordionItem value="item-2">
                    <AccordionTrigger className="py-2 md:py-4 text-sm md:text-md font-semibold cursor-pointer hover:no-underline">
                        <div className="flex items-center gap-x-2">
                        <CircleDashed className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} color="#187DE6" />
                        <span>How we can tackle e-commerce platforms?</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-xs md:text-sm overflow-hidden transition-all duration-500 ease-out">
                        Local shops can tackle competition from online platforms by adopting smart strategies that enhance customer experience, convenience, and digital presence. Here are some effective ways:
                        <ul className="list-disc list-inside pl-4">
                        <li>Digital Presence & Online Selling</li>
                        <li>Personalized Customer Experience</li>
                        <li>Competitive Pricing & Offers</li>
                        <li>Hyperlocal Marketing & Community Engagement</li>
                        </ul>
                        <br />
                        This platform offers you the opportunity to make your digital presence more stronger and scalable. Making a platform where you can be seen and heard within your local community. Let’s grow together and raise the voice for the local market.
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                    <AccordionTrigger className="py-2 md:py-4 text-sm md:text-md font-semibold cursor-pointer hover:no-underline">
                        <div className="flex items-center gap-x-2">
                        <CircleDashed className="w-5.5 h-5.5 md:w-6 md:h-6" strokeWidth={1.5} color="#187DE6" />
                        <span>Why Shop Owners and Medical institutes join us?</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-xs md:text-sm overflow-hidden transition-all duration-500 ease-out">
                        <ul className="list-disc list-inside pl-4">
                        <li>A platform to generate token.</li>
                        <li>A platform to generate bills.</li>
                        <li>A platform to reach to their customer.</li>
                        <li>A platform which manages bill records.</li>
                        <li>A platform which can manage crowd by displaying live Token/Order numbers on Customer's Device.</li>
                        <li>Digital ledger record for debts with customers.</li>
                        <li>A platform to announce latest offers and sales.</li>
                        </ul>
                        <br />
                        <span className="font-semibold text-md text-orange-600">Join The Revolution And Grow!</span>
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                    <AccordionTrigger className="py-2 md:py-4 text-sm md:text-md font-semibold cursor-pointer hover:no-underline">
                        <div className="flex items-center gap-x-2">
                        <CircleDashed className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} color="#187DE6" />
                        <span>Is this platform trustable?</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-xs md:text-sm overflow-hidden transition-all duration-500 ease-out">
                        We are providing end to end encrypted chats and bill generation procedure. We are highly dedicated to build trust with our platform users and keeping it safe for all. We understand your concern and queries but we are here to support our partners to scale and become more reachable to their customers.
                        <br />
                        We have taken all the required measures to safeguard your data and our trust, we will never stop improvising. 
                        <br />
                        We do appreciate your feedbacks and your responses, do let us know your views.
                        <br />
                        <strong>Your Partner</strong><br />
                        <span className="font-semibold">NearbuyDukaan</span>
                    </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                    <AccordionTrigger className="py-2 md:py-4 text-sm md:text-md font-semibold cursor-pointer hover:no-underline">
                        <div className="flex items-center gap-x-2">
                        <CircleDashed className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} color="#187DE6" />
                        <span>How to increase your customer reach?</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-xs md:text-sm overflow-hidden transition-all duration-500 ease-out">
                        Fast response times show customers that you value their time. Use greetings and polite language.
                        <br /><br />
                        Better products and service quality means better reviews which increase your credibility.
                        <br /><br />
                        Paid promotions can also help in customer reach in your area.
                        <br /><br />
                        <span className="font-semibold">Customer is the king, Be true and honest with them!</span>
                    </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
            </div>
            <div className="flex justify-center items-center w-full px-6">
                <div className="flex items-center relative w-14 h-14 md:w-16 md:h-16">
                    <Image src="/nearbuydukan-Logo/Logo.svg" alt="nearbuydukan"   width={55} height={55} className="md:w-[65px] md:h-[65px]" priority /> 
                </div>
                <div className="text-right items-center text-gray-900">
                    <span className="font-semibold text-xs md:text-sm">Your Partner,</span><br />
                    <span className="font-bold text-sm md:text-md">NearBuyDukaan</span>
                </div>
            </div>
        </div>
    );
}
