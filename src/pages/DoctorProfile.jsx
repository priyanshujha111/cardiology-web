import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DepartmentTags, DoctorAvatar } from '../components/DoctorCard.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import { getDoctorById } from '../data/doctors.js'

const serif = "font-['Lora',Georgia,'Times_New_Roman',serif]"

const cardClass =
  'relative overflow-hidden rounded-[24px] border border-[#e7e2d6] bg-white shadow-[0_1px_2px_rgba(15,27,61,0.04),0_18px_40px_-20px_rgba(15,27,61,0.25)]'

const coverClass =
  'h-[120px] bg-[linear-gradient(135deg,rgba(217,191,140,0.25),transparent_55%),linear-gradient(135deg,#0f1b3d,#22305c)]'

function ProfileView({ doctor }) {
  return (
    <article className={cardClass}>
      <div className={coverClass} aria-hidden="true" />
      <div className="flex flex-col items-center px-6 pb-10 text-center sm:px-10">
        <div className="relative -mt-16 rounded-full bg-white p-1.5 shadow-[0_8px_20px_-8px_rgba(15,27,61,0.4)]">
          <DoctorAvatar name={doctor.name} photo={doctor.photo} size={112} />
        </div>

        <h1 className={`mt-5 text-[clamp(1.7rem,4vw,2.4rem)] leading-[1.2] font-bold wrap-anywhere text-[#0f1b3d] ${serif}`}>
          {doctor.name}
        </h1>
        {doctor.focus && (
          <p className="mt-1.5 text-[0.95rem] text-[#5d6784]">
            {doctor.focus} faculty · Medical Global Academy
          </p>
        )}
        <DepartmentTags areas={doctor.focusAreas} className="mt-4" />

        <div
          className="mt-9 h-px w-full bg-[linear-gradient(90deg,transparent,#e7e2d6_15%,#e7e2d6_85%,transparent)]"
          aria-hidden="true"
        />

        <div className="mt-8 w-full text-left">
          {doctor.qualifications.length > 0 && (
            <section aria-labelledby="doctor-qualifications">
              <h2 id="doctor-qualifications" className={`text-[1.25rem] font-bold text-[#0f1b3d] ${serif}`}>
                Qualifications
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {doctor.qualifications.map((q) => (
                  <li
                    key={q}
                    className="max-w-full rounded-full border border-dashed border-[#d9bf8c] bg-[#fffdf8] px-3.5 py-[7px] text-[0.85rem] font-semibold tracking-[0.02em] wrap-anywhere text-[#0f1b3d]"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {doctor.bio.length > 0 && (
            <section aria-labelledby="doctor-about" className="mt-9">
              <h2 id="doctor-about" className={`text-[1.25rem] font-bold text-[#0f1b3d] ${serif}`}>
                About
              </h2>
              <div className="mt-3 space-y-3 text-[1rem] leading-[1.75] text-[#3b4766]">
                {doctor.bio.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}
        </div>

        <Link
          to="/courses"
          className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-[#c9a24a] px-7 text-sm font-semibold text-[#0a1428] shadow-[0_8px_24px_rgba(201,162,74,0.3)] transition-colors hover:bg-[#d8b25a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24a] focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Explore Courses
        </Link>
      </div>
    </article>
  )
}

function DoctorProfile() {
  const { id } = useParams()
  const doctor = getDoctorById(id)
  const doctorName = doctor?.name

  useEffect(() => {
    if (!doctorName) return
    const previousTitle = document.title
    document.title = `${doctorName} | Medical Global Academy`
    return () => {
      document.title = previousTitle
    }
  }, [doctorName])

  if (!doctor) {
    return (
      <NotFoundPage
        title="Doctor not found"
        message="This faculty profile may have been moved or is no longer available."
      />
    )
  }

  return (
    <section className="relative overflow-hidden bg-[#fbf9f4] bg-[radial-gradient(900px_420px_at_8%_-5%,rgba(217,191,140,0.28),transparent_60%),radial-gradient(800px_480px_at_100%_100%,rgba(15,27,61,0.07),transparent_60%)] px-5 pt-6 pb-22 font-['Outfit',system-ui,-apple-system,'Segoe_UI',sans-serif] text-[#0f1b3d] max-[641px]:px-4 max-[641px]:pt-4 max-[641px]:pb-16">
      <div className="relative mx-auto max-w-[820px]">
        <Link
          to="/doctors"
          className="mb-6 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.9rem] font-semibold text-[#b8924f] underline-offset-4 transition-colors hover:text-[#0f1b3d] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24a]"
        >
          <span aria-hidden="true">←</span> All faculty
        </Link>

        <ProfileView key={doctor.id} doctor={doctor} />
      </div>
    </section>
  )
}

export default DoctorProfile
