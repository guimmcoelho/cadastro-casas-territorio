"use client";

import { useState, useEffect } from "react";

const TIPOS_CASA = [
  "Residencia",
  "Comércio",
  "Fundos",
  "Sobrado",
  "Casa 1",
  "Casa 2",
  "Casa 3",
  "Casa 4",
  "Casa 5"
];

export default function CadastroTerritorio() {
  const [territorios, setTerritorios] = useState([]);
  const [quadras, setQuadras] = useState([]);
  const [ruas, setRuas] = useState([]);
  const [dados, setDados] = useState([]);

  const [territorioSelecionado, setTerritorioSelecionado] = useState("");
  const [quadraSelecionada, setQuadraSelecionada] = useState("");
  const [ruaSelecionada, setRuaSelecionada] = useState("");
  const [casas, setCasas] = useState([]);

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbzCdKzkELIhzQi12Zulhyq3U6bBoa2yqEodwa3q73d3LVqec8ukzdnKhdMNggisJL72/exec")
      .then((res) => res.json())
      .then((data) => {
        setDados(data);
        const territ = [...new Set(data.map((row) => row.Território))];
        setTerritorios(territ);
      });
  }, []);

  useEffect(() => {
    if (!territorioSelecionado) return;
    const quadrasFiltradas = dados
      .filter((row) => row.Território === territorioSelecionado)
      .map((row) => row.Quadra);
    setQuadras([...new Set(quadrasFiltradas)]);
    setQuadraSelecionada("");
    setRuaSelecionada("");
    setCasas([]);
  }, [territorioSelecionado]);

  useEffect(() => {
    if (!quadraSelecionada) return;
    const ruasFiltradas = dados
      .filter(
        (row) =>
          row.Território === territorioSelecionado &&
          row.Quadra === quadraSelecionada
      )
      .map((row) => row.Rua);
    setRuas([...new Set(ruasFiltradas)]);
    setRuaSelecionada("");
    setCasas(Array.from({ length: 5 }, () => ({ numero: "", tipo: "" })));
  }, [quadraSelecionada]);

  const adicionarCasa = () => {
    setCasas([...casas, { numero: "", tipo: "" }]);
  };

  const atualizarCasa = (index, campo, valor) => {
    const novasCasas = casas.map((casa, idx) =>
      idx === index ? { ...casa, [campo]: valor } : casa
    );
    setCasas(novasCasas);
  };

  const handleSalvar = async () => {
    const casasValidas = casas.filter(casa => casa.numero.trim() !== "");

    if (casasValidas.length === 0) {
      alert("Nenhuma casa foi preenchida para salvar.");
      return;
    }

    const payload = {
      territorio: territorioSelecionado,
      quadra: quadraSelecionada,
      rua: ruaSelecionada,
      casas: casasValidas,
      data: new Date().toLocaleString(),
    };

    try {
      const response = await fetch("/api/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.status === "sucesso") {
        alert("Dados salvos com sucesso!");
        setTerritorioSelecionado(""); // Isso aciona os useEffect para resetar quadra, rua e casas
      } else {
        alert("Ocorreu um erro ao salvar os dados.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar os dados.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Cadastro de Casas por Território</h1>
      <div className="border p-4 rounded shadow bg-white space-y-4">
        <div>
          <label className="block mb-1 font-medium">Território</label>
          <select
            className="w-full p-2 border rounded"
            value={territorioSelecionado}
            onChange={(e) => setTerritorioSelecionado(e.target.value)}
          >
            <option value="">Selecione...</option>
            {territorios.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {quadras.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Quadra</label>
            <select
              className="w-full p-2 border rounded"
              value={quadraSelecionada}
              onChange={(e) => setQuadraSelecionada(e.target.value)}
            >
              <option value="">Selecione...</option>
              {quadras.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>
        )}

        {ruas.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Rua</label>
            <select
              className="w-full p-2 border rounded"
              value={ruaSelecionada}
              onChange={(e) => setRuaSelecionada(e.target.value)}
            >
              <option value="">Selecione...</option>
              {ruas.map((rua) => (
                <option key={rua} value={rua}>{rua}</option>
              ))}
            </select>
          </div>
        )}

        {ruaSelecionada && (
          <div className="space-y-4 border rounded p-4 bg-gray-50 shadow-sm">
            <label className="text-lg font-medium">Casas cadastradas</label>
            <div className="flex gap-2 font-medium">
              <div className="flex-1">Número</div>
              <div className="flex-1">Tipo</div>
            </div>
            {casas.map((casa, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <div className="flex-1">
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="Ex: 101"
                    value={casa.numero}
                    onChange={(e) => atualizarCasa(idx, "numero", e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <select
                    className="w-full p-2 border rounded"
                    value={casa.tipo}
                    onChange={(e) => atualizarCasa(idx, "tipo", e.target.value)}
                  >
                    <option value="">Selecione tipo</option>
                    {TIPOS_CASA.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <button type="button" onClick={adicionarCasa} className="w-full border p-2 rounded bg-white hover:bg-gray-100">
              + Adicionar casa
            </button>
          </div>
        )}

        {ruaSelecionada && casas.length > 0 && (
          <button
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            onClick={handleSalvar}
          >
            Salvar dados
          </button>
        )}
      </div>
    </div>
  );
}
