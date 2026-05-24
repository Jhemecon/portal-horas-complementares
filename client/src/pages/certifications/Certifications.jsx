import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import ProgressBar from '@/components/ui/progress-bar';
import FileUpload from '@/components/ui/file-upload';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';
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
    Loader2
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

// Atualizado para bater com os status que vêm do banco de dados (inglês)
const STATUS_MAP = {
    pending: { label: 'Pendente', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400' },
    approved: { label: 'Aprovado', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' },
    rejected: { label: 'Rejeitado', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' },
    review: { label: 'Em Revisão', icon: AlertCircle, color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' },
};

function CertificationsPage() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('todos');
    const [filterCategory, setFilterCategory] = useState('todos');
    const [showForm, setShowForm] = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [previewCert, setPreviewCert] = useState(null);
    const { addNotification } = useApp();

    const API_URL = 'http://localhost:5000/api';

    // ── BUSCAR DADOS DO BANCO AO CARREGAR ──
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`${API_URL}/submissions`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCertificates(data);
                }
            } catch (error) {
                console.error("Erro ao carregar certificados:", error);
                toast.error("Não foi possível carregar os certificados.");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

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

    // ── Cálculos (Atualizados para as chaves do banco de dados) ──
    const totalHoursSubmitted = certificates.reduce((acc, c) => acc + (c.hoursClaimed || 0), 0);
    const totalHoursApproved = certificates.filter(c => c.status === 'approved').reduce((acc, c) => acc + (c.hoursApproved || 0), 0);
    const totalPending = certificates.filter(c => c.status === 'pending' || c.status === 'review').length;
    const requiredHours = 200;
    const progressPercent = Math.min((totalHoursApproved / requiredHours) * 100, 100);

    const categoryProgress = CATEGORIES.map(cat => {
        const completed = certificates
            .filter(c => (c.category || 'curso') === cat.value && c.status === 'approved')
            .reduce((acc, c) => acc + (c.hoursApproved || 0), 0);
        return {
            name: cat.label.split(' / '),
            completed,
            required: 50,
        };
    });

    // ── Filtros ──
    const filtered = certificates.filter((c) => {
        const matchSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = filterStatus === 'todos' || c.status === filterStatus;
        return matchSearch && matchStatus;
    });

    // ── ENVIAR PARA O BANCO DE DADOS ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.file) {
            toast.error("Por favor, anexe o arquivo do certificado.");
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('auth_token');
            const submitData = new FormData();
            
            submitData.append('title', formData.title);
            submitData.append('hoursClaimed', formData.hours);
            // ID da atividade de testes que você criou no banco!
            submitData.append('activityId', '6de83a9e-9e70-465a-b422-b4db1ee30ed3'); 
            submitData.append('certificate', formData.file);

            const response = await fetch(`${API_URL}/submissions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });

            if (response.ok) {
                const result = await response.json();
                
                // Adiciona o novo certificado retornado do banco à lista atual da tela
                setCertificates((prev) => [result.submission, ...prev]);
                
                // Limpa o formulário
                setFormData({ title: '', institution: '', category: 'curso', hours: '', date: '', description: '', file: null });
                setShowForm(false);

                toast.success('Certificado enviado com sucesso!', {
                    description: 'Sua solicitação será analisada em breve.',
                });

                addNotification({
                    title: 'Certificado Enviado',
                    message: `Seu certificado "${result.submission.title}" foi enviado e está aguardando análise.`,
                    type: 'info',
                });
            } else {
                const errData = await response.json();
                toast.error(`Erro: ${errData.error}`);
            }
        } catch (error) {
            console.error("Erro no envio:", error);
            toast.error("Erro de conexão com o servidor.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        // Num projeto real, faríamos um DELETE /api/submissions/:id aqui
        setCertificates((prev) => prev.filter((c) => c.id !== id));
        toast.info("Certificado removido visualmente.");
    };

    const getCategoryInfo = (value) => CATEGORIES.find((c) => c.value === value) || CATEGORIES;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-ciesa-blue" />
                <p className="mt-4 text-gray-500">Carregando seus certificados...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Award className="h-7 w-7 text-ciesa-yellow" />
                        Horas Complementares
                    </h1>
                    <p className="text-gray-500 dark:text-gray-300 mt-1">
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
                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-300">Horas Aprovadas</p>
                                <p className="text-3xl font-bold mt-1">{totalHoursApproved}h</p>
                                <p className="text-xs text-gray-400 mt-1">de {requiredHours}h necessárias</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-500">
                                <CheckCircle2 className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-300">Horas Enviadas</p>
                                <p className="text-3xl font-bold mt-1">{totalHoursSubmitted}h</p>
                                <p className="text-xs text-gray-400 mt-1">total submetido</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-500">
                                <Upload className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-300">Certificados</p>
                                <p className="text-3xl font-bold mt-1">{certificates.length}</p>
                                <p className="text-xs text-gray-400 mt-1">cadastrados</p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-500">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-hover">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-300">Pendentes</p>
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
            <ProgressBar
                totalRequired={requiredHours}
                currentCompleted={totalHoursApproved}
                categories={categoryProgress}
            />

            {/* ── Formulário de novo certificado ── */}
            {showForm && (
                <Card className="border-2 border-ciesa-yellow/50 dark:border-ciesa-yellow/30 animate-fade-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-ciesa-yellow" />
                            Cadastrar Novo Certificado
                        </CardTitle>
                        <CardDescription>
                            Preencha os dados do certificado e faça o upload do arquivo comprobatório.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <div>
                                    <Label htmlFor="institution">Instituição Emissora</Label>
                                    <Input
                                        id="institution"
                                        placeholder="Ex: Alura, USP, Coursera"
                                        value={formData.institution}
                                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="category">Categoria</Label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#022b56] dark:text-gray-100"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
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
                                <div className="md:col-span-2">
                                    <FileUpload
                                        onFileSelect={(file) => setFormData({ ...formData, file })}
                                        currentFile={formData.file}
                                        onRemove={() => setFormData({ ...formData, file: null })}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={submitting}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                                    {submitting ? 'Enviando...' : 'Enviar Certificado'}
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
                        placeholder="Buscar por título..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* ── Lista de certificados ── */}
            {filtered.length === 0 ? (
                <Card>
                    <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Award className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Nenhum certificado encontrado</p>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                            Cadastre seu primeiro certificado clicando no botão acima.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((cert) => {
                        const catInfo = getCategoryInfo(cert.category || 'curso');
                        const CatIcon = catInfo.icon;
                        const statusInfo = STATUS_MAP[cert.status] || STATUS_MAP.pending;
                        const StatusIcon = statusInfo.icon;
                        const isExpanded = expandedCard === cert.id;

                        // Extrair o nome original do arquivo da URL (removendo o timestamp e a pasta)
                        const rawFileName = cert.certificateUrl ? cert.certificateUrl.split('-').slice(2).join('-') : 'Documento';

                        return (
                            <Card key={cert.id} className={cn('card-hover transition-all duration-200', isExpanded && 'ring-2 ring-ciesa-blue/20 dark:ring-ciesa-yellow/20')}>
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpandedCard(isExpanded ? null : cert.id)}>
                                        <div className={cn('p-2.5 rounded-lg shrink-0', catInfo.color)}>
                                            <CatIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold text-gray-900 dark:text-white truncate">{cert.title}</p>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-300 flex-wrap">
                                                <span>{catInfo.label}</span>
                                                <span>•</span>
                                                <span className="font-medium">{cert.hoursClaimed}h</span>
                                            </div>
                                        </div>
                                        <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium shrink-0', statusInfo.color)}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">{statusInfo.label}</span>
                                        </div>
                                        <div className="shrink-0 text-gray-400">
                                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                        </div>
                                    </div>
                                    {isExpanded && (
                                        <div className="border-t px-4 pb-4 pt-3 space-y-4 animate-fade-in">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Data de Envio</p>
                                                    <p className="text-sm font-medium mt-0.5">
                                                        {new Date(cert.createdAt).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Horas Aprovadas</p>
                                                    <p className="text-sm font-medium mt-0.5">
                                                        {cert.hoursApproved !== null ? `${cert.hoursApproved}h` : 'Em análise'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <FileText className="h-4 w-4 text-gray-500 shrink-0" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{rawFileName}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" title="Visualizar" onClick={(e) => { e.stopPropagation(); setPreviewCert(cert); }}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {previewCert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in" onClick={() => setPreviewCert(null)}>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b">
                            <div>
                                <h3 className="font-semibold">{previewCert.title}</h3>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewCert(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] bg-gray-50">
                            <Image className="h-16 w-16 text-gray-300 mb-4" />
                            <p className="text-sm text-gray-500">
                                Para visualizar o arquivo original, <a href={`http://localhost:5000${previewCert.certificateUrl}`} target="_blank" rel="noreferrer" className="text-ciesa-blue underline">clique aqui</a>.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CertificationsPage;