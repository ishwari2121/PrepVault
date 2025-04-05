const DeveloperPageMembers = [
    {
        name: "Member 1",
        img: "link-to-image-1",
        github: "#",
        linkedin: "#",
        contact: "#",
    },
    {
        name: "Member 2",
        img: "link-to-image-2",
        github: "#",
        linkedin: "#",
        contact: "#",
    },
    {
        name: "Member 3",
        img: "link-to-image-3",
        github: "#",
        linkedin: "#",
        contact: "#",
    },
    {
        name: "Member 4",
        img: "link-to-image-3",
        github: "#",
        linkedin: "#",
        contact: "#",
    },
    
];

export default function DeveloperPage() {
    return (
        <section className="py-16 bg-blue-50 text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">theInterview</h1>
            <h2 className="text-3xl font-semibold mb-10">DeveloperPage</h2>
            <div className="flex flex-wrap justify-center gap-10">
                {DeveloperPageMembers.map((member, idx) => (
                    <div key={idx} className="bg-white shadow-xl rounded-3xl p-4 w-72">
                        <img
                            src={member.img}
                            alt={member.name}
                            className="rounded-2xl mb-4 h-64 w-full object-cover"
                        />
                        <div className="flex justify-around mb-4">
                            <a href={member.github} target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-github text-2xl"></i>
                            </a>
                            <a href={member.linkedin} target="_blank" rel="noreferrer">
                                <i className="fa-brands fa-linkedin text-2xl"></i>
                            </a>
                            <a href={member.contact} target="_blank" rel="noreferrer">
                                <button className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-700">
                                    Contact Me
                                </button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
