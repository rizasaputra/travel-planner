import React from "react";
import { View } from '@aws-amplify/ui-react';
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
  };

  return (
    <View display="inline-block" className="language-switcher">
      <label>
        <input
          type="radio"
          value="en"
          checked={i18n.language === "en"}
          onChange={handleLanguageChange}
        />
        <span>🇺🇸 EN</span>
      </label>

      <label>
        <input
          type="radio"
          value="id"
          checked={i18n.language === "id"}
          onChange={handleLanguageChange}
        />
        <span>🇮🇩 ID</span>
      </label>
    </View>
  );
};

export default LanguageSwitcher;