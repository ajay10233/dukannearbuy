import RolesCard from "../components/GetStarted/RolesCard";


export default function GetStarted() {
  return (
    <main className='h-screen overflow-hidden'>
      <header className='flex justify-end p-5'>
        <div className="flex text-sm gap-x-5 text-slate-700">
            <button>Need help?</button>
            <button>Contact us</button>
        </div>
      </header>
      <section className='flex justify-center items-center h-full'>
        <div className="flex flex-col items-center w-2/6 h-full">
            <div className="flex">
                <h1 className='text-3xl font-bold text-slate-800'>Start with us now</h1>
            </div>
            <RolesCard />
            
        </div>
        
      </section>
    </main>
  )
}
