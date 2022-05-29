import React, { useState, useContext, useEffect } from 'react'
import { Layout, DomHead, NavBar } from "../components";
import SideBar from '../components/Navbar/SideBar';
import DataContext from '../context/DataContext';
import { Notification } from '../helpers';
import moment from "moment"
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJs } from "chart.js/auto"

const notif = new Notification(4000)

function Statistics() {
    const { isAuthenticated } = useContext(DataContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [collections, setCollections] = useState([])
    const [tasks, setTasks] = useState({})

    let user = JSON.parse(localStorage.getItem("trakka-auth"))


    useEffect(() => {
        fetchCollections()
    }, [])

    if (!isAuthenticated) {
        return window.location = "/login"
    }

    async function fetchCollections() {
        if (user.id !== undefined) {

            try {
                const url = "http://localhost:8080/api/v2/collection/get"
                setLoading(true)
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({ userId: user.id })
                })
                const result = await res.json()

                setLoading(false)

                if (result && result.error === true) {
                    setError(result.message)
                    return notif.error(result.message)
                }

                const collections = result?.data.collections;

                setError("")
                setCollections(collections)
                return
            } catch (err) {
                setLoading(false)
                setError("")
                return notif.error(err.message)
            }

        }
    }

    async function handleFilteredTasks(e) {

        let collectionId = e.target.value;
        if (collectionId !== "") {
            try {
                const url = "http://localhost:8080/api/v2/tasks/getTasks"
                setLoading(true)
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({ userId: user.id, collectionId })
                })
                const result = await res.json()

                setLoading(false)

                if (result && result.error === true) {
                    setError(result.message)
                    return notif.error(result.message)
                }

                const tasks = result?.data;
                const completedTasks = tasks.filter((tasks) => tasks.completed)
                const inCompleteTasks = tasks.filter((tasks) => !tasks.completed)

                console.log(completedTasks, inCompleteTasks);

                setError("")
                setTasks({ completedTasks, inCompleteTasks })
                return
            } catch (err) {
                setLoading(false)
                setError("")
                return notif.error(err.message)
            }
        }
    }


    return (
        <Layout>
            <div className="relative  flex flex-row items-start justify-start w-screen h-screen">
                <SideBar active="stats" />
                <div className="w-full h-screen overflow-y-auto p-2">
                    <div id="head" className="w-full h-auto p-3  flex flex-row items-center justify-start">
                        <p className="text-white-100 font-extrabold text-[20px] capitalize ">
                            <b><span className="text-green-200 mr-2">{user?.name}</span> Statistics </b>
                        </p>
                    </div>

                    <div className="w-full  h-auto flex flex-row items-center justify-start ">
                        <p className="text-white-200">View your ToDo statistics</p>
                        <select onChange={handleFilteredTasks} className="p-2 ml-2 text-white-100 rounded-md bg-dark-200">
                            <option value="">-- Select Your Collection --</option>
                            {
                                loading ?
                                    <option value="">Loading..</option>
                                    :
                                    error !== "" ?
                                        <option value="">{error}</option>
                                        :
                                        collections.length === 0 ?
                                            <option value="" >No collections available</option>
                                            :
                                            collections.map((list) => {
                                                return (
                                                    <option value={list.id} key={list.id} className="capitalize">{list.title}</option>
                                                )
                                            })
                            }
                        </select>
                    </div>
                    <br />
                    {loading ? "Loading" : Object.entries(tasks).length > 0 && <ChartCont tasksData={tasks} />}

                </div>
            </div>
        </Layout>
    )
}

export default Statistics


export function ChartCont({ tasksData = {} }) {

    const [data, setData] = useState({
        labels: [`Incompleted Tasks ${tasksData?.inCompleteTasks.length}`, `Completed Tasks ${tasksData?.completedTasks.length}`],
        datasets: [
            {
                id: 1,
                label: 'incompleted',
                data: [tasksData?.inCompleteTasks.length, tasksData?.completedTasks.length],
                backgroundColor: ["#4898f0", "#64f4ac"],
                borderWidth: 0
            }

        ]
    })

    const chartOptions = {
        responsive: true,
    }


    useEffect(() => {

    }, [])

    return (
        <div className='w-[400px] mb-10 mt-2 '>
            <Doughnut width={50} data={data} />
            <br />
            <br />
        </div>
    )
}