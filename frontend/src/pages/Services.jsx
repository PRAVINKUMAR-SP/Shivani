import React from 'react';
import { FileText, Users, Award, BookOpen, ArrowRight } from 'lucide-react';

const servicesData = [
  {
    title: 'Resume Builder',
    description: 'Create a professional, ATS-friendly resume in minutes with our templates.',
    icon: FileText,
    color: 'bg-blue-100 text-blue-700',
    price: 'Free',
    buttonText: 'Build Resume'
  },
  {
    title: 'Interview Preparation',
    description: 'Practice with AI and expert coaches to nail your next interview.',
    icon: Users,
    color: 'bg-green-100 text-green-700',
    price: '$49/session',
    buttonText: 'Book a Coach'
  },
  {
    title: 'Skill Certifications',
    description: 'Earn certificates to prove your skills and stand out to top employers.',
    icon: Award,
    color: 'bg-purple-100 text-purple-700',
    price: 'From $19',
    buttonText: 'Explore Courses'
  },
  {
    title: 'Career Counseling',
    description: 'Get personalized 1-on-1 advice from industry veterans and recruiters.',
    icon: BookOpen,
    color: 'bg-orange-100 text-orange-700',
    price: '$79/session',
    buttonText: 'Find a Mentor'
  }
];

const Services = () => {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-96px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Accelerate Your Career</h1>
          <p className="text-lg text-gray-600">
            We offer a premium suite of tools and services designed to help you land your dream job faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col h-full group">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${service.color}`}>
                <service.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="font-semibold text-gray-900">{service.price}</span>
                <button className="flex items-center gap-1 text-blue-600 font-bold group-hover:text-blue-700 transition-colors">
                  {service.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-blue-700 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Not sure where to start?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Take our free career assessment quiz to find out which of our services will benefit you the most right now.
          </p>
          <button className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors shadow-md">
            Take Free Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
