"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import Image from 'next/image';

const ContactPage = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const text = "Say Hello";
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(false);
        setSuccess(false);

        emailjs
            .sendForm(
                process.env.NEXT_PUBLIC_SERVICE_ID,
                process.env.NEXT_PUBLIC_TEMPLATE_ID,
                form.current,
                process.env.NEXT_PUBLIC_PUBLIC_KEY
            )
            .then(
                (result) => {
                    console.log("SUCCESS:", result.text);
                    setSuccess(true);
                    form.current.reset();
                },
                (error) => {
                    console.error("FAILED:", error.text);
                    setError(true);
                }
            );
    };

    return (
        <motion.div
            className="h-full pt-32 bg-white"
            initial={{ y: "-200vh" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1 }}
        >
            <div className="h-full flex flex-col lg:flex-row px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 gap-6">
                {/* Text Container */}
                <div className="flex flex-col justify-center text-center">
                    <div className=" flex-1 flex items-center justify-center text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 lg:mb-0">
                    <Image
                        src="/CryptoAnalysis-ezgif.com-video-to-gif-converter.gif"
                        alt="Animated greeting"
                        width={500}
                        height={200}
                        className="mt-0"
                    />
                    </div>
                </div>


                {/* Form Container */}
                <form
                    onSubmit={sendEmail}
                    ref={form}
                    className="flex-1 bg-white rounded-xl text-xl flex flex-col gap-6 justify-center p-8 lg:p-12"
                >
                    <span>Dear Shivam Verma,</span>
                    <textarea
                        rows={6}
                        className="bg-transparent border-b-2 border-b-black outline-none resize-none cursor-pointer"
                        name="user_message"
                        required
                        placeholder="Type your message here..........."
                    />
                    <span>My mail address is:</span>
                    <input
                        type="email"
                        className="bg-transparent border-b-2 border-b-black outline-none cursor-pointer"
                        name="user_email"
                        required
                        placeholder="Write your email address"
                    />
                    <span>Regards</span>
                    <button
                        type="submit"
                        className="bg-yellow-500 rounded-lg font-extrabold text-white p-4"
                    >
                        Send
                    </button>
                    {success && (
                        <span className="text-green-600 font-semibold">
                            Your message has been sent successfully!!
                        </span>
                    )}
                    {error && (
                        <span className="text-red-600 font-semibold">
                            Something went wrong!!
                        </span>
                    )}
                </form>
            </div>
        </motion.div>
    );
};

export default ContactPage;
