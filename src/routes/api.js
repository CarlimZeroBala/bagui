const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Resend } = require('resend');
const supabase = require('../config/supabase');

// Configuração do Multer
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

const resend = new Resend(process.env.RESEND_API_KEY);

// --- ROTA DE CONTATO ATUALIZADA ---
// IMPORTANTE: Estou assumindo que o input do arquivo tem name="arquivo".
// Se não funcionar, peça para inspecionarem a div .anexar-botao e verem o name.
router.post('/contact', upload.single('arquivo'), async (req, res) => {
    try {
        // Agora desestruturamos usando os nomes EM PORTUGUÊS que vimos no HTML
        const { nome, email, mensagem } = req.body;
        const file = req.file;

        console.log("Dados recebidos:", { nome, email, mensagem, file: file ? 'Sim' : 'Não' });

        const attachments = file ? [{
            filename: file.originalname,
            content: file.buffer
        }] : [];

        await resend.emails.send({
            from: 'Formulário Site <onboarding@resend.dev>',
            to: process.env.ADMIN_EMAIL,
            subject: `Novo contato de: ${nome}`, // Usando variável 'nome'
            html: `
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${mensagem}</p>
            `,
            attachments: attachments
        });

        res.status(200).json({ success: true, message: 'Email enviado!' });

    } catch (error) {
        console.error('Erro no contato:', error);
        res.status(500).json({ error: 'Erro ao processar envio.' });
    }
});

// --- ROTA NEWSLETTER (Manteve igual, pois o name="email" é padrão) ---
router.post('/newsletter/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email obrigatório' });

    const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: email }]);

    if (error) {
        if (error.code === '23505') {
            return res.status(200).json({ message: 'Email já cadastrado.' });
        }
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ success: true, message: 'Inscrito com sucesso!' });
});

// --- ROTA DISPARO MANUAL (Mantida) ---
router.post('/newsletter/send-campaign', async (req, res) => {
    const { subject, htmlContent, adminSecret } = req.body;

    if (adminSecret !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    const { data: subscribers, error } = await supabase
        .from('newsletter_subscribers')
        .select('email');

    if (error) return res.status(500).json({ error: 'Erro ao buscar lista' });

    const emailBatch = subscribers.map(sub => ({
        from: 'Newsletter <onboarding@resend.dev>',
        to: sub.email,
        subject: subject,
        html: htmlContent
    }));

    try {
        await resend.batch.send(emailBatch);
        res.status(200).json({ success: true, count: subscribers.length });
    } catch (err) {
        res.status(500).json({ error: 'Erro no disparo em massa' });
    }
});

module.exports = router;