import { DayPicker, useDayPicker, useNavigation } from "react-day-picker"
import { format, setMonth, setYear } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function CustomCaption({ displayMonth }) {
    const { goToMonth, previousMonth, nextMonth } = useNavigation();

    if (!displayMonth) return null;
    const currentMonth = displayMonth;

    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: format(new Date(0, i), "MMMM").toUpperCase(),
    }));

    const years = Array.from({ length: 201 }, (_, i) => ({
        value: 1900 + i,
        label: (1900 + i).toString(),
    }));

    return (
        <div className="flex items-center justify-center gap-4 px-1 py-4 w-full h-12">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (previousMonth) goToMonth(previousMonth);
                }}
                disabled={!previousMonth}
                className="flex items-center justify-center h-9 w-9 bg-white/10 hover:bg-white/20 border border-white/20 text-yellow-500 rounded-xl transition-all active:scale-90 disabled:opacity-20 z-[100]"
                type="button"
            >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>

            <div className="flex gap-2 items-center">
                <select
                    value={currentMonth.getMonth()}
                    onChange={(e) => goToMonth(setMonth(currentMonth, parseInt(e.target.value)))}
                    className="bg-neutral-800 text-yellow-500 font-bold border border-white/10 rounded-lg px-2 py-1.5 text-sm cursor-pointer hover:bg-neutral-700 outline-none appearance-auto font-mono"
                >
                    {months.map((m) => (
                        <option key={m.value} value={m.value} className="bg-neutral-900 font-mono">
                            {m.label}
                        </option>
                    ))}
                </select>
                <select
                    value={currentMonth.getFullYear()}
                    onChange={(e) => goToMonth(setYear(currentMonth, parseInt(e.target.value)))}
                    className="bg-neutral-800 text-yellow-500 font-bold border border-white/10 rounded-lg px-2 py-1.5 text-sm cursor-pointer hover:bg-neutral-700 outline-none appearance-auto font-mono"
                >
                    {years.map((y) => (
                        <option key={y.value} value={y.value} className="bg-neutral-900">
                            {y.label}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (nextMonth) goToMonth(nextMonth);
                }}
                disabled={!nextMonth}
                className="flex items-center justify-center h-9 w-9 bg-white/10 hover:bg-white/20 border border-white/20 text-yellow-500 rounded-xl transition-all active:scale-90 disabled:opacity-20 z-[100]"
                type="button"
            >
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
            </button>
        </div>
    );
}

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3 bg-neutral-950 border border-white/10 rounded-xl shadow-2xl font-mono", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 text-white",
                month: "space-y-4 relative overflow-visible",
                caption: "flex flex-col relative items-center h-auto",
                caption_label: "hidden",
                nav: "hidden",
                table: "w-full border-collapse space-y-1",
                head_row: "flex justify-between px-1",
                head_cell: "text-white/30 rounded-md w-9 font-normal text-[0.8rem] uppercase tracking-wider text-center py-2 font-mono",
                row: "flex w-full mt-2 justify-between px-1",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-white/5 [&:has([aria-selected])]:bg-white/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 font-mono text-white/70 hover:bg-yellow-500/20 hover:text-yellow-500 transition-all active:scale-95 rounded-lg"
                ),
                day_range_end: "day-range-end",
                day_selected: "!bg-yellow-500 !text-black hover:bg-yellow-500 hover:text-black focus:bg-yellow-500 focus:text-black font-bold rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)]",
                day_today: "bg-white/5 text-yellow-500 font-bold decoration-yellow-500/30 underline-offset-4 underline rounded-lg",
                day_outside: "day-outside text-white/5 opacity-50 aria-selected:bg-white/5 aria-selected:text-white/20 aria-selected:opacity-30",
                day_disabled: "text-white/5 opacity-50",
                day_range_middle: "aria-selected:bg-white/5 aria-selected:text-white",
                day_hidden: "invisible",
                dropdown_month: "mr-1",
                dropdown_year: "ml-1",
                dropdown: "bg-transparent text-white font-medium hover:bg-white/10 border border-white/10 rounded-sm px-1 py-0.5 text-sm cursor-pointer outline-none appearance-none text-center min-w-[80px] font-mono",
                ...classNames,
            }}
            components={{
                Caption: CustomCaption,
                Dropdown: ({ value, onChange, children, ...props }) => {
                    const options = React.Children.toArray(children)
                    return (
                        <select
                            className={cn(
                                "bg-neutral-900 text-white font-bold hover:bg-neutral-800 border border-white/10 rounded-lg px-2 py-1.5 text-sm cursor-pointer outline-none appearance-auto transition-all z-[110] shadow-xl",
                                props.className
                            )}
                            value={value}
                            onChange={onChange}
                            onPointerDownCapture={(e) => e.stopPropagation()}
                            onMouseDownCapture={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {options.map((option, id) => (
                                <option key={`${option.props.value}-${id}`} value={option.props.value} className="bg-neutral-900 text-white">
                                    {option.props.children}
                                </option>
                            ))}
                        </select>
                    )
                },
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
