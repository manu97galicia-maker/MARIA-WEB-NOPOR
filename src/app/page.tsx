import Link from "next/link";
import ActiveStatus from "@/components/ActiveStatus";

const CHARACTER_NAME = process.env.NEXT_PUBLIC_CHARACTER_NAME || "Luna";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
            {CHARACTER_NAME[0]}
          </div>
          <span className="font-semibold text-gray-900">{CHARACTER_NAME}</span>
        </div>
        <Link
          href="/login"
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-md"
        >
          Entrar
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-5xl mx-auto mb-6 shadow-xl ring-4 ring-pink-200/50">
          {CHARACTER_NAME[0]}
        </div>
        <ActiveStatus />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Hola, soy {CHARACTER_NAME} 😘
        </h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
          Tu compañera exclusiva de chat. Hablamos de lo que quieras,
          cuando quieras. Respondo con mi voz real y siempre estoy disponible para ti.
        </p>
        <div className="flex items-center justify-center gap-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-400">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Tiempo medio de respuesta: <span className="font-medium text-gray-700">~3 min</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3.5 rounded-full text-base font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl"
          >
            Empieza a chatear
          </Link>
          <a
            href="#servicios"
            className="text-gray-600 px-6 py-3.5 rounded-full text-sm font-medium hover:text-pink-600 transition-colors"
          >
            Ver servicios ↓
          </a>
        </div>
      </section>

      {/* Chat preview */}
      <section className="max-w-md mx-auto px-6 mb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                {CHARACTER_NAME[0]}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{CHARACTER_NAME}</p>
              <p className="text-[10px] text-green-500">online</p>
            </div>
          </div>
          <div className="p-4 space-y-3 bg-gradient-to-b from-pink-50/30 to-white">
            <div className="flex justify-end">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md px-4 py-2 text-sm max-w-[75%]">
                Hola! 👋
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-4 py-2 text-sm text-gray-800 max-w-[75%]">
                Hola guapo! que tal andas? 😏
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[75%]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M3 1.5v11l9-5.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-pink-100 rounded-full h-1">
                      <div className="bg-pink-400 h-1 rounded-full w-[60%]" />
                    </div>
                    <p className="text-[10px] text-pink-400 mt-0.5">0:03</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md px-4 py-2 text-sm max-w-[75%]">
                Me encanta tu voz 🔥
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-4 py-2 text-sm text-gray-800 max-w-[75%]">
                jaja gracias guapo, me pones roja 😘
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Por que chatear conmigo?
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
              🎤
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Mensajes de voz</h3>
            <p className="text-sm text-gray-500">
              Te respondo con mi voz real. Escuchame hablar solo para ti.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
              💬
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Chat 24/7</h3>
            <p className="text-sm text-gray-500">
              Siempre online para ti. Hablamos de lo que quieras, cuando quieras.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
              🌍
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Español e Ingles</h3>
            <p className="text-sm text-gray-500">
              Hablo en tu idioma. Cambia entre español e ingles cuando quieras.
            </p>
          </div>
        </div>
      </section>

      {/* Services / Pricing */}
      <section id="servicios" className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
          Mis servicios
        </h2>
        <p className="text-sm text-gray-500 text-center mb-10 max-w-md mx-auto">
          Elige el plan que mas te guste y empezamos a hablar
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="sm:col-span-2 lg:col-span-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-2 right-4 bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full">
              MEJOR OPCION
            </div>
            <h3 className="text-xl font-bold mb-1">Chat exclusivo 1 semana</h3>
            <p className="text-pink-100 text-sm mb-3">7 dias hablando conmigo sin limites</p>
            <p className="text-4xl font-bold mb-4">100€</p>
            <Link
              href="/login"
              className="inline-block bg-white text-pink-600 px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-pink-50 transition-colors"
            >
              Empezar ahora
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl mb-2">📸</p>
            <h3 className="font-semibold text-gray-900 mb-1">Pack Basico</h3>
            <p className="text-xs text-gray-500 mb-3">5 fotos exclusivas</p>
            <p className="text-2xl font-bold text-gray-900 mb-3">10€</p>
            <Link href="/login" className="text-sm text-pink-500 font-medium hover:text-pink-600">
              Comprar →
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl mb-2">👑</p>
            <h3 className="font-semibold text-gray-900 mb-1">Pack Premium</h3>
            <p className="text-xs text-gray-500 mb-3">10 fotos + video</p>
            <p className="text-2xl font-bold text-gray-900 mb-3">20€</p>
            <Link href="/login" className="text-sm text-pink-500 font-medium hover:text-pink-600">
              Comprar →
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl mb-2">💬</p>
            <h3 className="font-semibold text-gray-900 mb-1">Chat 1 dia</h3>
            <p className="text-xs text-gray-500 mb-3">15-20 min de chat</p>
            <p className="text-2xl font-bold text-gray-900 mb-3">15€</p>
            <Link href="/login" className="text-sm text-pink-500 font-medium hover:text-pink-600">
              Comprar →
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl mb-2">🔥</p>
            <h3 className="font-semibold text-gray-900 mb-1">Contenido VIP</h3>
            <p className="text-xs text-gray-500 mb-3">Contenido personalizado</p>
            <p className="text-2xl font-bold text-gray-900 mb-3">Consultar</p>
            <Link href="/login" className="text-sm text-pink-500 font-medium hover:text-pink-600">
              Preguntar →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20 text-center">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-10 border border-pink-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Lista para hablar contigo 😘
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Entra ahora y empieza a chatear conmigo. Te estoy esperando.
          </p>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3.5 rounded-full text-base font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg"
          >
            Chatear con {CHARACTER_NAME}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>© 2026 {CHARACTER_NAME}. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
