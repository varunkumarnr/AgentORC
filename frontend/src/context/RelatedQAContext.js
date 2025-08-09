"use client";

import React, { createContext, useState, useContext } from 'react';

const RelatedQAContext = createContext();

export const RelatedQAProvider = ({ children }) => {
  const [relatedQA, setRelatedQA] = useState([]);

  return (
    <RelatedQAContext.Provider value={{ relatedQA, setRelatedQA }}>
      {children}
    </RelatedQAContext.Provider>
  );
};

export const useRelatedQAContext = () => useContext(RelatedQAContext);
