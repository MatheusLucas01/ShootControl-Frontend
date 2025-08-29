import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import { movimentacoesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const [saldo, setSaldo] = useState(0)
    const [movimentacoes, setMovimentacoes] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        carregarDados()
    }, [])

    const carregarDados = async () => {
        try {
            const [saldoResponse, movimentacoesResponse] = await Promise.all([
                movimentacoesAPI.getSaldo(),
                movimentacoesAPI.getAll()
            ])

            setSaldo(saldoResponse.saldo)
            setMovimentacoes(movimentacoesResponse.slice(0, 5))
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor)
    }

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR')
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-32 sm:h-64">
                    <div className="text-white text-lg sm:text-xl">Carregando...</div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400 text-sm sm:text-base mt-1">Bem-vindo, {user?.nome}!</p>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Saldo Total */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-400 text-xs sm:text-sm">Saldo Total</p>
                                <p className={`text-lg sm:text-2xl font-bold truncate ${saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatarValor(saldo)}
                                </p>
                            </div>
                            <div className="text-2xl sm:text-3xl ml-3">💰</div>
                        </div>
                    </div>

                    {/* Total de Movimentações */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs sm:text-sm">Total Movimentações</p>
                                <p className="text-lg sm:text-2xl font-bold text-blue-400">{movimentacoes.length}</p>
                            </div>
                            <div className="text-2xl sm:text-3xl">📈</div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 shadow-xl sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs sm:text-sm">Status do Sistema</p>
                                <p className="text-lg sm:text-2xl font-bold text-green-400">Online</p>
                            </div>
                            <div className="text-2xl sm:text-3xl">✅</div>
                        </div>
                    </div>
                </div>

                {/* Últimas Movimentações */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 shadow-xl">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Últimas Movimentações</h2>

                    {movimentacoes.length === 0 ? (
                        <p className="text-slate-400 text-center py-8 text-sm sm:text-base">Nenhuma movimentação encontrada</p>
                    ) : (
                        <div className="space-y-3">
                            {movimentacoes.map((mov) => (
                                <div key={mov.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                                    <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                                        <div className={`w-3 h-3 rounded-full mt-1 sm:mt-0 flex-shrink-0 ${mov.tipo === 'entrada' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-sm sm:text-base truncate">{mov.descricao}</p>
                                            <div className="flex flex-wrap gap-2 sm:gap-4 text-slate-400 text-xs sm:text-sm mt-1">
                                                <span className="bg-slate-600 px-2 py-1 rounded text-xs">{mov.categoria}</span>
                                                <span>{formatarData(mov.data)}</span>
                                                <span className="hidden sm:inline">{mov.forma_pagamento}</span>
                                                <span className="hidden sm:inline">{mov.responsavel}</span>
                                            </div>
                                            {/* Info mobile */}
                                            <div className="sm:hidden text-slate-400 text-xs mt-1">
                                                {mov.forma_pagamento} • {mov.responsavel}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right mt-2 sm:mt-0 sm:ml-4">
                                        <p className={`text-lg sm:text-xl font-bold ${mov.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
                                            {mov.tipo === 'entrada' ? '+' : '-'}{formatarValor(mov.valor)}
                                        </p>
                                        <p className="text-slate-400 text-xs sm:text-sm">{mov.responsavel}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Área para Gráficos */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 shadow-xl">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Análises</h2>
                    <div className="h-48 sm:h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl sm:text-6xl mb-2">📊</div>
                            <p className="text-slate-400 text-sm sm:text-base">Gráficos serão implementados aqui</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard