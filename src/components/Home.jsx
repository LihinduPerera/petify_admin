import React from "react";
import { BiCalendar } from "react-icons/bi";
import { BsFillArchiveFill, BsPeopleFill } from "react-icons/bs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Home() {

    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];      

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
                    <h1>300</h1>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <h3>Orders</h3>
                        <BsFillArchiveFill className="icon" />
                    </div>
                    <h1>10</h1>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <h3>Customers</h3>
                        <BsPeopleFill className="icon" />
                    </div>
                    <h1>33</h1>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <h3>Medications</h3>
                        <BiCalendar className="icon" />
                    </div>
                    <h1>10</h1>
                </div>
            </div>

            <div className="charts">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
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
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </main>
    );
}

export default Home;
