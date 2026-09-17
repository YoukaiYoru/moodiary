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

import {
  Home,
  BarChart2,
  FileText,
  Notebook,
  ChevronDown,
  Search,
} from "lucide-react";

dayjs.extend(timezone);

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { getToken } = useAuth();
  const [date, setDate] = React.useState<Date>();

  const context = React.useContext(NoteUpdateContext);
  if (!context)
    throw new Error("AppSidebar must be used within NoteDatesProvider");
  const { knownDates, setDates } = context;

  // Fetch para obtener fechas y agregarlas al contexto si hay diferencias
  const fetchDates = React.useCallback(async (signal: AbortSignal) => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await api.get("/moods/dates", {
        headers: { Authorization: `Bearer ${token}` },
        params: { timezone: dayjs.tz.guess() },
        signal,
      });

      const newDates = Array.from(
        new Set(
          response.data.map((item: { created_at: string }) =>
            dayjs(item.created_at).format("YYYY-MM-DD")
          )
        )
      );

      setDates(newDates as string[]);
    } catch (error) {
      if (!signal.aborted) console.error("Error fetching dates:", error);
    }
  }, [getToken, setDates]);

  // Una sola consulta hidrata las fechas del calendario y la lista de notas.
  React.useEffect(() => {
    const controller = new AbortController();
    fetchDates(controller.signal);
    return () => controller.abort();
  }, [fetchDates]);

  const filteredNotes = date
    ? Array.from(knownDates).filter((d) => d === dayjs(date).format("YYYY-MM-DD"))
    : Array.from(knownDates).sort().reverse();

  const renderNotes = () =>
    filteredNotes.map((note) => (
      <SidebarMenuSubItem key={note}>
        <SidebarMenuButton asChild>
          <NavLink
            to={`/dashboard/notes/${note}`}
            className={({ isActive }) =>
              cn(
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            {note}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuSubItem>
    ));

  return (
    <Sidebar
      collapsible="offcanvas"
      side="left"
      variant="sidebar"
      className="text-[#3a2f2f] font-delius transition-all duration-300 ease-in-out"
      {...props}
    >
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="flex h-14 items-center justify-center font-playwrite text-[1.5rem] text-[#455763]">
            Moodiary
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="Home">
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      cn(
                        isActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      )
                    }
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="Estadísticas">
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/stats"
                    className={({ isActive }) =>
                      cn(
                        isActive
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      )
                    }
                  >
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Estadísticas
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                          className="mt-2 w-full text-orange-600 hover:text-orange-400 dark:text-red-800 dark:hover:text-red-600"
                          onClick={() => setDate(undefined)}
                        >
                          Limpiar búsqueda
                        </Button>
                      )}
                      {renderNotes()}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="m-2 p-1 transition duration-200 flex items-center font-delius">
        <UserButton showName />
      </SidebarFooter>
    </Sidebar>
  );
}
