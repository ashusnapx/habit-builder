import { Navbar } from "@/components";
import SubjectList from "@/components/SubjectList";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>Subjects</h1>
        <SubjectList />
      </div>
    </>
  );
}
