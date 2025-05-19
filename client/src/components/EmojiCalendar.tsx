import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";

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

    let buttonClass = `relative w-8 md:w-9 aspect-square flex flex-col items-center justify-start p-0.5 sm:p-1 text-xs sm:text-sm rounded-lg transition-all`;

    if (isToday) {
      buttonClass += " bg-[#455763] text-white font-semibold";
    } else if (isSelected) {
      buttonClass += " bg-[#455763]/40 border border-[#455763]";
    } else {
      buttonClass += " hover:bg-[#455763]/20";
    }

    return (
      <button
        className={buttonClass}
        onClick={() => setSelectedDate(date)}
        type="button"
        aria-pressed={isSelected}
      >
        <span className="text-xl sm:text-2xl leading-none h-6 pointer-events-none select-none">
          {emoji || "\u00A0"}
        </span>
        <span className="mt-auto mb-1 text-xs sm:text-sm font-medium">
          {date.getDate()}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-sm sm:max-w-md mx-auto px-2 sm:px-4">
      <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">
        Calendario de Emociones
      </h2>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[280px] sm:min-w-full flex">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            components={{ Day: CustomDay }}
            className="text-sm sm:text-base w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default EmojiCalendar;
