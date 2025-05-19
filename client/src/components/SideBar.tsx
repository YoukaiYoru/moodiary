import React from "react";
import {
  Home,
  BarChart2,
  Notebook,
  ChevronDown,
  FileText,
  Search,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { Popover, PopoverTrigger, PopoverContent } from "@ui/popover";
import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar";

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

import { cn } from "@/lib/utils";

import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible,
} from "@/components/ui/collapsible";

import { UserButton } from "@clerk/clerk-react";
import { format } from "date-fns";

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
    date: "2025-05-16",
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
  const [date, setDate] = React.useState<Date>();

  // Function to handle date selection and trigger search
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);

    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      console.log("Filtering notes for date:", formattedDate);
      // Filter notesItems based on the selected date
      const filteredNotes = notesItems.filter(
        (group) => group.date === formattedDate
      );
      console.log("Filtered Notes:", filteredNotes);
    }
  };

  const renderNotesItems = () => {
    const filteredNotes = date
      ? notesItems.filter((group) => group.date === format(date, "yyyy-MM-dd"))
      : notesItems;

    return filteredNotes.map((group) => (
      <SidebarMenuSubItem key={group.date}>
        <SidebarMenuButton asChild>
          <NavLink
            to={`/dashboard/notes/${group.date}`}
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "text-muted-foreground"
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            {group.date}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuSubItem>
    ));
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-[#fdf6e3] text-[#3a2f2f] font-delius"
      {...props}>
      <SidebarContent className="">
        <SidebarGroup>
          {/* <SidebarGroupLabel className="text-2xl font-playwrite text-[hsl(240,25%,20%)] flex justify-center items-center h-15">Moodiary</SidebarGroupLabel> */}
          <SidebarGroupLabel className="text-[2.2rem] font-playwrite text-[#94461C] flex justify-center items-center h-20">Moodiary</SidebarGroupLabel>
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

              {/* Collapsible Notes Group */}
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-left font-normal p-0",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <Search className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Buscar</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {date && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 w-full text-orange-600 hover:text-orange-400 dark:text-red-800 dark:hover:text-red-600"
                          onClick={() => handleDateSelect(undefined)}
                        >
                          Clear Search
                        </Button>
                      )}
                      {renderNotesItems()}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with UserButton */}
      <SidebarFooter className="m-2 p-1 border-t transition duration-200 hover:bg-[#DEE6EC]/80 rounded-xl">
        <UserButton
          showName
        />
      </SidebarFooter>
    </Sidebar>
  );
}
