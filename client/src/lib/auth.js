export const USER_ROLES = {
    STUDENT: 'student', // <-- Adicionado o cargo de estudante!
    TEACHER: 'teacher',
    COORDINATOR: 'coordinator',
    SECRETARY: 'secretary',
    ADMIN: 'admin',
};

export const ROLE_LABELS = {
    [USER_ROLES.STUDENT]: 'Estudante',
    [USER_ROLES.TEACHER]: 'Professor',
    [USER_ROLES.COORDINATOR]: 'Coordenador',
    [USER_ROLES.SECRETARY]: 'Secretaria',
    [USER_ROLES.ADMIN]: 'Gestor',
};

export const ROLE_PERMISSIONS = {
    [USER_ROLES.ADMIN]: [
        // Admin pode tudo
    ],
    [USER_ROLES.COORDINATOR]: [
        'view_all_students',
        'validate_certificates', // Para validar as horas
        'manage_activities',
    ],
    [USER_ROLES.STUDENT]: [
        'view_own_dashboard',
        'submit_certificates', // Para enviar horas
        'view_own_submissions'
    ],
};

export function hasPermissionForRole(role, permission) {
    if (!role) return false;
    if (role === USER_ROLES.ADMIN) return true;
    return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

export function hasRole(userRole, roles) {
    if (!userRole) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole);
}