import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
    HelpCircle,
    FileText,
    Award,
    CheckCircle,
    AlertTriangle,
    Mail,
    Phone,
    GraduationCap,
    Mic2,
    BookOpen,
    Briefcase,
    Heart,
    CalendarDays,
} from 'lucide-react';

const HelpPage = () => {
    const faqs = [
        {
            question: 'Quais atividades são válidas para horas complementares?',
            answer: 'São válidas atividades acadêmicas, culturais, esportivas e de extensão universitária que contribuam para a formação integral do aluno. Incluem cursos, palestras, workshops, voluntariado, eventos acadêmicos, entre outros.',
        },
        {
            question: 'Qual é o limite de horas por categoria?',
            answer: 'Cada categoria tem um limite específico: Cursos (80h), Palestras/Seminários (40h), Workshops (60h), Extensão Universitária (60h), Voluntariado (40h), Eventos Acadêmicos (40h). O total máximo é de 200 horas.',
        },
        {
            question: 'Como funciona a aprovação das atividades?',
            answer: 'Após o envio, sua atividade é analisada pela coordenação do curso. O processo pode levar até 7 dias úteis. Você receberá uma notificação por e-mail e no sistema sobre a decisão.',
        },
        {
            question: 'Posso enviar atividades retroativas?',
            answer: 'Sim, atividades realizadas nos últimos 2 anos podem ser submetidas. Certifique-se de ter o certificado ou comprovante oficial da instituição.',
        },
        {
            question: 'O que acontece se minha atividade for rejeitada?',
            answer: 'Em caso de rejeição, você receberá uma justificativa detalhada. Poderá corrigir e reenviar a atividade ou escolher outra atividade válida.',
        },
        {
            question: 'Como acompanhar meu progresso?',
            answer: 'Acesse a página inicial para ver sua barra de progresso geral e por categoria. Também é possível visualizar o histórico completo de todas as atividades enviadas.',
        },
    ];

    const categories = [
        {
            icon: GraduationCap,
            title: 'Cursos Online/Presenciais',
            description: 'Cursos de capacitação, treinamentos e workshops ministrados por instituições reconhecidas.',
            examples: ['Curso de Programação', 'Workshop de Metodologias Ativas', 'Curso de Idiomas'],
            requirements: ['Certificado oficial', 'Carga horária mínima de 8h', 'Instituição credenciada'],
        },
        {
            icon: Mic2,
            title: 'Palestras/Seminários',
            description: 'Participação em eventos acadêmicos, conferências e seminários.',
            examples: ['Seminário de Educação', 'Palestra sobre Inovação', 'Congresso Acadêmico'],
            requirements: ['Certificado de participação', 'Duração mínima de 2h', 'Tema relacionado à formação'],
        },
        {
            icon: BookOpen,
            title: 'Workshops/Oficinas',
            description: 'Atividades práticas e hands-on em diversas áreas do conhecimento.',
            examples: ['Oficina de Robótica', 'Workshop de Design', 'Laboratório de Ciências'],
            requirements: ['Comprovante de participação', 'Carga horária definida', 'Conteúdo pedagógico'],
        },
        {
            icon: Briefcase,
            title: 'Extensão Universitária',
            description: 'Projetos de extensão, monitoria e atividades de apoio acadêmico.',
            examples: ['Projeto de Extensão', 'Monitoria Acadêmica', 'Programa de Tutoria'],
            requirements: ['Atestado da instituição', 'Supervisão docente', 'Relatório de atividades'],
        },
        {
            icon: Heart,
            title: 'Voluntariado/Social',
            description: 'Atividades voluntárias em organizações sociais e comunitárias.',
            examples: ['ONG de Educação', 'Projeto Social', 'Ação Comunitária'],
            requirements: ['Declaração da instituição', 'Descrição das atividades', 'Período de atuação'],
        },
        {
            icon: CalendarDays,
            title: 'Eventos Acadêmicos',
            description: 'Participação em feiras, exposições e eventos científicos.',
            examples: ['Feira de Ciências', 'Exposição Cultural', 'Evento Científico'],
            requirements: ['Certificado de participação', 'Instituição promotora', 'Relevância acadêmica'],
        },
    ];

    const contactInfo = [
        {
            icon: Mail,
            title: 'E-mail',
            value: 'horascomplementares@ciesa.com.br',
            description: 'Para dúvidas gerais e suporte técnico',
        },
        {
            icon: Phone,
            title: 'Telefone',
            value: '(11) 9999-9999',
            description: 'Atendimento de segunda a sexta, 8h às 18h',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Central de Ajuda</h1>
                    <p className="text-muted-foreground">
                        Tudo que você precisa saber sobre horas complementares
                    </p>
                </div>
            </div>

            {/* Categorias Válidas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Categorias de Atividades Válidas
                    </CardTitle>
                    <CardDescription>
                        Conheça os tipos de atividades aceitas e seus requisitos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <Card key={index} className="border-l-4 border-l-blue-500">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                                <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm mb-1">{category.title}</h3>
                                                <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                                                <div className="space-y-1">
                                                    <div>
                                                        <p className="text-xs font-medium">Exemplos:</p>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {category.examples.map((example, i) => (
                                                                <Badge key={i} variant="outline" className="text-xs">
                                                                    {example}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium">Requisitos:</p>
                                                        <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                                            {category.requirements.map((req, i) => (
                                                                <li key={i} className="flex items-center gap-1">
                                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                                    {req}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Perguntas Frequentes
                    </CardTitle>
                    <CardDescription>
                        Respostas para as dúvidas mais comuns
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            {/* Contato */}
            <Card>
                <CardHeader>
                    <CardTitle>Precisa de Ajuda?</CardTitle>
                    <CardDescription>
                        Entre em contato conosco para suporte adicional
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contactInfo.map((contact, index) => {
                            const Icon = contact.icon;
                            return (
                                <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{contact.title}</p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">{contact.value}</p>
                                        <p className="text-xs text-muted-foreground">{contact.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Avisos Importantes */}
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-orange-800 dark:text-orange-200">Avisos Importantes</h3>
                            <ul className="text-sm text-orange-700 dark:text-orange-300 mt-2 space-y-1">
                                <li>• Todas as atividades devem ser comprovadas com documentação oficial</li>
                                <li>• Certificados digitais devem conter assinatura e carimbo da instituição</li>
                                <li>• Atividades sem comprovação não serão validadas</li>
                                <li>• O prazo para contestação de decisão é de 7 dias úteis</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default HelpPage;