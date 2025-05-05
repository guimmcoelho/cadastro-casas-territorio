export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzHiDhwImTNbR_1XjuXx_yj1IUuielCXZpyS9O4g4RlT8zSS5RC8HYdAgDX16wekDOS/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const result = await response.text();
    res.status(200).json({ status: "sucesso", resposta: result });
  } catch (error) {
    console.error("Erro no proxy:", error);
    res.status(500).json({ status: "erro", mensagem: error.message });
  }
}
