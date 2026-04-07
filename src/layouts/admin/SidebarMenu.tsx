import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { FileText, ChartPie } from 'lucide-react';
import { ThemeSelect } from '@/components/common/ThemeSelect';

const MenuItems = [
  {
    icon: <ChartPie />,
    name: '数据概览',
    path: '/',
  },
  {
    icon: <FileText />,
    name: '文章管理',
    path: '/articles',
  },
];

export function SidebarMenu() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex justify-center items-center">
          <Link to="/" className="flex items-center space-x-2">
            {/* Logo 预留位置 */}
            <img src="/logo.svg" alt="logo" className="h-6 w-6" />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>菜单</span>
          </SidebarGroupLabel>
          {MenuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild tooltip={item.name}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeSelect />
      </SidebarFooter>
    </Sidebar>
  );
}
