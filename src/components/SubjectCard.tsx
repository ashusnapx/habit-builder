import React from "react";

interface SubjectCardProps {
  title: string;
  description?: string;
}

const SubjectCard = ({ title, description }: SubjectCardProps) => (
  <div className='p-4 border rounded-md shadow-md'>
    <h3 className='text-lg font-semibold'>{title}</h3>
    {description && <p className='text-sm text-gray-600'>{description}</p>}
  </div>
);

export default SubjectCard;
