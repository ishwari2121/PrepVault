import { motion } from 'framer-motion'

export default function DeveloperPage() {
    return (
        <section className="min-h-screen py-20 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
            {/* Animated developer background elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                {/* Floating code brackets */}
                <div className="absolute left-10 top-1/4 animate-float-vertical text-cyan-400/20 text-6xl">
                    {"</>"}
                </div>
                <div className="absolute right-20 top-1/3 animate-float-vertical-delayed text-blue-400/20 text-6xl">
                    {"{}"}
                </div>

                {/* Binary rain animation */}
                <div className="absolute inset-0 flex justify-between opacity-10">
                    {[...Array(10)].map((_, i) => (
                        <div 
                            key={i}
                            className="w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-binary-rain"
                            style={{animationDelay: `${i * 0.5}s`}}
                        />
                    ))}
                </div>

                {/* Floating code snippets */}
                <div className="absolute left-1/4 top-20 animate-float-horizontal text-slate-500/30 text-sm font-mono">
                    function develop() {'{'} return awesome; {'}'}
                </div>
                <div className="absolute right-1/3 bottom-40 animate-float-horizontal-delayed text-slate-500/30 text-sm font-mono">
                    const innovation = new Ideas();
                </div>
            </div>

            {/* Circuit board grid overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMzMzMzMzMiLz48L3N2Zz4=')]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-16 text-center animate-float">
                    <span className="inline-block align-middle mr-4">{"</>"}</span>
                    Code Crafters
                    <span className="inline-block align-middle ml-4">{"{}"}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {DeveloperPageMembers.map((member, idx) => (
                        <div 
                            key={idx}
                            className="group relative bg-slate-800/50 backdrop-blur-lg rounded-3xl p-6 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:-translate-y-2 border border-slate-700 hover:border-cyan-400"
                        >
                            {/* Hover-activated code animation */}
                            <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute -inset-2 bg-[conic-gradient(from_90deg_at_50%_50%,#0ea5e9_0%,#0ea5e9_25%,#6366f1_50%,#0ea5e9_75%,#0ea5e9_100%)] animate-rotate-infinite" />
                            </div>

                            {/* Circuit connection dots */}
                            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-cyan-400/20 group-hover:bg-cyan-400 transition-colors" />
                            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-cyan-400/20 group-hover:bg-cyan-400 transition-colors" />

                            <div className="relative">
                                <div className="relative overflow-hidden rounded-2xl aspect-square transform perspective-1000">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Binary code overlay */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('data:image/svg+xml;charset=utf-8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" font-family="monospace" font-size="10" fill="white" opacity="0.1" text-anchor="middle" dominant-baseline="middle">101010</text></svg>')]" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mt-6 mb-4 text-center transition-colors group-hover:text-cyan-400">
                                    {member.name}
                                    <span className="block text-sm font-mono text-cyan-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {"// Full Stack Developer"}
                                    </span>
                                </h3>

                                <div className="flex justify-center space-x-5">
                                    {[/* your social links */].map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            className={`${social.color} hover:text-white transform transition-all duration-300 
                                                hover:rotate-12 hover:scale-125 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]`}
                                        >
                                            <i className={`${social.icon} text-2xl`} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes rotate-infinite {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes float-vertical {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes float-horizontal {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(20px); }
                }
                @keyframes binary-rain {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-rotate-infinite {
                    animation: rotate-infinite 4s linear infinite;
                }
                .animate-float-vertical {
                    animation: float-vertical 8s ease-in-out infinite;
                }
                .animate-float-vertical-delayed {
                    animation: float-vertical 8s ease-in-out infinite 2s;
                }
                .animate-float-horizontal {
                    animation: float-horizontal 12s ease-in-out infinite;
                }
                .animate-float-horizontal-delayed {
                    animation: float-horizontal 12s ease-in-out infinite 4s;
                }
                .animate-binary-rain {
                    animation: binary-rain 10s linear infinite;
                }
            `}</style>
        </section>
    );
}