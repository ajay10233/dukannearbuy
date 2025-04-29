"use client";

import React from "react";
import { Mail, ShieldCheck, CreditCard } from "lucide-react";
import Image from "next/image";

const termsSections = [
  {
    id: "user-terms",
    icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    title: "User Terms & Conditions",
    content: [
      {
        heading: "1. Acceptance of Terms - User",
        text: "By using our platform, you agree to comply with and be legally bound by these Terms & Conditions.",
      },
      {
        heading: "2. User Responsibilities",
        text: [
          "Users are solely responsible for the content they send or share through the platform.",
          "You agree not to use this platform for any illegal, harmful, abusive, or offensive activities.",
        ],
      },
      {
        heading: "3. Prohibited Content",
        text: [
          "Hate speech, harassment, threats, or discrimination.",
          "Pornographic, obscene, or violent material.",
          "Spam or promotional content without permission.",
          "Any malware, viruses, or harmful links.",
        ],
      },
      {
        heading: "4. Account Security",
        text: [
          "You are responsible for maintaining the confidentiality of your account and password.",
          "Notify us immediately of any unauthorized use of your account.",
        ],
      },
      {
        heading: "5. Privacy and Data",
        text: [
          "Your privacy is important to us. Chat messages are fully encrypted.",
          "Personal information is handled according to our Privacy Policy.",
        ],
      },
      {
        heading: "6. Moderation",
        text: [
          "We have the authority to oversee reviews and to suspend or ban users who break these rules.",
          "Reports of abuse will be taken seriously and investigated promptly.",
        ],
      },
      {
        heading: "7. Intellectual Property",
        text: [
          "Do not share content that you do not own or have rights to distribute.",
          "All app features, designs, and branding are our property and protected under applicable laws.",
        ],
      },
      {
        heading: "8. Limitation of Liability",
        text: [
          "We are not liable for any damages arising from the use or inability to use the chat service.",
          "Use of the app is at your own risk.",
        ],
      },
      {
        heading: "9. Termination",
        text: "We reserve the right to suspend or terminate any user account without prior notice if terms are violated.",
      },
      {
        heading: "10. Changes to Terms",
        text: [
          "Terms may be updated at any time. Users will be notified of major changes.",
          "Continued use of the app constitutes acceptance of the new terms.",
        ],
      },
      {
        heading: "11. Contact",
        text: (
            <span className="flex flex-col md:flex-row items-start md:items-center gap-2">
            For any queries or issues:{" "}
            <a href="mailto:contact@nearbuydukaan.com" className="text-blue-600 underline flex items-center gap-1">
            <Mail size={20} strokeWidth={1.5} /> contact@nearbuydukaan.com
            </a>
          </span>
        ),
      },
    ],
  },
  {
    id: "review-terms",
    icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
    title: "Reviews & Feedback Terms & Conditions",
    content: [
      {
        heading: "1. Review Guidelines",
        text: "Users are welcome to share feedback and reviews, but all submissions must be respectful, honest, and relevant to the service or product being reviewed.",
      },
      {
        heading: "2. Prohibited Review Content",
        text: [
          "Abusive, offensive, or threatening language",
          "Hate speech, discrimination, or personal attacks",
          "Defamatory or false accusations",
          "Spam, promotions, or irrelevant content",
          "Sexually explicit or graphic content",
          "Private information (phone numbers, addresses, etc.)",
        ],
      },
      {
        heading: "3. Moderation & Review Removal",
        text: [
          "Edit, hide, or remove any review that violates these terms.",
          "Permanently ban users who repeatedly post inappropriate content.",
        ],
      },
      {
        heading: "4. Authenticity of Reviews",
        text: [
          "Reviews must reflect genuine personal experiences.",
          "Fake, paid, or manipulated reviews will be removed and may result in account suspension.",
        ],
      },
      {
        heading: "5. Reporting Abusive Reviews",
        text: "Users can report abusive or suspicious reviews. Our moderation team will investigate and take appropriate action.",
      },
      {
        heading: "6. User Responsibility",
        text: "Users are solely responsible for the content of their reviews. By posting a review, you agree that it complies with these terms.",
      },
      {
        heading: "7. Rights to Use Content",
        text: "By submitting a review, you grant us the right to display, edit, or remove it as needed to maintain platform integrity and community standards.",
      },
      {
        heading: "8. Changes to These Terms",
        text: "We may update these terms as necessary. Continued use of the platform implies acceptance of the updated terms.",
      },
      {
        heading: "9. Contact for Concerns",
        text: (
            <span className="flex flex-col md:flex-row items-start md:items-center gap-2">
            If you believe a review violates our policy, contact us at:{" "}
            <a href="mailto:contact@nearbuydukaan.com" className="text-blue-600 underline flex items-center gap-1">
            <Mail size={20} strokeWidth={1.5} /> contact@nearbuydukaan.com
            </a>
          </span>
        ),
      },
    ],
  },
  {
    id: "payment-terms",
    icon: <CreditCard className="w-6 h-6 text-blue-600" />,
    title: "Payment Terms & Conditions",
    content: [
      {
        heading: "1. Payment Confirmation",
        text: [
          "Once payment is successfully processed, a confirmation message will be updated in My plans.",
          "Please ensure you have selected the right plan.",
        ],
      },
      {
        heading: "2. Accepted Payment Methods",
        text: [
          "We accept UPI, Credit/Debit Cards, Net Banking, Wallets, and other options as listed on the checkout page.",
          "All transactions are secured and encrypted via trusted payment gateway.",
        ],
      },
      {
        heading: "3. Pricing",
        text: [
          "All prices are listed in INR (₹) unless stated otherwise.",
          "Pricing is subject to change without prior notice. Prices at the time of checkout will be honored.",
        ],
      },
      {
        heading: "4. Refunds & Cancellations",
        text: [
          "Once payment is made, it is non-refundable, except in cases of accidental double charges or failed service delivery.",
          "If a payment fails that was made with coupons, only the amount that was deducted will be processed. Each user can use a coupon just once.",
          "For any payment-related issues, contact support within 2 days of the transaction.",
        ],
      },
      {
        heading: "5. Disputes",
        text: [
          "In case of a payment dispute or unauthorized transaction, users must notify us at the email below immediately.",
          "We will investigate and respond within 2–3 business days.",
        ],
      },
      {
        heading: "6. Billing Information",
        text: [
          "Users are responsible for providing accurate billing information.",
          "We are not responsible for payment failures due to incorrect details.",
        ],
      },
      {
        heading: "7. Security",
        text: [
          "We do not store any sensitive payment details such as card numbers or CVVs.",
          "Payments are processed via third-party payment gateways that are PCI-DSS compliant.",
        ],
      },
      {
        heading: "8. Changes to Terms",
        text: [
          "We reserve the right to update or modify these terms at any time.",
          "Continued use of our services after such changes constitutes acceptance of the new terms.",
        ],
      },
      {
        heading: "9. Contact Us",
        text: (
            <span className="flex flex-col md:flex-row items-start md:items-center gap-2">
            For any billing or payment-related queries, reach out to us at: {" "}
            <a href="mailto:contact@nearbuydukaan.com" className="text-blue-600 underline flex items-center gap-1">
            <Mail size={20} strokeWidth={1.5} /> contact@nearbuydukaan.com
            </a>
          </span>
        ),
      },
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <div className="px-6 md:px-10 py-13 flex flex-col gap-6 text-gray-800 relative">
      <h1 className="text-2xl md:text-3xl font-bold text-center">Terms & Conditions</h1>

      {/* Navigation btn */}
        <div className="hidden md:flex justify-center gap-4 flex-wrap">
            {termsSections.map((section) => (
            <a
                key={section.id}
                href={`#${section.id}`}
                className="bg-gray-100 transit duration-300 ease-in-out cursor-pointer hover:bg-gray-200 px-4 py-2 rounded-md shadow text-sm font-medium flex items-center gap-2"
            >
                {section.icon}
                {section.title}
            </a>
            ))}
        </div>

        {/* Terms Sections */}
        <div className="flex flex-col gap-10">
            {termsSections.map((section) => (
            <div key={section.id} id={section.id} className="flex flex-col gap-4 pt-4 md:pt-14">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-700 border-b pb-1 flex items-center gap-2">
                {section.icon}
                {section.title}
                </h2>
                {section.content.map((item, index) => (
                <div key={index} className="space-y-1 pl-4">
                    <h3 className="font-semibold">{item.heading}</h3>
                    {Array.isArray(item.text) ? (
                    <ul className="list-disc list-inside ml-4 text-sm md:text-[16px] text-gray-700">
                        {item.text.map((line, i) => (
                        <li key={i}>{line}</li>
                        ))}
                    </ul>
                    ) : (
                    <div className="text-gray-700 text-sm md:text-[16px]">{item.text}</div>
                    )}
                </div>
                ))}
            </div>
            ))}
        </div>
          
        <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
            <Image src="/nearbuydukan - watermark.png"
                alt="Watermark"
                fill sizes="128"
                className="object-contain w-17 h-17 md:w-32 md:h-32"
                priority
            />
        </div>   
    </div>
  );
}
