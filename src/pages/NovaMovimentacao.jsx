import { useState } from 'react'
import Layout from '../components/Layout/Layout'
import { movimentacoesAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

const NovaMovimentacao = () => {
    const [formData, setFormData] = useState({
        descricao: '',
        valor: '',
        tipo: 'entrada',
        categoria: 'anuidades',
        forma_pagamento: 'pix',
        data: new Date().toISOString().split('T')[0]
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await movimentacoesAPI.create({
                ...formData,
                valor: parseFloat(formData.valor)
            })

            navigate('/movimentacoes')
        } catch (error) {
            setError(error.response?.data?.message || 'Erro ao criar movimentação')
        } finally {
            setLoading(false)
        }
    }

    const formatarValorPreview = () => {
        if (!formData.valor) return 'R$ 0,00'
        const valor = parseFloat(formData.valor)
        if (isNaN(valor)) return 'R$ 0,00'
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor)
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Nova Movimentação</h1>
                        <p className="text-slate-400 text-sm sm:text-base mt-1">Registre uma nova entrada ou saída</p>
                    </div>
                    <button
                        onClick={() => navigate('/movimentacoes')}
                        className="text-slate-400 hover:text-white text-sm sm:text-base"
                    >
                        ← Voltar
                    </button>
                </div>

                {/* Preview Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold text-white mb-4">Preview</h2>
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${formData.tipo === 'entrada' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm sm:text-base truncate">
                                    {formData.descricao || 'Descrição da movimentação'}
                                </p>
                                <div className="flex flex-wrap gap-2 text-slate-400 text-xs sm:text-sm">
                                    <span className="bg-slate-600 px-2 py-1 rounded capitalize">{formData.categoria}</span>
                                    <span>{formData.data ? new Date(formData.data).toLocaleDateString('pt-BR') : 'Data'}</span>
                                    <span className="capitalize">{formData.forma_pagamento}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right ml-4">
                            <p className={`text-lg sm:text-xl font-bold ${formData.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>
                                {formData.tipo === 'entrada' ? '+' : '-'}{formatarValorPreview()}
                            </p>
                            <p className="text-slate-400 text-xs sm:text-sm capitalize">{formData.tipo}</p>
                        </div>
                    </div>
                </div>

                {/* Formulário */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Tipo e Valor */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Tipo *
                                </label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-blue-500"
                                >
                                    <option value="entrada">💚 Entrada</option>
                                    <option value="saida">❤️ Saída</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Valor (R$) *
                                </label>
                                <input
                                    type="number"
                                    name="valor"
                                    value={formData.valor}
                                    onChange={handleChange}
                                    placeholder="0,00"
                                    step="0.01"
                                    min="5"
                                    max="10000"
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                        {/* Descrição */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Descrição *
                            </label>
                            <input
                                type="text"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                placeholder="Ex: Anuidade - João Silva"
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Categoria e Forma de Pagamento */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Categoria *
                                </label>
                                <select
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-blue-500"
                                >
                                    <option value="anuidades">Anuidades</option>
                                    <option value="provas">Provas</option>
                                    <option value="acessórios">Acessórios</option>
                                    <option value="despesas">Despesas</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Forma de Pagamento *
                                </label>
                                <select
                                    name="forma_pagamento"
                                    value={formData.forma_pagamento}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-blue-500"
                                >
                                    <option value="pix">PIX</option>
                                    <option value="dinheiro">Dinheiro</option>
                                    <option value="cartao">Cartão</option>
                                </select>
                            </div>
                        </div>

                        {/* Data */}
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">
                                Data *
                            </label>
                            <input
                                type="date"
                                name="data"
                                value={formData.data}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/movimentacoes')}
                                className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm sm:text-base"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 sm:py-3 rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {loading ? 'Salvando...' : 'Salvar Movimentação'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default NovaMovimentacao