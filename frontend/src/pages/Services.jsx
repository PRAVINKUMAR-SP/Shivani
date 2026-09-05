import React from 'react';
import { FileText, Users, Award, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const servicesData = [
  {
    title: 'Interview Preparation',
    description: 'Practice with AI and expert coaches to nail your next interview.',
    icon: Users,
    color: 'bg-green-100 text-green-700',
    price: '₹49/session',
    buttonText: 'Book a Coach',
    link: '/contact'
  },
  {
    title: 'Skill Certifications',
    description: 'Earn certificates to prove your skills and stand out to top employers.',
    icon: Award,
    color: 'bg-purple-100 text-purple-700',
    price: 'From ₹19',
    buttonText: 'Explore Courses',
    link: '/contact'
  },
  {
    title: 'Career Counseling',
    description: 'Get personalized 1-on-1 advice from industry veterans and recruiters.',
    icon: BookOpen,
    color: 'bg-orange-100 text-orange-700',
    price: '₹79/session',
    buttonText: 'Find a Mentor',
    link: '/contact'
  },
  {
    title: 'Skill Assessments',
    description: 'Take 20-question skill tests in HTML, CSS, and JS to prove your expertise.',
    icon: FileText,
    color: 'bg-indigo-100 text-indigo-700',
    price: 'Free',
    buttonText: 'Take a Test',
    link: '/tests'
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
              
              <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-100">
                <span className="font-semibold text-gray-900">{service.price}</span>
                {service.link ? (
                  <Link to={service.link} className="flex items-center justify-center gap-1 text-blue-600 font-bold group-hover:text-blue-700 transition-colors">
                    {service.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button className="flex items-center gap-1 text-blue-600 font-bold group-hover:text-blue-700 transition-colors">
                    {service.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default Services;
