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

      // Detectar la zona horaria del cliente automáticamente
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      interface MoodItem {
        created_at: string;
      }

      interface GroupedNotes {
        [date: string]: MoodItem[];
      }

      const grouped: GroupedNotes = (response.data as MoodItem[]).reduce(
        (acc: GroupedNotes, item: MoodItem) => {
          const localDate = new Date(item.created_at).toLocaleDateString(
            "en-CA",
            {
              timeZone: userTimeZone,
            }
          ); // ej: "2025-05-17"

          if (!acc[localDate]) acc[localDate] = [];
          acc[localDate].push(item);

          return acc;
        },
        {}
      );

      const localDates = Object.keys(grouped);

      setNoteItems(localDates.map((date) => ({ date }))); // O `grouped` si necesitas los items
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
    <Sidebar
      collapsible="icon"
      className="text-[#3a2f2f] font-delius"
      {...props}>
      {/* <SidebarContent className="bg-[#E8E2DA]"> */}
      {/* <SidebarContent className="bg-[#D6C9B4]"> */}
      {/* <SidebarContent className="bg-[#788285]/10"> */}
      <SidebarContent className="bg-[hsl(0,0%,99%)]">
        {/* <SidebarContent className="bg-[#8A9578]/50"> */}
        {/* <SidebarContent className="bg-[#E8D8CB]/0"> */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[2.2rem] font-playwrite text-[#94461C] flex justify-center items-center h-20">Moodiary</SidebarGroupLabel>
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
                          className="mt-2 w-full text-orange-600 hover:text-orange-400 dark:text-red-800 dark:hover:text-red-600"
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

      {/* Footer with UserButton */}
      <SidebarFooter className="m-2 p-1 border-t flex flex-row-reverse transition duration-200 hover:bg-[#DEE6EC]/80 rounded-3xl">
        {/* <div data-clerk-component="UserButton" className="cl-rootBox cl-userButton-root cl-internal-nfscg9">
          <button className="cl-userButtonTrigger cl-button ">
            <span className="cl-userButtonBox flex-row-reverse">
              <span className="cl-userButtonOuterIdentifier"></span>
              <span className="cl-avatarBox cl-userButtonAvatarBox"></span>
            </span>
            <UserButton showName />
          </button>
        </div> */}
        <UserButton
        showName
          appearance={{
            elements: {
              userButtonTrigger: 'bg-[#DEE6EC] hover:bg-blue-700 rounded px-4 py-2',
              userButtonBox: 'flex flex-row items-center',
              userButtonAvatarBox: 'rounded-full border-2 border-[#7F82BB]',
            },
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
