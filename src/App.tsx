import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LogModalProvider } from "@/context/LogModalContext";
import { LogEntryModal } from "@/components/logs/LogEntryModal";
import { DashboardPage } from "@/pages/DashboardPage";
import { InjuryDetailPage } from "@/pages/InjuryDetailPage";
import { InjuryFormPage } from "@/pages/InjuryFormPage";
import { JournalPage } from "@/pages/JournalPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function App() {
  return (
    <LogModalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/injuries/new" element={<InjuryFormPage />} />
            <Route path="/injuries/:id" element={<InjuryDetailPage />} />
            <Route path="/injuries/:id/edit" element={<InjuryFormPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <LogEntryModal />
    </LogModalProvider>
  );
}

export default App;
