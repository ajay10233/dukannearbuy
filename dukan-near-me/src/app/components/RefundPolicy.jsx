"use client";

import React from "react";
import { Mail, ShieldCheck, CreditCard, User } from "lucide-react";

const refundSections = [
  {
    id: "refund-policy",
    // icon: <CreditCard className="w-6 h-6 text-blue-600" />,
    // title: "Refund Policy",
    content: [
      {
        para: "At NearbuyDukaan we strive to provide the best possible service.",
      },
      {
        heading: "1. Eligibility for Refund",
        text: (
            <div className="text-sm md:text-[16px]">
                <p className="text-gray-700 mb-4">
                Refunds may be issued under the following conditions:
                </p>
                <ul className="list-disc list-inside text-gray-600">
                    <li>The service/product was not delivered as described.</li>
                    <li>There was an unintentional billing error or duplicate payment.</li>
                    <li>A technical issue prevented usage of a paid service (e.g., token generation, bill printing, etc.) for 3 days and above.</li>
                    <li>Refund requests must be made within 7 days of the transaction date.</li>
                </ul>
            </div>
          ) 
      },
      {
        heading: "2. Non-Refundable Items",
        text: (
            <div className="text-sm md:text-[16px]">
                <p className="text-gray-700 mb-4">
                Refunds will not be issued for:
                </p>
                <ul className="list-disc list-inside text-gray-600">
                    <li>Change of mind or incorrect purchase.</li>
                    <li>Services already consumed or used successfully.</li>
                </ul>
            </div>
          )   
      },
      {
        heading: "3. How to Request a Refund",
        text: (
            <div className="text-sm md:text-[16px]">
                <p className="text-gray-700">
                To initiate a refund request, please contact our support team with the following details:
                </p>
                <ul className="list-disc list-inside text-gray-600">
                    <li>Your full name</li>
                    <li>Email address</li>
                    <li>Date and amount of payment</li>
                    <li>Reason for the refund</li>
                </ul>
                <p className="text-gray-700 flex items gap-2">
                    Email:{" "}
                    <a
                        href="mailto:support@nearbuydukaan.com"
                        className="text-blue-600 underline flex items-center gap-1"
                    >
                        <Mail size={20} strokeWidth={1.5} /> support@nearbuydukaan.com
                    </a>
                </p>
            </div>

        ),
      },
      {
        heading: "4. Refund Processing",
        text: (
            <div className="text-sm md:text-[16px]">
                <p className="text-gray-700 mb-4">
                Once your request is reviewed:
                </p>
                <ul className="list-disc list-inside text-gray-600">
                    <li>We will notify you of the approval or rejection.</li>
                    <li>If approved, refunds will be processed to your original payment method within 5-7 business days.</li>
                </ul>
            </div>
          )     
      },
      {
        heading: "5. Dispute Resolution",
        text: (
            <div className="text-sm md:text-[16px]">
                <p className="text-gray-700 mb-2 ">
                    If you believe there was a mistake and your request was denied, you can escalate the issue by contacting our team at:
                </p>            
                <a
                    href="mailto:support@nearbuydukaan.com"
                    className="text-blue-600 underline flex items-center gap-1"
                >
                    <Mail size={20} strokeWidth={1.5} /> support@nearbuydukaan.com
                </a>
          </div>
        ),
      },
      {
        heading: "6. Changes to This Policy",
        text: [
          "We may update our refund policy from time to time. Any changes will be posted on this page.",
        ],
      },
    ],
  },
];

export default function RefundPolicy() {
  return (
    <div className="flex flex-col gap-10 px-4 pt-2">
      {refundSections.map((section) => (
        <div key={section.id}>
          <div className="flex items-center gap-2 mb-4 justify-center">
            {/* {section.icon}
            <h2 className="text-2xl font-semibold md:text-3xl text-center">{section.title}</h2> */}
          </div>
          <div className="flex flex-col gap-y-4">
            {section.content.map((item, idx) => (
              <div key={idx}>
                {item.para && (
                  <p className="leading-relaxed text-sm md:text-[16px] text-gray-700">
                    {item.para}
                  </p>
                )}
                {item.heading && (
                  <h3 className="font-semibold">{item.heading}</h3>
                )}
                {Array.isArray(item.text) ? (
                  <ul className="list-disc ml-4 text-sm md:text-[16px] text-gray-700 space-y-1">
                    {item.text.map((point, i) => (
                      <li key={i} className="text-gray-700">
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : (
                  item.text && (
                    <div className="text-gray-700 mt-2">{item.text}</div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
