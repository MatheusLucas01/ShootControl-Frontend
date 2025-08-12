import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Páginas
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Movimentacoes from '../pages/Movimentacoes'
import NovaMovimentacao from '../pages/NovaMovimentacao'

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-white text-xl">Carregando...</div>
            </div>
        )
    }

    return isAuthenticated() ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/movimentacoes" element={
                    <ProtectedRoute>
                        <Movimentacoes />
                    </ProtectedRoute>
                } />

                <Route path="/movimentacoes/nova" element={
                    <ProtectedRoute>
                        <NovaMovimentacao />
                    </ProtectedRoute>
                } />

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes