import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    Award,
    Upload,
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Trash2,
    Eye,
    Download,
    ChevronDown,
    ChevronUp,
    CalendarDays,
    GraduationCap,
    Mic2,
    BookOpen,
    Briefcase,
    Heart,
    X,
    Image,
} from 'lucide-react';

// ── Categorias de atividades complementares ───────────────────────────
const CATEGORIES = [
    { value: 'curso', label: 'Curso Online / Presencial', icon: GraduationCap, color: 'bg-blue-500' },
    { value: 'palestra', label: 'Palestra / Seminário', icon: Mic2, color: 'bg-purple-500' },
    { value: 'workshop', label: 'Workshop / Oficina', icon: BookOpen, color: 'bg-green-500' },
    { value: 'extensao', label: 'Extensão Universitária', icon: Briefcase, color: 'bg-orange-500' },
    { value: 'voluntariado', label: 'Voluntariado / Social', icon: Heart, color: 'bg-pink-500' },
    { value: 'evento', label: 'Evento Acadêmico', icon: CalendarDays, color: 'bg-cyan-500' },
    { value: 'outro', label: 'Outros', icon: FileText, color: 'bg-gray-500' },
];

const STATUS_MAP = {
    pendente: { label: 'Pendente', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400' },
    aprovado: { label: 'Aprovado', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' },
    rejeitado: { label: 'Rejeitado', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' },
    revisao: { label: 'Em Revisão', icon: AlertCircle, color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' },
};

// ── Mock data ─────────────────────────────────────────────────────────
const MOCK_CERTIFICATES = [
    {
        id: 1,
        title: 'Curso de React Avançado',
        institution: 'Alura',
        category: 'curso',
        hours: 40,
        approvedHours: 40,
        date: '2025-11-15',
        status: 'aprovado',
        fileName: 'certificado_react_avancado.pdf',
        fileSize: '1.2 MB',
        description: 'Curso completo de React com hooks, context API, performance e testes.',
    },
    {
        id: 2,
        title: 'Seminário de Inteligência Artificial na Educação',
        institution: 'USP',
        category: 'palestra',
        hours: 8,
        approvedHours: 8,
        date: '2025-12-02',
        status: 'aprovado',
        fileName: 'certificado_ia_educacao.pdf',
        fileSize: '850 KB',
        description: 'Seminário sobre aplicações de IA em ambientes educacionais.',
    },
    {
        id: 3,
        title: 'Workshop de Metodologias Ativas',
        institution: 'UNICAMP',
        category: 'workshop',
        hours: 16,
        approvedHours: null,
        date: '2026-01-20',
        status: 'pendente',
        fileName: 'certificado_metodologias.pdf',
        fileSize: '2.1 MB',
        description: 'Workshop prático sobre metodologias ativas no ensino fundamental e médio.',
    },
    {
        id: 4,
        title: 'Programa de Extensão em Educação Inclusiva',
        institution: 'UNESP',
        category: 'extensao',
        hours: 60,
        approvedHours: null,
        date: '2026-02-05',
        status: 'revisao',
        fileName: 'certificado_extensao_inclusiva.pdf',
        fileSize: '3.4 MB',
        description: 'Programa de extensão focado em práticas de educação inclusiva para alunos com necessidades especiais.',
    },
    {
        id: 5,
        title: 'Ação Voluntária - Reforço Escolar Comunitário',
        institution: 'ONG Educação para Todos',
        category: 'voluntariado',
        hours: 20,
        approvedHours: null,
        date: '2025-10-10',
        status: 'rejeitado',
        fileName: 'declaracao_voluntariado.pdf',
        fileSize: '500 KB',
        description: 'Atividade voluntária de reforço escolar em comunidades carentes.',
    },
];

// ── Componente principal ──────────────────────────────────────────────
function CertificationsPage() {
    const [certificates, setCertificates] = useState(MOCK_CERTIFICATES);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('todos');
    const [filterCategory, setFilterCategory] = useState('todos');
    const [showForm, setShowForm] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [previewCert, setPreviewCert] = useState(null);
    const fileInputRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        institution: '',
        category: 'curso',
        hours: '',
        date: '',
        description: '',
        file: null,
    });

    // ── Cálculos ──
    const totalHoursSubmitted = certificates.reduce((acc, c) => acc + c.hours, 0);
    const totalHoursApproved = certificates.filter(c => c.status === 'aprovado').reduce((acc, c) => acc + (c.approvedHours || 0), 0);
    const totalPending = certificates.filter(c => c.status === 'pendente' || c.status === 'revisao').length;
    const requiredHours = 200;
    const progressPercent = Math.min((totalHoursApproved / requiredHours) * 100, 100);

    // ── Filtros ──
    const filtered = certificates.filter((c) => {
        const matchSearch =
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.institution.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = filterStatus === 'todos' || c.status === filterStatus;
        const matchCategory = filterCategory === 'todos' || c.category === filterCategory;
        return matchSearch && matchStatus && matchCategory;
    });

    // ── Handlers ──
    const handleSubmit = (e) => {
        e.preventDefault();
        const newCert = {
            id: Date.now(),
            ...formData,
            hours: Number(formData.hours),
            approvedHours: null,
            status: 'pendente',
            fileName: formData.file?.name || 'certificado.pdf',
            fileSize: formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(1)} MB` : '0 KB',
        };
        setCertificates((prev) => [newCert, ...prev]);
        setFormData({ title: '', institution: '', category: 'curso', hours: '', date: '', description: '', file: null });
        setShowForm(false);
    };

    const handleDelete = (id) => {
        setCertificates((prev) => prev.filter((c) => c.id !== id));
    };

    const getCategoryInfo = (value) => CATEGORIES.find((c) => c.value === value) || CATEGORIES[6];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Award className="h-7 w-7 text-seculo-yellow" />
                        Horas Complementares
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gerencie seus certificados e acompanhe o aproveitamento de horas complementares.
                    </p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {showForm ? 'Cancelar' : 'Novo Certificado'}
                </Button>
            </div>

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Horas Aprovadas */}
                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Horas Aprovadas</p>
                                <p className="text-3xl font-bold mt-1">{totalHoursApproved}h</p>
                                <p className="text-xs text-gray-400 mt-1">de {requiredHours}h necessárias</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-500">
                                <CheckCircle2 className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Horas Enviadas */}
                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Horas Enviadas</p>
                                <p className="text-3xl font-bold mt-1">{totalHoursSubmitted}h</p>
                                <p className="text-xs text-gray-400 mt-1">total submetido</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-500">
                                <Upload className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Certificados */}
                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Certificados</p>
                                <p className="text-3xl font-bold mt-1">{certificates.length}</p>
                                <p className="text-xs text-gray-400 mt-1">cadastrados</p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-500">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pendentes */}
                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
                                <p className="text-3xl font-bold mt-1">{totalPending}</p>
                                <p className="text-xs text-gray-400 mt-1">aguardando análise</p>
                            </div>
                            <div className="p-3 rounded-full bg-yellow-500">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Progress bar ── */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Progresso de Horas Complementares</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {totalHoursApproved} de {requiredHours} horas aprovadas
                            </p>
                        </div>
                        <span className={cn(
                            'text-2xl font-bold',
                            progressPercent >= 100 ? 'text-green-600 dark:text-green-400' : 'text-seculo-blue dark:text-seculo-yellow'
                        )}>
                            {progressPercent.toFixed(0)}%
                        </span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all duration-700 ease-out',
                                progressPercent >= 100
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                    : 'bg-gradient-to-r from-seculo-blue to-seculo-blue-light dark:from-seculo-yellow dark:to-seculo-yellow-light'
                            )}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    {/* Category breakdown mini */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        {CATEGORIES.map((cat) => {
                            const catHours = certificates
                                .filter(c => c.category === cat.value && c.status === 'aprovado')
                                .reduce((acc, c) => acc + (c.approvedHours || 0), 0);
                            if (catHours === 0) return null;
                            const CatIcon = cat.icon;
                            return (
                                <div key={cat.value} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 rounded-full">
                                    <CatIcon className="h-3.5 w-3.5" />
                                    <span>{cat.label.split(' / ')[0]}: <strong>{catHours}h</strong></span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* ── Formulário de novo certificado ── */}
            {showForm && (
                <Card className="border-2 border-seculo-yellow/50 dark:border-seculo-yellow/30 animate-fade-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-seculo-yellow" />
                            Cadastrar Novo Certificado
                        </CardTitle>
                        <CardDescription>
                            Preencha os dados do certificado e faça o upload do arquivo comprobatório.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Título */}
                                <div className="md:col-span-2">
                                    <Label htmlFor="title">Título da Atividade *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Ex: Curso de React Avançado"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="mt-1.5"
                                    />
                                </div>

                                {/* Instituição */}
                                <div>
                                    <Label htmlFor="institution">Instituição Emissora *</Label>
                                    <Input
                                        id="institution"
                                        placeholder="Ex: Alura, USP, Coursera"
                                        value={formData.institution}
                                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                        required
                                        className="mt-1.5"
                                    />
                                </div>

                                {/* Categoria */}
                                <div>
                                    <Label htmlFor="category">Categoria *</Label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#022b56] dark:text-gray-100"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Carga horária */}
                                <div>
                                    <Label htmlFor="hours">Carga Horária (horas) *</Label>
                                    <Input
                                        id="hours"
                                        type="number"
                                        min="1"
                                        placeholder="Ex: 40"
                                        value={formData.hours}
                                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                        required
                                        className="mt-1.5"
                                    />
                                </div>

                                {/* Data de conclusão */}
                                <div>
                                    <Label htmlFor="date">Data de Conclusão *</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        className="mt-1.5"
                                    />
                                </div>

                                {/* Descrição */}
                                <div className="md:col-span-2">
                                    <Label htmlFor="description">Descrição da Atividade</Label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        placeholder="Descreva brevemente o conteúdo e aprendizados da atividade..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="mt-1.5 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#022b56] placeholder:text-muted-foreground resize-none dark:text-gray-100"
                                    />
                                </div>

                                {/* Upload */}
                                <div className="md:col-span-2">
                                    <Label>Arquivo do Certificado *</Label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn(
                                            'mt-1.5 flex flex-col items-center justify-center gap-2 p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
                                            'border-gray-300 dark:border-gray-600 hover:border-seculo-blue dark:hover:border-seculo-yellow',
                                            'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800',
                                            formData.file && 'border-green-400 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
                                        )}
                                    >
                                        {formData.file ? (
                                            <>
                                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                                                <p className="text-sm font-medium text-green-700 dark:text-green-400">{formData.file.name}</p>
                                                <p className="text-xs text-gray-500">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-gray-400" />
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    Clique para fazer upload ou arraste o arquivo
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    PDF, JPG ou PNG • Máximo 10 MB
                                                </p>
                                            </>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Enviar Certificado
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* ── Search & Filters ── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por título ou instituição..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="shrink-0"
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                    {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                </Button>
            </div>

            {showFilters && (
                <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
                    <div className="flex-1">
                        <Label className="text-xs text-gray-500 mb-1 block">Status</Label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#022b56] dark:text-gray-100"
                        >
                            <option value="todos">Todos os status</option>
                            {Object.entries(STATUS_MAP).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <Label className="text-xs text-gray-500 mb-1 block">Categoria</Label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#022b56] dark:text-gray-100"
                        >
                            <option value="todos">Todas as categorias</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* ── Lista de certificados ── */}
            {filtered.length === 0 ? (
                <Card>
                    <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Award className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Nenhum certificado encontrado</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {searchQuery || filterStatus !== 'todos' || filterCategory !== 'todos'
                                ? 'Tente ajustar os filtros de busca.'
                                : 'Cadastre seu primeiro certificado clicando no botão acima.'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((cert) => {
                        const catInfo = getCategoryInfo(cert.category);
                        const CatIcon = catInfo.icon;
                        const statusInfo = STATUS_MAP[cert.status];
                        const StatusIcon = statusInfo.icon;
                        const isExpanded = expandedCard === cert.id;

                        return (
                            <Card
                                key={cert.id}
                                className={cn(
                                    'card-hover transition-all duration-200',
                                    isExpanded && 'ring-2 ring-seculo-blue/20 dark:ring-seculo-yellow/20'
                                )}
                            >
                                <CardContent className="p-0">
                                    {/* Main row */}
                                    <div
                                        className="flex items-center gap-4 p-4 cursor-pointer"
                                        onClick={() => setExpandedCard(isExpanded ? null : cert.id)}
                                    >
                                        {/* Category icon */}
                                        <div className={cn('p-2.5 rounded-lg shrink-0', catInfo.color)}>
                                            <CatIcon className="h-5 w-5 text-white" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {cert.title}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                                                <span>{cert.institution}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="hidden sm:inline">{catInfo.label}</span>
                                                <span>•</span>
                                                <span className="font-medium">{cert.hours}h</span>
                                            </div>
                                        </div>

                                        {/* Status badge */}
                                        <div className={cn(
                                            'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium shrink-0',
                                            statusInfo.color
                                        )}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">{statusInfo.label}</span>
                                        </div>

                                        {/* Expand toggle */}
                                        <div className="shrink-0 text-gray-400">
                                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                        </div>
                                    </div>

                                    {/* Expanded details */}
                                    {isExpanded && (
                                        <div className="border-t px-4 pb-4 pt-3 space-y-4 animate-fade-in">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Instituição</p>
                                                    <p className="text-sm font-medium mt-0.5">{cert.institution}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</p>
                                                    <p className="text-sm font-medium mt-0.5 flex items-center gap-1.5">
                                                        <CatIcon className="h-3.5 w-3.5" />
                                                        {catInfo.label}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data de Conclusão</p>
                                                    <p className="text-sm font-medium mt-0.5">
                                                        {new Date(cert.date).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Horas Aprovadas</p>
                                                    <p className="text-sm font-medium mt-0.5">
                                                        {cert.approvedHours !== null ? `${cert.approvedHours}h` : '—'}
                                                    </p>
                                                </div>
                                            </div>

                                            {cert.description && (
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</p>
                                                    <p className="text-sm mt-0.5 text-gray-700 dark:text-gray-300">{cert.description}</p>
                                                </div>
                                            )}

                                            {/* File info & actions */}
                                            <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <FileText className="h-4 w-4 text-gray-500 shrink-0" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{cert.fileName}</span>
                                                    <span className="text-xs text-gray-400 shrink-0">{cert.fileSize}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Visualizar"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewCert(cert);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" title="Download">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    {(cert.status === 'pendente' || cert.status === 'rejeitado') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Excluir"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(cert.id);
                                                            }}
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Rejection reason */}
                                            {cert.status === 'rejeitado' && (
                                                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium text-red-700 dark:text-red-400">Certificado rejeitado</p>
                                                        <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">
                                                            Motivo: Documento não contém carga horária especificada. Envie uma versão atualizada.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* ── Preview Modal ── */}
            {previewCert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in" onClick={() => setPreviewCert(null)}>
                    <div
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{previewCert.title}</h3>
                                <p className="text-sm text-gray-500">{previewCert.fileName}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewCert(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-800">
                            <Image className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pré-visualização do certificado</p>
                            <p className="text-xs text-gray-400 mt-1">{previewCert.fileName} • {previewCert.fileSize}</p>
                        </div>
                        <div className="flex items-center justify-end gap-2 p-4 border-t dark:border-gray-700">
                            <Button variant="outline" onClick={() => setPreviewCert(null)}>
                                Fechar
                            </Button>
                            <Button>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CertificationsPage;
