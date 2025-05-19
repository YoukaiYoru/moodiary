import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";

const moodEmojis: Record<string, string> = {
    "2025-05-14": "😄",
    "2025-05-15": "😰",
    "2025-05-16": "😌",
};

const EmojiCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const today = new Date();
    const todayKey = today.toISOString().split("T")[0];

    const CustomDay = (props: any) => {
        const { date, displayMonth } = props;
        const dateKey = date.toISOString().split("T")[0];
        const emoji = moodEmojis[dateKey];

        if (date.getMonth() !== displayMonth.getMonth()) return null;

        const isToday = dateKey === todayKey;
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

        let buttonClass = `relative w-9 aspect-square flex flex-col items-center justify-start p-1 text-sm rounded-lg transition-all`;

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
                <span className="text-2xl leading-none h-6 pointer-events-none select-none">
                    {emoji || "\u00A0"}
                </span>
                <span className="mt-auto mb-1 text-sm font-medium">{date.getDate()}</span>
            </button>
        );
    };

    return (
        <div className="w-fit max-w-md flex flex-col p-4 mx-auto rounded-xl border-none bg-white">
            <h2 className="text-xl font-semibold text-center mb-4">Calendario de Emociones</h2>
            <div className="w-full flex justify-center">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    components={{ Day: CustomDay }}
                    className="!w-full max-w-[320px] text-xl"
                />
            </div>
        </div>
    );
};

export default EmojiCalendar;