import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { LogModalProvider } from '@/context/LogModalContext';
import { JournalModalProvider } from '@/context/JournalModalContext';
import { InjuriesPage } from '@/pages/InjuriesPage';
import { InjuryDetailPage } from '@/pages/InjuryDetailPage';
import { InjuryFormPage } from '@/pages/InjuryFormPage';
import { JournalPage } from '@/pages/JournalPage';
import { StrengtheningWeekPage } from '@/pages/StrengtheningWeekPage';
import { HabitsPage } from '@/pages/HabitsPage';
import { ActivitiesPage } from '@/pages/ActivitiesPage';
import { ActivityFormPage } from '@/pages/ActivityFormPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppShell />}>
      <Route path="/" element={<InjuriesPage />} />
      <Route path="/injuries/new" element={<InjuryFormPage />} />
      <Route path="/injuries/:id" element={<InjuryDetailPage />} />
      <Route path="/injuries/:id/edit" element={<InjuryFormPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/strengthening" element={<StrengtheningWeekPage />} />
      <Route path="/habits" element={<HabitsPage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/activities/new" element={<ActivityFormPage />} />
      <Route path="/activities/:id/edit" element={<ActivityFormPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);

export function App() {
  return (
    <LogModalProvider>
      <JournalModalProvider>
        <RouterProvider router={router} />
      </JournalModalProvider>
    </LogModalProvider>
  );
}
