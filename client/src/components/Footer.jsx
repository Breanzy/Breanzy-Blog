import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
    BsFacebook,
    BsInstagram,
    BsTwitter,
    BsGithub,
    BsLinkedin,
} from "react-icons/bs";

export default function FooterCom() {
    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-col-1">
                    <div className="mt-5">
                        <Link
                            to="/"
                            className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
                        >
                            <span className="px-2 py-1 bg-gradient-to-r from-blue-600 via-purple-500 to-orange-400 rounded-lg text-white">
                                test
                            </span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://facebook.com"
                                    //target makes it so that when you click the link, you automatically open a different window
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Facebook ahahakuygftasdf
                                </Footer.Link>
                                <Footer.Link
                                    href="/about"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Aboutttt
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title="Follow Us" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://github.com/Breanzy"
                                    //target makes it so that when you click the link, you automatically open a different window
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link
                                    href="https://www.facebook.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Portfolio
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>

                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">
                                    Terms & Conditions
                                </Footer.Link>
                                <Footer.Link href="#">
                                    Privacy Policy
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright
                        href="#"
                        by="Breanzy's Blog"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon
                            href="https://www.facebook.com/Breanzyy"
                            icon={BsFacebook}
                        />
                        <Footer.Icon
                            href="https://www.instagram.com/breanzy/"
                            icon={BsInstagram}
                        />
                        <Footer.Icon
                            href="https://x.com/Breanzyy"
                            icon={BsTwitter}
                        />
                        <Footer.Icon
                            href="https://github.com/Breanzy"
                            icon={BsGithub}
                        />
                        <Footer.Icon
                            href="https://www.linkedin.com/in/juliuscarbonilla/"
                            icon={BsLinkedin}
                        />
                    </div>
                </div>
            </div>
        </Footer>
    );
}
