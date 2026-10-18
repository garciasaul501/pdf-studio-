import React, { useState, useRef } from 'react';
import { UserSession, StorefrontSettings, WhopMember, Testimonial, SeoMetadataConfig } from '../types/whop';
import { 
  defaultTestimonials, 
  defaultSeoConfig, 
  OG_IMAGE_PRESETS, 
  STOREFRONT_TEMPLATES, 
  StorefrontTemplatePreset,
  ANALYTICS_DATA_7D,
  ANALYTICS_DATA_30D,
  ANALYTICS_DATA_90D,
  STOREFRONT_FUNNEL_STAGES,
  STOREFRONT_TRAFFIC_SOURCES,
  StorefrontAnalyticsPoint
} from '../data/defaultConfig';
import { 
  Crown, Users, DollarSign, Video, ShieldCheck, Key, 
  Plus, Copy, Check, RefreshCw, Trash2, Search, Sliders,
  ArrowUpRight, Activity, Sparkles, ExternalLink, Shield,
  Star, MessageSquare, Eye, EyeOff, Edit3, Globe, Share2,
  Image as ImageIcon, FileCode, CheckCircle2, AlertCircle, RotateCcw,
  Download, Upload, FileJson, Database, Save, FileText, CheckCircle,
  FolderArchive, Code, HelpCircle, BarChart3, TrendingUp, MousePointerClick, Percent
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const CustomAnalyticsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as StorefrontAnalyticsPoint;
    return (
      <div className="p-3.5 bg-[#0D1018]/95 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl space-y-2 text-xs font-sans min-w-[220px]">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
          <span className="font-bold text-white">{data.dayLabel || label}</span>
          <span className="text-[10px] font-mono text-slate-400">{data.date}</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#FF6243]" />
              Vistas de Página:
            </span>
            <span className="font-bold text-white font-mono">{data.pageViews.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Visitantes Únicos:
            </span>
            <span className="font-bold text-white font-mono">{data.uniqueVisitors.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Checkouts Iniciados:
            </span>
            <span className="font-bold text-white font-mono">{data.checkouts.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Tasa de Conversión:
            </span>
            <span className="font-black text-emerald-400 font-mono text-xs">{data.conversionRate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Ventas Whop:</span>
            <span className="font-bold text-white font-mono">{data.conversions} compras (${data.revenue.toLocaleString()} USD)</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

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
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [newLicenseModal, setNewLicenseModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState('Plan Pro Ilimitado');

  // Opinions / Testimonials Management State (Unlimited)
  const currentOpinions = settings.testimonials && settings.testimonials.length > 0 
    ? settings.testimonials 
    : defaultTestimonials;
  const [opinionModalOpen, setOpinionModalOpen] = useState(false);
  const [editingOpinionId, setEditingOpinionId] = useState<string | null>(null);
  const [opName, setOpName] = useState('');
  const [opRole, setOpRole] = useState('');
  const [opStars, setOpStars] = useState(5);
  const [opComment, setOpComment] = useState('');
  const [opMetric, setOpMetric] = useState('');
  const [opAvatar, setOpAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  // SEO, Meta Tags & Open Graph State
  const initialSeo = settings.seo || defaultSeoConfig;
  const [seoTitle, setSeoTitle] = useState(initialSeo.pageTitle);
  const [seoDesc, setSeoDesc] = useState(initialSeo.metaDescription);
  const [seoOgImage, setSeoOgImage] = useState(initialSeo.ogImage);
  const [seoKeywords, setSeoKeywords] = useState(initialSeo.keywords);
  const [seoCanonical, setSeoCanonical] = useState(initialSeo.canonicalUrl || 'https://pdftovideo.whop.site');
  const [seoOgType, setSeoOgType] = useState(initialSeo.ogType || 'website');
  const [seoTwitterCard, setSeoTwitterCard] = useState<'summary_large_image' | 'summary'>(initialSeo.twitterCard || 'summary_large_image');
  const [seoTwitterCreator, setSeoTwitterCreator] = useState(initialSeo.twitterCreator || '@whop');
  const [seoSchemaType, setSeoSchemaType] = useState(initialSeo.schemaType || 'SoftwareApplication');
  const [seoPreviewTab, setSeoPreviewTab] = useState<'google' | 'twitter' | 'discord' | 'code'>('google');
  const [seoSavedSuccess, setSeoSavedSuccess] = useState(false);
  const [copiedHtmlCode, setCopiedHtmlCode] = useState(false);

  // Backup, JSON Export & Import, and Templates State
  const [copiedJson, setCopiedJson] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [previewImportData, setPreviewImportData] = useState<StorefrontSettings | null>(null);
  const [previewSource, setPreviewSource] = useState<string>('Archivo JSON');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [jsonPasteInput, setJsonPasteInput] = useState<string>('');
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [preserveTestimonialsOnImport, setPreserveTestimonialsOnImport] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analytics & Recharts Engagement State
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'7D' | '30D' | '90D'>('7D');
  const [analyticsMetricFocus, setAnalyticsMetricFocus] = useState<'all' | 'views' | 'conversion'>('all');

  const activeAnalyticsData = analyticsTimeframe === '7D' 
    ? ANALYTICS_DATA_7D 
    : analyticsTimeframe === '30D' 
    ? ANALYTICS_DATA_30D 
    : ANALYTICS_DATA_90D;

  const totalAnalyticsViews = activeAnalyticsData.reduce((acc, p) => acc + p.pageViews, 0);
  const totalAnalyticsUnique = activeAnalyticsData.reduce((acc, p) => acc + p.uniqueVisitors, 0);
  const totalAnalyticsCheckouts = activeAnalyticsData.reduce((acc, p) => acc + p.checkouts, 0);
  const totalAnalyticsConversions = activeAnalyticsData.reduce((acc, p) => acc + p.conversions, 0);
  const avgAnalyticsConversionRate = ((totalAnalyticsConversions / totalAnalyticsViews) * 100).toFixed(2);
  const totalAnalyticsRevenue = activeAnalyticsData.reduce((acc, p) => acc + p.revenue, 0);

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

  // Opinions Handlers (Unlimited CRUD)
  const handleOpenCreateOpinion = () => {
    setEditingOpinionId(null);
    setOpName('');
    setOpRole('Creador de Contenido & Agencia');
    setOpStars(5);
    setOpComment('');
    setOpMetric('+150% conversiones');
    setOpAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    setOpinionModalOpen(true);
  };

  const handleOpenEditOpinion = (t: Testimonial) => {
    setEditingOpinionId(t.id);
    setOpName(t.name);
    setOpRole(t.role);
    setOpStars(t.stars);
    setOpComment(t.comment);
    setOpMetric(t.metric);
    setOpAvatar(t.avatar);
    setOpinionModalOpen(true);
  };

  const handleSaveOpinion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opName.trim() || !opComment.trim()) return;

    if (editingOpinionId) {
      const updated = currentOpinions.map((item) =>
        item.id === editingOpinionId
          ? {
              ...item,
              name: opName.trim(),
              role: opRole.trim(),
              stars: opStars,
              comment: opComment.trim(),
              metric: opMetric.trim(),
              avatar: opAvatar.trim(),
            }
          : item
      );
      onUpdateSettings({ testimonials: updated });
    } else {
      const newOp: Testimonial = {
        id: `op_${Date.now()}`,
        name: opName.trim(),
        role: opRole.trim() || 'Miembro VIP Whop',
        stars: opStars,
        comment: opComment.trim(),
        metric: opMetric.trim() || '+100% Retención',
        avatar: opAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      onUpdateSettings({ testimonials: [newOp, ...currentOpinions] });
    }
    setOpinionModalOpen(false);
  };

  const handleDeleteOpinion = (id: string) => {
    const updated = currentOpinions.filter((item) => item.id !== id);
    onUpdateSettings({ testimonials: updated });
  };

  // SEO Handlers & Calculation
  const calculateSeoScore = () => {
    let score = 0;
    if (seoTitle.length >= 30 && seoTitle.length <= 60) score += 25;
    else if (seoTitle.length > 0) score += 15;

    if (seoDesc.length >= 120 && seoDesc.length <= 165) score += 25;
    else if (seoDesc.length > 50) score += 15;

    if (seoOgImage && (seoOgImage.startsWith('http') || seoOgImage.startsWith('/'))) score += 25;
    if (seoKeywords.length > 10) score += 15;
    if (seoCanonical.length > 10) score += 10;
    return Math.min(100, score);
  };

  const handleSaveSeo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updatedSeo: SeoMetadataConfig = {
      pageTitle: seoTitle.trim(),
      metaDescription: seoDesc.trim(),
      keywords: seoKeywords.trim(),
      canonicalUrl: seoCanonical.trim(),
      ogTitle: seoTitle.trim(),
      ogDescription: seoDesc.trim(),
      ogImage: seoOgImage.trim(),
      ogType: seoOgType,
      twitterCard: seoTwitterCard,
      twitterCreator: seoTwitterCreator.trim(),
      author: 'Whop Studio & Global Educación IA',
      robots: 'index, follow',
      schemaType: seoSchemaType as any
    };

    onUpdateSettings({ seo: updatedSeo });
    setSeoSavedSuccess(true);
    setTimeout(() => setSeoSavedSuccess(false), 3000);
  };

  const handleResetSeo = () => {
    setSeoTitle(defaultSeoConfig.pageTitle);
    setSeoDesc(defaultSeoConfig.metaDescription);
    setSeoOgImage(defaultSeoConfig.ogImage);
    setSeoKeywords(defaultSeoConfig.keywords);
    setSeoCanonical(defaultSeoConfig.canonicalUrl || 'https://pdftovideo.whop.site');
    setSeoOgType(defaultSeoConfig.ogType);
    setSeoTwitterCard(defaultSeoConfig.twitterCard);
    setSeoTwitterCreator(defaultSeoConfig.twitterCreator || '@whop');
    setSeoSchemaType(defaultSeoConfig.schemaType);
  };

  const generatedHtmlTags = `<!-- Primarios: Título & Metadatos SEO -->
<title>${seoTitle}</title>
<meta name="description" content="${seoDesc}" />
<meta name="keywords" content="${seoKeywords}" />
<link rel="canonical" href="${seoCanonical}" />
<meta name="robots" content="index, follow" />

<!-- Open Graph / Facebook / LinkedIn / Discord -->
<meta property="og:type" content="${seoOgType}" />
<meta property="og:url" content="${seoCanonical}" />
<meta property="og:title" content="${seoTitle}" />
<meta property="og:description" content="${seoDesc}" />
<meta property="og:image" content="${seoOgImage}" />
<meta property="og:site_name" content="${settings.storeName}" />

<!-- Twitter / X Cards -->
<meta name="twitter:card" content="${seoTwitterCard}" />
<meta name="twitter:title" content="${seoTitle}" />
<meta name="twitter:description" content="${seoDesc}" />
<meta name="twitter:image" content="${seoOgImage}" />
<meta name="twitter:creator" content="${seoTwitterCreator}" />

<!-- Schema.org Datos Estructurados JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${seoSchemaType}",
  "name": "${settings.storeName}",
  "description": "${seoDesc}",
  "url": "${seoCanonical}",
  "image": "${seoOgImage}"
}
</script>`;

  const handleCopyHtmlCode = () => {
    navigator.clipboard.writeText(generatedHtmlTags);
    setCopiedHtmlCode(true);
    setTimeout(() => setCopiedHtmlCode(false), 2500);
  };

  // Backup & JSON Export / Import Handlers
  const currentBackupJson = JSON.stringify(
    {
      _app: 'Whop Storefront Studio',
      _version: '1.0.0',
      _exportedAt: new Date().toISOString(),
      storeName: settings.storeName,
      subdomain: settings.subdomain,
      category: settings.category,
      tagline: settings.tagline,
      headline: settings.headline,
      subheadline: settings.subheadline,
      primaryCtaText: settings.primaryCtaText,
      secondaryCtaText: settings.secondaryCtaText,
      accentColor: settings.accentColor,
      guaranteeDays: settings.guaranteeDays,
      plans: settings.plans,
      testimonials: settings.testimonials && settings.testimonials.length > 0 ? settings.testimonials : defaultTestimonials,
      seo: settings.seo || defaultSeoConfig
    },
    null,
    2
  );

  const handleExportJson = () => {
    try {
      const blob = new Blob([currentBackupJson], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      const filename = `${settings.subdomain || 'whop-storefront'}-backup-${new Date().toISOString().slice(0, 10)}.json`;
      downloadAnchor.href = url;
      downloadAnchor.download = filename;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
      setImportSuccessMessage(`¡Archivo de respaldo "${filename}" descargado exitosamente!`);
      setTimeout(() => setImportSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleCopyJsonToClipboard = () => {
    navigator.clipboard.writeText(currentBackupJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const validateAndParseJson = (jsonString: string): StorefrontSettings | null => {
    try {
      setImportError(null);
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        setImportError('El archivo no contiene un objeto JSON válido.');
        return null;
      }

      // Check minimum fields
      if (!parsed.storeName && !parsed.headline) {
        setImportError('El archivo JSON debe contener al menos un "storeName" o un "headline" válido.');
        return null;
      }

      const normalized: StorefrontSettings = {
        storeName: parsed.storeName || 'Mi Tienda Whop',
        subdomain: parsed.subdomain || 'mi-tienda',
        category: parsed.category || 'Software & IA',
        tagline: parsed.tagline || '',
        headline: parsed.headline || 'Titular de la Tienda',
        subheadline: parsed.subheadline || '',
        primaryCtaText: parsed.primaryCtaText || 'Comenzar Ahora',
        secondaryCtaText: parsed.secondaryCtaText || 'Ver Planes',
        accentColor: parsed.accentColor || '#FF6243',
        guaranteeDays: typeof parsed.guaranteeDays === 'number' ? parsed.guaranteeDays : 14,
        plans: Array.isArray(parsed.plans) && parsed.plans.length > 0 ? parsed.plans : settings.plans,
        testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0 
          ? parsed.testimonials 
          : (settings.testimonials && settings.testimonials.length > 0 ? settings.testimonials : defaultTestimonials),
        seo: parsed.seo ? {
          pageTitle: parsed.seo.pageTitle || parsed.storeName || defaultSeoConfig.pageTitle,
          metaDescription: parsed.seo.metaDescription || defaultSeoConfig.metaDescription,
          keywords: parsed.seo.keywords || defaultSeoConfig.keywords,
          canonicalUrl: parsed.seo.canonicalUrl || defaultSeoConfig.canonicalUrl,
          ogTitle: parsed.seo.ogTitle || parsed.seo.pageTitle || defaultSeoConfig.ogTitle,
          ogDescription: parsed.seo.ogDescription || parsed.seo.metaDescription || defaultSeoConfig.ogDescription,
          ogImage: parsed.seo.ogImage || defaultSeoConfig.ogImage,
          ogType: parsed.seo.ogType || 'website',
          twitterCard: parsed.seo.twitterCard || 'summary_large_image',
          twitterCreator: parsed.seo.twitterCreator || '@whop',
          author: parsed.seo.author || defaultSeoConfig.author,
          robots: parsed.seo.robots || 'index, follow',
          schemaType: parsed.seo.schemaType || 'SoftwareApplication'
        } : (settings.seo || defaultSeoConfig)
      };

      return normalized;
    } catch (err: any) {
      setImportError(`Error de sintaxis JSON: ${err?.message || 'Formato inválido'}`);
      return null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const validated = validateAndParseJson(content);
      if (validated) {
        setPreviewImportData(validated);
        setPreviewSource(`Archivo: ${file.name}`);
        setImportModalOpen(true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setImportError('Por favor selecciona un archivo con extensión .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const validated = validateAndParseJson(content);
      if (validated) {
        setPreviewImportData(validated);
        setPreviewSource(`Archivo Arrastrado: ${file.name}`);
        setImportModalOpen(true);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonPasteInput.trim()) return;
    const validated = validateAndParseJson(jsonPasteInput);
    if (validated) {
      setPreviewImportData(validated);
      setPreviewSource('Texto JSON Pegado');
      setPasteModalOpen(false);
      setImportModalOpen(true);
    }
  };

  const handleConfirmImport = () => {
    if (!previewImportData) return;

    let finalDataToApply = { ...previewImportData };
    if (preserveTestimonialsOnImport) {
      finalDataToApply.testimonials = settings.testimonials && settings.testimonials.length > 0 
        ? settings.testimonials 
        : defaultTestimonials;
    }

    onUpdateSettings(finalDataToApply);
    setImportModalOpen(false);
    setPasteModalOpen(false);
    setJsonPasteInput('');
    setImportSuccessMessage(`¡La tienda "${finalDataToApply.storeName}" ha sido restaurada con éxito!`);
    setTimeout(() => setImportSuccessMessage(null), 5000);
  };

  const handleLoadTemplate = (preset: StorefrontTemplatePreset) => {
    setPreviewImportData(preset.settings);
    setPreviewSource(`Plantilla: ${preset.name}`);
    setImportModalOpen(true);
  };

  const handleDownloadTemplate = (preset: StorefrontTemplatePreset, e: React.MouseEvent) => {
    e.stopPropagation();
    const exportData = {
      _app: 'Whop Storefront Studio',
      _version: '1.0.0',
      _templateId: preset.id,
      _templateName: preset.name,
      _exportedAt: new Date().toISOString(),
      ...preset.settings
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    const filename = `${preset.settings.subdomain}-template.json`;
    downloadAnchor.href = url;
    downloadAnchor.download = filename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
    setImportSuccessMessage(`¡Plantilla "${preset.name}" descargada como ${filename}!`);
    setTimeout(() => setImportSuccessMessage(null), 4000);
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
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span>Cuenta: {isEmailVisible ? session.email : 'g•••••••7@gmail.com'}</span>
              <button
                type="button"
                onClick={() => setIsEmailVisible(!isEmailVisible)}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                title={isEmailVisible ? 'Ocultar correo' : 'Mostrar correo'}
              >
                {isEmailVisible ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
              </button>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold">Modo Privado</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Licencia: {session.licenseKey}</span>
            </div>
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

      {/* Quick Navigation Anchor Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-[#131622]/80 backdrop-blur-md rounded-2xl border border-white/10 sticky top-20 z-20 shadow-lg">
        <span className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider hidden sm:inline">
          Secciones del Panel:
        </span>
        <a
          href="#analytics-section"
          className="px-3.5 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-xs font-bold text-orange-300 hover:text-white transition-all flex items-center gap-1.5 border border-orange-500/30 shadow-sm shadow-orange-500/10"
        >
          <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
          <span>Vistas & Conversión</span>
          <span className="px-1.5 py-0.2 bg-[#FF6243] text-white text-[9px] font-black rounded-full">Recharts</span>
        </a>
        <a
          href="#members-section"
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/5"
        >
          <Key className="w-3.5 h-3.5 text-orange-400" />
          <span>Miembros & Licencias</span>
        </a>
        <a
          href="#opinions-section"
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/5"
        >
          <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span>Opiniones & Reseñas</span>
        </a>
        <a
          href="#seo-section"
          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-xs font-bold text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>SEO, Meta Tags & Open Graph</span>
        </a>
        <a
          href="#backup-section"
          className="px-3.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-xs font-bold text-purple-300 hover:text-white transition-all flex items-center gap-1.5 border border-purple-500/30 shadow-sm shadow-purple-500/10"
        >
          <Database className="w-3.5 h-3.5 text-purple-400" />
          <span>Copias de Seguridad & JSON</span>
          <span className="px-1.5 py-0.2 bg-purple-500 text-white text-[9px] font-black rounded-full">Nuevo</span>
        </a>
        <a
          href="#settings-section"
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 border border-white/5"
        >
          <Sliders className="w-3.5 h-3.5 text-orange-400" />
          <span>Ajustes & Precios</span>
        </a>
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

      {/* 2. Page Views & Conversion Rate Analytics Panel (Recharts Engine) */}
      <div id="analytics-section" className="p-6 rounded-3xl bg-[#131622] border border-orange-500/20 space-y-6 scroll-mt-28 shadow-xl shadow-orange-950/20">
        {/* Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-md">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Vistas de Página & Tasa de Conversión
                </h2>
                <span className="text-[10px] font-bold bg-orange-500/15 text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                  Whop Engagement Data
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 hidden sm:inline">
                  Recharts v2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Métricas de tráfico, visitantes únicos y tasa de conversión en tiempo real de tu tienda en Whop (pdftovideo.whop.site).
              </p>
            </div>
          </div>

          {/* Timeframe & Focus Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Metric Focus Selector */}
            <div className="flex items-center p-1 bg-black/60 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setAnalyticsMetricFocus('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  analyticsMetricFocus === 'all'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ambos
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsMetricFocus('views')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  analyticsMetricFocus === 'views'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Solo Vistas
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsMetricFocus('conversion')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  analyticsMetricFocus === 'conversion'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Solo Conversión %
              </button>
            </div>

            {/* Timeframe Toggle */}
            <div className="flex items-center p-1 bg-black/60 rounded-xl border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setAnalyticsTimeframe('7D')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  analyticsTimeframe === '7D'
                    ? 'bg-white/15 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                7D
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsTimeframe('30D')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  analyticsTimeframe === '30D'
                    ? 'bg-white/15 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                30D
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsTimeframe('90D')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  analyticsTimeframe === '90D'
                    ? 'bg-white/15 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                90D
              </button>
            </div>
          </div>
        </div>

        {/* Executive KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Page Views */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Vistas de Página (Page Views)</span>
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {totalAnalyticsViews.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +28.4%
              </span>
              <span className="text-slate-400">
                {totalAnalyticsUnique.toLocaleString()} únicos
              </span>
            </div>
          </div>

          {/* Card 2: Conversion Rate */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Tasa de Conversión (% Rate)</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {avgAnalyticsConversionRate}%
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
              <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +1.2%
              </span>
              <span className="text-slate-400">
                Media Whop: 3.1%
              </span>
            </div>
          </div>

          {/* Card 3: Checkouts Initiated */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Checkouts Iniciados</span>
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <MousePointerClick className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {totalAnalyticsCheckouts.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
              <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +19.1%
              </span>
              <span className="text-slate-400">
                Intención de compra
              </span>
            </div>
          </div>

          {/* Card 4: Total Conversions */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Conversiones Confirmadas</span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-300 font-mono">
              {totalAnalyticsConversions.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
              <span className="text-purple-300 font-semibold">
                ${totalAnalyticsRevenue.toLocaleString()} USD
              </span>
              <span className="text-slate-400">
                Pagos Whop
              </span>
            </div>
          </div>
        </div>

        {/* Main Recharts Composed Chart */}
        <div className="p-5 rounded-2xl bg-[#0D1018] border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Evolución Temporal de Visitas & Conversión</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comportamiento diario correlacionando volumen de tráfico con porcentaje de compras efectivas.
              </p>
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              {(analyticsMetricFocus === 'all' || analyticsMetricFocus === 'views') && (
                <>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-[#FF6243]" />
                    <span>Page Views</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-3 h-1 rounded-full bg-cyan-400" />
                    <span>Visitantes Únicos</span>
                  </div>
                </>
              )}
              {(analyticsMetricFocus === 'all' || analyticsMetricFocus === 'conversion') && (
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span>Tasa de Conversión (%)</span>
                </div>
              )}
            </div>
          </div>

          {/* Recharts Canvas */}
          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={activeAnalyticsData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6243" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FF6243" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />

                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />

                <YAxis
                  yAxisId="left"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10B981"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  domain={[0, 10]}
                  tickFormatter={(val) => `${val}%`}
                />

                <Tooltip content={<CustomAnalyticsTooltip />} />

                {/* Page Views Area */}
                {(analyticsMetricFocus === 'all' || analyticsMetricFocus === 'views') && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="pageViews"
                    name="Page Views"
                    stroke="#FF6243"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                )}

                {/* Unique Visitors Area */}
                {(analyticsMetricFocus === 'all' || analyticsMetricFocus === 'views') && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="uniqueVisitors"
                    name="Visitantes Únicos"
                    stroke="#06B6D4"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorUnique)"
                  />
                )}

                {/* Conversion Rate Line */}
                {(analyticsMetricFocus === 'all' || analyticsMetricFocus === 'conversion') && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversionRate"
                    name="Tasa de Conversión"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#0D1018' }}
                    activeDot={{ r: 7, fill: '#10B981', strokeWidth: 2, stroke: '#FFFFFF' }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Insights: Conversion Funnel & Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Conversion Funnel Breakdown (7 cols) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Embudo de Conversión de la Tienda (Funnel)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ruta de los usuarios desde la primera visita hasta la compra final en Whop.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                5.31% Tasa Global
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {STOREFRONT_FUNNEL_STAGES.map((stage, idx) => (
                <div key={stage.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] flex items-center justify-center font-mono text-slate-400">
                        {idx + 1}
                      </span>
                      <span>{stage.label}</span>
                    </span>
                    <div className="flex items-center gap-2 text-right">
                      <span className="font-mono font-bold text-white text-xs">
                        {stage.count.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({stage.percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${stage.percentage}%`,
                        backgroundColor: stage.color
                      }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 pl-7">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Traffic Sources & Retention (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Fuentes de Tráfico & Conversión
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Por canal</span>
            </div>

            <div className="space-y-3">
              {STOREFRONT_TRAFFIC_SOURCES.map((src, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                      <span className="text-xs font-semibold text-white">{src.source}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {src.conversionRate}% conv.
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{src.views.toLocaleString()} visitas ({src.share}%)</span>
                    <span className="text-slate-300 font-medium">{src.conversions} compras</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${src.share}%`, backgroundColor: src.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Conversion Tip */}
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-orange-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Insight de Conversión Whop</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Los videos verticales de TikTok/Reels generados automáticamente con la herramienta tienen una tasa de conversión de <strong>5.4%</strong>, superando en un <strong>35%</strong> el promedio de tráfico frío web.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Members & Licenses Management */}
      <div id="members-section" className="p-6 rounded-3xl bg-[#131622] border border-white/10 space-y-5 scroll-mt-28">
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

      {/* 4. Unlimited Opinions & Testimonials Management (Whop Social Proof) */}
      <div id="opinions-section" className="p-6 rounded-3xl bg-[#131622] border border-white/10 space-y-6 scroll-mt-28">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Gestor de Opiniones & Reseñas Ilimitadas
              </h2>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Ilimitadas ∞
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Crea, edita o elimina opiniones de creadores que se muestran en tiempo real en la tienda oficial pdftovideo.whop.site.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateOpinion}
            className="py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nueva Opinión / Testimonio</span>
          </button>
        </div>

        {/* Opinions Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">Opiniones Activas</span>
            <span className="text-sm font-black text-white">{currentOpinions.length} opiniones</span>
          </div>
          <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">Puntuación Promedio</span>
            <div className="flex items-center gap-1 text-amber-400 font-black text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>5.0 / 5.0</span>
            </div>
          </div>
          <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">Impacto en Ventas</span>
            <span className="text-xs font-bold text-emerald-400">+140% Conversión Whop</span>
          </div>
        </div>

        {/* Opinions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentOpinions.map((op) => (
            <div
              key={op.id}
              className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-3 relative group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={op.avatar}
                      alt={op.name}
                      className="w-9 h-9 rounded-full object-cover border border-orange-500/40"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{op.name}</h4>
                      <p className="text-[10px] text-slate-400">{op.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(op.stars)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{op.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {op.metric}
                </span>

                <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleOpenEditOpinion(op)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    title="Editar opinión"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteOpinion(op.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Eliminar opinión"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Storefront SEO, Meta Tags & Open Graph (Social Cards) */}
      <div id="seo-section" className="p-6 rounded-3xl bg-[#131622] border border-cyan-500/20 space-y-6 scroll-mt-28 shadow-xl shadow-cyan-950/20">
        {/* Header & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  SEO, Metadatos & Tarjetas Open Graph
                </h2>
                <span className="text-[10px] font-bold bg-cyan-500/15 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  Google & Redes Sociales
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Configura el título de página, meta descripción e imagen de previsualización para maximizar clics en Twitter, Discord, WhatsApp y Google.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live SEO Score Gauge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10">
              <span className="text-xs text-slate-400">Puntaje SEO:</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                calculateSeoScore() >= 85 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : calculateSeoScore() >= 60 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {calculateSeoScore()} / 100
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetSeo}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Restaurar valores SEO recomendados"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>

            <button
              type="button"
              onClick={handleSaveSeo}
              className="py-2 px-4 bg-[#FF6243] hover:bg-[#ff5130] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              {seoSavedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>¡Cambios Guardados!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Guardar y Aplicar SEO</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2 Columns: Left = Form Inputs, Right = Live Social Previews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Page Title Input */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Título de la Página (&lt;title&gt; y og:title)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    seoTitle.length >= 30 && seoTitle.length <= 60
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {seoTitle.length} / 60 caracteres
                  </span>
                  <span className="text-[10px] text-slate-400">(Óptimo: 30-60)</span>
                </div>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Ej: PDF to Video AI – Transforma Documentos en Videos Virales 3D"
                className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <p className="text-[11px] text-slate-400">
                Es el título principal indexado por Google y el encabezado destacado en tarjetas sociales.
              </p>
            </div>

            {/* Meta Description Input */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Descripción Meta (meta description y og:description)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    seoDesc.length >= 120 && seoDesc.length <= 165
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {seoDesc.length} / 160 caracteres
                  </span>
                  <span className="text-[10px] text-slate-400">(Óptimo: 120-160)</span>
                </div>
              </div>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Escribe un resumen convincente con llamada a la acción..."
                className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              />
              <p className="text-[11px] text-slate-400">
                Aparece debajo del título en los resultados de Google y en el cuerpo del enlace compartido.
              </p>
            </div>

            {/* Open Graph Image Selection */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Imagen Open Graph (og:image / twitter:image)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">1200 x 630 px (1.91:1)</span>
              </div>

              <input
                type="text"
                value={seoOgImage}
                onChange={(e) => setSeoOgImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-[11px] transition-colors"
              />

              {/* Quick Preset Selector */}
              <div>
                <p className="text-[11px] text-slate-400 font-medium mb-2">Presets recomendados en alta resolución (1 Clic):</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {OG_IMAGE_PRESETS.map((preset) => {
                    const isSelected = seoOgImage === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSeoOgImage(preset.url)}
                        className={`relative rounded-xl overflow-hidden border text-left transition-all group cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                            : 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="aspect-[16/9] w-full bg-slate-800 overflow-hidden">
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-1.5 bg-[#0e111a] border-t border-white/5">
                          <p className="text-[10px] font-bold text-white truncate">{preset.name}</p>
                          <p className="text-[9px] text-cyan-400">{preset.category}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-cyan-500 text-black p-0.5 rounded-full shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Keywords & Canonical Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1.5">
                <label className="text-xs font-bold text-white block">
                  Palabras Clave (Keywords SEO)
                </label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="pdf a video, whop storefront, ia..."
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <p className="text-[10px] text-slate-500">Separadas por comas para buscadores.</p>
              </div>

              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1.5">
                <label className="text-xs font-bold text-white block">
                  URL Canónica (rel=canonical)
                </label>
                <input
                  type="text"
                  value={seoCanonical}
                  onChange={(e) => setSeoCanonical(e.target.value)}
                  placeholder="https://pdftovideo.whop.site"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-[11px] transition-colors"
                />
                <p className="text-[10px] text-slate-500">Dominio canónico oficial de la tienda.</p>
              </div>
            </div>

            {/* Social Platform Meta Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">Tarjeta Twitter / X</label>
                <select
                  value={seoTwitterCard}
                  onChange={(e) => setSeoTwitterCard(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="summary_large_image">Imagen Grande (Recomendado)</option>
                  <option value="summary">Miniatura Pequeña</option>
                </select>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">Twitter Creator</label>
                <input
                  type="text"
                  value={seoTwitterCreator}
                  onChange={(e) => setSeoTwitterCreator(e.target.value)}
                  placeholder="@whop"
                  className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">Schema.org JSON-LD</label>
                <select
                  value={seoSchemaType}
                  onChange={(e) => setSeoSchemaType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="SoftwareApplication">SoftwareApplication</option>
                  <option value="WebApplication">WebApplication</option>
                  <option value="Product">Product / Tienda</option>
                  <option value="Course">Course / Educativo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Live Previews (Google SERP, Twitter/X, Discord, Raw Code) (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0D1018] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Previsualización en Tiempo Real</span>
                </div>

                {/* Preview Switcher Tabs */}
                <div className="flex items-center p-0.5 bg-white/5 rounded-lg border border-white/10 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setSeoPreviewTab('google')}
                    className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      seoPreviewTab === 'google' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeoPreviewTab('twitter')}
                    className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      seoPreviewTab === 'twitter' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    X (Twitter)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeoPreviewTab('discord')}
                    className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      seoPreviewTab === 'discord' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Social
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeoPreviewTab('code')}
                    className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      seoPreviewTab === 'code' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    HTML
                  </button>
                </div>
              </div>

              {/* Tab 1: Google SERP Preview */}
              {seoPreviewTab === 'google' && (
                <div className="p-4 bg-[#202124] rounded-xl border border-white/10 space-y-2 text-left font-sans">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-[#FF6243] flex items-center justify-center text-white font-black text-[10px]">
                      W
                    </div>
                    <div>
                      <div className="text-[12px] text-[#bdc1c6] font-medium leading-none">
                        {settings.storeName}
                      </div>
                      <div className="text-[10px] text-[#9aa0a6] font-mono leading-tight">
                        {seoCanonical}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                    {seoTitle || 'Título de tu Tienda en Whop'}
                  </h3>
                  <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-2">
                    {seoDesc || 'Descripción meta optimizada que explica por qué tu software o producto es la mejor opción para los clientes.'}
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-[10px] text-[#9aa0a6]">
                    <span>⭐ 5.0 (138+ reseñas)</span>
                    <span>·</span>
                    <span>$19.00 - $99.00</span>
                    <span>·</span>
                    <span className="text-emerald-400">En stock</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Twitter / X Card Preview */}
              {seoPreviewTab === 'twitter' && (
                <div className="rounded-2xl border border-white/15 overflow-hidden bg-black text-left shadow-lg">
                  <div className="aspect-[1.91/1] w-full bg-slate-900 relative overflow-hidden">
                    {seoOgImage ? (
                      <img src={seoOgImage} alt="Open Graph Card" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        Sin imagen Open Graph
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white border border-white/10">
                      pdftovideo.whop.site
                    </span>
                  </div>
                  <div className="p-3.5 space-y-1 bg-[#10121a]">
                    <p className="text-[11px] text-slate-400 font-mono">pdftovideo.whop.site</p>
                    <h4 className="text-xs font-bold text-white line-clamp-1">
                      {seoTitle}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {seoDesc}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Discord / WhatsApp / LinkedIn Card Preview */}
              {seoPreviewTab === 'discord' && (
                <div className="p-3.5 rounded-xl bg-[#2f3136] border-l-4 border-l-[#FF6243] text-left space-y-2">
                  <div className="text-[11px] text-slate-400 font-medium">{settings.storeName}</div>
                  <h4 className="text-xs font-bold text-[#00b0f4] hover:underline cursor-pointer">
                    {seoTitle}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {seoDesc}
                  </p>
                  {seoOgImage && (
                    <div className="rounded-lg overflow-hidden border border-white/10 max-h-48">
                      <img src={seoOgImage} alt="Social Embed" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Tarjeta de previsualización enriquecida (Open Graph 2.0)</span>
                  </div>
                </div>
              )}

              {/* Tab 4: Generated HTML & JSON-LD Code */}
              {seoPreviewTab === 'code' && (
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Etiquetas HTML &lt;head&gt; generadas:</span>
                    <button
                      type="button"
                      onClick={handleCopyHtmlCode}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedHtmlCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHtmlCode ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/70 border border-white/10 text-[10px] font-mono text-cyan-300 overflow-x-auto max-h-64 leading-relaxed">
                    {generatedHtmlTags}
                  </pre>
                </div>
              )}

              {/* Bottom Quick Advice Box */}
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 text-[11px] text-slate-400 space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  <span>Impacto en Conversiones de Whop</span>
                </div>
                <p>
                  Las tarjetas con imagen Open Graph de alta resolución obtienen un <strong>38% más de tasa de clics (CTR)</strong> cuando tus usuarios comparten enlaces en Discord, X o grupos de WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Storefront Backups, JSON Export & Import, and Templates */}
      <div id="backup-section" className="p-6 rounded-3xl bg-[#131622] border border-purple-500/20 space-y-6 scroll-mt-28 shadow-xl shadow-purple-950/20">
        {/* Hidden File Input for .json upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Success Alert Toast if active */}
        {importSuccessMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-3 text-emerald-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-xs font-semibold">{importSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setImportSuccessMessage(null)}
              className="text-xs text-emerald-400/80 hover:text-emerald-300 p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-md">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Copias de Seguridad, Exportación & Plantillas JSON
                </h2>
                <span className="text-[10px] font-bold bg-purple-500/15 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  Respaldos & Compartir
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exporta la configuración completa de tu tienda en un archivo .json para respaldar tu sitio o compartir plantillas con otros creadores. Importa copias en cualquier momento con validación automática.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-3.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Importar Archivo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setImportError(null);
                setPasteModalOpen(true);
              }}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Pegar Código</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Copia JSON</span>
            </button>
          </div>
        </div>

        {/* 2 Main Columns: Left = Current Backup & Export, Right = Drag-and-Drop Importer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Current Snapshot & Export (6 cols) */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Respaldo Actual de la Tienda
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date().toISOString().slice(0, 10)}
              </span>
            </div>

            {/* Store Snapshot Information */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{settings.storeName}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{settings.subdomain}.whop.site</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-white/30"
                    style={{ backgroundColor: settings.accentColor || '#FF6243' }}
                    title={`Color de acento: ${settings.accentColor}`}
                  />
                  <span className="text-[10px] font-mono text-slate-400">{settings.accentColor}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px]">
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <p className="text-[10px] text-slate-400">Planes Activos</p>
                  <p className="font-bold text-white">{settings.plans.length} niveles</p>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <p className="text-[10px] text-slate-400">Opiniones</p>
                  <p className="font-bold text-white">{currentOpinions.length} incluidas</p>
                </div>
                <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                  <p className="text-[10px] text-slate-400">Configuración SEO</p>
                  <p className="font-bold text-emerald-400">Completa</p>
                </div>
              </div>
            </div>

            {/* Export Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleExportJson}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Archivo .JSON</span>
              </button>

              <button
                type="button"
                onClick={handleCopyJsonToClipboard}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">¡Copiado al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copiar JSON Directo</span>
                  </>
                )}
              </button>
            </div>

            {/* Toggle Raw JSON Inspector */}
            <div>
              <button
                type="button"
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-[11px] font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{showRawJson ? 'Ocultar código JSON en vivo' : 'Ver vista previa del código JSON generado'}</span>
                <span>{showRawJson ? '▲' : '▼'}</span>
              </button>

              {showRawJson && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Tamaño: ~{Math.round(currentBackupJson.length / 1024 * 10) / 10} KB</span>
                    <span>Sintaxis JSON V1.0</span>
                  </div>
                  <pre className="p-3 rounded-xl bg-black/80 border border-white/10 text-[10px] font-mono text-purple-200 overflow-x-auto max-h-56 leading-relaxed">
                    {currentBackupJson}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Drag & Drop Importer & File Upload (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 min-h-[220px] ${
                isDraggingFile
                  ? 'border-purple-400 bg-purple-500/10 scale-[1.01]'
                  : 'border-white/15 bg-black/30 hover:border-purple-400/50 hover:bg-black/50'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg">
                <Upload className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">
                  Arrastra y suelta tu archivo .json aquí
                </h4>
                <p className="text-[11px] text-slate-400 max-w-sm">
                  O haz clic para seleccionar un archivo de copia de seguridad o plantilla desde tu computadora.
                </p>
              </div>

              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                Soporta archivos .json de Whop Storefront Studio
              </span>
            </div>

            {/* Error Message Display */}
            {importError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">No se pudo procesar el archivo:</p>
                  <p className="text-[11px] text-rose-300/90">{importError}</p>
                </div>
              </div>
            )}

            {/* Quick Actions & Alternative Import Options */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-200 block">¿Recibiste el código en texto o chat?</span>
                <span className="text-[11px] text-slate-400">Pégalo directamente sin tener que crear un archivo.</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setImportError(null);
                  setPasteModalOpen(true);
                }}
                className="py-2 px-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span>Pegar Código JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Template Sharing & Preset Gallery */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-purple-400" />
                <span>Biblioteca de Plantillas Listas para Cargar & Compartir</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Plantillas profesionales preconfiguradas con copys persuasivos, modelos de precios y configuración SEO que puedes cargar en 1 clic o exportar en JSON.
              </p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              3 plantillas disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STOREFRONT_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tmpl.accentColor }}
                      />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {tmpl.category}
                      </span>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {tmpl.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      {tmpl.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-[10px] text-slate-400">
                    <p className="truncate text-slate-300 font-medium italic">
                      "{tmpl.settings.headline}"
                    </p>
                    <p className="text-purple-300 font-mono">
                      Subdominio: {tmpl.settings.subdomain}.whop.site
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadTemplate(tmpl)}
                    className="flex-1 py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Cargar Plantilla
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDownloadTemplate(tmpl, e)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer border border-white/10"
                    title={`Descargar archivo JSON de ${tmpl.name}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Settings & Whop Controls */}
      <div id="settings-section" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-28">
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

      {/* Modal: Create/Edit Opinion */}
      {opinionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121520] border border-orange-500/30 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingOpinionId ? 'Editar Opinión / Testimonio' : 'Crear Nueva Opinión Ilimitada'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Prueba social verificada para tu tienda Whop</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpinionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOpinion} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre del Cliente / Creador
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Daniel Silva"
                    value={opName}
                    onChange={(e) => setOpName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Rol / Empresa / Nicho
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Creador de Cursos Whop"
                    value={opRole}
                    onChange={(e) => setOpRole(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Calificación de Estrellas (1 - 5)
                  </label>
                  <select
                    value={opStars}
                    onChange={(e) => setOpStars(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Estrellas)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Estrellas)</option>
                    <option value={3}>⭐⭐⭐ (3 Estrellas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Métrica de Éxito / Resultado
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: +180% en ventas / Ahorro de 12h"
                    value={opMetric}
                    onChange={(e) => setOpMetric(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Texto de la Opinión / Testimonio
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escribe la experiencia del creador convirtiendo sus PDFs en videos virales..."
                  value={opComment}
                  onChange={(e) => setOpComment(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Foto de Perfil / Avatar (URL)
                </label>
                <input
                  type="text"
                  value={opAvatar}
                  onChange={(e) => setOpAvatar(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                />
                {/* Quick Avatar Presets */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-400">Presets rápidos:</span>
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                  ].map((url, uIdx) => (
                    <img
                      key={uIdx}
                      src={url}
                      onClick={() => setOpAvatar(url)}
                      alt="Avatar preset"
                      className={`w-6 h-6 rounded-full cursor-pointer object-cover border ${
                        opAvatar === url ? 'border-orange-400 ring-2 ring-orange-500/40' : 'border-white/20 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setOpinionModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF6243] hover:bg-[#ff5130] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingOpinionId ? 'Actualizar Opinión' : 'Guardar Opinión en Tienda'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 1: Import & Template Confirmation Preview */}
      {importModalOpen && previewImportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121520] border border-purple-500/30 rounded-3xl p-6 w-full max-w-2xl space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Confirmar Restauración de Configuración</span>
                  </h3>
                  <p className="text-xs text-purple-300 font-mono">
                    Origen: {previewSource}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Comparison Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Store Box */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Estado Actual</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: settings.accentColor || '#FF6243' }} />
                </div>
                <h4 className="font-bold text-white text-sm">{settings.storeName}</h4>
                <p className="text-[11px] text-slate-400 truncate">{settings.headline}</p>
                <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400 space-y-1">
                  <p>• {settings.plans.length} Planes de precios</p>
                  <p>• {currentOpinions.length} Opiniones / Reseñas</p>
                  <p className="truncate">• SEO: {settings.seo?.pageTitle || 'Configurado'}</p>
                </div>
              </div>

              {/* Imported Store Box */}
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-purple-300">A Importar (Nuevo)</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: previewImportData.accentColor || '#FF6243' }} />
                </div>
                <h4 className="font-bold text-white text-sm">{previewImportData.storeName}</h4>
                <p className="text-[11px] text-slate-300 truncate">{previewImportData.headline}</p>
                <div className="pt-2 border-t border-purple-500/20 text-[10px] text-purple-200 space-y-1">
                  <p>• {previewImportData.plans.length} Planes de precios</p>
                  <p>• {previewImportData.testimonials?.length || 0} Opiniones incluidas</p>
                  <p className="truncate">• SEO: {previewImportData.seo?.pageTitle || 'Personalizado'}</p>
                </div>
              </div>
            </div>

            {/* Detail Tabs / Metadata Preview */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-3 text-xs">
              <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Detalles de la plantilla a aplicar:
              </h5>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Subdominio</span>
                  <span className="font-mono text-purple-300 font-bold">{previewImportData.subdomain}.whop.site</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Categoría</span>
                  <span className="text-white font-medium truncate block">{previewImportData.category}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Garantía</span>
                  <span className="text-emerald-400 font-bold">{previewImportData.guaranteeDays} días</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Color de Marca</span>
                  <span className="font-mono text-white font-bold">{previewImportData.accentColor}</span>
                </div>
              </div>

              {/* Open Graph Thumbnail preview if present */}
              {previewImportData.seo?.ogImage && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <img
                    src={previewImportData.seo.ogImage}
                    alt="Open Graph preview"
                    className="w-16 h-10 rounded-lg object-cover border border-white/10"
                  />
                  <div className="text-[11px] truncate">
                    <p className="font-bold text-white truncate">{previewImportData.seo.ogTitle || previewImportData.seo.pageTitle}</p>
                    <p className="text-[10px] text-slate-400 truncate">{previewImportData.seo.metaDescription}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Preserve Testimonials Option */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-white">Conservar mis opiniones y testimonios actuales</p>
                <p className="text-[11px] text-slate-400">
                  Si marcas esta casilla, tus {currentOpinions.length} opiniones actuales no serán reemplazadas por las de la plantilla importada.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preserveTestimonialsOnImport}
                onChange={(e) => setPreserveTestimonialsOnImport(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded bg-black/60 border-white/20 focus:ring-purple-500 cursor-pointer"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-medium cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Aplicar en Tienda</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Paste Raw JSON Code */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#121520] border border-purple-500/30 rounded-3xl p-6 w-full max-w-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  Pegar Código JSON de Tienda o Plantilla
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPasteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Pega aquí el contenido JSON que hayas recibido por chat, correo o exportado previamente:
            </p>

            <form onSubmit={handlePasteJsonSubmit} className="space-y-4">
              <textarea
                rows={10}
                required
                value={jsonPasteInput}
                onChange={(e) => setJsonPasteInput(e.target.value)}
                placeholder='{\n  "storeName": "Mi Tienda Whop",\n  "subdomain": "mi-tienda",\n  "headline": "Titular de mi producto..."\n}'
                className="w-full p-3.5 bg-black/70 border border-white/10 rounded-2xl text-xs font-mono text-purple-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
              />

              {importError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{importError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPasteModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validar y Previsualizar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
