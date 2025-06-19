"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";

interface Program {
    time: string;
    name: string;
    host: string;
    description: string;
}

interface DaySchedule {
    day: string;
    programs: Program[];
}

export function ProgramSchedule() {
    return (
        <div className="bg-[#333333] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-[var(--primary-color)]" />
                <h3 className="text-xl font-bold">Programación Semanal</h3>
            </div>

            <iframe
                src={`${process.env.NEXT_PUBLIC_AZURACAST_URL}/public/${process.env.NEXT_PUBLIC_STATION_NAME}/schedule/embed?theme=dark`}
                frameBorder="0"
                style={{
                    backgroundColor: "transparent",
                    border: "none",
                    width: "100%",
                    height: "1210px",
                }}
            ></iframe>
        </div>
    );
}
