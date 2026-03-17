"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Flame,
  FlaskConical,
  Cpu,
  BookCopy,
  User,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/logo';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/alimentos', label: 'Alimentos', icon: Flame },
  { href: '/laboratorio', label: 'Laboratorio', icon: FlaskConical },
  { href: '/chef-ia', label: 'Chef IA', icon: Cpu },
  { href: '/bitacora', label: 'Bitácora', icon: BookCopy },
];

const profileItem = { href: '/perfil', label: 'Perfil Guerrero', icon: User };
const logoutItem = { href: '/login', label: 'Cerrar Sesión', icon: LogOut };

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border">
         <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href={profileItem.href}>
                        <SidebarMenuButton isActive={isActive(profileItem.href)} tooltip={{ children: profileItem.label }}>
                            <profileItem.icon />
                            <span>{profileItem.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href={logoutItem.href}>
                        <SidebarMenuButton tooltip={{ children: logoutItem.label }}>
                            <logoutItem.icon />
                            <span>{logoutItem.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
         </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
