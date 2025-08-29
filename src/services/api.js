import axios from 'axios'

// Configuração base da API
const api = axios.create({
    baseURL: 'http://localhost:3333/api', // URL do nosso backend
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido/expirado - redirecionar para login
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Funções da API
export const authAPI = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        return response.data
    },
}

export const movimentacoesAPI = {
    getAll: async () => {
        const response = await api.get('/movimentacoes')
        return response.data
    },

    getSaldo: async () => {
        const response = await api.get('/movimentacoes/saldo')
        return response.data
    },

    create: async (dados) => {
        const response = await api.post('/movimentacoes', dados)
        return response.data
    },
}

export const usersAPI = {
    getAll: async () => {
        const response = await api.get('/users')
        return response.data
    },
}

export default api