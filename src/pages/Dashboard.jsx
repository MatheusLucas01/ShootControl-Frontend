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
            // Buscar saldo e movimentações em paralelo
            const [saldoResponse, movimentacoesResponse] = await Promise.all([
                movimentacoesAPI.getSaldo(),
                movimentacoesAPI.getAll()
            ])

            setSaldo(saldoResponse.saldo)
            // Mostrar apenas as 5 últimas movimentações
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
                <div className="flex items-center justify-center h-64">
                    <div className="text-white text-xl">Carregando...</div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400">Bem-vindo, {user?.nome}!</p>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Saldo Total */}
                    <div className="card-dark">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Saldo Total</p>
                                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatarValor(saldo)}
                                </p>
                            </div>
                            <div className="text-3xl">💰</div>
                        </div>
                    </div>

                    {/* Total de Movimentações */}
                    <div className="card-dark">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Movimentações</p>
                                <p className="text-2xl font-bold text-blue-400">{movimentacoes.length}</p>
                            </div>
                            <div className="text-3xl">📈</div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="card-dark">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Status do Sistema</p>
                                <p className="text-2xl font-bold text-green-400">Online</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>
                </div>

                {/* Últimas Movimentações */}
                <div className="card-dark">
                    <h2 className="text-xl font-bold text-white mb-4">Últimas Movimentações</h2>

                    {movimentacoes.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">Nenhuma movimentação encontrada</p>
                    ) : (
                        <div className="space-y-3">
                            {movimentacoes.map((mov) => (
                                <div key={mov.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${mov.tipo === 'entrada' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                        <div>
                                            <p className="text-white font-medium">{mov.descricao}</p>
                                            <p className="text-gray-400 text-sm">
                                                {mov.categoria} • {formatarData(mov.data)} • {mov.forma_pagamento}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${mov.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
                                            {mov.tipo === 'entrada' ? '+' : '-'}{formatarValor(mov.valor)}
                                        </p>
                                        <p className="text-gray-400 text-sm">{mov.responsavel}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Área para Gráficos (futura implementação) */}
                <div className="card-dark">
                    <h2 className="text-xl font-bold text-white mb-4">Gráficos</h2>
                    <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Gráficos serão implementados aqui</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard