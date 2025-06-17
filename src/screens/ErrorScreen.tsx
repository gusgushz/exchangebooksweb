import React from 'react';

export const ErrorScreen = () => {
  const errorContent = { message: 'An error occurred while loading the page.' };
  return (
    <div>
      <title>ErrorScreen</title>
      <p>{errorContent.message}</p>
    </div>
  );
};
