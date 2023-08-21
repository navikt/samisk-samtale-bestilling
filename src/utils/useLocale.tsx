import { createContext, useContext } from 'react';
import { Locale, defaultLocale } from '../../common/localization/localeUtils';

const Context = createContext<Locale>(defaultLocale);

type ProviderProps<T> = {
    value: T;
    children: React.ReactNode;
};

export const useLocale = () => {
    return useContext(Context);
};

export const LocaleProvider = ({ children, ...props }: ProviderProps<Locale>) => {
    return <Context.Provider {...props}>{children}</Context.Provider>;
};
