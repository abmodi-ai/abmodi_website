const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Redirect abmodi.com to abmodi.ai
app.use((req, res, next) => {
    const host = req.get('host');
    if (host && (host === 'abmodi.com' || host === 'www.abmodi.com')) {
        return res.redirect(301, `https://abmodi.ai${req.originalUrl}`);
    }
    next();
});

app.use(express.static(path.join(__dirname, 'dist')));

// Email Transporter (Google Workspace SMTP)
// Use port 587 and secure: false for STARTTLS (best for cloud environments)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'ab@abmodi.ai',
        pass: (process.env.EMAIL_APP_PASSWORD || '').trim(),
    },
    logger: true,
    debug: true
});

// Diagnostic check for the secret
const pwd = process.env.EMAIL_APP_PASSWORD || '';
console.log(`Diagnostic: Email Password detected. Length: ${pwd.length}, Starts with: ${pwd.charAt(0)}, Ends with: ${pwd.charAt(pwd.length - 1)}`);
if (pwd.length !== pwd.trim().length) {
    console.log('WARNING: Password contained whitespace that has been trimmed.');
}

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    const mailOptions = {
        from: `"Website Contact Form" <ab@abmodi.ai>`,
        to: 'ab@abmodi.ai',
        subject: `New Inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #00f2ff;">New Website Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully from ${email}`);
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

// Fallback for SPA
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
