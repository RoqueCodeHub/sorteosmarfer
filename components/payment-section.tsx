"use client";

import React, { useState, useRef } from "react"; // ⬅️ IMPORTADO: useRef
// Importaciones de iconos
import { QrCode, CreditCard } from "lucide-react"; 

// 🚨 [IMPORTANTE] Asegúrate de que esta ruta sea correcta para tu proyecto
// Asumo que ConfirmationModal.tsx está en el mismo directorio.
import { ConfirmationModal } from './ConfirmationModal'; 


// Definición de la estructura del estado del formulario para mejor tipado (opcional)
interface FormData {
    firstName: string;
    lastName: string;
    documentType: "DNI" | "Pasaporte" | "Carnet Extranjería";
    documentNumber: string;
    email: string;
    phone: string;
    tickets: string;
    department: string;
    paymentProof: File | null;
}


export default function PaymentSection() {
    // 1. AÑADIR NUEVOS ESTADOS PARA EL MODAL
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // Controla si el modal es visible
    const [registroId, setRegistroId] = useState(''); // Almacena el ID del registro exitoso

    // 🔑 REFERENCIA: Para controlar el input de tipo file directamente en el DOM
    const fileInputRef = useRef<HTMLInputElement>(null); // ⬅️ NUEVO: Declaración de la Ref

    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        documentType: "DNI",
        documentNumber: "",
        email: "",
        phone: "",
        // Nota: Los valores de los tickets se extraen del string completo en el payload
        tickets: "1 ticket - S/ 5", 
        department: "",
        paymentProof: null,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement;

        if (type === "file" && "files" in e.target) {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).files?.[0] ?? null,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // util: convertir File -> base64
    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result);
            };
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });

    // 2. FUNCIÓN PARA CERRAR EL MODAL
    const closeModal = () => {
        setShowModal(false);
        // Opcional: Podrías hacer un reset general o redirigir aquí.
        // setFormData(valores iniciales); // Si quieres resetear el formulario
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validaciones básicas
            if (!formData.paymentProof) {
                alert("Por favor sube el comprobante de pago.");
                setLoading(false);
                return;
            }
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.department || !formData.phone || !formData.documentNumber) {
                alert("Completa todos los campos requeridos (marcados con *).");
                setLoading(false);
                return;
            }

            // Convertir archivo a base64 (dataURL)
            const comprobanteBase64 = await fileToBase64(formData.paymentProof as File);

            // Armar payload
            const payload = {
                nombres: formData.firstName,
                apellidos: formData.lastName,
                tipoDocumento: formData.documentType,
                numeroDocumento: formData.documentNumber,
                email: formData.email,
                celular: formData.phone,
                // Extraer solo la cantidad de tickets o el valor relevante para el backend
                numeroTickets: formData.tickets.split(" - ")[0], 
                departamento: formData.department,
                comprobanteFileName: (formData.paymentProof as File).name,
                comprobanteBase64,
            };

            // Simulamos la llamada al API
            const resp = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            // 🛑 CRÍTICO: Comprobación de respuesta HTTP OK
            if (!resp.ok) {
                const text = await resp.text();
                console.error("Error servidor proxy (HTTP no 200):", text);
                throw new Error("Error al enviar el formulario (proxy).");
            }

            // Leemos el JSON limpio que viene del Apps Script (a través del proxy)
            const result = await resp.json();
            
            if (result?.status === "success") {
                // ✅ ÉXITO: USAMOS EL MODAL EN LUGAR DE ALERT
                setRegistroId(result.id ?? "N/A"); // Guardamos el ID
                setShowModal(true); // Mostramos el Modal
                
                // Reseteamos el estado del formulario a los valores iniciales
                setFormData({
                    firstName: "", 
                    lastName: "", 
                    documentType: "DNI",
                    documentNumber: "",
                    email: "", 
                    phone: "",
                    tickets: "1 ticket - S/ 5", 
                    department: "", 
                    paymentProof: null,
                });
                
                // 🔑 APLICACIÓN DEL FIX: Resetear el valor del input file en el DOM
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Esto limpia el nombre del archivo visible por el usuario
                }
                
            } else {
                // Error lógico: Apps Script devolvió status: 'error'
                alert("Error en el registro: " + (result?.message ?? JSON.stringify(result)));
            }
        } catch (err) {
            console.error(err);
            // ❌ Error de red o error de procesamiento grave.
            alert("Error al enviar. Revisa la consola para más detalles.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="payment" className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-black mb-12">
                    PARTICIPA AHORA 🎟️
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Payment Methods (LEFT) */}
                    <div>
                        <h3 className="text-2xl font-bold text-black mb-8">Métodos de Pago</h3>

                        {/* Yape Section */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 mb-6 border-2 border-blue-200 shadow-lg">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-blue-600 text-white p-3 rounded-lg">
                                    <QrCode size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-black">Pago con Yape</h4>
                                    <p className="text-gray-600">Escanea el código QR</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-6 mb-6 flex items-center justify-center h-48">
                                {/* Simulación de imagen QR */}
                                

[Image of Yape QR Code for payment]

                            </div>
                            <div className="text-center">
                                <p className="text-black font-bold mb-2">Número Yape:</p>
                                <p className="text-2xl font-bold text-blue-600 mb-2">+51 999 888 777</p>
                                <p className="text-gray-600">Nombre: Sorteos Premium SAC</p>
                            </div>
                        </div>

                        {/* Transferencia Bancaria Section */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-purple-600 text-white p-3 rounded-lg">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-black">Transferencia Bancaria</h4>
                                    <p className="text-gray-600">Realiza tu pago a estas cuentas</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <p className="text-sm text-gray-600">Banco: **BCP**</p>
                                    <p className="text-lg font-bold text-black">123 456 789 012</p>
                                    <p className="text-sm text-gray-500">CCI: 002-123-456789012-34</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <p className="text-sm text-gray-600">Banco: **Interbank**</p>
                                    <p className="text-lg font-bold text-black">987 654 321 098</p>
                                    <p className="text-sm text-gray-500">CCI: 003-987-654321098-76</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form (RIGHT) */}
                    <div>
                        <h3 className="text-2xl font-bold text-black mb-8">Datos de Registro y Comprobante</h3>
                        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-2xl shadow-xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Input Nombres */}
                                <div>
                                    <label className="block text-black font-semibold mb-2">Nombres *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Juan Carlos"
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none transition"
                                        required
                                    />
                                </div>
                                {/* Input Apellidos */}
                                <div>
                                    <label className="block text-black font-semibold mb-2">Apellidos *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Pérez García"
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Select Tipo Documento */}
                                <div>
                                    <label className="block text-black font-semibold mb-2">Tipo de Documento *</label>
                                    <select
                                        name="documentType"
                                        value={formData.documentType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none transition appearance-none"
                                        required
                                    >
                                        <option value="DNI">DNI</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                        <option value="Carnet Extranjería">Carnet Extranjería</option>
                                    </select>
                                </div>
                                {/* Input Número Documento */}
                                <div>
                                    <label className="block text-black font-semibold mb-2">Número de Documento *</label>
                                    <input
                                        type="text"
                                        name="documentNumber"
                                        value={formData.documentNumber}
                                        onChange={handleChange}
                                        placeholder="12345678"
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Input Correo Electrónico */}
                            <div>
                                <label className="block text-black font-semibold mb-2">Correo Electrónico *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="juan@ejemplo.com"
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none transition"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Input Número de Celular */}
                                <div>
                                    <label className="block text-black font-semibold mb-2">Número de Celular *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="999 999 999"
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none transition"
                                        required
                                    />
                                </div>
                                {/* Select Número de Tickets */}
                                <div>
                                
                                <label className="block text-black font-semibold mb-2">Número de Tickets *</label>
                                <select
                                    name="tickets"
                                    value={formData.tickets}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none transition appearance-none"
                                    required
                                >
                                    <option>Seleccionar</option>
                                    {/* Genera las opciones del 1 al 10 */}
                                    {[...Array(10)].map((_, index) => {
                                        const numTickets = index + 1;
                                        return (
                                            <option key={numTickets} value={numTickets}>
                                                {numTickets} 
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Select Departamento */}
                                <div>
                                    <label className="block text-black font-semibold mb-2">Departamento *</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none transition appearance-none"
                                        required
                                    >
                                        <option value="">Selecciona tu departamento</option>
                                        <option value="AMAZONAS">Amazonas</option>
                                        <option value="ANCASH">Áncash</option>
                                        <option value="APURIMAC">Apurímac</option>
                                        <option value="AREQUIPA">Arequipa</option>
                                        <option value="AYACUCHO">Ayacucho</option>
                                        <option value="CAJAMARCA">Cajamarca</option>
                                        <option value="CALLAO">Callao</option>
                                        <option value="CUSCO">Cusco</option>
                                        <option value="HUANCAVELICA">Huancavelica</option>
                                        <option value="HUANUCO">Huánuco</option>
                                        <option value="ICA">Ica</option>
                                        <option value="JUNIN">Junín</option>
                                        <option value="LA_LIBERTAD">La Libertad</option>
                                        <option value="LAMBAYEQUE">Lambayeque</option>
                                        <option value="LIMA">Lima</option>
                                        <option value="LORETO">Loreto</option>
                                        <option value="MADRE_DE_DIOS">Madre de Dios</option>
                                        <option value="MOQUEGUA">Moquegua</option>
                                        <option value="PASCO">Pasco</option>
                                        <option value="PIURA">Piura</option>
                                        <option value="PUNO">Puno</option>
                                        <option value="SAN_MARTIN">San Martín</option>
                                        <option value="TACNA">Tacna</option>
                                        <option value="TUMBES">Tumbes</option>
                                        <option value="UCAYALI">Ucayali</option>
                                        <option>Otros</option>
                                    </select>
                                </div>
                                {/* Input Comprobante */}
                                <div>
                                    <label className="block text-black font-semibold mb-2">Comprobante *</label>
                                    <input
                                        type="file"
                                        name="paymentProof"
                                        accept="image/*,application/pdf"
                                        onChange={handleChange}
                                        // 🔑 VINCULADO: Referencia al input file
                                        ref={fileInputRef} 
                                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 file:cursor-pointer
                                        text-gray-500 bg-white border-2 border-gray-300 rounded-lg p-2 focus:border-orange-600 focus:outline-none transition /h"
                                        required
                                    />
                                    {formData.paymentProof && (
                                        <p className="text-xs text-green-600 mt-1">Archivo subido: {formData.paymentProof.name}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full px-6 py-4 font-bold rounded-lg transition text-lg shadow-md ${
                                    loading 
                                        ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                                        : "bg-orange-600 text-white hover:bg-orange-700"
                                }`}
                            >
                                {loading ? "Enviando Registro..." : "REGISTRARSE Y PARTICIPAR"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* 3. Renderizar el Modal Condicionalmente al final del componente */}
            {showModal && (
                <ConfirmationModal 
                    id={registroId} 
                    onClose={closeModal} 
                />
            )}

        </section>
    );
}