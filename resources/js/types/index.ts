import type { LucideIcon } from 'lucide-react';

export interface SessionInfo {
    agent: {
        is_desktop: boolean;
        platform: string;
        browser: string;
    };
    ip_address: string;
    is_current_device: boolean;
    last_active: string;
}

export interface Team {
    id: number;
    name: string;
    slug: string;
    personal_team: boolean;
}

export interface Auth {
    user: User;
    selectors: Selectors;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    avatar: string;
    role: string;
    two_factor_enabled: boolean;
    [key: string]: unknown;
}

export interface Selectors {
    teams: Array<Team>;
    current_team: Team;
}
