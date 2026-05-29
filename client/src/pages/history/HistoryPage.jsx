import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Eye,
    Download,
    CalendarDays,
    GraduationCap,
    Mic2,
    BookOpen,
    Briefcase,
    Heart,
    ChevronDown,
    ChevronUp,
    FileDown,
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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


export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch('http://localhost:5000/api/submissions', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('Erro ao carregar histórico');
                }

                const submissions = await response.json();
                const normalized = submissions.map((item) => ({
                    id: item.id,
                    title: item.title,
                    institution: 'Atividade complementar cadastrada',
                    category: 'outro',
                    hoursRequested: item.hoursClaimed || 0,
                    hoursApproved: item.hoursApproved ?? null,
                    dateSubmitted: item.createdAt,
                    dateReviewed: item.updatedAt || null,
                    status: item.status === 'approved' ? 'aprovado' : item.status === 'rejected' ? 'rejeitado' : 'pendente',
                    justification: item.rejectionReason || null,
                    fileName: item.certificateUrl?.split('/').pop() || 'certificado.pdf',
                    reviewer: null,
                }));

                setHistory(normalized);
            } catch (error) {
                console.error('Erro ao carregar histórico:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Filtrar dados
    const filteredHistory = history.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.institution.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Gerar relatório PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(20);
        doc.text('Relatório de Histórico de Atividades Complementares', 20, 20);
        
        // Data do relatório
        doc.setFontSize(12);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, 35);
        
        // Estatísticas
        const totalAtividades = filteredHistory.length;
        const aprovadas = filteredHistory.filter(h => h.status === 'aprovado').length;
        const horasAprovadas = filteredHistory.filter(h => h.status === 'aprovado').reduce((acc, h) => acc + (h.hoursApproved || 0), 0);
        
        doc.text(`Total de atividades: ${totalAtividades}`, 20, 50);
        doc.text(`Atividades aprovadas: ${aprovadas}`, 20, 60);
        doc.text(`Horas aprovadas: ${horasAprovadas}h`, 20, 70);
        
        // Tabela
        const tableData = filteredHistory.map(item => [
            item.title,
            item.institution,
            getCategoryInfo(item.category).label,
            item.hoursRequested + 'h',
            item.hoursApproved ? item.hoursApproved + 'h' : 'N/A',
            STATUS_MAP[item.status].label,
            new Date(item.dateSubmitted).toLocaleDateString('pt-BR'),
            item.dateReviewed ? new Date(item.dateReviewed).toLocaleDateString('pt-BR') : 'N/A',
        ]);
        
        doc.autoTable({
            head: [['Título', 'Instituição', 'Categoria', 'Horas Solicitadas', 'Horas Aprovadas', 'Status', 'Data Envio', 'Data Revisão']],
            body: tableData,
            startY: 80,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] },
        });
        
        // Salvar
        doc.save('historico-atividades-complementares.pdf');
    };

    const toggleRowExpansion = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const getCategoryInfo = (categoryValue) => {
        return CATEGORIES.find(cat => cat.value === categoryValue) || CATEGORIES[CATEGORIES.length - 1];
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Histórico de Atividades</h1>
                    <p className="text-muted-foreground">
                        Acompanhe todas as suas solicitações de horas complementares
                    </p>
                </div>
                <Button onClick={generatePDF} variant="outline">
                    <FileDown className="h-4 w-4 mr-2" />
                    Gerar Relatório PDF
                </Button>
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Buscar</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Título ou instituição..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="all">Todos os status</option>
                                <option value="pendente">Pendente</option>
                                <option value="revisao">Em Revisão</option>
                                <option value="aprovado">Aprovado</option>
                                <option value="rejeitado">Rejeitado</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria</Label>
                            <select
                                id="category"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="all">Todas as categorias</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Histórico */}
            <Card>
                <CardHeader>
                    <CardTitle>Atividades Enviadas</CardTitle>
                    <CardDescription>
                        {filteredHistory.length} atividade(s) encontrada(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">Carregando histórico do servidor...</div>
                        ) : filteredHistory.length === 0 ? (
                            <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">Nenhuma atividade encontrada no banco de dados.</div>
                        ) : (
                            filteredHistory.map((item) => {
                                const categoryInfo = getCategoryInfo(item.category);
                                const statusInfo = STATUS_MAP[item.status];
                                const StatusIcon = statusInfo.icon;
                                const CategoryIcon = categoryInfo.icon;
                                const isExpanded = expandedRows.has(item.id);

                                return (
                                <Card key={item.id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div
                                            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => toggleRowExpansion(item.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("p-2 rounded-lg", categoryInfo.color)}>
                                                        <CategoryIcon className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{item.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{item.institution}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium">
                                                            {item.hoursApproved || item.hoursRequested}h solicitadas
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {item.hoursApproved ? `${item.hoursApproved}h aprovadas` : 'Aguardando aprovação'}
                                                        </p>
                                                    </div>
                                                    <div className={cn("px-3 py-1 rounded-full text-xs font-medium border", statusInfo.color)}>
                                                        <StatusIcon className="inline h-3 w-3 mr-1" />
                                                        {statusInfo.label}
                                                    </div>
                                                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </div>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="border-t bg-muted/30 p-4 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="font-medium mb-2">Detalhes da Atividade</h4>
                                                        <dl className="space-y-1 text-sm">
                                                            <div className="flex justify-between">
                                                                <dt className="text-muted-foreground">Categoria:</dt>
                                                                <dd>{categoryInfo.label}</dd>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <dt className="text-muted-foreground">Horas solicitadas:</dt>
                                                                <dd>{item.hoursRequested}h</dd>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <dt className="text-muted-foreground">Horas aprovadas:</dt>
                                                                <dd>{item.hoursApproved ? `${item.hoursApproved}h` : 'N/A'}</dd>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <dt className="text-muted-foreground">Data de envio:</dt>
                                                                <dd>{new Date(item.dateSubmitted).toLocaleDateString('pt-BR')}</dd>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <dt className="text-muted-foreground">Data de revisão:</dt>
                                                                <dd>{item.dateReviewed ? new Date(item.dateReviewed).toLocaleDateString('pt-BR') : 'N/A'}</dd>
                                                            </div>
                                                            {item.reviewer && (
                                                                <div className="flex justify-between">
                                                                    <dt className="text-muted-foreground">Avaliador:</dt>
                                                                    <dd>{item.reviewer}</dd>
                                                                </div>
                                                            )}
                                                        </dl>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-2">Arquivo</h4>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{item.fileName}</span>
                                                            <Button variant="outline" size="sm">
                                                                <Download className="h-3 w-3 mr-1" />
                                                                Baixar
                                                            </Button>
                                                        </div>
                                                        {item.justification && (
                                                            <div className="mt-4">
                                                                <h4 className="font-medium mb-2">Justificativa</h4>
                                                                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                                                    {item.justification}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}