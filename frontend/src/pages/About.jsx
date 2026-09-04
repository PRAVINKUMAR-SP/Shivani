import React from 'react';

const About = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-6 tracking-tight">About Us</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Welcome to Shivani Technologies. We are dedicated to bridging the gap between talented individuals and outstanding organizations. Our platform provides intuitive tools for job seekers to find their dream careers and for employers to discover top-tier talent.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          With advanced features, streamlined applicant tracking, and comprehensive financial tools, we empower your professional journey every step of the way.
        </p>
      </div>
    </div>
  );
};

export default About;
