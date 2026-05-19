export const USER_ROLES = {
    TEACHER: 'teacher',
    COORDINATOR: 'coordinator',
    SECRETARY: 'secretary',
    ADMIN: 'admin',
};

export const ROLE_LABELS = {
    [USER_ROLES.TEACHER]: 'Professor',
    [USER_ROLES.COORDINATOR]: 'Coordenador',
    [USER_ROLES.SECRETARY]: 'Secretaria',
    [USER_ROLES.ADMIN]: 'Gestor',
};

export const ROLE_PERMISSIONS = {
    [USER_ROLES.COORDINATOR]: [
        'view_all_students',
        'view_all_grades',
        'edit_grades',
        'view_reports',
        'manage_calendar',
        'manage_reservations',
        'send_announcements',
    ],
    [USER_ROLES.TEACHER]: [
        'view_own_students',
        'view_own_grades',
        'edit_own_grades',
        'view_own_reports',
        'view_calendar',
        'request_reservations',
        'send_messages',
    ],
    [USER_ROLES.SECRETARY]: [
        'view_all_students',
        'edit_student_records',
        'manage_enrollment',
        'view_reports',
        'manage_reservations',
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
