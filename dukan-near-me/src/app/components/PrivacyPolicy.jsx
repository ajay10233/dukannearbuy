"use client";

import React from "react";
import { Mail, ShieldCheck, Lock, CreditCard, User } from "lucide-react";
import { MdPrivacyTip } from "react-icons/md";


const privacySections = [
  {
    id: "privacy-policy",
    icon: <MdPrivacyTip className="w-6 h-6 text-blue-600" />,
    title: "Privacy Policy",
    content: [
      {
        para: "At NearbuyDukaan, we value your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit or use our services.",
      },
      {
        heading: "1. Information We Collect",
        text: [
          "We may collect the following types of information:",
          "Personal Information: Name, email address, phone number, address, etc.",
          "Payment Information: Collected via secure third-party payment gateways (we do not store card details).",
        ],
      },
      {
        heading: "2. How We Use Your Information",
        text: [
          "We use your information to:",
          "Provide and maintain our services",
          "Process orders and payments",
          "Communicate with you (e.g. for support or updates)",
          "Improve user experience and functionality",
          "Comply with legal requirements",
        ],
      },
      {
        heading: "3. Sharing Your Information",
        text: [
          "We do not sell your personal data. However, we may share it with:",
          "Service providers helping us operate our platform",
          "Legal authorities if required by law",
          "Third-party payment gateways for secure transactions",
        ],
      },
      {
        heading: "4. Data Security",
        text: [
          "We implement strong security measures to protect your information from unauthorized access or disclosure. However, no online platform is 100% secure.",
        ],
      },
      {
        heading: "5. Your Rights",
        text: [
          "You have the right to:",
          "Access the personal data we hold",
          "Request correction or deletion of your data",
          "Withdraw consent for data usage",
        ],
      },
      {
        heading: "6. Cookies",
        text: [
          "We use cookies to enhance your browsing experience. You can control cookie preferences via your browser settings.",
        ],
      },
      {
        heading: "7. Changes to This Policy",
        text: [
          "We may update this Privacy Policy from time to time. We’ll notify you of significant changes by posting the updated policy on our website.",
        ],
      },
      {
        heading: "8. Contact Us",
        text: (
          <span className="flex flex-col md:flex-row items-start text-sm md:text-[16px] md:items-center gap-2">
            If you have any questions or concerns:{" "}
            <a
              href="mailto:contact@nearbuydukaan.com"
              className="text-blue-600 underline flex items-center gap-1"
            >
              <Mail size={20} strokeWidth={1.5} /> contact@nearbuydukaan.com
            </a>
          </span>
        ),
      },
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col gap-10 px-4 pt-10">
      {privacySections.map((section) => (
        <div key={section.id} id={section.id}>
          <div className="flex items-center gap-2 mb-4 justify-center">
            {section.icon}
            <h2 className="text-2xl font-semibold md:text-3xl text-center">{section.title}</h2>
          </div>
          <div className="flex flex-col gap-y-4">
            {section.content.map((item, idx) => (
              <div key={idx} className="space-y-1">
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
                    <p className="text-gray-700 mt-2">{item.text}</p>
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
