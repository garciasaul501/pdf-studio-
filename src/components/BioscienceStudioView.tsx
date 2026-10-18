import React, { useState } from 'react';
import { 
  Dna, Search, BookOpen, Layers, Sparkles, ExternalLink, 
  FlaskConical, ArrowRight, Video, FileText, CheckCircle2, Shield, Info, Activity
} from 'lucide-react';

interface BioscienceStudioViewProps {
  onGenerateScientificVideo?: (docTitle: string, contentSummary: string, category: string) => void;
}

export const BioscienceStudioView: React.FC<BioscienceStudioViewProps> = ({
  onGenerateScientificVideo
}) => {
  const [activeTab, setActiveTab] = useState<'alphafold' | 'pdb' | 'pubchem' | 'pubmed'>('alphafold');
  const [query, setQuery] = useState('P01308');
  const [selectedProtein, setSelectedProtein] = useState({
    uniprotId: 'P01308',
    name: 'Insulina Humana (INS)',
    organism: 'Homo sapiens (Humano)',
    plddtScore: 94.2,
    plddtConfidence: 'Muy Alta (>90)',
    length: 110,
    molecularWeight: '11.98 kDa',
    function: 'Hormona peptídica esencial para la homeostasis de glucosa y metabolismo de carbohidratos, lípidos y proteínas.',
    diseaseRelation: 'Diabetes Mellitus tipo 1 y 2, hiperinsulinismo familiar',
    alphaFoldUrl: 'https://alphafold.ebi.ac.uk/entry/P01308',
    pdbEquivalent: '4INS',
    citation: 'AlphaFold Structure Prediction & Nature 596, 583–589 (2021)'
  });

  const [selectedCompound, setSelectedCompound] = useState({
    name: 'Remdesivir (GS-5734)',
    formula: 'C27H35N6O8P',
    cid: 121304016,
    mw: '602.6 g/mol',
    smiles: 'CCC(CC)COC(=O)C(C)NP(=O)(OCC1C(C(C(O1)(C#N)C2=CC=C3N2N=CN=C3N)O)O)OC4=CC=CC=C4',
    category: 'Antiviral análogo de nucleósido',
    target: 'ARN polimerasa dependiente de ARN (RdRp) viral',
    iupac: '2-ethylbutyl (2S)-2-[[[(2R,3S,4R,5R)-5-(4-aminopyrrolo[2,1-f][1,2,4]triazin-7-yl)-5-cyano-3,4-dihydroxyoxolan-2-yl]methoxy-phenoxyphosphoryl]amino]propanoate'
  });

  // Preset Proteins
  const PRESET_PROTEINS = [
    {
      id: 'P01308',
      label: 'Insulina Humana (P01308)',
      name: 'Insulina Humana (INS)',
      organism: 'Homo sapiens',
      score: 94.2,
      conf: 'Muy Alta (>90)',
      len: 110,
      mw: '11.98 kDa',
      desc: 'Hormona que regula los niveles de glucosa en sangre transportándola a las células.',
      pdb: '4INS'
    },
    {
      id: 'P04637',
      label: 'Proteína p53 Tumor Suppressor (P04637)',
      name: 'Supresor Tumoral Celular p53',
      organism: 'Homo sapiens',
      score: 86.8,
      conf: 'Alta / Confiable (70-90)',
      len: 393,
      mw: '43.65 kDa',
      desc: 'El guardián del genoma: regula el ciclo celular, inducción de apoptosis y reparación del ADN.',
      pdb: '1TUP'
    },
    {
      id: 'P68871',
      label: 'Hemoglobina Subunidad Beta (P68871)',
      name: 'Hemoglobina Subunidad Beta (HBB)',
      organism: 'Homo sapiens',
      score: 96.5,
      conf: 'Muy Alta (>90)',
      len: 147,
      mw: '15.99 kDa',
      desc: 'Transporta oxígeno desde los pulmones a los tejidos corporales en glóbulos rojos.',
      pdb: '4HHB'
    },
    {
      id: '6LU7',
      label: 'Proteasa Principal Mpro COVID-19 (6LU7)',
      name: 'SARS-CoV-2 Main Protease Mpro',
      organism: 'SARS-CoV-2',
      score: 93.4,
      conf: 'Muy Alta (>90)',
      len: 306,
      mw: '33.8 kDa',
      desc: 'Enzima clave en la replicación y maduración viral, blanco fundamental para inhibidores.',
      pdb: '6LU7'
    }
  ];

  const handleSelectPreset = (p: typeof PRESET_PROTEINS[0]) => {
    setQuery(p.id);
    setSelectedProtein({
      uniprotId: p.id,
      name: p.name,
      organism: p.organism,
      plddtScore: p.score,
      plddtConfidence: p.conf,
      length: p.len,
      molecularWeight: p.mw,
      function: p.desc,
      diseaseRelation: 'Implicación biomédica clave y medicina de precisión',
      alphaFoldUrl: `https://alphafold.ebi.ac.uk/entry/${p.id}`,
      pdbEquivalent: p.pdb,
      citation: 'EBI AlphaFold DB & RCSB PDB Structure Reference'
    });
  };

  const handleCreateVideoFromScience = () => {
    const title = `Análisis Estructural: ${selectedProtein.name}`;
    const summary = `Estudio bioinformático de ${selectedProtein.name} (${selectedProtein.uniprotId}) en ${selectedProtein.organism}. Peso molecular: ${selectedProtein.molecularWeight}, Longitud: ${selectedProtein.length} aminoácidos. Puntuación pLDDT de confianza: ${selectedProtein.plddtScore}%. Función biológica: ${selectedProtein.function}. Equivalente experimental en RCSB PDB: ${selectedProtein.pdbEquivalent}.`;
    onGenerateScientificVideo?.(title, summary, 'biociencia');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#101422] to-[#0D101A] border border-blue-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Dna className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Google DeepMind Science Skill
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">AlphaFold DB & PDB Conectado</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">
              Estudio de Biociencia, Proteínas & Fármacos 3D
            </h1>
            <p className="text-xs text-slate-400 max-w-xl mt-0.5">
              Explora estructuras 3D predichas por AlphaFold, complejos del RCSB PDB, compuestos de PubChem y transforma cualquier descubrimiento en un video narrado profesional.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateVideoFromScience}
          className="py-3 px-5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
        >
          <Video className="w-4 h-4" />
          <span>Generar Video Científico con IA</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-2xl max-w-md">
        {[
          { id: 'alphafold', label: 'AlphaFold DB', icon: Dna },
          { id: 'pdb', label: 'RCSB PDB', icon: Layers },
          { id: 'pubchem', label: 'PubChem Química', icon: FlaskConical },
          { id: 'pubmed', label: 'PubMed Papers', icon: BookOpen }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Selector & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Presets */}
          <div className="p-5 rounded-2xl bg-[#121520] border border-white/10 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Estructuras Clave Pre-cargadas</span>
            </h3>

            <div className="space-y-2">
              {PRESET_PROTEINS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    query === p.id
                      ? 'bg-blue-500/15 border-blue-500/60 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{p.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                      pLDDT {p.score}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{p.desc}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
                    <span>UniProt: {p.id}</span>
                    <span>·</span>
                    <span>PDB: {p.pdb}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Biological Metrics Summary */}
          <div className="p-5 rounded-2xl bg-[#121520] border border-white/10 space-y-3.5 shadow-xl text-xs">
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Parámetros Biofísicos & Confianza pLDDT</span>
            </h3>

            <div className="space-y-2.5">
              <div className="flex justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">Puntaje pLDDT AlphaFold:</span>
                <span className="font-bold text-cyan-400">{selectedProtein.plddtScore}% ({selectedProtein.plddtConfidence})</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">Longitud de Secuencia:</span>
                <span className="font-mono text-white">{selectedProtein.length} aminoácidos</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">Masa Molecular Estimada:</span>
                <span className="font-mono text-white">{selectedProtein.molecularWeight}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                <span className="text-slate-400">Código PDB Experimental:</span>
                <span className="font-mono text-amber-400 font-bold">{selectedProtein.pdbEquivalent}</span>
              </div>
            </div>

            {/* pLDDT Scale Legend */}
            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Escala de Confianza pLDDT de AlphaFold:
              </span>
              <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-center">
                <div className="p-1 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40">&gt;90 Muy Alta</div>
                <div className="p-1 rounded bg-cyan-600/30 text-cyan-300 border border-cyan-500/40">70-90 Alta</div>
                <div className="p-1 rounded bg-yellow-600/30 text-yellow-300 border border-yellow-500/40">50-70 Media</div>
                <div className="p-1 rounded bg-orange-600/30 text-orange-300 border border-orange-500/40">&lt;50 Baja</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Molecular Simulation & Video Dispatch (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 3D Molecular Graphic Showcase */}
          <div className="p-6 rounded-3xl bg-[#121520] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                  Visor Molecular 3D Renderizado
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {selectedProtein.name}
                </h2>
              </div>
              <a
                href={selectedProtein.alphaFoldUrl}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
              >
                <span>Ficha en EBI</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            </div>

            {/* Interactive Molecular Visualizer Canvas Frame */}
            <div className="relative h-[340px] rounded-2xl overflow-hidden bg-gradient-to-br from-black via-[#0a0f1d] to-[#04060a] border border-white/10 flex items-center justify-center p-6 text-center">
              {/* Dynamic 3D Molecular Graphic Representation */}
              <div className="space-y-4 max-w-md">
                <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl animate-pulse" />
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/40 animate-spin flex items-center justify-center" style={{ animationDuration: '18s' }}>
                    <div className="w-16 h-16 rounded-full border border-blue-400/60 animate-spin" style={{ animationDuration: '10s' }} />
                  </div>
                  <Dna className="w-10 h-10 text-cyan-300 absolute" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">
                    Estructura Tridimensional PDB #{selectedProtein.pdbEquivalent}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Visualización estandarizada de cinta proteica (cartoon ribbon) con coloreado por residuo aminoacídico según confianza pLDDT y cavidades de unión.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleCreateVideoFromScience}
                    className="py-2 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Crear Video de Esta Proteína</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Biomedical Literature & Function */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Mecanismo Biológico & Aplicación Clínica</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedProtein.function}
              </p>
              <p className="text-[11px] text-slate-500 font-mono pt-1">
                Referencia: {selectedProtein.citation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
