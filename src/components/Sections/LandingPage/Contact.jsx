import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';

function Contact() {
    const formRef = useRef();

    const sendEmail = (e) => {
    e.preventDefault();

   emailjs.sendForm(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  formRef.current,
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
)

    .then(() => {
      alert('Message sent successfully!');
      formRef.current.reset();
    })
    .catch((err) => {
      alert('Failed to send message.');
      console.error('EmailJS Error:', err);
    });
  };
  return (
        <div className="relative w-full bg-white dark:bg-black text-gray-900 dark:text-white py-20 overflow-hidden">
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-8 items-center mb-20">
          
          {/* CTA Section */}
          <div className="flex-1 flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-sans font-medium tracking-tight">
              START YOUR JOURNEY
            </h1>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#4c45a5] leading-none">
              NOW!
            </span>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-xl">
             Be one of the first to experience the<br/> future of legal tech with Lamis AI.
            </p>
            <button className="border border-[#a59ad6] text-gray-900 dark:text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-base sm:text-lg hover:bg-[#a59ad6] hover:text-white dark:hover:text-black transition-all duration-200 w-fit">
              Lamis AI
            </button>
          </div>

          {/* Contact Form */}
          <div className="flex-1 w-full">
            <div className="w-full max-w-md mx-auto lg:mx-0 bg-white/80 dark:bg-black/60 rounded-lg shadow p-6 border border-[#a59ad6]/30">
              <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="text-sm font-medium text-gray-800 dark:text-gray-200">Name</label>
                  <input name="from_name" id="contact-name" type="text" placeholder="Your Name" required className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#a59ad6]/40" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-gray-800 dark:text-gray-200">Email</label>
                  <input name="from_email" id="contact-email" type="email" placeholder="Your Email" required className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#a59ad6]/40" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-message" className="text-sm font-medium text-gray-800 dark:text-gray-200">Message</label>
                  <textarea name="message" id="contact-message" rows={5} placeholder="Your Message" required className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#a59ad6]/40 resize-none" />
                </div>
                <button type="submit" className="self-end mt-2 px-8 py-2 rounded bg-[#a59ad6] text-white font-semibold hover:bg-[#4c45a5] transition text-base shadow">Send</button>
              </form>
            </div>
          </div>
        </div>
        </div>
        </div>
  )
}

export default Contact