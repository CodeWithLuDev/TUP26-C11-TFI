import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './state/AppContext';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { GroupsPage } from './pages/GroupsPage';
import { TeamPage } from './pages/TeamPage';
import { FixturePage } from './pages/FixturePage';
import { PlayoffsPage } from './pages/PlayoffsPage';
import { StatsPage } from './pages/StatsPage';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/fixture" element={<FixturePage />} />
            <Route path="/playoffs" element={<PlayoffsPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/teams/:teamId" element={<TeamPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
