import {
  ShoppingBag,
  Forklift,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  ReceiptText,
  Users,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Gauge,
  GraduationCap,
  type LucideIcon,
  CameraIcon,
  Settings,
  MapPin,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboard",
    items: [
      {
        title: "Historial",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "Ubicaciones",
        url: "/dashboard/local",
        icon: MapPin,
      },
      {
        title: "Cámaras",
        url: "/dashboard/camaras",
        icon: CameraIcon,
      },
    ],
  },
  // {
  //   id: 2,
  //   label: "Pages",
  //   items: [
  //     {
  //       title: "Configuraciones",
  //       url: "/auth",
  //       icon: Settings,
  //       subItems: [
  //         { title: "Local", url: "/dashboard/local" },
  //         { title: "Camaras", url: "/auth/v2/login" },
  //       ],
  //     },
  //   ],
  // },
];
