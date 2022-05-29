import React, { useState, useContext, useEffect } from 'react'
import { Layout, DomHead, NavBar } from "../components";
import SideBar from '../components/Navbar/SideBar';
import DataContext from '../context/DataContext';
import { Notification } from '../helpers';
// import { useAuth0 } from '@auth0/auth0-react';

const notif = new Notification(4000)


function generateRandomColor() {
    let color = ""
    for (let i = 0; i < 266; i++) {
        let r = Math.floor(Math.random() * 255)
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        color = `rgb(${r}, ${g}, ${b})`
    }
    return color;
}

function Dashboard() {
    const { isAuthenticated } = useContext(DataContext)
    const [active, setActive] = useState(false)
    const [collectiontasks, setCollectionTasks] = useState(false)
    const [collectionId, setCollectionId] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [collectionState, setCollState] = useState(false)
    const [tasksInputs, setCollectionInput] = useState({
        title: "",
        color: ""
    })

    let user = JSON.parse(localStorage.getItem("trakka-auth"))

    useEffect(() => {

    }, [])

    if (!isAuthenticated) {
        return window.location = "/login"
    }

    function toggleActive() {
        setActive(!active)
    }

    function toggleCollectionTasks() {
        setCollectionTasks(!collectiontasks)
    }

    function handleTasksAInput(e) {
        let name = e.target.name;
        let val = e.target.value;
        setCollectionInput((prev) => ({ ...prev, [name]: val }))
    }


    function handleColor(e) {
        let val = e.target.value;
        let name = e.target.name;
        setCollectionInput((prev) => ({ ...prev, [name]: val }))
    }

    async function createCollection() {

        const { title, color } = tasksInputs;

        if (title === "") {
            return notif.error("title cant be empty")
        }

        let newColor = color === "" ? generateRandomColor() : color;

        try {
            const url = "http://localhost:8080/api/v2/collection/create"
            setLoading(true)
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({ userId: user?.id, title, color: newColor })
            })
            const result = await res.json()

            setLoading(false)

            if (result && result.error === true) {
                setError(result.message)
                return notif.error(result.message)
            }

            const collection = result?.data;

            notif.success(result.message)

            setError("")
            setCollState(!collectionState)
            toggleActive()
            return
        } catch (err) {
            setLoading(false)
            setError("")
            return notif.error(err.message)
        }
    }

    return (
        <Layout>
            <div className="relative  flex flex-row items-start justify-start w-screen h-screen">
                <SideBar active="tasks" />
                <div className="w-full h-screen overflow-y-auto p-2">
                    {!collectiontasks && <div id="head" className="w-full h-auto p-3  flex flex-row items-center justify-start ">
                        <p className="text-white-100 font-extrabold">Trakka Collections.</p>
                        <button className="rounded-md ml-5 px-4 py-2 bg-green-200 text-dark-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all " onClick={toggleActive}>
                            Create Collection
                        </button>
                    </div>}
                    <br />
                    {collectiontasks !== true && <Collections setCollectionId={setCollectionId} openCollTasks={toggleCollectionTasks} collectionState={collectionState} setCollState={setCollState} />}

                    {collectiontasks && <CollectionTasks toggleCollectionTasks={toggleCollectionTasks} collectionId={collectionId} />}

                    {active && <AddCollectionForm createCollection={createCollection} loading={loading} handleColor={handleColor} handleTasksAInput={handleTasksAInput} toggleActive={toggleActive} />}
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard

function Collections({ setCollectionId, setCollState, collectionState, openCollTasks }) {
    // const { user } = useContext(DataContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [collections, setCollections] = useState([])

    function openCollectionTasks(e) {
        let dataset = e.target.dataset;

        if (Object.entries(dataset).length > 0) {
            const { id } = dataset;
            if (id !== undefined) {
                setCollectionId(id)
                openCollTasks()
            }
        }
    }

    async function fetchCollections() {
        const user = JSON.parse(localStorage.getItem("trakka-auth"))
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

    useEffect(() => {
        fetchCollections()
    }, [setCollState, collectionState])

    return (
        <div className="w-full h-auto relative flex flex-wrap items-center justify-start">
            {
                loading ?
                    <h2 className="p-5">Loading..</h2>
                    :
                    error !== "" ?
                        <h2 className="p-5 text-red-400">{error}</h2>
                        :
                        collections.length === 0 ?
                            <div className="w-screen h-[400px] flex flex-col items-center justify-center">
                                <p className="p-2 text-white-100 text-[20px] ">
                                    😬 Opps, You dont have any <span className="text-green-200">collection</span> or <span className="text-green-200">tasks</span> either.
                                </p>
                            </div>
                            :
                            collections.map((list, i) => {
                                return (
                                    <div key={i} data-id={list.id} onClick={openCollectionTasks} className="w-auto w-[300px] mr-4 mt-4 h-auto p-6 rounded-[15px] flex flex-col items-start justify-start bg-dark-200 shadow-xl cursor-pointer transition-all scale-[.90] hover:scale-[.95] ">
                                        <div id="" className="w-full flex flex-row items-center justify-start">
                                            <span className={`p-4 rounded-md`} style={{
                                                background: list.color
                                            }} ></span>
                                        </div>
                                        <br />
                                        <br />
                                        <div className="w-full flex flex-col items-start justify-start">
                                            <p className="text-white-100 text-[20px] font-extrabold">{list.title}</p>
                                            <br />
                                            <span className="text-white-200 text-[12px] font-bold ">
                                                {list.createdAt}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
            }
            {collections.length > 6 && <div className="w-full h-[100px]"></div>}
        </div>
    )
}

function CollectionTasks({ collectionId, toggleCollectionTasks }) {

    const [tasksformactive, setTasksFormActive] = useState(false)
    const [activeName, setActiveName] = useState("all")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [tasks, setTasks] = useState([])
    const [tempTasks, setTempTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])
    const [tasksInputs, setTasksInput] = useState({
        title: "",
        description: ""
    })

    const toggleTasksForm = () => setTasksFormActive(!tasksformactive)

    let user = JSON.parse(localStorage.getItem("trakka-auth"))

    async function fetchCollectionTasks() {
        const user = JSON.parse(localStorage.getItem("trakka-auth"))
        if (user.id !== undefined) {

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
                const completeTasks = tasks.filter((tasks) => tasks.completed)

                setError("")
                setTasks(tasks)
                setTempTasks(tasks)
                setCompletedTasks(completeTasks)
                return
            } catch (err) {
                setLoading(false)
                setError("")
                return notif.error(err.message)
            }

        }
    }

    async function handleIsCompleted(e) {
        const dataset = e.target.dataset;

        if (Object.entries(dataset).length > 0) {
            const checked = e.target.checked;
            const check = window.confirm("Are you done with this task?")

            if (check) {
                const { id } = dataset;
                try {
                    const url = "http://localhost:8080/api/v2/tasks/completeTask"
                    setLoading(true)
                    const res = await fetch(url, {
                        method: "PUT",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${user?.token}`
                        },
                        body: JSON.stringify({ userId: user.id, collectionId, taskId: id, completed: checked })
                    })
                    const result = await res.json()

                    setLoading(false)

                    if (result && result.error === true) {
                        setError(result.message)
                        return notif.error(result.message)
                    }

                    const tasks = result?.data;

                    setError("")
                    setTasks(tasks)
                    setTempTasks(tasks)
                    return
                } catch (err) {
                    setLoading(false)
                    setError("")
                    return notif.error(err.message)
                }
            }
        }

    }

    function getCompletedTasks(e) {

        let name = e.target.dataset;
        const all = tempTasks;
        const completed = all.filter((tasks) => tasks.completed === true)

        if (Object.entries(name).length > 0) {
            let { name } = e.target.dataset;

            if (name === "all") {
                setActiveName("all")
                return setTasks(all)
            }
            if (name === "completed") {
                setActiveName("completed")
                console.log(completed);
                setTasks(completed)
            }
        }

    }

    useEffect(() => {
        fetchCollectionTasks()
    }, [setTasks])

    function handleTasksAInput(e) {
        let name = e.target.name;
        let val = e.target.value;
        setTasksInput((prev) => ({ ...prev, [name]: val }))
    }

    async function addTasks() {

        const { title, description } = tasksInputs;

        if (title === "") {
            return notif.error("title cant be empty")
        }
        if (description === "") {
            return notif.error("description cant be empty")
        }

        try {
            const url = "http://localhost:8080/api/v2/tasks/addTasks"
            setLoading(true)
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({ userId: user?.id, collectionId, title, description })
            })
            const result = await res.json()

            setLoading(false)

            if (result && result.error === true) {
                setError(result.message)
                return notif.error(result.message)
            }

            const tasks = result?.data;

            notif.success(result.message)

            setError("")
            setTasks(tasks)
            setTempTasks(tasks)

            toggleTasksForm()
            return
        } catch (err) {
            setLoading(false)
            setError("")
            return notif.error(err.message)
        }
    }

    return (
        <>
            <div className="w-full h-screen relative">
                <div id="head" className="w-full h-auto px-3 relative flex flex-row items-center justify-start ">
                    <button className="rounded-md ml-5 px-4 py-2 text-[12px] bg-dark-200 text-white-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all " onClick={toggleCollectionTasks}>
                        Back
                    </button>
                    <p className="text-white-100 ml-5">Collection Name.</p>

                    {/* more */}
                    <button className="absolute right-5 top-[-10px] text-[12px] rounded-md ml-5 px-4 py-2 bg-dark-200 text-white-200 font-extrabold scale-[.90] hover:scale-[.95] transition-all " onClick={toggleCollectionTasks}>
                        more
                    </button>
                </div>
                <br />
                <button className="rounded-md ml-8 px-4 py-2 bg-green-200 text-dark-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all" onClick={toggleTasksForm}>
                    Add Tasks
                </button>
                <br />
                <br />
                <div className="w-full h-auto relative px-4 ml-5 ">
                    <div id="head" className="w-full h-auto flex flex-row items-center justify-start">
                        <span className={`${activeName === "all" ? "text-white-100 bg-dark-200" : "text-white-200 bg-dark-300"} mr-4 px-4 py-2 rounded-md font-extrabold text-[12px] cursor-pointer scale-[.90] transition-all hover:scale-[.95]`} data-name="all" onClick={getCompletedTasks}>All {tempTasks.length}</span>

                        <span className={`${activeName === "completed" ? "text-white-100 bg-dark-200" : "text-white-200 bg-dark-300"} mr-4 px-4 py-2 rounded-md font-extrabold text-[12px] cursor-pointer scale-[.90] transition-all hover:scale-[.95]`} data-name="completed" onClick={getCompletedTasks}>Completed {tempTasks.length > 0 ? tempTasks.filter((tasks) => tasks.completed).length : 0}</span>
                    </div>
                    <br />
                    <br />
                    <div className="w-full h-auto flex flex-wrap items-start justify-between ">
                        {
                            loading ?
                                <h2 className="p-5">Loading..</h2>
                                :
                                error !== "" ?
                                    <h2 className="p-5 text-red-400">{error}</h2>
                                    :
                                    tasks.length === 0 ?
                                        <div className="w-screen h-[400px] flex flex-col items-center justify-center">
                                            <p className="p-2 text-white-100 text-[20px] ">
                                                😬 Opps, You dont have any <span className="text-green-200">tasks</span> either.
                                            </p>
                                        </div>
                                        :
                                        tasks.map((list, i) => {
                                            return (
                                                <div key={i} className={`w-[350px] h-auto py-4 px-4 mr-4 mt-2 flex flex-row items-start justify-between border-l-4 border-l-solid ${list.completed ? "border-green-200" : "border-orange-300"}  bg-dark-300 `}>
                                                    <div id="left" className={`w-auto flex flex-col items-start justify-start`}>
                                                        <h2 className={`text-white-100 ${list.completed ? "line-through" : ""} `}>{list.title}</h2>
                                                        <small className={`text-white-300 ${list.completed ? "line-through" : ""} `}>{list.description}</small>
                                                    </div>
                                                    <div id="right" className="">
                                                        <input type="checkbox" data-id={list.id} className='p-4 bg-green-200 checked:bg-green-200' checked={list.completed} onClick={handleIsCompleted} />
                                                    </div>
                                                </div>
                                            )
                                        })
                        }
                    </div>
                </div>

            </div>
            {tasksformactive && <AddTasksForm addTasks={addTasks} handleTasksAInput={handleTasksAInput} loading={loading} toggleTasksForm={toggleTasksForm} />}
        </>
    )
}

function AddTasksForm({ toggleTasksForm, addTasks, loading, handleTasksAInput }) {

    return (
        <div className="w-screen h-screen absolute top-0 left-0 flex flex-col items-center justify-center bg-dark-400 ">
            <div className="w-[350px] h-auto p-5 rounded-md bg-dark-200 ">
                <div id="head" className="w-full flex flex-row items-center justify-start">
                    <h1 className=" text-white-100  ">Add Tasks</h1>
                </div>
                <br />
                {/* <div className="color w-full flex flex-row items-center justify-start">
                    <span className='mr-4'>color</span> <input type="color" name="" id="" />
                </div> */}
                <br />
                <input type="text" name="title" placeholder='Tasks Title' className="w-full h-auto p-2 rounded-md bg-dark-100" onChange={handleTasksAInput} maxLength={300} />
                <br />
                <br />
                <input type="text" name="description" placeholder='Short Description' className="w-full h-auto p-2 rounded-md bg-dark-100" onChange={handleTasksAInput} maxLength={300} />
                <br />
                <br />
                <div className="w-full flex flex-row items-end align-start justify-end
                ">
                    <button className="rounded-md ml-5 px-4 py-2 bg-dark-100 text-white-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all" onClick={toggleTasksForm}>
                        Cancel
                    </button>
                    <button className="rounded-md ml-5 px-4 py-2 bg-green-200 text-dark-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all " onClick={addTasks}>
                        {loading ? "Saving Tasks.." : "Save Task"}
                    </button>
                </div>
            </div>
        </div>
    )
}

function AddCollectionForm({ toggleActive, handleColor, handleTasksAInput, createCollection, loading }) {

    return (
        <div className="w-screen h-screen absolute top-0 left-0 flex flex-col items-center justify-center bg-dark-400 ">
            <div className="w-[350px] h-auto p-5 rounded-md bg-dark-200 ">
                <div id="head" className="w-full flex flex-row items-center justify-start">
                    <h1 className=" text-white-100  ">Create New Collection</h1>
                </div>
                <br />
                <div className="color w-full flex flex-row items-center justify-start">
                    <span className='mr-4'>color</span> <input type="color" name="color" onChange={handleColor} id="" />
                </div>
                <br />
                <input type="text" placeholder='Collection Name' name="title" className="w-full h-auto p-2 rounded-md bg-dark-100" onChange={handleTasksAInput} />
                <br />
                <br />
                <div className="w-full flex flex-row items-end align-start justify-end
                ">
                    <button className="rounded-md ml-5 px-4 py-2 bg-dark-100 text-white-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all" onClick={toggleActive}>
                        Cancel
                    </button>
                    <button className="rounded-md ml-5 px-4 py-2 bg-green-200 text-dark-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all " onClick={createCollection}>
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    )
}
