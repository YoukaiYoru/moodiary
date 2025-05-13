import { Home, BarChart2, Notebook, ChevronDown, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible,
} from "@/components/ui/collapsible";

import { UserButton } from "@clerk/clerk-react";

// Rutas principales
const mainItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Estadísticas",
    url: "/dashboard/stats",
    icon: BarChart2,
  },
];

// Subitems del collapsable "Notes"
const notesItems = [
  {
    title: "Note 1",
    url: "/dashboard/notes/note1",
    icon: FileText,
  },
  {
    title: "Note 2",
    url: "/dashboard/notes/note2",
    icon: FileText,
  },
  {
    title: "Note 3",
    url: "/dashboard/notes/note3",
    icon: FileText,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Moodiary</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Grupo collapsable: Notes */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Notebook className="mr-2 h-4 w-4" />
                      Notes
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {notesItems.map((note) => (
                        <SidebarMenuSubItem key={note.url}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={note.url}
                              className={({ isActive }) =>
                                isActive
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground"
                              }
                            >
                              <note.icon className="mr-2 h-4 w-4" />
                              {note.title}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer con UserButton de Clerk */}
      <SidebarFooter className="flex items-center justify-center p-4 border-t">
        <UserButton showName />
      </SidebarFooter>
    </Sidebar>
  );
}
