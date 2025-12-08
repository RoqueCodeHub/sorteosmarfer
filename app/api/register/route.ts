// /app/api/registro/route.ts
import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx61tPN3ixF-j4HX9HM-e5ENi_0r_T3pjT4F3XCEZ_CsPT30Aer3pobmfK6GokZtZPG/exec";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Opcional: validaciones mínimas en servidor
    if (!body.nombres || !body.apellidos || !body.email) {
      return NextResponse.json({ status: "error", message: "Campos requeridos faltantes" }, { status: 400 });
    }

    // Reenvía al Apps Script como JSON
    const resp = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Leer la respuesta del Apps Script
    const text = await resp.text();
    // Intentamos parsear a JSON, si Apps Script retorna JSON lo usaremos
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { status: "success", message: text };
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API /api/register error:", err);
    return NextResponse.json({ status: "error", message: err.message ?? String(err) }, { status: 500 });
  }
}
