import React, { useState } from 'react';
import { format } from 'date-fns';
import { getDaysInMonth } from '../../../libs/format';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

type CalendarProps<Entry> = {
  entries: Entry[];
  dateField: keyof Entry;
  renderCell(day: Date, entry?: Entry | null): React.ReactNode;
};

const Calendar = <Entry extends { id: string }>({ entries, dateField, renderCell }: CalendarProps<Entry>) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  return (
    <div className="max-w-2xl p-2 bg-background-dark overflow-hidden border-b border-background-dark shadow sm:rounded-lg">
      <div className="min-w-max p-2 flex justify-center items-center">
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
      <div className="grid grid-cols-6 grid-rows-6">
        {daysInMonth.map((day, index) => {
          return (
            <div
              key={index}
              className="group hover:bg-background duration-75 cursor-pointer border border-opacity-10 border-gray-200 overflow-clip"
            >
              <div className="min-w-max min-h-max p-1">
                <div className="group-hover:bg-background text-radiance-light flex font-semibold">
                  {format(day, 'dd')}
                </div>
                <div key={index}>{renderCell(day, entries[index] ?? null)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
