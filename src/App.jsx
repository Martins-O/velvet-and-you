import { Routes, Route, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/ui/ErrorBoundary'
import Home from './pages/Home'
import GameLobby from './pages/GameLobby'
import GamePlay from './pages/GamePlay'
import Room from './pages/Room'
import History from './pages/History'
import Favourites from './pages/Favourites'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import PlayerSetupModal from './components/shared/PlayerSetupModal'
import { ToastProvider } from './components/ui/useToast'
import ToastContainer from './components/ui/Toast'

function App() {
  const location = useLocation()

  return (
    <ToastProvider>
      <ErrorBoundary key={location.pathname}>
        <div key={location.pathname} className="page-enter" style={{ minHeight: '100vh' }}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<GameLobby />} />
            <Route path="/games/:gameId" element={<GamePlay />} />
            <Route path="/room" element={<Room />} />
            <Route path="/room/:roomCode" element={<Room />} />
            <Route path="/history" element={<History />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ErrorBoundary>
      <PlayerSetupModal />
      <ToastContainer />
    </ToastProvider>
  )
}

export default App
