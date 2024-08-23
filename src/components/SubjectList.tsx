"use client";

import React, { useEffect, useState } from "react";
import SubjectCard from "./SubjectCard";
import { fetchSubjects } from "@/lib/appwrite";

const SubjectList = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    getSubjects();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.$id}
          title={subject.title}
          description={subject.description}
        />
      ))}
    </div>
  );
};

export default SubjectList;
