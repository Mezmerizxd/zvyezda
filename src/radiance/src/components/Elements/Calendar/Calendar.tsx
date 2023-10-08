import React, { useState } from 'react';
import { format } from 'date-fns';
import { getDaysInMonth } from '../../../libs/format';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

type CalendarProps<Entry> = {
  entries: Entry[];
  dateField: keyof Entry;
  renderCell(entry: Entry): React.ReactNode;
};

const Calendar = <Entry extends { id: string }>({ entries, dateField, renderCell }: CalendarProps<Entry>) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  return (
    <div className="max-w-xl bg-background-dark overflow-hidden border-b border-background-dark shadow sm:rounded-lg">
      <div className="max-w-xl p-2 flex justify-center items-center">
        <div className="flex w-full mx-2 justify-center items-center">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
            <AiOutlineArrowLeft size={20} />
          </button>
          <h2 className="w-full text-center text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
            <AiOutlineArrowRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 p-2">
        {daysInMonth.map((day, index) => {
          const entriesForDay = entries.filter((entry) => {
            const entryDate = new Date(entry[dateField] as string);
            if (!isNaN(entryDate.getTime())) {
              return format(entryDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
            }
            return false;
          });

          return (
            <div
              key={index}
              className="p-1 flex justify-center h-20 group hover:bg-background rounded-lg duration-75 cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-background group-hover:bg-background-dark text-radiance-light w-9 h-9 flex items-center justify-center font-semibold">
                  {format(day, 'dd')}
                </div>
                {entriesForDay.map((entry) => (
                  <div key={entry.id}>{renderCell(entry)}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
