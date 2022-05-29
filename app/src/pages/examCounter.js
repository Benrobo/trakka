import React, { useState, useContext, useEffect } from 'react'
import { useRef } from 'react';
import { Layout, DomHead } from "../components";
import SideBar from '../components/Navbar/SideBar';
import DataContext from '../context/DataContext';
import moment from "moment"
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

function ExamCounter() {

    const { isAuthenticated } = useContext(DataContext)
    const [formactive, setFormActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [examsTime, setExamsTime] = useState([])
    const [error, setError] = useState("")
    const [inputs, setInputs] = useState({
        coursename: "",
        description: "",
        paperType: "",
        time: "",
        color: ""
    })

    let user = JSON.parse(localStorage.getItem("trakka-auth"))


    useEffect(() => {
        fetchExamsTimer()
    }, [examsTime.length, setExamsTime])

    if (!isAuthenticated) {
        return window.location = "/login"
    }

    function toggleForm() {
        setFormActive(!formactive)
    }

    function handleInput(e) {
        let name = e.target.name;
        let val = e.target.value;
        setInputs((prev) => ({ ...prev, [name]: val }))
    }

    function handleColor(e) {
        let val = e.target.value;
        let name = e.target.name;
        setInputs((prev) => ({ ...prev, [name]: val }))
    }

    async function fetchExamsTimer() {
        try {
            const url = "http://localhost:8080/api/v2/exams/timer/get"
            setLoading(true)
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({ userId: user?.id })
            })
            const result = await res.json()

            setLoading(false)

            if (result && result.error === true) {
                setError(result.message)
                return notif.error(result.message)
            }

            const examTime = result?.data;

            setError("")
            setExamsTime(examTime)
            console.log(examTime);
            // toggleActive()
            return
        } catch (err) {
            setLoading(false)
            setError(err.message)
            return notif.error(err.message)
        }
    }

    async function setExamCounter() {

        const { coursename, time, description, color, paperType } = inputs;

        if (coursename === "") {
            return notif.error("Course Name cant be empty")
        }

        if (time === "") {
            return notif.error("Exam datetime cant be empty")
        }

        if (paperType === "") {
            return notif.error("Exam paperType cant be empty")
        }

        if (description === "") {
            return notif.error("Description cant be empty")
        }

        let newColor = color === "" ? generateRandomColor() : color;

        try {
            const url = "http://localhost:8080/api/v2/exams/timer/add"
            setLoading(true)
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                },
                body: JSON.stringify({ userId: user?.id, coursename, time, description, paperType, color: newColor })
            })
            const result = await res.json()

            setLoading(false)

            if (result && result.error === true) {
                return notif.error(result.message)
            }

            const examTime = result?.data;

            notif.success(result.message)

            // setError("")
            setExamsTime(examTime)
            toggleForm()
            return
        } catch (err) {
            setLoading(false)
            return notif.error(err.message)
        }
    }

    async function deleteTimer(e) {

        let dataset = e.target.dataset;

        if (Object.entries(dataset)) {

            let { id } = dataset;

            try {
                const url = "http://localhost:8080/api/v2/exams/timer/delete"
                setLoading(true)
                const res = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json",
                        "Authorization": `Bearer ${user?.token}`
                    },
                    body: JSON.stringify({ userId: user?.id, timerId: id })
                })
                const result = await res.json()

                setLoading(false)

                if (result && result.error === true) {
                    return notif.error(result.message)
                }

                const examTime = result?.data;

                notif.success(result.message)

                // setError("")
                setExamsTime(examTime)
                // toggleActive()
                return
            } catch (err) {
                setLoading(false)
                return notif.error(err.message)
            }
        }
    }



    return (
        <Layout>
            <DomHead />
            <div className="relative  flex flex-row items-center justify-start w-screen h-screen">
                <SideBar active="exam-counter" />
                <div className="w-full h-screen overflow-y-auto p-2">

                    <div id="head" className="w-full h-auto p-3  flex flex-row items-center justify-start ">
                        <p className="text-white-100 font-extrabold">Examination Counter.</p>
                        <button className="rounded-md ml-5 px-4 py-2 bg-green-200 text-dark-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all " onClick={toggleForm}>
                            Create Counter
                        </button>
                    </div>


                    <TimerCont deleteTimer={deleteTimer} loading={loading} error={error} examsTime={examsTime} />


                    {/* counter form */}
                    {formactive && <CounterForm handleInput={handleInput} setExamCounter={setExamCounter} loading={loading} toggleForm={toggleForm} handleColor={handleColor} />}
                </div>
            </div>
        </Layout>
    )
}

export default ExamCounter

function TimerCont({ deleteTimer, error, loading, examsTime }) {


    return (
        <div className="w-full h-auto relative flex flex-wrap items-center justify-start">
            {
                loading ?
                    <h2 className="p-5">Loading..</h2>
                    :
                    error !== "" ?
                        <h2 className="p-5 text-red-400">{error}</h2>
                        :
                        examsTime.length === 0 ?
                            <div className="w-screen h-[400px] flex flex-col items-center justify-center">
                                <p className="p-2 text-white-100 text-[20px] ">
                                    😬 Opps, You dont have any <span className="text-green-200">Exam Pappers Scheduled</span>.
                                </p>
                            </div>
                            :
                            examsTime.map((data, i) => {
                                return (
                                    <div key={data.id} data-id={data.id} className="w-[300px] mr-4 mt-4 relative h-[350px] overflow-hidden rounded-[15px] flex flex-col items-start justify-start bg-dark-200 shadow-xl transition-all scale-[.95] ">
                                        <div id="" className="w-full h-[50px] relative top-0 left-0 flex flex-row items-start justify-between p-3 bg-dark-300 text-center text-white-200">
                                            {data.description}
                                            <button className="px-3 py-1 bg-red-500 text-[12px] text-dark-100 font-extrabold rounded-md scale-[.85] " data-id={data.id} onClick={deleteTimer}>
                                                Delete
                                            </button>
                                        </div>
                                        <div className="w-full h-[300px] relative top-0 left-0 flex flex-col items-start justify-start">
                                            <div className="w-full h-[250px] flex flex-col items-center justify-center">
                                                <p className={`text-[40px] font-extrabold`} style={{ color: data.color }} >{data.coursename}</p>
                                                <span className="text-white-100 font-bold">{data.paperType}</span>
                                            </div>
                                            <br />
                                            <div className="w-full h-[200px] bg-dark-400 flex flex-col items-center justify-center gap-2">
                                                <div className="w-full">
                                                    <Counter datetime={data.time} color={data.color} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
            }
            <div className="w-full h-[100px]"></div>
        </div>
    )
}


function CounterForm({ toggleForm, loading, handleInput, handleColor, setExamCounter }) {

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
                <input type="text" name="coursename" placeholder='Course Name' className="w-full h-auto p-2 rounded-md bg-dark-100" onChange={handleInput} maxLength={300} />
                <br />
                <input type="text" name="paperType" placeholder='Paper 1' className="w-full h-auto p-2 rounded-md bg-dark-100 mt-2" onChange={handleInput} maxLength={300} />
                <br />
                <input type="text" name="description" placeholder='Short Description' className="w-full h-auto p-2 rounded-md bg-dark-100 mt-2" onChange={handleInput} maxLength={100} />
                <br />
                <br />
                <div className="w-full flex flex-row items-center justify-between gap-2">
                    <div className="flex flex-col items-start justify-start">
                        <p className='text-white-300'>Schedule Counter</p>
                        <input type="datetime-local" name="time" onChange={handleInput} className="w-full p-2 bg-dark-100 mt-2" />
                    </div>
                    <div className="flex flex-col items-start justify-start">
                        <p className='text-white-300'>Color</p>
                        <input type="color" name="color" onChange={handleColor} className="w-full p-1 bg-dark-100 mt-2" />
                    </div>
                </div>
                <br />
                <div className="w-full flex flex-row items-end align-start justify-end
                ">
                    <button className="rounded-md ml-5 px-4 py-2 bg-dark-100 text-white-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all" onClick={toggleForm}>
                        Cancel
                    </button>
                    <button className="rounded-md ml-5 px-4 py-2 bg-green-200 text-dark-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all " onClick={setExamCounter}>
                        {loading ? "Saving.." : "Save Counter"}
                    </button>
                </div>
            </div>
        </div>
    )
}

function Counter({ datetime, color }) {

    let countDownDate = new Date(datetime).getTime();
    const [expired, setExpired] = useState(false)

    // Update the count down every 1 second
    let dayTimer = useRef()
    let hourTimer = useRef()
    let minTimer = useRef()
    let secTimer = useRef()
    let expiredTimer = useRef()

    useEffect(() => {
        let x = setInterval(function () {

            // Get today's date and time
            let now = new Date().getTime();

            // Find the distance between now and the count down date
            let distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (dayTimer.current !== null && hourTimer.current !== null && minTimer.current !== null && secTimer.current !== null && expiredTimer.current !== null) {
                // Display the result in the element with id="demo"
                dayTimer.current.innerHTML = `${days}`
                hourTimer.current.innerHTML = `${hours}`
                minTimer.current.innerHTML = `${minutes}`
                secTimer.current.innerHTML = `${seconds}`

                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(x);
                    setExpired(true)
                    expiredTimer.current.innerHTML = "EXPIRED";
                }
            }
        }, 1000);
    }, [])

    return (
        <>
            {
                expired ?
                    <p className="text-red-400 text-center w-full font-extrabold text-[25px]  " ref={expiredTimer}></p>
                    :
                    <>
                        <div className="w-full flex flex-row items-center justify-center">
                            <span className="font-extrabold flex flex-col items-center justify-center text-[20px] m-2">
                                <span className={`  `} style={{ color }} ref={dayTimer} ></span>
                                <span className="text-white-300 font-light text-[15px]">day</span>
                            </span>
                            <span className="font-extrabold flex flex-col items-center justify-center text-[20px] m-2">
                                <span className={`  `} style={{ color }} ref={hourTimer} ></span>
                                <span className="text-white-300 font-light text-[15px]">hr</span>
                            </span>
                            <span className="font-extrabold flex flex-col items-center justify-center text-[20px] m-2">
                                <span className={`  `} style={{ color }} ref={minTimer} ></span>
                                <span className="text-white-300 font-light text-[15px]">min</span>
                            </span>
                            <span className="font-extrabold flex flex-col items-center justify-center text-[20px] m-2">
                                <span className={`  `} style={{ color }} ref={secTimer} ></span>
                                <span className="text-white-300 font-light text-[15px]">sec</span>
                            </span>
                        </div>
                        <div className="w-full text-white-300 flex items-center justify-center fle-col">
                            Untill {moment(datetime).format('MMMM Do YYYY, h:mm:ss a')}
                        </div>
                        <br />
                    </>
            }
        </>
    )

}