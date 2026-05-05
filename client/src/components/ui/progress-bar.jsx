import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Target, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const ProgressBar = ({ totalRequired = 120, currentCompleted = 85, categories = [] }) => {
    const progressPercentage = Math.min((currentCompleted / totalRequired) * 100, 100);
    const remainingHours = Math.max(totalRequired - currentCompleted, 0);

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'bg-green-500';
        if (percentage >= 75) return 'bg-blue-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getStatusInfo = (percentage) => {
        if (percentage >= 100) return { label: 'Concluído', icon: CheckCircle2, color: 'text-green-600' };
        if (percentage >= 75) return { label: 'Quase lá', icon: Target, color: 'text-blue-600' };
        if (percentage >= 50) return { label: 'Em andamento', icon: Clock, color: 'text-yellow-600' };
        return { label: 'Atenção', icon: AlertTriangle, color: 'text-red-600' };
    };

    const statusInfo = getStatusInfo(progressPercentage);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Progresso das Horas Complementares
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Progresso Geral */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Concluído</span>
                        <span className="text-sm text-muted-foreground">
                            {currentCompleted}h / {totalRequired}h
                        </span>
                    </div>
                    <Progress
                        value={progressPercentage}
                        className="h-3"
                        indicatorClassName={getProgressColor(progressPercentage)}
                    />
                    <div className="flex justify-between items-center">
                        <Badge variant="outline" className={cn("flex items-center gap-1", statusInfo.color)}>
                            <statusInfo.icon className="h-3 w-3" />
                            {statusInfo.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {remainingHours > 0 ? `${remainingHours}h restantes` : 'Meta atingida!'}
                        </span>
                    </div>
                </div>

                {/* Progresso por Categoria */}
                {categories.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium">Por Categoria</h4>
                        <div className="space-y-2">
                            {categories.map((category, index) => {
                                const categoryProgress = Math.min((category.completed / category.required) * 100, 100);
                                return (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm">{category.name}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-muted rounded-full h-2">
                                                <div
                                                    className={cn("h-2 rounded-full", getProgressColor(categoryProgress))}
                                                    style={{ width: `${categoryProgress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground w-12 text-right">
                                                {category.completed}/{category.required}h
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{currentCompleted}</div>
                        <div className="text-xs text-muted-foreground">Horas Aprovadas</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{remainingHours}</div>
                        <div className="text-xs text-muted-foreground">Horas Restantes</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProgressBar;