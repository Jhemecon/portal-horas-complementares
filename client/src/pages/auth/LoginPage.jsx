import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, GraduationCap } from 'lucide-react';

function LoginPage() {
    const { login, loading, error } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        await login(data.email, data.password);
    };

    return (
        <div className="animate-fade-in">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-ciesa-blue flex items-center justify-center mb-4">
                    <GraduationCap className="w-8 h-8 text-ciesa-yellow" />
                </div>
                <h1 className="text-2xl font-bold text-ciesa-blue">Portal do Professor</h1>
                <p className="text-gray-500">CIESA</p>
            </div>

            <Card className="border-0 shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
                    <CardDescription>
                        Digite suas credenciais para acessar o portal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Usuário ou E-mail</Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="admin ou seu.email@seculo.com.br"
                                {...register('email', {
                                    required: 'Usuário ou e-mail é obrigatório',
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-ciesa-blue hover:underline"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('password', {
                                        required: 'Senha é obrigatória',
                                        minLength: {
                                            value: 6,
                                            message: 'Senha deve ter pelo menos 6 caracteres',
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Problemas para acessar?{' '}
                        <a
                            href="mailto:ti@ciesa.com.br"
                            className="text-ciesa-blue hover:underline"
                        >
                            Contate o suporte
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginPage;
