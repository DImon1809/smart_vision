import { Routes, Route } from "react-router-dom";
import Preview from "./components/preview/Preview";
import Error from "./components/error/Error";
import FormPage from "./components/form-page/FormPage";
import MainPage from "./components/main-page/MainPage";
import AnalysisPage from "./components/analysis-page/AnalysisPage";

export const router = (isAuthorized) => {
  if (isAuthorized) {
    return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:id" element={<AnalysisPage />} />
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
