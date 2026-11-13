import DoctorCard, { DoctorGrid } from '../components/DoctorCard.jsx'
import { doctors } from '../data/doctors.js'

/* ================= Helpers ================= */

function ShieldIcon() {
  return (
    <svg
      className="shrink-0 text-[#b8924f]"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  )
}

/* ================= Component ================= */

function DoctorsPage() {
  return (
    <section className="relative overflow-hidden bg-[#fbf9f4] bg-[radial-gradient(900px_420px_at_8%_-5%,rgba(217,191,140,0.28),transparent_60%),radial-gradient(800px_480px_at_100%_100%,rgba(15,27,61,0.07),transparent_60%)] px-5 pt-6 pb-22 font-['Outfit',system-ui,-apple-system,'Segoe_UI',sans-serif] text-[#0f1b3d] max-[641px]:px-4 max-[641px]:pt-4 max-[641px]:pb-16">
      <div className="relative mx-auto max-w-[1160px]">
        <header className="mx-auto mb-14 max-w-[640px] text-center max-[641px]:mb-9">
          <span className="inline-block rounded-full border border-[#d9bf8c] bg-[#f8f0e0] px-4 py-1.5 text-[0.78rem] font-semibold tracking-[0.04em] text-[#b8924f]">
            Our medical experts
          </span>
          <h1 className="mt-[18px] mb-3.5 font-['Lora',Georgia,'Times_New_Roman',serif] text-[clamp(2rem,4.6vw,3.1rem)] leading-[1.15] font-bold tracking-[-0.01em] text-[#0f1b3d]">
            Meet Our <span className="text-[#b8924f] italic">Expert Cardiologists</span>
          </h1>
          <p className="mx-auto text-[1.05rem] leading-[1.7] text-[#5d6784]">
            Learn from practising cardiologists who bring years of clinical,
            interventional and imaging experience into every module and live
            session.
          </p>
        </header>

        {doctors.length > 0 ? (
          <DoctorGrid>
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                cover
                headingLevel={2}
                to={`/doctors/${doctor.id}`}
              />
            ))}
          </DoctorGrid>
        ) : (
          <p className="mx-auto max-w-[520px] rounded-2xl border border-[#e7e2d6] bg-white px-6 py-8 text-center text-[1rem] leading-[1.7] text-[#5d6784] shadow-[0_8px_20px_-14px_rgba(15,27,61,0.3)]">
            Faculty details are coming soon.
          </p>
        )}

        <div className="mt-[52px] flex justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#e7e2d6] bg-white px-[22px] py-[11px] text-[0.9rem] text-[#5d6784] shadow-[0_8px_20px_-14px_rgba(15,27,61,0.3)] max-[641px]:px-4 max-[641px]:py-2.5 max-[641px]:text-left max-[641px]:text-[0.82rem]">
            <ShieldIcon />
            <span>All doctors are verified · CPD &amp; ACTD accredited</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DoctorsPage
