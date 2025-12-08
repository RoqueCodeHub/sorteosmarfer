"use client";

import React, { useState } from "react";
import { QrCode, CreditCard } from "lucide-react";

export default function PaymentSection() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    documentType: "DNI",
    documentNumber: "",
    email: "",
    phone: "",
    tickets: "1 ticket - S/ 5",
    department: "",
    // file will be stored as File | null in state
    paymentProof: null as File | null,
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
        // result: "data:<mime>;base64,<base64data>"
        resolve(result);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // validaciones
      if (!formData.paymentProof) {
        alert("Por favor sube el comprobante de pago.");
        setLoading(false);
        return;
      }
      if (!formData.firstName || !formData.lastName || !formData.email) {
        alert("Completa los campos requeridos.");
        setLoading(false);
        return;
      }

      // convertir archivo a base64 (dataURL)
      const comprobanteBase64 = await fileToBase64(formData.paymentProof as File);

      // armar payload con los nombres de campo que espera tu Google Script
      const payload = {
        nombres: formData.firstName,
        apellidos: formData.lastName,
        tipoDocumento: formData.documentType,
        numeroDocumento: formData.documentNumber,
        email: formData.email,
        celular: formData.phone,
        numeroTickets: formData.tickets,
        departamento: formData.department,
        // enviamos el nombre original del archivo y el base64 (dataURL)
        comprobanteFileName: (formData.paymentProof as File).name,
        comprobanteBase64,
      };

      // Enviamos al endpoint del servidor Next (proxy)
      const resp = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Error servidor proxy:", text);
        throw new Error("Error al enviar el formulario (proxy).");
      }

      const result = await resp.json();
      // result debería venir del Apps Script (id, status, message)
      if (result?.status === "success") {
        alert(`Registro completado.\nID: ${result.id ?? result.message}`);
        // reset opcional
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
        // limpiar input file visualmente (si tienes ref, puedes limpiarlo)
      } else {
        alert("Error en el registro: " + (result?.message ?? JSON.stringify(result)));
      }
    } catch (err) {
      console.error(err);
      alert("Error al enviar. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="payment" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-black mb-12">
          PARTICIPA AHORA
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Payment Methods (LEFT) */}
          <div>
            <h3 className="text-2xl font-bold text-black mb-8">Métodos de Pago</h3>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 mb-6 border-2 border-blue-200">
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
                <img src="/qr-code.png" alt="QR Code" className="w-40 h-40" />
              </div>
              <div className="text-center">
                <p className="text-black font-bold mb-2">Número Yape:</p>
                <p className="text-2xl font-bold text-blue-600 mb-2">+51 999 888 777</p>
                <p className="text-gray-600">Nombre: Sorteos Premium SAC</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border-2 border-purple-200">
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
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Banco: BCP</p>
                  <p className="text-lg font-bold text-black">123 456 789 012</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Banco: Interbank</p>
                  <p className="text-lg font-bold text-black">987 654 321 098</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form (RIGHT) */}
          <div>
            <h3 className="text-2xl font-bold text-black mb-8">Datos de Registro</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-semibold mb-2">Nombres *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Juan Carlos"
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold mb-2">Apellidos *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Pérez García"
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-semibold mb-2">Tipo de Documento *</label>
                  <select
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none transition"
                  >
                    <option>DNI</option>
                    <option>Pasaporte</option>
                    <option>Carnet Extranjería</option>
                  </select>
                </div>
                <div>
                  <label className="block text-black font-semibold mb-2">Número de Documento *</label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    placeholder="12345678"
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-black font-semibold mb-2">Correo Electrónico *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@ejemplo.com"
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-semibold mb-2">Número de Celular *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="999 999 999"
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold mb-2">Número de Tickets *</label>
                  <select
                    name="tickets"
                    value={formData.tickets}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none transition"
                  >
                    <option>1 ticket - S/ 5</option>
                    <option>1 ticket - S/ 10</option>
                    <option>1 ticket - S/ 20</option>
                    <option>1 tickets - S/ 30</option>
                    <option>1 tickets - S/ 40</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-semibold mb-2">Departamento *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none transition"
                    required
                  >
                    <option value="">Selecciona tu departamento</option>
                    <option>Lima</option>
                    <option>Arequipa</option>
                    <option>Cusco</option>
                    <option>Trujillo</option>
                    <option>Piura</option>
                  </select>
                </div>

                <div>
                  <label className="block text-black font-semibold mb-2">Comprobante *</label>
                  <input
                    type="file"
                    name="paymentProof"
                    accept="image/*,application/pdf"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition text-lg"
              >
                {loading ? "Enviando..." : "REGISTRARSE Y PARTICIPAR"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
