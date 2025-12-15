import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Inbox,
  MessageSquare,
  Mail,
    Clock,
  CalendarClock,
  ListChecks,
  FileText,
  Send,
  History,
  Users,
  Tag,
  ListFilter,
  Zap,
  MessageCircleReply,
  KeyRound,
  GitBranch,
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  badge?: number;
}

interface MenuSection {
  icon: React.ElementType;
  label: string;
  items?: MenuItem[];
  badge?: number;
}

const menuSections: MenuSection[] = [
  {
    icon: Inbox,
    label: "Inbox",
    badge: 0, // Will be calculated dynamically
    items: [
      { icon: MessageSquare, label: "All Chats", badge: 0 }, // Will be calculated dynamically
      { icon: Mail, label: "Unread", badge: 0 }, // Will be calculated dynamically
    ],
  },
  {
    icon: Clock,
    label: "Follow Up",
    items: [
      { icon: CalendarClock, label: "Pending Follow Up", badge: 3 },
      { icon: Send, label: "Scheduled Messages" },
      { icon: ListChecks, label: "Follow-up Rules" },
    ],
  },
  {
    icon: FileText,
    label: "Promo Templates",
    items: [
      { icon: FileText, label: "Template Library" },
      { icon: Send, label: "Quick Send" },
      { icon: History, label: "Blast History" },
    ],
  },
  {
    icon: Users,
    label: "Contacts & Segments",
    items: [
      { icon: Users, label: "Contacts" },
      { icon: Tag, label: "Tags" },
      { icon: ListFilter, label: "Segmented Lists" },
    ],
  },
  {
    icon: Zap,
    label: "Automation",
    items: [
      { icon: MessageCircleReply, label: "Auto-reply Rules" },
      { icon: KeyRound, label: "Keyword Triggers" },
      { icon: GitBranch, label: "Follow-up Sequences" },
    ],
  },
  {
    icon: BarChart3,
    label: "Analytics",
    items: [
      { icon: TrendingUp, label: "Response Rates" },
      { icon: MousePointerClick, label: "Promo CTR" },
    ],
  },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  totalChats?: number;
  unreadCount?: number;
  onNavigationClick?: (itemLabel: string) => void;
}

const AppSidebar = ({ collapsed = false, onToggle, totalChats = 0, unreadCount = 0, onNavigationClick }: AppSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Inbox"]);
  const [activeItem, setActiveItem] = useState("All Chats");

  // Create dynamic menu sections with real counts
  const dynamicMenuSections: MenuSection[] = menuSections.map(section => {
    if (section.label === "Inbox") {
      return {
        ...section,
        badge: totalChats,
        items: section.items?.map(item => {
          if (item.label === "All Chats") {
            return { ...item, badge: totalChats };
          }
          if (item.label === "Unread") {
            return { ...item, badge: unreadCount };
          }
          return item;
        })
      };
    }
    return section;
  });

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label)
        ? prev.filter((s) => s !== label)
        : [...prev, label]
    );
  };

  return (
    <aside
      className={cn(
        "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground">Navigation</span>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors duration-200",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <PanelLeft className="w-4 h-4 text-muted-foreground" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Menu Sections */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {dynamicMenuSections.map((section) => (
          <div key={section.label}>
            <button
              onClick={() => section.items && toggleSection(section.label)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                "hover:bg-sidebar-accent group",
                expandedSections.includes(section.label)
                  ? "text-sidebar-primary"
                  : "text-sidebar-foreground"
              )}
            >
              <section.icon
                className={cn(
                  "w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200",
                  expandedSections.includes(section.label)
                    ? "text-sidebar-primary"
                    : "text-muted-foreground group-hover:text-sidebar-foreground"
                )}
              />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{section.label}</span>
                  {section.badge && section.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {section.badge}
                    </span>
                  )}
                  {section.items && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-200",
                        expandedSections.includes(section.label) && "rotate-180"
                      )}
                    />
                  )}
                </>
              )}
            </button>

            {/* Submenu */}
            {!collapsed && section.items && expandedSections.includes(section.label) && (
              <div className="ml-4 pl-3 border-l border-sidebar-border space-y-0.5 mt-1 mb-2">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveItem(item.label);
                      if (onNavigationClick) {
                        onNavigationClick(item.label);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      activeItem === item.label
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 text-xs font-medium rounded-full",
                          activeItem === item.label
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Settings Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            "text-sidebar-foreground hover:bg-sidebar-accent group"
          )}
        >
          <Settings className="w-[18px] h-[18px] text-muted-foreground group-hover:text-sidebar-foreground transition-colors duration-200" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
