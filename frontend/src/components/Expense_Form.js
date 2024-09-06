import React, { useState } from "react";
import axios from "axios";

export default function Expense_Form() {
    const [values, setValues] = useState({
        email: '',
        Name: '',
        Amount: ''
    });
    
    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    
    const [balances, setBalances] = useState([]);
    const [totalExpenditure, setTotalExpenditure] = useState(0);
    const [equalShare, setEqualShare] = useState(0);
    
    const fetchBalances = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/totals/${values.email}`);
            setBalances(response.data.personTotals);
            setTotalExpenditure(response.data.totalExpenditure);
            setEqualShare(response.data.equalShare);
        } catch (error) {
            console.error('Error fetching balances:', error);
        }
    };

    const handleReset = () => {
        setValues({
            email: '',
            Name: '',
            Amount: '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let data = JSON.stringify({
            "email": values.email,
            "name": values.Name,
            "amount": values.Amount
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000',
            headers: { 
                'Accept-Language': 'fr', 
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setValues({
                    email: '',
                    Name: '',
                    Amount: ''
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center text-[#3a7dff] mb-6">Expense Form</h2>
                <form onSubmit={handleSubmit} onReset={handleReset} className="space-y-6">
                    {/* Email Input */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700 mb-2">Enter your email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={values.email} 
                            onChange={handleChanges} 
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Email id"
                            required 
                        />
                    </div>
                    {/* Name Input */}
                    <div className="flex flex-col">
                        <label htmlFor="Name" className="text-gray-700 mb-2">Enter the name of the person paying</label>
                        <input 
                            type="text" 
                            name="Name" 
                            value={values.Name} 
                            onChange={handleChanges} 
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Name"
                            required 
                        />
                    </div>
                    {/* Amount Input */}
                    <div className="flex flex-col">
                        <label htmlFor="Amount" className="text-gray-700 mb-2">Enter the amount paid</label>
                        <input 
                            type="number" 
                            name="Amount" 
                            value={values.Amount} 
                            onChange={handleChanges} 
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Amount"
                            required 
                        />
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-between space-x-4">
                        <button type="reset" className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                            Reset
                        </button>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                            Submit
                        </button>
                        <button 
                            type="button" 
                            className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
                            onClick={fetchBalances}
                        >
                            See the total expenditure
                        </button>
                    </div>
                </form>

                {/* Display Balances */}
                {balances.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Total Expenditure of the Group: 
                            <span className="text-green-600 ml-2">${totalExpenditure.toFixed(2)}</span>
                        </h4>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Equal Share per Person: 
                            <span className="text-green-600 ml-2">${equalShare.toFixed(2)}</span>
                        </h4>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Balance for Each Person:</h4>
                        <ul className="divide-y divide-gray-200">
                            {balances.map((person, index) => (
                                <li 
                                    key={index} 
                                    className={`py-3 px-4 rounded-lg ${person.balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}
                                >
                                    {person.name}: ${person.balance.toFixed(2)} 
                                    <span className={person.balance >= 0 ? 'text-green-700' : 'text-red-700'}> 
                                        ({person.balance >= 0 ? 'Paid in Excess' : 'Owes'})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
