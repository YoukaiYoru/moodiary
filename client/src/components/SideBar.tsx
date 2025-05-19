import React from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import api from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Popover, PopoverTrigger, PopoverContent } from "@ui/popover";
import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar";
import { UserButton } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import { NoteUpdateContext } from "@/contexts/NoteUpdateContext";

// Import icons
import {
  Home,
  BarChart2,
  FileText,
  Notebook,
  ChevronDown,
  Search,
} from "lucide-react";

dayjs.extend(timezone);

const mainItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Estadísticas", url: "/dashboard/stats", icon: BarChart2 },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { getToken } = useAuth();
  const [date, setDate] = React.useState<Date>();
  const [notes, setNotes] = React.useState<string[]>([]);
  const context = React.use(NoteUpdateContext);
  if (!context)
    throw new Error("AppSidebar must be used within NoteDatesProvider");
  const { knownDates, triggerNoteUpdate } = context;
  const hasFetchedRef = React.useRef(false);

  const fetchDates = React.useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await api.get("/moods/dates", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newDates = Array.from(
        new Set(
          response.data.map((item: { created_at: string }) =>
            dayjs(item.created_at).tz().format("YYYY-MM-DD")
          )
        )
      );

      const sortedPrev = Array.from(knownDates).sort();
      const sortedNew = [...newDates].sort();
      const isEqual =
        sortedPrev.length === sortedNew.length &&
        sortedPrev.every((v, i) => v === sortedNew[i]);
      if (!isEqual) {
        newDates.forEach((d) => triggerNoteUpdate(d as string));
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, [getToken, knownDates, triggerNoteUpdate]);

  React.useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchDates();
      hasFetchedRef.current = true;
    }
  }, [fetchDates]);

  React.useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await api.get("/moods/dates", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const groupedNotes = response.data.reduce(
          (
            acc: Record<string, string[]>,
            note: { created_at: string; content: string }
          ) => {
            const noteDate = dayjs(note.created_at).tz().format("YYYY-MM-DD");
            if (!acc[noteDate]) acc[noteDate] = [];
            acc[noteDate].push(note.content);
            return acc;
          },
          {}
        );

        const groupedDates = Object.keys(groupedNotes).sort().reverse();
        setNotes(groupedDates);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, [getToken]);

  // Filtrar notas si hay fecha seleccionada
  const filteredNotes = date
    ? notes.filter((d) => d === dayjs(date).format("YYYY-MM-DD"))
    : notes;

  // Renderizar enlaces filtrados (solo uno)
  const renderNotes = () =>
    filteredNotes.map((note) => (
      <SidebarMenuSubItem key={note}>
        <SidebarMenuButton asChild>
          <NavLink
            to={`/dashboard/notes/${note}`}
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "text-muted-foreground"
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            {note}
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

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:cursor-pointer">
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
                            {date
                              ? dayjs(date).format("LL")
                              : "Buscar por fecha"}
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

                      {/* Solo un listado y filtrado */}
                      {renderNotes()}
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
