import './App.css';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en.json";
import translationID from "./locales/id.json";

import Header from './components/Header';
import Prompt from './components/Prompt';

import '@aws-amplify/ui-react/styles.css';

const resources = {
  en: {
    translation: translationEN,
  },
  id: {
    translation: translationID,
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "id",
  fallbackLng: "id",
  interpolation: {
    escapeValue: false,
  },
});

function App() {
  return (
    <div className="App">
      <Header />
      <Prompt />
    </div>
  );
}

export default App;
