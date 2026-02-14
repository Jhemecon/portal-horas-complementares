import { Outlet } from 'react-router-dom';

function AuthLayout() {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-seculo-blue items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <div className="mb-8">
                        <div className="w-24 h-24 mx-auto rounded-full bg-seculo-yellow flex items-center justify-center">
                            <span className="text-seculo-blue font-bold text-3xl">CS</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Portal do Professor
                    </h1>
                    <p className="text-blue-200 text-lg">
                        Colégio Século - Sistema de Gestão Educacional
                    </p>
                    <div className="mt-12 space-y-4 text-left">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-seculo-yellow/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-seculo-yellow text-sm">✓</span>
                            </div>
                            <p className="text-blue-100">Gestão completa de notas e frequência</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-seculo-yellow/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-seculo-yellow text-sm">✓</span>
                            </div>
                            <p className="text-blue-100">Calendário de avaliações integrado</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-seculo-yellow/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-seculo-yellow text-sm">✓</span>
                            </div>
                            <p className="text-blue-100">Comunicação direta com alunos e responsáveis</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
