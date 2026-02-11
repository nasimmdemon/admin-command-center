import { useState } from "react";
import { StepDefaultSettings } from "@/views/create-brand";

export const StepDefaultSettingsDemo = () => {
  const [timezone, setTimezone] = useState("UTC");
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("USD");
  return (
    <StepDefaultSettings
      timezone={timezone}
      onTimezoneChange={setTimezone}
      language={language}
      onLanguageChange={setLanguage}
      currency={currency}
      onCurrencyChange={setCurrency}
    />
  );
};
