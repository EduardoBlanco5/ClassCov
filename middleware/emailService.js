import nodemailer from 'nodemailer';

//Contraseña para nodemailer generada por google
//rrxo xiee rent zzvl

const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto según el servicio que uses (Gmail, Outlook, etc.)
    auth: {
        user: 'classcovestudiantil@gmail.com', // Reemplázalo con tu correo
        pass: 'rrxoxieerentzzvl', // Usa una contraseña de aplicación (no la normal)
    },
});

export const sendEmail = async (to, subject, text, fromEmail, fromName) => {
    try {
        await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`, // Usar el nombre y correo del profesor
            to, // Destinatario
            subject, // Asunto
            text, // Contenido del correo
        });
        console.log(`Correo enviado a ${to}`);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};

