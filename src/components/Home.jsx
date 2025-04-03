import React, { useEffect, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { BsFillArchiveFill, BsPeopleFill } from "react-icons/bs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function Home() {
    const [productCount, setProductCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const [medicalCount, setMedicalCount] = useState(0);
    const [priceData, setPriceData] = useState([]);

    useEffect(() => {
        const fetchProductCount = async () => {
            try {
                const response = await axios.get("http://192.168.8.200:8000/product-count");
                setProductCount(response.data.product_count);
            } catch (error) {
                console.error("Error fetching product count:", error);
            }
        };
        fetchProductCount();
    }, []);

    useEffect(() => {
        const fetchCustomerCount = async () => {
            try {
                const response = await axios.get("http://192.168.8.200:8000/auth/user-count");
                setCustomerCount(response.data.user_count);
            } catch (error) {
                console.error("Error fetching customer count:", error);
            }
        };
        fetchCustomerCount();
    }, []);

    useEffect(() => {
        const fetchMedicalCount = async () => {
            try {
                const response = await axios.get("http://192.168.8.200:8000/medical-count");
                setMedicalCount(response.data.medical_count);
            } catch (error) {
                console.error("Error fetching medical count:", error);
            }
        };
        fetchMedicalCount();
    }, []);

    useEffect(() => {
        const fetchPriceData = async () => {
            try {
                const response = await axios.get("http://192.168.8.200:8000/products");
                const formattedData = response.data.slice(0,8).map((product) => ({
                    name: product.name,
                    old_price: product.old_price,
                    new_price: product.new_price,
                }));
                setPriceData(formattedData);
            } catch (error) {
                console.error("Error fetching product prices:", error);
            }
        };
        fetchPriceData();
    }, []);

    return (
        <main className="main-container">
            <div className="main-title">
                <h3>DashBoard</h3>
            </div>

            <div className="main-cards">
                <div className="card">
                    <div className="card-inner">
                        <h3>Products</h3>
                        <BsFillArchiveFill className="icon" />
                    </div>
                    <h1>{productCount}</h1>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <h3>Orders</h3>
                        <BsFillArchiveFill className="icon" />
                    </div>
                    <h1>0</h1>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <h3>Customers</h3>
                        <BsPeopleFill className="icon" />
                    </div>
                    <h1>{customerCount}</h1>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <h3>Medicals</h3>
                        <BiCalendar className="icon" />
                    </div>
                    <h1>{medicalCount}</h1>
                </div>
            </div>

            <div className="charts">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={priceData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="old_price" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="new_price" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </main>
    );
}

export default Home;
