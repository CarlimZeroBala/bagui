require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/api');

const app = express();

/**
 * CONFIGURAÇÃO DE CORS
 * O erro "falta cabeçalho Access-Control-Allow-Origin" acontece porque o navegador
 * bloqueia a resposta por segurança. app.use(cors()) sem parâmetros libera o acesso
 * de qualquer origem, o que é ideal para sua fase de testes locais.
 */
app.use(cors());

/**
 * MIDDLEWARES DE PARSE
 * express.json(): Necessário para a rota de Newsletter (recebe JSON)
 * express.urlencoded(): Boa prática para lidar com submissões de formulários padrão
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * DEFINIÇÃO DE ROTAS
 * Centralizamos todas as rotas de backend (Contato, Newsletter, Disparo) 
 * sob o prefixo /api para organização.
 */
app.use('/api', apiRoutes);

/**
 * INICIALIZAÇÃO DO SERVIDOR
 * O servidor utilizará a porta definida no seu arquivo .env ou a 3000 por padrão.
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('---------------------------------------------------');
    console.log(`🚀 SERVIDOR BACKEND RODANDO NA PORTA: ${PORT}`);
    console.log(`✅ CORS liberado para testes no navegador`);
    console.log(`📂 Endpoints disponíveis em: http://localhost:${PORT}/api`);
    console.log('---------------------------------------------------');
});