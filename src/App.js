import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const TIPOS_CASA = [
  "Residencia", "Comércio", "Fundos", "Sobrado",
  "Casa 1", "Casa 2", "Casa 3", "Casa 4", "Casa 5"
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
      .then(res => res.json())
      .then(data => {
        setDados(data);
        const territ = [...new Set(data.map(row => row.Território))];
        setTerritorios(territ);
      });
  }, []);

  useEffect(() => {
    if (!territorioSelecionado) return;
    const quadrasFiltradas = dados
      .filter(row => row.Território === territorioSelecionado)
      .map(row => row.Quadra);
    setQuadras([...new Set(quadrasFiltradas)]);
    setQuadraSelecionada("");
    setRuaSelecionada("");
    setCasas([]);
  }, [territorioSelecionado]);

  useEffect(() => {
    if (!quadraSelecionada) return;
    const ruasFiltradas = dados
      .filter(row => row.Território === territorioSelecionado && row.Quadra === quadraSelecionada)
      .map(row => row.Rua);
    setRuas([...new Set(ruasFiltradas)]);
    setRuaSelecionada("");
    setCasas(new Array(5).fill({ numero: "", tipo: "" }));
  }, [quadraSelecionada]);

  const adicionarCasa = () => {
    setCasas([...casas, { numero: "", tipo: "" }]);
  };

  const atualizarCasa = (index, campo, valor) => {
    const novasCasas = [...casas];
    novasCasas[index][campo] = valor;
    setCasas(novasCasas);
  };

  const handleSalvar = async () => {
    const payload = {
      territorio: territorioSelecionado,
      quadra: quadraSelecionada,
      rua: ruaSelecionada,
      casas,
      data: new Date().toLocaleString(),
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyquMypcAT9b7HozoabGE-gRTX2qoXptCBdpq7hCZm4Q6GnsdPOuTn8dK0wCLUR5jtt/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      alert(result.status === "sucesso" ? "Dados salvos com sucesso!" : "Erro ao salvar os dados.");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar os dados.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Cadastro de Casas por Território</h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label>Território</Label>
            <select className="w-full p-2 border rounded" value={territorioSelecionado} onChange={e => setTerritorioSelecionado(e.target.value)}>
              <option value="">Selecione...</option>
              {territorios.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {quadras.length > 0 && (
            <div>
              <Label>Quadra</Label>
              <select className="w-full p-2 border rounded" value={quadraSelecionada} onChange={e => setQuadraSelecionada(e.target.value)}>
                <option value="">Selecione...</option>
                {quadras.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          )}
          {ruas.length > 0 && (
            <div className="border-t pt-4">
              <Label>Rua</Label>
              <select className="w-full p-2 border rounded" value={ruaSelecionada} onChange={e => setRuaSelecionada(e.target.value)}>
                <option value="">Selecione...</option>
                {ruas.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}
          {ruaSelecionada && (
            <div className="space-y-4 border rounded p-4 bg-gray-50 shadow-sm">
              <Label className="text-lg">Casas cadastradas</Label>
              <div className="flex gap-2 font-medium">
                <div className="flex-1">Número</div>
                <div className="flex-1">Tipo</div>
              </div>
              {casas.map((casa, idx) => (
                <div key={idx} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input placeholder="Ex: 101" value={casa.numero} onChange={e => atualizarCasa(idx, "numero", e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <select className="w-full p-2 border rounded" value={casa.tipo} onChange={e => atualizarCasa(idx, "tipo", e.target.value)}>
                      <option value="">Selecione tipo</option>
                      {TIPOS_CASA.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full" onClick={adicionarCasa}>+ Adicionar casa</Button>
            </div>
          )}
          {ruaSelecionada && casas.length > 0 && (
            <Button className="mt-4" onClick={handleSalvar}>Salvar dados</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}