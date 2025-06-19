
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div 
      className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300 p-4 my-4 rounded-md shadow-md transition-all duration-300" 
      role="alert"
    >
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-red-500 dark:text-red-400 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/>
          </svg>
        </div>
        <div>
          <p className="font-bold dark:text-red-200">Oops! Something went wrong.</p>
          <p className="text-sm dark:text-red-300">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;