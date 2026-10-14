import React, { useState } from 'react';
import { UserSession, StorefrontSettings, WhopMember } from '../types/whop';
import { 
  Crown, Users, DollarSign, Video, ShieldCheck, Key, 
  Plus, Copy, Check, RefreshCw, Trash2, Search, Sliders,
  ArrowUpRight, Activity, Sparkles, ExternalLink, Shield
} from 'lucide-react';

interface AdminDashboardViewProps {
  session: UserSession;
  settings: StorefrontSettings;
  onUpdateSettings: (newSettings: Partial<StorefrontSettings>) => void;
  onSwitchToTool: () => void;
  onLogout: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  session,
  settings,
  onUpdateSettings,
  onSwitchToTool,
  onLogout,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newLicenseModal, setNewLicenseModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState('Plan Pro Ilimitado');

  const [members, setMembers] = useState<WhopMember[]>([
    {
      id: 'usr_1',
      name: 'Propietario Principal (Tú)',
      email: 'g•••••••7@gmail.com',
      plan: 'Super Admin Ilimitado',
      status: 'active',
      creditsUsed: 120,
      totalConversions: 890,
      joinedDate: '2026-09-01',
      licenseKey: 'WHOP-MASTER-ADMIN-UNLIMITED-∞'
    },
    {
      id: 'usr_2',
      name: 'Carlos Mendoza',
      email: 'carlos.cursos@gmail.com',
      plan: 'Plan Pro Ilimitado',
      status: 'active',
      creditsUsed: 45,
      totalConversions: 45,
      joinedDate: '2026-10-02',
      licenseKey: 'WHOP-PRO-7829-XL'
    },
    {
      id: 'usr_3',
      name: 'Valeria Sotomayor',
      email: 'valeria@agenciacontenido.com',
      plan: 'Licencia Vitalicia',
      status: 'active',
      creditsUsed: 112,
      totalConversions: 112,
      joinedDate: '2026-09-28',
      licenseKey: 'WHOP-LIFE-4421-VIP'
    },
    {
      id: 'usr_4',
      name: 'Andrés Morales',
      email: 'andres.marketing@yahoo.com',
      plan: 'Plan Creador',
      status: 'active',
      creditsUsed: 18,
      totalConversions: 18,
      joinedDate: '2026-10-08',
      licenseKey: 'WHOP-START-9912-CR'
    },
    {
      id: 'usr_5',
      name: 'Elena Rostova',
      email: 'elena@podcastia.es',
      plan: 'Plan Pro Ilimitado',
      status: 'trialing',
      creditsUsed: 6,
      totalConversions: 6,
      joinedDate: '2026-10-12',
      licenseKey: 'WHOP-TRIAL-3301-7D'
    }
  ]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail) return;

    const newKey = `WHOP-${newMemberPlan.includes('Vitalicia') ? 'LIFE' : 'VIP'}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const newMember: WhopMember = {
      id: `usr_${Date.now()}`,
      name: newMemberName || newMemberEmail.split('@')[0],
      email: newMemberEmail,
      plan: newMemberPlan,
      status: 'active',
      creditsUsed: 0,
      totalConversions: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      licenseKey: newKey
    };

    setMembers([newMember, ...members]);
    setNewMemberEmail('');
    setNewMemberName('');
    setNewLicenseModal(false);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/15 via-[#161A26] to-[#121520] border border-orange-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Super Administrador Whop
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">Estado: Ilimitado Activo</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">
              Bienvenido, {session.name}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Cuenta Protegida (Modo Privado) · Licencia: {session.licenseKey}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSwitchToTool}
            className="py-2.5 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Abrir Convertidor Ilimitado</span>
          </button>
          <button
            onClick={onLogout}
            className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-white/10 transition-colors cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'MRR Proyectado en Whop',
            value: '$4,890 USD',
            change: '+24.5% este mes',
            icon: DollarSign,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
          },
          {
            title: 'Miembros Totales',
            value: members.length + 138,
            change: '+14 nuevos hoy',
            icon: Users,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10'
          },
          {
            title: 'Videos Renderizados',
            value: '2,140',
            change: '100% en navegador',
            icon: Video,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10'
          },
          {
            title: 'Tus Créditos Disponibles',
            value: 'ILIMITADOS ∞',
            change: 'Sin cuotas ni restricciones',
            icon: Crown,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
          }
        ].map((m, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#131622] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{m.title}</span>
              <div className={`p-2 rounded-xl ${m.bg} ${m.color}`}>
                <m.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{m.value}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              <span>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Members & Licenses Management */}
      <div className="p-6 rounded-3xl bg-[#131622] border border-white/10 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-orange-400" />
              <span>Gestión de Miembros & Licencias Whop</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Genera accesos VIP para tus clientes o gestiona las licencias activas en Whop.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar miembro o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 w-56"
              />
            </div>

            <button
              onClick={() => setNewLicenseModal(true)}
              className="py-2 px-3.5 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generar Licencia VIP</span>
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/30">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] text-slate-400 font-semibold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Miembro</th>
                <th className="py-3 px-4">Plan Whop</th>
                <th className="py-3 px-4">Clave de Licencia</th>
                <th className="py-3 px-4">Videos Creados</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white flex items-center gap-2">
                      {m.email === 'garciassaul7@gmail.com' && (
                        <Crown className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      )}
                      <span>{m.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{m.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-300">
                    {m.plan}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-orange-400 font-semibold">
                    {m.licenseKey}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {m.totalConversions} videos
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      m.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {m.status === 'active' ? 'Activo' : 'En Prueba'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => copyToClipboard(m.licenseKey, m.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copiar Clave"
                    >
                      {copiedKey === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Settings & Whop Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pricing Quick Edit */}
        <div className="p-6 rounded-3xl bg-[#131622] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-400" />
            <span>Precios de la Tienda Whop (En Vivo)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Ajusta los precios de tus 3 niveles de membresía para la tienda pdftovideo.whop.site.
          </p>

          <div className="space-y-3">
            {settings.plans.map((plan, idx) => (
              <div key={plan.id} className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white">{plan.name}</p>
                  <p className="text-[10px] text-slate-400">{plan.period === 'único' ? 'Pago único' : 'Mensual'}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) => {
                      const newPlans = [...settings.plans];
                      newPlans[idx].price = parseInt(e.target.value) || 0;
                      onUpdateSettings({ plans: newPlans });
                    }}
                    className="w-16 px-2 py-1 bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white text-right focus:outline-none focus:border-orange-500"
                  />
                  <span className="text-xs text-slate-400">USD</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Whop Webhook Activity */}
        <div className="p-6 rounded-3xl bg-[#131622] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Eventos de Webhook en Vivo (Whop Payments)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Suscripciones y cobros recibidos automáticamente por Whop.
          </p>

          <div className="space-y-2 font-mono text-[11px]">
            {[
              { event: 'membership.went_valid', user: 'carlos.cursos@gmail.com', time: 'hace 4 min', plan: 'Pro Ilimitado' },
              { event: 'payment.succeeded', user: 'valeria@agenciacontenido.com', time: 'hace 28 min', plan: 'Vitalicia ($99)' },
              { event: 'membership.created', user: 'elena@podcastia.es', time: 'hace 1 hora', plan: 'Trial 7 Días' },
              { event: 'membership.went_valid', user: 'garciassaul7@gmail.com', time: 'Activo', plan: 'Super Admin ∞' },
            ].map((evt, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">{evt.event}</span>
                  <span className="text-slate-400">· {evt.user}</span>
                </div>
                <span className="text-[10px] text-slate-500">{evt.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: New License Generation */}
      {newLicenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121520] border border-orange-500/30 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-orange-400" />
              <span>Generar Nueva Licencia Whop VIP</span>
            </h3>
            <p className="text-xs text-slate-400">
              Crea un acceso manual para regalar a un cliente o socio sin pasar por pasarela de pago.
            </p>

            <form onSubmit={handleCreateLicense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  placeholder="Ej: Marcos Ramos"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="cliente@ejemplo.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nivel de Membresía
                </label>
                <select
                  value={newMemberPlan}
                  onChange={(e) => setNewMemberPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Plan Pro Ilimitado">Plan Pro Ilimitado ($39/mes)</option>
                  <option value="Licencia Vitalicia">Licencia Vitalicia (Acceso Perpetuo)</option>
                  <option value="Plan Creador">Plan Creador ($19/mes)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewLicenseModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF6243] hover:bg-[#ff5130] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Generar y Asignar Licencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
