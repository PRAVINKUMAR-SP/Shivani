import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { questionsData } from '../data/questions';

const TakeTest = () => {
  const { subject } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testQuestions = questionsData[subject];

  useEffect(() => {
    if (!testQuestions) {
      navigate('/tests');
    }
  }, [subject, testQuestions, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">You must be logged in to take this test. Please sign in using your account to continue.</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">Go Home</button>
      </div>
    );
  }

  if (!testQuestions) return null;

  const handleOptionSelect = (qIndex, optionIndex) => {
    if (!isSubmitted) {
      setAnswers({ ...answers, [qIndex]: optionIndex });
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < testQuestions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    let calculatedScore = 0;
    testQuestions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        calculatedScore += 1;
      }
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api/tests/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || 1, // Fallback if no real ID
          userName: user.name,
          userEmail: user.email,
          subject: subject.toUpperCase(),
          score: calculatedScore,
          totalQuestions: testQuestions.length
        })
      });
      
      if (response.ok) {
        setScore(calculatedScore);
        setIsSubmitted(true);
        toast.success('Test submitted successfully!');
      } else {
        toast.error('Failed to submit test.');
      }
    } catch (error) {
      toast.error('Server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h2>
          <p className="text-gray-500 mb-6">You have successfully completed the {subject.toUpperCase()} assessment.</p>
          <div className="bg-blue-50 text-blue-800 rounded-xl p-6 mb-8 border border-blue-100">
            <p className="text-sm font-semibold mb-1">Your Score</p>
            <p className="text-5xl font-extrabold">{score} <span className="text-2xl text-blue-400">/ {testQuestions.length}</span></p>
          </div>
          <button onClick={() => navigate('/tests')} className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  const question = testQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 uppercase">{subject} Assessment</h1>
          <span className="bg-blue-100 text-blue-700 font-bold px-4 py-1.5 rounded-full text-sm">
            Question {currentQuestion + 1} of {testQuestions.length}
          </span>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  answers[currentQuestion] === index 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-200 bg-white rounded-xl font-semibold text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          
          {currentQuestion === testQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(testQuestions.length - 1, currentQuestion + 1))}
              className="px-6 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Next
            </button>
          )}
        </div>
        
        {/* Progress indicators */}
        <div className="mt-8 flex flex-wrap gap-2">
          {testQuestions.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center transition-colors ${
                currentQuestion === i 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1'
                  : answers[i] !== undefined
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeTest;
