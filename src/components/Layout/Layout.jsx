import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false) // Fechado por padrão no mobile
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
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        fixed lg:relative z-30 lg:z-auto
        w-64 lg:w-64 xl:w-72
        bg-slate-800 border-r border-slate-700 
        transition-transform duration-300 ease-in-out
        flex flex-col h-full lg:h-screen
      `}>
                {/* Header da Sidebar */}
                <div className="p-4 lg:p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            🎯 ShotControl
                        </h1>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-slate-400 hover:text-white p-1 rounded transition-colors lg:hidden"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Menu de Navegação */}
                <nav className="flex-1 p-3 lg:p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path)
                                setSidebarOpen(false) // Fecha sidebar no mobile após navegar
                            }}
                            className={`
                w-full flex items-center px-4 py-3 lg:py-4 rounded-lg transition-colors
                text-sm lg:text-base
                ${isActivePath(item.path)
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }
              `}
                        >
                            <span className="text-lg lg:text-xl">{item.icon}</span>
                            <span className="ml-3 lg:ml-4">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Usuário e Logout */}
                <div className="p-3 lg:p-4 border-t border-slate-700">
                    <div className="bg-slate-700 rounded-lg p-3 lg:p-4">
                        <div className="mb-3">
                            <p className="text-white text-sm lg:text-base font-medium truncate">{user?.nome}</p>
                            <p className="text-slate-400 text-xs lg:text-sm truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm lg:text-base py-2 lg:py-3 px-3 rounded transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
                {/* Header Mobile */}
                <div className="lg:hidden bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-slate-400 hover:text-white p-2 rounded transition-colors"
                    >
                        ☰
                    </button>
                    <h1 className="text-lg font-bold text-white">ShotControl</h1>
                    <div className="w-10"></div> {/* Spacer */}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 bg-slate-900 overflow-auto">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout