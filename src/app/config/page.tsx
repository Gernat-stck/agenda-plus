import type { Metadata } from "next"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"

export const metadata: Metadata = {
    title: "Profile",
    description: "Customize your profile",
}

export default function ProfilePage() {
    return (
        <div className="h-screen flex">
            <div className="flex w-1/2 justify-center mx-auto items-center bg-white">
                <form className="bg-white w-3/4">
                    <h1 className="text-gray-800 font-bold text-2xl mb-1">Your Profile</h1>
                    <p className="text-sm font-normal text-gray-600 mb-7">Update your personal information</p>

                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        <Input className="pl-2 outline-none border-none" type="text" placeholder="Full Name" />
                    </div>

                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                        </svg>
                        <Input className="pl-2 outline-none border-none" type="email" placeholder="Email Address" />
                    </div>

                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                        </svg>
                        <Input className="pl-2 outline-none border-none" type="tel" placeholder="Phone Number" />
                    </div>

                    <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <Input className="pl-2 outline-none border-none" type="text" placeholder="Business Name" />
                    </div>

                    <div className="border-2 py-2 px-3 rounded-2xl mb-4">
                        <Textarea
                            className="outline-none border-none resize-none"
                            placeholder="Bio - Tell us about yourself or your business"
                            rows={4}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
                    >
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    )
}

