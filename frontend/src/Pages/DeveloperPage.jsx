import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGithub, 
    faLinkedin, 
    faInstagram 
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Img1 from "../assets/image_1.png";
import Img2 from "../assets/image_2.png";
import Img3 from "../assets/image_3.png";
import Img4 from "../assets/image_4.png";
import { NavLink } from 'react-router-dom';

const DeveloperPageMembers = [
    {
        name: "Ishwari Gondkar",
        branch:"Information Technology",
        email: "ishwari@example.com",
        img: Img1,
        github: "#",
        linkedin: "#",
        instagram: "#",
        contact: "#",
    },
    {
        name: "Abhishek Patil",
        branch:"Computer Engineering",
        email: "abhishek@example.com",
        img: Img2,
        github: "#",
        linkedin: "#",
        instagram: "#",
        contact: "#",
    },
    {
        name: "Sayyed Ziyaulhusen",
        branch:"Electronics & Telecommunication engineering",
        email: "ziya@example.com",
        img: Img3,
        github: "#",
        linkedin: "#",
        instagram: "#",
        contact: "#",
    },
    {
        name: "Aditi Nandapurkar",
        branch:"Computer Engineering",
        email: "aditi@example.com",
        img: Img4,
        github: "#",
        linkedin: "#",
        instagram: "#",
        contact: "#",
    },
];

export default function DeveloperPage() {
    return (
        <section className="min-h-screen py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Subtle particle animation */}
                <div className="absolute inset-0 opacity-10 animate-particle-flow">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.2}s`
                            }}
                        />
                    ))}
                </div>

                {/* Floating gradient spheres */}
                <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full -top-48 -left-48 mix-blend-soft-light blur-3xl" />
                <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full -bottom-48 -right-48 mix-blend-soft-light blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-16 text-center">
                    <span className="inline-block align-middle mr-4">{"</>"}</span>
                    Code Crafters
                    <span className="inline-block align-middle ml-4">{"{}"}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {DeveloperPageMembers.map((member, idx) => (
                        <div 
                            key={idx}
                            className="group relative bg-slate-800/40 backdrop-blur-lg rounded-3xl p-6 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-2 border border-slate-700/50 hover:border-cyan-400/30"
                        >
                            <div className="relative">
                                <div className="relative overflow-hidden rounded-2xl aspect-square">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Lightened overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mt-6 mb-4 text-center transition-colors group-hover:text-cyan-400">
                                    {member.name}
                                    <span className="block text-sm font-mono text-cyan-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <i className="fa-solid fa-graduation-cap mr-2"></i>
                                        {member.branch}
                                    </span>
                                    {/* Email Section */}
                                    <NavLink to={`mailto:${member.email}`}>
                                        <span className="block text-sm font-mono text-cyan-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {member.email}
                                        </span>
                                    </NavLink>
                                </h3>

                                <div className="flex justify-center space-x-5">
                                    {[
                                        { href: member.github, icon: faGithub, color: "text-gray-400" },
                                        { href: member.linkedin, icon: faLinkedin, color: "text-blue-400" },
                                        { href: member.instagram, icon: faInstagram, color: "text-pink-400" },
                                        { href: member.contact, icon: faEnvelope, color: "text-green-400" },
                                    ].map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`${social.color} hover:text-white transform transition-all duration-300 hover:scale-125`}
                                        >
                                            <FontAwesomeIcon icon={social.icon} className="text-2xl" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes particle-flow {
                    0% { transform: translateY(0) scale(1); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
                }
                .animate-particle-flow div {
                    animation: particle-flow 12s linear infinite;
                }
            `}</style>
        </section>
    );
}
