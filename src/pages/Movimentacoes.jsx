import { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import { movimentacoesAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

const Movimentacoes = () => {
    const [movimentacoes, setMovimentacoes] = useState([])
    const [filteredMovimentacoes, setFilteredMovimentacoes] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('todos')
    const [filtroCategoria, setFiltroCategoria] = useState('todos')
    const [showFilters, setShowFilters] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        carregarMovimentacoes()
    }, [])

    useEffect(() => {
        aplicarFiltros()
    }, [movimentacoes, searchTerm, filtroTipo, filtroCategoria])

    const carregarMovimentacoes = async () => {
        try {
            const response = await movimentacoesAPI.getAll()
            setMovimentacoes(response)
        } catch (error) {
            console.error('Erro ao carregar movimentações:', error)
        } finally {
            setLoading(false)
        }
    }

    const aplicarFiltros = () => {
        let filtered = movimentacoes

        if (searchTerm) {
            filtered = filtered.filter(mov =>
                mov.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mov.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (filtroTipo !== 'todos') {
            filtered = filtered.filter(mov => mov.tipo === filtroTipo)
        }

        if (filtroCategoria !== 'todos') {
            filtered = filtered.filter(mov => mov.categoria === filtroCategoria)
        }

        setFilteredMovimentacoes(filtered)
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

    const calcularTotais = () => {
        const entradas = filteredMovimentacoes
            .filter(mov => mov.tipo === 'entrada')
            .reduce((total, mov) => total + parseFloat(mov.valor), 0)

        const saidas = filteredMovimentacoes
            .filter(mov => mov.tipo === 'saida')
            .reduce((total, mov) => total + parseFloat(mov.valor), 0)

        return { entradas, saidas, saldo: entradas - saidas }
    }

    const totais = calcularTotais()

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-32 sm:h-64">
                    <div className="text-white text-lg sm:text-xl">Carregando movimentações...</div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Movimentações</h1>
                        <p className="text-slate-400 text-sm sm:text-base mt-1">Histórico completo de entradas e saídas</p>
                    </div>
                    <button
                        onClick={() => navigate('/movimentacoes/nova')}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:opacity-90 transition-all font-medium text-sm sm:text-base"
                    >
                        <span className="sm:hidden">➕</span>
                        <span className="hidden sm:inline">➕ Nova Movimentação</span>
                    </button>
                </div>

                {/* Cards de Totais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-400 text-xs sm:text-sm">Total Entradas</p>
                                <p className="text-lg sm:text-2xl font-bold text-green-400 truncate">
                                    {formatarValor(totais.entradas)}
                                </p>
                            </div>
                            <div className="text-2xl sm:text-3xl ml-3">📈</div>
                        </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-400 text-xs sm:text-sm">Total Saídas</p>
                                <p className="text-lg sm:text-2xl font-bold text-red-400 truncate">
                                    {formatarValor(totais.saidas)}
                                </p>
                            </div>
                            <div className="text-2xl sm:text-3xl ml-3">📉</div>
                        </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-400 text-xs sm:text-sm">Saldo Filtrado</p>
                                <p className={`text-lg sm:text-2xl font-bold truncate ${totais.saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatarValor(totais.saldo)}
                                </p>
                            </div>
                            <div className="text-2xl sm:text-3xl ml-3">💰</div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base sm:text-lg font-semibold text-white">Filtros</h2>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="sm:hidden text-slate-400 hover:text-white"
                        >
                            {showFilters ? '🔼' : '🔽'}
                        </button>
                    </div>

                    <div className={`space-y-4 sm:space-y-0 ${showFilters ? 'block' : 'hidden sm:block'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Pesquisa */}
                            <div className="sm:col-span-2 lg:col-span-1">
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Pesquisar
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Descrição ou responsável..."
                                    className="w-full px-3 sm:px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Filtro por Tipo */}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Tipo
                                </label>
                                <select
                                    value={filtroTipo}
                                    onChange={(e) => setFiltroTipo(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-blue-500"
                                >
                                    <option value="todos">Todos</option>
                                    <option value="entrada">Entradas</option>
                                    <option value="saida">Saídas</option>
                                </select>
                            </div>

                            {/* Filtro por Categoria */}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Categoria
                                </label>
                                <select
                                    value={filtroCategoria}
                                    onChange={(e) => setFiltroCategoria(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-blue-500"
                                >
                                    <option value="todos">Todas</option>
                                    <option value="anuidades">Anuidades</option>
                                    <option value="provas">Provas</option>
                                    <option value="acessórios">Acessórios</option>
                                    <option value="despesas">Despesas</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Movimentações */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base sm:text-lg font-semibold text-white">
                            Movimentações ({filteredMovimentacoes.length})
                        </h2>
                    </div>

                    {filteredMovimentacoes.length === 0 ? (
                        <div className="text-center py-8 sm:py-12">
                            <div className="text-4xl sm:text-6xl mb-4">📊</div>
                            <p className="text-slate-400 text-base sm:text-lg">Nenhuma movimentação encontrada</p>
                            <p className="text-slate-500 text-xs sm:text-sm mt-2">Tente ajustar os filtros ou adicionar novas movimentações</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredMovimentacoes.map((mov) => (
                                <div key={mov.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mt-1 sm:mt-0 flex-shrink-0 ${mov.tipo === 'entrada' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-sm sm:text-base truncate">{mov.descricao}</p>
                                            <div className="flex flex-wrap gap-1 sm:gap-4 text-slate-400 text-xs sm:text-sm mt-1">
                                                <span className="bg-slate-600 px-2 py-1 rounded text-xs capitalize">{mov.categoria}</span>
                                                <span>{formatarData(mov.data)}</span>
                                                <span className="hidden sm:inline capitalize">{mov.forma_pagamento}</span>
                                                <span className="hidden lg:inline">por {mov.responsavel}</span>
                                            </div>
                                            {/* Info mobile */}
                                            <div className="sm:hidden text-slate-400 text-xs mt-1">
                                                {mov.forma_pagamento} • {mov.responsavel}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
                                        <p className={`text-lg sm:text-xl font-bold ${mov.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
                                            {mov.tipo === 'entrada' ? '+' : '-'}{formatarValor(mov.valor)}
                                        </p>
                                        <p className="text-slate-400 text-xs sm:text-sm capitalize">{mov.tipo}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Movimentacoes