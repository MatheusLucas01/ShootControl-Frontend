import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', icon: '📊' },
        { label: 'Movimentações', path: '/movimentacoes', icon: '💰' },
        { label: 'Nova Movimentação', path: '/movimentacoes/nova', icon: '➕' },
    ]

    const isActivePath = (path) => location.pathname === path

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col`}>
                {/* Header da Sidebar */}
                <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                🎯 ShotControl
                            </h1>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                        >
                            {sidebarOpen ? '❮' : '❯'}
                        </button>
                    </div>
                </div>

                {/* Menu de Navegação */}
                <nav className="flex-1 p-2 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${isActivePath(item.path)
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span className="ml-3">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Usuário e Logout */}
                <div className="p-4 border-t border-slate-700">
                    <div className="bg-slate-700 rounded-lg p-3">
                        {sidebarOpen && (
                            <div className="mb-2">
                                <p className="text-white text-sm font-medium truncate">{user?.nome}</p>
                                <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded transition-colors"
                        >
                            {sidebarOpen ? 'Sair' : '🚪'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 bg-slate-900 overflow-auto">
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout