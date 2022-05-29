import React from 'react'
import { Layout, DomHead } from "../components";
import SideBar from '../components/Navbar/SideBar';

function ExamCounter() {
    return (
        <Layout>
            <DomHead />
            <div className="relative  flex flex-row items-center justify-start w-screen h-screen">
                <SideBar active="exam-counter" />
                <div className="w-full h-screen overflow-y-auto p-2">
                    <h1>Exam</h1>
                </div>
            </div>
        </Layout>
    )
}

export default ExamCounter