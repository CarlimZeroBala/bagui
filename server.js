require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/api');

const app = express();

/**
 * CONFIGURAÇÃO DE CORS (PRODUÇÃO)
 * Agora que você está no Render, restringimos o acesso apenas 
 * ao domínio oficial para garantir a segurança.
 */
const corsOptions = {
  origin: 'https://newsite.nuvem.online', // Domínio do site real
  methods: ['POST'],                      // Permitimos apenas POST (Forms/Newsletter)
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

/**
 * MIDDLEWARES
 * Necessários para que o Express entenda o corpo das requisições (JSON e URL Encoded).
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ROTAS
 * Centraliza todas as operações sob o prefixo /api.
 */
app.use('/api', apiRoutes);

/**
 * INICIALIZAÇÃO
 * O Render define automaticamente a variável PORT no ambiente.
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`---------------------------------------------------`);
    console.log(`🚀 SERVIDOR EM PRODUÇÃO RODANDO NA PORTA: ${PORT}`);
    console.log(`🔒 ORIGEM PERMITIDA: ${corsOptions.origin}`);
    console.log(`---------------------------------------------------`);
});
