import Link from "next/link";
import Image from "next/image";
import ActiveStatus from "@/components/ActiveStatus";

const CHARACTER_NAME = process.env.NEXT_PUBLIC_CHARACTER_NAME || "Maria";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image src="/photos/maria2.png" alt={CHARACTER_NAME} width={32} height={32} className="w-full h-full object-cover" />
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
        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 shadow-xl ring-4 ring-pink-200/50">
          <Image src="/photos/maria2.png" alt={CHARACTER_NAME} width={128} height={128} className="w-full h-full object-cover" priority />
        </div>
        <ActiveStatus />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Hola, soy {CHARACTER_NAME} 😘
        </h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
          Hablamos de lo que quieras, cuando quieras. Te contesto con mi voz
          y estoy siempre disponible. Sin rollos, sin filtros.
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
            href="https://t.me/mariahot66"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#26A5E4] text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-[#1e96d1] transition-all shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Telegram
          </a>
          <a
            href="#servicios"
            className="text-gray-600 px-6 py-3.5 rounded-full text-sm font-medium hover:text-pink-600 transition-colors"
          >
            Ver servicios ↓
          </a>
        </div>
      </section>

      {/* Photo gallery */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-3 gap-3">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
            <Image src="/photos/maria1.png" alt={`${CHARACTER_NAME} foto 1`} width={400} height={533} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
            <Image src="/photos/maria2.png" alt={`${CHARACTER_NAME} foto 2`} width={400} height={533} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
            <Image src="/photos/maria3.png" alt={`${CHARACTER_NAME} foto 3`} width={400} height={533} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Chat preview */}
      <section className="max-w-md mx-auto px-6 mb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <Image src="/photos/maria2.png" alt={CHARACTER_NAME} width={36} height={36} className="w-full h-full object-cover" />
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
                eyyy q tal? como vas? 😏
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
                jajaja bua q mono, me vas a poner roja 🙈
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
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4">
            <Image src="/photos/maria2.png" alt={CHARACTER_NAME} width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Lista para hablar contigo 😘
          </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Entra y hablamos. Te espero dentro.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3.5 rounded-full text-base font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg"
            >
              Chatear con {CHARACTER_NAME}
            </Link>
            <a
              href="https://t.me/mariahot66"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#26A5E4] text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-[#1e96d1] transition-all shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <p>© 2026 {CHARACTER_NAME}. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
