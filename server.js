const fastify = require('fastify')({ logger: true });
const nodemailer = require('nodemailer');
const cors = require('@fastify/cors');

// Configuration CORS
fastify.register(cors, {
  origin: true, // Autoriser toutes les origines (à modifier en production)
  methods: ['POST']
});

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com', // ex: smtp.gmail.com
  port: 587,
  secure: false, // true pour le port 465, false pour les autres ports
  auth: {
    user: 'amslubfontainegeneration@gmail.com',
    pass: 'wnzzjzzeqbdmixag'
  }
});

// Template email HTML
const emailTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Montserrat', Arial, sans-serif;
            background-color: #0f172a;
            color: #f8fafc;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1e293b;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            color: white;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .detail-item {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #334155;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 5px;
        }
        .footer {
            background-color: #0f172a;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nouveau message de contact</h1>
        </div>
        <div class="content">
            <div class="detail-item">
                <div class="label">Nom complet</div>
                <div>${data.name}</div>
            </div>
            <div class="detail-item">
                <div class="label">Email</div>
                <div>${data.email}</div>
            </div>
            <div class="detail-item">
                <div class="label">Type de projet</div>
                <div>${data.projectType}</div>
            </div>
            <div class="detail-item">
                <div class="label">Message</div>
                <div>${data.message}</div>
            </div>
        </div>
        <div class="footer">
            <p>© 2025 LiboriusDev - Tous droits réservés</p>
            <p>Ce message a été envoyé depuis le formulaire de contact de votre site web</p>
        </div>
    </div>
</body>
</html>
`;

// Route pour traiter le formulaire de contact
fastify.post('/api/contact', async (request, reply) => {
  const { name, email, projectType, message } = request.body;

  // Configuration de l'email
  const mailOptions = {
    from: 'amslubfontainegeneration@gmail.com',
    to: 'amslubfontainegeneration@gmail.com',
    subject: `Nouveau message de ${name} - Type: ${projectType}`,
    html: emailTemplate({ name, email, projectType, message })
  };

  try {
    // Envoi de l'email
    await transporter.sendMail(mailOptions);
    
    // Réponse de succès
    reply.send({ success: true, message: 'Message envoyé avec succès' });
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ success: false, message: 'Erreur lors de l\'envoi du message' });
  }
});

// Démarrage du serveur
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
