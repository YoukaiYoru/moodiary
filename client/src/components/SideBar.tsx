import React from "react";
import api from "@/lib/axios";
import {
  Home,
  BarChart2,
  Notebook,
  ChevronDown,
  FileText,
  Search,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@clerk/clerk-react";

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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Popover, PopoverTrigger, PopoverContent } from "@ui/popover";
import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar";
import { UserButton } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";

const mainItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Estadísticas", url: "/dashboard/stats", icon: BarChart2 },
];

interface NoteGroup {
  date: string;
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { getToken } = useAuth();
  const [date, setDate] = React.useState<Date>();
  const [noteItems, setNoteItems] = React.useState<NoteGroup[]>([]);
  const [isNotesOpen, setIsNotesOpen] = React.useState(true);

  const fetchNotes = React.useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await api.get("/moods/dates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Agrupar por fecha local
      interface MoodItem {
        created_at: string;
        // Add other properties if needed
      }

      interface GroupedNotes {
        [date: string]: MoodItem[];
      }

      const grouped: GroupedNotes = (response.data as MoodItem[]).reduce(
        (acc: GroupedNotes, item: MoodItem) => {
          const localDate = new Date(item.created_at).toLocaleDateString(
            "en-CA"
          ); // YYYY-MM-DD
          if (!acc[localDate]) acc[localDate] = [];
          acc[localDate].push(item);
          return acc;
        },
        {}
      );

      // Si solo necesitas las fechas únicas en formato YYYY-MM-DD
      const localDates = Object.keys(grouped);

      setNoteItems(localDates.map((date) => ({ date }))); // o setNoteItems(grouped) si necesitas los items agrupados
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, [getToken]);

  React.useEffect(() => {
    if (!isNotesOpen) {
      fetchNotes();
    }
  }, [isNotesOpen, fetchNotes]);

  const filteredNotes = date
    ? noteItems.filter((group) => group.date === format(date, "yyyy-MM-dd"))
    : noteItems;

  const renderNoteLinks = () =>
    filteredNotes.map((group) => (
      <SidebarMenuSubItem key={group.date}>
        <SidebarMenuButton asChild>
          <NavLink
            to={`/dashboard/notes/${group.date}`}
            className={({ isActive }) =>
              cn(
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            {group.date}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuSubItem>
    ));

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Moodiary</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={url}
                      className={({ isActive }) =>
                        cn(
                          isActive
                            ? "text-primary font-semibold"
                            : "text-muted-foreground"
                        )
                      }
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {title}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible
                defaultOpen
                onOpenChange={(open) => setIsNotesOpen(open)}
                className="group/collapsible"
              >
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <Search className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Buscar por fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {date && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => setDate(undefined)}
                        >
                          Limpiar búsqueda
                        </Button>
                      )}

                      {renderNoteLinks()}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex items-center justify-center p-4 border-t">
        <UserButton showName />
      </SidebarFooter>
    </Sidebar>
  );
}
