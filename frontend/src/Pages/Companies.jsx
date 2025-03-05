import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/companies")
            .then(response => setCompanies(response.data))
            .catch(error => console.error("Error fetching companies:", error));
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Companies</h1>
            
            <ul className="bg-gray-100 p-4 rounded-md shadow-md">
                {companies.length === 0 ? (
                    <p className="text-gray-500">No companies available.</p>
                ) : (
                    companies.map(company => (
                        <li key={company._id} className="mb-2">
                            <Link 
                                to={`/company/${company.name}`} 
                                className="text-lg text-blue-500 hover:underline"
                            >
                                {company.name}
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default CompanyList;
