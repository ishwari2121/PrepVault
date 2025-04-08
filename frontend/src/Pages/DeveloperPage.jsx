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
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from "react-intersection-observer";

const DeveloperPageMembers = [
    {
        name: "Ishwari Gondkar",
        branch:"Information Technology",
        email: "ishwari@example.com",
        img: Img1,
        github: "#",
        linkedin: "#",
        instagram: "https://www.instagram.com/ishwari_.14/",
        contact: "#",
    },
    {
        name: "Abhishek Patil",
        branch:"Computer Engineering",
        email: "abhi.patil3579@gmail.com",
        img: Img2,
        github: "#",
        linkedin: "https://www.linkedin.com/in/abhishek-patil-795714258/",
        instagram: "https://www.instagram.com/abhishekpatil904/",
        contact: "7028727108",
    },
    {
        name: "Sayyed Ziyaulhusen",
        branch:"Electronics & Telecommunication engineering",
        email: "ziya@example.com",
        img: Img3,
        github: "#",
        linkedin: "#",
        instagram: "https://www.instagram.com/ziya_salar",
        contact: "#",
    },
    {
        name: "Aditi Nandapurkar",
        branch:"Computer Engineering",
        email: "aditi@example.com",
        img: Img4,
        github: "#",
        linkedin: "#",
        instagram: "https://www.instagram.com/aditi_nandapurkar/",
        contact: "mailto:aditi@example.com",
    },
];


const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
            type: 'spring', 
            stiffness: 100,
            damping: 20,
            staggerChildren: 0.1
        }
    }
};

const SocialIcon = ({ href, icon, color, delay }) => {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`${color} hover:text-white transform transition-all duration-150`}
            whileHover={{ rotate: 25, scale: 1.1 }}
            initial={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
        >
            <FontAwesomeIcon icon={icon} className="text-2xl" />
        </motion.a>
    );
};

const MemberCard = ({ member, index }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial="hidden"
            animate={controls}
            className="group relative bg-slate-800/40 backdrop-blur-lg rounded-3xl p-6 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 border border-slate-700/50"
        >
            <div className="relative">
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                    <motion.img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                <motion.h3 
                    className="text-2xl font-bold text-white mt-6 mb-4 text-center transition-colors group-hover:text-cyan-400"
                    whileHover={{ scale: 1.05 }}
                >
                    {member.name}
                    <motion.span 
                        className="block text-sm font-mono text-cyan-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <i className="fa-solid fa-graduation-cap mr-2"></i>
                        {member.branch}
                    </motion.span>
                </motion.h3>

                <motion.div 
                    className="flex justify-center space-x-5"
                    variants={cardVariants}
                >
                    {[
                        { href: member.github, icon: faGithub, color: "text-gray-400" },
                        { href: member.linkedin, icon: faLinkedin, color: "text-blue-400" },
                        { href: member.instagram, icon: faInstagram, color: "text-pink-400" },
                        { href: member.contact, icon: faEnvelope, color: "text-green-400" },
                    ].map((social, i) => (
                        <SocialIcon 
                            key={i}
                            href={social.href}
                            icon={social.icon}
                            color={social.color}
                            delay={i}
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default function DeveloperPage() {
    return (
        <section className="min-h-screen py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-10 animate-particle-flow">
                    {[...Array(100)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [-100, window.innerHeight + 100],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 10 + Math.random() * 10,
                                repeat: Infinity,
                                delay: Math.random() * 5,
                            }}
                        />
                    ))}
                </div>

                <motion.div 
                    className="absolute w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full -top-48 -left-48 mix-blend-soft-light blur-3xl"
                    animate={{
                        x: [-100, 0, -100],
                        y: [-50, 0, -50],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div 
                    className="absolute w-[800px] h-[800px] bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full -bottom-48 -right-48 mix-blend-soft-light blur-3xl"
                    animate={{
                        x: [100, 0, 100],
                        y: [50, 0, 50],
                        rotate: [360, 180, 0]
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.h2 
                    className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-16 text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block align-middle mr-4 animate-pulse">{"</>"}</span>
                    Code Crafters
                    <span className="inline-block align-middle ml-4 animate-pulse">{"{}"}</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {DeveloperPageMembers.map((member, idx) => (
                        <MemberCard key={idx} member={member} index={idx} />
                    ))}
                </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/10 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100],
                            x: [0, (Math.random() - 0.5) * 100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>
        </section>
    );
}