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
                <h1 className="text-2xl font-bold text-ciesa-blue">Portal de Horas Complementares</h1>
                <p className="text-gray-500">CIESA</p>
            </div>

            <Card className="border border-gray-200 shadow-xl bg-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-gray-900">Entrar</CardTitle>
                    <CardDescription className="text-gray-500">
                        Digite suas credenciais para acessar o portal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            {/* Cor adicionada à Label */}
                            <Label htmlFor="email" className="text-gray-700 font-semibold">Usuário ou E-mail</Label>
                            
                            {/* Cores, fundo e placeholder forçados no Input */}
                            <Input
                                id="email"
                                type="text"
                                className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
                                placeholder="seu.email@ciesa.com.br"
                                {...register('email', {
                                    required: 'Usuário ou e-mail é obrigatório',
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                {/* Cor adicionada à Label */}
                                <Label htmlFor="password" className="text-gray-700 font-semibold">Senha</Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-ciesa-blue hover:underline font-medium"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>
                            <div className="relative">
                                {/* Cores, fundo e placeholder forçados no Input */}
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="bg-white text-gray-900 border-gray-300 placeholder:text-gray-400 pr-10"
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-ciesa-blue text-white hover:opacity-90" disabled={loading}>
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
                            className="text-ciesa-blue hover:underline font-medium"
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
