import React, { useState, useContext, useEffect } from 'react'
import { useRef } from 'react';
import { Layout, DomHead } from "../components";
import SideBar from '../components/Navbar/SideBar';
import DataContext from '../context/DataContext';

function ExamCounter() {

    const { isAuthenticated } = useContext(DataContext)


    if (!isAuthenticated) {
        return window.location = "/login"
    }

    return (
        <Layout>
            <DomHead />
            <div className="relative  flex flex-row items-center justify-start w-screen h-screen">
                <SideBar active="exam-counter" />
                <div className="w-full h-screen overflow-y-auto p-2">

                    <div id="head" className="w-full h-auto p-3  flex flex-row items-center justify-start ">
                        <p className="text-white-100 font-extrabold">Examination Counter.</p>
                        <button className="rounded-md ml-5 px-4 py-2 bg-green-200 text-dark-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all " onClick={"toggleActive"}>
                            Create Counter
                        </button>
                    </div>


                    <TimerCont />


                    {/* counter form */}
                    <CounterForm />
                </div>
            </div>
        </Layout>
    )
}

export default ExamCounter

function TimerCont() {


    const dumnmy = [
        {
            id: "1",
            date: "May 28, 2022 19:00:00"
        },
        {
            id: "2",
            date: "June 28, 2022 19:00:00"
        }
    ]

    return (
        <div className="w-full h-auto relative flex flex-wrap items-center justify-start">
            {
                dumnmy.map((data, i) => {
                    return (
                        <div key={data.id} data-id={"sdc"} onClick={"openCollectionTasks"} className="w-[300px] mr-4 mt-4 relative h-[350px] overflow-hidden rounded-[15px] flex flex-col items-start justify-start bg-dark-200 shadow-xl cursor-pointer transition-all scale-[.95] ">
                            <div id="" className="w-full h-[50px] relative top-0 left-0 flex flex-row items-center justify-center p-3 bg-dark-300 text-center text-white-200">
                                short description
                            </div>
                            <div className="w-full h-[300px] relative top-0 left-0 flex flex-col items-start justify-start">
                                <div className="w-full h-[250px] flex flex-col items-center justify-center">
                                    <p className="text-green-200 text-[40px] font-extrabold">English</p>
                                    <span className="text-white-100 font-bold">Paper 1</span>
                                </div>
                                <br />
                                <div className="w-full h-[200px] bg-dark-400 flex flex-col items-center justify-center gap-2">
                                    <div className="w-full">
                                        <Counter datetime={data.date} />
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


function CounterForm() {

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
                <input type="text" name="title" placeholder='Course Name' className="w-full h-auto p-2 rounded-md bg-dark-100" onChange={"handleTasksAInput"} maxLength={300} />
                <br />
                <input type="text" name="paperType" placeholder='Paper 1' className="w-full h-auto p-2 rounded-md bg-dark-100 mt-2" onChange={"handleTasksAInput"} maxLength={300} />
                <br />
                <input type="text" name="description" placeholder='Short Description' className="w-full h-auto p-2 rounded-md bg-dark-100 mt-2" onChange={"handleTasksAInput"} maxLength={100} />
                <br />
                <br />
                <div className="w-full flex flex-row items-center justify-between gap-2">
                    <div className="flex flex-col items-start justify-start">
                        <p className='text-white-300'>Schedule Counter</p>
                        <input type="datetime-local" className="w-full p-2 bg-dark-100 mt-2" />
                    </div>
                    <div className="flex flex-col items-start justify-start">
                        <p className='text-white-300'>Color</p>
                        <input type="color" className="w-full p-1 bg-dark-100 mt-2" />
                    </div>
                </div>
                <br />
                <div className="w-full flex flex-row items-end align-start justify-end
                ">
                    <button className="rounded-md ml-5 px-4 py-2 bg-dark-100 text-white-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all" onClick={"toggleTasksForm"}>
                        Cancel
                    </button>
                    <button className="rounded-md ml-5 px-4 py-2 bg-green-200 text-dark-100 font-extrabold scale-[.90] hover:scale-[.95] transition-all " onClick={"addTasks"}>
                        {/* {loading ? "Saving Tasks.." : "Save Task"} */}
                        Save Counter
                    </button>
                </div>
            </div>
        </div>
    )
}

function Counter({ datetime }) {

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
        }, 1000);
    }, [])

    return (
        <>
            {
                expired ?
                    <p className="text-red-400 font-extrabold text-[25px]  " ref={expiredTimer}></p>
                    :
                    <>
                        <div className="w-full flex flex-row items-center justify-center">
                            <span className="font-extrabold flex flex-col items-center justify-center text-[20px] m-2">
                                <span className="text-green-200" ref={dayTimer} ></span>
                                <span className="text-white-300 font-light text-[15px]">day</span>
                            </span>
                            <span className="font-extrabold flex flex-col items-center justify-center text-[20px] m-2">
                                <span className="text-green-200" ref={hourTimer} ></span>
                                <span className="text-white-300 font-light text-[15px]">hr</span>
                            </span>
                            <span className="font-extrabold flex flex-col items-center justify-center text-[20px] m-2">
                                <span className="text-green-200" ref={minTimer} ></span>
                                <span className="text-white-300 font-light text-[15px]">min</span>
                            </span>
                            <span className="font-extrabold flex flex-col items-center justify-center text-[20px] m-2">
                                <span className="text-green-200" ref={secTimer} ></span>
                                <span className="text-white-300 font-light text-[15px]">sec</span>
                            </span>
                        </div>
                        <div className="w-full text-white-200 flex items-center justify-center fle-col">
                            Untill this
                        </div>
                    </>
            }
        </>
    )

}