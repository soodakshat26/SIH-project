import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './expense_form.css';

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
    const handleReset=() => {
      setValues({
        email:'',
        Name:'',
        Amount:'',
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Expense Form</h2>
                            <form onSubmit={handleSubmit} onReset={handleReset}>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">Enter your email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="Email id" 
                                        name="email" 
                                        value={values.email}
                                        onChange={handleChanges} 
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="Name">Enter the name of the person paying</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Name" 
                                        name="Name" 
                                        value={values.Name}
                                        onChange={handleChanges} 
                                        required 
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="Amount">Enter the amount paid</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        placeholder="Amount" 
                                        name="Amount" 
                                        value={values.Amount}
                                        onChange={handleChanges} 
                                        required 
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button type="reset" className="btn btn-secondary">
                                        Reset
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                    <button type="button" className="btn btn-info" onClick={fetchBalances}>
                                        See the total expenditure
                                    </button>
                                </div>
                            </form>
                            {balances.length > 0 && (
                                <div className="mt-4">
                                    <h4>Total Expenditure of the Group: <span className="text-success">${totalExpenditure.toFixed(2)}</span></h4>
                                    <h4>Equal Share per Person: <span className="text-success">${equalShare.toFixed(2)}</span></h4>
                                    <h4>Balance for Each Person:</h4>
                                    <ul className="list-group">
                                        {balances.map((person, index) => (
                                            <li key={index} className={`list-group-item ${person.balance >= 0 ? 'bg-light' : 'bg-warning'}`}>
                                                {person.name}: ${person.balance.toFixed(2)} ({person.balance >= 0 ? 'Paid in Excess' : 'Owes'})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



