import nodemailer from 'nodemailer';

//Contraseña para nodemailer generada por google
//xruc tirz vsuf jwyc

const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto según el servicio que uses (Gmail, Outlook, etc.)
    auth: {
        user: 'eduardoblanco58@gmail.com', // Reemplázalo con tu correo
        pass: 'xructirzvsufjwyc', // Usa una contraseña de aplicación (no la normal)
    },
});

export const sendEmail = async (to, subject, text, from) => {
    try {
        await transporter.sendMail({
            from: `"${teacherName}" <eduardoblanco58@gmail.com>`, // Usamos el correo del profesor aquí
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

