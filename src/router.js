import { Routes, Route } from "react-router-dom";
import Preview from "./pages/preview/Preview";
import Error from "./components/error/Error";
import FormPage from "./pages/form-page/FormPage";
import MainPage from "./pages/main-page/MainPage";
import AboutPage from "./pages/about-page/AboutPage";
import AnalysisPage from "./pages/analysis-page/AnalysisPage";

export const router = (isAuthorized) => {
  if (isAuthorized) {
    return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/param/:id" element={<AnalysisPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Preview />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};
