import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatDate(date, options = {}) {
    const defaultOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...options,
    };
    return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(new Date(date));
}

export function formatDateTime(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

export function formatCPF(cpf) {
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || '';
}

export function formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

export function getInitials(name) {
    if (!name) return '';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function calculateAverage(grades, weights = null) {
    if (!grades || grades.length === 0) return 0;

    if (weights && weights.length === grades.length) {
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        const weightedSum = grades.reduce((sum, grade, i) => sum + grade * weights[i], 0);
        return weightedSum / totalWeight;
    }

    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
}

export function getGradeStatus(grade, passingGrade = 6) {
    if (grade >= passingGrade) return 'approved';
    if (grade >= passingGrade - 1) return 'recovery';
    return 'failed';
}

export function getAttendanceStatus(percentage) {
    if (percentage >= 75) return 'good';
    if (percentage >= 60) return 'warning';
    return 'critical';
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export function sortByName(a, b) {
    return a.name.localeCompare(b.name, 'pt-BR');
}

export function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = typeof key === 'function' ? key(item) : item[key];
        (result[groupKey] = result[groupKey] || []).push(item);
        return result;
    }, {});
}
