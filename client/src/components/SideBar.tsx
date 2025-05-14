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
// const notesItems = [
//   {
//     title: "Note 1",
//     url: "/dashboard/notes/note1",
//     icon: FileText,
//   },
//   {
//     title: "Note 2",
//     url: "/dashboard/notes/note2",
//     icon: FileText,
//   },
//   {
//     title: "Note 3",
//     url: "/dashboard/notes/note3",
//     icon: FileText,
//   },
// ];

// Ejemplo de datos que podrías recibir de una API
const notesItems = [
  {
    date: "2023-10-01",
    notes: [
      {
        id: 1,
        title: "Meeting Notes",
        content: "Discussed project milestones and deadlines.",
        createdAt: "2023-10-01T10:00:00Z",
      },
      {
        id: 2,
        title: "Shopping List",
        content: "Milk, Bread, Eggs, Butter.",
        createdAt: "2023-10-01T12:30:00Z",
      },
      {
        id: 3,
        title: "Workout Plan",
        content: "Monday: Chest, Tuesday: Back, Wednesday: Legs.",
        createdAt: "2023-10-01T15:45:00Z",
      },
    ],
  },
  {
    date: "2023-10-02",
    notes: [
      {
        id: 4,
        title: "Daily Journal",
        content: "Reflected on the day's events and emotions.",
        createdAt: "2023-10-02T09:00:00Z",
      },
      {
        id: 5,
        title: "Grocery List",
        content: "Tomatoes, Onions, Garlic, Chicken.",
        createdAt: "2023-10-02T11:15:00Z",
      },
    ],
  },
  {
    date: "2023-10-03",
    notes: [
      {
        id: 6,
        title: "Project Ideas",
        content: "Brainstormed ideas for the new app.",
        createdAt: "2023-10-03T14:00:00Z",
      },
      {
        id: 7,
        title: "Travel Itinerary",
        content: "Planned trip to the mountains for the weekend.",
        createdAt: "2023-10-03T16:30:00Z",
      },
    ],
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
                      {notesItems.map((group) => (
                        <SidebarMenuSubItem key={group.date}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={`/dashboard/notes/${group.date}`}
                              className={({ isActive }) =>
                                isActive
                                  ? "text-primary font-semibold"
                                  : "text-muted-foreground"
                              }
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {group.date}
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
