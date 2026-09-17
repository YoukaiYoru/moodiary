import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

type Props = {
  dataDate: {
    [key: string]: string | undefined;
  };
};

const EmojiCalendar = ({ dataDate }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];

  const CustomDay = (props: import("react-day-picker").DayProps) => {
    const { date, displayMonth } = props;
    const dateKey = date.toISOString().split("T")[0];
    const emoji = dataDate[dateKey];

    if (date.getMonth() !== displayMonth.getMonth()) return null;

    const isToday = dateKey === todayKey;
    const isSelected =
      selectedDate && date.toDateString() === selectedDate.toDateString();

    let buttonClass = `relative flex aspect-square w-8 flex-col items-center justify-start rounded-lg p-0.5 text-xs transition-all sm:p-1`;

    if (isToday) {
      buttonClass += " bg-[#455763] text-white font-semibold";
    } else if (isSelected) {
      buttonClass += " bg-[#455763]/40 border border-[#455763]";
    } else {
      buttonClass += " hover:bg-slate-100";
    }

    return (
      <button
        className={buttonClass}
        onClick={() => setSelectedDate(date)}
        type="button"
        aria-pressed={isSelected}
      >
        <span className="pointer-events-none h-5 select-none text-lg leading-none sm:text-xl">
          {emoji || "\u00A0"}
        </span>
        <span className="mb-0.5 mt-auto text-[0.7rem] font-medium sm:text-xs">
          {date.getDate()}
        </span>
      </button>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col px-1 sm:px-2">
      <h2 className="mb-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#455763] sm:text-base">
        <CalendarDays className="size-4" aria-hidden="true" />
        Calendario de emociones
      </h2>
      <p className="mb-3 text-center text-[0.7rem] text-[#68777D]">
        Selecciona un día para revisar tus registros
      </p>

      <div className="w-full overflow-x-auto">
        <div className="flex min-w-[260px] sm:min-w-full">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            components={{ Day: CustomDay }}
            className="w-full text-xs sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-3 text-[0.65rem] text-[#68777D]">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-[#455763]" aria-hidden="true" />
          Hoy
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full border border-[#455763] bg-slate-100" aria-hidden="true" />
          Seleccionado
        </span>
      </div>
    </div>
  );
};

export default EmojiCalendar;
