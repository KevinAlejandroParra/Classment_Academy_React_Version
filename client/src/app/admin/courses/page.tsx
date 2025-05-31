"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Particles } from "@/components/particles";
import Swal from "sweetalert2";

interface School {
  school_id: string;
  school_name: string;
  school_description?: string;
  school_image?: string;
}


export default function CoursesSchoolsListPage() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/get-school`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar las escuelas");
        const data = await res.json();
        setSchools(data.data || []);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cargar las escuelas",
          confirmButtonColor: "#FFD700",
          background: "#1a1a1a",
          color: "#fff",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Cargando escuelas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Sidebar />
      <Particles />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-3xl font-bold text-[#FFD700] mb-8">Selecciona una escuela para gestionar sus cursos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div
              key={school.school_id}
              className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 hover:border-[#FFD700] transition-all cursor-pointer p-6 flex flex-col items-center"
              onClick={() => router.push(`/admin/courses/${school.school_id}`)}
            >
              {school.school_image && (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${school.school_image}`}
                  alt={school.school_name}
                  className="w-24 h-24 object-cover rounded-full mb-4 border border-gray-600"
                />
              )}
              <h2 className="text-xl font-bold text-white mb-2 text-center">{school.school_name}</h2>
              {school.school_description && (
                <p className="text-gray-300 text-sm text-center mb-2">{school.school_description}</p>
              )}
              <button
                className="mt-4 px-4 py-2 bg-[#FFD700] text-black rounded-lg font-semibold hover:bg-[#FFC700] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/courses/${school.school_id}`);
                }}
              >
                Gestionar Cursos
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 