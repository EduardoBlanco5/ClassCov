import React from 'react';
import { BookOpen, Mail, Lock, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input} from "@heroui/input";
import {Card, CardHeader, CardBody, CardFooter, Button, Form} from "@heroui/react";
import { ToastContainer, toast } from 'react-toastify';

const URI = 'http://localhost:4000/auth/login'

function Login() {
    

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errors, setErrors] = useState(null); // Estado para mensajes de error
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {

        // Code to run after component has loaded
        document.getElementById("navBar").style.display = 'none'
    }, []);

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        // console.log(password, email);
        try {
            const response = await axios.post(URI, { email, password });
    
            const { token, role, name, id } = response.data; // Asegúrate de que tu API devuelva el rol y el ID correcto
            login(token, role, name, id); // Llama a login con el token y rol
            
            // Guarda los datos en localStorage según el rol
            localStorage.setItem('role', role); 
            if (role === 'teacher') {
                localStorage.setItem('teacher_id', id);
            } else if (role === 'student') {
                localStorage.setItem('student_id', id);
            }
            const hidenav = document.getElementById("navBar").style.display = 'block'
            
            navigate('/Home'); // Redirige al usuario a /Home después del login
        } catch (err) {
            const notify = ()=>{ toast.error('Usuario o contraseña incorrectos')}
            console.error('Error al iniciar sesión:', err);
            
            setErrors('Usuario o contraseña incorrectos');
            notify()
            setTimeout(() => {
                setErrors(null);
                
            }, 2000);
    
        }
        setErrors({});
        
    }
    
    return (
    
    <div className={`min-h-screen bg-[#daedea] dark:bg-[#1a1c18] flex items-center justify-center p-4 `}>
        <Card className="flex flex-col md:flex-row w-full max-w-4xl">
        {/* Left Side - Image */}
        <div className="md:w-1/2 bg-[#afbf73] dark:bg-[#8a9c4d] rounded-l-2xl p-12 text-white flex flex-col justify-center items-center relative">
            <Button
            isIconOnly
            variant="light"
            onPress={() => setIsDark(!isDark)}
            className="text-white absolute top-4 right-4"
            >
            {/* {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} */}
            </Button>
            <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-12 h-12" />
            <h1 className="text-4xl font-bold">ClassCov</h1>
            </div>
            <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Education"
            className="rounded-xl shadow-lg max-w-[80%] hidden md:block"
            />
            <p className="text-lg mt-8 text-center">
            Bienvenido a tu espacio de aprendizaje virtual
            </p>
        </div>

        {/* Right Side - Login Form */}
        <CardBody className="md:w-1/2 p-12 bg-white rounded-e-lg">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h2 className="text-3xl font-bold mb-8">Iniciar Sesión</h2>
            </CardHeader>
            <Form onSubmit={handleSubmit} className="space-y-6" validationErrors={errors}>
            <Input
            className=' z-10'
                type="email"
                label="Correo Electrónico"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Mail className="text-default-400 w-4 h-4" />}
                variant="bordered"
                isRequired
                classNames="max-w-xs"
                validate={(value) => {
                    if (value.length < 3) {
                        return "Username must be at least 3 characters long";
                    }
        
                    return value === "admin" ? "Buen Intento!" : null;
                }}
            />

            <Input
                type="password"
                label="Contraseña"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startContent={<Lock className="text-default-400 w-4 h-4" />}
                variant="bordered"
                labelPlacement="outside"
                classNames={{
                input: "pl-1",
                }}
            />
            

            

            <Button
                type="submit"
                className="w-full  bg-[#afbf73] dark:bg-[#8a9c4d] text-white"
                size="lg"
            >
                Iniciar Sesión
            </Button>

            
            </Form>
            <ToastContainer
                    
            />
        </CardBody>

        </Card>
    </div>

    )
}

export default Login