import Header from "@/components/Header";
import {
  Activity,
  CheckCircle2,
  Clock3,
  HeartPulse,
  MapPin,
  PhoneCall,
  Pill,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Users,
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "General Medical Consultation",
    description:
      "Support for common illnesses, routine checkups, and basic medical assessment for residents.",
  },
  {
    icon: Syringe,
    title: "Immunization Services",
    description:
      "Vaccination guidance and community immunization support for children, adults, and priority groups.",
  },
  {
    icon: HeartPulse,
    title: "Maternal & Child Health",
    description:
      "Health monitoring, wellness education, and preventive care for mothers, infants, and young children.",
  },
  {
    icon: Pill,
    title: "Medicine & Treatment Guidance",
    description:
      "Clear health advice, prescription support, and patient education for safer recovery and follow-up care.",
  },
];

const programs = [
  {
    icon: Activity,
    title: "Community Health Programs",
    description: "Health awareness campaigns, screening activities, and preventive outreach across Bongabong.",
  },
  {
    icon: Users,
    title: "Family and Wellness Support",
    description: "Patient-centered assistance that encourages healthy living, early care, and regular checkups.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Public Health Service",
    description: "A welcoming office environment focused on safe, respectful, and accessible medical support.",
  },
];

const highlights = [
  "Public health information made clear and easy to understand",
  "Clean and organized office presentation for community trust",
  "Preventive care, consultation, and wellness support in one place",
  "Focused on the needs of families in Bongabong",
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-health-50/40 to-white">
      <Header />

      <section id="about" className="relative overflow-hidden bg-gradient-to-br from-health-50 via-white to-emerald-50/60">
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-health-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-health-200 bg-white/80 px-4 py-2 text-sm font-semibold text-health-700 shadow-sm backdrop-blur-sm">
                <HeartPulse className="h-4 w-4" />
                Public health care for the community of Bongabong
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
                  Medical Health Office of Bongabong
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  A clear and welcoming public health website that helps residents learn about medical services, wellness programs, office hours, and community care support.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-health-100">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-health-600" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-health-500 to-health-600 px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-glow"
                >
                  View Services
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-xl border border-health-200 bg-white px-6 py-3.5 font-semibold text-health-700 transition-colors hover:bg-health-50"
                >
                  Office Information
                </a>
              </div>

              <div className="grid gap-4 border-t border-health-100 pt-4 sm:grid-cols-3">
                <div>
                  <p className="text-2xl font-bold text-health-700">Bongabong</p>
                  <p className="text-sm text-slate-600">community-focused care</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-health-700">Prevention</p>
                  <p className="text-sm text-slate-600">wellness and early care</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-health-700">Support</p>
                  <p className="text-sm text-slate-600">clear medical guidance</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-health-200/60 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-health-100 bg-white/90 p-6 shadow-2xl backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-health-600">Office details</p>
                    <h3 className="text-2xl font-bold text-slate-900">Community health information</h3>
                  </div>
                  <div className="rounded-xl bg-health-50 px-3 py-2 text-sm font-semibold text-health-700">
                    Public service
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-800">
                      <Clock3 className="h-4 w-4 text-health-600" />
                      <span className="font-semibold">Office hours</span>
                    </div>
                    <p className="text-sm text-slate-600">Monday to Friday · Regular municipal office schedule</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-health-100 p-4">
                      <p className="text-sm text-slate-500">Focus areas</p>
                      <p className="mt-1 font-semibold text-slate-900">Consultation, immunization, maternal care</p>
                    </div>
                    <div className="rounded-2xl border border-health-100 p-4">
                      <p className="text-sm text-slate-500">Service goal</p>
                      <p className="mt-1 font-semibold text-slate-900">Accessible health support for residents</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-health-600 to-health-500 p-5 text-white shadow-lg">
                    <div className="mb-2 flex items-center gap-2">
                      <PhoneCall className="h-4 w-4" />
                      <span className="font-semibold">Public assistance and enquiries</span>
                    </div>
                    <p className="text-sm text-white/90">Use this website to understand available medical services and office information at a glance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container mx-auto px-4 py-20 md:py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-health-600">Medical services</p>
          <h2 className="text-3xl font-bold text-slate-900 md:text-5xl">Essential health support for the people of Bongabong</h2>
          <p className="mt-4 text-lg text-slate-600">
            The website highlights the office’s healthcare role clearly, helping residents understand available care and public health support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group rounded-3xl border border-health-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-health-500 to-health-600 text-white shadow-lg">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{service.title}</h3>
                <p className="leading-7 text-slate-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-r from-health-700 via-health-600 to-emerald-600 py-20 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%)]" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-health-100">Public health programs</p>
            <h2 className="text-3xl font-bold md:text-5xl">Programs that promote wellness, prevention, and safer communities</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {programs.map((program) => {
              const Icon = program.icon;
              return (
                <div key={program.title} className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{program.title}</h3>
                  <p className="text-white/90">{program.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="container mx-auto px-4 py-20 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-health-100 bg-white p-6 shadow-sm md:p-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-health-600">Why this site works</p>
            <h2 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">A clearer online presence for the Medical Health Office</h2>

            <div className="space-y-5">
              {[
                "Presents medical and public health information in a clean, trustworthy way.",
                "Focuses on services, wellness programs, and office details instead of appointment booking.",
                "Gives residents a quick overview of what the office does and how it supports the community.",
              ].map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-health-100 text-health-700">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-xl md:p-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-health-300">Office information</p>
            <h2 className="text-3xl font-bold">Medical Health Office of Bongabong</h2>
            <p className="mt-4 text-white/80">
              A public-facing page for residents looking for health office information, services, and wellness support.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <MapPin className="mt-1 h-5 w-5 text-health-300" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-sm text-white/80">Bongabong, Oriental Mindoro</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <Clock3 className="mt-1 h-5 w-5 text-health-300" />
                <div>
                  <p className="font-semibold">Office hours</p>
                  <p className="text-sm text-white/80">Monday to Friday during regular office schedule</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <PhoneCall className="mt-1 h-5 w-5 text-health-300" />
                <div>
                  <p className="font-semibold">Public enquiries</p>
                  <p className="text-sm text-white/80">For service details, health programs, and office assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-health-100 bg-white py-8">
        <div className="container mx-auto flex flex-col gap-4 px-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-semibold text-slate-900">Medical Health Office of Bongabong</span> · Public health information and community medical support.
          </div>
          <div className="flex items-center gap-2 text-health-700">
            <ShieldCheck className="h-4 w-4" />
            <span>Clear, trustworthy, health-focused presentation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
