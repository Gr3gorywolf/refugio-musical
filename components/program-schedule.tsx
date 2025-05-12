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
  const [activeDay, setActiveDay] = useState("Lunes");

  const weekSchedule: DaySchedule[] = [
    {
      day: "Lunes",
      programs: [
        {
          time: "06:00 - 09:00",
          name: "Despertando con Cabral",
          host: "Carlos Rodríguez",
          description: "Música, noticias y el mejor humor para comenzar tu día con energía",
        },
        {
          time: "09:00 - 12:00",
          name: "Mañanas Musicales",
          host: "María González",
          description: "Los mejores éxitos y las canciones que marcaron una época",
        },
        {
          time: "12:00 - 15:00",
          name: "Mediodía Latino",
          host: "Javier Méndez",
          description: "Ritmos latinos y la mejor selección musical para acompañar tu almuerzo",
        },
        {
          time: "15:00 - 18:00",
          name: "Tarde de Clásicos",
          host: "Laura Sánchez",
          description: "Recordando los grandes éxitos de todos los tiempos",
        },
        {
          time: "18:00 - 21:00",
          name: "El Regreso a Casa",
          host: "Roberto Díaz",
          description: "Música y entretenimiento para acompañarte en tu regreso a casa",
        },
        {
          time: "21:00 - 00:00",
          name: "Noches de Radio",
          host: "Ana Martínez",
          description: "Conversación, música y compañía para las noches",
        },
      ],
    },
    {
      day: "Martes",
      programs: [
        {
          time: "06:00 - 09:00",
          name: "Despertando con Cabral",
          host: "Carlos Rodríguez",
          description: "Música, noticias y el mejor humor para comenzar tu día con energía",
        },
        {
          time: "09:00 - 12:00",
          name: "Mañanas Musicales",
          host: "María González",
          description: "Los mejores éxitos y las canciones que marcaron una época",
        },
        {
          time: "12:00 - 15:00",
          name: "Mediodía Latino",
          host: "Javier Méndez",
          description: "Ritmos latinos y la mejor selección musical para acompañar tu almuerzo",
        },
        {
          time: "15:00 - 18:00",
          name: "Tarde de Clásicos",
          host: "Laura Sánchez",
          description: "Recordando los grandes éxitos de todos los tiempos",
        },
        {
          time: "18:00 - 21:00",
          name: "El Regreso a Casa",
          host: "Roberto Díaz",
          description: "Música y entretenimiento para acompañarte en tu regreso a casa",
        },
        {
          time: "21:00 - 00:00",
          name: "Noches de Radio",
          host: "Ana Martínez",
          description: "Conversación, música y compañía para las noches",
        },
      ],
    },
    {
      day: "Miércoles",
      programs: [
        {
          time: "06:00 - 09:00",
          name: "Despertando con Cabral",
          host: "Carlos Rodríguez",
          description: "Música, noticias y el mejor humor para comenzar tu día con energía",
        },
        {
          time: "09:00 - 12:00",
          name: "Especial de Rock",
          host: "Miguel Torres",
          description: "Un recorrido por la historia del rock y sus grandes exponentes",
        },
        {
          time: "12:00 - 15:00",
          name: "Mediodía Latino",
          host: "Javier Méndez",
          description: "Ritmos latinos y la mejor selección musical para acompañar tu almuerzo",
        },
        {
          time: "15:00 - 18:00",
          name: "Tarde de Clásicos",
          host: "Laura Sánchez",
          description: "Recordando los grandes éxitos de todos los tiempos",
        },
        {
          time: "18:00 - 21:00",
          name: "El Regreso a Casa",
          host: "Roberto Díaz",
          description: "Música y entretenimiento para acompañarte en tu regreso a casa",
        },
        {
          time: "21:00 - 00:00",
          name: "Noches de Radio",
          host: "Ana Martínez",
          description: "Conversación, música y compañía para las noches",
        },
      ],
    },
    {
      day: "Jueves",
      programs: [
        {
          time: "06:00 - 09:00",
          name: "Despertando con Cabral",
          host: "Carlos Rodríguez",
          description: "Música, noticias y el mejor humor para comenzar tu día con energía",
        },
        {
          time: "09:00 - 12:00",
          name: "Mañanas Musicales",
          host: "María González",
          description: "Los mejores éxitos y las canciones que marcaron una época",
        },
        {
          time: "12:00 - 15:00",
          name: "Mediodía Latino",
          host: "Javier Méndez",
          description: "Ritmos latinos y la mejor selección musical para acompañar tu almuerzo",
        },
        {
          time: "15:00 - 18:00",
          name: "Especial de Pop",
          host: "Sofía Ramírez",
          description: "Las mejores canciones pop de la actualidad y de todos los tiempos",
        },
        {
          time: "18:00 - 21:00",
          name: "El Regreso a Casa",
          host: "Roberto Díaz",
          description: "Música y entretenimiento para acompañarte en tu regreso a casa",
        },
        {
          time: "21:00 - 00:00",
          name: "Noches de Radio",
          host: "Ana Martínez",
          description: "Conversación, música y compañía para las noches",
        },
      ],
    },
    {
      day: "Viernes",
      programs: [
        {
          time: "06:00 - 09:00",
          name: "Despertando con Cabral",
          host: "Carlos Rodríguez",
          description: "Música, noticias y el mejor humor para comenzar tu día con energía",
        },
        {
          time: "09:00 - 12:00",
          name: "Mañanas Musicales",
          host: "María González",
          description: "Los mejores éxitos y las canciones que marcaron una época",
        },
        {
          time: "12:00 - 15:00",
          name: "Mediodía Latino",
          host: "Javier Méndez",
          description: "Ritmos latinos y la mejor selección musical para acompañar tu almuerzo",
        },
        {
          time: "15:00 - 18:00",
          name: "Tarde de Clásicos",
          host: "Laura Sánchez",
          description: "Recordando los grandes éxitos de todos los tiempos",
        },
        {
          time: "18:00 - 21:00",
          name: "Viernes de Fiesta",
          host: "DJ Marcos",
          description: "La mejor música para comenzar el fin de semana con toda la energía",
        },
        {
          time: "21:00 - 00:00",
          name: "La Noche es Nuestra",
          host: "Lucía Vega",
          description: "Música electrónica y los mejores remixes para la noche del viernes",
        },
      ],
    },
    {
      day: "Sábado",
      programs: [
        {
          time: "08:00 - 11:00",
          name: "Despertar del Sábado",
          host: "Pablo Moreno",
          description: "Música relajada para comenzar tu fin de semana",
        },
        {
          time: "11:00 - 14:00",
          name: "Top 20 Semanal",
          host: "Valeria Gómez",
          description: "Conteo de las 20 canciones más populares de la semana",
        },
        {
          time: "14:00 - 17:00",
          name: "Tarde de Éxitos",
          host: "Daniel Castro",
          description: "Los mejores éxitos de todos los tiempos",
        },
        {
          time: "17:00 - 20:00",
          name: "Sábado de Fiesta",
          host: "DJ Marcos",
          description: "La mejor música para disfrutar tu sábado",
        },
        {
          time: "20:00 - 00:00",
          name: "La Noche es Joven",
          host: "Lucía Vega",
          description: "Música electrónica y los mejores remixes para la noche del sábado",
        },
      ],
    },
    {
      day: "Domingo",
      programs: [
        {
          time: "08:00 - 11:00",
          name: "Despertar del Domingo",
          host: "Pablo Moreno",
          description: "Música relajada para comenzar tu domingo",
        },
        {
          time: "11:00 - 14:00",
          name: "Clásicos del Ayer",
          host: "Eduardo Ruiz",
          description: "Un recorrido por los grandes clásicos de la música",
        },
        {
          time: "14:00 - 17:00",
          name: "Tarde de Baladas",
          host: "Silvia Ortiz",
          description: "Las mejores baladas para una tarde de domingo",
        },
        {
          time: "17:00 - 20:00",
          name: "Domingo Acústico",
          host: "Alejandro Paz",
          description: "Versiones acústicas y música unplugged",
        },
        {
          time: "20:00 - 00:00",
          name: "Preparando la Semana",
          host: "Carla Navarro",
          description: "Música relajante para prepararte para la semana que comienza",
        },
      ],
    },
  ];

  const currentDaySchedule = weekSchedule.find((day) => day.day === activeDay) || weekSchedule[0];

  return (
    <div className="bg-[#333333] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-[#03a9f4]" />
        <h3 className="text-xl font-bold">Programación Semanal</h3>
      </div>

      <iframe src={`${process.env.NEXT_PUBLIC_AZURACAST_URL}/public/radio_cabral/schedule/embed?theme=dark`} 
      frameBorder="0" 
      allowTransparency
      style={{ 
        backgroundColor: "transparent",
        border: "none",
        width: "100%",
        height: "900px",
       }}></iframe>
    </div>
  );
}
