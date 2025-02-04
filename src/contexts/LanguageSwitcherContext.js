'use client';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

// Custom hook to use the logo context
export const useLanguageContext = () => {
    return useContext(LanguageContext);
};
const LanguageSwitcherContext = ({children}) => {
    const pathname = usePathname();

    const isEnglish = pathname.startsWith("/en");
    return (
        <div>
            <LanguageContext.Provider value={{ isEnglish }}>
                {children}
            </LanguageContext.Provider>
        </div>
    )
}

export default LanguageSwitcherContext
////////////////////////////